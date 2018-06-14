import { CONNECTION_SendJabber } from 'connection/connection.js';
import { PROFILE_ResetUpdateProfile } from 'profile/profile.js';
import { UTILS_GetNodeText, UTILS_ConvertTimeStamp } from 'utils/utils.js';
import { MESSAGE_InfoProfile } from 'xmpp_messages/message.js';
import { MainData } from 'main_data.js';

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
* @file		contact/user.js
* @brief	Handle user messages
*/

/**
* @brief	Handle user list received from jabber with yours contacts to list of users
*
* All functions listed in this file, access a list of users in main data. This struct store all online user's information. 
*
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function USER_HandleContactUserList(XML)
{
	var Users, Username, i;

	Users = XML.getElementsByTagName("item");

	for (i=0; i < Users.length; i++)
	{
		Username = Users[i].getAttribute("jid").match(/[^@]+/)[0];

		USER_AddUser(Username, "offline");
	}
	
	return "";
}

/**
* @brief	Handle user's presence to list of users
*
* @param	XML	XMPP with presence
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function USER_HandlePresence(XML)
{
	var From, Username, Type, Show, Status;
	var User;

	// Get Attributes from XML
	Show = XML.getElementsByTagName("show");
	From = XML.getAttribute('from');
	Type = XML.getAttribute('type');
	Username = From.replace(/@.*/, "");

	if(Type != "unavailable")
	{
		// Status of user
		if (Show.length > 0)
		{
			// Get status name
			Status = UTILS_GetNodeText(Show[0]);

			// Any different status, status = away
			if ((Status != "busy") && (Status != "away") && (Status != "dnd"))
			{
				Status = "away";
			}
		}
		// If tag 'show' doesnt exists, status online
		else
		{
			Status = "available";
		}
	}
	else
	{
		Status = "unavailable";
	}
	
	User.GetUser(Username);
	
	if(User != null)
	{
		User.SetStatus(Status);
	}
	else
	{
		USER_AddUser(Username, Status);
	}

	return "";
}

/**
* @brief	Handle user's room presence to list of users
*
* @param	XML	XMPP with room presence
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function USER_HandleRoomPresence(XML)
{
	var From, Username, Show, Status;
	var User;

	// Get Attributes from XML
	Show = XML.getElementsByTagName("show");
	From = XML.getAttribute('from');
	Username = From.replace(/.*\//, "");

	// Status of user
	if (Show.length > 0)
	{
		// Get status name
		Status = UTILS_GetNodeText(Show[0]);

		// Any different status, status = away
		if ((Status != "busy") && (Status != "away") && (Status != "unavailable") && (Status != "dnd"))
		{
			Status = "away";
		}
	}
	// If tag 'show' doesnt exists, status online
	else
	{
		Status = "available";
	}

	// Set new status or add user in data struct	
	User = MainData.GetUser(Username);

	if(User != null)
	{
		User.SetStatus(Status);
	}
	else
	{
		USER_AddUser(Username, Status, "user");
	}

	return "";
}

/**
* @brief	Handle user's chess informations
*
* @param	XML	XMPP with user's chess informations
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function USER_HandleInfo(XML)
{
	var RatingNodes, TypeNode, ProfileNode;
	var OnlineNode, UptimeNode;
	var Jid, Type;
	var OnlineTime, UpTime;
	var User;
	var From;
	//Rating variables
	var i;
        var RatingValue;
        var TotalWin,TotalDraw,TotalLosses;
        var RecordValue, RecordTime;
	var TimeStamp;
	var Category;

	OnlineNode = XML.getElementsByTagName('online_time')[0];
	UptimeNode = XML.getElementsByTagName('uptime')[0];
	ProfileNode = XML.getElementsByTagName('profile')[0];
	RatingNodes = XML.getElementsByTagName('rating');
	TypeNode = XML.getElementsByTagName('type')[0];

	Jid = ProfileNode.getAttribute('jid');
	From = Jid.split('@')[0];
	User = MainData.GetUser(From);

	if(User != null)
	{
		if(UptimeNode != null)
		{
			UpTime = UptimeNode.getAttribute("seconds");
		}
		else
		{
			UpTime = null;
		}

		if(OnlineNode != null)
		{
			OnlineTime = OnlineNode.getAttribute("seconds");
		}
		else
		{
			OnlineTime = null;
		}

		if(TypeNode != null)
		{
			Type = TypeNode.getAttribute('type');
		}
		else
		{
			Type = 'user';
		}
		// Set user uptime
		User.SetOnlineTime(UpTime);
		// Set user total uptime
		User.SetTotalTime(OnlineTime);
		// Set user type
		User.SetType(Type);

		// Set rating	
		for(i=0; i< RatingNodes.length; i++)
		{
      Category = RatingNodes[i].getAttribute('category');

			RatingValue = RatingNodes[i].getAttribute('rating');
			RecordValue = RatingNodes[i].getAttribute('max_rating');
			TotalWin   = parseInt(RatingNodes[i].getAttribute('wins'));
			TotalDraw  = parseInt(RatingNodes[i].getAttribute('draws'));
			TotalLosses= parseInt(RatingNodes[i].getAttribute('losses'));
			TimeStamp = RatingNodes[i].getAttribute('max_timestamp');
			RecordTime= UTILS_ConvertTimeStamp(TimeStamp);

			if(User.Rating.FindRating(Category) == null)
			{
				User.Rating.AddRating(Category, RatingValue, RecordValue, RecordTime, TotalWin, TotalDraw, TotalLosses);
			}
			else
			{
				User.Rating.SetRatingValue( Category, RatingValue);
				User.Rating.SetRecordValue( Category, RecordValue);
				User.Rating.SetRecordTime(  Category, RecordTime);
				User.Rating.SetRatingWin(   Category, TotalWin);
				User.Rating.SetRatingDraw(  Category, TotalDraw);
				User.Rating.SetRatingLosses(Category, TotalLosses);
			}
		}

		// Don't get rating information until this variable turn true 
		User.SetUpdateRating(false);
	}

	return "";

}

/**
* @brief	Add some user in user list
*
* @param	Username	User's name
* @param	Status		User's status
* @return 	none
* @author 	Rubens Suguimoto
*/
export function USER_AddUser(Username, Status)
{
	var User = MainData.GetUser(Username);

	if( User == null)
	{
		MainData.AddUser(Username, Status, "user");
	}
}

/**
* @brief	Start counter to update list of user's chess informations
*
* @return 	none
* @author 	Rubens Suguimoto
*/
export function USER_StartUpdateUserList()
{
	var Time = MainData.GetUpdateRatingInterval();
	MainData.SetUpdateTimer(setInterval(USER_UpdateUserList, Time*1000));
}

/**
* @brief	Stop counter to update list of user's chess informations
*
* @return 	none
* @author 	Rubens Suguimoto
*/
export function USER_StopUpdateUserList()
{
	clearInterval(MainData.GetUpdateTimer());
	MainData.SetUpdateTimer(null);
}

/**
* @brief	Start counter to update list of user's jabber informations
*
* @return 	none
* @author 	Rubens Suguimoto
*/
export function USER_StartUpdateUserProfile()
{
	//Wait for 30 minutes to get profile again
	MainData.SetUpdateProfileTimer(setInterval(PROFILE_ResetUpdateProfile,90000));
}

/**
* @brief	Stop counter to update list of user's jabber informations
*
* @return 	none
* @author 	Rubens Suguimoto
*/
export function USER_StopUpdateUserProfile()
{
	clearInterval(MainData.GetUpdateProfileTimer());
	MainData.SetUpdateProfileTimer(null);
}

/**
* @brief	Send message to update list of users
*
* @return 	none
* @author 	Rubens Suguimoto
*/
function USER_UpdateUserList()
{
	var i,j;
	var Username;
	var User;
	var XML = "";
	var NameList = new Array();
	var UserList = MainData.GetUserList();

	var Max = MainData.GetUpdateGetMaxProfiles();

	i = 0;
	while((NameList.length < Max) && (i < UserList.length))
	{	
		User = UserList[i];
		if(User.GetUpdateRating() == true)
		{
			NameList.push(User.GetUsername());
			User.SetUpdateRating(false);
		}
		i++;
	}
	
	for(j=0; j<NameList.length; j++)
	{
		Username = NameList[j];
		XML += MESSAGE_InfoProfile(Username);
	}

	if(XML != "")
	{
		CONNECTION_SendJabber(XML);
	}
}
