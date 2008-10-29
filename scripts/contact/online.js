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
* Handle Online list users
*/


//TODO --> MUDAR AS CHAMADAS DAS FUNCOES DE ORDENAR NOS OUTROS CONTROLADORES E ARQUIVOS DE INTERFACE
//TODO --> MUDAR AS FUNCOES PARA ACESSAREM O USERLIST (OBTENCAO DE RATING, STATUS, TYPE)

/**
 * @brief	Show online list Div
 *
 * Create online list object and show online list .
*
* @author Rubens Suguimoto
*/
function ONLINE_StartOnlineList()
{
	var OnlineObj = new ContactOnlineObj();

	//Hide user contact list and show online list
	OnlineObj.show();

	MainData.SetOnlineObj(OnlineObj);
}

/************************************
*** FUNCTIONS - ONLINE LIST
*************************************/
/**
 * @brief	Handle presence to online list
 *
* Handle all presence from online list (General room);
*
* @param        XML The xml come from server with tag presence
*
* @author       Ulysses Bonfim
*/
function ONLINE_HandleOnlinePresence(XML)
{
	var From, User, Type, Show, Status;
	var Buffer = "";
	var OnlineObj = MainData.GetOnlineObj();
	var RoomName;

	// Get Attributes from XML
	Show = XML.getElementsByTagName("show");
	From = XML.getAttribute('from');
	Type = XML.getAttribute('type');
	RoomName = From.replace(/@.*/, "");
	User = From.replace(/.*\//, "");


	// Check if the type is error
	if (Type == "error")
	{
		return "";
	}

	if(RoomName != MainData.GetRoomDefault())
	{
		return "";
	}


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



	if (Type == "unavailable")
	{	
		// Remove from online list in interface
		//OnlineObj.userList.removeUser(User);
		ONLINE_RemoveUser(User);	
	}
	else
	{
		// Add user in online list
		ONLINE_AddUser(User, Status);	
	}

	return Buffer;
}

/**
 * @brief 	Add user in the online list
 * 
 * Add a user with status in online list.
 *
 * @param 	User 	Username
 * @param	Status	User's status
 *
 * @author	Rubens Suguimoto
 */
function ONLINE_AddUser(User, Status)
{
	var Rating;
	var UserRating, UserType;
	var OnlineObj = MainData.GetOnlineObj();
	var UserObj = MainData.GetUser(User);
	var OnlineUser;

	// Find user in online user struct == find in General user list
/*
	var Room = MainData.GetRoom(MainData.GetRoomDefault());
	var UserPos;
	UserPos = Room.FindUser(User);
*/
	// If user object was not founded;
	// --> This case shouldn't happen 
	if(UserObj == null)
	{
		return null;
	}

	// Get user Type and Current rating
	UserType = UserObj.GetType();
	UserRating = UserObj.GetRatingList();

	if(UserRating != null)
	{
		Rating = UserRating.GetRatingValue(MainData.GetOnlineCurrentRating());
	}
	else
	{
		Rating = null;
	}
	
	// if user is not founded, add to online list	
	//if( OnlineObj.userList.findUser(User) == null)
	if( MainData.FindOnlineUser(User) == null)
	{
		// Add in data struct
		MainData.AddOnlineUser(User, Status, UserType);
		// Add in interface
		OnlineObj.userList.addUser(User, Status, Rating, UserType);
	}
	// else, update status
	else
	{
		// Update in data struct
		OnlineUser = MainData.GetOnlineUser(User);
		OnlineUser.SetStatus(Status);

		// Update in interface
		OnlineObj.userList.updateUser(User, Status, Rating, UserType);
	}


	// Hide loading box
	OnlineObj.hideLoading();
}


function ONLINE_RemoveUser(Username)
{
	var OnlineObj = MainData.GetOnlineObj();
	
	MainData.RemoveOnlineUser(Username);
	OnlineObj.userList.removeUser(Username);
}

/**
 * @brief 	Sort online list by nick name
 * 
 * Sort on line user list by nick name. Sort in MainData and for each user in MainData online user, remove and insert it.
 *
 * @author	Rubens Suguimoto
 */
function ONLINE_SortUserByNick()
{
	var Room, RoomName;
	var i, j;
	var UserName, Status, Rating, Type;
	var OnlineObj = MainData.GetOnlineObj();
	var OnlineUserList = MainData.GetOnlineUserList();

	// General room
	/*
	Room = MainData.GetRoom(MainData.GetRoomDefault());

	if(Room == null)
	{
		return false;
	}
	*/
	
	// Test the current order mode 
	// If ordered into ascending order, change to descending order
	// other modes, change to ascending order
	/*Room.OrderBy = (Room.OrderBy + 1) % 2;*/
	MainData.SetOnlineOrderBy( (MainData.GetOnlineOrderBy() + 1) % 2 );

	// Sort user list by nick name in data struct
	//Room.SortUserListNick();
	MainData.SortOnlineUserByNick();
	

	// Show new user list sorted
	for(i=0; i<OnlineUserList.length; i++)
	{
		UserName = OnlineUserList[i].Username;
		Status = OnlineUserList[i].Status;
		Type = OnlineUserList[i].Type;

		Rating = OnlineUserList[i].Rating.GetRatingValue(MainData.GetOnlineCurrentRating());

		// Get rating
	/*
		switch(Room.GetRoomCurrentRating())
		{
			case "blitz":
				Rating = Room.UserList[i].Rating.Blitz;
				break;
			case "lightning":
				Rating = Room.UserList[i].Rating.Lightning;
				break;
			case "standard":
				Rating = Room.UserList[i].Rating.Standard;
				break;
			case "untimed":
				Rating = Room.UserList[i].Rating.Untimed;
				break;
		}
	*/
		//Show in contact online list
		OnlineObj.userList.removeUser(UserName);
		OnlineObj.userList.addUser(UserName, Status, Rating, Type);
	}

	return true;
}

/**
 * @brief 	Sort online list by rating category
 * 
 * Sort on line user list by rating. Sort in MainData and for each user in MainData online user, remove and insert it.
 *
 * @param	Category	Chess game category
 *
 * @author	Rubens Suguimoto
 */
function ONLINE_SortUserByRating(Category)
{
	var Room, RoomName;
	var i, j;
	var UserName, Status, Rating, Type;
	var OnlineObj = MainData.GetOnlineObj();
	var OnlineUserList = MainData.GetOnlineUserList();
	var RoomTmp;

//	Room = MainData.GetRoom(MainData.GetRoomDefault());
//	Room.SetRoomCurrentRating(Category);

	MainData.SetOnlineCurrentRating(Category);
	/*
	if(Room == null)
	{
		return false;
	}
	*/
	// Test the current order mode (order == sort)
	// If ordered into ascending order, change to descending order
	//Room.OrderBy = (Room.OrderBy + 1) % 2;
	MainData.SetOnlineOrderBy( (MainData.GetOnlineOrderBy() + 1) % 2 );
	
	//RoomName = Room.Name;
	// Sort user list by nick name in data struct
	//Room.SortUserListRating();

	MainData.SortOnlineUserByRating();

	// Show new user list sorted
	for(i=0; i<OnlineUserList.length; i++)
	{
		UserName = OnlineUserList[i].Username;
		Status = OnlineUserList[i].Status;
		Type = OnlineUserList[i].Type;

		Rating = OnlineUserList[i].Rating.GetRatingValue(MainData.GetOnlineCurrentRating());
		// Get rating
/*
		switch(Room.GetRoomCurrentRating())
		{
			case "blitz":
				Rating = Room.UserList[i].Rating.Blitz;
				break;
			case "lightning":
				Rating = Room.UserList[i].Rating.Lightning;
				break;
			case "standard":
				Rating = Room.UserList[i].Rating.Standard;
				break;
			case "untimed":
				Rating = Room.UserList[i].Rating.Untimed;
				break;
		}
*/
		//Show in contact online list
		OnlineObj.userList.removeUser(UserName);
		OnlineObj.userList.addUser(UserName, Status, Rating, Type);
	}

	return true;
}
