import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const balance = transactions.reduce(
      (previousValue: Balance, transaction: Transaction) => {
        const currentBalance = previousValue;

        if (transaction.type === 'income') {
          currentBalance.income += transaction.value;
        }
        if (transaction.type === 'outcome') {
          currentBalance.outcome += transaction.value;
        }
        currentBalance.total = currentBalance.income - currentBalance.outcome;

        return currentBalance;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }
}

export default TransactionsRepository;
