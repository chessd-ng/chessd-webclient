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

function PROFILE_HandleRatings(RatingNodes)
{
	var Rating = new Array();
	var Category, TimeStamp, Index;
	var i;

	Rating[0] = new Array(); // lightning
	Rating[0][0] = "Lightning";

	Rating[1] = new Array(); // blitz
	Rating[1][0] = "Blitz";

	Rating[2] = new Array(); // standard
	Rating[2][0] = "Standard";

	for (i=0; i < 3; i++)
	{
		for (j=1; j < 8; j++)
		{
			Rating[i][j] = "---";
		}
	}

	for (i=0; i < RatingNodes.length; i++)
	{
		Category = RatingNodes[i].getAttribute('category');

		switch(Category)
		{
			case 'lightning':
				Index = 0;
				break;
			case 'blitz':
				Index = 1;
				break;
			case 'standard':
				Index = 2;
				break;
			default:
		}
		
		Rating[Index][1] = RatingNodes[i].getAttribute('rating');
		Rating[Index][2] = RatingNodes[i].getAttribute('max_rating');
		TimeStamp = RatingNodes[i].getAttribute('max_timestamp');
		Rating[Index][3] = UTILS_ConvertTimeStamp(TimeStamp);
		Rating[Index][5] = RatingNodes[i].getAttribute('wins');
		Rating[Index][6] = RatingNodes[i].getAttribute('draws');
		Rating[Index][7] = RatingNodes[i].getAttribute('losses');
		Rating[Index][4] = parseInt(Rating[Index][5])+ parseInt(Rating[Index][6])+ parseInt(Rating[Index][7]); 	
	}

	return Rating;
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

	CONNECTION_SendJabber(MESSAGE_GetProfile(Username,MainData.Const.IQ_ID_GetProfile), MESSAGE_Info(Username));

	//TODO MESSAGE_GetChessProfile();
	//CONNECTION_SendJabber(MESSAGE_GetProfile(Username), MESSAGE_GetChessProfile(Username));

}

function PROFILE_RemoveProfile(Username)
{
	var Jid = Username+"@"+MainData.Host;

	MainData.RemoveProfile(Jid);
}

