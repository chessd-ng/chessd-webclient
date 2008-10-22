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
function ONLINE_HandleInfo(XML)
{
	var RatingNodes, TypeNodes;
	
	RatingNodes = XML.getElementsByTagName('rating');
	TypeNodes = XML.getElementsByTagName('type');

	// Update contacts 
	ONLINE_HandleRating(RatingNodes);
	ONLINE_HandleType(TypeNodes);

	return "";
}

/**
* Handle user rating, update the structure and interface
*/
function ONLINE_HandleRating(NodeList)
{
	var Username, Rating, Category, i;

	// Getting ratings
	for (i=0 ; i<NodeList.length ; i++)
	{
		Username = NodeList[i].getAttribute('jid').replace(/@.*/,"");
		Category = NodeList[i].getAttribute('category');
		Rating = NodeList[i].getAttribute('rating');

		// Set rating on structure
		ONLINE_SetUserRating(Username, Category, Rating);
	}
}

/**
* Handle user types, update the structure and interface
*/
function ONLINE_HandleType(NodeList)
{
	var Jid, Type, i;

	// Getting user type
	for (i=0 ; i<NodeList.length ; i++)
	{
		Jid = NodeList[i].getAttribute('jid').replace(/@.*/,"");
		Type = NodeList[i].getAttribute('type');

		// Set type on sctructure
		ONLINE_SetUserType(Jid, Type);
	}
}

/**
* Change type of 'Username' in structure and interface
*/
function ONLINE_SetUserType(Username, NewType)
{
	var Status, Rating;
	
	var User = MainData.GetUser(Username);
	var OnlineUser;
	var OnlineObj= MainData.GetOnlineObj();

	// update on interface
	if(User != null)
	{
		Rating = User.Rating.GetRatingValue(MainData.GetOnlineCurrentRating());

		OnlineUser = MainData.GetOnlineUser(Username);
		if(OnlineUser != null)
		{
			Status = OnlineUser.GetStatus();
			OnlineUser.SetType(NewType);

			// Update type in contact online and contact list
			OnlineObj.userList.updateUser(Username, Status, Rating, NewType);
		}
	}
	return true;
}

/**
* Change rating of 'Username' in structure and interface
*/
function ONLINE_SetUserRating(Username, Category, Rating)
{
	var Status, Type;
	//var User;
	
	//var Room = MainData.GetRoom(MainData.GetRoomDefault());
	var User = MainData.GetUser(Username);
	var OnlineUser;
	var OnlineObj = MainData.GetOnlineObj();

	// update on interface
	if(User != null)
	{
		Status = User.GetStatus();
		Type = User.GetType();

		OnlineUser = MainData.GetOnlineUser(Username);

		if(OnlineUser != null)
		{
			// Update in data struct
			if(OnlineUser.Rating.FindRating(Category) == null)
			{
				OnlineUser.Rating.AddRating(Category, Rating);
			}
			else
			{
				OnlineUser.Rating.SetRatingValue(Category, Rating);
			}

		}

		if (Category == MainData.GetOnlineCurrentRating())
		{
			// Update type in contact online and contact list
			OnlineObj.userList.updateUser(Username, Status, Rating, Type);
		}

	}
	return "";
}
