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

	this.GetText = UTILS_OpenXMLFile(LangFile);
	this.Const = DATA_SetConsts();
}

// Adding methods
DATA.prototype.AddUser = DATA_AddUser;
DATA.prototype.DelUser = DATA_DelUser;
DATA.prototype.FindUser = DATA_FindUser;

/**
* Add user to user list
*/
function DATA_AddUser(Username, Status, Rating, Subs, Group)
{
	// Creating a new object
	var User = new Object();

	if (this.FindUser(Username) != null)
		return null;

	// Setting atributes
	User.Username = Username;
	User.Status = Status;
	User.Rating = Rating;
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
			return this.UserList[i];
	}
	return null;
}
