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
* Handle contacts and user status
*/


/**
* Handle user list received from jabber server
* during connection
*
* @return string
*/
function CONTACT_HandleUserList(XML)
{
	var Users, Jid, Subs, i, Pending = "";


	Users = XML.getElementsByTagName("item");

	for (i=0; i < Users.length; i++)
	{
		Jid = Users[i].getAttribute("jid").match(/[^@]+/)[0];
		Subs = Users[i].getAttribute ("subscription"); 
		

		// Check subscription state of users
		switch (Subs)
		{
			// Store xml pending messages
			case("to"):
				// If there's a pending invite send a accept
				Pending += MESSAGE_InviteAccept(Jid);
				CONTACT_InsertUser(Jid, "offline", "both");

			// Insert users and group in data structure
			case("both"):
				if (MainData.Username != Jid)
				{
					CONTACT_InsertUser(Jid, "offline", Subs);
				}
				break;

			// Do nothing =)
			case("from"):
				break;
		}
	}

	// two eggs
	// a cup of milk 
	// a spoon of sugar
	// a 'tea spoon' of yeast
	// two cups of flour
	return Pending;
}


/**
* Parse user presence (user status)
*/
function CONTACT_HandleUserPresence(XML)
{
	var Jid, Type, Show, NewStatus;
	var Buffer = "";

	// Get Jid
	Jid = XML.getAttribute('from').replace(/@.*/,"");

	Type = XML.getAttribute('type');

	// User is offline
	if (Type == "unavailable")
	{
		CONTACT_SetUserStatus(Jid, "offline");
		return "";
	}
	// Receive a invite message
	else if (Type == "subscribe")
	{
		Buffer += CONTACT_ReceiveSubscribe(Jid);
		return Buffer;
	}
	// User is allowed
	else if (Type == "subscribed")
	{
		Buffer += CONTACT_ReceiveSubscribed(Jid);
		return Buffer;
	}
	// User is not allowed
	else if (Type == "unsubscribed")
	{
		Buffer += CONTACT_ReceiveUnsubscribed(Jid);
		return Buffer;
	}

	// Searching for the user status
	Show = XML.getElementsByTagName('show');
	if (Show.length > 0)
	{
		// Get status name
		NewStatus = UTILS_GetNodeText(Show[0]);

		if ((NewStatus == "busy") || (NewStatus == "away") || (NewStatus == "unavailable") || (NewStatus == "playing"))
		{
			CONTACT_SetUserStatus(Jid, NewStatus);
		}
	}
	// If tag 'show' doesnt exists, status online
	else
	{
		CONTACT_SetUserStatus(Jid, "available");
	}
	
	return Buffer;
}

/**
* Parse user presence in rooms
*/
function CONTACT_HandleRoomPresence(XML)
{
	var From, RoomName, Jid, Type, Item, Role, Affiliation, Show, Status, MsgTo;
	var Buffer = "";

	// Get Attributes
	Item = XML.getElementsByTagName("item");
	Show = XML.getElementsByTagName("show");
	From = XML.getAttribute('from');
	Type = XML.getAttribute('type');
	RoomName = From.replace(/@.*/, "");
	Jid = From.replace(/.*\//, "");
	MsgTo = From.replace(/\/.*/, "");

	// Check if the type is error
	if (Type == "error")
		return "";

	try 
	{
		Role = Item[0].getAttribute("role");
	}
	catch (e)
	{
		Role = "participant";
	}

	try
	{
		Affiliation = Item[0].getAttribute("affiliation");
	}
	catch (e)
	{
		Affiliation = "none";
	}

	// Status of user
	if (Show.length > 0)
	{
		// Get status name
		Status = UTILS_GetNodeText(Show[0]);

		// Any different status, status = away
		if ((Status != "busy") && (Status != "away") && (Status != "unavailable") && (Status != "playing"))
		{
			Status = "away";
		}
	}
	// If tag 'show' doesnt exists, status online
	else
	{
		Status = "available";
	}

	// If 'RoomName' doesnt exists, insert it in strucutre
	// and show on the interface
	if (MainData.AddRoom(RoomName))
	{
		if (RoomName != UTILS_GetText("room_default"))
		{
			INTERFACE_AddRoom(RoomName);
		}
	}

	// If its your presence
	if (Jid == MainData.Username)
	{
		if (Type == "unavailable")
		{
			MainData.DelRoom(RoomName);
		}
		else
		{
			// Insert you in room user list
			Buffer += CONTACT_InsertUserInRoom(RoomName, Jid, Status, Role, Affiliation);

			// Set your role and affiliation
			MainData.SetRoom(RoomName, MsgTo, Role, Affiliation);
		}
	}
	// Presence of others users
	else
	{
		if (Type == "unavailable")
		{
			// 666 the number of the beast!
			MainData.DelUserInRoom(RoomName, Jid);
			INTERFACE_DelUserInRoom(RoomName, Jid);
		}
		else
		{
			Buffer += CONTACT_InsertUserInRoom(RoomName, Jid, Status, Role, Affiliation);
		}
	}
	return Buffer;
}


/**
* Insert user in data structure
*/
function CONTACT_InsertUser(User, Status, Subs)
{
	if (MainData.AddUser(User, Status, Subs))
	{
		INTERFACE_AddContact(User, Status);
		MainData.AddUser(User, Status, Subs);
		MainData.SortUser();
	}
}


/**
* Insert user in room list
*/
function CONTACT_InsertUserInRoom(RoomName, Jid, Status, Role, Affiliation)
{
	var UserPos = MainData.FindUser(Jid);
	var Type = "user", Rating = "";
	var Buffer = "";

	// Try to insert user in 'RoomName' structure
	try
	{
		if (UserPos)
		{
			Type = MainData.UserList[UserPos].Type;
			Rating = eval("MainData.UserList[UserPos].Rating."+UTILS_Capitalize(MainData.CurrentRating));
		}
		else if (Jid == MainData.Username)
		{
			Type = MainData.Type;
			Rating = eval("MainData.Rating."+UTILS_Capitalize(MainData.CurrentRating));
		}
		else
		{
			// Ask user info, if it's not your contact
			Buffer += MESSAGE_Info(Jid);
		}

		MainData.AddUserInRoom(RoomName, Jid, Status, Type, Role, Affiliation);
		INTERFACE_AddUserInRoom(RoomName, Jid, Status, Type, Rating);
	}
	catch (e)
	{
		// If user already exists in 'RoomName' user list
		if (e == "UserAlreadyInRoomException")
		{
			MainData.SetUserAttrInRoom(RoomName, Jid, Status, Role, Affiliation)
			INTERFACE_UpdateUserInRoom(RoomName, Jid, Status);
		}
	}
	return Buffer;
}

/**
* Create and set options for user menu
*/
function CONTACT_ShowUserMenu(Obj, Username)
{
	var Func, Options = new Array();
	var i = 0, Hide = 0;
	
	Func = function () {
		Hide += 1;
		
		if (Hide == 2)
		{
			UTILS_RemoveListener(document, "click", Func, false);

			// Remove menu from screen
			INTERFACE_HideUserMenu();
		}
	};

	/**
	* Setting options
	*/

	// If isn't your name
	if (MainData.Username != Username)
	{
		// Send message
		Options[i] = new Object();
		if (MainData.GetStatus(Username) != "offline")
		{
			Options[i].Name = UTILS_GetText("usermenu_send_message");
		}
		// Send a offline message (scrap)
		else 
		{
			Options[i].Name = UTILS_GetText("usermenu_send_offlinemessage");
		}
		Options[i].Func = function () {
			CHAT_OpenChat(Username);
		}
		i += 1;

		// Match user
		if ((MainData.GetStatus(Username) == "available") || (MainData.GetStatus(Username) == "away") || (MainData.GetStatus(Username) == "busy"))
		{
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_match");
			Options[i].Func = function () {
				WINDOW_Challenge(Username);
			};
			i += 1;
		}

		// Add or remove contact
		if (MainData.IsContact(Username))
		{
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_remove_contact");
			Options[i].Func = function () { 
				CONTACT_RemoveUser(Username);
			};
			i += 1;
		}
		else
		{
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_add_contact");
			Options[i].Func = function () { 
				CONTACT_InviteUser(Username);
			};
			i += 1;
		}
	}

	// View user's profile
	Options[i] = new Object();
	Options[i].Name = UTILS_GetText("usermenu_view_profile");
	Options[i].Func = function () {
		PROFILE_StartProfile(Username);
	};

	// Show menu in user's screen
	INTERFACE_ShowUserMenu(Obj, Options);
	
	UTILS_AddListener(document, "click", Func, false);
}
