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
	var Room;
	var Status, Rating;
	
	//var Room = MainData.GetRoom(MainData.GetRoomDefault());
	var User = MainData.GetUser(Username);
	var ContactUser;
	var ContactObj = MainData.GetContactObj();

	// update on interface
	if(User != null)
	{
		Status = User.Status;

		ContactUser = MainData.GetContactUser(Username);

		if(ContactUser != null)
		{
			ContactUser.SetType(NewType);

			// Update type in contact online and contact list
			//MainData.ContactOnline.userList.updateUser(Username,Status, null, NewType);
			ContactObj.updateUser(Username,Status, null, NewType);
		}
		// Offline user
		else
		{
			Status = "offline";
			ContactObj.updateUser(Username,Status, null, NewType);
		}
	}
	return true;
}

/**
* Change rating of 'Username' in structure and interface
*/
function CONTACT_SetUserRating(Username, Category, Rating)
{
	var Status, Type;
	//var User;
	
	//var Room = MainData.GetRoom(MainData.GetRoomDefault());
	var User = MainData.GetUser(Username);
	var ContactUser;
	var ContactObj = MainData.GetContactObj();

	// update on interface
	//if(MainData.SetRating(Username, Category, Rating))
	if(User != null)
	{
		Type = User.Type;

		ContactUser = MainData.GetContactUser(Username);

		if(ContactUser != null)
		{
			Status = User.Status;

			// Update in data struct
			if(ContactUser.Rating.FindRating(Category) == null)
			{
				ContactUser.Rating.AddRating(Category, Rating);
			}
			else
			{
				ContactUser.Rating.SetRatingValue(Category, Rating);
			}
		}
		else
		{
			// Offline user
			Status = "offline";
		}

		if (Category == MainData.GetContactCurrentRating())
		{
			// Update type in contact online and contact list
			ContactObj.updateUser(Username,Status, Rating, Type);
		}

	}
	return "";
}
