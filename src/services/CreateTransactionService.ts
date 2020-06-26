import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: string;
  category: Category;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    if (!(type === 'income' || type === 'outcome')) {
      throw new AppError('Invalid transaction type');
    }

    const transactionsRepository = getCustomRepository(TransactionRepository);

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      const balanceWillBePositive = balance.total > value;
      if (!balanceWillBePositive) {
        throw new AppError('The value of outcome is bigger than the balance');
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
