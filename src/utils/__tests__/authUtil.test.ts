import {isValidPassword, isValidEmail} from '../authUtils';

const undefinedArg = undefined;
const numArg = 1234567890;

// Postivie test cases
test('test valid password input', () => {
  expect(isValidPassword('validPASS123')).toBe(true);
});

test('test valid email input', () => {
  expect(isValidEmail('my.email.123@gmail.com')).toBe(true);
});

// Negative test cases
test('test invalid password input', () => {
  expect(isValidPassword('Small1')).toBe(false);
  expect(isValidPassword('nouppercase1')).toBe(false);
  expect(isValidPassword('NOLOWERCASE1')).toBe(false);
  expect(isValidPassword('NoDigits')).toBe(false);
  expect(isValidPassword('Pass with space 123')).toBe(false);
  expect(isValidPassword(undefinedArg)).toBe(false);
  expect(isValidPassword(numArg)).toBe(false);
});

test('test invalid email input', () => {
  expect(isValidEmail('noDomain@gmailcom')).toBe(false);
  expect(isValidEmail('@gmail.com')).toBe(false);
  expect(isValidEmail('noaddressGmail.com')).toBe(false);
  expect(isValidEmail(undefinedArg)).toBe(false);
  expect(isValidEmail(numArg)).toBe(false);
});
