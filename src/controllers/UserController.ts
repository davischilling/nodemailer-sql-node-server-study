import { AppError } from "./../utils/AppError";
import { UsersRepository } from "./../repositories/UsersRepositories";
import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";

export class UserController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, email } = request.body;
      if (!name || !email) {
        throw new AppError("Missing param");
      }
      const userRepository = getCustomRepository(UsersRepository);
      const userAlreadyExists = await userRepository.findOne({ email });
      if (userAlreadyExists) {
        throw new AppError("User already exists!");
      }
      const user = userRepository.create({ name, email });
      await userRepository.save(user);
      return response.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const usersRepository = getCustomRepository(UsersRepository);
      const users = await usersRepository.find();
      return response.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}
