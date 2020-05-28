import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const verifyifexists = await transactionsRepository.findOne({
      where: { id },
    });

    if (!verifyifexists) {
      throw new AppError('Already been deleted!');
    }

    await transactionsRepository.remove(verifyifexists);
  }
}

export default DeleteTransactionService;
