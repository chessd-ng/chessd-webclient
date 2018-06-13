import {
	UTILS_OpenXMLFile,
	UTILS_GetTag,
	UTILS_ReadCookie,
} from 'utils/utils.js';
import { DATA } from 'data/data.js';

import conf from 'conf/conf.xml';
import { languages } from 'langs';

export var MainData;

function GetLang() {
	// What language show?
	// Find lang in cookie
	var Lang = UTILS_ReadCookie("lang");
	// if language is not found in cookie
	if (Lang == "") {
		// Get from browser language
		//Lang = UTILS_GetLanguage();
		
		// Get default lang from configuration file
		var ConfTmp = UTILS_OpenXMLFile(conf);
		Lang = UTILS_GetTag(ConfTmp, "default-lang");
	}
  return Lang;
}

export function START_MainData() {
  var Lang = GetLang();
	// Read xml config files and starting data structure
	MainData = new DATA(conf, languages[Lang]);
	MainData.SetLang(Lang);
}

