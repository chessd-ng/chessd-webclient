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
* Functions to add a user in your contact list
*/


/**
* Send a invite message to 'Username'
*/
function CONTACT_InviteUser(Username)
{
	var XML;

	// Create a invite message
	XML = MESSAGE_Invite(Username);

	// Insert user in structure
	if (MainData.AddUser(Username, "offline", ""))
	{
		// Send it to jabber
		CONNECTION_SendJabber(XML);
		return true;
	}
	else
	{
		return false;
	}
}

/**
* Remove user form your list
*/
function CONTACT_RemoveUser(Username)
{
	var XML;

	// Create a remove message
	XML = MESSAGE_RemoveContact(Username);

	// Remove user from data structure
	MainData.DelUser(Username);

	// Remove user from interface
	INTERFACE_RemoveContact(Username);

	// Send it to jabber
	CONNECTION_SendJabber(XML);

	return true;
}



/**
* User has received a subscribe message
*/
function CONTACT_ReceiveSubscribe(Username)
{
	var XML, i;

	// Search user in sctructure
	i = MainData.FindUser(Username);

	// If user is in your list
	if (i != null)
	{
		// Try to add a removed user
		if (MainData.UserList[i].Subs == "none")
		{
			MainData.SetSubs(Username, "from");
			XML = new Array();
			
			// Send a subscribe and a subscribed to user
			XML[0] = MESSAGE_InviteAccept(Username);
			XML[1] = MESSAGE_Invite(Username);

			return MESSAGE_MergeMessages(XML);
		}
		// Last confirmation
		else if (MainData.UserList[i].Subs != "from")
		{
			// Send a subscribed to user
			XML = MESSAGE_InviteAccept(Username);

			return XML;
		}
		else
			return "";
	}
	// User is been added
	else
	{
		// Ask user TODO TODO TODO
		if (confirm("Deseja adicionar "+Username+"???"))
		{
			if (MainData.AddUser(Username, "offline", "from"))
			{
				XML = new Array();

				// Send a subscribe and a subscribed to user
				XML[0] = MESSAGE_InviteAccept(Username);
				XML[1] = MESSAGE_Invite(Username);
	
				return MESSAGE_MergeMessages(XML);
			}
		}
		else
		{
			// Send a deny to user
			XML = MESSAGE_InviteDeny(Username);
			return XML;
		}
	}
	return "";
}

/**
* User has received a subscribed message
*/
function CONTACT_ReceiveSubscribed(Username)
{
	// Setting user subscription state to 'both'
	if (MainData.SetSubs(Username, "both"))
	{
		INTERFACE_AddContact(Username, "available");
		return true;
	}
	else
	{
		return false;
	}
}

/**
* User has received a unsubscribed message
*/
function CONTACT_ReceiveUnsubscribed(Username)
{
	var XML, i;

	i = MainData.FindUser(Username);

	// If user is not in your list, something wrong! =D
	if (i == null)
	{
		return false;
	}

	// User has removed you, do nothing
	if (MainData.UserList[i].Subs == "both")
	{
		// Changing subscription state to none
		MainData.SetSubs(Username, "none");

		// Set user as offline
		CONTACT_SetUserStatus(Username, "offline");
		return true;
	}

	// Deny user invite
	if (MainData.DelUser(Username))
	{
		// Create a remove message
		XML = MESSAGE_RemoveContact(Username);
		return XML;
	}
	return "";
}
