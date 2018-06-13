import {
	MESSAGE_InviteDeny,
	MESSAGE_Invite,
	MESSAGE_Info,
	MESSAGE_InviteAccept,
	MESSAGE_RemoveContact,
} from 'xmpp_messages/message.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import { UTILS_GetText, UTILS_Capitalize } from 'utils/utils.js';
import { CONTACT_AddUser } from 'contact/contact.js';
import { WINDOW_Confirm } from 'window/window.js';
import { CONTACT_SetUserStatus } from 'contact/status.js';

import { MainData } from 'main_data.js';

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
* @file		contact/invite.js
* @brief	Contais all functions to add a user in your contact list
*/


/**
* @brief	Send a invite message to 'Username'
* 
* @param	Username	User's name
* @return	none
* @author	Ulysses Bomfim and Rubens Suguimoto
*/
export function CONTACT_InviteUser(Username)
{
	var XML;

	// Create a invite message
	XML = MESSAGE_Invite(Username);

	// Insert user in structure and interface
	CONTACT_AddUser(Username, "offline", "none", "default");

	// Send it to jabber
	CONNECTION_SendJabber(XML);

	// Sort userlist
	MainData.SortContactUserByNick();
}

/**
* @brief	Send a message to remove 'Username'
* 
* @param	Username	User's name
* @return	none
* @author	Ulysses Bomfim and Rubens Suguimoto
*/
export function CONTACT_SendRemoveUser(Username)
{
	var XML;

	// Create a remove message
	XML = MESSAGE_RemoveContact(Username);
	
	// Send it to jabber
	CONNECTION_SendJabber(XML);
}


/**
* @brief	Handle subscribe message
*
* @param	Username	User's name
* @return	Empty string
* @author	Ulysses Bomfim and Rubens Suguimoto
*/
export function CONTACT_ReceiveSubscribe(Username)
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
		}
		// Last confirmation
		else if (User.GetSubs() != "from")
		{
			// Send a subscribed to user
			XML += MESSAGE_InviteAccept(Username);
		}
	}
	// show window to confirm user invitation
	else 
	{
		Title = UTILS_GetText("contact_invite");
		Text = UTILS_GetText("contact_invite_text");
		if (Text != null)
		{
			Text = Text.replace(/%s/, "<strong>"+UTILS_Capitalize(Username)+"</strong>");
		}
		Button1 = new Object();
		Button1.Name = UTILS_GetText("window_accept");
		Button1.Func = function () {
			var TmpXML = "";

			// See contact/contact.js
			CONTACT_AddUser(Username, "offline","from","default");

			// Send a subscribe and a subscribed to user
			// (accept invite and send a invite to add other user)
			TmpXML += MESSAGE_InviteAccept(Username);
			TmpXML += MESSAGE_Invite(Username);

			CONNECTION_SendJabber(TmpXML);
		};

		Button2 = new Object();
		Button2.Name = UTILS_GetText("window_cancel");
		Button2.Func = function () {
			// Send a deny to user
			CONNECTION_SendJabber(MESSAGE_InviteDeny(Username));
		};

		WINDOW_Confirm(Title, Text, Button1, Button2);
	}
	return XML;
}

/**
* @brief	Handle subscribed message
*
* @param	Username	User's name
* @return	XMPP message
* @author	Ulysses Bomfim and Rubens Suguimoto
*/
export function CONTACT_ReceiveSubscribed(Username)
{
	var User = MainData.GetContactUser(Username);

	// Setting user subscription state to 'both'
	User.SetSubs("both");

	// See contact/contact.js
	CONTACT_AddUser(Username, "online","from","default");

	// Ask user type and rating
	return MESSAGE_Info(Username);
}

/**
* @brief	Handle unsubscribed message
*
* @param	Username	User's name
* @return	XMPP message
* @author	Ulysses Bomfim and Rubens Suguimoto
*/
export function CONTACT_ReceiveUnsubscribed(Username)
{
	var XML = "";
	var User;

	User = MainData.GetContactUser(Username);

	// User has removed you, do nothing
	if (User.GetSubs() == "both")
	{
		// Changing subscription state to none
		User.SetSubs("none");

		// Set user as offline in contact list
		CONTACT_SetUserStatus(Username, "offline");
	}
	// Decline user's invite
	else if (MainData.FindContactUser(Username) != null)
	{
		MainData.RemoveContactUser(Username);

		// Create a remove message
		XML = MESSAGE_RemoveContact(Username);
	}

	return XML;
}
