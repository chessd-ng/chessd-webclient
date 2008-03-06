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
* Create elements to profile window
*
* @param Profile					Object with profile data	 
* @return									Div; Array
* @see										WINDOW_Profile();
* @author									Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowProfileWindow(Profile)
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

	var TimeLeftDiv;
	var OnlineTimeLabel;

	var TimeRightDiv;
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
	var TitleImg;

	var Buttons = new Array();
	var i,j, Time;
	var User;
	var Elements = new Object();

	if (Profile.User == MainData.Username)
	{
		User = true;
	}
	else
	{
		User = false;
	}

	// Main Div
	Div = UTILS_CreateElement('div','ProfileDiv');

	// Top Div <Photo, Nick, Name>
	TopDiv = UTILS_CreateElement('div','TopDiv');
	
	// Photo Div
	PhotoDiv = UTILS_CreateElement('div','ProfPhotoDiv');

	Photo = UTILS_CreateElement('img');
	Photo.src = "images/no_photo.png";
	
	Br = UTILS_CreateElement('br');
	EditPhotoLabel = UTILS_CreateElement('span',null,'edit_photo',UTILS_GetText('profile_edit_photo'));
	EditPhotoLabel.onclick = function (){ WINDOW_ProfileImage();};
	
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

	if (User)
	{
		Username = 	UTILS_CreateElement('input',null,'inf');
		Username.value = Profile.Name;
		
		WhoAmIUser = 	UTILS_CreateElement('textarea',null,'inf_whoami');
		WhoAmIUser.value = Profile.Description;
	
		SaveProfile = UTILS_CreateElement('input',null,'button_big');
		SaveProfile.type = "button";
		SaveProfile.value = UTILS_GetText("profile_save");
		SaveProfile.onclick = function() {
			// Send messages with changes
			PROFILE_SaveMyProfile();
			//TODO
			// Show the window confirmation
		};
	}
	else
	{
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
			TypeImg.src = "images/admin_available.png";
			break;
		case 'teacher':
			TypeImg.src = "images/teacher_available.png";
			break;
		default:
			TypeImg.src = "images/user_available.png";
	}

	// Time Div <Online Time, Total Time>
	TimeDiv = UTILS_CreateElement('div','TimeDiv');

	// Left Div <Online Time>
	TimeLeftDiv = UTILS_CreateElement('div','TimeLeftDiv');

	if (Profile.OnlineTime == 'None')
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
	TimeRightDiv = UTILS_CreateElement('div','TimeRightDiv');
	TotalTimeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_total_time'));
	TotalTimeSpan = UTILS_CreateElement('span',null,'value',Profile.Total);
	TotalTimeLabel.appendChild(TotalTimeSpan);

	// Old Games Div <Old Games Div>
	OldGamesDiv = UTILS_CreateElement('div','OldGamesDiv');
	if (User)
	{
		OldGamesLabel = UTILS_CreateElement('span',null,'oldgames',UTILS_GetText('profile_old_games1'))
	}
	else
	{
		OldGamesLabel = UTILS_CreateElement('span',null,'oldgames',UTILS_GetText('profile_old_games2') + Profile.User);
	}
	OldGamesLabel.onclick = function() {
		// TODO
		// Send the messages to get user old games
	}

	// Buttons Div 
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Close = UTILS_CreateElement('input',null,'button');
	Close.type = "button";
	Close.value = UTILS_GetText("window_close");
	Buttons.push(Close);
	
	// Mount tree elements
	// Append Salve profile
	if (User)
	{
		ButtonsDiv.appendChild(SaveProfile);
		Buttons.push(SaveProfile);
	}
	ButtonsDiv.appendChild(Close);

	// Photo Div elements
	PhotoDiv.appendChild(Photo);
	PhotoDiv.appendChild(Br);
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
	
	// Who Left and Right elements
	WhoLeftDiv.appendChild(WhoAmILabel);
	WhoRightDiv.appendChild(WhoAmIUser);
	
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
	TimeLeftDiv.appendChild(OnlineTimeLabel);
	TimeRightDiv.appendChild(TotalTimeLabel);

	// Time elements
	TimeDiv.appendChild(TimeLeftDiv);
	TimeDiv.appendChild(TimeRightDiv);
	
	// Old games elements
	OldGamesDiv.appendChild(OldGamesLabel);
	
	// Main Div elements
	Div.appendChild(TopDiv);
	Div.appendChild(WhoDiv);
	Div.appendChild(RatingDiv);
	Div.appendChild(BottomDiv);
	Div.appendChild(TimeDiv);
	Div.appendChild(OldGamesDiv);
	Div.appendChild(ButtonsDiv);

	Elements.Username = Username;
	Elements.UserImg = Photo;
	Elements.Nick = Nickname;
	Elements.Desc = WhoAmIUser;
	Elements.TBody = TBody;
	Elements.TotalTime = TotalTimeSpan;
	Elements.OnlineTime = OnlineTimeSpan;
	Elements.Group = GroupSpan;
	Elements.Title = TitleSpan;
	Elements.TitleImg = TypeImg;
	
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

	return {Div:Div, Buttons:Buttons, Elements:Elements}
}

/**
*	Create elements of confirm profile close window and returns div
*
* @return	Div; Array
* @see		WINDOW_ProfileConfirm();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowProfileConfirmWindow()
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

function INTERFACE_ProfileSetUser(Username)
{
	this.Username.value = Username;
}

function INTERFACE_ProfileSetUserImg(Img)
{
	this.UserImg.src = Img;
}
function INTERFACE_ProfileSetNick(Nick)
{
	this.Nick.value = Nick;
}
function INTERFACE_ProfileSetDesc(Desc)
{
	this.Desc.value = Desc;
}
function INTERFACE_ProfileSetRatings(Ratings)
{
	var Tr, Td;
	var i,j;

	for(i = 0; i < 3; i++)
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

function INTERFACE_ProfileSetTotalTime(Time)
{
	this.TotalTime.innerHTML = Time;
}
function INTERFACE_ProfileSetOnlineTime(Time)
{
	this.OnlineTime.innerHTML = Time;
}
function INTERFACE_ProfileSetTitle(Title)
{
	this.Title.innerHTML = Title;
}
function INTERFACE_ProfileSetTitleImg(NewSrc)
{
	this.TitleImg.src = NewSrc;
}

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
		default:
			this.Group.innerHTML = "---";
	}
}
