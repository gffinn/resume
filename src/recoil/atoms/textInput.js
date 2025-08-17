import { atom } from "recoil";

export const textInputState = atom({
  key: "TextInputState", 
  default: {
    textInput: "",
    wordsArray: [],
    wordCount: 0,
    charCount: 0,
  },
});
