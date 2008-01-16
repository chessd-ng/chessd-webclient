var MainData = new Object();

function DATA_ReadParams()
{
	var Params = UTILS_OpenXMLFile("scripts/data/conf.xml");

	MainData.Browser = UTILS_IdentifyBrowser();

	MainData.Host = UTILS_GetTag(Params, "host");
	MainData.Resource = UTILS_GetTag(Params, "resource");
	MainData.Xmlns = UTILS_GetTag(Params, "xmlns");
	MainData.Version = UTILS_GetTag(Params, "version");
	MainData.CookieValidity = UTILS_GetTag(Params, "cookie-validity");
	MainData.RID = 0;
	MainData.SID = -1;

	/*
	* State in jabber server
	*  -1 -> Disconnected
	*   0 -> Connected
	* > 1 -> Connecting
	*/
	MainData.ConnectionStatus = 1;

	MainData.GetText = UTILS_OpenXMLFile("scripts/lang/language.xml");
}
