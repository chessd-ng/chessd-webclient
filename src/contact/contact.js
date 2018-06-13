import {
	UTILS_GetNodeText,
	UTILS_GetText,
	UTILS_AddListener,
	UTILS_RemoveListener,
} from 'utils/utils.js';
import {
	WINDOW_KickUser,
	WINDOW_Confirm,
	WINDOW_BanUser,
	WINDOW_Challenge,
} from 'window/window.js';
import { MESSAGE_InviteAccept } from 'xmpp_messages/message.js';
import { INTERFACE_ShowUserMenu, INTERFACE_HideUserMenu } from 'interface/user.js';
import {
	CONTACT_ReceiveSubscribed,
	CONTACT_SendRemoveUser,
	CONTACT_ReceiveSubscribe,
	CONTACT_InviteUser,
	CONTACT_ReceiveUnsubscribed,
} from 'contact/invite.js';
import { USER_AddUser } from 'contact/user.js';
import { CONTACT_SetUserStatus } from 'contact/status.js';
import { PROFILE_StartProfile } from 'profile/profile.js';
import { CHAT_OpenChat } from 'chat/chat.js';
import { ContactObj } from 'interface/contact.js';
import { MainData } from 'start.js';

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
* @file		contact/contact.js
* @brief	Handle all messages and functions to user's contact list
*/

/**
* @brief	Create contact list object and hide contact list.
*
* @return	none
* @author Rubens Suguimoto
*/
export function CONTACT_StartContactList()
{
	var ContactObjTmp = new ContactObj()

	//Hide user contact list and show online list
	ContactObjTmp.hide();

	MainData.SetContactObj(ContactObjTmp);
}

/************************************
*** FUNCTIONS - CONTACT LIST
*************************************/

/**
* @brief	Handle user list received from jabber with yours contacts.
*
* @param	XML 	XML response with user's contact list
* @return 	XMPP message
* @author Ulysses Bonfim
*/
export function CONTACT_HandleContactUserList(XML)
{
	var Users, Jid, Subs, i, Pending = "";
	var Group;
	var MyUsername = MainData.GetUsername();

	Users = XML.getElementsByTagName("item");

	for (i=0; i < Users.length; i++)
	{
		Jid = Users[i].getAttribute("jid").match(/[^@]+/)[0];
		Subs = Users[i].getAttribute ("subscription"); 
		
		if(Users[i].getElementsByTagName("group")[0] != null)
		{
			Group = UTILS_GetNodeText(Users[i].getElementsByTagName("group")[0]);
		}
		else
		{
			Group = "default";
		}

		// Check subscription state of users
		switch (Subs)
		{
			// Store xml pending messages
			case("to"):
				// If there's a pending invite send a accept
				Pending += MESSAGE_InviteAccept(Jid);
				CONTACT_AddUser(Jid, "offline", "both", Group);
				break;

			// Insert users and group in data structure
			case("both"):
				if (MyUsername != Jid)
				{
					CONTACT_AddUser(Jid, "offline", Subs, Group);	
				}
				break;

			// Store the contact on structure with subs "none"
			case("none"):
				// If there's a pending invite send a accept
				CONTACT_AddUser(Jid, "offline", Subs, Group);
				break;
			
			// Remove user from contact list
			case("remove"):
				CONTACT_RemoveUser(Jid);
				break;

			// Do nothing =)
			case("from"):
				break;
		}
	}

	return Pending;
}


/**
* @brief	Handle receive subscribe from other user
*
* @param	XML 	XML message with contact list information
* @return 	XMPP message
* @author Ulysses Bonfim
*/
export function CONTACT_HandleSetSubscribe(XML)
{
	var Users, Jid, Subs, i, Pending = "";
	var Group;

	Users = XML.getElementsByTagName("item");

	for (i=0; i < Users.length; i++)
	{
		Jid = Users[i].getAttribute("jid").match(/[^@]+/)[0];
		Subs = Users[i].getAttribute ("subscription"); 
		
		if(Users[i].getElementsByTagName("group")[0] != null)
		{
			Group = UTILS_GetNodeText(Users[i].getElementsByTagName("group")[0]);
		}
		else
		{
			Group = "default";
		}

		// Check subscription state of users
		switch (Subs)
		{
			// Remove user from contact list
			case("remove"):
				CONTACT_RemoveUser(Jid);
				break;
		}
	}

	return Pending;
}



/**
* @brief	Handle a invite from some user and check his/her status
*
* Handle for accept or decline invite from some user and check user's status
*
* @param	XML 	XML message with contact list information
* @return 	XMPP message
* @author Ulysses Bonfim
*/

export function CONTACT_HandleUserPresence(XML)
{
	var Jid, Type, Show, NewStatus;
	var Buffer = "";

	// Get Jid
	Jid = XML.getAttribute('from').replace(/@.*/,"");

	Type = XML.getAttribute('type');

	/* HANDLE INVITE TO CONTACT LIST */
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

	/* HANDLE USER STATUS */
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
* @brief	Add user in contact list
*
* Add user in MainData contact list, sort and show this user in interface.
*
* @param 	Username	User's name
* @param	Status		User's status
* @param	Subs		User's subscribe status
* @param	Group		User's group in contact list
* @return 	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function CONTACT_AddUser(Username, Status, Subs, Group)
{
	var ContactObj = MainData.GetContactObj();
	var User = MainData.GetUser(Username);
	var UserRatingObj;
	var UserRatingList;
	var ContactUser;
	var i;

	if(MainData.FindContactUser(Username) == null)
	{
		//Add in data struct
		MainData.AddContactUser(Username, Status, Subs, Group)
		MainData.SortContactUserByNick();

		//Show in interface
		if(ContactObj != null)
		{
			ContactObj.addUser(Group, Username, Status);
		}
	
		// Get rating from user list, if user exists;
		if(User != null)
		{
			ContactUser = MainData.GetContactUser(Username);
			UserRatingObj = User.GetRatingList();
			UserRatingList = UserRatingObj.RatingList;

			for( i=0; i< UserRatingList.length; i++)
			{
				if(ContactUser.Rating.FindRating(UserRatingList[i].Category) == null)
				{
					ContactUser.Rating.AddRating(UserRatingList[i].Category, UserRatingList[i].Value)
				}
				else
				{
					ContactUser.Rating.SetRatingValue(UserRatingList[i].Category, UserRatingList[i].Value);
				}
			}
	
		}
	}
}

/**
* @brief	Remove user from your list
*
* @param 	Username	User's name
* @author	Rubens Suguimoto
* @return 	True
*/
function CONTACT_RemoveUser(Username)
{
	var ContactObj = MainData.GetContactObj();

	// Remove user from data structure
	MainData.RemoveContactUser(Username);

	// Remove user from interface
	ContactObj.removeUser(Username);

	return true;
}

/**
* @brief	Show user menu options
*
* Show user menu to send private message, match, view profile, etc.
*
* @param 	Obj 		DOM element to get position to show user menu
* @param	Username	User's name
* @return 	none
*
* @author Pedro Rocha and Rubens Suguimoto
*/
export function CONTACT_ShowUserMenu(Obj, Username)
{
	var Func, Options = new Array();
	var i = 0, Hide = 0;
	var Rating;
	var Button1 = new Object(), Button2 = new Object();
	var User, UserStatus;
	var MyUser;
	var MyUsername = MainData.GetUsername();
	var MyUserStatus;

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
	if (MyUsername != Username)
	{
		User = MainData.GetUser(Username);
		MyUser = MainData.GetUser(MyUsername);
	
		// If users doesn't exists, create in user list data struct	
		if(User == null)
		{
			USER_AddUser(Username, "offline");
			User = MainData.GetUser(Username);
		}


		// Send message
		Options[i] = new Object();
		if (User.GetStatus() != "offline")
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
		Options[i] = new Object();
		Options[i].Name = UTILS_GetText("usermenu_match");

		// Request for match is possible only if the status
		// of opponent is (avaiable, away, busy) and the user
		// isn't playing a game
		UserStatus = User.GetStatus();
		MyUserStatus = MyUser.GetStatus();
		if ( ((UserStatus != "offline") && (UserStatus != "playing") && (UserStatus != "unavailable")) && (MyUserStatus != "playing"))
		{
			Options[i].Func = function () {
				Rating = User.GetRatingList(); // Get user rating object
				WINDOW_Challenge(Username, Rating);
			};
		}
		else
		{
			Options[i].Func = null;
		}
		i += 1;

		// Add or remove contact
		if(CONTACT_IsContact(Username) == true)
		{
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_remove_contact");
			Options[i].Func = function () { 
				Button1.Name = UTILS_GetText("window_yes");
				Button1.Func = function () {
					CONTACT_SendRemoveUser(Username);
				}
				Button2.Name = UTILS_GetText("window_cancel");
				Button2.Func = null;
				var Text = UTILS_GetText("contact_remove_text");
				if (Text != null)
				{
					Text = Text.replace(/%s/,"<strong>"+Username+"</strong>");
				}
				WINDOW_Confirm (UTILS_GetText("contact_remove_title"), Text, Button1, Button2);
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

		// Administrative functions
		if (MyUser.GetType() == "admin")
		{
			// Disconnet user
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_disconnect_user");
			Options[i].Func = function () {
				WINDOW_KickUser(Username);
			};
			i += 1;

			// Ban user
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_ban");
			Options[i].Func = function () {
				WINDOW_BanUser(Username);
			};
			i += 1;

			// Mute user
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_mute");
			Options[i].Func = function () {
			};
			i += 1;

			// Abusive
			Options[i] = new Object();
			Options[i].Name = UTILS_GetText("usermenu_abusive");
			Options[i].Func = function () {
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
	i += 1;


	// Show menu in user's screen
	INTERFACE_ShowUserMenu(Obj, Options);
	
	UTILS_AddListener(document, "click", Func, false);
}

/**
* @brief	Load contact list in interface
*
* @return 	none
* @author Rubens Suguimoto
*/
export function CONTACT_LoadUserContactList()
{
	var i;
	var User;
	
	var ContactObj = MainData.GetContactObj();
	var ContactUserList = MainData.GetContactUserList();

	// Loading user list
	for (i=0; i < ContactUserList.length; i++)
	{
		User = ContactUserList[i];

		// Find user group, if not exists create group
		if(ContactObj.findGroup(User.Group) == null)
		{
			ContactObj.addGroup(User.Group);
		}

		ContactObj.addUser(User.Group, User.Username, User.Status, User.Rating.Blitz, User.Type);

	}

	ContactObj.hideLoading();

}


/************************************
*** FUNCTIONS - SORT CONTACT LIST
*************************************/
/**
* @brief 	Sort user contact list by nick name
* 
* Sort user online list by nick name. Sort in MainData and for each user in MainData online user, remove and insert it.
*
* @return 	none
* @author	Rubens Suguimoto and Danilo Yorinori
*/
export function CONTACT_SortUsersByNick()
{
	var i;
	var User;
	var Rating;

	var ContactObj = MainData.GetContactObj();
	var ContactUserList = MainData.GetContactUserList();

	// Test the current order mode
	// If ordered into ascending order, change to descending order
	MainData.SetContactOrderBy((MainData.GetContactOrderBy() + 1) % 2);
	
	MainData.SortContactUserByNick();

	for(i=0; i<ContactUserList.length; i++)
	{
		User = ContactUserList[i];
	
		//Get rating	
		Rating = User.Rating.GetRatingValue(MainData.GetContactCurrentRating());

		ContactObj.removeUser(User.Username);
		ContactObj.addUser(User.Group, User.Username, User.Status, Rating, User.Type);
	}
}

/**
* @brief 	Sort user contact list by rating category
* 
* Sort user contact list by rating. Sort in MainData and for each user in MainData online user, remove and insert it.
*
* @param	Category	Game category
* @return	none
* @author	Rubens Suguimoto and Danilo Yorinori
*/
export function CONTACT_SortUsersByRating(Category)
{
	var i;
	var User;
	var Rating;

	var ContactObj = MainData.GetContactObj();
	var ContactUserList = MainData.GetContactUserList();

	MainData.SetContactCurrentRating(Category);

	MainData.SortContactUserByRating();

	for(i=0; i<ContactUserList.length; i++)
	{
		User = ContactUserList[i];
		
		Rating = User.Rating.GetRatingValue(MainData.GetContactCurrentRating());

		ContactObj.removeUser(User.Username);
		ContactObj.addUser(User.Group, User.Username, User.Status, Rating, User.Type);
	}
}

/**
* @brief 	Check if some user is in your contact list
* 
* @param	Username	User's name
* @return	True or False
* @author	Rubens Suguimoto and Danilo Yorinori
*/
function CONTACT_IsContact(Username)
{
	var User = MainData.GetContactUser(Username);

	if(User != null)
	{
		return true;
	}
	else
	{
		return false;
	}
}
