import { AppError } from "./../utils/AppError";
import { getCustomRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

export class AnswerController {
  async execute(request: Request, response: Response, next: NextFunction) {
    try {
      const { uuid } = request.query;
      const { value } = request.params;

      const surveyUsersRepository = await getCustomRepository(
        SurveysUsersRepository
      );
      const surveyUser = await surveyUsersRepository.findOne({
        id: String(uuid),
      });

      if (!surveyUser) {
        throw new AppError("Survey user does not exist");
      }

      surveyUser.value = Number(value);
      await surveyUsersRepository.save(surveyUser);

      return response.status(200).json(surveyUser);
    } catch (err) {
      next(err);
    }
  }
}
