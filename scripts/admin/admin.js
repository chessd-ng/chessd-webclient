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
function ADMIN_HandleChange (XML)
{
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
