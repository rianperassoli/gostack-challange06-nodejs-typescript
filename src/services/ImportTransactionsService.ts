import fs from 'fs';
import csvParse from 'csv-parse';
import { getRepository, In } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  filePath: string;
}

interface TransactionImported {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ filePath }: RequestDTO): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getRepository(Transaction);

    const transactionsReadStream = fs.createReadStream(filePath);

    const parser = csvParse({ from_line: 2 });

    const parsedCSV = transactionsReadStream.pipe(parser);

    const transactions: TransactionImported[] = [];
    const categories: string[] = [];

    parsedCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) {
        return;
      }

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parsedCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const listCategories = [...existentCategories, newCategories] as Category[];

    const newTransactions: Transaction[] = [];

    transactions.map(currentTransaction => {
      const {
        title,
        type,
        value,
        category: categoryTitle,
      } = currentTransaction;

      const category = listCategories.find(cat => cat.title === categoryTitle);

      return newTransactions.push(
        transactionsRepository.create({
          title,
          type,
          value,
          category,
        }),
      );
    });

    await transactionsRepository.save(newTransactions);

    await fs.promises.unlink(filePath);

    return newTransactions;
  }
}

export default ImportTransactionsService;
