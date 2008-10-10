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

	// Update contacts 
	CONTACT_HandleRating(RatingNodes);
	CONTACT_HandleType(TypeNodes);

	return "";
}

/**
* Handle user rating, update the structure and interface
*/
function CONTACT_HandleRating(NodeList)
{
	var Username, Rating, Category, i;

	// Getting ratings
	for (i=0 ; i<NodeList.length ; i++)
	{
		Username = NodeList[i].getAttribute('jid').replace(/@.*/,"");
		Category = NodeList[i].getAttribute('category');
		Rating = NodeList[i].getAttribute('rating');

		// Set rating on structure
		CONTACT_SetUserRating(Username, Category, Rating);
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
		Jid = NodeList[i].getAttribute('jid').replace(/@.*/,"");
		Type = NodeList[i].getAttribute('type');

		// Set type on sctructure
			CONTACT_SetUserType(Jid, Type);
	}
}

/**
* Change type of 'Username' in structure and interface
*/
function CONTACT_SetUserType(Username, NewType)
{
	var i;
	var Room;
	var StatusRoom, StatusList, Rating;
	var UserRoom, UserList;
	

	// update on interface
	if(MainData.SetType(Username, NewType))
	{
		// RoomList[0] = general room where is all user online
		if(MainData.RoomList[0] == null)
		{
			return "";
		}		

		// Get user position in room's userlist
		UserRoom = MainData.FindUserInRoom(MainData.RoomList[0].Name,Username);
		if(UserRoom != null)
		{
			Room = MainData.RoomList[0]; 
			StatusRoom = Room.UserList[UserRoom].Status;

			// Update type in contact online 
			MainData.ContactOnline.userList.updateUser(Username, StatusRoom, null, NewType);
		}

		// Get user position in userlist
		UserList = MainData.FindUser(Username);
		if (UserList != null)
		{
			StatusList = MainData.UserList[UserList].Status;

			// Update type in contact list 
			MainData.Contact.updateUser(Username, StatusList, null, NewType);
		}
		// Offline user
		else
		{
			StatusList = "offline";

			MainData.Contact.updateUser(Username, StatusList, null, NewType);
		}
	}
	return true;
}

/**
* Change rating of 'Username' in structure and interface
*/
function CONTACT_SetUserRating(Username, Category, Rating)
{
	var i;
	var Room;
	var StatusRoom, StatusList, TypeRoom, TypeList;
	var UserRoom, UserList;
	

	// update on interface
	if(MainData.SetRating(Username, Category, Rating))
	{
		if (Category == MainData.CurrentRating)
		{
			// RoomList[0] = general room where is all user online
			if(MainData.RoomList[0] == null)
			{
				return "";
			}	

			// Get user position in room's userlist
			UserRoom = MainData.FindUserInRoom(MainData.RoomList[0].Name,Username);
			if(UserRoom != null)
			{
				// General Room
				Room = MainData.RoomList[0]; 
				StatusRoom = Room.UserList[UserRoom].Status;
				TypeRoom = Room.UserList[UserRoom].Type;

				// Update type in contact online and contact list
				MainData.ContactOnline.userList.updateUser(Username, StatusRoom, Rating, TypeRoom);
			}
		
			// Get user position in userlist
			UserList = MainData.FindUser(Username);
			if (UserList != null)
			{
				StatusList = MainData.UserList[UserList].Status;
				TypeList = MainData.UserList[UserList].Type;

				// Update type in contact list 
				MainData.Contact.updateUser(Username, StatusList, Rating, TypeList);
			}
			// Offline user
			else
			{
				StatusList = "offline";
				TypeList = "user";

				MainData.Contact.updateUser(Username, StatusList, Rating, TypeList);
			}
		}
	}
	return "";
}
