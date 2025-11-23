export interface ExampleWord {
  word: string;
  pinyin: string;
}

export interface QuizItem {
  character: string;
  pinyin: string;
  wrongPinyins: string[]; // 3 distractors
  wrongChars: string[];   // 3 distractors
  examples: ExampleWord[]; // 3 examples
}

export interface QuizResponse {
  items: QuizItem[];
}

export enum GameMode {
  HANZI_TO_PINYIN = 'HANZI_TO_PINYIN',
  PINYIN_TO_HANZI = 'PINYIN_TO_HANZI',
}

export enum AppState {
  WELCOME = 'WELCOME',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}
