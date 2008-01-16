var MainData = new Object();

function DATA_ReadParams()
{
	var Params = UTILS_OpenXMLFile("scripts/data/conf.xml");

	MainData.Browser = UTILS_IdentifyBrowser();

	MainData.Host = UTILS_GetTag(Params, "host");
	MainData.Resource = UTILS_GetTag(Params, "resource");
	MainData.Xmlns = UTILS_GetTag(Params, "xmlns");
	MainData.Version = UTILS_GetTag(Params, "version");

	MainData.GetText = UTILS_OpenXMLFile("scripts/lang/language.xml");
}
