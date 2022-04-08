const supportedLanguages = {'english': 'en-US'};

const isSupportedLanguage = (language:string):boolean => {
  return language in supportedLanguages;
};

const isValidWord = (word:string):boolean => {
  return word.match(/[^a-zA-Z]/) == null;
};

const isValidQuery = (language:string, word:string):boolean => {
  return isSupportedLanguage(language) && isValidWord(word);
};

export {isValidQuery};
