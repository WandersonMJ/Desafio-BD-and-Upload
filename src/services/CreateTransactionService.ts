import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);
    const TransactionRepositoryCustom = getCustomRepository(
      TransactionRepository,
    );

    const balance = await TransactionRepositoryCustom.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('this transaction exceed your limit.');
    }

    let findSameTypeOfCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!findSameTypeOfCategory) {
      findSameTypeOfCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(findSameTypeOfCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: findSameTypeOfCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
