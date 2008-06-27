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
*/


/**
* Parser the admin messages with type 'set'
* 
* @param 	XML 	Xml with the messages
* @return 	string
* @author 	Ulysses
*/
function ADMIN_HandleRoomAdmin(XML)
{

	
	return "";
}


function ADMIN_HandleAdmin(XML)
{
	var Id = XML.getAttribute("id");

	switch(Id)
	{
		case MainData.Const.IQ_ID_GetBanList:
			ADMIN_HandleBanList(XML);
			break;

		/*
		case MainData.Const.IQ_ID_BanUser:
			ADMIN_Notification(XML)
			break;
		*/

		case MainData.Const.IQ_ID_UnbanUser:
			ADMIN_Notification(XML)
			break;

		/*
		case MainData.Const.IQ_ID_KickUser:
			ADMIN_Notification(XML)
			break;
		*/
	}
}

function ADMIN_Notification(XML)
{
	var Node = XML.firstChild;
	switch(Node.tagName)
	{
		case "kick":
			WINDOW_Alert("Kick",UTILS_GetText("admin_kick_ok"));
			break;
		case "ban":
			WINDOW_Alert("Ban",UTILS_GetText("admin_ban_ok"));
			break;
		case "unban":
			WINDOW_Alert("Unban",UTILS_GetText("admin_unban_ok"));
			break;
	}

	return "";
}

function ADMIN_HandleUserNotification(XML)
{	
	var Node = XML.firstChild;
	var ReasonTag = XML.getElementsByTagName("reason")[0];
	var Reason = UTILS_GetNodeText(ReasonTag);

	switch(Node.tagName)
	{
		case "kick":
			alert(UTILS_GetText("admin_user_ban")+Reason);
			break;
		case "ban":
			alert(UTILS_GetText("admin_user_kick")+Reason);
			break;
	}	
	return "";
}

function ADMIN_HandleBanList(XML)
{	
	var Jids = XML.getElementsByTagName("jid");
	var i;
	var Username;

	for(i=0;i<Jids.length;i++)
	{
		Username = UTILS_GetNodeText(Jids[i]).split("@")[0];
		INTERFACE_AddBannedUser(Username);
	}
}

/************************
 * ADMIN - MESSAGES
 * **********************/
function ADMIN_KickUser(Username, Reason)
{
	CONNECTION_SendJabber(MESSAGE_KickUser(Username,Reason));
}

function ADMIN_BanUser(Username, Reason)
{
	CONNECTION_SendJabber(MESSAGE_BanUser(Username, Reason));
}

function ADMIN_UnbanUser(Username, Reason)
{
	CONNECTION_SendJabber(MESSAGE_UnbanUser(Username, Reason));
}

function ADMIN_GetBanList()
{
	CONNECTION_SendJabber(MESSAGE_GetBanList());
}
