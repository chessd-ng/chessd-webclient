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
	var RatingNodes, TypeNode;
	var Jid, Type, Rating;
	var User;
	var From;
	//Rating variables
	var i;
        var RatingValue;
        var RecordValue, RecordTime;
	var TimeStamp;
	var ProfileNode;
	var Category;

	/*
	var OnlineNode, UptimeNode;
	var OnlineTime, UpTime;
        var TotalWin,TotalDraw,TotalLosses, TotalGames;
	OnlineNode = XML.getElementsByTagName('online_time')[0];
	UptimeNode = XML.getElementsByTagName('uptime')[0];
	*/

	ProfileNode = XML.getElementsByTagName('profile')[0];
	RatingNodes = XML.getElementsByTagName('rating');
	TypeNode = XML.getElementsByTagName('type')[0];

	Jid = ProfileNode.getAttribute('jid');
	From = Jid.split('@')[0];
	User = MainData.GetOnlineUser(From);

	if(User != null)
	{
		/*
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
		*/
		if(TypeNode != null)
		{
			Type = TypeNode.getAttribute('type');
		}
		else
		{
			Type = 'user';
		}
		/*
		// Set user uptime
		User.SetOnlineTime(UpTime);
		// Set user total uptime
		User.SetTotalTime(OnlineTime);
		*/

		// Set user type
		//User.SetType(Type);
		ONLINE_SetUserType(From, Type);

		// Set rating	
		for(i=0; i< RatingNodes.length; i++)
		{
                	Category = RatingNodes[i].getAttribute('category');

			RatingValue = RatingNodes[i].getAttribute('rating');
			/*
			RecordValue = RatingNodes[i].getAttribute('max_rating');
			TotalWin   = parseInt(RatingNodes[i].getAttribute('wins'));
			TotalDraw  = parseInt(RatingNodes[i].getAttribute('draws'));
			TotalLosses= parseInt(RatingNodes[i].getAttribute('losses'));
			TimeStamp = RatingNodes[i].getAttribute('max_timestamp');
			RecordTime= UTILS_ConvertTimeStamp(TimeStamp);
			*/
			ONLINE_SetUserRating(From, Category, RatingValue);

			/*
			if(User.Rating.FindRating(Category) == null)
			{
				User.Rating.AddRating(Category, RatingValue);
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

			*/
		}
	
	}

	// Update contacts 
	/*
	ONLINE_HandleRating(RatingNodes);
	ONLINE_HandleType(TypeNodes);
	*/

	return "";
}

/**
* Handle user rating, update the structure and interface
*/
/*
function ONLINE_HandleRating(NodeList)
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
		ONLINE_SetUserRating(Username, Category, Rating);
	}
}
*/
/**
* Handle user types, update the structure and interface
*/
/*
function ONLINE_HandleType(NodeList)
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
		ONLINE_SetUserType(Jid, Type);
	}
}
*/
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
