import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";

export const isValid = (schema: AnySchema) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    await schema.validate(request.body);
  } catch ({ errors }) {
    return response.status(400).json({ errors });
  }
  next();
};
