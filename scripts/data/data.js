var MainData = new Object();

DATA_ReadParams();

function DATA_ReadParams()
{
	var Params = UTILS_OpenXMLFile("conf.xml");

	MainData.Host = UTILS_GetParam(Params, "host");
	MainData.Resource = UTILS_GetParam(Params, "resource");
	MainData.Xmlns = UTILS_GetParam(Params, "xmlns");
	MainData.Version = UTILS_GetParam(Params, "version");

	MainData.Browser = UTILS_IdentifyBrowser();
}
