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
* Handle user messages
*/

/**
 * @brief	Handle user contact list
 *
 * Handle user list received from jabber with yours contacts.
*
* @return string
*
* @author Ulysses Bonfim
*/
function USER_HandleContactUserList(XML)
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


function USER_HandlePresence(XML)
{
	var From, Username, Type, Item, Show, Status;
	var User;

	// Get Attributes from XML
	Item = XML.getElementsByTagName("item");
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
			if ((Status != "busy") && (Status != "away") && (Status != "playing"))
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
		Status = "unavailable"
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


function USER_HandleRoomPresence(XML)
{
	var From, Username, Type, Item, Show, Status;
	var User;

	// Get Attributes from XML
	Item = XML.getElementsByTagName("item");
	Show = XML.getElementsByTagName("show");
	From = XML.getAttribute('from');
	Type = XML.getAttribute('type');
	Username = From.replace(/.*\//, "");

	// Status of user
	if (Show.length > 0)
	{
		// Get status name
		Status = UTILS_GetNodeText(Show[0]);

		// Any different status, status = away
		if ((Status != "busy") && (Status != "away") && (Status != "unavailable") && (Status != "playing"))
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

function USER_HandleInfo(XML)
{
	var RatingNodes, TypeNode, ProfileNode;
	var OnlineNode, UptimeNode;
	var Jid, Profile, Type, Rating;
	var OnlineTime, UpTime;
	var User;
	var From;
	//Rating variables
	var i;
        var RatingValue;
        var TotalWin,TotalDraw,TotalLosses, TotalGames;
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


	// Update contacts
	/*
	USER_HandleRating(RatingNodes);
	USER_HandleType(TypeNodes);
	*/
	return "";

}

/**
* Handle user rating, update the structure and interface
*/
/*
function USER_HandleRating(NodeList)
{
	var Username, Rating, Category, i;

	// Getting ratings
	for (i=0 ; i<NodeList.length ; i++)
	{
		Username = NodeList[i].getAttribute('jid').replace(/@.*/
//,"");
/*
		Category = NodeList[i].getAttribute('category');
		Rating = NodeList[i].getAttribute('rating');

		// Set rating on structure
		USER_SetUserRating(Username, Category, Rating);
	}
}
*/

/**
* Handle user types, update the structure and interface
*/
/*
function USER_HandleType(NodeList)
{
	var Jid, Type, i;

	// Getting user type
	for (i=0 ; i<NodeList.length ; i++)
	{
		Jid = NodeList[i].getAttribute('jid').replace(/@.*/
//,"");
/*
		Type = NodeList[i].getAttribute('type');

		// Set type on sctructure
		USER_SetUserType(Jid, Type);
	}
}
*/
function USER_AddUser(Username, Status)
{
	var User = MainData.GetUser(Username)

	if( User == null)
	{
		MainData.AddUser(Username, Status, "user");
	}
}

/**
* Change type of 'Username' in structure and interface
*/
/*
function USER_SetUserType(Username, NewType)
{
	var Rating;
	
	var User = MainData.GetUser(Username);

	// update on interface
	if(User == null)
	{
		USER_AddUser(Username, "offline");
		User = MainData.GetUser(Username);
	}
	// Update in data struct
	User.SetType(NewType);
}
*/
/**
* Change rating of 'Username' in structure and interface
*/
/*
function USER_SetUserRating(Username, Category, Rating)
{
	var User = MainData.GetUser(Username);

	// update on interface
	if(User == null)
	{
		USER_AddUser(Username, "offline");
		User = MainData.GetUser(Username);
	}

	// Update in data struct
	if(User.Rating.FindRating(Category) == null)
	{
		User.Rating.AddRating(Category, Rating);
	}
	else
	{
		User.Rating.SetRatingValue(Category, Rating);
	}

	return "";
}
*/
function USER_StartUpdateUserList()
{
	MainData.SetUpdateTimer(setInterval("USER_UpdateUserList()", 5000));
}

function USER_StopUpdateUserList()
{
	clearInterval(MainData.GetUpdateTimer());
	MainData.SetUpdateTimer(null);
}

function USER_StartUpdateUserProfile()
{
	//Wait for 30 minutes to get profile again
	MainData.SetUpdateProfileTimer(setInterval("PROFILE_ResetUpdateProfile()",1800000));
}

function USER_StopUpdateUserProfile()
{
	clearInterval(MainData.GetUpdateProfileTimer());
	MainData.SetUpdateProfileTimer(null);
}

function USER_UpdateUserList()
{
	var i,j;
	var Username;
	var User;
	var XML = "";
	var NameList = new Array();
	var UserList = MainData.GetUserList();

	/********** TODO --> Put a attribute in conf file*/
	var Max = 10;
	/**********/
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
		//XML += MESSAGE_Info(Username);
		XML += MESSAGE_InfoProfile(Username);
	}

	if(XML != "")
	{
		CONNECTION_SendJabber(XML);
	}
}
