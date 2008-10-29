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
	var ContactObj = MainData.GetContactObj();

	// Create a invite message
	XML = MESSAGE_Invite(Username);

	// Insert user in structure and interface
	CONTACT_AddUser(Username, "offline", "none", "default");
/*
	// Insert user in structure
	MainData.AddContactUser(Username, "offline", "", "default");

	// Insert user in interface
	ContactObj.addUser("default",Username, "offline");
*/

	// Send it to jabber
	CONNECTION_SendJabber(XML);

	// Sort userlist
	MainData.SortContactUserByNick();

	return "";
}


function CONTACT_SendRemoveUser(Username)
{
	var XML;

	// Create a remove message
	XML = MESSAGE_RemoveContact(Username);
	
	// Send it to jabber
	CONNECTION_SendJabber(XML);
}


/**
* User has received a subscribe message
*/
function CONTACT_ReceiveSubscribe(Username)
{
	var XML = "";
	var User;
	var Title, Text, Button1, Button2;

	// Search user in sctructure
	User = MainData.GetContactUser(Username);

	// If user is in your list
	if (User != null)
	{
		// Try to add a removed user
		if (User.GetSubs() == "none")
		{
			User.SetSubs("from");
			
			// Send a subscribe and a subscribed to user
			XML += MESSAGE_InviteAccept(Username);
			XML += MESSAGE_Invite(Username);

			return XML;
		}
		// Last confirmation
		else if (User.GetSubs() != "from")
		{
			// Send a subscribed to user
			XML = MESSAGE_InviteAccept(Username);

			return XML;
		}
		else
			return "";
	}
	// show window to confirm user invitation
	else 
	{
		Title = UTILS_GetText("contact_invite");
		Text = UTILS_GetText("contact_invite_text").replace(/%s/, "<strong>"+UTILS_Capitalize(Username)+"</strong>");
		Button1 = new Object();
		Button1.Name = UTILS_GetText("window_accept");
		Button1.Func = function () {
			var XML = "";

			// See data/data.js
			//MainData.AddUser(Username, "offline", "from");

			// See contact/contact.js
			CONTACT_AddUser(Username, "offline","from","default");

			// Send a subscribe and a subscribed to user
			XML += MESSAGE_InviteAccept(Username);
			XML += MESSAGE_Invite(Username);

			CONNECTION_SendJabber(XML);
		}

		Button2 = new Object();
		Button2.Name = UTILS_GetText("window_cancel");
		Button2.Func = function () {
			// Send a deny to user
			CONNECTION_SendJabber(MESSAGE_InviteDeny(Username));
		}

		WINDOW_Confirm(Title, Text, Button1, Button2);
	}
	return "";
}

/**
* User has received a subscribed message
*/
function CONTACT_ReceiveSubscribed(Username)
{
	var User = MainData.GetContactUser(Username);

	// Setting user subscription state to 'both'
	User.SetSubs("both")
	//INTERFACE_AddContact(Username, "available");
	//MainData.Contact.addUser(Username, "available");

	// See contact/contact.js
	CONTACT_AddUser(Username, "online","from","default");

	// Ask user type and rating
	return MESSAGE_Info(Username);
}

/**
* User has received a unsubscribed message
*/
function CONTACT_ReceiveUnsubscribed(Username)
{
	var XML = "";
	var User;
	var ContactObj = MainData.GetContactObj();

	User = MainData.GetContactUser(Username);

	// If user is not in your list, something's wrong! =D
/*
	if (User == null)
	{
		return "";
	}
*/
	// User has removed you, do nothing
	if (User.GetSubs() == "both")
	{
		// Changing subscription state to none
		User.SetSubs("none");

		// Set user as offline
		CONTACT_SetUserStatus(Username, "offline");
	}
	// Deny user invite
	else if (MainData.FindContactUser(Username) != null)
	{
		MainData.RemoveContactUser(Username);

		// Create a remove message
		XML = MESSAGE_RemoveContact(Username);
	}

	return XML;
}
