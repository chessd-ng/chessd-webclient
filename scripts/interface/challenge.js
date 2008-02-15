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
* 
*/
function INTERFACE_ShowChallengeWindow(Oponent, GameParameters)
{
	var Div;

	var Username, Label;

	var ChalLeftDiv;
	var ColorLabel, ColorOptW, ColorOptWImg, ColorOptB, ColorOptBImg ;
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

	var Type;
	var i;

	// Main Div
	Div = UTILS_CreateElement('div','ChallengeDiv');
	
	// Top Elments
	Username = UTILS_CreateElement('h3',null,null,Oponent);
	Label = UTILS_CreateElement('p',null,'label_information',UTILS_GetText('challenge_information'));
	
	// Right Elements

	ChalRightDiv = UTILS_CreateElement('div','ChalRightDiv');

	CatLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_category'));
	CatOptLi = UTILS_CreateElement('option',null,null,'Lightning');
	CatOptLi.value = "Lightning";
	CatOptBl = UTILS_CreateElement('option',null,null,'Blitz');
	CatOptBl.value = "Blitz";
	CatOptSt = UTILS_CreateElement('option',null,null,'Stardard');
	CatOptSt.value = "Stardarid";
	CatSelect =	UTILS_CreateElement('select','');

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
		}

		// Standart = 2
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
		}
	}


	IncLabel =	UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_inc_label'));
	IncSelect = UTILS_CreateElement('select',null,'time_select');
	IncLabelSeg =	UTILS_CreateElement('span',null,'italic',UTILS_GetText('challenge_inc_label_seg'));
	IncBr = UTILS_CreateElement('br');
	
	for (i=0; i < 30; i++)
	{
		IncOpt = UTILS_CreateElement("option",null,null,i);
		IncOpt.value = i;

		IncSelect.appendChild(IncOpt);
	}

	PrivateCheckbox =	UTILS_CreateElement('input',null,'rating_radio');
	PrivateCheckbox.type = "checkbox";
	PrivateCheckbox.name = "private";
	PrivateLabel = UTILS_CreateElement('span',null,null,UTILS_GetText('challenge_private'));
	
	// Left Elements

	ChalLeftDiv = UTILS_CreateElement('div','ChalLeftDiv');

	ColorLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_pieces'));
	ColorOptW =	UTILS_CreateElement('input','');
	ColorOptW.type = "radio";
	ColorOptW.name = "color";
	ColorOptW.value = "color";

	ColorOptWImg = UTILS_CreateElement('img','');
	ColorOptWImg.src = "images/invite_white_pawn.png"
	
	ColorOptB =	UTILS_CreateElement('input','');
	ColorOptB.type = "radio";
	ColorOptB.name = "color";
	ColorOptB.value = "color";

	ColorOptBImg = UTILS_CreateElement('img','');
	ColorOptBImg.src = "images/invite_black_pawn.png"
	
	// Marca o radio referente a cor
	if (GameParameters != undefined)
	{
		if (GameParameters.Color == "white")
		{
			ColorOptB.checked = true;
		}
		else if (GameParameters.Color == "black")
		{
			ColorOptW.checked = true;
		}
	}

	TimeLabel =	UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_time_label'));
	TimeLabelMin =	UTILS_CreateElement('span',null,'italic',UTILS_GetText('challenge_time_label_min'));
	TimeBr = UTILS_CreateElement('br');
	TimeSelect = UTILS_CreateElement('select','','time_select');
	
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

				TimeSelect.options.selectedIndex = Time - 3;
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

	if (GameParameters != undefined)
	{
		ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv',"offer");
	}
	else
	{
		ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv',"invite");
	}

	Invite = UTILS_CreateElement('input',null,'button90');
	Invite.value= UTILS_GetText('challenge_invite');
	Invite.type = "button";

	Accept = UTILS_CreateElement('input',null,'button65');
	Accept.value = UTILS_GetText('challenge_accept');
	Accept.type = "button";

	NewParameters = UTILS_CreateElement('input',null,'button65');
	NewParameters.value = UTILS_GetText('challenge_new_parameters');
	NewParameters.type = "button";

	Cancel = UTILS_CreateElement('input',null,'button90');
	Cancel.value = UTILS_GetText('challenge_cancel');
	Cancel.type = "button";

	Chat = UTILS_CreateElement('input',null,'button65');
	Chat.value = UTILS_GetText('challenge_chat');
	Chat.type = "button";

	Decline = UTILS_CreateElement('input',null,'button65');
	Decline.value = UTILS_GetText('challenge_decline');
	Decline.type = "button";

	// Appending childs
	// Left
	ChalLeftDiv.appendChild(ColorLabel);
	ChalLeftDiv.appendChild(ColorOptW);
	ChalLeftDiv.appendChild(ColorOptWImg);
	ChalLeftDiv.appendChild(ColorOptB);
	ChalLeftDiv.appendChild(ColorOptBImg);

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

	// Mount Main Div
	Div.appendChild(Username);
	if (GameParameters != undefined)
	{
		Div.appendChild(Label);
	}
	Div.appendChild(ChalLeftDiv);
	Div.appendChild(ChalRightDiv);
	Div.appendChild(Br);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons}
}
