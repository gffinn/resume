import { useRecoilState } from "recoil";
import { textInputState } from "../recoil/atoms/textInput";
import { useState } from "react";

export function splitWords(text) {
    return text.trim().split(/\s+/);
}

export function countWords(text) {
    return splitWords(text).filter(Boolean).length;
}
