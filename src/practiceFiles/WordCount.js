export function splitWords(text) {
    return text.trim().split(/\s+/);
}

export function countWords(text) {
    return splitWords(text).filter(Boolean).length;
}
