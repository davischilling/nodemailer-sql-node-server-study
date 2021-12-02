import { getCustomRepository, Not, IsNull } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

export class NpsController {
  async execute(request: Request, response: Response, next: NextFunction) {
    try {
      const { survey_id } = request.params;
      const surveysUsersRepository = getCustomRepository(
        SurveysUsersRepository
      );
      const surveysUsers = await surveysUsersRepository.find({
        survey_id,
        value: Not(IsNull()),
      });
      const detractors = surveysUsers.filter(
        survey => survey.value >= 0 && survey.value <= 6
      ).length;
      const promoters = surveysUsers.filter(survey => survey.value >= 9).length;
      const passives = surveysUsers.filter(
        survey => survey.value < 9 && survey.value > 6
      ).length;

      const totalAnswers = surveysUsers.length;

      const calculate = Number(
        (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
      );
      return response.json({
        detractors,
        promoters,
        passives,
        totalAnswers,
        nps: calculate,
      });
    } catch (err) {
      next(err);
    }
  }
}
