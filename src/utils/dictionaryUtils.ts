const supportedLanguages = new Set(['en-US']);

/**
 * check language element in query body is valid and supported language
 * @param {any} language the element in query body
 * @return {boolean} Is language valid and supported?
 */
const isSupportedLanguage = (language:any):boolean => {
  return Boolean(language) &&
         typeof language === 'string' &&
         supportedLanguages.has(language);
};

/**
 * check word element in query body is valid
 * @param {any} word the element in query body
 * @return {boolean} Is word valid?
 */
const isValidWord = (word:any):boolean => {
  return Boolean(word) &&
         typeof word === 'string' &&
         word.match(/[^a-zA-Z]/) === null;
};

/**
 * check query is valid
 * @param {any} language the element in query body
 * @param {any} word the element in query body
 * @return {boolean} Is query valid?
 */
const isValidDictionaryQuery = (language:any, word:any):boolean => {
  return isSupportedLanguage(language) && isValidWord(word);
};

export {isValidDictionaryQuery};
