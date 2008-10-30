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

	var User;
	var MyUsername = MainData.Username;
	
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
		if(((Binval == undefined) && (PhotoType == undefined)) || ((Binval == "") || (PhotoType == "")))
		{
//			Img = "images/no_photo.png";
			Img = null;
		}
		else
		{
			Img = "data:"+PhotoType+";base64,"+Binval;
		}
	}
	else
	{
		Img = null;
	}

	// Update in data struct
	User = MainData.GetUser(UserFrom);
	if(User != null)
	{
		// Update profile data struct
		//MainData.SetMyProfile(UserFrom, FullName, Desc, PhotoType, Binval);
		User.SetFullname(FullName);
		User.SetDesc(Desc);
		User.SetPhoto(Img);
		User.SetImg64(Binval);
		User.SetImgType(PhotoType);

		if (UserFrom == MyUsername)
		{
			// Update user image
			if (User.GetPhoto() != Img)
			{
				//MainData.MyProfile.Img64 = Binval;
				//MainData.MyProfile.ImgType = PhotoType;
				INTERFACE_SetUserImage(Img);
			}
		}

		// Update profile window
		Profile = User.GetProfileObj();
		if (Profile != null)
		{
			Profile.SetUser(FullName); // Set user full name
			Profile.SetNick(NickName); //Set nickname (static)
			Profile.SetDesc(Desc); // Set description
			Profile.SetUserImg(Img); //Set user img
			Profile.SetImg64(Binval);
			Profile.SetImgType(PhotoType);
		}
	}

	return "";
}

/**
* Handle info profile user
*
* @public
* @param        XML is the xml that contais profile informations
* @return       void
* @author       Rubens
*/
function PROFILE_HandleInfoProfile(XML)
{
	var RatingNodes, TypeNode, ProfileNode;
	var OnlineNode, UptimeNode;
	var Jid, Profile, Type, Rating;
	var OnlineTime, UpTime;
	var User;
	var From;
	
	OnlineNode = XML.getElementsByTagName('online_time')[0];
	UptimeNode = XML.getElementsByTagName('uptime')[0];
	ProfileNode = XML.getElementsByTagName('profile')[0];
	RatingNodes = XML.getElementsByTagName('rating');
	TypeNode = XML.getElementsByTagName('type')[0];

	Jid = ProfileNode.getAttribute('jid');
	From = Jid.split('@')[0];
	User = MainData.GetUser(From);

	// Profile window opened
	//if (MainData.ProfileList.length > 0)
	if( User != null)
	{
		if(UptimeNode != null)
		{
			UpTime = UptimeNode.getAttribute("seconds");
		}
		else
		{
			UpTime = null;
		}

		if(OnlineNode != null)
		{
			OnlineTime = OnlineNode.getAttribute("seconds");
		}
		else
		{
			OnlineTime = null;
		}

		if(TypeNode != null)
		{
			Type = TypeNode.getAttribute('type');
		}
		else
		{
			Type = 'user';
		}
		/*
		User.SetOnlineTime(UpTime);
		User.SetTotalTime(OnlineTime);
		User.SetType(Type);
		/*/
		//Update Rating
		Rating = PROFILE_HandleRatings(From, RatingNodes);

		// Profile Update
		Profile = User.GetProfileObj();
		if (Profile != null)
		{
			Profile.SetOnlineTime(UpTime);
			Profile.SetTotalTime(OnlineTime);

			Profile.SetGroup(Type);
			Profile.SetTitleImg(Type);

			Profile.SetRatings(Rating);
		}
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
function PROFILE_HandleRatings(Username, RatingNodes)
{
	var Rating = new Array();
	var Category, TimeStamp, Index;
	var i,j;
	var User;
	var RatingValue;
	var TotalWin,TotalDraw,TotalLosses, TotalGames;
	var RecordValue, RecordTime;

	// Set standard category
	// TODO --> Change this struct type to be more dinamic
	Rating[0] = new Array(); // lightning
	Rating[0][0] = "lightning";

	Rating[1] = new Array(); // blitz
	Rating[1][0] = "blitz";

	Rating[2] = new Array(); // standard
	Rating[2][0] = "standard";

	Rating[3] = new Array(); // standard
	Rating[3][0] = "untimed";

	// Set with "---" all fields
	for (i=0; i < Rating.length; i++)
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
			case 'untimed':
				Index = 3;
				break;
			default:
		}
	
		// Set fields with values
		RatingValue = RatingNodes[i].getAttribute('rating');
		RecordValue = RatingNodes[i].getAttribute('max_rating');
		TotalWin   = parseInt(RatingNodes[i].getAttribute('wins'));
		TotalDraw  = parseInt(RatingNodes[i].getAttribute('draws'));
		TotalLosses= parseInt(RatingNodes[i].getAttribute('losses'));
		TotalGames = TotalWin + TotalDraw + TotalLosses;
		TimeStamp = RatingNodes[i].getAttribute('max_timestamp');
		RecordTime= UTILS_ConvertTimeStamp(TimeStamp);

		Rating[Index][1] = RatingValue;
		Rating[Index][2] = RecordValue;
		Rating[Index][3] = RecordTime;
		Rating[Index][4] = TotalGames;
		Rating[Index][5] = TotalWin;
		Rating[Index][6] = TotalDraw;
		Rating[Index][7] = TotalLosses;

		/*
		User = MainData.GetUser(Username);
		// Update in data struct 
		if(User != null)
		{
			if(User.Rating.FindRating(Category) == null)
			{
				User.Rating.AddRating(Category, RatingValue, RecordValue, RecordTime,
					       TotalWin, TotalDraw, TotalLosses);
			}
			else
			{
				User.Rating.SetRatingValue( Category, RatingValue);
				User.Rating.SetRecordValue( Category, RecordValue);
				User.Rating.SetRecordTime(  Category, RecordTime);
				User.Rating.SetRatingWin(   Category, TotalWin);
				User.Rating.SetRatingDraw(  Category, TotalDraw);
				User.Rating.SetRatingLosses(Category, TotalLosses);
			}
		}
		*/
	}

	// return array of rating to show in profile window
	return Rating;
}

/**
* Create profile in data Struct and show Profile window
*
* @public
* @param        Username is the jabber username
* @return       boolean
* @author       Rubens
*/
function PROFILE_StartProfile(Username)
{
	var User = MainData.GetUser(Username);

	var ProfileInfo = new Object();

	var Jid = Username+"@"+MainData.GetHost();

	var ProfileObj;
	
	var Consts = MainData.GetConst();
	var Msg = "";
/*
	if (MainData.FindProfile(Jid) != null)
	{
		return false;
	}
*/

	if(User == null)
	{
		USER_AddUser(Username, "offline");
		User = MainData.GetUser(Username);
	}

	// Initialize profile data
	ProfileInfo.User = Username;
	ProfileInfo.Name = "---";
	ProfileInfo.Description = "---";
	ProfileInfo.Group = "---";
	ProfileInfo.Type = "---";
	ProfileInfo.OnlineTime = "---";
	ProfileInfo.Online = null;
	ProfileInfo.Total = null;

	ProfileObj = WINDOW_Profile(ProfileInfo);

	//MainData.AddProfile(Jid, Username, Elements);

	User.SetProfileObj(ProfileObj);

	if(User.GetUpdateProfile() == true)
	{
		Msg += MESSAGE_GetProfile(Username,Consts.IQ_ID_GetProfile);
		User.SetUpdateProfile(false);
	}
	else //Get profile data from user list
	{
	
		ProfileObj.SetNick(User.GetUsername());
		ProfileObj.SetUser(User.GetFullname());
		ProfileObj.SetDesc(User.GetDesc());
		ProfileObj.SetGroup(User.GetType());
		//TODO -> ProfileObj.Type = User.GetType();;
		ProfileObj.SetOnlineTime(User.GetOnlineTime());
		//ProfileObj.Online = "---";
		ProfileObj.SetTotalTime(User.GetTotalTime());

	}

	if(User.GetUpdateRating() == true)
	{
		Msg += MESSAGE_InfoProfile(Username);
		User.SetUpdateProfile(false);
	}
	else
	{
		ProfileObj.SetRatings(PROFILE_ConvertUserRatingList(User.GetRatingList()));
	}

	if(Msg != "")
	{
		CONNECTION_SendJabber(Msg);
	}
	return true;
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
	/*
	var Jid = Username+"@"+MainData.GetHost();

	MainData.RemoveProfile(Jid);
	*/
	var User = MainData.GetUser(Username);

	if(User != null)
	{
		User.SetProfileObj(null);
	}
}

/**
* Save changes of profile
*
* @public
* @param        Username is the jabber username
* @return       boolean
* @author       Rubens
*/
function PROFILE_SaveMyProfile()
{
	var FN, Desc, PhotoType, Binval;
	var MyProfile;
	var MyUsername = MainData.Username;
	var MyUser = MainData.GetUser(MyUsername);

	MyProfile = MyUser.GetProfileObj();	
	
	FN = MyProfile.GetUser();
	Desc = MyProfile.GetDesc();
	if (Desc.length > 200) 
	{
		WINDOW_Alert(UTILS_GetText('profile_error'),UTILS_GetText('profile_desc_limit'));
		return false;
	}
	PhotoType = MyUser.GetImgType();
	Binval = MyUser.GetImg64();

	CONNECTION_SendJabber(MESSAGE_SetProfile("", FN, Desc, PhotoType, Binval), MESSAGE_GetProfile(MyUsername));

	return true;
}

/**
* Return a default message to create a basic profile
* @return       XMPP set profile message
* @author       Pedro
*/
function PROFILE_CreateProfile()
{
	var MyUsername = MainData.Username;
	return MESSAGE_SetProfile("", MyUsername, "", "", "");
}

function PROFILE_ResetUpdateProfile()
{
	var User;
	var UserList = MainData.GetUserList();
	var i;

	for(i=0; i<UserList.length; i++)
	{
		User = UserList[i];
		if(User.GetUpdateProfile() == false)
		{
			User.SetUpdateProfile(true);
		}
	}
}


function PROFILE_ConvertUserRatingList(RatingList)
{
	var Rating = new Array();
	var i,j;
	var Category;
	var TotalGames;
	var MaxCategory = 4;

	// Set standard category
	// TODO --> Change this struct type to be more dinamic
	Rating[0] = new Array(); // lightning
	Rating[0][0] = "lightning";

	Rating[1] = new Array(); // blitz
	Rating[1][0] = "blitz";

	Rating[2] = new Array(); // standard
	Rating[2][0] = "standard";

	Rating[3] = new Array(); // standard
	Rating[3][0] = "untimed";

	// Set with "---" all fields
	for (i=0; i < MaxCategory; i++)
	{
		for (j=1; j < 8; j++)
		{
			Rating[i][j] = "---";
		}
	}

	// Get the category type and fill the fields with respective data.
	for (i=0; i < MaxCategory; i++)
	{
		switch(i)
		{
			case 0:
				Category = 'lightning';
				break;
			case 1:
				Category = 'blitz';
				break;
			case 2:
				Category = 'standard';
				break;
			case 3:
				Category = 'untimed';
				break;
			default:
		}

	
		if(RatingList.FindRating(Category) != null)
		{
			// Set fields with values
			Rating[i][1] = RatingList.GetRatingValue(Category);
			Rating[i][2] = RatingList.GetRecordValue(Category);
			Rating[i][3] = RatingList.GetRecordTime(Category);
			Rating[i][5] = RatingList.GetRatingWin(Category);
			Rating[i][6] = RatingList.GetRatingDraw(Category);
			Rating[i][7] = RatingList.GetRatingLosses(Category);

			TotalGames = Rating[i][5] + Rating[i][6] + Rating[i][7];
			Rating[i][4] = TotalGames;
		}
	}

	return Rating;
}
