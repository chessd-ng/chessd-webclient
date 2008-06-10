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


function ADMIN_HandleAdminNotification(XML)
{
	var Node = XML.firstChild;
	switch(Node.tagName)
	{
		case "kick":
			WINDOW_Alert("Kick","Você kikou com sucesso.");
			break;
		case "ban":
			WINDOW_Alert("Ban","Você baniu com sucesso.");
			break;
		case "unban":
			WINDOW_Alert("Unban","Você desbaniu com sucesso.");
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
			alert("Você foi kikado.\nMotivo: "+Reason);
			break;
		case "ban":
			alert("Você foi banido.\nMotivo: "+Reason);
			break;
	}	
	return "";
}

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
