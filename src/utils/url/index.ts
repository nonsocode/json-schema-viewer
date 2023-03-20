const urlRegex = /^(((https?:)?\/\/?)|#).+/;
export function isUrl(value: string) {
    return urlRegex.test(value);
}
