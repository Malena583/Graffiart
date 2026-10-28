import * as yup from 'yup';
import { LOGIN } from "../constants/LOGIN";

const loginSchema = yup.object().shape({
  email: yup.string().email(LOGIN.ERRORS.email).required(LOGIN.REQUIRED.email),
  password: yup.string().min(6, LOGIN.ERRORS.password).required(LOGIN.REQUIRED.password),
});

export default loginSchema;