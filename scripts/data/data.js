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
	this.GroupList = new Array();
	this.RoomList = new Array();
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

DATA.prototype.NewGroup = DATA_NewGroup;
DATA.prototype.FindGroup = DATA_FindGroup;
DATA.prototype.SortGroup = DATA_SortGroup;

DATA.prototype.AddRoom = DATA_AddRoom;
DATA.prototype.DelRoom = DATA_DelRoom;
DATA.prototype.FindRoom = DATA_FindRoom;
DATA.prototype.AddUserInRoom = DATA_AddUserInRoom;
DATA.prototype.DelUserInRoom = DATA_DelUserInRoom;


/**********************************
 * METHODS - USER LIST
 ************************************/

/**
* Add user to user list
*/
function DATA_AddUser(Username, Status, Subs, Group)
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
	User.Group = Group;

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
 * METHODS - GROUP LIST           *
 **********************************/

/**
* Find group in group list
*/
function DATA_FindGroup(GroupName)
{
	var i;

	for (i=0; i<this.GroupList.length; i++)
	{
		if (this.GroupList[i].Name == GroupName)
			return this.GroupList[i];
	}
	return null;
}

/**
* Create new group in group list
*/
function DATA_NewGroup(GroupName)
{
	// Creating a new object
	var Group = new Object();

	if (this.FindGroup(GroupName) != null)
		return null;

	// Setting atributes
	Group.Name = GroupName;

	this.GroupList[this.GroupList.length] = Group;
}

<<<<<<< HEAD:scripts/data/data.js
=======

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

/*
* Find room in room list
**/
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
*/
function DATA_AddUserInRoom(RoomName, Username, Status, Role, Affiliation)
	var RoomPos = this.FindRoom(RoomName);
	var User = new Object();


	// If room doesnt exists in data structure
	if (RoomPos == null)
		return false;

	User.Username = Username;
	User.Status = Status;
	User.Role = Role;
	User.Affiliation = Affiliation;

	// Insert user in room's user list
	this.RoomList[RoomPos].UserList[this.RoomList[RoomPos].UserList.length] = User;
}

/**
* Del user from user list of a room
*/
function DATA_DelUserInRoom(RoomName, Username)
{
	var j, i = this.FindRoom(RoomName);


	// If room do not exist
	if (i == null)
		return false;

	// Search user in room user list
	for (j=0; j<this.RoomList[i].UserList.length; j++)
	{
		if (this.RoomList[i].UserList[j].Username == Username)
		{
			this.RoomList[i].UserList.splice(j, 1);
			return true;
		}
	}
	return false;	
}

/**
* Sort groups by name
*/
function DATA_SortGroup()
{
	this.sort(SortByGroupNameAsc);
}

/**
* Return -1 if A < B, 1 if A > B or 0 if A = B.
* Used to sort the group list by name.
*/
function SortByGroupNameAsc(A, B) 
{
	var X = A.Name.toLowerCase();
	var Y = B.Name.toLowerCase();
	return ((X < Y) ? -1 : ((X > Y) ? 1 : 0));
}
