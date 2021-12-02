import { userValidation } from "./../validations/UserValidation";
import { isValid } from "./../middlewares/isValid";
import { NpsController } from "./../controllers/NpsController";
import { AnswerController } from "./../controllers/AnswerController";
import { Router } from "express";
import { SendMailController } from "./../controllers/SendMailController";
import { UserController } from "../controllers/UserController";
import { SurveyController } from "./../controllers/SurveyController";

const router = Router();

const userController = new UserController();
router.post("/users", isValid(userValidation), userController.create);
router.get("/users", userController.index);

const surveyController = new SurveyController();
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.index);

const sendMailController = new SendMailController();
router.post("/send-mail", sendMailController.execute);

const answerController = new AnswerController();
router.get("/answers/:value", answerController.execute);

const npsController = new NpsController();
router.get("/nps/:survey_id", npsController.execute);

export { router };
