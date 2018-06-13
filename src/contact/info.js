import { ContactObj } from 'interface/contact.js';

import { MainData } from 'start.js';

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
* @file		contact/info.js
* @brief	Handle user information to contact list(rating an type)
*
*/

/**
* @brief	Receive a info message and update new information in contact list
*
* @param	XML	XMPP with chess server user's info
* @return	Empty string
* @author	Rubens Suguimoto
*/
export function CONTACT_HandleInfo(XML)
{

	var RatingNodes, TypeNode;
	var ProfileNode;
	var Jid, Type, Rating;
	var User;
	var From;

	var i;
        var RatingValue;
        var RecordValue, RecordTime;
	var TimeStamp;
	var Category;

	ProfileNode = XML.getElementsByTagName('profile')[0];

	RatingNodes = XML.getElementsByTagName('rating');
	TypeNode = XML.getElementsByTagName('type')[0];

	Jid = ProfileNode.getAttribute('jid');
	From = Jid.split('@')[0];
	User = MainData.GetContactUser(From);

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
		CONTACT_SetUserType(From, Type);

		// Set rating	
		for(i=0; i< RatingNodes.length; i++)
		{
                	Category = RatingNodes[i].getAttribute('category');

			RatingValue = RatingNodes[i].getAttribute('rating');

			CONTACT_SetUserRating(From, Category, RatingValue);
		}
	
	}

	return "";
}

/**
* @brief	Change user's type of some user in contact list
* 
* @param	Username	User's name
* @param	NewType		New user's type
* @return	none
* @author	Rubens Suguimoto
*/
function CONTACT_SetUserType(Username, NewType)
{
	var Room;
	var Status, Rating;
	
	var User = MainData.GetUser(Username);
	var ContactUser;
	var ContactObj = MainData.GetContactObj();

	if(User != null)
	{
		Status = User.Status;

		// Update in data struct
		ContactUser = MainData.GetContactUser(Username);

		if(ContactUser != null)
		{
			ContactUser.SetType(NewType);

			// Update type in contact list object
			ContactObj.updateUser(Username,Status, null, NewType);
		}
		// Offline user
		else
		{
			StatusList = "offline";

			MainData.Contact.updateUser(Username, StatusList, null, NewType);
			// Refresh user's type in contact list
			Status = "offline";
			ContactObj.updateUser(Username,Status, null, NewType);
		}
	}
}

/**
* @brief	Change user's rating of some user in contact list
* 
* @param	Username	User's name
* @param	Category	Rating game category
* @param	Rating		Rating value to be update
* @return	none
* @author	Rubens Suguimoto
*/
function CONTACT_SetUserRating(Username, Category, Rating)
{
	var Status, Type;
	
	var User = MainData.GetContactUser(Username);
	var ContactUser;
	var ContactObj = MainData.GetContactObj();

	if(User != null)
	{
		Type = User.Type;

		// Update in data struct
		ContactUser = MainData.GetContactUser(Username);

		if(ContactUser != null)
		{
			Status = User.Status;

			// Update in contact list object
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
			// Refresh user's rating in contact list
			ContactObj.updateUser(Username,Status, Rating, Type);
		}

	}
}
