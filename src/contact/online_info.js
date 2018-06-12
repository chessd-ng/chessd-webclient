

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
* @file		contact/online_info.js
* @brief	Handle user information to online user's list(rating an type)
*/

/**
* @brief	Receive a info message and update new information in online list
*
* @param	XML	XMPP with chess server user's info
* @return	Empty string
* @author	Rubens Suguimoto
*/
export function ONLINE_HandleInfo(XML)
{
	var RatingNodes, TypeNode;
	var Jid, Type, Rating;
	var User;
	var From;

	var i;
        var RatingValue;
	var ProfileNode;
	var Category;

	ProfileNode = XML.getElementsByTagName('profile')[0];
	RatingNodes = XML.getElementsByTagName('rating');
	TypeNode = XML.getElementsByTagName('type')[0];

	Jid = ProfileNode.getAttribute('jid');
	From = Jid.split('@')[0];
	User = MainData.GetOnlineUser(From);

	if(User != null)
	{
		if(TypeNode != null)
		{
			Type = TypeNode.getAttribute('type');
		}
		else
		{
			Type = 'user';
		}

		// Set user type
		ONLINE_SetUserType(From, Type);

		// Set rating	
		for(i=0; i< RatingNodes.length; i++)
		{
                	Category = RatingNodes[i].getAttribute('category');

			RatingValue = RatingNodes[i].getAttribute('rating');

			ONLINE_SetUserRating(From, Category, RatingValue);
		}
	
	}

	return "";
}

/**
* @brief	Change user's type of 'Username' in online user list object
*
* @param	Username	User's name
* @param	NewType		User's type
* @return	none
* @author	Rubens Suguimoto
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

			// Update type in contact online object
			OnlineObj.userList.updateUser(Username, Status, Rating, NewType);
		}
	}

}

/**
* @brief	Change user's rating of 'Username' in online user list object
*
* @param	Username	User's name
* @param	Category	Rating game category
* @param	Rating		Rating value to be update
* @return	none
* @author	Rubens Suguimoto
*/
function ONLINE_SetUserRating(Username, Category, Rating)
{
	var Status, Type;
	//var User;
	
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
			// Update type in contact online object 
			OnlineObj.userList.updateUser(Username, Status, Rating, Type);
		}

	}
}
