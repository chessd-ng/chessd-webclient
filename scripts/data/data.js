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
* @file		data/data.js
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
	this.Conf.DefaultText = UTILS_OpenXMLFile("lang/en_US.xml");
	this.Conf.Const = DATA_SetConsts();
	this.Conf.Xmlns = UTILS_GetTag(Params, "Xmlns");
	this.Conf.Version = UTILS_GetTag(Params, "version");
	this.Conf.CookieValidity = UTILS_GetTag(Params, "cookie-validity");
	this.Conf.Lang = "";
	//Default php version - php4 or php5
	this.Conf.DefaultPHP = UTILS_GetTag(Params, "default-php")
	this.Conf.UpdateRatingInterval = UTILS_GetTag(Params, "update-rating-interval");
	this.Conf.UpdateGetMaxProfiles = UTILS_GetTag(Params, "update-get-max-profiles");


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
	this.Users.UpdateProfileTimer = null;

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

	/************************ CHALLENGE DATA ********************/
	this.Challenge = new Object();
	this.Challenge.ChallengeList = new Array();
	this.Challenge.ChallengeSequence = 0;
	this.Challenge.ChallengeMenu = null;

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

	/************************ PREFERENCES DATA*******************/
	this.Preferences = new Object();
	this.Preferences.Password = "";
	this.Preferences.Username = "";
	this.Preferences.AwayCounter = 300;
	this.Preferences.AwayInterval = null;

	/************************ LOAD DATAi*************************/
	this.LoadObj = null;

	/************************ WINDOW DATA************************/
	this.Windows = new Object();
	this.Windows.Focus = null;
	this.Windows.WindowList = new Array();

	/************************ GAMECENTER DATA************************/
	this.Gamecenter = new Object();
	this.Gamecenter.Gamecenter = null;
	this.Gamecenter.AnnounceList = new Array();
	this.Gamecenter.PostponeList = new Array();
	this.Gamecenter.MatchOfferList = new Array();
	this.Gamecenter.TorneyList = null;
	this.Gamecenter.CurrentGamesList = new Array();

	/************************ ADMINCENTER DATA************************/
	this.Admincenter = new Object();
	this.Admincenter.Admincenter = null;
	this.Admincenter.PunishList = new Array();
	this.Admincenter.LevelList = new Array();
	this.Admincenter.AdminLevelList = new Array();
	this.Admincenter.AdjournList = new Array();
	this.Admincenter.WordsList = new Array();
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
DATA.prototype.GetResource = DATA_GetResource;
DATA.prototype.GetServer = DATA_GetServer;
DATA.prototype.GetConferenceComponent = DATA_GetConferenceComponent;
DATA.prototype.GetSearchComponent = DATA_GetSearchComponent;
DATA.prototype.GetText = DATA_GetText;
DATA.prototype.SetText = DATA_SetText;
DATA.prototype.GetDefaultText = DATA_GetDefaultText;
DATA.prototype.GetConst = DATA_GetConst;
DATA.prototype.GetXmlns = DATA_GetXmlns;
DATA.prototype.GetVersion = DATA_GetVersion;
DATA.prototype.GetCookieValidity = DATA_GetCookieValidity;
DATA.prototype.GetLang = DATA_GetLang;
DATA.prototype.SetLang = DATA_SetLang;
DATA.prototype.GetDefaultPHP = DATA_GetDefaultPHP;
DATA.prototype.GetUpdateRatingInterval = DATA_GetUpdateRatingInterval;
DATA.prototype.GetUpdateGetMaxProfiles = DATA_GetUpdateGetMaxProfiles;


/*CONTACT METHODS************************/
DATA.prototype.AddContactUser = DATA_AddContactUser;
DATA.prototype.RemoveContactUser = DATA_RemoveContactUser;
DATA.prototype.FindContactUser = DATA_FindContactUser;
DATA.prototype.GetContactUser = DATA_GetContactUser;
DATA.prototype.SortContactUserByNick = DATA_SortContactUserByNick;
DATA.prototype.SortContactUserByRating = DATA_SortContactUserByRating;

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
DATA.prototype.SetUpdateProfileTimer = DATA_SetUpdateProfileTimer;
DATA.prototype.GetUpdateProfileTimer = DATA_GetUpdateProfileTimer;

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

DATA.prototype.GetRoom = DATA_GetRoom;

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

/*CHALLENGE METHODS ********************************/
DATA.prototype.AddChallenge = DATA_AddChallenge;
DATA.prototype.RemoveChallenge = DATA_RemoveChallenge;
DATA.prototype.FindChallenge = DATA_FindChallenge;
DATA.prototype.GetChallenge = DATA_GetChallenge;
DATA.prototype.UpdateChallenge = DATA_UpdateChallenge;

DATA.prototype.AddChallengeWindow = DATA_AddChallengeWindow;

DATA.prototype.GetChallengeList = DATA_GetChallengeList;
DATA.prototype.SetChallengeMenu = DATA_SetChallengeMenu;
DATA.prototype.GetChallengeMenu = DATA_GetChallengeMenu;
DATA.prototype.SetChallengeSequence = DATA_SetChallengeSequence;
DATA.prototype.GetChallengeSequence = DATA_GetChallengeSequence;

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

DATA.prototype.AddSearchUserInfo = DATA_AddSearchUserInfo;
DATA.prototype.RemoveSearchUserInfo = DATA_RemoveSearchUserInfo;
DATA.prototype.SortSearchUserByNick = DATA_SortSearchUserByNick;
DATA.prototype.SortSearchUserByName = DATA_SortSearchUserByName;

/*PREFERENCES METHODS *************************/
DATA.prototype.SetPassword = DATA_SetPassword;
DATA.prototype.GetPassword = DATA_GetPassword;
DATA.prototype.SetUsername = DATA_SetMyUsername;
DATA.prototype.GetUsername = DATA_GetMyUsername;
DATA.prototype.SetAwayCounter = DATA_SetAwayCounter;
DATA.prototype.GetAwayCounter = DATA_GetAwayCounter;
DATA.prototype.SetAwayInterval = DATA_SetAwayInterval;
DATA.prototype.GetAwayInterval = DATA_GetAwayInterval;

/*WINDOW METHODS ******************************/
DATA.prototype.AddWindow = DATA_AddWindow;
DATA.prototype.RemoveWindow = DATA_RemoveWindow;
DATA.prototype.FindWindow = DATA_FindWindow;
DATA.prototype.GetWindow = DATA_GetWindow;
DATA.prototype.SetWindowFocus = DATA_SetWindowFocus;
DATA.prototype.GetWindowFocus = DATA_GetWindowFocus;
DATA.prototype.GetWindowListLength = DATA_GetWindowListLength;


/*LOAD OBJECT METHODS*************************/
DATA.prototype.SetLoadObj = DATA_SetLoadObj;
DATA.prototype.GetLoadObj = DATA_GetLoadObj;

/*GAMECENTER OBJECT METHODS*************************/
DATA.prototype.SetGamecenter = DATA_SetGamecenter;
DATA.prototype.GetGamecenter = DATA_GetGamecenter;
/*GAMECENTER OBJECT POSTPONE METHODS ***************/
DATA.prototype.AddPostpone = DATA_AddPostpone;
DATA.prototype.RemovePostpone = DATA_RemovePostpone;
DATA.prototype.FindPostpone = DATA_FindPostpone;
DATA.prototype.GetPostpone = DATA_GetPostpone;
DATA.prototype.GetPostponeList = DATA_GetPostponeList;
DATA.prototype.SetPostponeStatus = DATA_SetPostponeStatus;
/*GAMCENTER OBJECT ANNOUNCE METHODS ****************/
DATA.prototype.AddAnnounce = DATA_AddAnnounce;
DATA.prototype.RemoveAnnounce = DATA_RemoveAnnounce;
DATA.prototype.FindAnnounce = DATA_FindAnnounce;
DATA.prototype.GetAnnounce = DATA_GetAnnounce;
DATA.prototype.GetAnnounceList = DATA_GetAnnounceList;
/*GAMECENTER OBJECT CURRENTGAMES METHODS ***************/
DATA.prototype.AddCurrentGames = DATA_AddCurrentGames;
DATA.prototype.RemoveCurrentGames = DATA_RemoveCurrentGames;
DATA.prototype.FindCurrentGames = DATA_FindCurrentGames;
DATA.prototype.GetCurrentGames = DATA_GetCurrentGames;
DATA.prototype.GetCurrentGamesList = DATA_GetCurrentGamesList;
/*GAMECENTER OBJECT MATCHOFFER METHODS ***************/
DATA.prototype.AddMatchOffer = DATA_AddMatchOffer;
DATA.prototype.RemoveMatchOffer = DATA_RemoveMatchOffer;
DATA.prototype.FindMatchOffer = DATA_FindMatchOffer;
DATA.prototype.GetMatchOffer = DATA_GetMatchOffer;
DATA.prototype.GetMatchOfferList = DATA_GetMatchOfferList;

/*ADMINCENTER OBJECT METHODS*************************/
DATA.prototype.SetAdmincenter = DATA_SetAdmincenter;
DATA.prototype.GetAdmincenter = DATA_GetAdmincenter;
/*ADMINCENTER OBJECT PUNISH LIST METHODS****************/
DATA.prototype.AddPunish = DATA_AddPunish;
DATA.prototype.RemovePunish = DATA_RemovePunish;
DATA.prototype.FindPunish = DATA_FindPunish;
DATA.prototype.GetPunish = DATA_GetPunish;
DATA.prototype.GetPunishList = DATA_GetPunishList;
/*ADMINCENTER OBJECT LEVEL LIST METHODS****************/
DATA.prototype.AddLevel = DATA_AddLevel;
DATA.prototype.RemoveLevel = DATA_RemoveLevel;
DATA.prototype.FindLevel = DATA_FindLevel;
DATA.prototype.GetLevel = DATA_GetLevel;
DATA.prototype.GetLevelList = DATA_GetLevelList;
/*ADMINCENTER OBJECT ADMIN LEVEL LIST METHODS****************/
DATA.prototype.AddAdminLevel = DATA_AddAdminLevel;
DATA.prototype.RemoveAdminLevel = DATA_RemoveAdminLevel;
DATA.prototype.FindAdminLevel = DATA_FindAdminLevel;
DATA.prototype.GetAdminLevel = DATA_GetAdminLevel;
DATA.prototype.GetAdminLevelList = DATA_GetAdminLevelList;
/*ADMINCENTER OBJECT ADJOURN LIST METHODS****************/
DATA.prototype.AddAdjourn = DATA_AddAdjourn;
DATA.prototype.RemoveAdjourn = DATA_RemoveAdjourn;
DATA.prototype.FindAdjourn = DATA_FindAdjourn;
DATA.prototype.GetAdjourn = DATA_GetAdjourn;
DATA.prototype.GetAdjournList = DATA_GetAdjournList;
/*ADMINCENTER OBJECT WORDS LIST METHODS****************/
DATA.prototype.AddWords = DATA_AddWords;
DATA.prototype.RemoveWords = DATA_RemoveWords;
DATA.prototype.FindWords = DATA_FindWords;
DATA.prototype.GetWords = DATA_GetWords;
DATA.prototype.GetWordsList = DATA_GetWordsList;

/**********************************
 * METHODS - HTTP REQUEST         *
 **********************************/

/*
* @brief	Add XMLHttpResquest object in HttpRequest list
*
* @param	XMLHttpRequest object
* @return none
* @author	Rubens Suguimoto
*/
function DATA_AddHttpPost(PostObj)
{
	this.Connection.HttpRequest.push(PostObj);
}

/*
* @brief	Remove XMLHttpResquest object from HttpRequest list
*
* @param	XMLHttpRequest object
* @return none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Find XMLHttpResquest object in HttpRequest list
*
* @param	XMLHttpRequest object
* @return none
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Get HttpRequest length
*
* @return 	HttpRequest list length (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetHttpRequestLength()
{
	return this.Connection.HttpRequest.length;
}

/*
* @brief	Get connection status number
*
* @return 	Connection status number (-1 = disconnected, 0 = connect, 1 = connecting)
* @author	Rubens Suguimoto
*/
function DATA_GetConnectionStatus()
{
	return this.Connection.ConnectionStatus;
}

/*
* @brief	Set connection status number
*
* @param	Value	Status value
* @return none
* @author	Rubens Suguimoto
*/
function DATA_SetConnectionStatus(Value)
{
	this.Connection.ConnectionStatus = Value;
}

/*
* @brief	Get RID number
*
* @return 	RID number
* @author	Rubens Suguimoto
*/
function DATA_GetRID()
{
	return this.Connection.RID;
}

/*
* @brief	Set RID number
*
* @param	RID value
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetRID(Value)
{
	this.Connection.RID = Value;
}

/*
* @brief	Get SID number
*
* @return 	SID number
* @author	Rubens Suguimoto
*/
function DATA_GetSID()
{
	return this.Connection.SID;
}

/*
* @brief	Set SID number
*
* @param	SID number
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetSID(Value)
{
	this.Connection.SID = Value;
}


/**********************************
 * METHODS - CONFIGURATON DATA    *
 **********************************/

/*
* @brief	Get hostname
*
* @return 	Hostname string
* @author	Rubens Suguimoto
*/
function DATA_GetHost()
{
	return this.Conf.Host;
}

/*
* @brief	Get Bosh host to post XMPP messages
*
* @return 	Bosh host string
* @author	Rubens Suguimoto
*/
function DATA_GetHostPost()
{
	return this.Conf.HostPost;
}

/*
* @brief	Get browser
*
* Browser Number (-1=Not identified,  0=IE, 1=FF2[gecko != 1.9], 2=FF3[gecko1.9])
* @return 	Browser number
* @author	Rubens Suguimoto
*/
function DATA_GetBrowser()
{
	return this.Conf.Browser;
}

/*
* @brief	Get jabber client resource
*
* @return 	Resource name string
* @author	Rubens Suguimoto
*/
function DATA_GetResource()
{
	return this.Conf.Resource;
}

/*
* @brief	Get chess server name
*
* @return 	Chess server string
* @author	Rubens Suguimoto
*/
function DATA_GetServer()
{
	return this.Conf.Server;
}

/*
* @brief	Get conference component name
*
* @return 	Conference component name
* @author	Rubens Suguimoto
*/
function DATA_GetConferenceComponent()
{
	return this.Conf.ConferenceComponent;
}

/*
* @brief	Get search component name
*
* @return 	Conference component string
* @author	Rubens Suguimoto
*/
function DATA_GetSearchComponent()
{
	return this.Conf.SearchComponent;
}

/*
* @brief	Get DOM tree with all web interface text
*
* @return 	DOM tree with all text language
* @author	Rubens Suguimoto
*/
function DATA_GetText()
{
	return this.Conf.GetText;
}

/*
* @brief	Set DOM tree with all web interface text
*
* @param	FileXML		DOM tree with all text language
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetText(FileXML)
{
	this.Conf.GetText = FileXML;
}

/*
* @brief	Get default DOM tree text language
*
* The default language is English
*
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_GetDefaultText()
{
	return this.Conf.DefaultText;
}

/*
* @brief	Get defined constants
*
* @return 	Constants defined struct
* @author	Rubens Suguimoto
*/
function DATA_GetConst()
{
	return this.Conf.Const;
}

/*
* @brief	Get Xmlns
*
* @return	Xmlns string
* @author	Rubens Suguimoto
*/
function DATA_GetXmlns()
{
	return this.Conf.Xmlns;
}

/*
* @brief	Get web client version
*
* @return 	Version string
* @author	Rubens Suguimoto
*/
function DATA_GetVersion()
{
	return this.Conf.Version;
}

/*
* @brief	Get cookie validity
*
* @return 	Cookie validity value (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetCookieValidity()
{
	return this.Conf.CookieValidity;
}

/*
* @brief	Get current language used
*
* @return	Language used (ex: pt_BR, en_US, zh_CN...)
* @author	Rubens Suguimoto
*/
function DATA_GetLang()
{
	return this.Conf.Lang;
}

/*
* @brief	Set current language used
*
* @param	Lang	Language (ex: pt_BR, en_US, zh_CN...)
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetLang(Lang)
{
	this.Conf.Lang = Lang;
}

/*
* @brief	Get default PHP extension
*
* @return 	PHP extension string
* @author	Rubens Suguimoto
*/
function DATA_GetDefaultPHP()
{
	return this.Conf.DefaultPHP;
}


/*
* @brief	Get rating update interval time
*
* @return 	Rating update interval time (seconds)
* @author	Rubens Suguimoto
*/
function DATA_GetUpdateRatingInterval()
{
	return this.Conf.UpdateRatingInterval;
}

/*
* @brief	Get max number of users by update
*
* @return 	Max number of users to be update (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetUpdateGetMaxProfiles()
{
	return this.Conf.UpdateGetMaxProfiles;
}

/**********************************
 * METHODS - CONTACT USER LIST    *
 **********************************/

/*
* @brief	Add a user in contact list
*
* @param	Username	User's name
* @param	Status		User's status
* @param	Subs		User's subscription status
* @param	Group		User's contact group
* @return	none
* @author	Rubens Suguimoto
*/
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
	User.Type = "user";
	
	User.GetUsername = DATA_GetUsername;
	User.SetStatus = DATA_SetStatus;
	User.GetStatus = DATA_GetStatus;
	User.SetSubs = DATA_SetSubs;
	User.GetSubs = DATA_GetSubs;
	User.GetGroup = DATA_GetGroup;
	User.SetGroup = DATA_SetGroup;
 
	User.GetRatingList = DATA_GetRatingList;
	User.SetType = DATA_SetType;
	User.GetType = DATA_GetType;

	return this.Contact.UserList.push(User);
}

/*
* @brief	Remove some user from contact list
*
* @param	Username	User's name
* @return 	User object removed or null (if not found)
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Find some user in contact list
*
* @param	Username	User's name
* @return 	User object position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Get contact user object
*
* @param	Username	User's name
* @return 	Contact user object or null (if not found)
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Get contact user list
*
* @return 	Contact user list
* @author	Rubens Suguimoto
*/
function DATA_GetContactUserList()
{
	return this.Contact.UserList;
}



/*
* @brief	Set contact object
*
* @param	Obj	Contact object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetContactObj(Obj)
{
	this.Contact.Obj = Obj;
}


/*
* @brief	Get contact object
*
* @return 	Contact object
* @author	Rubens Suguimoto
*/
function DATA_GetContactObj()
{
	return this.Contact.Obj;
}


/*
* @brief	Set contact sort order
*
* @param	Order value (should be 0 or 1)
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetContactOrderBy(NewValue)
{
	this.Contact.OrderBy = NewValue;
}


/*
* @brief	Get contact sort order
*
* @return 	Contact sort order number (integer, 0 or 1)
* @author	Rubens Suguimoto
*/
function DATA_GetContactOrderBy()
{
	return this.Contact.OrderBy;
}


/*
* @brief	Set contact current rating category
*
* @param	NewCategory	Game category rating
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetContactCurrentRating(NewCategory)
{
	this.Contact.CurrentRating = NewCategory;
}


/*
* @brief	Get contact current rating category
*
* @return 	Contact current rating category string
* @author	Rubens Suguimoto
*/
function DATA_GetContactCurrentRating()
{
	return this.Contact.CurrentRating;
}

/**********************************
 * METHODS - ONLINE  USER LIST    *
 **********************************/
/*
* @brief	Add some user in online user list
*	
* @param	Username	User's name
* @param	Status		User's status
* @param	Type		User's type
* @return 	none
* @author	Rubens Suguimoto
*/
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
 
	User.GetRatingList = DATA_GetRatingList;
	User.SetType = DATA_SetType;
	User.GetType = DATA_GetType;

	return this.Online.UserList.push(User);

}

/*
* @brief	Remove some user from online user list
*
* @param	Username	User's name
* @return 	User object removed or null (if not found)
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Find some user in online list
*
* @param	Username	User's name
* @return 	User object position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Get contact user object
*
* @param	Username	User's name
* @return 	Online user object or null (if not found)
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Get online user list
*
* @return 	Online user list
* @author	Rubens Suguimoto
*/
function DATA_GetOnlineUserList()
{
	return this.Online.UserList;
}


/*
* @brief	Set online object
*
* @param	Obj	Contact object
* @return none
* @author	Rubens Suguimoto
*/
function DATA_SetOnlineObj(Obj)
{
	this.Online.Obj = Obj;
}


/*
* @brief	Get online object
*
* @return 	Online object
* @author	Rubens Suguimoto
*/
function DATA_GetOnlineObj()
{
	return this.Online.Obj;
}


/*
* @brief	Set online sort order
*
* @param	Order value (should be 0 or 1)
* @return none
* @author	Rubens Suguimoto
*/
function DATA_SetOnlineOrderBy(NewValue)
{
	this.Online.OrderBy = NewValue;
}


/*
* @brief	Get online sort order
*
* @return 	Online sort order number (integer, 0 or 1)
* @return none
* @author	Rubens Suguimoto
*/
function DATA_GetOnlineOrderBy()
{
	return this.Online.OrderBy;
}


/*
* @brief	Set online current rating category
*
* @param	NewCategory	Game category rating
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetOnlineCurrentRating(NewCategory)
{
	this.Online.CurrentRating = NewCategory;
}


/*
* @brief	Get online current rating category
*
* @return 	Online current rating category string
* @return none
* @author	Rubens Suguimoto
*/
function DATA_GetOnlineCurrentRating()
{
	return this.Online.CurrentRating;
}



/**********************************
 * METHODS - USER OBJECT          *
 **********************************/

/*
* @brief	Get usarname from user object
*
* @return 	Username string
* @author	Rubens Suguimoto
*/
function DATA_GetUsername()
{
	return this.Username;
}

/*
* @brief	Set user's status from user object
*
* @param	NewStatus	Status string
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetStatus(NewStatus)
{
	this.Status = NewStatus;
}

/*
* @brief	Set user's status from user object
*
* @return 	User object status
* @author	Rubens Suguimoto
*/
function DATA_GetStatus()
{
	return this.Status;
}

/*
* @brief	Set user subscription
*
* @param	NewSubs		New subscription status
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetSubs(NewSubs)
{
	this.Subs = NewSubs;
}

/*
* @brief	Get user subscription
*
* @return 	User's subscription status
* @author	Rubens Suguimoto
*/
function DATA_GetSubs()
{
	return this.Subs;
}

/*
* @brief	Set user contact group
*
* @param	NewGroup	User's new group
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetGroup(NewGroup)
{
	this.Group = NewGroup;
}

/*
* @brief	Get user contact group
*
* @return 	Group string
* @author	Rubens Suguimoto
*/
function DATA_GetGroup()
{
	return this.Group;
}
 

/*
* @brief	Set user's image
*
* @param	NewPhoto	Image in base64 format and image type
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetPhoto(NewPhoto)
{
	this.Photo = NewPhoto;
}

/*
* @brief	Get user's image
*
* @return 	Image in base64 format and image type 
* @author	Rubens Suguimoto
*/
function DATA_GetPhoto()
{
	return this.Photo;
}



/*
* @brief	Set user's image in base64 format
*
* @param	Image	Image in base64 format
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetImg64(Image)
{
	this.Img64 = Image;
} 


/*
* @brief	Get user's image in base64 format
*
* @return 	Image in base64 format string
* @author	Rubens Suguimoto
*/
function DATA_GetImg64() 
{
	return this.Img64;
} 


/*
* @brief	Set user's image type
*
* @param	ImageType	Image type
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetImgType(ImageType)
{
	this.ImgType = ImageType;
} 


/*
* @brief	Get user's image type
*
* @return 	User's image type string
* @author	Rubens Suguimoto
*/
function DATA_GetImgType()
{
	return this.ImgType;
} 


/*
* @brief 	Get rating list object
*
* @return 	Rating list object
* @author	Rubens Suguimoto
*/
function DATA_GetRatingList()
{
	return this.Rating;
}

/*
* @brief	Set user's type
*
* @param	NewType		User's type
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetType(NewType)
{
	this.Type = NewType;
}

/*
* @brief	Get user's type
*
* @return	User's type
* @author	Rubens Suguimoto
*/
function DATA_GetType()
{
	return this.Type;
}


/*
* @brief	Set user's room role
*
* @param	NewRole		User's role
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetRole(NewRole)
{
	this.Role = NewRole;
}


/*
* @brief	Get user's room role
*
* @return 	User's role
* @author	Rubens Suguimoto
*/
function DATA_GetRole()
{
	return this.Role;
}


/*
* @brief	Set user's room afilliation
*
* @param	NewAffiliation	User's afilliation in some room
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetAfilliation(NewAfilliation)
{
	this.Afilliation = NewAfilliation;
}


/*
* @brief	Get user's affiliation
*
* @return 	User's affiliation
* @author	Rubens Suguimoto
*/
function DATA_GetAfilliation()
{
	return this.Afilliation;
}


/*
* @brief	Get user's update rating flag
*
* @return 	Get user's update rating flag
* @author	Rubens Suguimoto
*/
function DATA_GetUpdateRating()
{
	return this.UpdateRating;
}


/*
* @brief	Set user's update rating flag
*
* @param	Bool	True or False
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetUpdateRating(Bool)
{
	this.UpdateRating = Bool;
}


/*
* @brief	Get user's update profile flag
*
* @return 	Get user's update profile flag
* @author	Rubens Suguimoto
*/
function DATA_GetUpdateProfile()
{
	return this.UpdateProfile;
}


/*
* @brief	Set user's update profile flag
*
* @param	Bool	True or False
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetUpdateProfile(Bool)
{
	this.UpdateProfile = Bool;
}


/*
* @brief	Set user's full name
*
* @param	NewName		Full name string
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetFullname(NewName)
{
	this.Fullname = NewName;
}


/*
* @brief	Get user's full name
*
* @return 	User's full name string
* @author	Rubens Suguimoto
*/
function DATA_GetFullname()
{
	return this.Fullname;
}


/*
* @brief	Set user's description
*
* @param	NewDesc		Description string
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetDesc(NewDesc)
{
	this.Desc = NewDesc;
}


/*
* @brief	Get user's description
*
* @return 	User's description string
* @author	Rubens Suguimoto
*/
function DATA_GetDesc()
{
	return this.Desc;
}


/*
* @brief	Set user's last game date and hour
*
* @param	LastGame 	Last game time
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetLastGame(LastGame)
{
	this.LastGame = LastGame;
}


/*
* @brief	Get user's last game date and hour
*
* @return 	User's last game time
* @author	Rubens Suguimoto
*/
function DATA_GetLastGame()
{
	return this.LastGame;
}


/*
* @brief	Set user's online time
*
* @param	Time	Online time in seconds
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetOnlineTime(Time)
{
	this.OnlineTime = Time;
}


/*
* @brief	Get user's online time
*
* @return 	User's online time in seconds
* @author	Rubens Suguimoto
*/
function DATA_GetOnlineTime()
{
	return this.OnlineTime;
}


/*
* @brief	Set user's total online time
*
* @param	Time 	Online total time in seconds
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetTotalTime(Time)
{
	this.TotalTime = Time;
}


/*
* @brief	Get user's total online time
*
* @return 	User's online total time in seconds
* @author	Rubens Suguimoto
*/
function DATA_GetTotalTime()
{
	return this.TotalTime;
}


/*
* @brief	Set user's abusive or warnings
*
* @param	Warning		Warning string
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetWarning(Warning)
{
	this.Warning = Warning;
}


/*
* @brief	Get user's abusive or warning
*
* @return 	User's abusive or warning string
* @author	Rubens Suguimoto
*/
function DATA_GetWarning()
{
	return this.Warning;
}


/*
* @brief	Set user's level
*
* @param	Title	User level
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetTypeTitle(Title)
{
	this.TypeTitle = Title;
}


/*
* @brief	Get user's level
*
* @return 	User's level string
* @author	Rubens Suguimoto
*/
function DATA_GetTypeTitle()
{
	return this.TypeTitle;
}


/*
* @brief	Set user's profile window object
*
* @param	ProfileObj	Window profile object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetProfileObj(ProfileObj)
{
	this.ProfileObj = ProfileObj;
}


/*
* @brief	Get user's profile window object
*
* @return	User's profile window object
* @author	Rubens Suguimoto
*/
function DATA_GetProfileObj()
{
	return this.ProfileObj;
}

/**********************************
 * METHODS - RATING OBJECT        *
 **********************************/

/*
* @class	Rating object
* @brief	Class definition to manage user's ratings
*
* Rating Object is used to manage user's rating;
* This object contains a list of rating with rating type (obj.Category)
* and this type value (obj.Value)
*
* @return 	Rating object
* @author	Rubens Suguimoto
*/
function DATA_RatingObject()
{
	var RatingObj = new Object();

	RatingObj.RatingList = new Array();

	RatingObj.AddRating = DATA_AddRating;
	RatingObj.RemoveRating = DATA_RemoveRating;
	RatingObj.FindRating = DATA_FindRating;
	RatingObj.GetRating = DATA_GetRating;

	RatingObj.GetRatingValue = DATA_GetRatingValue;
	RatingObj.SetRatingValue = DATA_SetRatingValue;
	RatingObj.GetRecordValue = DATA_GetRecordValue;
	RatingObj.SetRecordValue = DATA_SetRecordValue;
	RatingObj.GetRecordTime = DATA_GetRecordTime;
	RatingObj.SetRecordTime = DATA_SetRecordTime;
	RatingObj.GetRatingWin = DATA_GetRatingWin;
	RatingObj.SetRatingWin = DATA_SetRatingWin;
	RatingObj.GetRatingDraw = DATA_GetRatingDraw;
	RatingObj.SetRatingDraw = DATA_SetRatingDraw;
	RatingObj.GetRatingLosses = DATA_GetRatingLosses;
	RatingObj.SetRatingLosses = DATA_SetRatingLosses;

	return RatingObj;
}


/*
* @brief	Add rating struct in rating list
*
* @param	Category	Rating's category
* @param	Value		Rating's category value
* @param	RecordValue	Rating's category user's record value
* @param	RecordTime	Rating's category user's record time
* @param	Win		Rating's category user's wins
* @param	Draw		Rating's category user's draws
* @param	Loss		Rating's category user's losses
* @return none
* @author	Rubens Suguimoto
*/
function DATA_AddRating(Category, Value, RecordValue, RecordTime, Win, Draw, Losses)
{
	var Rating = new Object();
	
	Rating.Category = Category;
	Rating.Value = Value;
	Rating.RecordValue = RecordValue;
	Rating.RecordTime = RecordTime;
	Rating.Win = Win;
	Rating.Draw = Draw;
	Rating.Losses = Losses;
	
	this.RatingList.push(Rating);
}


/*
* @brief	Remove rating from rating list
*
* @param	Category	Rating's category
* @return	Removed rating category struct
* @author	Rubens Suguimoto
*/
function DATA_RemoveRating(Category)
{
	var Pos = this.FindRating(Category);

	if(Pos != null)
	{
		this.RatingList.splice(Pos,i);
	}
}


/*
* @brief	Find rating category
*
* @param	Category	Rating's category
* @return 	Rating position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Get rating category
*
* @param	Category	Rating's category
* @return 	Rating category struct
* @author	Rubens Suguimoto
*/
function DATA_GetRating(Category)
{
	var Pos = this.FindRating(Category);
	if(Pos != null)
	{
		return this.RatingList[Pos];
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get rating category value
*
* @param	Category	Rating's category
* @return 	Rating category value
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Set rating category value
*
* @param	Category	Rating's category
* @param	Value		Rating's value
* @return 	Rating position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_SetRatingValue(Category, Value)
{
	var Pos = this.FindRating(Category);

	if(Pos != null)
	{
		this.RatingList[Pos].Value = Value;
		return Pos;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get rating category record value
*
* @param	Category	Rating's category
* @return 	Rating's category record value
* @author	Rubens Suguimoto
*/
function DATA_GetRecordValue(Category)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		return this.RatingList[Pos].RecordValue;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Set rating category record value
*
* @param	Category	Rating's category
* @param	Value		Rating's value
* @return 	Rating position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_SetRecordValue(Category, Value)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		this.RatingList[Pos].RecordValue = Value;
		return Pos;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get rating category record time
*
* @param	Category	Rating's category
* @return 	Rating category's record time
* @author	Rubens Suguimoto
*/
function DATA_GetRecordTime(Category)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		return this.RatingList[Pos].RecordTime;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Set rating category record time
*
* @param	Category	Rating's category
* @param	Time		Rating's record time
* @return 	Rating position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_SetRecordTime(Category, Time)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		this.RatingList[Pos].RecordTime = Time;
		return Pos;
	}
	else
	{
		return null;
	}
}

/*
* @brief	Get rating category wins
*
* @param	Category	Rating's category
* @return 	Wins numbers
* @author	Rubens Suguimoto
*/
function DATA_GetRatingWin(Category)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		return this.RatingList[Pos].Win;
	}
	else
	{
		return null;
	}

}


/*
* @brief	Set rating category wins
*
* @param	Category	Rating's category
* @param	Value		Rating's wins value
* @return 	Rating position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_SetRatingWin(Category, Value)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		this.RatingList[Pos].Win = Value;
		return Pos;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get rating category draws
*
* @param	Category	Rating's category
* @return 	Draws numbers
* @author	Rubens Suguimoto
*/
function DATA_GetRatingDraw(Category)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		return this.RatingList[Pos].Draw;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Set rating category draws
*
* @param	Category	Rating's category
* @param	Value		Rating's draws value
* @return 	Rating position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_SetRatingDraw(Category, Value)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		this.RatingList[Pos].Draw = Value;
		return Pos;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get rating category losses
*
* @param	Category	Rating's category
* @return 	Losses numbers
* @author	Rubens Suguimoto
*/
function DATA_GetRatingLosses(Category)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		return this.RatingList[Pos].Losses;
	}
	else
	{
		return null;
	}
}


/*
* @brief	Set rating category losses
*
* @param	Category	Rating's category
* @param	Value		Rating's losses value
* @return 	Rating position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_SetRatingLosses(Category, Value)
{
	var Pos = this.FindRating(Category);
	
	if(Pos != null)
	{
		this.RatingList[Pos].Losses = Value;
		return Pos;
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
* @return 		false - User already on list, true otherwise
* @author		Ulysses Bonfim and Rubens Suguimoto
*/
function DATA_AddUser(Username, Status)
{
	// Creating a new object
	var User = new Object();

	//////////// Setting atributes
	// General user attributes
	User.Username = Username;
	User.Status = Status;

	// The user's rating will be set after
	User.Rating = DATA_RatingObject();
	User.Type = "user";
	User.UpdateRating = true;
	User.UpdateProfile = true;
	User.ProfileObj = null;

	///// Profile user attributes
	// vCard
	User.Fullname = "---";
	User.Desc = "---";
	User.Photo = null;
	User.Img64 = null;
	User.ImgType = null;
	// Chess Data
	User.LastGame = "---";
	User.OnlineTime = "---";
	User.TotalTime = "---";
	User.Warning = "";
	User.TypeTitle = "---";

	//Methods
	User.GetUsername = DATA_GetUsername;
	User.SetStatus = DATA_SetStatus;
	User.GetStatus = DATA_GetStatus;

	User.SetPhoto = DATA_SetPhoto;
	User.GetPhoto = DATA_GetPhoto; 
	User.SetImg64 = DATA_SetImg64;
	User.GetImg64 = DATA_GetImg64; 
	User.SetImgType = DATA_SetImgType;
	User.GetImgType = DATA_GetImgType; 
	User.GetRatingList = DATA_GetRatingList;
	User.SetType = DATA_SetType;
	User.GetType = DATA_GetType;

	User.SetFullname = DATA_SetFullname;
	User.GetFullname = DATA_GetFullname;
	User.SetDesc = DATA_SetDesc;
	User.GetDesc = DATA_GetDesc;
	User.SetLastGame = DATA_SetLastGame;
	User.GetLastGame = DATA_GetLastGame;
	User.SetOnlineTime = DATA_SetOnlineTime;
	User.GetOnlineTime = DATA_GetOnlineTime;
	User.SetTotalTime = DATA_SetTotalTime;
	User.GetTotalTime = DATA_GetTotalTime;
	User.SetWarning = DATA_SetWarning;
	User.GetWarning = DATA_GetWarning;
	User.SetTypeTitle = DATA_SetTypeTitle;
	User.GetTypeTitle = DATA_GetTypeTitle;

	User.SetProfileObj = DATA_SetProfileObj;
	User.GetProfileObj = DATA_GetProfileObj;

	User.SetUpdateRating = DATA_SetUpdateRating;
	User.GetUpdateRating = DATA_GetUpdateRating;

	User.SetUpdateProfile = DATA_SetUpdateProfile;
	User.GetUpdateProfile = DATA_GetUpdateProfile;

	this.Users.UserList.push(User);
}

/**
* @brief		Remove user from user list
* 
* Search and remove the user of DATA.UserList 
* 
* @param		Username User's name to remove of structure
* @author		Pedro Rocha and Rubens Suguimoto
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
* @author		Pedro Rocha
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


/*
* @brief	Get user from in user list
*
* @param	Username	User's name
* @return 	User object position (integer) or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_GetUser(Username)
{
	var i = this.FindUser(Username);

	if(i!=null)
	{
		return this.Users.UserList[i];
	}

	return null;
}


/*
* @brief	Get list of users
*
* @return 	User list object
* @author	Rubens Suguimoto
*/
function DATA_GetUserList()
{
	return this.Users.UserList;
}

/*
* @brief	Set your Interval timer to update users list ratings
*
* @param	Interval	Interval counter value
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetUpdateTimer(Interval)
{
	this.Users.UpdateTimer = Interval;
}

/*
* @brief	Get your interval timer to update users list ratings 
*
* @return	Your interval counter value
* @author	Rubens Suguimoto
*/
function DATA_GetUpdateTimer()
{
	return this.Users.UpdateTimer;
}


/*
* @brief	Set update profile interval timer profile
*
* @param	Interval	Interval counter value
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetUpdateProfileTimer(Interval)
{
	this.Users.UpdateProfileTimer = Interval;
}


/*
* @brief	Get your interval timer to update users list profile
*
* @return	Your interval counter value
*
* @param
* @return none
* @author	Rubens Suguimoto
*/
function DATA_GetUpdateProfileTimer()
{
	return this.Users.UpdateProfileTimer;
}


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
* @author		Pedro Rocha
* @return		The new room object
* @see			DATA_FindRoom
*/
function DATA_AddRoom(RoomName, MsgTo, Role, Affiliation, RoomObj)
{
	// Creating a new object
	var Room = new Object();

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
* @author		Pedro Rucha
* @return		True if removed, or False if not found
* @see			DATA_FindRoom
*/
function DATA_RemoveRoom(RoomName)
{
	var i = this.FindRoom(RoomName);

	// If room do not exist
	if (i == null)
	{
		return null;
	}

	// Removing room from room list
	this.Room.RoomList.splice(i, 1);
	return true;
}

/**
* @brief		Find room in room list
*
* @param		RoomName	Room name to find
* @author		Pedro Eugenio
* @return		Room structure founded or null
*/
function DATA_FindRoom(RoomName)
{
	var i;

	for (i=0; i<this.Room.RoomList.length; i++)
	{
		if (this.Room.RoomList[i].Name == RoomName)
		{
			return i;
		}
	}
	return null;
}

/**
* @brief		Set from, affiliation and role in 'RoomName' structure.
*
* Only for interface user
*
* @param		RoomName	Room's name 
* @param		From		Where the messages will be send 
* @param		Affiliation 	New room's affiliation 	
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


/*
* @brief	Get list of rooms
*
* @return 	List of rooms
* @author	Rubens Suguimoto
*/
function DATA_GetRoomList()
{
	return this.Room.RoomList;
}

/*
* @brief	Get numbers of emoticons
*
* This number is used to put emoticons in rooms
*
* @return 	Numbers of emoticons (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetEmoticonNum()
{
	return this.Room.EmoticonNum;
}

/*
* @brief	Get max number of rooms opened
*
* @return 	Max number of rooms opened (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetMaxRooms()
{
	return this.Room.MaxRooms;
}

/*
* @brief	Get max numbers of chars of user message
*
* @return	Max numbers of characters of user message (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetMaxRoomChar()
{
	return this.Room.MaxRoomChar;
}

/*
* @brief	Get room default name
*
* @return 	Room default name string
* @author	Rubens Suguimoto
*/
function DATA_GetRoomDefault()
{
	return this.Room.RoomDefault;
}

/*
* @brief	Get current room to show
*
* @param	RoomObj		Room object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetCurrentRoom(RoomObj)
{
	this.Room.Current = RoomObj;
}

/*
* @brief	Get current room opened
*
* @return 	Current room object
* @author	Rubens Suguimoto
*/
function DATA_GetCurrentRoom()
{
	return this.Room.Current;
}


/**
* @brief		Add user in user list of a room
*
* @param		Username 	User's name
* @param		Status		New user's status
* @param		Type		New user's type
* @param		Role		New user's role
* @param		Affiliation	New user's affiliation
* @author		Pedro Rocha and Rubens Suguimoto
* @return		true
* @see			DATA_FindRoom DATA_FindUser
*/
function DATA_AddUserInRoom(Username, Status, Type, Role, Affiliation)
{
	var User = new Object();
	var UserPos = MainData.FindUser(Username);
	var Room;
	var UserObj;

	User.Username = Username;
	User.Status = Status;
	User.Role = Role;
	User.Affiliation = Affiliation;
	User.Type = Type;
	User.Rating = DATA_RatingObject();

	User.GetUsername = DATA_GetUsername;
	User.SetStatus = DATA_SetStatus;
	User.GetStatus = DATA_GetStatus;

	User.SetPhoto = DATA_SetPhoto;
	User.GetPhoto = DATA_GetPhoto; 
	User.GetRatingList = DATA_GetRatingList;
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
*
* @param		Username  User to find
* @author		Pedro Rocha and Rubens Suguimoto
* @return		User's position on room user list, or null, if not found
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

/**
* @brief		Get user object in user list of room
*
* @param		Username  	User's name to find
* @author		Pedro Rocha and Rubens Suguimoto
* @return		User object or null, if not found
*/
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
*
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
*
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
*TODO -> REMOVE THIS FUNCTION WHEN USERSLIST WAS DONE*
*
* @param 		Username	User name
* @param 		Category	Category which rating will be returned
* @author		Danilo Yorinori
* @return		Rating's value
* @see			DATA_FindRoom DATA_FinUserInRoom
*/
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
* @param		RoomName	Room's name
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



/*
* @brief	Set room sort order value
*
* @param	Value 	Sort order value (0 or 1)
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetRoomOrderBy(Value)
{
	this.OrderBy = Value;
}

/*
* @brief	Get room sort order value
*
* @return	Sort order value (0 or 1)
* @author	Rubens Suguimoto
*/
function DATA_GetRoomOrderBy()
{
	return this.OrderBy;
}

/*
* @brief	Set current room rating
*
* @param	RatingType	Rating category string
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetRoomCurrentRating(RatingType)
{
	this.CurrentRating = RatingType;
}

/*
* @brief	Get current room rating
*
* @return 	Rating category string
* @author	Rubens Suguimoto
*/
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
* @param		Username 	User's name
* @param 		ChatObj	 	Chat window object
* @author 		Ulysses Bonfim and Rubens Suguimoto
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
* @param		Username	User's name
* @author 		Ulysses Bonfim and Rubens Suguimoto
* @return 		True if removed or null if not founded
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
* @brief		Find a chat with ohter user
*
* @param		Username	User's name
* @author 		Ulysses Bonfim and Rubens Suguimoto
* @return 		Position of the chat in chat list (integer)
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



/*
* @brief	Get chat object
*
* @param	Username	User's name
* @return 	Chat object or null if chat object not founded
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Get chat list length
*
* @return 	Caht list length (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetChatListLength()
{
	return this.Chat.ChatList.length;
}


/*
* @brief	Set max chats opened
*
* @param	NewMax	Max numbers os chat opened
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetMaxChats(NewMax)
{
	this.Chat.MaxChats = NewMax;
}


/*
* @brief	Get max chats opened
*
* @return	Max chats opened number (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetMaxChats()
{
	return this.Chat.MaxChats;
}


/*
* @brief	Set max chat characters number
*
* @param	MaxChar		Max characters numbers (integer)
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetMaxChatChar(MaxChar)
{
	this.Chat.MaxChatChar = MaxChar;
}


/*
* @brief	Get max chat characters number
*
* @return 	Max characters in a chat message(integer)
* @author	Rubens Suguimoto
*/
function DATA_GetMaxChatChar()
{
	return this.Chat.MaxChatChar;
}


/*
* @brief	Add a chat to be show chat
*
* @param	ChatObj 	Chat object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_AddShowChat(ChatObj)
{
	this.Chat.ShowChat.push(ChatObj);
}


/*
* @brief	Remove chat from show chat list
*
* @param	Username	User's name
* @return	none
* @author	Rubens Suguimoto
*/
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
* @brief	Add a challenge in 'ChallengeList'
*
* ChallengeID is used temporary to identify challenge
* in challenge list when match id was not defined
*
* @param	ChallengeId	Identification number of challenge in maindata
* @param	Challenged	Who receive a challenge
* @param	Challenger	Who make a challenge
* @param	Category	Game category
* @param	Rated		Flag to set rated game
* @param	MatchId		Identification number of challenge in chess server
* @author 	Ulysses Bonfim and Rubens Suguimoto
* @return 	Boolean
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

	this.Challenge.ChallengeList.push(Challenge);

	return true;
}	

/*
* @brief	Update a challenge
*
* @param	ChallengeId	Identification number of challenge in maindata
* @param	Challenged	Who receive a challenge
* @param	Challenger	Who make a challenge
* @param	Category	Game category
* @param	Rated		Flag to set rated game
* @param	MatchId		Identification number of challenge in chess server
* @return 	Boolean	
* @author	Rubens Suguimoto
*/
function DATA_UpdateChallenge(ChallengeId, Challenger, Challenged, Category, Rated, MatchId)
{
	// Creating a new object
	var Challenge;

	Challenge = this.GetChallenge(ChallengeId, MatchId);
	
	// Challenge already exist on structure
	if (Challenge == null)
	{
		return null;
	}

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
* @brief	Remove a challenge
*
* @param	MatchId		Identification number of challenge in chess server
* @param	ChallengeId	Identification number of challenge in maindata
* @author	Ulysses Bonfim and Rubens Suguimoto
* @return	Empty string
* @see		DATA_FindChallenge
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
	this.Challenge.ChallengeList.splice(i, 1);

	return "";
}	


/**
* @brief	Find a challenge
*
* You can find a challenge by ChallengeId or MatchId;
* This is used because interface create a instance of challenge
* before get match id from server. If server send a error, this function
* is able to find challenge in challenge list;
*
* @param	MatchId		Identification number of challenge in chess server
* @param	ChallengeId	Identification number of challenge in maindata
* @return 	Challenge position (integer) or null if not founded
* @author 	Ulysses Bonfim
*/
function DATA_FindChallenge(ChallengeId, MatchId)
{
	var i;
	// If match id exists, find by match id
	if(MatchId != null)
	{
		for (i=0 ; i < this.Challenge.ChallengeList.length ; i++)
		{
			if (this.Challenge.ChallengeList[i].MatchId == MatchId)
			{
				return i;
			}
		}
	}

	// By default, find by challenge id
	for (i=0 ; i < this.Challenge.ChallengeList.length ; i++)
	{
		if (this.Challenge.ChallengeList[i].ChallengeId == ChallengeId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}

/*
* @brief	Get challenge item
*
* @param	MatchId		Identification number of challenge in chess server
* @param	ChallengeId	Identification number of challenge in maindata
* @return	Challenge object or null (if was not founded)
* @author	Rubens Suguimoto
*/
function DATA_GetChallenge(ChallengeId, MatchId)
{
	var i;

	i = this.FindChallenge(ChallengeId, MatchId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return this.Challenge.ChallengeList[i];
	}
	else
	{
		return null;
	}
}

/**
* @brief	Set a Challenge window pointer in challenge item
* @param	Id	  	Challenge identification number
* @param	WindowObj	Window Object with challenge content
* @author 	Ulysses Bonfim and Rubens Suguimoto
* @return 	none
* @see		DATA_FindChallengeById
*/
function DATA_AddChallengeWindow (Id, WindowObj)
{
	var Challenge = this.GetChallenge(Id, Id);

	if (Challenge != null)
	{
		Challenge.Window = WindowObj;
	}
}


/*
* @brief	Get challenge list
*
* @return 	Challenge list
* @author	Rubens Suguimoto
*/
function DATA_GetChallengeList()
{
	return this.Challenge.ChallengeList;
}


/*
* @brief	Set challenge menu object
*
* @param	MenuObj		Challenge menu object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetChallengeMenu(MenuObj)
{
	this.Challenge.ChallengeMenu = MenuObj;
}


/*
* @brief	Get challenge menu
*
* @return	Challenge menu object
* @author	Rubens Suguimoto
*/
function DATA_GetChallengeMenu()
{
	return this.Challenge.ChallengeMenu;
}


/*
* @brief	Set challenge sequence number
*
* This number is used to set challenge id (challenge identification number in data struct)
*
* @param	NewValue	New challenge id value
* @return	none
* @author	Rubens Suguimoto
*/

function DATA_SetChallengeSequence(NewValue)
{
	this.Challenge.ChallengeSequence = NewValue;
}


/*
* @brief	Get challenge sequence number
*
* @return	Challenge identification number (integer)
* @author	Rubens Suguimoto
*/
function DATA_GetChallengeSequence()
{
	return this.Challenge.ChallengeSequence;
}

/**********************************
 * METHODS - GAME                 *
 **********************************/

/**
* @brief	Set current game 
* @param	Game	Game object to be a current game
* @author 	Rubens Suguimoto
* @return 	none
*/
function DATA_SetCurrentGame(Game)
{
	if(Game != null)
	{
		this.Game.Current = Game;
	}
	else
	{
		this.Game.Current = null;
	}
}

/**
* @brief	Get current game 
*
* @return 	Current game object
* @author 	Rubens Suguimoto
*/
function DATA_GetCurrentGame()
{
	return this.Game.Current;
}

/**
* @brief	Add a game
*
* @param	Id 		Game identification number (integer)
* @param	Player1		First player's name
* @param	Player2		Second player's name
* @param	Color		Your color on game
* @param	GameDiv		Board object
* @return 	New Game structure
*
* @author 	Rubens Suguimoto
* @see		DATA_SetCurrentGame
*/
function DATA_AddGame(Id, Player1, Player2, Color, GameDiv)
{
	var NewGame = new Object();

	this.SetCurrentGame(NewGame);

	NewGame.Id = Id;
	NewGame.YourColor = Color;
	NewGame.BoardColor = Color;
	
	// Setting users colors
	if (Color == "white")
	{
		if (Player1 == MainData.GetUsername())
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
		if (Player1 == MainData.GetUsername())
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
* @brief		Remove a game
*
* @param		Id 	  Game identification number
* @return 		Removed game item
* @author 		Rubens Suguimoto
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
		if(this.Game.GameList.length > 0)
		{
			MainData.SetCurrentGame(this.Game.GameList[GamePosition]);
		}
		else
		{
			MainData.SetCurrentGame(null);
		}
		//If next game is null, set previous game to current game, else
		//there is no game on GameList
		if(MainData.Game.Current == null)
		{
			if(this.Game.GameList.length > 0)
			{
				MainData.SetCurrentGame(this.Game.GameList[GamePosition-1]);
			}
		}

		return RemovedGame;
	}
	
}

/**
* @brief		Find game by game id
*
* @param		Id 	  Game identification
* @return 		Game index or null (if not founded)
* @author 		Rubens Suguimoto
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
* @brief		Add a move in game
*
* @param		BoardArray 	  Board Array
* @param		Move		  Game move done
* @param		ShortMove	  Move done in short format
* @param		PWTime		  White player's  time
* @param		PBTime		  Balck player's time
* @param		Turn		  Who did the move
* @return 		none
*
* @author 		Rubens Suguimoto
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
* @brief		Set your turn flag
* @param		TurnColor 	 Player's color
* @author 		Rubens Suguimoto
* @return 		none
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
* @brief		Get game item
* @param		Id	   Game identification number
* @author 		Rubens Suguimoto
* @return 		Game item or null (if was not founded)
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
* @brief	Set current oldgame
*
* @param	Game	Oldgame item
* @author 	Rubens Suguimoto
* @return 	none
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
*
* @author 		Rubens Suguimoto
* @return 		Oldgame item
*/
function DATA_GetCurrentOldGame()
{
	return this.OldGame.Current;
}

/**
* @brief		Add a oldgame 
* @param		PWName	  White player's name
* @param		PBName	  Black player's name
* @param		Color	  Your color
* @param		GameDiv	  Board object
* @author 		Rubens Suguimoto
* @return 		none
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
* @brief	Remove a oldgame
* @param	Id	  Oldgame identification
* @author 	Rubens Suguimoto
* @return 	Oldgame removed item
* @see		DATA_SetCurrentOldGame
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
/*
		//Set next game on GameList to current oldgame
		MainData.SetCurrentOldGame(this.OldGame.OldGameList[GamePosition]);
		//If next game is null, set previous game to current oldgame, else
		//there is no game on old game list
		if(this.GetCurrentOldGame() == null)
		{
			MainData.SetCurrentOldGame(this.OldGame.OldGameList[GamePosition-1]);
		}
*/
		MainData.SetCurrentOldGame(null);

		return RemovedOldGame;
	}
	
}

/**
* @brief	Get old game item
* @param	Id	   Game identification number
* @author 	Rubens Suguimoto
* @return 	The game structure
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
* @brief	Set a normal game as the current old game
*
* @param	GameObj    		The normal game object
* @author 	Rubens Suguimoto
* @return 	Oldgame position in old game list
* @see		DATA_SetCurrentOldGame
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
* @brief	Add search game window parameters
* @param	Id		Game ID
* @param	Elements   	HTML DOM elements list
* @param	User	   	User's name
* @author	Danilo Yorinori
* @return	boolean
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
*
* @param		Id	Old game chess server identification number
* @author		Danilo Yorinori
* @return		boolean
*/
function DATA_RemoveSearchGameInfo(Id)
{
	var i = this.FindSearchGameInfo(Id);

	if (i != null)
	{
		this.SearchGameInfoList.splice(i,1);
	}

	return true;
}

/**
* @brief		Find search game window
*
* @param		Id	Old game chess server identification number
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


/*
* @brief	Get search old game item
*
* @param	Id	Old game chess server identification number
* @return 	Old game item or null (if not founded)
* @author	Rubens Suguimoto
*/
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
 * METHODS - PREFERENCES          *
 **********************************/

/*
* @brief	Set your password
*
* @param	NewPassword	New password string
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetPassword(NewPassword)
{
	this.Preferences.Password = NewPassword;
}


/*
* @brief	Get your password
*
* @return 	Password string
* @author	Rubens Suguimoto
*/
function DATA_GetPassword()
{
	return this.Preferences.Password;
}


/*
* @brief	Set your username
*
* @param	Username
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetMyUsername(Username)
{
	this.Preferences.Username = Username;
}


/*
* @brief	Get your username
*
* @return	Your username string
* @author	Rubens Suguimoto
*/
function DATA_GetMyUsername()
{
	return this.Preferences.Username;
}


/*
* @brief	Set your away counter limit
*
* @param	Counter number limit (seconds)
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetAwayCounter(Counter)
{
	this.Preferences.AwayCounter = Counter;
}


/*
* @brief	Get away counter limit
*
* @return	Away counter limit
* @author	Rubens Suguimoto
*/
function DATA_GetAwayCounter()
{
	return this.Preferences.AwayCounter;
}


/*
* @brief	Set away interval counter
*
* @param	Interval	Counter number pointer
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetAwayInterval(Interval)
{
	this.Preferences.AwayInterval = Interval;
}


/*
* @brief	Get away interval counter
*
* @return	Counter number pointer
* @author	Rubens Suguimoto
*/
function DATA_GetAwayInterval()
{
	return this.Preferences.AwayInterval;
}

/**********************************
 * METHODS - WINDOWS              *
 **********************************/
/**
* @brief	Add a WindowObject in WindowList
*
* @param	WindowObj	Window object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_AddWindow(WindowObj)
{
	var WindowListLen = this.Windows.WindowList.length;

	this.Windows.WindowList.push(WindowObj);
	this.Windows.Focus = WindowObj;

}

/**
* @brief	Set Window Object in focus
*
* @param	WindowObj	Window object
* @return 	Window Object 
* @author	Rubens Suguimoto
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
* @brief	Get Window Object in focus
*
* @return	Window object
* @author	Rubens Suguimoto
*/
function DATA_GetWindowFocus()
{
	return this.Windows.Focus;
}

/*
* @brief	Get Window list length
*
* @return 	Window Object list length
* @author	Rubens Suguimoto
*/
function DATA_GetWindowListLength()
{
	return this.Windows.WindowList.length;
}


/*
* @brief	Get window object
*
* @param	Index	Window object index in Window list
* @return 	Window Object
* @author	Rubens Suguimoto
*/
function DATA_GetWindow(Index)
{
	return this.Windows.WindowList[Index];
}

/**
* @brief	Remove a Window Object from WindowList
*
* @param	WindowObj	Window Object
* @return	none
* @author	Rubens Suguimoto
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
* @brief	Find Window Object positon in WindowList
*
* @param	WindowObj	Window Object
* @return	Window object position or null (if not founded)
* @author	Rubens Suguimoto
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
 * METHODS - LOAD OBJECT          *
 **********************************/

/*
* @brief	Set load interface object
*
* @param	Obj	Load interface object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetLoadObj(Obj)
{
	this.LoadObj = Obj;
}


/*
* @brief	Get load interface object
*
* @return	Load interface object
* @author	Rubens Suguimoto
*/
function DATA_GetLoadObj()
{
	return this.LoadObj;
}

/**********************************
 * METHODS - PROFILE              *
 **********************************/


/*
* @brief	Add profile
*
* @param	Jid		Jabber Id
* @param	Username	User's name
* @param	ProfileWindow	Window object with profile content
* @return	none 
* @author	Rubens Suguimoto
*/
function DATA_AddProfile(Jid, Username, ProfileWindow)
{
	var NewProfile = new Object();
	// Data Id
	NewProfile.Jid = Jid;
	NewProfile.Profile = ProfileWindow;

	this.ProfileList.push(NewProfile);

}


/*
* @brief	Find profile
*
* @param	Jid	Jabber id
* @return 	Profile position or null (if not found)
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Remove profile
*
* @param	Jid	Jabber Id
* @return 	True if removed or false (if not found)
* @author	Rubens Suguimoto
*/
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


/*
* @brief	Get profile item
*
* @param	Jid	Jabber Id
* @return	Profile	Item or null (if not found)
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Set your profile
*
* This is used to edit your profile
*
* @param	Username	User's name
* @param	Fullname	User's full name
* @param	Desc		User's description
* @param	ImgType		User's image type
* @param	Img64		User's image in base64 
*
* @return none
* @author	Rubens Suguimoto
*/
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

/**********************************
 * METHODS - SEARCHUSER           *
 **********************************/

/**
* @brief		Add search user window parameters
* @param		Elements	HTML DOM elements
* @author		Danilo Yorinori
* @return		boolean
*/
function DATA_AddSearchUserInfo(Elements)
{
	var Search = new Object();

	Search.Elements = Elements;

	this.SearchUserInfo= Search;

	return true;
}

/**
* @brief		Remove search user window
* @author		Danilo Yorinori
* @return		boolean
*/
function DATA_RemoveSearchUserInfo()
{
	if (this.SearchUserInfo != null)
	{
		this.SearchUserInfo = null;
	}

	return true;
}

/**
* @brief		Sort Userlist into ascending or descending order
*
* @author		Danilo Yorinori
* @return		boolean
* @see			UTILS_SortByUsernameAsc UTILS_SortByUsernameDsc
*/
function DATA_SortSearchUserByNick()
{
	if (this.SearchUserInfo.Elements.OrderBy != "1")
	{
		this.SearchUserInfo.Elements.Result.sort(UTILS_SortByUsernameAsc);
	}
	else if (this.SearchUserInfo.Elements.OrderBy == "1")
	{
		this.SearchUserInfo.Elements.Result.sort(UTILS_SortByUsernameDsc);
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
function DATA_SortSearchUserByName()
{
	if (this.SearchUserInfo.Elements.OrderBy != "3")
	{
		this.SearchUserInfo.Elements.Result.sort(UTILS_SortByFullnameAsc);
	}
	else if (this.SearchUserInfo.Elements.OrderBy == "3") 
	{
		this.SearchUserInfo.Elements.Result.sort(UTILS_SortByFullnameDsc);
	}


	return true;
}


/**********************************
 * METHODS - GAMECENTER           *
 **********************************/

/*
* @brief	Set game center object
*
* @param	Obj	Game center object
* @return 	none
* @author	Rubens Suguimoto
*/
function DATA_SetGamecenter(Obj)
{
	this.Gamecenter.Gamecenter = Obj;
}


/*
* @brief	Get game center object
*
* @return	Game center object
* @author	Rubens Suguimoto
*/
function DATA_GetGamecenter()
{
	return this.Gamecenter.Gamecenter;
}

/*********************************************
 * METHODS - GAMECENTER ANNOUNCE CHALLENGES  *
 ********************************************/

/*
* @brief	Add announce
*
* @param	Player		Player object (Name, Color, Time, Inc)
* @param	Rating		Rating current category value
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Category	Game category
* @param	Rated		Game rated flag
* @param	Private		Game private flag
* @param	AnnounceId	Game announce identification number 
* @return 	Boolean (True)
* @author	Rubens Suguimoto
*/
function DATA_AddAnnounce(Player, Rating, Time, Inc, Category, Rated, Private, AnnounceId)
{
	// Creating a new object
	var Announce = new Object();
	var i;

	i = this.FindAnnounce(AnnounceId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	Announce.Id = AnnounceId;
	Announce.Time = Time;
	Announce.Inc = Inc;
	Announce.Rating = Rating;
	Announce.Category = Category;
	Announce.Player =Player;
	Announce.Username =Player.Name;
	Announce.Rated = Rated;
	Announce.Private = Private;

	this.Gamecenter.AnnounceList.push(Announce);

	return true;
}


/*
* @brief	Remove announce 
*
* @param	AnnounceId	Announce identification number
* @return 	Empty string
* @author	Rubens Suguimoto
*/
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
	this.Gamecenter.AnnounceList.splice(i, 1);

	return "";

}


/*
* @brief	Find announce
*
* @param	AnnounceId	Announce identification number
* @return	Announce item index or null (if not founded)
* @author	Rubens Suguimoto
*/
function DATA_FindAnnounce(AnnounceId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.Gamecenter.AnnounceList.length ; i++)
	{
		if (this.Gamecenter.AnnounceList[i].Id == AnnounceId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}


/*
* @brief	Get announce
*
* @param	AnnounceId	Announce identification number
* @return 	Announce item or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_GetAnnounce(AnnounceId)
{
	var Pos = this.FindAnnounce(AnnounceId);
	
	if(Pos != null)
	{
		return this.Gamecenter.AnnounceList[Pos];
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get announce list
*
* @return	Announce list
* @author	Rubens Suguimoto
*/
function DATA_GetAnnounceList()
{
	return this.Gamecenter.AnnounceList;
}
/*********************************************
 * METHODS - GAMECENTER POSTPONE CHALLENGES  *
 ********************************************/

/**
* @brief	Add a postponed game
* @param	Player		Oponent player's object
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Category	Game category
* @param	Rating		Rating current category value
* @param	Date		Date of adjourned match
* @param	Status		Oponent player status
* @param	PostponeId	Postponed game identification number
* @author 	Rubens Suguimoto
* @return 	Boolean
*/
function DATA_AddPostpone(Player, Time, Inc, Category, Rating, Date, Status, PostponeId)
{
	// Creating a new object
	var Postpone = new Object();
	var i;

	i = this.FindPostpone(PostponeId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	Postpone.Id = PostponeId;
	Postpone.Category = Category;
	Postpone.Player = Player;
	Postpone.Time = Time;
	Postpone.Inc = Inc;
	Postpone.Date = Date;
	Postpone.Rating = Rating;
	Postpone.Status = Status;
	Postpone.Username = Player.Name;

	Postpone.Window = null;

	this.Gamecenter.PostponeList.push(Postpone);

	return true;
}	
/*
* @brief	Find a postponed game
* @param	PostponeId	Postponed game identification number
* @author 	Rubens Suguimoto
* @return 	Postponed game item or null (if not found)
*/
function DATA_FindPostpone(PostponeId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.Gamecenter.PostponeList.length ; i++)
	{
		if (this.Gamecenter.PostponeList[i].Id == PostponeId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}

/**
* @brief	Remove a postpone challenge in 'PostponeList'
* @param	PostponeId	Postponed game identification number
* @author 	Rubens Suguimoto
* @return 	Postponed game item or null (if not found)
* @see		DATA_FindPostpone
*/
function DATA_RemovePostpone(PostponeId)
{
	var i;

	i = this.FindPostpone(PostponeId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.Gamecenter.PostponeList.splice(i, 1);

	return "";
}


/*
* @brief	Get postpone item
*
* @param	PostponeId	Postponed game identification number
* @return 	Postponed item index or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_GetPostpone(PostponeId)
{
	var Pos = this.FindPostpone(PostponeId);

	if (Pos != null) 
	{
		return this.Gamecenter.PostponeList[Pos];
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get postpone list
*
* @return	Postponed games list
* @author	Rubens Suguimoto
*/
function DATA_GetPostponeList()
{
	return this.Gamecenter.PostponeList;
}


/*
* @brief	Set postponed game oponent status
*
* @param	PostponeId	Postponed game identification number
* @param	Status		Oponent status
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetPostponeStatus(PostponeId, Status)
{
	var PostponeItem = this.GetPostpone(PostponeId);
	PostponeItem.Status = Status;
}

/*********************************************
 * METHODS - GAMECENTER CURRENTGAMES CHALLENGES  *
 ********************************************/

/**
* @brief		Add a current game
*
* @param		WPlayer		White player object
* @param		WRating		White player rating
* @param		BPlayer		Black player object
* @param		BRating		Black player rating
* @param		Category	Game category
* @param		Time		Game time
* @param		Rated		Game rated flag
* @param		Moves		Number of moves done
* @param		CurrentGamesId	Current game identification number 
* @author 		Rubens Suguimoto
* @return 		True if game was added or null(if current game already exist )
*/
function DATA_AddCurrentGames(WPlayer, WRating, BPlayer, BRating, Category, Time, Rated, Moves, CurrentGamesId)
{
	// Creating a new object
	var CurrentGames = new Object();
	var i;

	i = this.FindCurrentGames(CurrentGamesId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	CurrentGames.Id = CurrentGamesId;
	CurrentGames.Category = Category;
	CurrentGames.WPlayer = WPlayer;
	CurrentGames.BPlayer = BPlayer;
	CurrentGames.Time = Time;
	CurrentGames.Rated = Rated;
	CurrentGames.WRating = WRating;
	CurrentGames.BRating = BRating;
	CurrentGames.Moves = Moves;

	this.Gamecenter.CurrentGamesList.push(CurrentGames);

	return true;
}	
/*
* @brief		Find a current game
*
* @param		CurrentGamesId	Current game identification number 
* @author 		Rubens Suguimoto
* @return 		Current game index or null (if not found)
*/
function DATA_FindCurrentGames(CurrentGamesId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.Gamecenter.CurrentGamesList.length ; i++)
	{
		if (this.Gamecenter.CurrentGamesList[i].Id == CurrentGamesId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}

/**
* @brief		Remove a current game
*
* @param		CurrentGamesId	Current game identification number 
* @author 		Rubens Suguimoto
* @return 		Empty string
* @see			DATA_FindCurrentGames
*/
function DATA_RemoveCurrentGames(CurrentGamesId)
{
	var i;

	i = this.FindCurrentGames(CurrentGamesId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.Gamecenter.CurrentGamesList.splice(i, 1);

	return "";
}


/*
* @brief	Get current game item
*
* @param	CurrentGamesId	Current game identification number 
* @return	Current game item or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_GetCurrentGames(CurrentGamesId)
{
	var Pos = this.FindCurrentGames(CurrentGamesId);

	if (Pos != null) 
	{
		return this.Gamecenter.CurrentGamesList[Pos];
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get current games list
*
* @return	Current games list
* @author	Rubens Suguimoto
*/
function DATA_GetCurrentGamesList()
{
	return this.Gamecenter.CurrentGamesList;
}
/*********************************************
 * METHODS - GAMECENTER MATCH OFFER          *
 ********************************************/

/**
* @brief	Add a offered match
*
* @param	Player		Player object
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Category	Game category
* @param	Rated		Rated game flag
* @param	Private		Private game flag
* @param	MatchOfferId	Offered match identification number
* @author 	Rubens Suguimoto
* @return 	True if game was added or null(if current game already exist )
*/
function DATA_AddMatchOffer(Player, Time, Inc, Category, Rated, Private, MatchOfferId)
{
	// Creating a new object
	var MatchOffer = new Object();
	var i;

	i = this.FindMatchOffer(MatchOfferId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	MatchOffer.Id = MatchOfferId;
	MatchOffer.Player = Player;
	MatchOffer.Time = Time;
	MatchOffer.Inc = Inc;
	MatchOffer.Category = Category;
	MatchOffer.Rated = Rated;
	MatchOffer.Private = Private;
	MatchOffer.Username = Player.Name;

	this.Gamecenter.MatchOfferList.push(MatchOffer);

	return true;
}	
/*
* @brief	Find a offered match
*
* @param	MatchOfferId	Offered match identification number
* @author 	Rubens Suguimoto
* @return 	Offered match index or null (if not found)
*/
function DATA_FindMatchOffer(MatchOfferId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.Gamecenter.MatchOfferList.length ; i++)
	{
		if (this.Gamecenter.MatchOfferList[i].Id == MatchOfferId)
		{
			return i;
		}
	}

	// Challenge not found
	return null;
	
}

/**
* @brief	Remove a offered match
*
* @param	MatchOfferId	Offered match identification number
* @author 	Rubens Suguimoto
* @return 	Empty string
* @see		DATA_FindMatchOffer
*/
function DATA_RemoveMatchOffer(MatchOfferId)
{
	var i;

	i = this.FindMatchOffer(MatchOfferId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.Gamecenter.MatchOfferList.splice(i, 1);

	return "";
}


/*
* @brief	Get a offered match
*
* @param	MatchOfferId	Offered match identification number
* @return	Offered match item or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_GetMatchOffer(MatchOfferId)
{
	var Pos = this.FindMatchOffer(MatchOfferId);

	if (Pos != null) 
	{
		return this.Gamecenter.MatchOfferList[Pos];
	}
	else
	{
		return null;
	}
}


/*
* @brief	Get offered matches list
*
* @return 	Offered matchs list
* @author	Rubens Suguimoto
*/
function DATA_GetMatchOfferList()
{
	return this.Gamecenter.MatchOfferList;
}

/**********************************
 * METHODS - ADMINCENTER          *
 **********************************/

/*
* @brief	Set admin center object
*
* @param	Obj	Admin center object
* @return	none
* @author	Rubens Suguimoto
*/
function DATA_SetAdmincenter(Obj)
{
	this.Admincenter.Admincenter = Obj;
}


/*
* @brief	Get admin center object
*
* @return	Admin center object
* @author	Rubens Suguimoto
*/
function DATA_GetAdmincenter()
{
	return this.Admincenter.Admincenter;
}
/*********************************************
 * METHODS - GAMECENTER PUNISH LIST          *
 ********************************************/

/*
* @brief	Add punished player
*
* @param	Name		User's name
* @param	Punish		Punish string
* @param	Incident	Incident times
* @param	Date		Punish date
* @param	Period		Punish time interval
* @param	Reason		Reason to punish string
* @return 	True if game was added or null(if current game already exist )
* @author	Rubens Suguimoto
*/
function DATA_AddPunish(Name, Punish, Incident, Date, Period, Reason)
{
	// Creating a new object
	var PunishObj = new Object();
	var i;

	i = this.FindPunish(Name);
	
	// Punish item already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	PunishObj.Id = Name;
	PunishObj.Username = Name;
	PunishObj.Punish = Punish;
	PunishObj.Incident = Incident;
	PunishObj.Date = Date;
	PunishObj.Period = Period;
	PunishObj.Reason = Reason;

	this.Admincenter.PunishList.push(PunishObj);

	return true;

}

/*
* @brief	Remove punished player
*
* @param	PunishId	Punish identification field
* @return 	Empty string
* @author	Rubens Suguimoto
*/
function DATA_RemovePunish(PunishId)
{
	var i;

	i = this.FindPunish(PunishId);

	// No punish with id founded
	if (i == null)
	{
		return null;
	}

	// Remove punish from list
	this.Admincenter.PunishList.splice(i, 1);

	return "";

}

/*
* @brief	Find punished player
*
* @param	PunishId	Punish identification field
* @return none
* @author	Rubens Suguimoto
*/
function DATA_FindPunish(PunishId)
{
	var i;

	//find punish item by punish id
	for (i=0 ; i < this.Admincenter.PunishList.length ; i++)
	{
		if (this.Admincenter.PunishList[i].Id == PunishId)
		{
			return i;
		}
	}

	// not founded
	return null;
	
}

/*
* @brief	Get punish item
*
* @param	PunishId	Punish identification field
* @return	Punish item or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_GetPunish(PunishId)
{
	var Pos = this.FindPunish(PunishId);

	if (Pos != null) 
	{
		return this.Admincenter.PunishList[Pos];
	}
	else
	{
		return null;
	}

}

/*
* @brief	Get punished players list
*
* @return 	Punished players list
* @author	Rubens Suguimoto
*/
function DATA_GetPunishList()
{
	return this.Admincenter.PunishList;
}
/*ADMINCENTER OBJECT LEVEL LIST METHODS****************/

/*
* @brief	Add player level
*
* @param	Name	User's name
* @param	Level	User's level
* @return 	True if game was added or null(if current game already exist )
* @author	Rubens Suguimoto
*/
function DATA_AddLevel(Name, Level)
{
	// Creating a new object
	var Punish = new Object();
	var i;
	var LevelId = Name;

	i = this.FindLevel(LevelId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	Level.Id = LevelId;
	Level.Username = Name;
	Level.Level = Level;

	this.Admincenter.LevelList.push(Level);

	return true;

}

/*
* @brief	Remove player level
*
* @param	LevelId		Player level identification field
* @return 	Empty string
* @author	Rubens Suguimoto
*/
function DATA_RemoveLevel(LevelId)
{
	var i;

	i = this.FindLevel(LevelId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.Admincenter.LevelList.splice(i, 1);

	return "";


}

/*
* @brief	Find player level
*
* @param	LevelId		Player level identification field
* @return	Player level item index or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_FindLevel(LevelId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.Admincenter.LevelList.length ; i++)
	{
		if (this.Admincenter.LevelList[i].Id == LevelId)
		{
			return i;
		}
	}

	// not founded
	return null;

}

/*
* @brief	Get player level item
*
* @param	LevelId		Player level identification field
* @return	Player level item
* @author	Rubens Suguimoto
*/
function DATA_GetLevel(LevelId)
{
	var Pos = this.FindLevel(LevelId);

	if (Pos != null) 
	{
		return this.Admincenter.LevelList[Pos];
	}
	else
	{
		return null;
	}

}

/*
* @brief	Get players level list
*
* @return	Players level list
* @author	Rubens Suguimoto
*/
function DATA_GetLevelList()
{
	return this.Admincenter.LevelList;
}
/*ADMINCENTER OBJECT ADMIN LEVEL LIST METHODS****************/

/*
* @brief	Add admin level
*
* @param	Name	User's name
* @param	Level	User's level
* @return 	True if game was added or null(if current game already exist )
* @author	Rubens Suguimoto
*/
function DATA_AddAdminLevel(Name, Level)
{
	// Creating a new object
	var AdminLvl = new Object();
	var i;
	var AdminLevelId = Name;
	
	i = this.FindAdminLevel(AdminLevelId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	AdminLevel.Id = AdminLevelId;
	AdminLevel.Username = Name;
	AdminLevel.Level = Level;

	this.Admincenter.AdminLevelList.push(AdminLevel);

	return true;


}

/*
* @brief	Remove admin level
*
* @param	AdminLevelId	Admin level identification field
* @return	Empty string
* @author	Rubens Suguimoto
*/
function DATA_RemoveAdminLevel(AdminLevelId)
{
	var i;

	i = this.FindAdminLevel(AdminLevelId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.Admincenter.AdminLevelList.splice(i, 1);

	return "";


}

/*
* @brief	Find admin level
*
* @param	AdminLevelId	Admin level identification field
* @return	Admin level item index or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_FindAdminLevel(AdminLevelId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.Admincenter.AdminLevelList.length ; i++)
	{
		if (this.Admincenter.AdminLevelList[i].Id == AdminLevelId)
		{
			return i;
		}
	}

	// not founded
	return null;

}

/*
* @brief	Get admin level item
*
* @param	AdminLevelId	Admin level identification field
* @return 	Admin level item
* @author	Rubens Suguimoto
*/
function DATA_GetAdminLevel(AdminLevelId)
{
	var Pos = this.FindAdminLevel(AdminLevelId);

	if (Pos != null) 
	{
		return this.Admincenter.AdminLevelList[Pos];
	}
	else
	{
		return null;
	}

}

/*
* @brief	Get admins level list
*
* @return	Admins level list
* @author	Rubens Suguimoto
*/
function DATA_GetAdminLevelList()
{
	return this.Admincenter.AdminLevelList;
}
/*ADMINCENTER OBJECT ADJOURN LIST METHODS****************/

/*
* @brief	Add adjourned game
*
* @param	WName		White player's name
* @param	WRating		White player's current category rating
* @param	BName		Black player's name
* @param	BRating		Black player's current category rating
* @param	Category	Game category
* @param	GameTime	Game time
* @param	Inc		Game time increment
* @param	Rated		Game rated flag
* @param	AdjournId	Game adjourned game identification number
* @return 	True if game was added or null(if current game already exist )
* @author	Rubens Suguimoto
*/
function DATA_AddAdjourn(WName, WRating, BName, BRating, Category, GameTime, Inc, Rated, AdjournId)
{
	// Creating a new object
	var Adjourn = new Object();
	var i;

	i = this.FindAdjourn(AdjournId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	Adjourn.Id = AdjournId;
	Adjourn.WName = WName;
	Adjourn.BName = BName;
	Adjourn.WRating = WRating;
	Adjourn.BRating = BRating;
	Adjourn.Time = GameTime;
	Adjourn.Inc = Inc;
	Adjourn.Category = Category;
	Adjourn.Rated = Rated;

	this.Admincenter.AdjournList.push(Adjourn);

	return true;


}

/*
* @brief	Remove adjourned game
*
* @param	AdjournId	Game adjourned game identification number
* @return none
* @author	Rubens Suguimoto
*/
function DATA_RemoveAdjourn(AdjournId)
{
	var i;

	i = this.FindAdjourn(AdjournId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.Admincenter.AdjournList.splice(i, 1);

	return "";
}

/*
* @brief	Find adjourned game
*
* @param	AdjournId	Game adjourned game identification number
* @return none
* @author	Rubens Suguimoto
*/
function DATA_FindAdjourn(AdjournId)
{
	var i;

	// If match id exists, find by match id
	for (i=0 ; i < this.Admincenter.AdjournList.length ; i++)
	{
		if (this.Admincenter.AdjournList[i].Id == AdjournId)
		{
			return i;
		}
	}

	// Not found
	return null;

}

/*
* @brief	Get adjourned game item
*
* @param	AdjournId	Game adjourned game identification number
* @return	Adjourned game item
* @author	Rubens Suguimoto
*/
function DATA_GetAdjourn(AdjournId)
{
	var Pos = this.FindAdjourn(AdjournId);

	if (Pos != null) 
	{
		return this.Admincenter.AdjournList[Pos];
	}
	else
	{
		return null;
	}

}

/*
* @brief	Get adjourned games list
*
* @return	Adjourned games list
* @author	Rubens Suguimoto
*/
function DATA_GetAdjournList()
{
	return this.Admincenter.AdjournList;
}
/*ADMINCENTER OBJECT WORDS LIST METHODS****************/

/*
* @brief	Add banned word
*
* @param	Word string	String baned
* @return 	True if game was added or null(if current game already exist )
* @author	Rubens Suguimoto
*/
function DATA_AddWords(WordString)
{
	// Creating a new object
	var Word = new Object();
	var i;
	var WordId = WordString;

	i = this.FindWords(WordId);
	
	// Challenge already exist on structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	Word.Id = WordId;
	Word.Word = WordString;

	this.Admincenter.WordsList.push(Word);

	return true;


}

/*
* @brief	Remove banned word
*
* @param	WordId		Word identification field
* @return 	Empty string
* @author	Rubens Suguimoto
*/
function DATA_RemoveWords(WordId)
{
	var i;

	i = this.FindWords(WordId);

	// No postpone challenge with id founded
	if (i == null)
	{
		return null;
	}

	// Remove challenge from list
	this.Admincenter.WordsList.splice(i, 1);

	return "";
}

/*
* @brief	Find banned word
*
* @param	WordId		Word identification field
* @return	Banned word list index or null (if not found)
* @author	Rubens Suguimoto
*/
function DATA_FindWords(WordId)
{
	var i;
	// find word by word id
	for (i=0 ; i < this.Admincenter.WordsList.length ; i++)
	{
		if (this.Admincenter.WordsList[i].Id == WordId)
		{
			return i;
		}
	}

	// Not found
	return null;

}

/*
* @brief	Get banned word
*
* @param	WordId		Word identification field
* @return	Banned word item
* @author	Rubens Suguimoto
*/
function DATA_GetWords(WordId)
{
	var Pos = this.FindWords(WordId);

	if (Pos != null) 
	{
		return this.Admincenter.WordsList[Pos];
	}
	else
	{
		return null;
	}

}

/*
* @brief	Get banned words list
*
* @return	Banned words list
* @author	Rubens Suguimoto
*/
function DATA_GetWordsList()
{
	return this.Admincenter.WordsList;
}
