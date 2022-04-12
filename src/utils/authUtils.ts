import PasswordValidator from 'password-validator';
import * as EmailValidator from 'email-validator';

/**
 * check password is following the passwordword rule
 * @param {stirng} password the string of passwordword
 * @return {boolean} Does password follow the passwordword rule?
 */
const validatepasswordwordRule = (password:string):boolean => {
  const schema = new PasswordValidator();
  schema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digits(1)
      .has().not().spaces();
  return Boolean(schema.validate(password));
};

/**
 * check password element in query body is valid passwordword
 * @param {any} password the element in query body
 * @return {boolean} Does the password contain valid format of passwordword?
 */
const isValidPassword = (password: any):boolean => {
  return Boolean(password) &&
         typeof password === 'string' &&
         validatepasswordwordRule(password);
};

/**
 * check email element in query body is valid email format
 * @param {any} email the email element in query body
 * @return {boolean} Does the email contain valid format of email?
 */
const isValidEmail = (email: any):boolean => {
  return Boolean(email) &&
         typeof email === 'string' &&
         EmailValidator.validate(email);
};

/**
 * check https request is valid
 * @param {any} email the email element in query body
 * @param {any} password the password element in query body
 * @return {boolean} Doest json body contains valid format data?
 */
const isValidAuthQuery = (email: any, password: any):boolean => {
  return isValidEmail(email) && isValidPassword(password);
};

export {isValidPassword, isValidAuthQuery};
