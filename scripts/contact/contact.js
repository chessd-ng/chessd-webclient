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
*
*/
function CONTACT_HandleUserList(XML)
{
	var i, Item, User, Group, Ask, Subs, j=0;
	var NotOnListUsers = new Array();
	var NotOnListSubs = new Array();



	var Users, Jid, Ask, Subs, Group, i;
	
	Users = XML.getElementsByTagName("item");

	for (i=0; i < Users.length; i++)
	{
		Jid = Users[i].getAttribute("jid").match(/[^@]+/)[0];
		Ask = Users[i].getAttribute ("ask"); 
		Subs = Users[i].getAttribute ("subscription"); 
		
		// If contact belong to a group
		if (Users[i].getElementsByTagName("group").length > 0)
		{
			Group = UTILS_GetTag(Users[i], "group")
			//Group = Users[i].firstChild.textContent;
		}
		// buscar amigos no xml
		else
			Group = "amigos";
		
		alert(Group);

		/*
		// Lista de usuarios com convite pendente
		if (Subs != "both")
		{
			NotOnListUsers[j] = User;
			NotOnListSubs[j] = Subs;
			j++;
		}
		
		else 
		{
			// Chama a funcao que insere o usuario na lista de contatos
			if (MainData.Username != User)
			{
				CONTACT_InsertUser(User, "offline", "0", Group, Subs);
			}
		}*/
 	}
	/*
	DATA_Contact_OrderContactGroups();
	INTERFACE_CreateContactGroups();
	INTERFACE_InsertContactList();
	INTERFACE_CreateGroupOption();

	// Trata os usuarios com convite pendente
	for (j=0 ; j<NotOnListUsers.length ; j++)
	{
		CONTACT_HandlePendingInvite(NotOnListUsers[j], NotOnListSubs[j]);
	}*/
}
