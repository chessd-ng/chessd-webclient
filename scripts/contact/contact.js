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
* Insert user in data structure
*/
function CONTACT_InsertUser(User, Status, Subs)
{
	MainData.AddUser(User, Status, Subs);
}


/**
* Receive the rating massege and set it in user list
*/
function CONTACT_HandleRating(Xml)
{
	var Nodes = Xml.getElementsByTagName('rating');
	var Jid, Rating, Category, i;
	
	for (i=0 ; i<Nodes.length ; i++)
	{
		// Try to get the user name, rating and category of rating
		try 
		{
			Jid = Nodes[i].getAttribute('jid').replace(/@.*/,"");
			Category = Nodes[i].getAttribute('category');
			Rating = Nodes[i].getAttribute('rating');
		}
		catch (e)
		{
			continue;
		}
		
		// Set user's rating on structure
		MainData.SetRating(Jid, Category, Rating);
		
	}
	
	return "";
}


/**
* Parse user presence (user status)
*/
function CONTACT_HandleUserPresence(XML)
{
	var Jid, Type, Show, NewStatus;

	// Get Jid
	Jid = XML.getAttribute('from').replace(/@.*/,"");

	// User is offline
	Type = XML.getAttribute('type');
	if (Type == "unavailable")
	{
		MainData.SetUserStatus(Jid, UTILS_GetText("status_offline"));
		return "";
	}

	// Searching for the user status
	Show = XML.getElementsByTagName('show');
	if (Show.length > 0)
	{
		// Get status name
		NewStatus = UTILS_GetNodeText(Show[0]);

		// Wich status
		switch (NewStatus)
		{
			// Default: away
			default:

			// Away
			case (UTILS_GetText("status_away")):
				MainData.SetUserStatus(Jid, UTILS_GetText("status_away"));
				break;

			// Busy
			case (UTILS_GetText("status_busy")):
				MainData.SetUserStatus(Jid, UTILS_GetText("status_busy"));
				break;

			// Playing
			case (UTILS_GetText("status_playing")):
				MainData.SetUserStatus(Jid, UTILS_GetText("status_playing"));
				break;
		}
	}
	// If tag 'show' doesnt exists, status online
	else
	{
		MainData.SetUserStatus(Jid, UTILS_GetText("status_available"));
	}
	
	return "";
}


/**
* Parse user presence in rooms
*/
function CONTACT_HandleRoomPresence(XML)
{
	var From, RoomName, Jid, Type, Item, Role, Affiliation, Show, Status;


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
		if ((Status != "busy") && (Status != "away") && (Status != "unavailable"))
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
		INTERFACE_AddRoom(RoomName);
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
			INTERFACE_DelUser(RoomName, Jid);
		}
		else
		{
			// Try to insert user in 'RoomName' structure
			try
			{
				MainData.AddUserInRoom(RoomName, Jid, Status, Role, Affiliation)
				INTERFACE_AddContact(Jid, Status, RoomName);
			}

			catch (e)
			{
				// If user already exists in 'RoomName' user list
				if (e == "UserAlreadyInRoomException")
				{
					MainData.SetUserAttrInRoom(RoomName, Jid, Status, Role, Affiliation)
					INTERFACE_UpdateStatus(Jid, Status, RoomName);					
				}
				// This should NOT EVER happen
				else if (e == "RoomNotCreatedException")
				{
					throw "UnexpectedEvilException"
				}
			}
		}
	}
	return "";
}
