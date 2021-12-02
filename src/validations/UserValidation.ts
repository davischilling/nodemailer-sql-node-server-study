import * as Yup from "yup";

export const userValidation = Yup.object().shape({
  name: Yup.string().required("Name is a mandatory field").strict(),
  email: Yup.string().email().required("Email is a mandatory field").strict(),
});
