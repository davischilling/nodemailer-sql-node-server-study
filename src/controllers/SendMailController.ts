import { AppError } from "./../utils/AppError";
import { resolve } from "path";
import { SurveysUsersRepository } from "./../repositories/SurveysUsersRepository";
import { UsersRepository } from "./../repositories/UsersRepositories";
import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepositories";
import SendMailService from "../services/SendMailService";

interface Variables {
  name: string;
  title: string;
  description: string;
  id: string;
  link: string;
}

export class SendMailController {
  async execute(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, survey_id } = request.body;

      const usersRepository = getCustomRepository(UsersRepository);
      const surveysRepository = getCustomRepository(SurveysRepository);
      const surveysUsersRepository = getCustomRepository(
        SurveysUsersRepository
      );

      const user = await usersRepository.findOne({ email });
      if (!user) {
        throw new AppError("User does not exist");
      }

      const survey = await surveysRepository.findOne({
        id: survey_id,
      });
      if (!survey) {
        throw new AppError("Survey does not exist");
      }

      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
        where: { user_id: user.id, value: null },
        relations: ["user", "survey"],
      });

      let variables: Variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        id: "",
        link: process.env.URL_MAIL,
      };
      const npsPath = resolve(
        __dirname,
        "..",
        "views",
        "emails",
        "npsMail.hbs"
      );

      if (surveyUserAlreadyExists) {
        variables.id = surveyUserAlreadyExists.id;
        await SendMailService.execute(
          email,
          "Survey Validation",
          variables,
          npsPath
        );
        return response.json(surveyUserAlreadyExists);
      }

      const surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id,
      });
      await surveysUsersRepository.save(surveyUser);

      variables.id = surveyUser.id;

      await SendMailService.execute(
        email,
        "Survey Validation",
        variables,
        npsPath
      );

      return response.json(surveyUser);
    } catch (err) {
      next(err);
    }
  }
}
