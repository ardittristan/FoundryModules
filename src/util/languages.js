import { getByTag } from "locale-codes";
import { where } from "langs";

export function getLanguageByTag(language) {
  // auto detect
  let lang = "";

  lang = where("1", language?.lang);
  if (lang) return lang.local;

  lang = where("2", language?.lang);
  if (lang) return lang.local;

  lang = getByTag(language?.lang)?.local;
  if (lang) return lang;

  lang = getByTag(language?.lang)?.name;
  if (lang) return lang;

  lang = language?.name;
  if (lang) {
    console.error(lang);
    return lang;
  }

  lang = language?.lang;
  return lang;
}
