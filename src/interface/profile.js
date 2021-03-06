import { PROFILE_SaveMyProfile } from 'profile/profile.js';
import {
	UTILS_GetText,
	UTILS_CreateElement,
	UTILS_ConvertTime,
} from 'utils/utils.js';
import { OLDGAME_OpenOldGameWindow } from 'game/oldgame.js';
import {
	WINDOW_ProfileImage,
} from 'window/window.js';

import { MainData } from 'main_data.js';

import ImageNoPhoto from 'images/no_photo.png';
import ImageAdminAvailable from 'images/admin_available.png';
import ImageTeacherAvailable from 'images/teacher_available.png';
import ImageUserAvailable from 'images/user_available.png';
import ImageRobotAvailable from 'images/robot_available.png';


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

/*
* @file		interface/profile.js
* @brief	Contais all functions to create and manage profile elements
*/

/**
* @brief	Create elements to profile window content object
*
* @param	Profile		Object with profile data	 
* @return	Profile main Div and Buttons Array
* @see		WINDOW_Profile();
* @author	Danilo Kiyoshi Simizu Yorinori
*/
export function INTERFACE_ShowProfileWindow(Profile)
{
	// Variables
	var Div;

	var TopDiv;

	var PhotoDiv;

	var Photo;
	var Br;
	var EditPhotoLabel;

	var TopRightDiv;

	var TopRight_LeftDiv;
	var NameLabel;
	var NickLabel;

	var TopRight_RightDiv;
	var Username;
	var Nickname;

	var CounterDiv;
	var CounterInput, CounterLabel;

	var WhoDiv;
	var WhoLeftDiv;
	var WhoAmILabel;

	var WhoRightDiv;
	var WhoAmIUser;

	var RatingDiv;
	var Table;
	var TBody;
	var Tr,Td;

	var BottomDiv;

	var BottomLeftDiv;
//	var LevelLabel;
	var GroupLabel; 
	var TypeLabel; 

	var BottomRightDiv;
	var TypeImg;
	
	var TimeDiv;

	var OnlineTimeLabel;

	var TotalTimeLabel;

	var OldGamesDiv;
	var OldGamesLabel;

	var ButtonsDiv;
	var SaveProfile;
	var Close;

	var GroupSpan;
	var TotalTimeSpan;
	var OnlineTimeSpan;
	var TitleSpan;

	var Buttons = new Array();
	var Time;
	var MyUser;
	var Elements = new Object();

	var MyUsername = MainData.GetUsername();

	if (Profile.User == MyUsername)
	{
		MyUser = true;
	}
	else
	{
		MyUser = false;
	}

	// Main Div
	Div = UTILS_CreateElement('div','ProfileDiv');

	// Top Div <Photo, Nick, Name>
	TopDiv = UTILS_CreateElement('div','TopDiv');
	
	// Photo Div
	PhotoDiv = UTILS_CreateElement('div','ProfPhotoDiv');

	Photo = UTILS_CreateElement('div');
  Photo.style.backgroundImage = 'url("' + ImageNoPhoto + '")';
	
	// Top Right Div <User,Name>
	TopRightDiv = UTILS_CreateElement('div','TopRightDiv');

	TopRight_LeftDiv = UTILS_CreateElement('div','TopRight_LeftDiv');
	NickLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_nick'));
	NameLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_name'));

	TopRight_RightDiv = UTILS_CreateElement('div','TopRight_RightDiv');

	// Who Div <Who>
	WhoDiv = UTILS_CreateElement('div','WhoDiv');
	WhoLeftDiv = UTILS_CreateElement('div','WhoLeftDiv');
	WhoRightDiv = UTILS_CreateElement('div','WhoRightDiv');

	SaveProfile = UTILS_CreateElement('input',null,'button');

	Nickname = 	UTILS_CreateElement('span', null, 'inf', Profile.User);

	if (MyUser)
	{
		// Change photo label
		EditPhotoLabel = UTILS_CreateElement('span',null,'edit_photo',UTILS_GetText('profile_edit_photo'));
		EditPhotoLabel.onclick = function (){ WINDOW_ProfileImage();};

		Username = 	UTILS_CreateElement('input',null,'inf');
		Username.value = Profile.Name;
		
		CounterDiv = UTILS_CreateElement('div', 'CounterDiv');
		CounterInput = UTILS_CreateElement("input",null,"counter_input");
		CounterInput.type = "text";
		CounterInput.value = 200;
		CounterInput.setAttribute("size",3);
		CounterInput.readOnly = true;
		CounterLabel = UTILS_CreateElement("span",null,null,UTILS_GetText("window_character"));
		CounterLabel.innerHTML = CounterLabel.innerHTML.replace(/%s/,200);

		WhoAmIUser = 	UTILS_CreateElement('textarea',null,'inf_whoami');
		WhoAmIUser.value = Profile.Description;
		WhoAmIUser.rows=6;

		WhoAmIUser.onkeyup = function() {
			if (200 - WhoAmIUser.value.length < 0)
			{
				WhoAmIUser.value = WhoAmIUser.value.substr(0,200);
			}
			CounterInput.value = 200 - WhoAmIUser.value.length;
			CounterLabel.innerHTML = UTILS_GetText("window_character");
			CounterLabel.innerHTML = CounterLabel.innerHTML.replace(/%s/,200 - WhoAmIUser.value.length);
		};
	
		SaveProfile = UTILS_CreateElement('input',null,'button_big');
		SaveProfile.type = "button";
		SaveProfile.value = UTILS_GetText("profile_save");
	}
	else
	{
		// Change photo label
		EditPhotoLabel = UTILS_CreateElement('span',null,'edit_photo',"");
		EditPhotoLabel.onclick = function (){ return false;};

		Username = 	UTILS_CreateElement('span', null, 'inf', Profile.Name);

		WhoAmIUser = 	UTILS_CreateElement('span', null, 'inf_whoami', Profile.Description);
	}

	
	WhoAmILabel = UTILS_CreateElement('p',null,'label',UTILS_GetText('profile_whoami'));

	// Rating Div <Table of Rating>	
	RatingDiv = UTILS_CreateElement('div','RatingDiv');

	Table = UTILS_CreateElement('table');
	TBody = UTILS_CreateElement('tbody');

	// Table Headers
	Tr = UTILS_CreateElement('tr');
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_category'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_current_rating'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_best_rating'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_record_date'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_games_number'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_win'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_draw'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_lose'));
		Tr.appendChild(Td);
	TBody.appendChild(Tr);
	Table.appendChild(TBody);
	
	// Bottom Div < Group, Type, Image Type>
	BottomDiv = UTILS_CreateElement('div','BottomDiv');

	// Left Div <Type, Group>
	BottomLeftDiv = UTILS_CreateElement('div','BottomLeftDiv');

//	LevelLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_level'));
	
	GroupLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_group'));
	GroupSpan = UTILS_CreateElement('span',null,'value',UTILS_GetText('contact_user'));
	GroupLabel.appendChild(GroupSpan);

	TypeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_type'));
	TitleSpan = UTILS_CreateElement('span',null,'value',Profile.Type);
	TypeLabel.appendChild(TitleSpan);

	// Right Div <Imagem>
	BottomRightDiv = UTILS_CreateElement('div','BottomRightDiv');

	TypeImg = UTILS_CreateElement('img');
	switch(Profile.Group)
	{
		case 'admin':
      TypeImg.src = ImageAdminAvailable;
			break;
		case 'teacher':
      TypeImg.src = ImageTeacherAvailable;
			break;
		default:
      TypeImg.src = ImageUserAvailable;
	}

	// Time Div <Online Time, Total Time>
	TimeDiv = UTILS_CreateElement('div','TimeDiv');

	if (Profile.OnlineTime == null)
	{
		Time = "Off-line";
	}
	else
	{
		Time = Profile.Online;
	}

	OnlineTimeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_online_time'));
	OnlineTimeSpan = UTILS_CreateElement('span',null,'value',Time);
	OnlineTimeLabel.appendChild(OnlineTimeSpan);

	// Time Div <Total Time>
	TotalTimeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_total_time'));
	TotalTimeSpan = UTILS_CreateElement('span',null,'value');
	
	if(Profile.Total != null)
	{
		TotalTimeSpan.innerHTML = Profile.Total;
	}
	else
	{
		TotalTimeSpan.innerHTML = "---";
	}

	TotalTimeLabel.appendChild(TotalTimeSpan);

	// Old Games Div <Old Games Div>
	OldGamesDiv = UTILS_CreateElement('div','OldGameDiv');
	if (MyUser)
	{
		OldGamesLabel = UTILS_CreateElement('span',null,'oldgames',UTILS_GetText('profile_old_games1'));
		OldGamesLabel.onclick = function() { OLDGAME_OpenOldGameWindow(MyUsername); };
	}
	else
	{
		OldGamesLabel = UTILS_CreateElement('span',null,'oldgames',UTILS_GetText('profile_old_games2') +" "+ Profile.User);
		OldGamesLabel.onclick = function() { OLDGAME_OpenOldGameWindow(Profile.User); };
	}

	// Buttons Div 
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Close = UTILS_CreateElement('input',null,'button');
	Close.type = "button";
	Close.value = UTILS_GetText("window_close");

	Buttons.push(Close);
	
	// Mount tree elements
	// Append Salve profile
	if (MyUser)
	{
		ButtonsDiv.appendChild(SaveProfile);
		Buttons.push(SaveProfile);
	}
	ButtonsDiv.appendChild(Close);

	// Photo Div elements
	PhotoDiv.appendChild(Photo);
	PhotoDiv.appendChild(EditPhotoLabel);
	
	// TopRight Left elements
	TopRight_LeftDiv.appendChild(NickLabel);
	TopRight_LeftDiv.appendChild(NameLabel);
	
	// TopRight Right elements
	TopRight_RightDiv.appendChild(Nickname);
	TopRight_RightDiv.appendChild(Username);
	
	// TopRight elements
	TopRightDiv.appendChild(TopRight_LeftDiv);
	TopRightDiv.appendChild(TopRight_RightDiv);

	// Top elements
	TopDiv.appendChild(PhotoDiv);
	TopDiv.appendChild(TopRightDiv);
	
	// Counter Div
	if (MyUser) {
//		CounterDiv.appendChild(CounterInput);
		CounterDiv.appendChild(CounterLabel);
	}
	
	// Who Left and Right elements
	WhoLeftDiv.appendChild(WhoAmILabel);
	WhoRightDiv.appendChild(WhoAmIUser);
	if (MyUser)
	{
		WhoRightDiv.appendChild(CounterDiv);
	}
	
	// Who elements
	WhoDiv.appendChild(WhoLeftDiv);
	WhoDiv.appendChild(WhoRightDiv);

	// Rating elements
	RatingDiv.appendChild(Table);

	// Bottom Left elements
//	BottomLeftDiv.appendChild(LevelLabel);
	BottomLeftDiv.appendChild(GroupLabel);
	BottomLeftDiv.appendChild(TypeLabel);

	// Bottom Right elements
	BottomRightDiv.appendChild(TypeImg);

	// Bottom elements
	BottomDiv.appendChild(BottomLeftDiv);
	BottomDiv.appendChild(BottomRightDiv);

	// Time Left and Right elements
//	TimeLeftDiv.appendChild(OnlineTimeLabel);
//	TimeRightDiv.appendChild(TotalTimeLabel);

	// Time elements
//	TimeDiv.appendChild(TimeLeftDiv);
//	TimeDiv.appendChild(TimeRightDiv);
	TimeDiv.appendChild(OnlineTimeLabel);
	TimeDiv.appendChild(TotalTimeLabel);
	
	// Old games elements
	OldGamesDiv.appendChild(OldGamesLabel);

	// Main Div elements
	Div.appendChild(TopDiv);
	Div.appendChild(WhoDiv);
	Div.appendChild(RatingDiv);
	Div.appendChild(BottomDiv);

	// IE Fix
	if (MainData.GetBrowser() == 0)
	{
		Br = UTILS_CreateElement("br");
		Div.appendChild(Br);
	}

	Div.appendChild(TimeDiv);
	Div.appendChild(OldGamesDiv);
	Div.appendChild(ButtonsDiv);

	Elements.Username = Username;
	Elements.UserImg = Photo;
	Elements.PhotoLabel = EditPhotoLabel;
	Elements.ImgType = "";
	Elements.Img64 = "";
	Elements.Nick = Nickname;
	Elements.Desc = WhoAmIUser;
	Elements.TBody = TBody;
	Elements.TotalTime = TotalTimeSpan;
	Elements.OnlineTime = OnlineTimeSpan;
	Elements.Group = GroupSpan;
	Elements.Title = TitleSpan;
	Elements.TitleImg = TypeImg;
	Elements.Counter = CounterLabel;
	Elements.CloseConfirm = false;
	Elements.Close = Close;
	Elements.Save = SaveProfile;
	
	Elements.SetUser = INTERFACE_ProfileSetUser;
	Elements.SetUserImg = INTERFACE_ProfileSetUserImg;
	Elements.SetNick = INTERFACE_ProfileSetNick;
	Elements.SetDesc = INTERFACE_ProfileSetDesc;
	Elements.SetRatings = INTERFACE_ProfileSetRatings;
	Elements.SetTotalTime = INTERFACE_ProfileSetTotalTime;
	Elements.SetOnlineTime = INTERFACE_ProfileSetOnlineTime;
	Elements.SetTitle = INTERFACE_ProfileSetTitle;
	Elements.SetTitleImg = INTERFACE_ProfileSetTitleImg;
	Elements.SetGroup = INTERFACE_ProfileSetGroup;
	Elements.GetUser = INTERFACE_ProfileGetUser;
	Elements.GetDesc = INTERFACE_ProfileGetDesc;
	Elements.GetImgType = INTERFACE_ProfileGetImgType;
	Elements.GetImg64 = INTERFACE_ProfileGetImg64;
	Elements.SetImgType = INTERFACE_ProfileSetImgType;
	Elements.SetImg64 = INTERFACE_ProfileSetImg64;
	Elements.SetClose = INTERFACE_ProfileSetClose;
	Elements.GetClose = INTERFACE_ProfileGetClose;
	Elements.SetButtonsAvailable = INTERFACE_ProfileSetAvailable;
	Elements.SetButtonsUnavailable = INTERFACE_ProfileSetUnavailable;

	return {Div:Div, Buttons:Buttons, Elements:Elements};
}

/**
* @brief	Create confirm profile close window content
*
* @return	Profile confirm main Div and Buttons Array
* @see		WINDOW_ProfileConfirm();
* @author Danilo Kiyoshi Simizu Yorinori
*/
export function INTERFACE_ShowProfileConfirmWindow()
{
	// Variables
	var Div;
	var Buttons = new Array();
	var TextDiv;
	var Label;
	var ButtonsDiv;
	var Discard;
	var Save;
	var Cancel;
	// Main Div
	Div = UTILS_CreateElement("div","ProfileConfirmDiv");
	// Text Div
	TextDiv = UTILS_CreateElement("div","TextDiv");
	Label = UTILS_CreateElement("p",null,null,UTILS_GetText('profile_confirm'));
	// Buttons Div
	ButtonsDiv = UTILS_CreateElement("div","ButtonsDiv");
	Discard = UTILS_CreateElement("input", null,"button_big");
	Discard.type = "button";
	Discard.value = UTILS_GetText('profile_discard');
	//TODO
	//insert discard functions

	Save = UTILS_CreateElement("input", null,"button_big");
	Save.type = "button";
	Save.value = UTILS_GetText('profile_save_close');
	// TODO
	// save changes functions
	Save.onclick = function() {
		// Send messages with changes
		PROFILE_SaveMyProfile();
	};

	Cancel = UTILS_CreateElement("input", null,"button_big");
	Cancel.type = "button";
	Cancel.value = UTILS_GetText('window_cancel');
	// TODO
	// close this window and return to profile window
	// Insert buttons in array to return
	Buttons.push(Discard);
	Buttons.push(Save);
	Buttons.push(Cancel);

	// Mount tree elements
	// Buttons elements
	ButtonsDiv.appendChild(Discard);
	ButtonsDiv.appendChild(Save);
	ButtonsDiv.appendChild(Cancel);

	// Text elements
	TextDiv.appendChild(Label);

	// Main Div elements
	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

//METHODS
/**
* @brief	Set profile username
*
* @param	Username	User's name
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetUser(Username)
{
	if(this.Username.tagName == "INPUT")
	{
		this.Username.value = Username;
	}
	else
	{
		this.Username.innerHTML = Username;
	}
}

/**
* @brief	Get profile username
*
* @return	User's name
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileGetUser()
{
	return this.Username.value;
}

/**
* @brief	Set profile user's image
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetUserImg(Img)
{
	//No user image
	if(Img != null)
	{
    this.UserImg.style.backgroundImage = 'url("' + Img + '")';
	}
	else
	{
    this.UserImg.style.backgroundImage = 'url("' + ImageNoPhoto+ '")';
	}

}

/**
* @brief	Set nick name
*
* @param	Nick	User's nickname
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetNick(Nick)
{
	this.Nick.value = Nick;
}

/**
* @brief	Set description
*
* @param	Desc	User's description
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetDesc(Desc)
{
	var MyUsername = MainData.GetUsername();

	if(this.Desc.tagName == "TEXTAREA")
	{
		if (Desc != undefined)
		{
			this.Desc.value = Desc;
		}
		else
		{
			this.Desc.value = "";
		}
	}
	else
	{
		if (Desc != undefined)
		{
			this.Desc.innerHTML = Desc;
		}
		else
		{
			this.Desc.innerHTML = "";
		}
	}
	if (this.Nick.innerHTML == MyUsername)
	{
		this.Counter.innerHTML = UTILS_GetText("window_character");
		this.Counter.innerHTML = this.Counter.innerHTML.replace(/%s/, 200 - this.Desc.value.length);
	}
}

/**
* @brief	Get user's description
*
* @return	User's desciption string
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileGetDesc()
{
	return  this.Desc.value;
}

/**
* @brief	Set rating lists
*
* @param	Ratings		Rating's list
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetRatings(Ratings)
{
	var Tr, Td;
	var i,j;

	for(i = 0; i < Ratings.length; i++)
	{
		Tr = UTILS_CreateElement('tr');
		
		for(j = 0; j < 8; j++)
		{
			Td = UTILS_CreateElement('td',null,null,Ratings[i][j]);
			Tr.appendChild(Td);
		}

		this.TBody.appendChild(Tr);
	}
}

/**
* @brief	Set total online time
*
* @param	Time	Time seconds
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetTotalTime(Time)
{
	if(Time != null)
	{
		this.TotalTime.innerHTML = UTILS_ConvertTime(parseInt(Time));
	}
	else
	{
		this.TotalTime.innerHTML = "---";
	}
}

/**
* @brief	Set online time
*
* @param	Time	Time seconds
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetOnlineTime(Time)
{
	if(Time != null)
	{
		this.OnlineTime.innerHTML = UTILS_ConvertTime(parseInt(Time));
	}
	else
	{
		this.OnlineTime.innerHTML = "---";
	}
}

/**
* @brief	Set user's level
*
* @param	Title	User's level
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetTitle(Title)
{
	this.Title.innerHTML = Title;
}

/**
* @brief	Set user's type image
*
* @param	Group	User's type
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetTitleImg(Group)
{
	switch(Group)
	{
		case 'admin':
      this.TitleImg.src = ImageAdminAvailable;
			break;
		case 'teacher':
      this.TitleImg.src = ImageTeacherAvailable;
			break;
		case 'user':
      this.TitleImg.src = ImageUserAvailable;
			break;
		case 'robot':
      this.TitleImg.src = ImageRobotAvailable;
			break;
		default:
      this.TitleImg.src = ImageUserAvailable;
	}
}

/**
* @brief	Set user's  Group
*
* @param	Group	User's Group
* @return	none
* @author	Danilo Yorinori
*/
function INTERFACE_ProfileSetGroup(Group)
{
	switch(Group)
	{
		case 'admin':
			this.Group.innerHTML = UTILS_GetText('contact_admin');
			break;
		case 'teacher':
			this.Group.innerHTML = UTILS_GetText('contact_teacher');
			break;
		case 'user':
			this.Group.innerHTML = UTILS_GetText('contact_user');
			break;
		case 'robot':
			this.Group.innerHTML = UTILS_GetText('contact_robot');
			break;
		default:
			this.Group.innerHTML = "---";
	}
}

/**
* @brief	Set user's profile image type
*
* @param	ImgType		Image's type
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetImgType(ImgType)
{
	this.ImgType = ImgType;
}

/**
* @brief	Get user's profile image type
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileGetImgType()
{
	return this.ImgType;
}

/**
* @brief	Set user's image in base64
*
* @param	Img64	Image string in base64
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileSetImg64(Img64)
{
	this.Img64 = Img64;
}

/**
* @brief	Get profile user's image
*
* @return	User's image string in base64
* @author	Rubens Suguimoto
*/
function INTERFACE_ProfileGetImg64()
{
	return this.Img64;
}

/**
* @brief	Set status of close confirm window
*
* @param 	Bool (true is window confirm opened or false is window confirm closed)
* @return	none
* @author	Danilo Yorinori
*/
function INTERFACE_ProfileSetClose(Bool)
{
	this.CloseConfirm = Bool;
}

/**
* @brief	Get CloseConfirm value
*
* @return 	Boolean (true is window confirm opened or false is window confirm closed)
* @see INTERFACE_ProfileSetClose
* @author	Danilo Yorinori
*/
function INTERFACE_ProfileGetClose()
{
	return this.CloseConfirm;
}
	
/**
* @brief	Set Profile window buttons as available
*
* @return	none
* @author	Danilo Yorinori
*/
function INTERFACE_ProfileSetAvailable()
{
	this.Close.className = "button";
	this.Save.className = "button_big";
	this.Desc.disabled = false;
	this.Username.disabled = false;
	this.PhotoLabel.className = "edit_photo";
	this.PhotoLabel.onclick = function() { WINDOW_ProfileImage(); };
}

/**
* @brief	Set Profile window buttons as unavailable
*
* @return	none
* @author	Danilo Yorinori
*/
function INTERFACE_ProfileSetUnavailable()
{
	this.Close.className = "button_disabled";
	this.Save.className = "button_big_disabled";
	this.Desc.disabled = true;
	this.Username.disabled = true;
	this.PhotoLabel.className = "edit_photo_disabled";
	this.PhotoLabel.onclick = function() { return false; };
}
