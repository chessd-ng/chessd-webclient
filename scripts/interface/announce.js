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
* @param Username					Username's nickname 
* @param Rating						Username's current rating
* @return									Div; Array
* @see										WINDOW_Challenge();
* @author									Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_AnnounceWindow(Username, Rating)
{
	var Div;

	var TopDiv;
	var UsernameH3, RatingLabel, Label;
	var RatingTmp;

	var Layer1Div;
	var L1LeftDiv;
	var ColorLabel, ColorOptW,BrW, ColorOptWImg, ColorOptB, ColorOptBImg,BrB, AutoColorOpt, AutoColorLabel, RandomColorOptImg, BrR;
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
	var Announce, Cancel;
	var Buttons = new Array();

	var Type, Color;
	var i; 

	// Main Div
	Div = UTILS_CreateElement('div', 'AnnounceDiv');
	
	// Top Elments
	TopDiv = UTILS_CreateElement('div', 'TopDiv');
	UsernameH3 = UTILS_CreateElement('h3', null, null, Username);
	RatingLabel = UTILS_CreateElement('span',null,'rating',"Rating: "+Rating);
	UsernameH3.appendChild(RatingLabel);
	Label = UTILS_CreateElement('p', null, 'label_information', UTILS_GetText('challenge_information'));
	
	// Layer1 Elements

	Layer1Div = UTILS_CreateElement('div', 'Layer1Div');

	// Layer 1 Left Elements
	L1LeftDiv = UTILS_CreateElement('div', 'L1LeftDiv','leftDiv');

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
	

	ColorLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_my_pieces'));

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

	RandomColorOptImg = UTILS_CreateElement('img',null,'color');
	RandomColorOptImg.src = "images/random.png"
	BrR = UTILS_CreateElement('br');
	
//	AutoColorLabel= UTILS_CreateElement("span",null,null,UTILS_GetText("challenge_color_auto"));

	// Select player color
	// Firefox fix
	AutoColorOpt.checked = true;
	//defaultChecked is used to fix IE radio checked
	AutoColorOpt.setAttribute("defaultChecked", "true");
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
		//RatingTmp = MainData.GetUserRatingInRoom(MainData.RoomDefault,Username,"lightning");
		RatingTmp = Rating.Lightning;
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
		//RatingTmp = MainData.GetUserRatingInRoom(MainData.RoomDefault, Username, "blitz");
			RatingTmp = Rating.Blitz;
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
			RatingTmp = Rating.Standard;
		}
	
		UsernameH3.removeChild(UsernameH3.childNodes[1]);
		RatingLabel = UTILS_CreateElement('span',null,'rating',"Rating: "+RatingTmp);
		UsernameH3.appendChild(RatingLabel);
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
	
	//* End Layer2 Right Elements*
	
	// L2 Left Elements
	L2LeftDiv = UTILS_CreateElement('div','L2LeftDiv','leftDiv');

	TimeLabel =	UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_time_label'));
	TimeLabelMin =	UTILS_CreateElement('span',null,'italic',UTILS_GetText('challenge_time_label_min'));
	TimeBr = UTILS_CreateElement('br');
	TimeSelect = UTILS_CreateElement('select',null,'drop_select');
	
	for (i=3; i <= 10; i++)
	{
		TimeOpt = document.createElement("option");
		TimeOpt.innerHTML = i;
		TimeOpt.value = i;

		TimeSelect.appendChild(TimeOpt);
	}

	CatSelect.options.selectedIndex = 1;

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
	try
	{
		RatingCheckbox = document.createElement("<input class='rating_radio' checked='checked'  type='checkbox' name='rating'/>")
	}
	catch(err)
	{
		RatingCheckbox = UTILS_CreateElement('input',null,'rating_radio');
		RatingCheckbox.type = "checkbox";
		RatingCheckbox.name = "rating";
		RatingCheckbox.checked = true;
	}

	RatingLabel = UTILS_CreateElement('span',null,'cx',UTILS_GetText('challenge_rating'));

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
	Announce = UTILS_CreateElement('input', null, 'button');
	Announce.value = "Announce";
	Announce.type = "button";
	Announce.onclick = function () {
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
			Color = "";
		}

		// Rated or unrated?
		if (RatingCheckbox.checked)
		{
			Rated = "true";
		}
		else
		{
			Rated = "false";
		}

		// Create and send the chellenge message
		ANNOUNCE_SendAnnounce(Username, Color, TimeSelect.value, IncSelect.value, CatSelect.value, Rated);
	}

	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.value = UTILS_GetText('window_cancel');
	Cancel.type = "button";

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
	L1LeftDiv.appendChild(RandomColorOptImg);
	L1LeftDiv.appendChild(BrR);
//	L1LeftDiv.appendChild(AutoColorLabel);
	
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

	ButtonsDiv.appendChild(Announce);
	Buttons.push(Announce);
	ButtonsDiv.appendChild(Cancel);
	Buttons.push(Cancel);

	// TopDiv
	TopDiv.appendChild(UsernameH3);
	

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

