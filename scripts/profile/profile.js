function PROFILE_HandleVCardProfile(XML)
{
	var FullName;
	var Photo, PhotoType, Binval;
	var Birthday, NickName, Desc;

	var From = XML.getAttribute("from");
	var UserFrom = From.split("@")[0];

	var Profile;
	var Img;

	FullName = UTILS_GetNodeText(XML.getElementsByTagName("FN")[0]);
	NickName = UTILS_GetNodeText(XML.getElementsByTagName("NICKNAME")[0]);
	Desc = UTILS_GetNodeText(XML.getElementsByTagName("DESC")[0]);

	Birthday = UTILS_GetNodeText(XML.getElementsByTagName("BDAY")[0]);

	Photo = XML.getElementsByTagName("PHOTO")[0];

	// Get photo image
	if(Photo != null)
	{
		PhotoType = UTILS_GetNodeText(Photo.getElementsByTagName("TYPE")[0]);
		Binval = UTILS_GetNodeText(Photo.getElementsByTagName("BINVAL")[0]);
		Img = "data:"+PhotoType+";base64,"+Binval;
	}
	else
	{
		Img = "images/no_photo.png";
	}

	// Update user image
	if((UserFrom == MainData.Username) && (MainData.Photo != Img))
	{
		MainData.Photo = Img;
		INTERFACE_SetUserImage(Img);
	}

	// Update profile window
	Profile = MainData.GetProfile(From)
	if(Profile != null)
	{
		Profile.Profile.SetUser(FullName);
		Profile.Profile.SetNick(NickName);
		Profile.Profile.SetDesc(Desc)
		Profile.Profile.SetUserImg(Img);
	}

	return "";
}


function PROFILE_StartProfile(Username)
{	
	var ProfileInfo = new Object();

	var Jid = Username+"@"+MainData.Host;

	var Elements;

	ProfileInfo.User = Username;
	ProfileInfo.Name = "---";
	ProfileInfo.Description = "---";
	ProfileInfo.Group = "---";
	ProfileInfo.Type = "---";
	ProfileInfo.OnlineTime = "---";
	ProfileInfo.Online = "---";
	ProfileInfo.Total = "---";

	Elements = WINDOW_Profile(ProfileInfo);

	MainData.AddProfile(Jid, Username, Elements);

	CONNECTION_SendJabber(MESSAGE_GetProfile(Username));

	//TODO MESSAGE_GetChessProfile();
	//CONNECTION_SendJabber(MESSAGE_GetProfile(Username), MESSAGE_GetChessProfile(Username));

}

function PROFILE_RemoveProfile(Username)
{
	var Jid = Username+"@"+MainData.Host;

	MainData.RemoveProfile(Jid);
}

