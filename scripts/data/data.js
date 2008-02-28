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
* Class definition for main data sctructure
*/


/**
* Main data sctructure
*/
function DATA(ConfFile, LangFile)
{
	var Params = UTILS_OpenXMLFile(ConfFile);

	/*
	* State in jabber server
	*  -1 -> Disconnected
	*   0 -> Connected
	* > 1 -> Connecting
	*/
	this.ConnectionStatus = 1;
	this.HttpRequest = null;
	this.Browser = UTILS_IdentifyBrowser();
	this.Host = UTILS_GetTag(Params, "host");
	this.Resource = UTILS_GetTag(Params, "resource");
	this.Status = "available";
	this.Type = null;
	this.Xmlns = UTILS_GetTag(Params, "Xmlns");
	this.Version = UTILS_GetTag(Params, "version");
	this.MaxRooms = UTILS_GetTag(Params, "max-rooms");
	this.MaxChats = UTILS_GetTag(Params, "max-chats");
	this.EmoticonNum = UTILS_GetTag(Params, "emoticon-num");
	this.SearchComponent = UTILS_GetTag(Params, "search-component");
	this.CookieValidity = UTILS_GetTag(Params, "cookie-validity");
	this.RID = Math.round( 100000.5 + ( ( (900000.49999) - (100000.5) ) * Math.random() ) );
	this.SID = -1;

	/**
	* DATA STRUCTURE
	*/
	this.UserList = new Array();
	this.ChatList = new Array();
	this.RoomList = new Array();
	this.CurrentRoom = "";
	this.ChallengeList = new Array();
	this.ChatList = new Array();

	this.CurrentRoom = "";

	this.CurrentGame = null;
	this.GameList = new Array();

	this.CurrentOldGame = "";
	this.OldGameList = new Array();

	this.Rating = new Object();
	this.CurrentRating = "blitz";
	
	this.ProfileList = new Object();
	
	this.GetText = UTILS_OpenXMLFile(LangFile);
	this.Const = DATA_SetConsts();

	this.Windows = new Object();
	this.Windows.Focus = null;
	this.Windows.WindowList = new Array();

}

// Adding methods
DATA.prototype.AddUser = DATA_AddUser;
DATA.prototype.DelUser = DATA_DelUser;
DATA.prototype.FindUser = DATA_FindUser;
DATA.prototype.IsContact = DATA_IsContact;
DATA.prototype.GetStatus = DATA_GetStatus;
DATA.prototype.GetRating = DATA_GetRating;
DATA.prototype.SetDefault = DATA_SetDefault;
DATA.prototype.SetUserStatus = DATA_SetUserStatus;
DATA.prototype.SetSubs = DATA_SetSubs;
DATA.prototype.SetRating = DATA_SetRating;
DATA.prototype.SetType = DATA_SetType;

DATA.prototype.AddRoom = DATA_AddRoom;
DATA.prototype.DelRoom = DATA_DelRoom;
DATA.prototype.FindRoom = DATA_FindRoom;
DATA.prototype.SetRoom = DATA_SetRoom;
DATA.prototype.AddUserInRoom = DATA_AddUserInRoom;
DATA.prototype.FindUserInRoom = DATA_FindUserInRoom;
DATA.prototype.SetUserAttrInRoom = DATA_SetUserAttrInRoom;
DATA.prototype.DelUserInRoom = DATA_DelUserInRoom;

DATA.prototype.AddChat = DATA_AddChat;
DATA.prototype.RemoveChat = DATA_RemoveChat;
DATA.prototype.FindChat = DATA_FindChat;

DATA.prototype.AddChallenge = DATA_AddChallenge;
DATA.prototype.RemoveChallenge = DATA_RemoveChallenge;
DATA.prototype.RemoveChallengeById = DATA_RemoveChallengeById;
DATA.prototype.FindChallenge = DATA_FindChallenge;
DATA.prototype.FindChallengeById = DATA_FindChallengeById;
DATA.prototype.ClearChallenges = DATA_ClearChallenges;

DATA.prototype.AddGame = DATA_AddGame;
DATA.prototype.RemoveGame = DATA_RemoveGame;
DATA.prototype.FindGame = DATA_FindGame;
DATA.prototype.AddGameMove = DATA_AddGameMove;
DATA.prototype.SetCurrentGame = DATA_SetCurrentGame;
DATA.prototype.SetTurn = DATA_SetTurnGame;

DATA.prototype.AddOldGame = DATA_AddOldGame;
DATA.prototype.RemoveOldGame = DATA_RemoveOldGame;
DATA.prototype.SetCurrentOldGame = DATA_SetCurrentOldGame;
DATA.prototype.PushOldGame = DATA_PushGameToOldGame;

DATA.prototype.GetGame = DATA_GetGame;
DATA.prototype.GetOponent = DATA_GetOponent;

DATA.prototype.AddWindow = DATA_AddWindow;
DATA.prototype.RemoveWindow = DATA_RemoveWindow;
DATA.prototype.ChangeWindowFocus = DATA_ChangeWindowFocus;
DATA.prototype.FindWindow = DATA_FindWindow;

DATA.prototype.AddProfile = DATA_AddProfile;
DATA.prototype.RemoveProfile = DATA_RemoveProfile;
DATA.prototype.FindProfile = DATA_FindProfile;

/**********************************
 * METHODS - USER LIST            *
 **********************************/

/**
* Add user to user list
*/
function DATA_AddUser(Username, Status, Subs)
{
	// Creating a new object
	var User = new Object();

	if (this.FindUser(Username) != null)
		return false;

	// Setting atributes
	// The user's rating will be seted after
	User.Username = Username;
	User.Status = Status;
	User.Subs = Subs;
	User.Rating = new Object();;

	this.UserList[this.UserList.length] = User;

	return true;
}

/**
* Del user from user list
*/
function DATA_DelUser(Username)
{
	var i;

	// Searching user position
	i = this.FindUser(Username);

	// If user do not exist
	if (i == null)
		return null;

	// Removing user from user list
	this.UserList.splice(i, 1);
	return true;
}

/**
* Find user in user list
*/
function DATA_FindUser(Username)
{
	var i;

	for (i=0; i<this.UserList.length; i++)
	{
		if (this.UserList[i].Username == Username)
			return i;
	}
	return null;
}


/**
* Is 'Username' in your contact list?
*/
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

/**
* Get user status 
*/
function DATA_GetStatus(Username)
{
	var i;
	var UserPos = this.FindUser(Username);

	// If user not in your list
	if (UserPos == null)
	{
		for (i=0; i < this.RoomList.length; i++)
		{
			UserPos = this.FindUserInRoom(this.RoomList[i].Name, Username);

			if (UserPos != null)
			{
				return this.RoomList[i].UserList[UserPos].Status;
			}
		}
		return false;
	}
		
	return this.UserList[UserPos].Status;
}

/**
* Return Username Rating object
*/
function DATA_GetRating(Username)
{
	var UserPos = this.FindUser(Username);
	var i;

	if (UserPos)
	{
		return this.UserList[UserPos].Rating;
	}

	// Update rating in room user lists
	for (i=0; i<this.RoomList.length; i++)
	{
		UserPos = this.FindUserInRoom(this.RoomList[i].Name, Username);

		if (UserPos)
		{
			return this.RoomList[i].UserList[UserPos].Rating;
		}
	}
	return null;
}

/**
* Set default values to use
*/
function DATA_SetDefault(Username)
{
	this.Type = "user";
	this.RatingBlitz = "0";
	this.RatingStandard = "0";
	this.RatingLightning = "0";
}

/**
* Set user's status
*/
function DATA_SetUserStatus(Username, NewStatus)
{
	var UserPos = this.FindUser(Username);

	if (UserPos == null)
		return false;
		
	this.UserList[UserPos].Status = NewStatus;
	return true;
}


/**
* Set user's subscription state
*/
function DATA_SetSubs(Username, NewSubs)
{
	var UserPos = this.FindUser(Username);

	if (UserPos == null)
		return false;
		
	this.UserList[UserPos].Subs = NewSubs;
	return true;
}

/**
* Set user's type
*/
function DATA_SetType(Username, NewType)
{
	var UserPos = this.FindUser(Username);
	var i, RoomPos;

	// If it's your type
	if (Username == MainData.Username)
	{
		MainData.Type = NewType;
		return true;
	}

	// Update in contact list
	if (UserPos != null)
	{
		this.UserList[UserPos].Type = NewType;
	}

	// Update in room user list
	for (i=0; i<this.RoomList.length; i++)
	{
		RoomPos = this.FindUserInRoom(this.RoomList[i].Name, Username);

		if (RoomPos != null)
		{
			this.RoomList[i].UserList[RoomPos].Type = NewType;
		}
	}

	return true;
}


/**
* Set user's rating 
*/
function DATA_SetRating(Username, Category, Rating)
{
	var UserPos, Obj, i;

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
		switch (Category)
		{
			case('blitz'):
				Obj.Rating.Blitz = Rating;
				break;

			case('standard'):
				Obj.Rating.Standard = Rating;
				break;
		
			case('lightning'):
				Obj.Rating.Lightning = Rating;
				break;
		}
	}
	
	// Update rating in room user lists
	for (i=0; i<this.RoomList.length; i++)
	{
		UserPos = this.FindUserInRoom(this.RoomList[i].Name, Username);

		if (UserPos)
		{
			switch (Category)
			{
				case('blitz'):
					this.RoomList[i].UserList[UserPos].Rating.Blitz = Rating
					break;

				case('standard'):
					this.RoomList[i].UserList[UserPos].Rating.Standard = Rating
					break;

				case('lightning'):
					this.RoomList[i].UserList[UserPos].Rating.Lightning = Rating
					break;
			}
		}
	}
	return true;
}


/**********************************
 * METHODS - ROOM LIST            *
 **********************************/

/**
* Create new room in room list
*/
function DATA_AddRoom(RoomName, MsgTo, Role, Affiliation)
{
	// Creating a new object
	var Room = new Object();

	if (this.FindRoom(RoomName) != null || this.MaxRooms <= this.RoomList.length)
		return false;

	// Setting atributes
	Room.UserList = new Array();
	Room.Name = RoomName;
	Room.MsgTo = MsgTo;
	Room.Role = Role;
	Room.Affiliation = Affiliation;

	this.RoomList[this.RoomList.length] = Room;
	return true;
}

/**
* Del room in room list
*/
function DATA_DelRoom(RoomName)
{
	var i = this.FindRoom(RoomName);

	// If room do not exist
	if (i == null)
		return null;

	// Removing room from room list
	this.RoomList.splice(i, 1);
	return true;
}

/**
* Find room in room list
*/
function DATA_FindRoom(RoomName)
{
	var i;

	for (i=0; i<this.RoomList.length; i++)
	{
		if (this.RoomList[i].Name == RoomName)
			return i;
	}
	return null;
}

/**
* Set from, affiliation and role in 'RoomName'
* structure.
* Only for interface user
*/
function DATA_SetRoom(RoomName, From, Affiliation, Role)
{
	var i = this.FindRoom(RoomName);

	if (i == null)
	{
		return null;
	}

	MainData.RoomList[i].MsgTo = From;
	MainData.RoomList[i].Affiliation = Affiliation;
	MainData.RoomList[i].Role = Role;

	return true;
}

/**
* Add user in user list of a room
*/
function DATA_AddUserInRoom(RoomName, Username, Status, Type, Role, Affiliation)
{
	var RoomPos = this.FindRoom(RoomName);
	var User = new Object();

	// If room doesnt exists in data structure
	if (RoomPos == null)
	{
		throw "RoomNotCreatedException";
	}

	if (this.FindUserInRoom(RoomName, Username) != null)
	{
		throw "UserAlreadyInRoomException";
	}

	User.Username = Username;
	User.Status = Status;
	User.Role = Role;
	User.Affiliation = Affiliation;
	User.Type = Type;
	User.Rating = new Object();

	// Insert user in room's user list
	this.RoomList[RoomPos].UserList[this.RoomList[RoomPos].UserList.length] = User;
	return true;
}

/**
* Find user in user list of a room
*/
function DATA_FindUserInRoom(RoomName, Username)
{
	var j, i = this.FindRoom(RoomName);


	// If room doesnt exists in data structure
	if (i == null)
		return null;

	// Search user in room user list
	for (j=0; j<this.RoomList[i].UserList.length; j++)
	{
		if (this.RoomList[i].UserList[j].Username == Username)
		{
			return j;
		}
	}
	return null;
}

/**
* Set user attibutes in 'RoomName'
*/
function DATA_SetUserAttrInRoom(RoomName, Username, Status, Role, Affiliation)
{
	var j = this.FindRoom(RoomName)
	var i = this.FindUserInRoom(RoomName, Username)

	if (i == null || j == null)
		return false;

	this.RoomList[j].UserList[i].Status = Status;
	this.RoomList[j].UserList[i].Role = Role;
	this.RoomList[j].UserList[i].Affiliation = Affiliation;
	return true;
}

/**
* Del user from user list of a room
*/
function DATA_DelUserInRoom(RoomName, Username)
{
	var j = this.FindRoom(RoomName)
	var i = this.FindUserInRoom(RoomName, Username)

	if (i == null || j == null)
		return false;

	this.RoomList[j].UserList.splice(i, 1);
	return true;
}


/**********************************
 * METHODS - CHAT  *
 **********************************/

/**
* Add a chat in interface structure, with the other user name and his status
*
* @param 	Username The user that you are chating with
* @param 	Status User's current status
* @return 	bool
* @author 	Ulysses
*/
function DATA_AddChat (Username, Status)
{
	var Chat = new Object();
	var i;


	// Limit chat number
	if (this.MaxChats <= this.ChatList.length)
	{
		throw "MaxChatExceeded";
	}

	i = this.FindChat(Username);
	
	// Try to find the same chat in structure
	if (i != null)
	{
		return null;
	}

	// Setting atributes
	Chat.Username = Username;
	Chat.State = "hidden";
	
	if (Status == null)
	{
		Chat.Status = "available";
	}
	else 
	{
		Chat.Status = Status;
	}

	this.ChatList[this.ChatList.length] = Chat;

	return true;
}


/**
* Remove a chat with the user given from the structure
*
* @param 	User The user that the chat will be removed
* @return 	void
* @author 	Ulysses
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
		this.ChatList.splice(i, 1);
	}

	return true;
}	



/**
* Find a chat with the user's name
*
* @param 	User The user that you are chating with
* @return 	interger The position of the chat in structure
* @author 	Ulysses
*/
function DATA_FindChat(Username)
{
	var i;
	
	for (i=0 ; i < this.ChatList.length ; i++)
	{
		// A chat with the username given already exist on structure
		if (this.ChatList[i].Username == Username)
		{
			return i;
		}
	}
	
	// User not found
	return null;
	
}


/**********************************
 * METHODS - CHALLENGES           *
 **********************************/

/**
* Add a challenge in 'ChallengeList'
*/
function DATA_AddChallenge(Username, Id, Challenger)
{
	// Creating a new object
	var Challenge = new Object();
	var i;

	i = this.FindChallenge(Username);
	
	// Challenge already exist on structure
	if (i != null)
	{
		if (this.ChallengeList[i].Challenger == Challenger)
			return null;
	}

	// Setting atributes
	Challenge.Username = Username;
	Challenge.Id = Id;
	Challenge.Challenger = Challenger;

	this.ChallengeList[this.ChallengeList.length] = Challenge;

	return true;
}	


/**
* Remove a challenge in 'ChallengeList'
*/
function DATA_RemoveChallenge(Username)
{
	var i;

	// Try to find Username on ChallengeList
	i = this.FindChallenge(Username);

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


/**
* Remove a challenge by ID in 'ChallengeList'
*/
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


/**
* Remove all challenges in 'ChallengeList'
*/
function DATA_ClearChallenges()
{
	var size = this.ChallengeList.length;
	
	this.ChallengeList.splice(0, size);

	return "";
}

/**
* Find a challenge in 'ChallengeList'
*/
function DATA_FindChallenge(Username)
{
	var i;
	
	for (i=0 ; i < this.ChallengeList.length ; i++)
	{
		// A challenge with the username given already exist on structure
		if (this.ChallengeList[i].Username == Username)
		{
			return i;
		}
	}
	
	// User not found
	return null;
	
}


/**
* Find a challenge in 'ChallengeList'
*/
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


/**********************************
 * METHODS - GAME                 *
 **********************************/

/**
* Set current game 
*/
function DATA_SetCurrentGame(Game)
{
	if(Game != undefined)
	{
		this.CurrentGame = Game;
	}
	else
	{
		this.CurrentGame = null;
	}
}

/**
* Add a game in 'GameList'
*/
function DATA_AddGame(Id, Player1, Player2, Color, GameDiv)
{
	var NewGame = new Object();

	if(this.GameList.length == 0)
	{
		this.SetCurrentGame(NewGame);
	}

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

	NewGame.Game = GameDiv;
	NewGame.Finished = false;
	NewGame.IsYourTurn = false;
	NewGame.CurrentMove = null;
	NewGame.Moves = new Array();

	NewGame.SetTurn = this.SetTurn;
	NewGame.AddMove = this.AddGameMove;

	this.GameList.push(NewGame);

	return NewGame;

}


/**
* Remove a game in 'GameList' by game id
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
		RemovedGame = this.GameList[GamePosition];
		this.GameList.splice(GamePosition, 1);

		//Set next game on GameList to current game
		MainData.SetCurrentGame(this.GameList[GamePosition]);
		//If next game is null, set previous game to current game, else
		//there is no game on GameList
		if(MainData.CurrentGame == null)
		{
			MainData.SetCurrentGame(this.GameList[GamePosition-1]);
		}

		return RemovedGame;
	}
	
}

/**
* Find game in 'GameList' by game id
*/
function DATA_FindGame(Id)
{
	var i;
	var GameListLen = this.GameList.length;

	for(i=0; i<GameListLen; i++)
	{
		if(this.GameList[i].Id == Id)
		{
			return i;
		}
	}

	//If game Id is not found
	return null
}

/**
* Add a move in 'GameList[x].Moves' 
*/
function DATA_AddGameMove(BoardArray, Move, PWTime, PBTime, Turn)
{
	var NewMove = new Object();

	NewMove.Board = BoardArray;
	NewMove.Move = Move;
	NewMove.PWTime = PWTime;
	NewMove.PBTime = PBTime;
	NewMove.Turn = Turn;

	this.CurrentMove = this.Moves.length;
	this.Moves.push(NewMove);

}

/**
* Set true, if is the player's turn
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

function DATA_GetGame(Id)
{
	var i=0;
	while(i<this.GameList.length)
	{
		if(this.GameList[i].Id == Id)
		{
			return(this.GameList[i])
		}
		i++;
	}
	return null;
}

/**
* Return the oponent's name
*/
function DATA_GetOponent(GameID)
{
	var Game = this.GetGame(GameID);

	if (Game == null)
	{
		return null;
	}

	if (Game.YourColor == "white")
	{
		return Game.PB;
	}
	else
	{
		return Game.PW;
	}
}


/**********************************
 * METHODS - OLDGAME              *
 **********************************/


/**
* Set current oldgame 
*/
function DATA_SetCurrentOldGame(Game)
{
	if(Game != undefined)
	{
		this.CurrentOldGame = Game;
	}
	else
	{
		this.CurrentOldGame = null;
	}
}

/**
* Add a oldgame in 'OldGameList'
*/
function DATA_AddOldGame(GameId, PWName, PBName, Color)
{
	var NewOldGame = new Object();

	if(this.OldGameList.length == 0)
	{
		MainData.SetCurrentGame(NewOldGame);
	}

	NewOldGame.Id = GameId;
	NewOldGame.PW = PWName;
	NewOldGame.PB = PBName;
	NewOldGame.Color = "none";
	NewOldGame.BoardColor = Color
	NewOldGame.IsYourTurn = false;
	NewOldGame.Moves = new Array();

	NewOldGame.AddMove = this.AddGameMove;

	this.OldGameList.push(NewOldGame);

	return this.OldGameList.length -1;
}


/**
* Remove a game in 'OldGameList' by game id
*/
function DATA_RemoveOldGame(Id)
{
	var GamePosition = Id;
	var RemovedGame;

	if(this.OldGameList[GamePosition] == undefined)
	{
		return;
	}
	else //Remove
	{
		RemovedOldGame = this.OldGameList[GamePosition];
		this.OldGameList.splice(GamePosition, 1);

		//Set next game on GameList to current game
		MainData.SetCurrentOldGame(this.OldGameList[GamePosition]);
		//If next game is null, set previous game to current game, else
		//there is no game on GameList
		if(MainData.CurrentOldGame == null)
		{
			MainData.SetCurrentOldGame(this.OldGameList[GamePosition-1]);
		}

		return RemovedOldGame;
	}
	
}

function DATA_PushGameToOldGame(GameObj)
{
	var Pos;
	Pos = this.OldGameList.push(GameObj);
	MainData.SetCurrentOldGame(GameObj);

	return Pos -1;
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
function DATA_ChangeWindowFocus(WindowObj)
{
	if(this.Windows.Focus == WindowObj)
	{
		return null;
	}

	//Set new top window
	this.Windows.Focus = WindowObj;
}

/**
* Remove a Window Object from WindowList
*/
function DATA_RemoveWindow(WindowObj)
{
	var WindowIndex = this.FindWindow(WindowObj);
	var WindowListLen = this.Windows.WindowList.length;

	if (WindowListLen == WindowIndex)
	{
		return
	}

	//Remove Window from WindowList
	this.Windows.WindowList.splice(WindowIndex,1);

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
