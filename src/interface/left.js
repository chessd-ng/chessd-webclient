import { CONTACT_ChangeStatus } from 'contact/status.js';
import { INTERFACE_CreateRooms } from 'interface/room.js';
import { INTERFACE_ShowUserFullName, INTERFACE_CloseUserFullName } from 'interface/user.js';
import {
	UTILS_GetText,
	UTILS_Capitalize,
	UTILS_CreateElement,
	UTILS_AddListener,
	UTILS_ShortString,
} from 'utils/utils.js';
import { INTERFACE_CreateContact } from 'interface/contact.js';
import { IMAGE_ImageDecode } from 'utils/images.js';
import { PROFILE_StartProfile } from 'profile/profile.js';
import { MainData } from 'main_data.js';

import ImageNoPhoto from 'images/no_photo.png';

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
* @file		interface/left.js
* @brief	Create elements of the left side of game enviromemnt
*/

/*
* @brief	Create left box
* 
* Create user information, contact list/online list and rooms
*
* @return	Left box HTML DOM Div
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function INTERFACE_CreateLeft()
{
	var Left, UserBox, Rooms, ContactList;

	Left = UTILS_CreateElement("div", "Left");
	UserBox = INTERFACE_CreateUserBox();
	ContactList = INTERFACE_CreateContact();
	Rooms = INTERFACE_CreateRooms();

	Left.appendChild(UserBox);
	Left.appendChild(ContactList);
	Left.appendChild(Rooms);

	return Left;
}

/**
* @brief	Create user box (left side of the screen)
*
* @return	User HTML DOM Div element
* @author	Pedro Rocha and Rubens Suguimoto
*/
function INTERFACE_CreateUserBox()
{
	var UserDiv, UserImg, UserInf, Name, Status, StatusItem;
	var Profile, ProfileP;
	var UserType;

	var MyUsername = MainData.GetUsername();
	//FIX IT TO GET USERNAME IN PREFERENCES OBJECT
	var User = MainData.GetUser(MyUsername);
	
	var UserImageLink;
	
	UserType = User.GetType();
	if (!UserType)
	{
		UserType = "user";
	}
 
	UserDiv = UTILS_CreateElement("div", "User");
	UserImg = UTILS_CreateElement("img","UserImg");
	UserImg.title = User.GetUsername();

	UserImageLink = User.GetPhoto();
	if (UserImageLink == null)
	{
    UserImg.src = ImageNoPhoto;
	}
	else
	{
		UserImg.src = UserImageLink;
	}

	UserInf = UTILS_CreateElement("div", "UserInf");
	if (MyUsername.length > 10)
	{
		Name = UTILS_CreateElement("h2", null, null, UTILS_ShortString(MyUsername,10));
		Name.onmouseover = function () { INTERFACE_ShowUserFullName(this, MyUsername); };
		Name.onmouseout = function () { INTERFACE_CloseUserFullName(); };
	}
	else
	{
		Name = UTILS_CreateElement("h2", null, null, MyUsername);
	}
	Status = UTILS_CreateElement("select", "UserStatusSelect",'enabled');

	// Available
	StatusItem = UTILS_CreateElement("option", null, UserType+"_available", "("+UTILS_Capitalize(UTILS_GetText("status_available"))+")");
	StatusItem.value = "available";
	Status.appendChild(StatusItem);

	// Unavailable
	StatusItem = UTILS_CreateElement("option", null, UserType+"_unavailable", "("+UTILS_Capitalize(UTILS_GetText("status_unavailable"))+")");
	StatusItem.value = "unavailable";
	Status.appendChild(StatusItem);

	// Busy
	StatusItem = UTILS_CreateElement("option", null, UserType+"_busy", "("+UTILS_Capitalize(UTILS_GetText("status_busy"))+")");
	StatusItem.value = "busy";
	Status.appendChild(StatusItem);

	// Away
	StatusItem = UTILS_CreateElement("option", null, UserType+"_away", "("+UTILS_Capitalize(UTILS_GetText("status_away"))+")");
	StatusItem.value = "away";
	Status.appendChild(StatusItem);

	Status.onchange = function () { CONTACT_ChangeStatus(this.value); };

	ProfileP = UTILS_CreateElement("p");
	Profile = UTILS_CreateElement("span",null,null,UTILS_GetText("contact_change_profile"));
	ProfileP.appendChild(Profile);
	UTILS_AddListener(Profile,"click", function() { PROFILE_StartProfile(MyUsername); }, "false");

	UserInf.appendChild(Name);
	UserInf.appendChild(Status);
	UserInf.appendChild(ProfileP);
	UserDiv.appendChild(UserImg);
	UserDiv.appendChild(UserInf);

	return UserDiv;
}


/**
* @brief	Change user's image
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function INTERFACE_SetUserImage(Img)
{
	var UserImg = document.getElementById("UserImg");

	if ((UserImg != null) && (Img != ImageNoPhoto))
	{
		UserImg.src = IMAGE_ImageDecode(Img);
	}
}
