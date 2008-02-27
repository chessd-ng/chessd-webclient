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

	var EditableDiv;

	var PhotoDiv;

	var Photo;
	var Br;
	var EditPhotoLabel;

	var TopLeftDiv;
	var NameLabel;
	var NickLabel;

	var TopRightDiv;
	var Username;
	var Nickname;

	var WhoDiv;
	var WhoLefttDiv;
	var WhoAmILabel;

	var WhoRightDiv;
	var WhoAmIUser;

	var TableDiv;
	var Table;
	var Tr,Td;

	var LevelLabel;
	var TypeLabel; 
	var GroupLabel; 

	var OnlineTimeLabel;
	var TotalTimeLabel;

	var OldGamesLabel;

	var ButtonsDiv;
	var SaveProfile;
	var Close;

	var Buttons = new Array();
	var i,j, tmp_time;

	// Main Div
	Div = UTILS_CreateElement('div','ProfileDiv');

	// Editable Div
	EditableDiv = UTILS_CreateElement('div','EditableDiv');
	
	PhotoDiv = UTILS_CreateElement('div','ProfPhotoDiv');

	Photo = UTILS_CreateElement('img');
	Photo.src = "images/no_photo.png";
	
	Br = UTILS_CreateElement('br');
	EditPhotoLabel = UTILS_CreateElement('span',null,'edit_photo',UTILS_GetText('profile_edit_photo'));
	
	TopLeftDiv = UTILS_CreateElement('div','TopLeftDiv');
	TopRightDiv = UTILS_CreateElement('div','TopRightDiv');
	WhoDiv = UTILS_CreateElement('div','WhoDiv');
	WhoLeftDiv = UTILS_CreateElement('div','WhoLeftDiv');
	WhoRightDiv = UTILS_CreateElement('div','WhoRightDiv');

	NameLabel = UTILS_CreateElement('p',null,'label',UTILS_GetText('profile_name'));
	NickLabel = UTILS_CreateElement('p',null,'label',UTILS_GetText('profile_nick'));
	WhoAmILabel = UTILS_CreateElement('span',null,'label',UTILS_GetText('profile_whoami'));

	SaveProfile = UTILS_CreateElement('input',null,'button');

	if (Profile.Name == MainData.Username)
	{
		Username = 	UTILS_CreateElement('input',null,'inf');
		Username.value = Profile.Name;
		
		Nickname = 	UTILS_CreateElement('input',null,'inf');
		Nickname.value = Profile.Nick;

		WhoAmIUser = 	UTILS_CreateElement('textarea',null,'inf_whoami');
		WhoAmIUser.value = Profile.Description;
	
		SaveProfile = UTILS_CreateElement('input',null,'button');
		SaveProfile.type = "button";
		SaveProfile.value = UTILS_GetText("window_save");
		SaveProfile.onclick = function() {
		// TODO
		// Send messages with changes
		// Show the window confirmation
		};
	}
	else
	{
		Username = 	UTILS_CreateElement('span', null, 'inf', Profile.Name);
		
		Nickname = 	UTILS_CreateElement('span', null, 'inf', Profile.Nick);

		WhoAmIUser = 	UTILS_CreateElement('span', null, 'inf_whoami', Profile.Description);
	}
	
	TableDiv = UTILS_CreateElement('div','TableDiv');
	Table = UTILS_CreateElement('table');
	Tr = UTILS_CreateElement('tr');
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_category'));
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
	Table.appendChild(Tr);

/*
	LevelLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_level'));
	TypeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_type'));
	GroupLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_group'));

	if (Profile.OnlineTime == 'None')
	{
		tmp_time = "Off-line";
	}
	else
	{
		tmp_time = Profile.OnlineTime;
	}

	OnlineTimeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_online_time'));
	TotalTimeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_total_time'));

	// Show the rating in rating array in Profile parameter
	// Each line is a rating type and columns contais the values
	// Col 0 = category
	// Col 1 = best rating
	// Col 2 = record data
	// Col 3 = number in game category
	// Col 4 = number of won games in category
	// Col 5 = number of lose games in category
	// Col 6 = number of draw games in category
	for(i = 0; i < Profile.Rates.length; i++)
	{
		Tr = UTILS_CreateElement('tr');
		
		Td = UTILS_CreateElement('td',null,null,Profile.Rates[i][0]);

		Tr.appendChild(Td);

		for(j = 0; j < 7; j++)
		{
			Td = UTILS_CreateElement('td',null,null,Profile.Rates[i][j]);
			Tr.appendChild(Td);
		}
		Table.appendChild(Tr);
	}

	OldGamesLabel = UTILS_CreateElement('p',null,'oldgames',UTILS_GetText('profile_old_games'));
	OldGamesLabel.onclick = function() {
		// TODO
		// Send the messages to get user old games
	}

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Close = UTILS_CreateElement('input',null,'button');
	Close.value = UTILS_GetText("window_close");
	Buttons.push(Close);
	
	// Mount tree elements
	//
	if (Profile.Name == MainData.Username)
	{
		ButtonsDiv.appendChild(SaveProfile);
		Buttons.push(SaveProfile);
	}
	ButtonsDiv.appendChild(Close);
*/
	PhotoDiv.appendChild(Photo);
	PhotoDiv.appendChild(Br);
	PhotoDiv.appendChild(EditPhotoLabel);
	
	TopLeftDiv.appendChild(NickLabel);
	TopLeftDiv.appendChild(NameLabel);
	
	TopRightDiv.appendChild(Username);
	TopRightDiv.appendChild(Nickname);
	
	WhoLeftDiv.appendChild(WhoAmILabel);
	WhoRightDiv.appendChild(WhoAmIUser);
	
	WhoDiv.appendChild(WhoLeftDiv);
	WhoDiv.appendChild(WhoRightDiv);

	EditableDiv.appendChild(PhotoDiv);
	EditableDiv.appendChild(TopLeftDiv);
	EditableDiv.appendChild(TopRightDiv);
	EditableDiv.appendChild(WhoDiv);

	TableDiv.appendChild(Table);

	Div.appendChild(EditableDiv);
	Div.appendChild(TableDiv);
	/*
	Div.appendChild(LevelLabel);
	Div.appendChild(TypeLabel);
	Div.appendChild(GroupLabel);
	Div.appendChild(OnlineTimeLabel);
	Div.appendChild(TotalTimeLabel);
	Div.appendChild(OldGamesLabel);
	Div.appendChild(ButtonsDiv);*/

	return {Div:Div, Buttons:Buttons}
}
/*
function INTERFACE_ShowProfileWindow(Profile)
{
	// Variables
	var Div;

	var Photo;

	var ProfLeftDiv;
	var ProfRightDiv;

	var NameLabel;
	var NickLabel;
	var WhoAmILabel;

	var Username;
	var Nickname;
	var WhoAmIUser;

	var LevelLabel;
	var TypeLabel; 
	var GroupLabel; 

	var Table;
	var Tr,Td;

	var OnlineTimeLabel;
	var TotalTimeLabel;

	var OldGamesLabel;

	var ButtonsDiv;
	var SaveProfile;
	var Close;

	var Buttons = new Array();
	var i,j;

	// Main Div
	Div = UTILS_CreateElement('div','ProfileDiv');

	Photo = UTILS_CreateElement('img');
	Photo.src = "images/no_photo.png";
	
	ProfLeftDiv = UTILS_CreateElement('div','ProfLeftDiv');
	ProfRightDiv = UTILS_CreateElement('div','ProfRightDiv');

	NameLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_name'));
	NickLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_nick'));
	WhoAmILabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_whoami'));

	SaveProfile = UTILS_CreateElement('input',null,'button');

	if (Profile.Name = MainData.Username)
	{
		Username = 	UTILS_CreateElement('input',null,'inf');
		Username.value = Profile.Name;
		
		Nickname = 	UTILS_CreateElement('input',null,'inf');
		Nickname.value = Profile.Nick;

		WhoAmIUser = 	UTILS_CreateElement('textarea',null,'inf_whoami');
		WhoAmIUser.value = Profile.Description;
	
		SaveProfile = UTILS_CreateElement('input',null,'button');
		SaveProfile.type = "button";
		SaveProfile.value = UTILS_GetText("window_save");
		SaveProfile.onclick = function() {
		// TODO
		// Send messages with changes
		// Show the window confirmation
		};
	}
	else
	{
		Username = 	UTILS_CreateElement('span', null, 'inf', Profile.Name);
		
		Nickname = 	UTILS_CreateElement('span', null, 'inf', Profile.Nick);

		WhoAmIUser = 	UTILS_CreateElement('span', null, 'inf_whoami', Profile.Description);
	}

	LevelLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_level'));
	TypeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_type'));
	GroupLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_group'));

	if (Profile.OnlineTime == 'None')
	{
		tmp_time = "Off-line";
	}
	else
	{
		tmp_time = Profile.OnlineTime;
	}

	OnlineTimeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_online_time'));
	TotalTimeLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('profile_total_time'));

	Table = UTILS_CreateElement('table');
	Tr = UTILS_CreateElement('tr');
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('profile_category'));
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
	Table.appendChild(Tr);

	// Show the rating in rating array in Profile parameter
	// Each line is a rating type and columns contais the values
	// Col 0 = category
	// Col 1 = best rating
	// Col 2 = record data
	// Col 3 = number in game category
	// Col 4 = number of won games in category
	// Col 5 = number of lose games in category
	// Col 6 = number of draw games in category
	for(i = 0; i < Profile.Rates.length; i++)
	{
		Tr = UTILS_CreateElement('tr');
		
		Td = UTILS_CreateElement('td',null,null,Profile.Rates[i][0]);

		Tr.appendChild(Td);

		for(j = 0; j < 7; j++)
		{
			Td = UTILS_CreateElement('td',null,null,Profile.Rates[i][j]);
			Tr.appendChild(Td);
		}
		Table.appendChild(Tr);
	}

	OldGamesLabel = UTILS_CreateElement('p',null,'oldgames',UTILS_GetText('profile_old_games'));
	OldGamesLabel.onclick = function() {
		// TODO
		// Send the messages to get user old games
	}

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Close = UTILS_CreateElement('input',null,'button');
	Close.value = UTILS_GetText("window_close");
	Buttons.push(Close);
	
	// Mount tree elements
	//
	if (Profile.Name == MainData.Username)
	{
		ButtonsDiv.appendChild(SaveProfile);
		Buttons.push(SaveProfile);
	}
	ButtonsDiv.appendChild(Close);

	ProfLeftDiv.appendChild(NameLabel);
	ProfLeftDiv.appendChild(NickLabel);
	ProfLeftDiv.appendChild(WhoAmILabel);

	ProfRightDiv.appendChild(Username);
	ProfRightDiv.appendChild(Nickname);
	ProfRightDiv.appendChild(WhoAmIUser);

	Div.appendChild(Photo);
	Div.appendChild(ProfLeftDiv);
	Div.appendChild(ProfRightDiv);
	Div.appendChild(Table);
	Div.appendChild(LevelLabel);
	Div.appendChild(TypeLabel);
	Div.appendChild(GroupLabel);
	Div.appendChild(OnlineTimeLabel);
	Div.appendChild(TotalTimeLabel);
	Div.appendChild(OldGamesLabel);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons}
}*/
