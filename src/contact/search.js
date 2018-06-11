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
* @file		contact/search.js
* @brief	Handle search user
*/


/**
* @brief	Handle search user
*
* @param 	XML	XML received from jabber server
* @return	Empty string
* @author	Danilo Yorinori
*/
function CONTACT_HandleSearchUser(XML)
{
	var Itens;
	var Result, Fields, Item;
	var i,j;

	Itens = XML.getElementsByTagName("item");
	Result = new Array();

	if (Itens.length == 0)
	{
		Result = null;
	}
	else
	{
		// Search jid field in itens and get the value and insert it in array
		for (i=0; i < Itens.length; i++)
		{
			Fields = Itens[i].getElementsByTagName("field");
			Item = new Object();
			for (j=0; j < Fields.length; j++)
			{
				if (Fields[j].getAttribute("var") == "jid")
				{
					Item.Username = UTILS_GetNodeText(Fields[j].childNodes[0]).replace(/@.*/,"");
				}
				else if (Fields[j].getAttribute("var") == "fn")
				{
					Item.Fullname = UTILS_GetNodeText(Fields[j].childNodes[0]);
				}
			}
			if (Item != null)
			{
				Result.push(Item);
			}
		}
	}

	// Display the result
	MainData.SearchUserInfo.Elements.SetResult(Result);

	return "";
}
