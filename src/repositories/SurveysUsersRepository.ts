import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUSer";

@EntityRepository(SurveyUser)
export class SurveysUsersRepository extends Repository<SurveyUser> {}
