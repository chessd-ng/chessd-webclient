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
DATA.prototype.SetRating = DATA_SetRating;

DATA.prototype.NewGroup = DATA_NewGroup;
DATA.prototype.FindGroup = DATA_FindGroup;


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

	for (i=0; i<this.UserList.length; i++)
	{
		if (this.UserList[i].Username == Username)
		{
			this.UserList.splice(i, 1)
			return this.UserList[i];
		}
	}
	return null;
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
* Set user's rating 
*/
function DATA_SetRating (Username, Category, Rating)
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

		case('standart'):
			Obj.RatingStandart = Rating;
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
