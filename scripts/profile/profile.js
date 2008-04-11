/**
* CHESSD - WebClient
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* C3SL - Center for Scientific Computing and Free Software
*/

/**
* Handle Jabber vCard User
*
* @public
* @param        XML is the xml that contais vCard information
* @return       void
* @author       Rubens
*/
function PROFILE_HandleVCardProfile(XML)
{
	var FullName;
	var Photo, PhotoType="", Binval="";
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
	if (Photo != undefined)
	{
		PhotoType = UTILS_GetNodeText(Photo.getElementsByTagName("TYPE")[0]);
		Binval = UTILS_GetNodeText(Photo.getElementsByTagName("BINVAL")[0]);
		if((Binval == "") || (PhotoType == ""))
		{
			Img = "images/no_photo.png";
		}
		else
		{
			Img = "data:"+PhotoType+";base64,"+Binval;
		}
	}
	else
	{
		Img = "images/no_photo.png";
	}

	if (UserFrom == MainData.Username)
	{
		// Update user image
		if (MainData.Photo != Img)
		{
			MainData.MyProfile.Img64 = Binval;
			MainData.MyProfile.ImgType = PhotoType;
			INTERFACE_SetUserImage(Img);
			MainData.Photo = Img;
		}
		
		// Update profile data struct
		MainData.SetMyProfile(UserFrom, FullName, Desc, PhotoType, Binval);
	}

	// Update profile window
	Profile = MainData.GetProfile(From)
	if (Profile != null)
	{
		Profile.Profile.SetUser(FullName); // Set user full name
		Profile.Profile.SetNick(NickName); //Set nickname (static)
		Profile.Profile.SetDesc(Desc); // Set description
		Profile.Profile.SetUserImg(Img); //Set user img
		Profile.Profile.SetImg64(Binval);
		Profile.Profile.SetImgType(PhotoType);
	}

	return "";
}

/**
* Create an array with ratings and return it
*
* @param RatingNodes	Array of ratings with data
* @return		Array in format:
* 						each line is a rating type
* 						[1] lightning
* 						[2] blitz
* 						[3] Standard
* 						each column is a data
* 						[1] category
* 						[2] current rating
* 						[3] max rating
* 						[4] max rating date
* 						[5] number of games in category
* 						[6] number of wins
* 						[7] number of losses
* 						[8] numeber of draws
* @see 			CONTACT_HandleInfo(XML);	
* @author		Danilo Yorinori
*/
function PROFILE_HandleRatings(RatingNodes)
{
	var Rating = new Array();
	var Category, TimeStamp, Index;
	var i;

	// Set standard category
	// TODO expand this
	Rating[0] = new Array(); // lightning
	Rating[0][0] = "Lightning";

	Rating[1] = new Array(); // blitz
	Rating[1][0] = "Blitz";

	Rating[2] = new Array(); // standard
	Rating[2][0] = "Standard";

	// Set with "---" all fields
	for (i=0; i < 3; i++)
	{
		for (j=1; j < 8; j++)
		{
			Rating[i][j] = "---";
		}
	}

	// Get the category type and fill the fields with respective data.
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
	
		// Set fields with values
		Rating[Index][1] = RatingNodes[i].getAttribute('rating');
		Rating[Index][2] = RatingNodes[i].getAttribute('max_rating');
		TimeStamp = RatingNodes[i].getAttribute('max_timestamp');
		Rating[Index][3] = UTILS_ConvertTimeStamp(TimeStamp);
		Rating[Index][5] = RatingNodes[i].getAttribute('wins');
		Rating[Index][6] = RatingNodes[i].getAttribute('draws');
		Rating[Index][7] = RatingNodes[i].getAttribute('losses');
		Rating[Index][4] = parseInt(Rating[Index][5])+ parseInt(Rating[Index][6])+ parseInt(Rating[Index][7]); 	
	}

	// return array of rating to show in profile window
	return Rating;
}

/**
* Create profile in data Struct and show Profile window
*
* @public
* @param        Username is the jabber username
* @return       void
* @author       Rubens
*/
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

/**
* Remove Profile from data struct 
*
* @public
* @param        Username is the jabber username
* @return       void
* @author       Rubens
*/
function PROFILE_RemoveProfile(Username)
{
	var Jid = Username+"@"+MainData.Host;

	MainData.RemoveProfile(Jid);
}

/**
* Save changes of profile
*
* @public
* @param        Username is the jabber username
* @return       void
* @author       Rubens
*/
function PROFILE_SaveMyProfile()
{
	var FN, Desc, PhotoType, Binval;
	var MyProfile;

	MyProfile = MainData.GetProfile(MainData.Username+"@"+MainData.Host);	

	FN = MyProfile.Profile.GetUser();
	Desc = MyProfile.Profile.GetDesc();
	PhotoType = MyProfile.Profile.GetImgType();
	Binval = MyProfile.Profile.GetImg64();

	CONNECTION_SendJabber(MESSAGE_SetProfile("", FN, Desc, PhotoType, Binval), MESSAGE_GetProfile(MainData.Username));
}

/**
* Return a default message to create a basic profile
* @return       XMPP set profile message
* @author       Pedro
*/
function PROFILE_CreateProfile()
{
	return MESSAGE_SetProfile("", MainData.Username, "", "", "");
}
