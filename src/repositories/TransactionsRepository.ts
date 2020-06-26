import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (previousValue, transaction) => {
        const currentBalance = previousValue;

        if (transaction.type === 'income') {
          currentBalance.income += Number(transaction.value);
        }
        if (transaction.type === 'outcome') {
          currentBalance.outcome += Number(transaction.value);
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
