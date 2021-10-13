import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup.string().required("Please enter email/username"),
    password: yup.string().required("Please enter password"),
  })
  .required();
