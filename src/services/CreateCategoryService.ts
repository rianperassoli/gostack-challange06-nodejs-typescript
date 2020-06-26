import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
}

class CreateTransactionService {
  public async execute({ title }: RequestDTO): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const categoryExists = await categoriesRepository.findOne({
      where: { title },
    });

    if (categoryExists) {
      return categoryExists;
    }

    const category = categoriesRepository.create({
      title,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateTransactionService;
