import {isValidDictionaryQuery} from '../dictionaryUtils';

const validLanguage = 'en-US';
const validWord = 'apple';
const invalidLanguage = 'kor';
const invalidWord = 'apple@1';
const undefinedArg = undefined;
const numberArg = 1234567890;

// positive test case
test('test valid dictionary query', () => {
  expect(isValidDictionaryQuery(validLanguage, validWord)).toBe(true);
});

// negative test cases
test('test invalid dictionary query', () => {
  expect(isValidDictionaryQuery(invalidLanguage, validWord)).toBe(false);
  expect(isValidDictionaryQuery(validLanguage, invalidWord)).toBe(false);
  expect(isValidDictionaryQuery(undefinedArg, validWord)).toBe(false);
  expect(isValidDictionaryQuery(numberArg, validWord)).toBe(false);
  expect(isValidDictionaryQuery(validLanguage, undefinedArg)).toBe(false);
  expect(isValidDictionaryQuery(validLanguage, numberArg)).toBe(false);
});
