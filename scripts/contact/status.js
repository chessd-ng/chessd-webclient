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
* Handle users status
*/

// TODO --> SEPARAR OS CHANGE STATUS PARA ONLINE, ROOM E CONTACT
/**
* Change User Status 
*/
function CONTACT_ChangeStatus(NewStatus, DontSend)
{
	var i, XML, Status, StatusItem;
	var Select;
		
	var RoomList = MainData.GetRoomList();
	var Room;

	var MyUsername = MainData.GetUsername();
	var MyUser = MainData.GetUser(MyUsername);
	var MyUserStatus = MyUser.GetStatus();

	// Change user status for contacts
	XML = MESSAGE_ChangeStatus(NewStatus);
	
	// Change user status for rooms
	for (i=0 ; i<RoomList.length ; i++)
	{
		Room = RoomList[i];
		XML += MESSAGE_ChangeStatus(NewStatus, Room.MsgTo);
	}
	
	// Change status in select menu
	Select = document.getElementById("UserStatusSelect");

	// If new status is playing, create new item in select box, select it and disabled select box
	if (NewStatus == "playing")
	{
		// Playing
		StatusItem = UTILS_CreateElement("option", 'status_playing_op', MainData.UserType+"_playing", "("+UTILS_Capitalize(UTILS_GetText("status_playing"))+")");
		StatusItem.value = "playing";
		StatusItem.selected = true;
		Select.appendChild(StatusItem);
	
		Select.disabled = true;
		Select.className = "disabled";
	}
	// If current status is playing, remove playing option from
	// select box, enable select box and  select avaiable status(Index 0)
	else if (MyUserStatus == "playing")
	{
		Select.disabled = false;
		Select.className = "enabled";
		StatusItem = document.getElementById('status_playing_op');
		Select.removeChild(StatusItem);
		Select.selectedIdex = 0;
	}
	
	// Update your status in structure
	MyUser.SetStatus(NewStatus);

	// Send to jabber or return the message
	if (DontSend == null)
	{
		CONNECTION_SendJabber(XML);
		return null;
	}
	else
	{
		return XML;
	}
}

/**
* Change status of 'Username' in structure and interface
*/
function CONTACT_SetUserStatus(Username, NewStatus)
{
	var Rating, Type;
	var ContactUser;
	var ContactObj = MainData.GetContactObj();

	// Update new user status in data struct
	/*
	var User = MainData.GetUser(Username);
	if(User != null)
	{
		User.SetStatus(NewStatus);
	}
	*/
	// Find user in data struct 
	ContactUser = MainData.GetContactUser(Username);

	if(ContactUser != null)
	{
		// Update new user status in data struct
		ContactUser.SetStatus(NewStatus);

		// Get user type
		Type = ContactUser.Type;
		// Get user rating
		Rating = ContactUser.Rating.GetRatingValue(MainData.GetContactCurrentRating());

		// Update user status in contact list
		ContactObj.updateUser(Username, NewStatus, Rating, Type);
	}

	// Refresh number of contacts online	
	INTERFACE_RefreshContactOnlineNumber();

	return "";
}

/**
 * Start away counter;
 */
function CONTACT_StartAwayCounter()
{
	MainData.SetAwayCounter(300);

	MainData.SetAwayInterval(setInterval("CONTACT_SetAwayStatus()", 1000));

	document.body.setAttribute("onmousedown","CONTACT_ResetAwayStatus()");
	document.body.setAttribute("onkeypress","CONTACT_ResetAwayStatus()");
}

/**
 * Countdown away counter, and set away status if away counter less than zero
 */ 
function CONTACT_SetAwayStatus()
{
	var Select = document.getElementById("UserStatusSelect");
	var MyUsername = MainData.GetUsername();
	var MyUser = MainData.GetUser(MyUsername);
	var MyUserStatus = MyUser.GetStatus();
	var AwayCounter = MainData.GetAwayCounter()

	MainData.SetAwayCounter(AwayCounter - 1);

	if(AwayCounter-1 == 0)
	{
		if((MyUserStatus != "playing")&&(MyUserStatus != "unavailable"))
		{
			CONTACT_ChangeStatus("away");
			
			// Select away status 
			Select.selectedIndex = 3;
		}
	}
}

/**
 * Reset away counter and set status to available
 */
function CONTACT_ResetAwayStatus()
{
	var Select = document.getElementById("UserStatusSelect");
	var MyUsername = MainData.GetUsername();
	var MyUser = MainData.GetUser(MyUsername);
	var MyUserStatus;

	// Away counter reset to 5 minutes
	MainData.SetAwayCounter(300);

	// Quick fix to solve the problem when remove events from body tag
	// in CONTACT_StopAwayStatus();
	if(MyUser != null)
	{
		MyUserStatus = MyUser.GetStatus();
		if(MyUserStatus == "away")
		{
			CONTACT_ChangeStatus("available");
			
			// Select available status 
			Select.selectedIndex = 0;
		}
	}

}

/**
 * Stop away counter
 */
function CONTACT_StopAwayStatus()
{
	clearInterval(MainData.GetAwayInterval());
	MainData.SetAwayInterval(null);

	document.body.removeAttribute("onmousedown");
	document.body.removeAttribute("onkeypress");
}
