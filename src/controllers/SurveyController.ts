import { AppError } from "./../utils/AppError";
import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepositories";

export class SurveyController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { title, description } = request.body;
      if (!title || !description) {
        throw new AppError("Missing param");
      }
      const surveysRepository = getCustomRepository(SurveysRepository);
      const surveysAlreadyExists = await surveysRepository.findOne({ title });
      if (surveysAlreadyExists) {
        throw new AppError("Survey already exists!");
      }
      const survey = surveysRepository.create({ title, description });
      await surveysRepository.save(survey);
      return response.status(201).json(survey);
    } catch (err) {
      next(err);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const surveysRepository = getCustomRepository(SurveysRepository);
      const surveys = await surveysRepository.find();
      return response.status(200).json(surveys);
    } catch (err) {
      next(err);
    }
  }
}
