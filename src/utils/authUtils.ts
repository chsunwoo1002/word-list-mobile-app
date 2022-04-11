import PasswordValidator from 'password-validator';
import * as EmailValidator from 'email-validator';

/**
 * check pass is following the password rule
 * @param {stirng} pass the string of password
 * @return {boolean} Does pass follow the password rule?
 */
const validatePasswordRule = (pass:string) => {
  const schema = new PasswordValidator();
  schema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digits(1)
      .has().not().spaces();
  return schema.validate(pass);
};

/**
 * check pass element in query body is valid password
 * @param {any} pass the element in query body
 * @return {boolean} Does the pass contain valid format of password?
 */
const isValidPassword = (pass: any) => {
  return Boolean(pass) &&
         typeof pass === 'string' &&
         validatePasswordRule(pass);
};

/**
 * chekc email element in query body is valid email format
 * @param {any} email the email element in query body
 * @return {boolean} Doest the email contain valid format of email?
 */
const isValidEmail = (email: any) => {
  return Boolean(email) &&
         typeof email === 'string' &&
         EmailValidator.validate(email);
};

export {isValidPassword, isValidEmail};
