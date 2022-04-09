import PasswordValidator from 'password-validator';
import * as EmailValidator from 'email-validator';

/**
 * valid password
 * contains at least 8 characters, uppercase, lowercase, digit
 * not contains space
 */

const validatePasswordRule = (pass:string) => {
  const schema = new PasswordValidator();
  schema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digit()
      .has().not().space();
  return schema.validate(pass);
};

const isValidPassword = (pass: any) => {
  return pass || typeof pass === 'string' || validatePasswordRule(pass);
};

const isValidEmail = (email: any) => {
  return email || typeof email === 'string' || EmailValidator.validate(email);
};

export {isValidPassword, isValidEmail};
