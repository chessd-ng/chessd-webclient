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
* @file		contact/online.js
* @brief	Handle all messages and functions to user's online list
*/


/**
* @brief	Create online list object and show online list.
*
* @return	none
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
* @brief	Handle all presence to online list
*
* Handle general room  messages for check online user's
*
* @param        XML The xml come from server with tag presence
* @return	Empty string
* @author       Ulysses Bonfim
*/
function ONLINE_HandleOnlinePresence(XML)
{
	var From, User, Type, Show, Status;
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
		// Get status type
		Status = UTILS_GetNodeText(Show[0]);

		// Any different status from defined status list (see contact/status.js), status = away
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
		ONLINE_RemoveUser(User);	
	}
	else
	{
		// Add user in online list
		ONLINE_AddUser(User, Status);	
	}

	return "";
}

/**
* @brief 	Add a user with status in online list.
*
* @param 	User 	User's name
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
	
	// if user was not founded, add to online list	
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

/**
* @brief 	Remove some user from online list.
*
* @param 	Username	User's name
* @return	none
* @author	Rubens Suguimoto
*/
function ONLINE_RemoveUser(Username)
{
	var OnlineObj = MainData.GetOnlineObj();
	
	MainData.RemoveOnlineUser(Username);
	OnlineObj.userList.removeUser(Username);
}

/**
* @brief 	Sort online list by nick name
* 
* Sort in MainData before and for each user in MainData online user list, remove and insert it.
*
* @return	True
* @author	Rubens Suguimoto
*/
function ONLINE_SortUserByNick()
{
	var Room, RoomName;
	var i, j;
	var UserName, Status, Rating, Type;
	var OnlineObj = MainData.GetOnlineObj();
	var OnlineUserList = MainData.GetOnlineUserList();

	// TODO -> Make this sort in function
	// Sort user list by nick name in data struct
	MainData.SortOnlineUserByNick();

	// Test the current order mode 
	// If ordered into ascending order, change to descending order
	// other modes, change to ascending order
	MainData.SetOnlineOrderBy( (MainData.GetOnlineOrderBy() + 1) % 2 );

	// Show new user list sorted
	for(i=0; i<OnlineUserList.length; i++)
	{
		UserName = OnlineUserList[i].Username;
		Status = OnlineUserList[i].Status;
		Type = OnlineUserList[i].Type;

		// Get user's rating in online list
		Rating = OnlineUserList[i].Rating.GetRatingValue(MainData.GetOnlineCurrentRating());

		//Show in contact online list
		OnlineObj.userList.removeUser(UserName);
		OnlineObj.userList.addUser(UserName, Status, Rating, Type);
	}

	return true;
}

/**
 * @brief 	Sort online list by rating category
 * 
 * Sort in MainData before and for each user in MainData online user, remove and insert it.
 *
 * @param	Category	Rating game category
 * @return	True
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

	// TODO -> Make this sort in function
	MainData.SetOnlineCurrentRating(Category);

	// Test the current order mode (order == sort)
	// If ordered into ascending order, change to descending order
	MainData.SetOnlineOrderBy( (MainData.GetOnlineOrderBy() + 1) % 2 );
	
	// Sort user list by nick name in data struct
	MainData.SortOnlineUserByRating();

	// Show new user list sorted
	for(i=0; i<OnlineUserList.length; i++)
	{
		UserName = OnlineUserList[i].Username;
		Status = OnlineUserList[i].Status;
		Type = OnlineUserList[i].Type;

		// Get rating
		Rating = OnlineUserList[i].Rating.GetRatingValue(MainData.GetOnlineCurrentRating());

		//Show in contact online list
		OnlineObj.userList.removeUser(UserName);
		OnlineObj.userList.addUser(UserName, Status, Rating, Type);
	}

	return true;
}
