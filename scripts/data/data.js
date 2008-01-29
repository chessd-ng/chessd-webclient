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
	this.Xmlns = UTILS_GetTag(Params, "xmlns");
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
	this.RatingLightning =  0;
	this.RatingBlitz =  0;
	this.RatingStandart = 0;
	
	
	this.GetText = UTILS_OpenXMLFile(LangFile);
	this.Const = DATA_SetConsts();
}

// Adding methods
DATA.prototype.AddUser = DATA_AddUser;
DATA.prototype.DelUser = DATA_DelUser;
DATA.prototype.FindUser = DATA_FindUser;
DATA.prototype.SetUserStatus = DATA_SetUserStatus;
DATA.prototype.SetRating = DATA_SetRating;

DATA.prototype.AddRoom = DATA_AddRoom;
DATA.prototype.DelRoom = DATA_DelRoom;
DATA.prototype.FindRoom = DATA_FindRoom;
DATA.prototype.AddUserInRoom = DATA_AddUserInRoom;
DATA.prototype.DelUserInRoom = DATA_DelUserInRoom;
DATA.prototype.FindUserInRoom = DATA_FindUserInRoom;

DATA.prototype.AddChallenge = DATA_AddChallenge;
DATA.prototype.RemoveChallenge = DATA_RemoveChallenge;
DATA.prototype.RemoveChallengeById = DATA_RemoveChallengeById;
DATA.prototype.FindChallenge = DATA_FindChallenge;
DATA.prototype.FindChallengeById = DATA_FindChallengeById;
DATA.prototype.ClearChallenges = DATA_ClearChallenges;

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
		return null;

	// Setting atributes
	// The user's rating will be seted after
	User.Username = Username;
	User.Status = Status;
	User.Subs = Subs;

	this.UserList[this.UserList.length] = User;
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
* Set user's status
*/
function DATA_SetUserStatus(Username, NewStatus)
{
	var UserPos = MainData.FindUser(Username);

	if (UserPos == null)
		return false;
		
	MainData.UserList[UserPos].Status = NewStatus;
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
* Add user in user list of a room
*/
function DATA_AddUserInRoom(RoomName, Username, Status, Role, Affiliation)
{
	var RoomPos = this.FindRoom(RoomName);
	var User = new Object();


	// If room doesnt exists in data structure
	if (RoomPos == null)
	{
		this.AddRoom(RoomName);
		RoomPos = this.FindRoom(RoomName);
	}

	if (this.FindUserInRoom(RoomName, Username) != null)
		return false;

	User.Username = Username;
	User.Status = Status;
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
