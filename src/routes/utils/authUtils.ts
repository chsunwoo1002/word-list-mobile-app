import PasswordValidator from 'password-validator';

/**
 * valid password
 * contains at least 8 characters, uppercase, lowercase, digit
 * not contains space
 */

const validatePassword = (pass:string) => {
  const schema = new PasswordValidator();
  schema
      .is().min(8)
      .has().uppercase()
      .has().lowercase()
      .has().digit()
      .has().not().space();
  return schema.validate(pass);
};

export {validatePassword};
