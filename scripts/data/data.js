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
* @file data.js
* @brief Class definition for main data structure
* 
* Read the config file (scripts/data/conf.xml) and load all data 
* structure
*/


/**
* @class DATA
* @brief Main data sctructure
*
* Class to organize the interface's data 
*/
function DATA(ConfFile, LangFile)
{
	var Params = UTILS_OpenXMLFile(ConfFile);

	/************************ CONNECTION DATA ************************/
	this.Connection = new Object();
	/*
	* State in jabber server
	*  -1 -> Disconnected
	*   0 -> Connected
	* > 1 -> Connecting
	*/
	this.Connection.ConnectionStatus = 1;
	this.Connection.HttpRequest = new Array();
	this.Connection.RID = null;
	this.Connection.SID = -1;

	/************************ CONFIGURATION DATA ************************/
	this.Conf = new Object();
	// Get Host from url
	this.Conf.Host = window.location.href.split("/")[2].split(":")[0];
	this.Conf.HostPost = window.location.href.split("/")[2];
	this.Conf.Browser = UTILS_IdentifyBrowser();
	this.Conf.Resource = UTILS_GetTag(Params, "resource");
	this.Conf.Server = UTILS_GetTag(Params,"server");
	this.Conf.ConferenceComponent = UTILS_GetTag(Params,"conference-component");
	this.Conf.SearchComponent = UTILS_GetTag(Params, "search-component");
	this.Conf.GetText = UTILS_OpenXMLFile(LangFile);
	this.Conf.Const = DATA_SetConsts();
	this.Conf.Xmlns = UTILS_GetTag(Params, "Xmlns");
	this.Conf.Version = UTILS_GetTag(Params, "version");
	this.Conf.CookieValidity = UTILS_GetTag(Params, "cookie-validity");
	this.Conf.Lang = "";
	//Default php version - php4 or php5
	this.Conf.DefaultPHP = UTILS_GetTag(Params, "default-php")

	this.Status = "available";
	this.Type = null;
	//this.RID = Math.round( 100000.5 + ( ( (900000.49999) - (100000.5) ) * Math.random() ) );
	this.Load = -1;

	/************************ CONTACT DATA*********************/
	this.Contact = new Object();
	this.Contact.Obj = null;
	this.Contact.UserList = new Array();
	this.Contact.OrderBy = 0;
	this.Contact.CurrentRating = "blitz";

	/************************ ONLINE DATA**********************/
	this.Online = new Object();
	this.Online.Obj = null;
	this.Online.UserList = new Array();
	this.Online.OrderBy = 0;
	this.Online.CurrentRating = "blitz";

	/************************ USERLIST DATA*********************/
	this.Users = new Object();
	this.Users.UserList = new Array();
	this.Users.UpdateTimer = null;

	/************************ CHAT DATA************************/
	this.Chat = new Object();
	this.Chat.ChatList = new Array()
	this.Chat.ShowChat = new Array();
	this.Chat.MaxChats = UTILS_GetTag(Params, "max-chats");
	// Max chat input length
	this.Chat.MaxChatChar = UTILS_GetTag(Params, "max-chat-char");

	/************************ ROOM DATA************************/
	this.Room = new Object();
	this.Room.RoomList = new Array();
	this.Room.Current = null;
	this.Room.MaxRooms = UTILS_GetTag(Params, "max-rooms");
	this.Room.EmoticonNum = UTILS_GetTag(Params, "emoticon-num");
	this.Room.RoomDefault = UTILS_GetTag(Params, "room-default");
	// Max chat input length
	this.Room.MaxRoomChar = UTILS_GetTag(Params, "max-chat-char");

	this.ChallengeList = new Array();
	this.ChallengeSequence = 0;
	this.ChallengeMenu = null;
	this.AnnounceList = new Array();
	this.PostponeList = new Array();


	/************************ GAME DATA *************************/
	this.Game = new Object();
	this.Game.Current = null;
	this.Game.GameList = new Array();

	/************************ OLDGAME DATA***********************/
	this.OldGame = new Object();
	this.OldGame.Current = null;
	this.OldGame.OldGameList = new Array();

	this.SearchGameMaxId = 0;
	this.SearchGameInfoList = new Array();

	this.Rating = new Object();
	this.CurrentRating = "blitz";
	
	this.ProfileList = new Array();
	this.MyProfile = new Object();
	this.Photo = null;
	this.AwayCounter = null;
	this.Type = "user";


	this.Windows = new Object();
	this.Windows.Focus = null;
	this.Windows.WindowList = new Array();

}

// Adding methods
/*CONNECTION METHODS***************************/
DATA.prototype.AddHttpPost = DATA_AddHttpPost;
DATA.prototype.RemoveHttpPost = DATA_RemoveHttpPost;
DATA.prototype.FindHttpPost = DATA_FindHttpPost;
DATA.prototype.GetHttpRequestLength =  DATA_GetHttpRequestLength;
DATA.prototype.GetConnectionStatus = DATA_GetConnectionStatus;
DATA.prototype.SetConnectionStatus = DATA_SetConnectionStatus;
DATA.prototype.GetRID = DATA_GetRID;
DATA.prototype.SetRID = DATA_SetRID;
DATA.prototype.GetSID = DATA_GetSID;
DATA.prototype.SetSID = DATA_SetSID;

/*CONFIGURATION METHODS************************/
DATA.prototype.GetHost = DATA_GetHost;
DATA.prototype.GetHostPost = DATA_GetHostPost;
DATA.prototype.GetBrowser = DATA_GetBrowser;
DATA.prototype.GetResource = DATA_Getresource;
DATA.prototype.GetServer = DATA_GetServer;
DATA.prototype.GetConferenceComponent = DATA_GetConferenceComponent;
DATA.prototype.GetSearchComponent = DATA_GetSearchComponent;
DATA.prototype.GetText = DATA_GetText;
DATA.prototype.SetText = DATA_SetText;
DATA.prototype.GetConst = DATA_GetConst;
DATA.prototype.GetXmlns = DATA_GetXmlns;
DATA.prototype.GetVersion = DATA_GetVersion;
DATA.prototype.GetCookieValidity = DATA_GetCookieValidity;
DATA.prototype.GetLang = DATA_GetLang;
DATA.prototype.SetLang = DATA_SetLang;
DATA.prototype.GetDefaultPHP = DATA_GetDefaultPHP;


/*CONTACT METHODS************************/
DATA.prototype.AddContactUser = DATA_AddContactUser;
DATA.prototype.RemoveContactUser = DATA_RemoveContactUser;
DATA.prototype.FindContactUser = DATA_FindContactUser;
DATA.prototype.GetContactUser = DATA_GetContactUser;
DATA.prototype.SortContactUserByNick = DATA_SortContactUserByNick;
DATA.prototype.SortContactUserByRating = DATA_SortContactUserByRating;
//DATA.prototype.IsContact = DATA_IsContact; -> Fazer no contact.js

// TODO --> TERMINAR DE FAZER OS METODOS DO USER LIST
// TODO --> ADAPTAR AS FUNCOES DOS CONTROLADORES PARA OS METODOS
DATA.prototype.GetContactUserList = DATA_GetContactUserList;
DATA.prototype.SetContactObj = DATA_SetContactObj;
DATA.prototype.GetContactObj = DATA_GetContactObj;
DATA.prototype.SetContactOrderBy = DATA_SetContactOrderBy;
DATA.prototype.GetContactOrderBy = DATA_GetContactOrderBy;
DATA.prototype.SetContactCurrentRating = DATA_SetContactCurrentRating;
DATA.prototype.GetContactCurrentRating = DATA_GetContactCurrentRating;

/*ONLINE LIST METHODS************************/
DATA.prototype.AddOnlineUser = DATA_AddOnlineUser;
DATA.prototype.RemoveOnlineUser = DATA_RemoveOnlineUser;
DATA.prototype.FindOnlineUser = DATA_FindOnlineUser;
DATA.prototype.GetOnlineUser = DATA_GetOnlineUser;
DATA.prototype.SortOnlineUserByNick = DATA_SortOnlineUserByNick;
DATA.prototype.SortOnlineUserByRating = DATA_SortOnlineUserByRating;

DATA.prototype.GetOnlineUserList = DATA_GetOnlineUserList;
DATA.prototype.SetOnlineObj = DATA_SetOnlineObj;
DATA.prototype.GetOnlineObj = DATA_GetOnlineObj;
DATA.prototype.SetOnlineOrderBy = DATA_SetOnlineOrderBy;
DATA.prototype.GetOnlineOrderBy = DATA_GetOnlineOrderBy;
DATA.prototype.SetOnlineCurrentRating = DATA_SetOnlineCurrentRating;
DATA.prototype.GetOnlineCurrentRating = DATA_GetOnlineCurrentRating;

/*USERLIST METHODS***********************/
DATA.prototype.AddUser = DATA_AddUser;
DATA.prototype.RemoveUser = DATA_RemoveUser;
DATA.prototype.FindUser = DATA_FindUser;
DATA.prototype.GetUser = DATA_GetUser;
DATA.prototype.GetUserList = DATA_GetUserList;

DATA.prototype.SetUpdateTimer = DATA_SetUpdateTimer;
DATA.prototype.GetUpdateTimer = DATA_GetUpdateTimer;

/*
DATA.prototype.GetStatus = DATA_GetStatus;
DATA.prototype.GetRating = DATA_GetRating;
DATA.prototype.GetType = DATA_GetType;
DATA.prototype.SetDefault = DATA_SetDefault;
DATA.prototype.SetUserStatus = DATA_SetUserStatus;
DATA.prototype.SetSubs = DATA_SetSubs;
DATA.prototype.SetRating = DATA_SetRating;
DATA.prototype.SetType = DATA_SetType;
*/

/*ROOM METHODS ********************************/
DATA.prototype.AddRoom = DATA_AddRoom;
DATA.prototype.RemoveRoom = DATA_RemoveRoom;
DATA.prototype.FindRoom = DATA_FindRoom;
DATA.prototype.SetRoomInformation = DATA_SetRoomInformation;

DATA.prototype.GetRoomList = DATA_GetRoomList;
DATA.prototype.GetEmoticonNum = DATA_GetEmoticonNum;
DATA.prototype.GetMaxRooms = DATA_GetMaxRooms;
DATA.prototype.GetMaxRoomChar = DATA_GetMaxRoomChar;
DATA.prototype.GetRoomDefault = DATA_GetRoomDefault;
DATA.prototype.SetCurrentRoom = DATA_SetCurrentRoom;
DATA.prototype.GetCurrentRoom = DATA_GetCurrentRoom;

/*
DATA.prototype.SetRoomCurrentRating = DATA_SetRoomCurrentRating;
DATA.prototype.GetRoomCurrentRating = DATA_GetRoomCurrentRating;
DATA.prototype.AddUserInRoom = DATA_AddUserInRoom;
DATA.prototype.FindUserInRoom = DATA_FindUserInRoom;
DATA.prototype.FindNextUserInRoom = DATA_FindNextUserInRoom;
DATA.prototype.SetUserAttrInRoom = DATA_SetUserAttrInRoom;
DATA.prototype.RemoveUserInRoom = DATA_RemoveUserInRoom;
DATA.prototype.GetUserRatingInRoom = DATA_GetUserRatingInRoom;
*/
DATA.prototype.GetRoom = DATA_GetRoom;
/*
DATA.prototype.SortUserByNickInRoom = DATA_SortUserByNickInRoom;
DATA.prototype.SortUserByRatingInRoom = DATA_SortUserByRatingInRoom;
*/
/*CHAT METHODS ********************************/
DATA.prototype.AddChat = DATA_AddChat;
DATA.prototype.RemoveChat = DATA_RemoveChat;
DATA.prototype.FindChat = DATA_FindChat;
DATA.prototype.GetChat = DATA_GetChat;
DATA.prototype.GetChatListLength = DATA_GetChatListLength;
DATA.prototype.SetMaxChats = DATA_SetMaxChats;
DATA.prototype.GetMaxChats = DATA_GetMaxChats;
DATA.prototype.SetMaxChatChar = DATA_SetMaxChatChar;
DATA.prototype.GetMaxChatChar = DATA_GetMaxChatChar;
DATA.prototype.AddShowChat = DATA_AddShowChat;
DATA.prototype.RemoveShowChat = DATA_RemoveShowChat;

DATA.prototype.AddChallenge = DATA_AddChallenge;
DATA.prototype.RemoveChallenge = DATA_RemoveChallenge;
DATA.prototype.FindChallenge = DATA_FindChallenge;
DATA.prototype.UpdateChallenge = DATA_UpdateChallenge;
DATA.prototype.ClearChallenges = DATA_ClearChallenges;
DATA.prototype.AddChallengeWindow = DATA_AddChallengeWindow;

DATA.prototype.AddPostpone = DATA_AddPostpone;
DATA.prototype.RemovePostpone = DATA_RemovePostpone;
DATA.prototype.FindPostpone = DATA_FindPostpone;

DATA.prototype.AddAnnounce = DATA_AddAnnounce;
DATA.prototype.RemoveAnnounce = DATA_RemoveAnnounce;
DATA.prototype.ClearAnnounces = DATA_ClearAnnounces;
DATA.prototype.FindAnnounce = DATA_FindAnnounce;

/*GAME METHODS ********************************/
DATA.prototype.AddGame = DATA_AddGame;
DATA.prototype.RemoveGame = DATA_RemoveGame;
DATA.prototype.FindGame = DATA_FindGame;
DATA.prototype.AddGameMove = DATA_AddGameMove;
DATA.prototype.SetCurrentGame = DATA_SetCurrentGame;
DATA.prototype.GetCurrentGame = DATA_GetCurrentGame;
DATA.prototype.SetTurn = DATA_SetTurnGame;
DATA.prototype.GetGame = DATA_GetGame;

/*OLDGAME METHODS *****************************/
DATA.prototype.AddOldGame = DATA_AddOldGame;
DATA.prototype.RemoveOldGame = DATA_RemoveOldGame;
DATA.prototype.SetCurrentOldGame = DATA_SetCurrentOldGame;
DATA.prototype.GetCurrentOldGame = DATA_GetCurrentOldGame;
DATA.prototype.PushOldGame = DATA_PushGameToOldGame;
DATA.prototype.GetOldGame = DATA_GetOldGame;

DATA.prototype.AddSearchGameInfo = DATA_AddSearchGameInfo;
DATA.prototype.RemoveSearchGameInfo = DATA_RemoveSearchGameInfo;
DATA.prototype.FindSearchGameInfo = DATA_FindSearchGameInfo;
DATA.prototype.GetSearchGameInfo = DATA_GetSearchGameInfo;

/*WINDOW METHODS ******************************/
DATA.prototype.AddWindow = DATA_AddWindow;
DATA.prototype.RemoveWindow = DATA_RemoveWindow;
DATA.prototype.FindWindow = DATA_FindWindow;
DATA.prototype.GetWindow = DATA_GetWindow;
DATA.prototype.SetWindowFocus = DATA_SetWindowFocus;
DATA.prototype.GetWindowFocus = DATA_GetWindowFocus;
DATA.prototype.GetWindowListLength = DATA_GetWindowListLength;

DATA.prototype.AddProfile = DATA_AddProfile;
DATA.prototype.RemoveProfile = DATA_RemoveProfile;
DATA.prototype.FindProfile = DATA_FindProfile;
DATA.prototype.GetProfile = DATA_GetProfile;

DATA.prototype.SetMyProfile = DATA_SetMyProfile;


/**********************************
 * METHODS - HTTP REQUEST         *
 **********************************/

function DATA_AddHttpPost(PostObj)
{
	this.Connection.HttpRequest.push(PostObj);
}

function DATA_RemoveHttpPost(PostObj)
{
	var i;

	i = this.FindHttpPost(PostObj)

	if(i != null)
	{
		this.Connection.HttpRequest.splice(i,1);
	}

	delete PostObj;
}

function DATA_FindHttpPost(PostObj)
{
	var i=0;

	while((i < this.Connection.HttpRequest.length)&&(this.Connection.HttpRequest[i] != PostObj))
	{
		i++;
	}

	if(i >= this.Connection.HttpRequest.length)
	{
		return null;
	}
	else
	{
		return i;
	}
}


function DATA_GetHttpRequestLength()
{
	return this.Connection.HttpRequest.length;
}

function DATA_GetConnectionStatus()
{
	return this.Connection.ConnectionStatus;
}

function DATA_SetConnectionStatus(Value)
{
	this.Connection.ConnectionStatus = Value;
}

function DATA_GetRID()
{
	return this.Connection.RID;
}

function DATA_SetRID(Value)
{
	this.Connection.RID = Value;
}

function DATA_GetSID()
{
	return this.Connection.SID;
}

function DATA_SetSID(Value)
{
	this.Connection.SID = Value;
}


/**********************************
 * METHODS - CONFIGURATON DATA    *
 **********************************/
function DATA_GetHost()
{
	return this.Conf.Host;
}
function DATA_GetHostPost()
{
	return this.Conf.HostPost;
}
function DATA_GetBrowser()
{
	return this.Conf.Browser;
}
function DATA_Getresource()
{
	return this.Conf.Resource;
}
function DATA_GetServer()
{
	return this.Conf.Server;
}
function DATA_GetConferenceComponent()
{
	return this.Conf.ConferenceComponent;
}
function DATA_GetSearchComponent()
{
	return this.Conf.SearchComponent;
}
function DATA_GetText()
{
	return this.Conf.GetText;
}
function DATA_SetText(FileXML)
{
	this.Conf.GetText = FileXML;
}
function DATA_GetConst()
{
	return this.Conf.Const;
}
function DATA_GetXmlns()
{
	return this.Conf.Xmlns;
}
function DATA_GetVersion()
{
	return this.Conf.Version;
}
function DATA_GetCookieValidity()
{
	return this.Conf.CookieValidity;
}
function DATA_GetLang()
{
	return this.Conf.Lang;
}
function DATA_SetLang(Lang)
{
	this.Conf.Lang = Lang;
}
function DATA_GetDefaultPHP()
{
	return this.Conf.DefaultPHP;
}


/**********************************
 * METHODS - CONTACT USER LIST    *
 **********************************/
function DATA_AddContactUser(Username, Status, Subs, Group)
{
	// Creating a new object
	var User = new Object();

	// Setting atributes
	// The user's rating will be seted after
	User.Username = Username;
	User.Status = Status;
	User.Subs = Subs;
	User.Group = Group;
	User.Rating = DATA_RatingObject();
	User.Type = "";
	
	User.GetUsername = DATA_GetUsername;
	User.SetStatus = DATA_SetStatus;
	User.GetStatus = DATA_GetStatus;
	User.SetSubs = DATA_SetSubs;
	User.GetSubs = DATA_GetSubs;
	User.GetGroup = DATA_GetGroup;
	User.SetGroup = DATA_SetGroup;
 
	User.GetRating = DATA_GetRating;
	User.SetType = DATA_SetType;
	User.GetType = DATA_GetType;

	return this.Contact.UserList.push(User);

}
function DATA_RemoveContactUser(Username)
{
	var Pos = MainData.FindContactUser(Username)
	
	if(Pos != null)
	{
		return this.Contact.UserList.splice(Pos,1);
	}
	else
	{
		return null;
	}
}

function DATA_FindContactUser(Username)
{
	var i;
	
	for(i = 0; i < this.Contact.UserList.length; i++)
	{
		if(this.Contact.UserList[i].Username == Username)
		{
			return i;
		}
	}
	return null;
}
function DATA_GetContactUser(Username)
{
	var Pos = MainData.FindContactUser(Username);
	
	if(Pos != null)
	{
		return this.Contact.UserList[Pos];
	}
	else
	{
		return null;
	}
}

/**
* @brief		Sort Userlist into ascending or descending order
*
* @author		Danilo Yorinori
* @return		boolean
* @see			UTILS_SortByUsernameAsc UTILS_SortByUsernameDsc
*/
function DATA_SortContactUserByNick()
{
	if (this.Contact.OrderBy == "0")
	{
		this.Contact.UserList.sort(UTILS_SortByUsernameAsc);
	}
	else
	{
		this.Contact.UserList.sort(UTILS_SortByUsernameDsc);
	}
	return true;
}

/**
* @brief		Sort Userlist into descending order by Rating selected in interface
*
* @author		Danilo Yorinori
* @return		boolean
* @see			UTILS_SortByRatingDsc
*/
function DATA_SortContactUserByRating()
{
	this.Contact.UserList.sort(UTILS_SortContactByRatingDsc);

	return true;
}

function DATA_GetContactUserList()
{
	return this.Contact.UserList;
}


function DATA_SetContactObj(Obj)
{
	this.Contact.Obj = Obj;
}

function DATA_GetContactObj()
{
	return this.Contact.Obj;
}

function DATA_SetContactOrderBy(NewValue)
{
	this.Contact.OrderBy = NewValue;
}

function DATA_GetContactOrderBy()
{
	return this.Contact.OrderBy;
}

function DATA_SetContactCurrentRating(NewCategory)
{
	this.Contact.CurrentRating = NewCategory;
}

function DATA_GetContactCurrentRating()
{
	return this.Contact.CurrentRating;
}

/**********************************
 * METHODS - CONTACT USER LIST    *
 **********************************/
function DATA_AddOnlineUser(Username, Status, Type)
{
	// Creating a new object
	var User = new Object();

	// Setting atributes
	// The user's rating will be seted after
	User.Username = Username;
	User.Status = Status;
	User.Rating = DATA_RatingObject();
	User.Type = Type;
	
	User.GetUsername = DATA_GetUsername;
	User.SetStatus = DATA_SetStatus;
	User.GetStatus = DATA_GetStatus;
 
	User.GetRating = DATA_GetRating;
	User.SetType = DATA_SetType;
	User.GetType = DATA_GetType;

	return this.Online.UserList.push(User);

}
function DATA_RemoveOnlineUser(Username)
{
	var Pos = MainData.FindOnlineUser(Username)
	
	if(Pos != null)
	{
		return this.Online.UserList.splice(Pos,1);
	}
	else
	{
		return null;
	}
}

function DATA_FindOnlineUser(Username)
{
	var i;
	
	for(i = 0; i < this.Online.UserList.length; i++)
	{
		if(this.Online.UserList[i].Username == Username)
		{
			return i;
		}
	}
	return null;
}
function DATA_GetOnlineUser(Username)
{
	var Pos = MainData.FindOnlineUser(Username);
	
	if(Pos != null)
	{
		return this.Online.UserList[Pos];
	}
	else
	{
		return null;
	}
}

/**
* @brief		Sort Userlist into ascending or descending order
*
* @author		Danilo Yorinori
* @return		boolean
* @see			UTILS_SortByUsernameAsc UTILS_SortByUsernameDsc
*/
function DATA_SortOnlineUserByNick()
{
	if (this.Online.OrderBy == "0")
	{
		this.Online.UserList.sort(UTILS_SortByUsernameAsc);
	}
	else
	{
		this.Online.UserList.sort(UTILS_SortByUsernameDsc);
	}
	return true;
}

/**
* @brief		Sort Userlist into descending order by Rating selected in interface
*
* @author		Danilo Yorinori
* @return		boolean
* @see			UTILS_SortByRatingDsc
*/
function DATA_SortOnlineUserByRating()
{
	this.Online.UserList.sort(UTILS_SortOnlineByRatingDsc);

	return true;
}

function DATA_GetOnlineUserList()
{
	return this.Online.UserList;
}

function DATA_SetOnlineObj(Obj)
{
	this.Online.Obj = Obj;
}

function DATA_GetOnlineObj()
{
	return this.Online.Obj;
}

function DATA_SetOnlineOrderBy(NewValue)
{
	this.Online.OrderBy = NewValue;
}

function DATA_GetOnlineOrderBy()
{
	return this.Online.OrderBy;
}

function DATA_SetOnlineCurrentRating(NewCategory)
{
	this.Online.CurrentRating = NewCategory;
}

function DATA_GetOnlineCurrentRating()
{
	return this.Online.CurrentRating;
}



/**********************************
 * METHODS - USER OBJECT          *
 **********************************/
function DATA_GetUsername()
{
	return this.Username;
}
function DATA_SetStatus(NewStatus)
{
	this.Username.Status = NewStatus;
}
function DATA_GetStatus()
{
	return this.Status;
}
function DATA_SetSubs(NewSubs)
{
	this.Subs = NewSubs;
}
function DATA_GetSubs()
{
	return this.Subs;
}
function DATA_SetGroup(NewGroup)
{
	this.Group = NewGroup;
}
function DATA_GetGroup()
{
	return this.Group;
}
 
function DATA_SetPhoto(NewPhoto)
{
	this.Photo = NewPhoto;
}
function DATA_GetPhoto()
{
	return this.Photo;
}

function DATA_GetRating()
{
	return this.Rating;
}
function DATA_SetType(NewType)
{
	this.Type = NewType;
}
function DATA_GetType()
{
	return this.Type;
}

function DATA_SetRole(NewRole)
{
	this.Role = NewRole;
}

function DATA_GetRole()
{
	return this.Role;
}

function DATA_SetAfilliation(NewAfilliation)
{
	this.Afilliation = NewAfilliation;
}

function DATA_GetAfilliation()
{
	return this.Afilliation;
}

function DATA_GetUpdateRating()
{
	return this.UpdateRating;
}

function DATA_SetUpdateRating(Bool)
{
	this.UpdateRating = Bool;
}
/**
* @brief		Change the user's subscription
*
* @param		Username  User name 
* @param		NewSubs   New Username subscriptioon 
* @author		Ulysses Bonfim
* @return 		false if the user is not on your list, true otherwise
* @see			DATA_FindUser 
*/
/*
function DATA_SetSubs(Username, NewSubs)
{
	var UserPos = this.FindUser(Username);

	if (UserPos == null)
		return false;
		
	this.UserList[UserPos].Subs = NewSubs;
	return true;
}
*/
/**********************************
 * METHODS - RATING OBJECT        *
 **********************************/
/*
* Rating Object is used to manage user's rating;
* This object contains a list of rating with rating type (obj.Category)
* and this type value (obj.Value)
*/
function DATA_RatingObject()
{
	var RatingObj = new Object();

	RatingObj.RatingList = new Array();

	RatingObj.AddRating = DATA_AddRating;
	RatingObj.RemoveRating = DATA_RemoveRating;
	RatingObj.FindRating = DATA_FindRating;
	RatingObj.GetRatingValue = DATA_GetRatingValue;
	RatingObj.SetRatingValue = DATA_SetRatingValue;

	return RatingObj;
}

function DATA_AddRating(Category, Value)
{
	var Rating = new Object();
	
	Rating.Category = Category;
	Rating.Value = Value;
	
	this.RatingList.push(Rating);
}

function DATA_RemoveRating(Category)
{
	var Pos = this.FindRating(Category);

	if(Pos != null)
	{
		this.RatingList.splice(Pos,i);
	}
}

function DATA_FindRating(Category)
{
	var i;

	for (i = 0; i<this.RatingList.length; i++)
	{
		if (this.RatingList[i].Category == Category)
		{
			return i;
		}
	}
	return null;

}
function DATA_GetRatingValue(Category)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		return this.RatingList[Pos].Value;
	}
	else
	{
		return null;
	}
}

function DATA_SetRatingValue(Category, Value)
{
	var Pos = this.FindRating(Category);

	if(Pos != null)
	{
		this.RatingList[Pos].Value = Value;
	}
	else
	{
		return null;
	}
}

/**********************************
 * METHODS - USER LIST            *
 **********************************/

/**
* @brief		Add user to user list
*
* Search the user in DATA.UserList, if the user wasn't found,
* add the user in the list with a blank photo and a empty rating.
*
* @param 		Username The user's name to add in structure
* @param		Status 	 The user's status
* @param 		Subs 	 User's subscription
* @author		Ulysses Bonfim
* @return 		false - User already on list, true otherwise
*/
function DATA_AddUser(Username, Status)
{
	// Creating a new object
	var User = new Object();

	// Setting atributes
	// The user's rating will be seted after
	User.Username = Username;
	User.Photo = "";
	User.Status = Status;
	User.Rating = DATA_RatingObject();
	User.Type = "";
	User.UpdateRating = true;

	User.GetUsername = DATA_GetUsername;
	User.SetStatus = DATA_SetStatus;
	User.GetStatus = DATA_GetStatus;

	User.SetPhoto = DATA_SetPhoto;
	User.GetPhoto = DATA_GetPhoto; 
	User.GetRating = DATA_GetRating;
	User.SetType = DATA_SetType;
	User.GetType = DATA_GetType;
	User.SetUpdateRating = DATA_SetUpdateRating;
	User.GetUpdateRating = DATA_GetUpdateRating;

	this.Users.UserList.push(User);
}

/**
* @brief		Delete user from user list
* 
* Search and remove the user of DATA.UserList 
* 
* @param		Username User's name to remove of structure
* @author		Pedro
* @return 		null if user is not on your list, true otherwise
* @see 			DATA_FindUser
*/
function DATA_RemoveUser(Username)
{
	var i;

	// Searching user position
	i = this.FindUser(Username);

	// If user do not exist
	if (i == null)
	{
		return null;
	}
	// Removing user from user list
	this.Users.UserList.splice(i, 1);
	return true;
}

/**
* @brief		Find user in user list
* 
* @param		Username User's name to search
* @author		Pedro
* @return 		null if user is not on your list, the structure User otherwise
*/
function DATA_FindUser(Username)
{
	var i;

	for (i=0; i<this.Users.UserList.length; i++)
	{
		if (this.Users.UserList[i].Username == Username)
			return i;
	}
	return null;
}

function DATA_GetUser(Username)
{
	var i = this.FindUser(Username);

	if(i!=null)
	{
		return this.Users.UserList[i];
	}

	return null;
}

function DATA_GetUserList()
{
	return this.Users.UserList;
}


function DATA_SetUpdateTimer(Interval)
{
	this.Users.UpdateTimer = Interval;
}

function DATA_GetUpdateTimer()
{
	return this.Users.UpdateTimer;
}

/**
* @brief		Find next user in user list	
* @deprecated
*
* @param		Username Base user to search the next
* @param 		Status	 Status of user to search the next 
* @author		Danilo Yorinori
* @return 		The struct user founded, null otherwise
* @see			DATA_FindUser
*/
/*
function DATA_FindNextUser(Username, Status)
{
	var i, Index;

	// Take the index in struct of user
	Index = this.FindUser(Username);
	
	// 
	if ((this.OrderBy == "0") || (this.OrderBy == "1"))
	{
		Index++;
		for (i=Index; i<this.UserList.length; i++)
		{
			if (Status != "offline")
			{
				if (this.UserList[i].Status != "offline")
				{
					return i;
				}
			}
			else
			{
				if (this.UserList[i].Status == "offline")
				{
					return i;
				}
			}
		}
		return null;
	}
	else
	{
		return null;
	}
}
*/

/**
* @brief		Is 'Username' in your contact list?
*
* @param		Username User name to search
* @author		Danilo Yorinori
* @return 		Boolean
* @see			DATA_FindUser
*/
/*
function DATA_IsContact(Username)
{
	var i;

	i = this.FindUser(Username);

	if (i == null)
	{
		return false;
	}
	else
	{
		return true;
	}
}
*/
/**
* @brief		Get User status
*
* Get the user status on jabber.
* Search user in default room and return user status. 
*
* @param		Username User name to search
* @return 		If the user is not on Default room and Contact List, return offline
* 				Else return the user status.
* @see			DATA_FindRoom, DATA_FindUser DATA_FindUserInRoom
*/
/*
function DATA_GetStatus(Username)
{
	var User;
	var Room = MainData.GetRoom(MainData.GetRoomDefault());

	// TODO -> FIX IT TO WORK WITH USERLIST
	User = Room.GetUser(Username);

	if (User != null)
	{
		return User.Status;
	}
	else {
		User = this.FindUser(Username);
		if (User != null)
		{
			return this.UserList[User].Status;
		}
	}
	return "offline";
}
*/
/**
* @brief		Get the User's rating
*
* Get the user's rating (in a structure, with all types of reating) 
* on chess server.
*
* @param		Username User name to search
* @author		Danilo Yorinori
* @return 		If the user is not on your list and the RoomList, false.
* 				Else return the user's rating in a structure.
* @see			DATA_FindUser DATA_FindUserInRoom
*/
/*
function DATA_GetRating(Username)
{
	var UserPos = this.FindUser(Username);
	var i;
	var Room;
	var RoomList = MainData.GetRoomList();
	var User;

	if (UserPos)
	{
		return this.UserList[UserPos].Rating;
	}

	// TODO -> FIX IT TO WORK WITH USERLIST
	// Update rating in room user lists
	for (i=0; i<RoomList.length; i++)
	{
		Room = RoomList[i];

		User = Room.GetUser(Username);

		if (User != null)
		{
			return User.Rating;
		}
	}
	return null;
}
*/
/**
* @brief		Get the User's type
*
* @param		Username User name to search
* @author		Danilo Yorinori
* @return 		If the user is not on your list and the RoomList, false.
* 				Else return the user's type.
* @see			DATA_FindUser DATA_FindUserInRoom
*/
/*
function DATA_GetType(Username)
{
	var UserPos = this.FindUser(Username);
	var i;
	var User;
	var Room;
	var RoomList = MainData.GetRoomList();

	if (UserPos != null)
	{
		return this.UserList[UserPos].Type;
	}

	// TODO -> FIX IT TO WORK WITH USERLIST
	// Find type in room user lists
	for (i=0; i<RoomList.length; i++)
	{
		Room = RoomList[i];
		User = Room.GetUser(Username);

		if (User!= null)
		{
			return User.Type;
		}
	}
	return null;
}
*/
/**
* @brief		Set default values to use
*
* Set "user" to DATA.Type and 0 to rating types.
*
* @author		Pedro Eugenio
*/
/*
function DATA_SetDefault(Username)
{
	this.Type = "user";
	this.RatingBlitz = "0";
	this.RatingStandard = "0";
	this.RatingLightning = "0";
}

/**
* @brief		Change the user's status
*
* @param		Username  User name 
* @param		NewStatus New Username status
* @author		Danilo Yorinori
* @return 		false if the user is not on your list, true otherwise
* @see			DATA_FindUser 
*/
/*
function DATA_SetUserStatus(Username, NewStatus)
{
	var UserPos = this.FindUser(Username);

	if (UserPos == null)
		return false;
		
	this.UserList[UserPos].Status = NewStatus;
	return true;
}
*/


/**
* @brief		Change user's type
*
* Search in your contact list and in all rooms that the user 
* is, and change his/her status. If the given username is your 
* own name, change on DATA the user type.
*
* @param		Username  User name 
* @param		NewType   New Username Type
* @author		Danilo Yorinori
* @return 		true
* @see			DATA_FindUser DATA_FindUserInRoom
*/
/*
function DATA_SetType(Username, NewType)
{
	var UserPos = this.FindUser(Username);
	var i;
	var User;
	var RoomList = MainData.GetRoomList();
	var Room;

	// If it's your type
	if (Username == MainData.Username)
	{
		MainData.Type = NewType;
		return true;
	}

	// Update in contact list
	if (UserPos != null)
	{
		// TODO -> FIX IT TO WORK WITH CONTACT LIST
		this.UserList[UserPos].Type = NewType;
	}

	// Update in room user list
	for (i=0; i<RoomList.length; i++)
	{
		Room = RoomList[i];
		User = Room.GetUser(Username);

		if(User != null)
		{
			User.Type = NewType;
		}
	}

	return true;
}
*/

/**
* @brief		Change user's rating 
*
* Search in your contact list and in all rooms that the user 
* is, and change his/her rating.
*
* @param		Username  User name 
* @param		Category  Category of rating   
* @param		Rating    The new rating value
* @author		Danilo Yorinori
* @return 		true
* @see			DATA_FindUser DATA_FindUserInRoom UTILS_Capitalize
*/
/*
function DATA_SetRating(Username, Category, Rating)
{
	var UserPos, Obj, i;
	var RoomList, Room;
	// Set correct object to append rating
	if (MainData.Username == Username)
	{
		Obj = MainData;
	}
	else
	{
		UserPos = MainData.FindUser(Username);
		Obj = MainData.UserList[UserPos];
	}
	
	if (Obj)
	{
		eval("Obj.Rating."+UTILS_Capitalize(Category)+" = Rating");
	}
	
	RoomList = this.GetRoomList();
	// Update rating in room user lists
	for (i=0; i<RoomList.length; i++)
	{
		Room = RoomList[i];
		//TODO -> FIX IT TO WORK WITH USERLIST
		UserPos = Room.FindUser(Username);

		if (UserPos != null)
		{
			eval("this.Room.RoomList["+i+"].UserList["+UserPos+"].Rating."+UTILS_Capitalize(Category)+" = Rating");
		}
	}
	return true;
}
*/
/**********************************
 * METHODS - ROOM LIST            *
 **********************************/

/**
* @brief		Create new room in room list
*
* @param		RoomName	New room's name
* @param		MsgTo		Where the messages will be send 
* @param		Role		Your role in room
* @param		Affiliation	Your affiliation in room
* @param		RoomObj		Room object, used to control the interface
* @author		Pedro Eugenio
* @return		The new room object
* @see			DATA_FindRoom
*/
function DATA_AddRoom(RoomName, MsgTo, Role, Affiliation, RoomObj)
{
	// Creating a new object
	var Room = new Object();

	//if (this.FindRoom(RoomName) != null || this.MaxRooms <= this.RoomList.length)
	//	return false;

	// Setting atributes
	Room.UserList = new Array();
	Room.Name = RoomName;
	Room.MsgTo = MsgTo;
	Room.Role = Role;
	Room.Affiliation = Affiliation;
	Room.OrderBy = 0;
	Room.Room = RoomObj;
	Room.CurrentRating = "blitz";

	// Setting Methods
	Room.AddUser = DATA_AddUserInRoom;
	Room.RemoveUser = DATA_RemoveUserInRoom;
	Room.FindUser = DATA_FindUserInRoom;
	Room.GetUser = DATA_GetUserInRoom;
	Room.SetUserInformation = DATA_SetUserInfoInRoom;
	Room.GetUserRating = DATA_GetUserRatingInRoom;
	Room.SortUserListNick = DATA_SortUserByNickInRoom;
	Room.SortUserListRating = DATA_SortUserByRatingInRoom;
	Room.SetRoomCurrentRating = DATA_SetRoomCurrentRating;
	Room.GetRoomCurrentRating = DATA_GetRoomCurrentRating;
	Room.SetOrderBy = DATA_SetRoomOrderBy;
	Room.GetOrderBy = DATA_GetRoomOrderBy;

	this.Room.RoomList.push(Room);
	return Room;
}

/**
* @brief		Delete a room in room list
*
* @param		RoomName	Room name to remove
* @author		Pedro Eugenio
* @return		Boolean
* @see			DATA_FindRoom
*/
function DATA_RemoveRoom(RoomName)
{
	var i = this.FindRoom(RoomName);

	// If room do not exist
	if (i == null)
		return null;

	// Removing room from room list
	this.Room.RoomList.splice(i, 1);
	return true;
}

/**
* @brief		Find room in room list
*
* @param		RoomName	Room name to remove
* @author		Pedro Eugenio
* @return		Room structure founded or null
*/
function DATA_FindRoom(RoomName)
{
	var i;

	for (i=0; i<this.Room.RoomList.length; i++)
	{
		if (this.Room.RoomList[i].Name == RoomName)
			return i;
	}
	return null;
}

/**
* @brief		Set from, affiliation and role in 'RoomName' structure.
*
* Only for interface user
*
* @param		RoomName	Room name 
* @param		From		Where the messages will be send 
* @param		Affiliation New room's affiliation 	
* @param		Role		New room's role
* @author		Pedro Eugenio
* @return		null, if the room doesn't exist, true otherwise
* @see			DATA_FindRoom
*/
function DATA_SetRoomInformation(RoomName, From, Affiliation, Role)
{
	var i = this.FindRoom(RoomName);

	if (i == null)
	{
		return null;
	}

	MainData.Room.RoomList[i].MsgTo = From;
	MainData.Room.RoomList[i].Affiliation = Affiliation;
	MainData.Room.RoomList[i].Role = Role;
	
	return true;
}

function DATA_GetRoomList()
{
	return this.Room.RoomList;
}
function DATA_GetEmoticonNum()
{
	return this.Room.EmoticonNum;
}
function DATA_GetMaxRooms()
{
	return this.Room.MaxRooms;
}
function DATA_GetMaxRoomChar()
{
	return this.Room.MaxRoomChar;
}
function DATA_GetRoomDefault()
{
	return this.Room.RoomDefault;
}
function DATA_SetCurrentRoom(RoomObj)
{
	this.Room.Current = RoomObj;
}
function DATA_GetCurrentRoom()
{
	return this.Room.Current;
}


/**
* @brief		Add user in user list of a room
* @param		RoomName	Room name 
* @param		Username 	The new user
* @param		Status		New user's status
* @param		Type		New user's type
* @param		Role		New user's role
* @param		Affiliation	New user's affiliation
* @author		Pedro Eugenio
* @return		true
* @see			DATA_FindRoom DATA_FindUser
*/
function DATA_AddUserInRoom(Username, Status, Type, Role, Affiliation)
{
	var User = new Object();
	var UserPos = MainData.FindUser(Username);
	var Room;
	var UserObj;
	// If room doesnt exists in data structure
/*
	if (RoomPos == null)
	{
		throw "RoomNotCreatedException";
	}
	if (UserPos != null)
	{
		throw "UserAlreadyInRoomException";
	}
*/

	User.Username = Username;
	User.Status = Status;
	User.Role = Role;
	User.Affiliation = Affiliation;
	User.Type = Type;
	User.Rating = DATA_RatingObject();

/*
	if (Username == MainData.Username)
	{
		User.Rating = MainData.Rating;
	}
	else if (UserPos == null)
	{
		User.Rating = new Object();
	}
	else
	{
		// Get rating from general room
		Room = MainData.GetRoom(MainData.GetRoomDefault());
		User.Rating = Room.UserList[UserPos].Rating;
	}
*/
	User.GetUsername = DATA_GetUsername;
	User.SetStatus = DATA_SetStatus;
	User.GetStatus = DATA_GetStatus;

	User.SetPhoto = DATA_SetPhoto;
	User.GetPhoto = DATA_GetPhoto; 
	User.GetRating = DATA_GetRating;
	User.SetType = DATA_SetType;
	User.GetType = DATA_GetType;

	User.SetRole = DATA_SetRole;
	User.GetRole = DATA_GetRole;
	User.SetAffiliation = DATA_SetAfilliation;
	User.GetAffiliation = DATA_GetAfilliation;


	// Insert user in room's user list
	this.UserList.push(User);
	return true;
}

/**
* @brief		Find user in user list of a room
* @param		RoomName  Room to search 
* @param		Username  User to find
* @author		Pedro Eugenio
* @return		User's position on Room UserList vector, or null, if not found
* @see			DATA_FindRoom 
*/
function DATA_FindUserInRoom(Username)
{
	var i = 0;

	// Search user in room user list
	while ((i<this.UserList.length)&&(this.UserList[i].Username != Username))
	{
		i++;
	}

	if( i == this.UserList.length)
	{
		return null;
	}
	else
	{
		return i;
	}
}

function DATA_GetUserInRoom(Username)
{
	var UserPos = this.FindUser(Username);

	if(UserPos == null)
	{
		return null;
	}
	else
	{
		return this.UserList[UserPos];
	}
}

/**
* @brief		Set user attibutes in 'RoomName'
* @param		RoomName	Room to set attribute
* @param 		Username	Base user to set
* @param 		Status		New user's status
* @param 		Role		New user's Role
* @param 		Affiliation	New user's Affiliation
* @author		Danilo Yorinori
* @return 		Boolean
* @see			DATA_FindRoom DATA_FindUserInRoom
*/
function DATA_SetUserInfoInRoom(Username, Status, Role, Affiliation)
{
	var User = this.GetUser(Username)

	if (User == null)
	{
		return false;
	}

	if (Status != "")
	{
		User.Status = Status;
	}
	
	if (Role != "")
	{
		User.Role = Role;
	}
	
	if (Affiliation != "")
	{
		User.Affiliation = Affiliation;
	}
	
	return true;
}

/**
* @brief		Delete user from user list of a room
* @param		RoomName	Room name
* @param 		Username	User to remove
* @author		Danilo Yorinori
* @return 		Boolean
* @see			DATA_FindRoom DATA_FindUserInRoom
*/
function DATA_RemoveUserInRoom(Username)
{
	var i = this.FindUser(Username)

	if (i == null)
	{
		return false;
	}

	this.UserList.splice(i, 1);

	return true;
}

/**
* @brief		Get user's rating 
*
* Return Category's Rating from Username in Room
* (Based on fact that's all online users are connected to 'geral' room
*
* @param		RoomName	Room name
* @param 		Username	User name
* @param 		Category	Category which rating will be returned
* @author		Danilo Yorinori
* @return		Rating's value
* @see			DATA_FindRoom DATA_FinUserInRoom
*/
/*TODO -> REMOVE THIS FUNCTION WHEN USERSLIST IS DONE**/
function DATA_GetUserRatingInRoom(Username, Category)
{
	var RatingList, Rating, PosRoom;

	var User = this.GetUser(Username);

	RatingList = User.Rating;

	if (Category == null)
	{
		Category = MainData.GetRoomCurrentRating();
	}

	switch (Category)
	{
		case "blitz":	
			if (RatingList.Blitz)
			{
				Rating = RatingList.Blitz; 
			}
			else
			{
				Rating = "---";
			}
			break;
		case "lightning": 
			if (RatingList.Lightning)
			{
				Rating = RatingList.Lightning; 
			}
			else
			{
				Rating = "---";
			}
			break;
		case "standard": 
			if (RatingList.Standard)
			{
				Rating = RatingList.Standard; 
			}
			else
			{
				Rating = "---";
			}
		break;
		default:	Rating = "---";
	}

	return Rating;
}

/**
* @brief		Sort Userlist from Room into ascending or descending order
*
* @param		RoomName	Room to sort
* @author		Danilo Yorinori
* @return		Boolean
* @see			DATA_FindRoom UTILS_SortByUsernameAsc UTILS_SortByUsernameDsc
*/
function DATA_SortUserByNickInRoom()
{
	if (this.OrderBy == 0)
	{
		this.UserList.sort(UTILS_SortByUsernameAsc);
	}
	else
	{
		this.UserList.sort(UTILS_SortByUsernameDsc);
	}
	return true;
}

/**
* @brief		Sort Userlist from Room into descending order by Rating
* @author		Danilo Yorinori
* @return		Boolean
* @see			DATA_FindRoom UTILS_SortByUsernameDsc
*/
function DATA_SortUserByRatingInRoom()
{
	this.UserList.sort(UTILS_SortRoomByRatingDsc);

	return true;
}

/**
* @brief		Get room from room list
*
* @author		Danilo Yorinori
* @return		Boolean
* @see			DATA_FindRooom
*/
function DATA_GetRoom(RoomName)
{
	var RoomPos = this.FindRoom(RoomName);

	if(RoomPos == null)
	{
		return null
	}

	return this.Room.RoomList[RoomPos];
}


function DATA_SetRoomOrderBy(Value)
{
	this.OrderBy = Value;
}
function DATA_GetRoomOrderBy()
{
	return this.OrderBy;
}
function DATA_SetRoomCurrentRating(RatingType)
{
	this.CurrentRating = RatingType;
}
function DATA_GetRoomCurrentRating()
{
	return this.CurrentRating;
}


/**********************************
 * METHODS - CHAT  *
 **********************************/

/**
* @brief		Add a chat in interface structure, with the other user name and his status
*
* @param		Username The user that you are chating with
* @param 		Status 	 User's current status
* @author 		Ulysses Bonfim
* @return 		Boolean
* @see 			DATA_FindChat
*/
function DATA_AddChat (Username, ChatObj)
{
	var Chat = new Object();
	var i;

	// Setting atributes
	Chat.Username = Username;
	Chat.Chat = ChatObj;
	
	this.Chat.ChatList.push(Chat);

	return true;
}


/**
* @brief		Remove a chat with the user given from the structure
*
* @param		Username	The user that the chat will be removed
* @author 		Ulysses Bonfim
* @return 		void
* @see 			DATA_FindChat
*/
function DATA_RemoveChat(Username)
{
	var i;

	// Try to find Username on ChatList
	i = this.FindChat(Username);

	// No chat with the user given
	if (i == null)
	{
		return null;
	}

	else 
	{
		// Remove from the list the chat with the user
		this.Chat.ChatList.splice(i, 1);
	}

	return true;
}	



/**
* @brief		Find a chat with the user's name
*
* @param		Username	The user that you are chating with
* @author 		Ulysses Bonfim
* @return 		interger the position of the chat in structure
*/
function DATA_FindChat(Username)
{
	var i = 0;
	
	while((i<this.Chat.ChatList.length) && (this.Chat.ChatList[i].Username != Username))
	{
		i++;
	}
	
	if( i >= this.Chat.ChatList.length)
	{
		// User not found
		return null;
	}
	else
	{
		return i;
	}

}


function DATA_GetChat(Username)
{
	var i;

	i = this.FindChat(Username);

	if(i != null)
	{
		return this.Chat.ChatList[i];
	}
	else
	{
		return null;
	}
}

function DATA_GetChatListLength()
{
	return this.Chat.ChatList.length;
}

function DATA_SetMaxChats(NewMax)
{
	this.Chat.MaxChats = NewMax;
}

function DATA_GetMaxChats()
{
	return this.Chat.MaxChats;
}

function DATA_SetMaxChatChar(MaxChar)
{
	this.Chat.MaxChatChar = MaxChar;
}

function DATA_GetMaxChatChar()
{
	return this.Chat.MaxChatChar;
}

function DATA_AddShowChat(ChatObj)
{
	this.Chat.ShowChat.push(ChatObj);
}

function DATA_RemoveShowChat(Username)
{
	var i;

	i = this.FindChat(Username);

	if(i!= null)
	{
		this.Chat.ShowChat.splice(i, 1);
	}
}

/**********************************
 * METHODS - CHALLENGES           *
 **********************************/

/**
* @brief		Add a challenge in 'ChallengeList'
* @param		Username	The oponent
* @param		Id			Challenge ID
* @param		Challenger	The challenge challenger
* @author 		Ulysses Bonfim
* @return 		Boolean
*/
function DATA_AddChallenge(ChallengeId, Challenger, Challenged, Category, Rated, MatchId)
{
	// Creating a new object
	var Challenge = new Object();
	var ChallengerObj = new Object();
	var ChallengedObj = new Object();
	var i;

	i = this.FindChallenge(ChallengeId, MatchId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	ChallengerObj.Name  = Challenger.Name;
	ChallengerObj.Time  = Challenger.Time;
	ChallengerObj.Inc  = Challenger.Inc;
	ChallengerObj.Color  = Challenger.Color;

	ChallengedObj.Name  = Challenged.Name;
	ChallengedObj.Time  = Challenged.Time;
	ChallengedObj.Inc  = Challenged.Inc;
	ChallengedObj.Color  = Challenged.Color;

	// Setting atributes
	Challenge.ChallengeId = ChallengeId;
	Challenge.Challenger = ChallengerObj;
	Challenge.Challenged = ChallengedObj;
	Challenge.Category = Category;
	Challenge.Rated = Rated;
	Challenge.Private = false;

	if(MatchId == null)
	{
		Challenge.MatchId = null;
	}
	else
	{
		Challenge.MatchId = MatchId;
	}

	Challenge.Window = null;

	this.ChallengeList[this.ChallengeList.length] = Challenge;

	return true;
}	

/**
* Update a challenge in 'ChallengeList'
*/
function DATA_UpdateChallenge(ChallengeId, Challenger, Challenged, Category, Rated, MatchId)
{
	// Creating a new object
	var Challenge;
	var i;

	i = this.FindChallenge(ChallengeId, MatchId);
	
	// Challenge already exist on structure
	if (i == null)
	{
			return null;
	}

	Challenge = MainData.ChallengeList[i];

	// Setting atributes
	if(ChallengeId != null)
	{
		Challenge.ChallengeId = ChallengeId;
	}

	if(Challenger != null)
	{
		Challenge.Challenger = Challenger;
	}

	if(Challenged != null)
	{
		Challenge.Challenged = Challenged;
	}

	if(Category != null)
	{
		Challenge.Category = Category;
	}

	if(Rated != null)
	{
		Challenge.Rated = Rated;
	}

	if(MatchId != null)
	{
		Challenge.MatchId = MatchId;
	}

	//Challenge.Window = Window;

	return true;
}

/**
* @brief		Remove a challenge in 'ChallengeList'
* @param		Username	The oponent
* @author 		Ulysses Bonfim
* @return 		Boolean
* @see			DATA_FindChallenge
*/
function DATA_RemoveChallenge(ChallengeId, MatchId)
{
	var i;

	i = this.FindChallenge(ChallengeId, MatchId);

	// No challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove from the list the position of the challenge
	this.ChallengeList.splice(i, 1);

	return "";
}	


/**
* Remove a challenge by ID in 'ChallengeList'
* @param		ID	 Challenge ID
* @author 		Ulysses Bonfim
* @return 		Boolean
* @see			DATA_FindChallengeById
*/
/*
function DATA_RemoveChallengeById(ID)
{
	var i;

	// Try to find ID on ChallengeList
	i = this.FindChallengeById(ID);

	// No challenge with the user given
	if (i == null)
	{
		return null;
	}

	else 
	{
		// Remove from the list the position of the challenge
		this.ChallengeList.splice(i, 1);
	}

	return "";
}	
*/

/**
* @brief		Remove all challenges in 'ChallengeList'
* @author 		Ulysses Bonfim
* @return 		void
*/
function DATA_ClearChallenges()
{
	var size = this.ChallengeList.length;
	
	this.ChallengeList.splice(0, size);

	return "";
}

/**
* Find a challenge in 'ChallengeList'
* You can find a challenge by ChallengeId or MatchId;
* This is used because interface create a instance of challenge
* before get match id from server. If server send a error, this function
* is able to find challenge in challenge list;
* @brief		Find a challenge in 'ChallengeList'
* @param		Username	Challenge opponent
* @author 		Ulysses Bonfim
* @return 		Boolean
*/
function DATA_FindChallenge(ChallengeId, MatchId)
{
	var i;
	// If match id exists, find by match id
	if(MatchId != null)
	{
		for (i=0 ; i < this.ChallengeList.length ; i++)
		{
			if (this.ChallengeList[i].MatchId == MatchId)
			{
				return i;
			}
		}
	}

	// By default, find by challenge id
	for (i=0 ; i < this.ChallengeList.length ; i++)
	{
		if (this.ChallengeList[i].ChallengeId == ChallengeId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}


/**
* @brief		Find a challenge by ID in 'ChallengeList'
* @param		Username	Challenge opponent
* @author 		Ulysses Bonfim
* @return 		Challenge list index or null (user not found)
*/
/*
function DATA_FindChallengeById(ID)
{
	var i;
	
	for (i=0 ; i < this.ChallengeList.length ; i++)
	{
		if (this.ChallengeList[i].Id == ID)
		{
			return i;
		}
	}
	
	// ID not found
	return null;
}
*/

/**
* @brief		Add a Challenge window on structure
* @param		Id	  		Challenge id
* @param		WindowObj	Window Object shown on interface
* @author 		Ulysses Bonfim
* @return 		null
* @see			DATA_FindChallengeById
*/
function DATA_AddChallengeWindow (Id, WindowObj)
{
	var i = this.FindChallenge(Id, Id);

	if (i != null)
	{
		this.ChallengeList[i].Window = WindowObj;
	}
}


/**********************************
 * METHODS - ANNOUNCE CHALLENGES  *
 **********************************/
function DATA_AddAnnounce(Username, Color, Time, Inc, Category, Rated, AutoFlag, AnnounceId)
{
	// Creating a new object
	var Announce = new Object();
	var User = new Object();
	var i;

	i = this.FindAnnounce(AnnounceId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	User.Name = Username;
	User.Color = Color;
	User.Time = Time;
	User.Inc = Inc;

	// Setting atributes
	Announce.Id = AnnounceId;
	Announce.Category = Category;
	Announce.Player = User;
	Announce.Rated = Rated;
	Announce.AutoFlag = AutoFlag;
	Announce.Private = false;

	this.AnnounceList[this.AnnounceList.length] = Announce;

	return true;
}

function DATA_RemoveAnnounce(AnnounceId)
{
	var i;

	i = this.FindAnnounce(AnnounceId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.AnnounceList.splice(i, 1);

	return "";

}

function DATA_FindAnnounce(AnnounceId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.AnnounceList.length ; i++)
	{
		if (this.AnnounceList[i].Id == AnnounceId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}

/**
* @brief		Remove all announce in 'AnnounceList'
* @author 		Rubens Suguimoto
* @return 		void
*/
function DATA_ClearAnnounces()
{
	var size = this.AnnounceList.length;
	
	this.AnnounceList.splice(0, size);

	return "";
}

/**********************************
 * METHODS - POSTPONE CHALLENGES  *
 **********************************/

/**
* @brief		Add a challenge in 'PosponeList'
* @param		Oponent		The oponent
* @param		Category	Game category
* @param		Date		Date of adjourned match
* @param		AdjournId	Adjourned game Id 
* @author 		Rubens Suguimoto
* @return 		Boolean
*/
function DATA_AddPostpone(Oponent, Category, Date, AdjournId)
{
	// Creating a new object
	var Challenge = new Object();
	var ChallengedObj = new Object();
	var i;

	i = this.FindPostpone(AdjournId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	ChallengedObj.Name  = Oponent.Name;
	ChallengedObj.Time  = Oponent.Time;
	ChallengedObj.Inc  = Oponent.Inc;
	ChallengedObj.Color  = Oponent.Color;

	// Setting atributes
	Challenge.Id = AdjournId;
	Challenge.Challenged = ChallengedObj;
	Challenge.Category = Category;
	Challenge.Private = false;

	Challenge.Window = null;

	this.PostponeList[this.PostponeList.length] = Challenge;

	return true;
}	

/*
* @brief		Find a postpone challenge in 'PostponeList'
* @param		AdjournId	Adjourned game Id 
* @author 		Rubens Suguimoto
* @return 		Boolean
*/
function DATA_FindPostpone(AdjournId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.PostponeList.length ; i++)
	{
		if (this.PostponeList[i].Id == AdjournId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}

/**
* @brief		Remove a postpone challenge in 'PostponeList'
* @param		Username	The oponent
* @author 		Rubens Suguimoto
* @return 		Boolean
* @see			DATA_FindPostpone
*/
function DATA_RemovePostpone(AdjournId)
{
	var i;

	i = this.FindPostpone(AdjournId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.PostponeList.splice(i, 1);

	return "";
}

/**********************************
 * METHODS - GAME                 *
 **********************************/

/**
* @brief		Set current game 
* @param		Game	Game to set
* @author 		Rubens Sugimoto
* @return 		null
*/
function DATA_SetCurrentGame(Game)
{
	if(Game != undefined)
	{
		this.Game.Current = Game;
	}
	else
	{
		this.Game.Current = null;
	}
}

/**
* @brief		Get current game 
* @author 		Rubens Sugimoto
* @return 		Game object
*/
function DATA_GetCurrentGame()
{
	return this.Game.Current;
}

/**
* @brief		Add a game in 'GameList'
* @param		Id 	  	   Game Id
* @param		Player1	   Player name
* @param		Player2	   Player name
* @param		Color	   Your color on game
* @param		GameDiv	   Interface information 
* @author 		Rubens Sugimoto
* @return 		New Game structure
* @see			DATA_SetCurrentGame
*/
function DATA_AddGame(Id, Player1, Player2, Color, GameDiv)
{
	var NewGame = new Object();

	/*
	if(this.GameList.length == 0)
	{
		this.SetCurrentGame(NewGame);
	}
	*/
	
	this.SetCurrentGame(NewGame);

	NewGame.Id = Id;
	NewGame.YourColor = Color;
	NewGame.BoardColor = Color;
	
	// Setting users colors
	if (Color == "white")
	{
		if (Player1 == this.Username)
		{
			NewGame.PW = Player1;
			NewGame.PB = Player2;
		}
		else
		{
			NewGame.PW = Player2;
			NewGame.PB = Player1;
		}
	}
	else
	{
		if (Player1 == this.Username)
		{
			NewGame.PW = Player2;
			NewGame.PB = Player1;
		}
		else
		{
			NewGame.PW = Player1;
			NewGame.PB = Player2;
		}
	}

	NewGame.WPhoto = "./images/no_photo.png";
	NewGame.BPhoto = "./images/no_photo.png";

	NewGame.Game = GameDiv;
	NewGame.Finished = false;
	NewGame.IsYourTurn = false;
	NewGame.CurrentMove = null;
	NewGame.Moves = new Array();
	NewGame.Promotion = "q";

	NewGame.SetTurn = this.SetTurn;
	NewGame.AddMove = this.AddGameMove;

	this.Game.GameList.push(NewGame);

	return NewGame;

}


/**
* @brief		Remove a game in 'GameList' by game id
* @param		Id 	  	   Game Id
* @author 		Rubens Sugimoto
* @return 		Removed Game structure
* @see			DATA_FindGame DATA_SetCurrentGame 
*/
function DATA_RemoveGame(Id)
{
	var GamePosition = MainData.FindGame(Id);
	var RemovedGame;

	if(GamePosition == null)
	{
		return null;
	}
	else //Remove
	{
		RemovedGame = this.Game.GameList[GamePosition];
		this.Game.GameList.splice(GamePosition, 1);

		//Set next game on GameList to current game
		MainData.SetCurrentGame(this.Game.GameList[GamePosition]);
		//If next game is null, set previous game to current game, else
		//there is no game on GameList
		if(MainData.Game.Current == null)
		{
			MainData.SetCurrentGame(this.Game.GameList[GamePosition-1]);
		}

		return RemovedGame;
	}
	
}

/**
* @brief		Find game in 'GameList' by game id
* @param		Id 	  	   Game Id
* @author 		Rubens Sugimoto
* @return 		Game index
* @see			DATA_FindGame DATA_SetCurrentGame 
*/
function DATA_FindGame(Id)
{
	var i;
	var GameListLen = this.Game.GameList.length;

	for(i=0; i<GameListLen; i++)
	{
		if(this.Game.GameList[i].Id == Id)
		{
			return i;
		}
	}

	//If game Id is not found
	return null
}

/**
* @brief		Add a move in 'GameList[x].Moves' 
* @param		BoardArray 	  Board Array
* @param		Move		  Board after move
* @param		ShortMove	  The move
* @param		PWTime		  White player time
* @param		PBTime		  Balck player time
* @param		Turn		  Who did the move
* @author 		Rubens Sugimoto
* @return 		null
*/
function DATA_AddGameMove(BoardArray, Move, ShortMove, PWTime, PBTime, Turn)
{
	var NewMove = new Object();

	NewMove.Board = BoardArray;
	NewMove.Move = Move;
	NewMove.ShortMove = ShortMove;
	NewMove.PWTime = PWTime;
	NewMove.PBTime = PBTime;
	NewMove.Turn = Turn;

	this.CurrentMove = this.Moves.length;
	this.Moves.push(NewMove);

}

/**
* @brief		Set true, if is the player's turn
* @param		TurnColor 	 The round color
* @author 		Rubens Sugimoto
* @return 		Boolean
*/
function DATA_SetTurnGame(TurnColor)
{
	if((this.YourColor == TurnColor))
	{
		this.IsYourTurn = true;
	}
	else
	{
		this.IsYourTurn = false;
	}
}


/**
* @brief		Search for a game in GameList
* @param		Id	   Game Id
* @author 		Rubens Sugimoto
* @return 		The game structure
*/
function DATA_GetGame(Id)
{
	var i=0;
	//Search game from game list
	while(i<this.Game.GameList.length)
	{
		if(this.Game.GameList[i].Id == Id)
		{
			return(this.Game.GameList[i])
		}
		i++;
	}


	return null;
}

/**********************************
 * METHODS - OLDGAME              *
 **********************************/


/**
* @brief		Set current oldgame 
* @param		Game	Game structure
* @author 		Rubens Sugimoto
* @return 		null
*/
function DATA_SetCurrentOldGame(Game)
{
	if(Game != undefined)
	{
		this.OldGame.Current= Game;
	}
	else
	{
		this.OldGame.Current= null;
	}
}

/**
* @brief		Get current oldgame 
* @author 		Rubens Sugimoto
* @return 		Game Object
*/
function DATA_GetCurrentOldGame()
{
	return this.OldGame.Current;
}

/**
* @brief		Add a oldgame in 'OldGameList'
* @param		PWName		  White player's name
* @param		PBName		  Black player's name
* @param		Color		  Your color on game
* @param		GameDiv		  Div structure
* @author 		Rubens Sugimoto
* @return 		null
* @see 			DATA_SetCurrentOldGame
*/
function DATA_AddOldGame(PWName, PBName, Color, GameDiv)
{
	var NewOldGame = new Object();

	if(this.OldGame.OldGameList.length == 0)
	{
		MainData.SetCurrentOldGame(NewOldGame);
	}

	NewOldGame.Game = GameDiv;
	NewOldGame.YourColor = Color;
	NewOldGame.BoardColor = Color
	NewOldGame.IsYourTurn = false;
	NewOldGame.Moves = new Array();
	NewOldGame.PW = PWName;
	NewOldGame.PB = PBName;
	NewOldGame.Finished = false;
	NewOldGame.CurrentMove = null;
	NewOldGame.Moves = new Array();


	NewOldGame.WPhoto = "./images/no_photo.png";
	NewOldGame.BPhoto = "./images/no_photo.png";

	NewOldGame.SetTurn = this.SetTurn;
	NewOldGame.AddMove = this.AddGameMove;

	//NewOldGame.Id = this.OldGameList.length;
	NewOldGame.Id = 0;

	//this.OldGameList.push(NewOldGame);
	// This version, user can only see one OldGame
	this.OldGame.OldGameList[0] = NewOldGame;

	//return this.OldGameList.length -1;
	return 0;
}


/**
* @brief		Remove a game in 'OldGameList' by game id
* @param		Id	   	 The Game Id
* @author 		Rubens Sugimoto
* @return 		The game removed object
* @see			DATA_SetCurrentOldGame
*/
function DATA_RemoveOldGame(Id)
{
	var GamePosition = Id;
	var RemovedOldGame;

	if(this.OldGame.OldGameList[GamePosition] == undefined)
	{
		return null;
	}
	else //Remove
	{
		RemovedOldGame = this.OldGame.OldGameList[GamePosition];
		this.OldGame.OldGameList.splice(GamePosition, 1);

		//Set next game on GameList to current game
		MainData.SetCurrentOldGame(this.OldGame.OldGameList[GamePosition]);
		//If next game is null, set previous game to current game, else
		//there is no game on GameList
		if(this.GetCurrentOldGame() == null)
		{
			MainData.SetCurrentOldGame(this.OldGame.OldGameList[GamePosition-1]);
		}

		return RemovedOldGame;
	}
	
}

/**
* @brief		Search for a game in OldGameList
* @param		Id	   Game Id
* @author 		Rubens Sugimoto
* @return 		The game structure
*/
function DATA_GetOldGame(Id)
{
	/*
	var i=0;

	//Search game from old game list
	while(i<this.OldGameList.length)
	{
		if(this.OldGameList[i].Id == Id)
		{
			return(this.OldGameList[i])
		}
		i++;
	}
	return null;
	*/
	return this.OldGame.OldGameList[Id];
}


/**
* @brief		Set an old game as the current old game
* @param		GameObj    		The old game object
* @author 		Rubens Sugimoto
* @return 		Game's position on OldGameList
* @see			DATA_SetCurrentOldGame
*/
function DATA_PushGameToOldGame(GameObj)
{
	var Pos;
	Pos = this.OldGame.OldGameList.push(GameObj);
	MainData.SetCurrentOldGame(GameObj);

	return Pos -1;
}

/**********************************
 * METHODS - SEARCHGAME           *
 **********************************/

/**
* @brief		Add search game window parameters
* @param		Id		   Game ID
* @param		Elements   
* @param		User	   Username
* @author		Danilo Yorinori
* @return		boolean
*/
function DATA_AddSearchGameInfo(Id, Elements, User)
{
	var Search = new Object();

	Search.Id = Id;
	Search.NGames = 10;
	Search.Offset = 0;
	Search.P1 = User;
	Search.P2 = "";
	Search.Color = "";
	Search.From = "";
	Search.To = "";
	Search.More = false;
	Search.Elements = Elements;

	this.SearchGameInfoList.push(Search);

	return true;
}

/**
* @brief		Remove search game window
* @author		Danilo Yorinori
* @return		boolean
*/
function DATA_RemoveSearchGameInfo(Id)
{
	var i = this.FindSearchGameInfo(Id);

	if (i != null)
		this.SearchGameInfoList.splice(i,1);

	return true;
}

/**
* @brief		Find search game window
* @author		Danilo Yorinori
* @return		Game's position
*/
function DATA_FindSearchGameInfo(Id)
{
	var i;
	var GameInfoLen = this.SearchGameInfoList.length;

	for(i=0; i<GameInfoLen; i++)
	{
		if(this.SearchGameInfoList[i].Id == Id)
		{
			return i;
		}
	}

	//If game Id is not found
	return null
}

function DATA_GetSearchGameInfo(Id)
{
	var i=0;

	while(i<this.SearchGameInfoList.length)
	{
		if(this.SearchGameInfoList[i].Id == Id)
		{
			return this.SearchGameInfoList[i];
		}
		i++;
	}
	return null;
}

/**********************************
 * METHODS - WINDOWS              *
 **********************************/
/**
* Add a WindowObject in WindowList
*/
function DATA_AddWindow(WindowObj)
{
	var WindowListLen = this.Windows.WindowList.length;

	this.Windows.WindowList.push(WindowObj);
	this.Windows.Focus = WindowObj;

}

/**
* Set Window Object Focus
*/
function DATA_SetWindowFocus(WindowObj)
{
	if(this.Windows.Focus == WindowObj)
	{
		return null;
	}
	else
	{
		//Set new top window
		this.Windows.Focus = WindowObj;
	}
	return WindowObj;
}

/*
* Get Window Object Focus
*/
function DATA_GetWindowFocus()
{
	return this.Windows.Focus;
}

/*
* Get Window Object List length
*/
function DATA_GetWindowListLength()
{
	return this.Windows.WindowList.length;
}

function DATA_GetWindow(Index)
{
	return this.Windows.WindowList[Index];
}

/**
* Remove a Window Object from WindowList
*/
function DATA_RemoveWindow(WindowObj)
{
	var WindowIndex = this.FindWindow(WindowObj);
	var WindowListLen = this.GetWindowListLength();

	//Remove Window from WindowList
	this.Windows.WindowList.splice(WindowIndex,1);

	if(WindowListLen == 1)
	{
		this.SetWindowFocus(null);
	}
}

/**
* Private method used to find Window Object posiiton in WindowList
*/
function DATA_FindWindow(WindowObj)
{
	var i=0;

	while(i<this.Windows.WindowList.length)
	{
		if(WindowObj == this.Windows.WindowList[i])
		{
			return i;
		}
		i++;
	}
	return null;
}


/**********************************
 * METHODS - PROFILE              *
 **********************************/

function DATA_AddProfile(Jid, Username, ProfileWindow)
{
	var NewProfile = new Object();
	// Data Id
	NewProfile.Jid = Jid;
	NewProfile.Profile = ProfileWindow;
/*
	// vCard Data
	NewProfile.Fullname = "---";
	NewProfile.Nickname = Username;
	NewProfile.Desc = "---";
	NewProfile.PhotoImg = "";
	NewProfile.PhotoType = "";

	// Chess Data
	NewProfile.Rating = "---";
	NewProfile.LastGame = "---";
	NewProfile.OnlineTime = "---";
	NewProfile.Title = "---";
	NewProfile.TotalTime = "---";
	NewProfile.Group = "---";
	NewProfile.Warning = "";
	NewProfile.GameInfo = null; //Table
*/
	this.ProfileList.push(NewProfile);

}

function DATA_FindProfile(Jid)
{
	var i=0;

	while(i<this.ProfileList.length)
	{
		if(this.ProfileList[i].Jid == Jid)
		{
			return i;
		}
		i++;
	}
	return null;
}

function DATA_RemoveProfile(Jid)
{
	var ProfileIndex = this.FindProfile(Jid);

	if (ProfileIndex == null)
	{
		return false
	}

	//Remove Profile from ProfileList
	this.ProfileList.splice(ProfileIndex,1);

	return true;

}

function DATA_GetProfile(Jid)
{
	var i=0;

	while(i<this.ProfileList.length)
	{
		if(this.ProfileList[i].Jid == Jid)
		{
			return this.ProfileList[i];
		}
		i++;
	}
	return null;

}


/**********************************
 * METHODS - MY PROFILE           *
 **********************************/
function DATA_SetMyProfile(Username, FullName, Desc, ImgType, Img64)
{
	if(Username != "")
	{
		this.MyProfile.Username = Username;
	}

	if(FullName != "")
	{
		this.MyProfile.FN = FullName;
	}

	if(Desc != "")
	{
		this.MyProfile.Desc = Desc;
	}

	if(ImgType != "")
	{
		this.MyProfile.ImgType = ImgType;
	}

	if(Img64 != "")
	{
		this.MyProfile.Img64 = Img64;
	}
}
