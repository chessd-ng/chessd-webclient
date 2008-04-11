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
* Create elements to challenge invite or challenge offer
*
* @param Oponent					Oponent's nickname 
* @param Rating						Oponent's current rating
* @param GameParameters		Object that contains the game parameters of a received challenge
* @param MatchId					Id of Match 
* @return									Div; Array
* @see										WINDOW_Challenge();
* @author									Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowChallengeWindow(Oponent, Rating, GameParameters, MatchId)
{
	var Div;

	var TopDiv;
	var Username, RatingLabel, Label;

	var Layer1Div;
	var L1LeftDiv;
	var ColorLabel, ColorOptW,BrW, ColorOptWImg, ColorOptB, ColorOptBImg,BrB, AutoColorOpt, AutoColorLabel;
	var L1RightDiv;
	var CatLabel, CatSelect, CatOptLi, CatOptBl, CatOptSt;
	var Br1;

	var Layer2Div;
	var L2LeftDiv;
	var TimeLabel, TimeSelect, TimeOpt, TimeLabelMin,TimeBr;
	var L2RightDiv;
	var IncLabel, IncSelect, IncOpt, IncLabelSeg,IncBr;
	var Br2;

	var ChalRightDiv;

	var Layer3Div;
	var RatingCheckbox, RatingLabel;
	var PrivateCheckbox, PrivateLabel;
	var AutoFlagCheckbox, AutoFlagLabel;
	var Br3;

	var ButtonsDiv;
	var Invite, Accept, Decline, NewParameters, Cancel, Chat;
	var Buttons = new Array();

	var Type, Color, Rated;
	var i; 

	// Main Div
	Div = UTILS_CreateElement('div', 'ChallengeDiv');
	
	// Top Elments
	TopDiv = UTILS_CreateElement('div', 'TopDiv');
	Username = UTILS_CreateElement('h3', null, null, Oponent);
	RatingLabel = UTILS_CreateElement('span',null,'rating',"Rating: "+Rating);
	Username.appendChild(RatingLabel);
	Label = UTILS_CreateElement('p', null, 'label_information', UTILS_GetText('challenge_information'));
	
	// Layer1 Elements

	Layer1Div = UTILS_CreateElement('div', 'Layer1Div');

	// Layer 1 Left Elements
	L1LeftDiv = UTILS_CreateElement('div', 'L1LeftDiv','leftDiv');

	ColorLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_pieces'));

	try
	//Fix radio button for IE
	{
		ColorOptW = document.createElement('<input class="radio" type="radio" name="color"/>');
	}
	catch(err)
	{ //FF
		ColorOptW =	UTILS_CreateElement('input',null);
		ColorOptW.type = "radio";
		ColorOptW.name = "color";
		ColorOptW.value = "colorW";
	}
	

	ColorOptWImg = UTILS_CreateElement('img',null,'color');
	ColorOptWImg.src = "images/invite_white_pawn.png"
	BrW = UTILS_CreateElement('br');

	try
	//Fix radio button for IE
	{
		ColorOptB = document.createElement("<input class='radio' type='radio' name='color'/>")
	}
	catch(err)
	{ //FF
		ColorOptB = UTILS_CreateElement('input',null);
		ColorOptB.type = "radio";
		ColorOptB.name = "color";
		ColorOptB.value = "colorB";
	}

	ColorOptBImg = UTILS_CreateElement('img',null,'color');
	ColorOptBImg.src = "images/invite_black_pawn.png"
	BrB = UTILS_CreateElement('br');
	
	try
	//Fix radio button for IE
	{
		AutoColorOpt = document.createElement("<input class='radio' type='radio' name='color'/>")
	}
	catch(err)
	{ //FF
		AutoColorOpt = UTILS_CreateElement('input',null,'radio');
		AutoColorOpt.type = "radio";
		AutoColorOpt.name = "color";
		AutoColorOpt.value = "auto";
	}

	AutoColorLabel= UTILS_CreateElement("span",null,null,UTILS_GetText("challenge_color_auto"));

	// Select player color
	if (GameParameters != undefined)
	{
		if (GameParameters.Color == "white")
		{
			// Firefox fix
			ColorOptB.checked = true;
			//defaultChecked is used to fix IE radio checked
			ColorOptB.setAttribute("defaultChecked", "true");
		}
		else if (GameParameters.Color == "black")
		{
			// Firefox fix
			ColorOptW.checked = true;
			//defaultChecked is used to fix IE radio checked
			ColorOptW.setAttribute("defaultChecked", "true");
		}
		else
		{
			// Firefox fix
			AutoColorOpt.checked = true;
			//defaultChecked is used to fix IE radio checked
			AutoColorOpt.setAttribute("defaultChecked", "true");
		}
	}
	else 
	{
			// Firefox fix
			AutoColorOpt.checked = true;
			//defaultChecked is used to fix IE radio checked
			AutoColorOpt.setAttribute("defaultChecked", "true");
	}
	//*End Layer 1 Left Elements*
	
	// Layer 1 Right Elements
	L1RightDiv = UTILS_CreateElement('div', 'L1RightDiv');

	CatLabel = UTILS_CreateElement('p', null, null, UTILS_GetText('challenge_category'));
	CatOptLi = UTILS_CreateElement('option', null, null, 'Lightning');
	CatOptLi.value = "lightning";
	CatOptBl = UTILS_CreateElement('option', null, null, 'Blitz');
	CatOptBl.value = "blitz";
	CatOptSt = UTILS_CreateElement('option', null, null, 'Standard');
	CatOptSt.value = "standard";
	CatSelect =	UTILS_CreateElement('select',null,'drop_select');

	CatSelect.appendChild(CatOptLi);
	CatSelect.appendChild(CatOptBl);
	CatSelect.appendChild(CatOptSt);

	CatSelect.onchange = function () 
	{
		Type = CatSelect.options.selectedIndex;
		i=0;
		
		// Remove todos os filhos
		while (TimeSelect.firstChild)
		{
			TimeSelect.removeChild (TimeSelect.firstChild);
		}
		
		// Lightning = 0 
		if (Type == 0)
		{
			for (i=1; i <= 2; i++)
			{
				TimeOpt = UTILS_CreateElement('option',null,null,i);
				TimeOpt.value = i;
				
				TimeSelect.appendChild(TimeOpt);
			}	
		Rating = MainData.GetUserRatingInRoom(UTILS_GetText("room_default"),Oponent,"lightning");
		}

		// Blitz = 1
		else if (Type == 1)
		{
			for (i=3; i <= 10; i++)
			{
				TimeOpt = UTILS_CreateElement('option',null,null,i);
				TimeOpt.value = i;
				
				TimeSelect.appendChild(TimeOpt);
			}	
		Rating = MainData.GetUserRatingInRoom(UTILS_GetText("room_default"),Oponent,"blitz");
		}

		// Standard = 2
		else if (Type == 2)
		{
			for (i=11; i <=30; i++)
			{
				TimeOpt = UTILS_CreateElement('option',null,null,i);
				TimeOpt.value = i;
				
				TimeSelect.appendChild(TimeOpt);
			}	
			TimeOpt = UTILS_CreateElement('option',null,null,"40");
			TimeOpt.value = 40;
			TimeSelect.appendChild(TimeOpt);
			TimeOpt = UTILS_CreateElement('option',null,null,"60");
			TimeOpt.value = 60;
			TimeSelect.appendChild(TimeOpt);
			TimeOpt = UTILS_CreateElement('option',null,null,"120");
			TimeOpt.value = 120;
			TimeSelect.appendChild(TimeOpt);
			TimeOpt = UTILS_CreateElement('option',null,null,"180");
			TimeOpt.value = 180;
			TimeOpt = UTILS_CreateElement('option',null,null,UTILS_GetText("challenge_notime"));
			TimeOpt.value = 190;
			TimeSelect.appendChild(TimeOpt);
			Rating = MainData.GetUserRatingInRoom(UTILS_GetText("room_default"),Oponent,"standard");
		}
	
		Username.removeChild(Username.childNodes[1]);
		RatingLabel = UTILS_CreateElement('span',null,'rating',"Rating: "+Rating);
		Username.appendChild(RatingLabel);
	}

	//* End Layer1 Right Elements*
	
	Br1= UTILS_CreateElement('br');

	//* End Layer1*

	// Layer 2 Elements
	Layer2Div = UTILS_CreateElement('div','Layer2Div');

	// Layer 2 Right Elements
	L2RightDiv = UTILS_CreateElement('div','L2RightDiv');
	IncLabel =	UTILS_CreateElement('p', null, null, UTILS_GetText('challenge_inc_label'));
	IncSelect = UTILS_CreateElement('select', null, 'drop_select');
	IncLabelSeg =	UTILS_CreateElement('span', null, 'italic', UTILS_GetText('challenge_inc_label_seg'));
	IncBr = UTILS_CreateElement('br');
	
	for (i=0; i < 30; i++)
	{
		IncOpt = UTILS_CreateElement("option", null, null, i);
		IncOpt.value = i;

		IncSelect.appendChild(IncOpt);
	}
	
	// Setting the inc received
	if (GameParameters != null)
	{
		IncSelect.selectedIndex = GameParameters.Inc;
	}

	//* End Layer2 Right Elements*
	
	// L2 Left Elements
	L2LeftDiv = UTILS_CreateElement('div','L2LeftDiv','leftDiv');

	TimeLabel =	UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_time_label'));
	TimeLabelMin =	UTILS_CreateElement('span',null,'italic',UTILS_GetText('challenge_time_label_min'));
	TimeBr = UTILS_CreateElement('br');
	TimeSelect = UTILS_CreateElement('select',null,'drop_select');
	
	if (GameParameters != undefined)
	{
		if (GameParameters.Time)
		{
			// Lightning
			if (GameParameters.Time<=2)
			{
				for (i=1; i <= 2; i++)
				{
					TimeOpt = UTILS_CreateElement('option',null,null,i);
					TimeOpt.value = i;

					TimeSelect.appendChild(TimeOpt);
				}	
				CatSelect.options.selectedIndex = 0;

				TimeSelect.options.selectedIndex = GameParameters.Time - 1;
			}
			// Blitz
			else if ((GameParameters.Time>=3) && (GameParameters.Time<=10))
			{
				for (i=3; i <= 10; i++)
				{
					TimeOpt = UTILS_CreateElement('option',null,null,i);
					TimeOpt.value = i;

					TimeSelect.appendChild(TimeOpt);
				}	

				CatSelect.options.selectedIndex = 1;

				TimeSelect.options.selectedIndex = GameParameters.Time - 3;
			}

			// Standart
			else if (GameParameters.Time>=11)
			{
				for (i=11; i <= 30; i++)
				{
					TimeOpt = UTILS_CreateElement('option',null,null,i);
					TimeOpt.value = i;

					TimeSelect.appendChild(TimeOpt);
				}	
				TimeOpt = UTILS_CreateElement('option',null,null,"40");
				TimeOpt.value = 40;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,"60");
				TimeOpt.value = 60;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,"120");
				TimeOpt.value = 120;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,"180");
				TimeOpt.value = 180;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,UTILS_GetText("challenge_notime"));
				TimeOpt.value = 190;
				TimeSelect.appendChild(TimeOpt);

				CatSelect.options.selectedIndex = 2;

				if (GameParameters.Time <= 30)
				{
					TimeSelect.options.selectedIndex = GameParameters.Time - 11;
				}
				else if (GameParameters.Time == 40) 
				{
					TimeSelect.options.selectedIndex = 20;
				}
				else if (GameParameters.Time == 60) 
				{
					TimeSelect.options.selectedIndex = 21;
				}
				else if (GameParameters.Time == 120) 
				{
					TimeSelect.options.selectedIndex = 22;
				}
				else if (GameParameters.Time == 180) 
				{
					TimeSelect.options.selectedIndex = 23;
				}
				if (GameParameters.Time == 190) 
				{
					TimeSelect.options.selectedIndex = 24;
				}
			}
		}
	}
	else
	{
		for (i=3; i <= 10; i++)
		{
			TimeOpt = document.createElement("option");
			TimeOpt.innerHTML = i;
			TimeOpt.value = i;

			TimeSelect.appendChild(TimeOpt);
		}

		CatSelect.options.selectedIndex = 1;
	}

	//* End Layer2 Left Elements*
	Br2= UTILS_CreateElement('br');
	// End Layer 2
	
	// Layer 3
	Layer3Div = UTILS_CreateElement('div','Layer3Div');

	// Private
	PrivateCheckbox =	UTILS_CreateElement('input', null, 'rating_radio');
	PrivateCheckbox.type = "checkbox";
	PrivateCheckbox.name = "private";
	PrivateCheckbox.disabled = true;
	PrivateLabel = UTILS_CreateElement('span',null,'cx',UTILS_GetText('challenge_private'));
	
	// Rating
	RatingCheckbox = UTILS_CreateElement('input',null,'rating_radio');
	RatingCheckbox.type = "checkbox";
	RatingCheckbox.name = "rating";
	RatingCheckbox.checked = true;
	RatingCheckbox.disabled = true;
	RatingLabel = UTILS_CreateElement('span',null,'cx',UTILS_GetText('challenge_rating'));

/* In this version, a game always is rated.
	if (GameParameters != undefined)
	{
		if (GameParameters.Rated == 1)
		{
			RatingCheckbox.checked = true;
		}
		else
		{
			RatingCheckbox.checked = false;
		}
	}
*/

	// Auto-flag
	AutoFlagCheckbox = UTILS_CreateElement('input',null,'rating_radio');
	AutoFlagCheckbox.type = "checkbox";
	AutoFlagCheckbox.name = "autoflag";
	AutoFlagCheckbox.disabled = true;
	AutoFlagLabel = UTILS_CreateElement('span',null,'cx',UTILS_GetText('challenge_auto_flag'));

	Br3 = UTILS_CreateElement('br');
	//*End Layer 3 Elements*

	// Bottom Elements

	ButtonsDiv = UTILS_CreateElement('div', 'ButtonsDiv');

	// Submit the challenge
	Invite = UTILS_CreateElement('input', null, 'button');
	Invite.value = UTILS_GetText('challenge_invite');
	Invite.type = "button";
	Invite.onclick = function () {
		// Checking the color
		if (ColorOptW.checked)
		{
			Color = "white";
		}
		else if (ColorOptB.checked)
		{
			Color = "black";
		}
		else
		{
			//Random Color
			if (Math.round(Math.random()) % 2 == 0)
			{
				Color = "white";
			}
			else
			{
				Color = "black";
			}
		}

		// Rated or unrated?
		if (RatingCheckbox.checked)
		{
			Rated = 1;
		}
		else
		{
			Rated = 0;
		}

		// Create and send the chellenge message
		GAME_SendChallenge(Oponent, Color, TimeSelect.value, IncSelect.value, CatSelect.value, Rated);
	}

	// Accept challenge
	// Only if you receive a challenge
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.value = UTILS_GetText('challenge_accept');
	Accept.type = "button";
	Accept.onclick = function () {
		GAME_AcceptChallenge(MatchId);
	}	

	NewParameters = UTILS_CreateElement('input',null,'button');
	NewParameters.value = UTILS_GetText('challenge_new_parameters');
	NewParameters.type = "button";
	NewParameters.onclick = function () {
		// Checking the color
		if (ColorOptW.checked)
		{
			Color = "white";
		}
		else if (ColorOptB.checked)
		{
			Color = "black";
		}
		else
		{
			//Random Color
			if (Math.round(Math.random()) % 2 == 0)
			{
				Color = "white";
			}
			else
			{
				Color = "black";
			}
		}

		// Rated or unrated?
		if (RatingCheckbox.checked)
		{
			Rated = 1;
		}
		else
		{
			Rated = 0;
		}

		GAME_SendChallenge(Oponent, Color, TimeSelect.value, IncSelect.value, CatSelect.value, Rated, MatchId);
	}

	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.value = UTILS_GetText('challenge_cancel');
	Cancel.type = "button";

	Chat = UTILS_CreateElement('input',null,'button');
	Chat.value = UTILS_GetText('challenge_chat');
	Chat.type = "button";
	Chat.onclick = function () {
		CHAT_OpenChat(Oponent);
	}

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.value = UTILS_GetText('challenge_decline');
	Decline.type = "button";
	Decline.onclick = function () {
		GAME_DeclineChallenge(MatchId);
	}	

	// Appending childs

	// Layer1
	// Left
	L1LeftDiv.appendChild(ColorLabel);
	L1LeftDiv.appendChild(ColorOptW);
	L1LeftDiv.appendChild(ColorOptWImg);
	L1LeftDiv.appendChild(BrW);
	L1LeftDiv.appendChild(ColorOptB);
	L1LeftDiv.appendChild(ColorOptBImg);
	L1LeftDiv.appendChild(BrB);
	L1LeftDiv.appendChild(AutoColorOpt);
	L1LeftDiv.appendChild(AutoColorLabel);
	
	// Right
	L1RightDiv.appendChild(CatLabel);
	L1RightDiv.appendChild(CatSelect);

	Layer1Div.appendChild(L1LeftDiv);
	Layer1Div.appendChild(L1RightDiv);

	// Layer2
	// Left
	L2LeftDiv.appendChild(TimeLabel);
	L2LeftDiv.appendChild(TimeSelect);
	L2LeftDiv.appendChild(TimeLabelMin);
	L2LeftDiv.appendChild(TimeBr);

	// Right
	L2RightDiv.appendChild(IncLabel);
	L2RightDiv.appendChild(IncSelect);
	L2RightDiv.appendChild(IncLabelSeg);
	L2RightDiv.appendChild(IncBr);
	
	Layer2Div.appendChild(L2LeftDiv);
	Layer2Div.appendChild(L2RightDiv);

	// Layer3
	Layer3Div.appendChild(RatingCheckbox);
	Layer3Div.appendChild(RatingLabel);

	Layer3Div.appendChild(PrivateCheckbox);
	Layer3Div.appendChild(PrivateLabel);

	// Disabled
//	Layer3Div.appendChild(AutoFlagCheckbox);
//	Layer3Div.appendChild(AutoFlagLabel);

	// Buttons
	if (GameParameters != undefined)
	{
		ButtonsDiv.appendChild(Accept);
		Buttons.push(Accept);
		ButtonsDiv.appendChild(NewParameters);
		Buttons.push(NewParameters);
		ButtonsDiv.appendChild(Chat);
		Buttons.push(Chat);
		ButtonsDiv.appendChild(Decline);
		Buttons.push(Decline);
	}
	else
	{
		ButtonsDiv.appendChild(Invite);
		Buttons.push(Invite);
		ButtonsDiv.appendChild(Cancel);
		Buttons.push(Cancel);
	}

	// TopDiv
	TopDiv.appendChild(Username);
	if (GameParameters != undefined)
	{
		TopDiv.appendChild(Label);
	}
	

	// Mount Main Div
	Div.appendChild(TopDiv);
	Div.appendChild(Layer1Div);
	Div.appendChild(Br1);
	Div.appendChild(Layer2Div);
	Div.appendChild(Br2);
	Div.appendChild(Layer3Div);
	Div.appendChild(Br3);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons}
}

/**
* Hide challenge list menu
*
* @public
* @return 	bool
* @author 	Ulysses
*/
function INTERFACE_HideChallengeList()
{
	var Node = document.getElementById("ChallengeMenuDiv");
	
	if (!Node)
	{
		return false;
	}
	Node.parentNode.removeChild(Node);
	
	return true;
}
/*
function INTERFACE_ShowChallengeWindow(Oponent, Rating, GameParameters, MatchId)
{
	var Div;

	var TopDiv;
	var Username, RatingLabel, Label;

	var ChalLeftDiv;
	var ColorLabel, ColorOptW, BrW, ColorOptWImg, ColorOptB, ColorOptBImg, BrB, AutoColorOpt, AutoColorLabel ;
	var TimeLabel, TimeSelect, TimeOpt, TimeLabelMin,TimeBr;
	var RatingCheckbox, RatingLabel;

	var ChalRightDiv;
	var CatLabel, CatSelect, CatOptLi, CatOptBl, CatOptSt;
	var IncLabel, IncSelect, IncOpt, IncLabelSeg,IncBr;
	var PrivateCheckbox, PrivateLabel;

	var Br;

	var ButtonsDiv;
	var Invite, Accept, Decline, NewParameters, Cancel, Chat;
	var Buttons = new Array();

	var Type, Color, Rated;
	var i; 

	// Main Div
	Div = UTILS_CreateElement('div', 'ChallengeDiv');
	
	// Top Elments
	TopDiv = UTILS_CreateElement('div', 'TopDiv');
	Username = UTILS_CreateElement('h3', null, null, Oponent);
	RatingLabel = UTILS_CreateElement('span',null,'rating',"Rating: "+Rating);
	Username.appendChild(RatingLabel);
	Label = UTILS_CreateElement('p', null, 'label_information', UTILS_GetText('challenge_information'));
	
	// Right Elements

	ChalRightDiv = UTILS_CreateElement('div', 'ChalRightDiv');

	CatLabel = UTILS_CreateElement('p', null, null, UTILS_GetText('challenge_category'));
	CatOptLi = UTILS_CreateElement('option', null, null, 'Lightning');
	CatOptLi.value = "lightning";
	CatOptBl = UTILS_CreateElement('option', null, null, 'Blitz');
	CatOptBl.value = "blitz";
	CatOptSt = UTILS_CreateElement('option', null, null, 'Standard');
	CatOptSt.value = "standard";
	CatSelect =	UTILS_CreateElement('select',null,'drop_select');

	CatSelect.appendChild(CatOptLi);
	CatSelect.appendChild(CatOptBl);
	CatSelect.appendChild(CatOptSt);

	CatSelect.onchange = function () 
	{
		Type = CatSelect.options.selectedIndex;
		i=0;
		
		// Remove todos os filhos
		while (TimeSelect.firstChild)
		{
			TimeSelect.removeChild (TimeSelect.firstChild);
		}
		
		// Lightning = 0 
		if (Type == 0)
		{
			for (i=1; i <= 2; i++)
			{
				TimeOpt = UTILS_CreateElement('option',null,null,i);
				TimeOpt.value = i;
				
				TimeSelect.appendChild(TimeOpt);
			}	
		Rating = MainData.GetUserRatingInRoom('geral',Oponent,"lightning");
		}

		// Blitz = 1
		else if (Type == 1)
		{
			for (i=3; i <= 10; i++)
			{
				TimeOpt = UTILS_CreateElement('option',null,null,i);
				TimeOpt.value = i;
				
				TimeSelect.appendChild(TimeOpt);
			}	
		Rating = MainData.GetUserRatingInRoom('geral',Oponent,"blitz");
		}

		// Standard = 2
		else if (Type == 2)
		{
			for (i=11; i <=30; i++)
			{
				TimeOpt = UTILS_CreateElement('option',null,null,i);
				TimeOpt.value = i;
				
				TimeSelect.appendChild(TimeOpt);
			}	
			TimeOpt = UTILS_CreateElement('option',null,null,"40");
			TimeOpt.value = 40;
			TimeSelect.appendChild(TimeOpt);
			TimeOpt = UTILS_CreateElement('option',null,null,"60");
			TimeOpt.value = 60;
			TimeSelect.appendChild(TimeOpt);
			TimeOpt = UTILS_CreateElement('option',null,null,"120");
			TimeOpt.value = 120;
			TimeSelect.appendChild(TimeOpt);
			TimeOpt = UTILS_CreateElement('option',null,null,"180");
			TimeOpt.value = 180;
			TimeOpt = UTILS_CreateElement('option',null,null,UTILS_GetText("challenge_notime"));
			TimeOpt.value = 190;
			TimeSelect.appendChild(TimeOpt);
			Rating = MainData.GetUserRatingInRoom('geral',Oponent,"standard");
		}
	
		Username.removeChild(Username.childNodes[1]);
		RatingLabel = UTILS_CreateElement('span',null,'rating',"Rating: "+Rating);
		Username.appendChild(RatingLabel);
	}

	IncLabel =	UTILS_CreateElement('p', null, null, UTILS_GetText('challenge_inc_label'));
	IncSelect = UTILS_CreateElement('select', null, 'drop_select');
	IncLabelSeg =	UTILS_CreateElement('span', null, 'italic', UTILS_GetText('challenge_inc_label_seg'));
	IncBr = UTILS_CreateElement('br');
	
	for (i=0; i < 30; i++)
	{
		IncOpt = UTILS_CreateElement("option", null, null, i);
		IncOpt.value = i;

		IncSelect.appendChild(IncOpt);
	}

	// Setting the inc received
	if (GameParameters != null)
	{
		IncSelect.selectedIndex = GameParameters.Inc;
	}

	PrivateCheckbox =	UTILS_CreateElement('input', null, 'rating_radio');
	PrivateCheckbox.type = "checkbox";
	PrivateCheckbox.name = "private";
	PrivateLabel = UTILS_CreateElement('span',null,null,UTILS_GetText('challenge_private'));
	
	// Left Elements

	ChalLeftDiv = UTILS_CreateElement('div','ChalLeftDiv');

	ColorLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_pieces'));


	try
	//Fix radio button for IE
	{
		ColorOptW = document.createElement('<input class="radio" type="radio" name="color"/>');
	}
	catch(err)
	{ //FF
		ColorOptW =	UTILS_CreateElement('input',null);
		ColorOptW.type = "radio";
		ColorOptW.name = "color";
		ColorOptW.value = "colorW";
	}
	

	ColorOptWImg = UTILS_CreateElement('img',null,'color');
	ColorOptWImg.src = "images/invite_white_pawn.png"
	BrW = UTILS_CreateElement('br');

	try
	//Fix radio button for IE
	{
		ColorOptB = document.createElement("<input class='radio' type='radio' name='color'/>")
	}
	catch(err)
	{ //FF
		ColorOptB = UTILS_CreateElement('input',null);
		ColorOptB.type = "radio";
		ColorOptB.name = "color";
		ColorOptB.value = "colorB";
	}

	ColorOptBImg = UTILS_CreateElement('img',null,'color');
	ColorOptBImg.src = "images/invite_black_pawn.png"
	BrB = UTILS_CreateElement('br');
	
	try
	//Fix radio button for IE
	{
		AutoColorOpt = document.createElement("<input class='radio' type='radio' name='color'/>")
	}
	catch(err)
	{ //FF
		AutoColorOpt = UTILS_CreateElement('input',null,'radio');
		AutoColorOpt.type = "radio";
		AutoColorOpt.name = "color";
		AutoColorOpt.value = "auto";
	}

	AutoColorLabel= UTILS_CreateElement("span",null,null,UTILS_GetText("challenge_color_auto"));

	// Select player color
	if (GameParameters != undefined)
	{
		if (GameParameters.Color == "white")
		{
			// Firefox fix
			ColorOptB.checked = true;
			//defaultChecked is used to fix IE radio checked
			ColorOptB.setAttribute("defaultChecked", "true");
		}
		else if (GameParameters.Color == "black")
		{
			// Firefox fix
			ColorOptW.checked = true;
			//defaultChecked is used to fix IE radio checked
			ColorOptW.setAttribute("defaultChecked", "true");
		}
	}

	TimeLabel =	UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_time_label'));
	TimeLabelMin =	UTILS_CreateElement('span',null,'italic',UTILS_GetText('challenge_time_label_min'));
	TimeBr = UTILS_CreateElement('br');
	TimeSelect = UTILS_CreateElement('select',null,'drop_select');
	
	if (GameParameters != undefined)
	{
		if (GameParameters.Time)
		{
			// Lightning
			if (GameParameters.Time<=2)
			{
				for (i=1; i <= 2; i++)
				{
					TimeOpt = UTILS_CreateElement('option',null,null,i);
					TimeOpt.value = i;

					TimeSelect.appendChild(TimeOpt);
				}	
				CatSelect.options.selectedIndex = 0;

				TimeSelect.options.selectedIndex = GameParameters.Time - 1;
			}
			// Blitz
			else if ((GameParameters.Time>=3) && (GameParameters.Time<=10))
			{
				for (i=3; i <= 10; i++)
				{
					TimeOpt = UTILS_CreateElement('option',null,null,i);
					TimeOpt.value = i;

					TimeSelect.appendChild(TimeOpt);
				}	

				CatSelect.options.selectedIndex = 1;

				TimeSelect.options.selectedIndex = GameParameters.Time - 3;
			}

			// Standart
			else if (GameParameters.Time>=11)
			{
				for (i=11; i <= 30; i++)
				{
					TimeOpt = UTILS_CreateElement('option',null,null,i);
					TimeOpt.value = i;

					TimeSelect.appendChild(TimeOpt);
				}	
				TimeOpt = UTILS_CreateElement('option',null,null,"40");
				TimeOpt.value = 40;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,"60");
				TimeOpt.value = 60;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,"120");
				TimeOpt.value = 120;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,"180");
				TimeOpt.value = 180;
				TimeSelect.appendChild(TimeOpt);
				TimeOpt = UTILS_CreateElement('option',null,null,UTILS_GetText("challenge_notime"));
				TimeOpt.value = 190;
				TimeSelect.appendChild(TimeOpt);

				CatSelect.options.selectedIndex = 2;

				if (GameParameters.Time <= 30)
				{
					TimeSelect.options.selectedIndex = GameParameters.Time - 11;
				}
				else if (GameParameters.Time == 40) 
				{
					TimeSelect.options.selectedIndex = 20;
				}
				else if (GameParameters.Time == 60) 
				{
					TimeSelect.options.selectedIndex = 21;
				}
				else if (GameParameters.Time == 120) 
				{
					TimeSelect.options.selectedIndex = 22;
				}
				else if (GameParameters.Time == 180) 
				{
					TimeSelect.options.selectedIndex = 23;
				}
				if (GameParameters.Time == 190) 
				{
					TimeSelect.options.selectedIndex = 24;
				}
			}
		}
	}
	else
	{
		for (i=3; i <= 10; i++)
		{
			TimeOpt = document.createElement("option");
			TimeOpt.innerHTML = i;
			TimeOpt.value = i;

			TimeSelect.appendChild(TimeOpt);
		}

		CatSelect.options.selectedIndex = 1;
	}


	RatingCheckbox = UTILS_CreateElement('input',null,'rating_radio');
	RatingCheckbox.type = "checkbox";
	RatingCheckbox.name = "rating";
	RatingLabel = UTILS_CreateElement('span',null,null,UTILS_GetText('challenge_rating'));

	if (GameParameters != undefined)
	{
		if (GameParameters.Rated == 1)
		{
			RatingCheckbox.checked = true;
		}
		else
		{
			RatingCheckbox.checked = false;
		}
	}

	// Bottom Elements
	Br = UTILS_CreateElement('br');

	ButtonsDiv = UTILS_CreateElement('div', 'ButtonsDiv');

	// Submit the challenge
	Invite = UTILS_CreateElement('input', null, 'button');
	Invite.value = UTILS_GetText('challenge_invite');
	Invite.type = "button";
	Invite.onclick = function () {
		// Checking the color
		if (ColorOptW.checked)
		{
			Color = "white";
		}
		else if (ColorOptB.checked)
		{
			Color = "black";
		}
		else
		{
			//Random Color
			if (Math.round(Math.random()) % 2 == 0)
			{
				Color = "white";
			}
			else
			{
				Color = "black";
			}
		}

		// Rated or unrated?
		if (RatingCheckbox.checked)
		{
			Rated = 1;
		}
		else
		{
			Rated = 0;
		}

		// Create and send the chellenge message
		GAME_SendChallenge(Oponent, Color, TimeSelect.value, IncSelect.value, CatSelect.value, Rated);
	}

	// Accept challenge
	// Only if you receive a challenge
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.value = UTILS_GetText('challenge_accept');
	Accept.type = "button";
	Accept.onclick = function () {
		GAME_AcceptChallenge(MatchId);
	}	

	NewParameters = UTILS_CreateElement('input',null,'button');
	NewParameters.value = UTILS_GetText('challenge_new_parameters');
	NewParameters.type = "button";
	NewParameters.onclick = function () {
		// Checking the color
		if (ColorOptW.checked)
		{
			Color = "white";
		}
		else if (ColorOptB.checked)
		{
			Color = "black";
		}
		else
		{
			//Random Color
			if (Math.round(Math.random()) % 2 == 0)
			{
				Color = "white";
			}
			else
			{
				Color = "black";
			}
		}

		// Rated or unrated?
		if (RatingCheckbox.checked)
		{
			Rated = 1;
		}
		else
		{
			Rated = 0;
		}

		GAME_SendChallenge(Oponent, Color, TimeSelect.value, IncSelect.value, CatSelect.value, Rated, MatchId);
	}

	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.value = UTILS_GetText('challenge_cancel');
	Cancel.type = "button";

	Chat = UTILS_CreateElement('input',null,'button');
	Chat.value = UTILS_GetText('challenge_chat');
	Chat.type = "button";

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.value = UTILS_GetText('challenge_decline');
	Decline.type = "button";
	Decline.onclick = function () {
		GAME_DeclineChallenge(MatchId);
	}	

	// Appending childs
	// Left
	ChalLeftDiv.appendChild(ColorLabel);
	ChalLeftDiv.appendChild(ColorOptW);
	ChalLeftDiv.appendChild(ColorOptWImg);
	ChalLeftDiv.appendChild(BrW);
	ChalLeftDiv.appendChild(ColorOptB);
	ChalLeftDiv.appendChild(ColorOptBImg);
	ChalLeftDiv.appendChild(BrB);
	ChalLeftDiv.appendChild(AutoColorOpt);
	ChalLeftDiv.appendChild(AutoColorLabel);

	ChalLeftDiv.appendChild(TimeLabel);
	ChalLeftDiv.appendChild(TimeSelect);
	ChalLeftDiv.appendChild(TimeLabelMin);
	ChalLeftDiv.appendChild(TimeBr);

	ChalLeftDiv.appendChild(RatingCheckbox);
	ChalLeftDiv.appendChild(RatingLabel);

	// Right
	ChalRightDiv.appendChild(CatLabel);
	ChalRightDiv.appendChild(CatSelect);

	ChalRightDiv.appendChild(IncLabel);
	ChalRightDiv.appendChild(IncSelect);
	ChalRightDiv.appendChild(IncLabelSeg);
	ChalRightDiv.appendChild(IncBr);

	ChalRightDiv.appendChild(PrivateCheckbox);
	ChalRightDiv.appendChild(PrivateLabel);

	// Buttons
	if (GameParameters != undefined)
	{
		ButtonsDiv.appendChild(Accept);
		Buttons.push(Accept);
		ButtonsDiv.appendChild(NewParameters);
		Buttons.push(NewParameters);
		ButtonsDiv.appendChild(Chat);
		Buttons.push(Chat);
		ButtonsDiv.appendChild(Decline);
		Buttons.push(Decline);
	}
	else
	{
		ButtonsDiv.appendChild(Invite);
		Buttons.push(Invite);
		ButtonsDiv.appendChild(Cancel);
		Buttons.push(Cancel);
	}

	// TopDiv
	TopDiv.appendChild(Username);
	if (GameParameters != undefined)
	{
		TopDiv.appendChild(Label);
	}
	

	// Mount Main Div
	Div.appendChild(TopDiv);
	Div.appendChild(ChalLeftDiv);
	Div.appendChild(ChalRightDiv);
	Div.appendChild(Br);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons}
}
*/
