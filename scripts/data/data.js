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
	this.CookieValidity = UTILS_GetTag(Params, "cookie-validity");
	this.RID = Math.round( 100000.5 + ( ( (900000.49999) - (100000.5) ) * Math.random() ) );
	this.SID = -1;

	/**
	* DATA STRUCTURE
	*/
	this.UserList = new Array();
	this.RoomList = new Array();
	this.CurrentRoom = "";
	this.ChallengeList = new Array();

	this.CurrentRoom = "";

	this.CurrentGame = null;
	this.GameList = new Array();

	this.CurrentOldGame = "";
	this.OldGameList = new Array();

	this.RatingLightning =  "0";
	this.RatingBlitz =  "0";
	this.RatingStandard = "0";
	
	
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
DATA.prototype.AddOldGameMove = DATA_AddOldGameMove;
DATA.prototype.SetCurrentOldGame = DATA_SetCurrentOldGame;
DATA.prototype.GetGame = DATA_GetGameById;

DATA.prototype.AddWindow = DATA_AddWindow;
DATA.prototype.RemoveWindow = DATA_RemoveWindow;
DATA.prototype.ChangeWindowFocus = DATA_ChangeWindowFocus;
DATA.prototype.FindWindow = DATA_FindWindow;

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

	// If it's your type
	if (Username == MainData.Username)
	{
		MainData.Type = NewType;
		return true;
	}

	if (UserPos == null)
	{
		return false;
	}
		
	this.UserList[UserPos].Type = NewType;
	return true;
}


/**
* Set user's rating 
*/
function DATA_SetRating(Username, Category, Rating)
{
	var UserPos, Obj;


	// Set correct object to append rating
	if (MainData.Username == Username)
		Obj = MainData;
	else
	{
		UserPos = MainData.FindUser(Username);
		Obj = MainData.UserList[UserPos];
	}
		
	switch (Category)
	{
		case('blitz'):
			Obj.RatingBlitz = Rating;
			break;

		case('standard'):
			Obj.RatingStandard = Rating;
			break;

		case('lightning'):
			Obj.RatingLightning = Rating;
			break;
	}
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
	User.Type = Type;
	User.Role = Role;
	User.Affiliation = Affiliation;

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
function DATA_SetUserAttrInRoom(RoomName, Username, Status, Type, Role, Affiliation)
{
	var j = this.FindRoom(RoomName)
	var i = this.FindUserInRoom(RoomName, Username)

	if (i == null || j == null)
		return false;

	this.RoomList[j].UserList[i].Status = Status;
	this.RoomList[j].UserList[i].Type = Type;
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
function DATA_AddGame(Id, PWName, PBName, Color, GameDiv)
{
	var NewGame = new Object();

	if(this.GameList.length == 0)
	{
		this.SetCurrentGame(NewGame);
	}

	NewGame.Id = Id;
	NewGame.PW = PWName;
	NewGame.PB = PBName;
	NewGame.Game = GameDiv;
	NewGame.YourColor = Color;
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
		alert("Erro: Jogo nao existente - remover");
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

function DATA_GetGameById(Id)
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
function DATA_AddOldGame(Id, P1Name, P2Name, Color)
{
	var NewOldGame = new Object();

	if(this.OldGameList.length == 0)
	{
		MainData.SetCurrentGame(NewOldGame);
	}

	NewOldGame.Id = this.OldGameList.length;
	NewOldGame.P1 = P1Name;
	NewOldGame.P2 = P2Name;
	NewOldGame.YouColor = Color;
	NewOldGame.IsYourTurn = false;
	NewOldGame.Moves = new Array();

	this.OldGameList.push(NewOldGame);
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


/**
* Add a move in 'OldGameList[x].Moves' 
*/
function DATA_AddOldGameMove(Id, Board, Move, P1Time, P2Time, Turn)
{
	var GamePosition = Id;
	var NewMove = new Object();

	if(this.OldGameList[GamePosition] == null)
	{
		return;
	}
	else
	{
		//Convert board string to board array of array
		NewMove.Board = UTILS_String2Board(Board);

		NewMove.Move = Move;
		NewMove.P1Time = P1Time;
		NewMove.P2Time = P2Time;
		NewMove.Turn = Turn;

		this.OldGameList[GamePosition].Moves.push(NewMove);
	}
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
	var i;

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
	var i;
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
