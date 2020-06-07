import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({ email });

    if (checkUserExists) {
      throw new AppError('Email address is already used');
    }

    const password_hash = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password_hash,
    });

    await userRepository.save(user);

    delete user.password_hash;

    return user;
  }
}
