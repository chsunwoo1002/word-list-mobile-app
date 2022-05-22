import mongoose, {Document, Model} from 'mongoose';

// interface for word
export interface IWord {
  word: string;
  phonetic?: string;
  phonetics: [PhoneticType];
  origin?: string;
  meaning: [MeaningType];
}

interface PhoneticType {
  text: string;
  audio?: string;
}

interface MeaningType {
  partOfSpeech: string;
  definitions: [DefinitionType];
}

interface DefinitionType {
  definition: string;
  synonyms?: [string];
  antonyms?: [string];
}

// combine two interfaces
interface IWordDocument extends IWord, Document {
  getWordId: () => Promise<string>;
}

// interface for model
interface WordModel extends Model<IWordDocument> {
  findByWord: (word: string) => Promise<IWordDocument>;
  findManyByIds: (ids: string[]) => Promise<IWordDocument[]>;
  addWordDoc: (word: IWord) => Promise<IWordDocument>;
}

const opts = {
  collection: 'words',
};

const PhoneticsSchema = new mongoose.Schema({
  test: {type: String, required: true},
  audio: {type: String},
});

const DefinitionSchema = new mongoose.Schema({
  definition: {type: String, required: true},
  synonyms: {type: [String]},
  antonyms: {type: [String]},
});

const MeaningSchema = new mongoose.Schema({
  partOfSpeech: {type: String, required: true},
  definitions: {type: [DefinitionSchema], required: true},
});

const WordSchema = new mongoose.Schema({
  word: {type: String, required: true, lowercase: true, unique: true},
  phonetic: {type: String},
  phonetics: {type: [PhoneticsSchema], required: true},
  origin: {type: String},
  meaning: {type: [MeaningSchema], required: true},
}, opts );

WordSchema.methods.getWordId = async function() {
  return this._id.toString();
};

WordSchema.statics.findByWord = async (word: string) => {
  const wordObj = await Word.findOne({word});
  if (!wordObj) {
    throw new Error('Cannot find word');
  }
  return wordObj;
};

WordSchema.statics.findManyByIds = async (ids: string[]) => {
  const words = await Word.find({_id: {$in: ids}});
  if (!words) {
    throw new Error('Cannot find words');
  }
  return words;
};

WordSchema.statics.addWordDoc = async (word: IWord) => {
  const wordObj = await Word.create(word);
  return wordObj;
};

const Word = mongoose.model<IWordDocument, WordModel>('Word', WordSchema);

export {Word};
