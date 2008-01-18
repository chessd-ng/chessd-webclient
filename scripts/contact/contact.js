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
	var Users, Jid, Subs, Group, i, Pending = "";


	Users = XML.getElementsByTagName("item");

	for (i=0; i < Users.length; i++)
	{
		Jid = Users[i].getAttribute("jid").match(/[^@]+/)[0];
		Subs = Users[i].getAttribute ("subscription"); 
		
		// If contact belong to a group
		if (Users[i].getElementsByTagName("group").length > 0)
		{
			Group = UTILS_GetTag(Users[i], "group")
		}
		// buscar amigos no xml
		else
			Group = UTILS_GetText("group_default");

		// Check subscription state of users
		switch (Subs)
		{
			// Store xml pending messages
			case("to"):
				// If there's a pending invite send a accept
				Pending += MAKER_MakeInviteAccept(Jid);

			// Insert users and group in data structure
			case("both"):
				if (MainData.Username != Jid)
				{
					CONTACT_InsertUser(Jid, "offline", "0", Subs, Group);
					CONTACT_InsertGroup(Group);
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
function CONTACT_InsertUser(User, Status, Rating, Subs, Group)
{
	MainData.AddUser(User, Status, Rating, Subs, Group);
}

/**
* Create groups in data structure
*/
function CONTACT_InsertGroup(GroupName)
{
	MainData.NewGroup(GroupName);
}
