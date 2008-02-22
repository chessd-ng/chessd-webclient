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
* Control user information (rating an type)
*/

/**
* Receive a info message and set it in user list
*/
function CONTACT_HandleInfo(XML)
{
	var RatingNodes, TypeNodes;
	
	RatingNodes = XML.getElementsByTagName('rating');
	TypeNodes = XML.getElementsByTagName('type');

	CONTACT_HandleRating(RatingNodes);
	CONTACT_HandleType(TypeNodes);

	return "";
}

/**
* Handle user rating, update the structure and interface
*/
function CONTACT_HandleRating(NodeList)
{
	var Jid, Rating, Category, i;

	// Getting ratings
	for (i=0 ; i<NodeList.length ; i++)
	{
		// Try to get the user name, rating and category of rating
		try 
		{
			Jid = NodeList[i].getAttribute('jid').replace(/@.*/,"");
			Category = NodeList[i].getAttribute('category');
			Rating = NodeList[i].getAttribute('rating');
		}
		catch (e)
		{
			continue;
		}
		
		// Set rating on structure
		CONTACT_SetUserRating(Jid, Category, Rating);
	}
}

/**
* Handle user types, update the structure and interface
*/
function CONTACT_HandleType(NodeList)
{
	var Jid, Type, i;

	// Getting user type
	for (i=0 ; i<NodeList.length ; i++)
	{
		// Try to get jid and type
		try 
		{
			Jid = NodeList[i].getAttribute('jid').replace(/@.*/,"");
			Type = NodeList[i].getAttribute('type');
		}
		catch (e)
		{
			continue;
		}

		// Set type on sctructure
		if (Type != "user")
		{
			CONTACT_SetUserType(Jid, Type);
		}
	}
}

/**
* Change type of 'Username' in structure and interface
*/
function CONTACT_SetUserType(Username, NewType)
{
	if (MainData.SetType(Username, NewType))
	{
		INTERFACE_SetUserType(Username, NewType)	
		return true;
	}
	return false;
}

/**
* Change type of 'Username' in structure and interface
*/
function CONTACT_SetUserRating(Username, Category, Rating)
{
	if (MainData.SetRating(Username, Category, Rating))
	{
		INTERFACE_SetUserRating(Username, Category, Rating)	
		return true;
	}
	return false;
}
