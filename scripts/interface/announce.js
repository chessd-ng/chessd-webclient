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

	var PieceDiv;
	var ColorLabel, ColorOptW,BrW, ColorOptWImg, ColorOptB, ColorOptBImg,BrB, AutoColorOpt, AutoColorLabel, RandomColorOptImg, BrR;

	var CategoryDiv;
	var CatLabel, CatSelect, CatOptLi, CatOptBl, CatOptSt;

	var Layer1Div;
	var L1LeftDiv;
	var TimeLabel, TimeSelect, TimeOpt, TimeLabelMin,TimeBr;
	var L1RightDiv;
	var IncLabel, IncSelect, IncOpt, IncLabelSeg,IncBr;

	var Layer2Div;
	var L2RightDiv, L2LeftDiv;
	var RatingCheckbox, RatingLabel;
	var PrivateCheckbox, PrivateLabel;
	var AutoFlagCheckbox, AutoFlagLabel;
	var Br2;

	var IntervalDiv;
	var IntervalLabel, Br3, FromLabel, FromInput, ToLabel, ToInput;
	var FromDiv, ToDiv;
	var FormatLabel1,FormatLabel2;

	var ButtonsDiv;
	var Announce, Cancel;
	var Buttons = new Array();

	var Type, Color;
	var i; 

	// Main Div
	Div = UTILS_CreateElement('div', 'AnnounceDiv');
	
	// Piece Elements
	PieceDiv = UTILS_CreateElement('div', 'PieceDiv');

	ColorLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('announce_pieces'));

	try
	//Fix radio button for IE
	{
		ColorOptW = document.createElement('<input type="radio" name="color" />');
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

	try
	//Fix radio button for IE
	{
		ColorOptB = document.createElement("<input type='radio' name='color' />")
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
	
	try
	//Fix radio button for IE
	{
		AutoColorOpt = document.createElement("<input type='radio' name='color' />")
	}
	catch(err)
	{ //FF
		AutoColorOpt = UTILS_CreateElement('input',null);
		AutoColorOpt.type = "radio";
		AutoColorOpt.name = "color";
		AutoColorOpt.value = "auto";
	}

	RandomColorOptImg = UTILS_CreateElement('img',null,'auto_img');
	RandomColorOptImg.src = "images/random.png"
	
	AutoColorLabel= UTILS_CreateElement("span",null,'color_label',UTILS_GetText("challenge_color_auto"));

	// Select player color
	// Firefox fix
	AutoColorOpt.checked = true;
	//defaultChecked is used to fix IE radio checked
	AutoColorOpt.setAttribute("defaultChecked", "true");
	//*End PieceDiv Elements*
	
	// Category Div Elements
	CategoryDiv = UTILS_CreateElement('div', 'CategoryDiv');

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
	}

	//* End Category Right Elements*
	
	// Layer 1 Elements
	Layer1Div = UTILS_CreateElement('div','Layer1Div');

	// Layer 1 Right Elements
	L1RightDiv = UTILS_CreateElement('div','L1RightDiv');
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
	
	//* End Layer1 Right Elements*
	
	// L1 Left Elements
	L1LeftDiv = UTILS_CreateElement('div','L1LeftDiv','leftDiv');

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

	//* End Layer1 Left Elements*
	// End Layer 1
	
	// Layer 2
	Layer2Div = UTILS_CreateElement('div','Layer2Div');

	// Private
	L2RightDiv = UTILS_CreateElement('div','L2RightDiv');
	try
	{
		PrivateCheckbox = document.createElement("<input class='rating_radio' type='checkbox' name='private' disabled='disabled' />");
	}
	catch(err)
	{
		PrivateCheckbox =	UTILS_CreateElement('input', null, 'rating_radio');
		PrivateCheckbox.type = "checkbox";
		PrivateCheckbox.name = "private";
		PrivateCheckbox.disabled = true;
	}
	PrivateLabel = UTILS_CreateElement('span',null,'cx',UTILS_GetText('challenge_private'));
	
	// Rating
	L2LeftDiv = UTILS_CreateElement('div','L2LeftDiv','leftDiv');
	try
	{
		RatingCheckbox = document.createElement("<input class='rating_radio' checked='checked'  type='checkbox' name='rating' />");
	}
	catch(err)
	{
		RatingCheckbox = UTILS_CreateElement('input',null,'rating_radio');
		RatingCheckbox.type = "checkbox";
		RatingCheckbox.name = "rating";
		RatingCheckbox.checked = true;
	}

	RatingLabel = UTILS_CreateElement('span',null,'cx',UTILS_GetText('challenge_rating'));

	//*End Layer 2 Elements*

	// Interval Elements

	IntervalDiv= UTILS_CreateElement('div','IntervalDiv');

	// Date Form
	FromDiv = UTILS_CreateElement('div','FromDiv', 'leftDiv');
	ToDiv = UTILS_CreateElement('div','ToDiv');
	IntervalLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('announce_rating_interval'));

	FromLabel	= UTILS_CreateElement('span',null,'bold',UTILS_GetText('oldgame_from'));
	FromInput	= UTILS_CreateElement('input');
	FromInput.size = "5";
	FromInput.maxLength = "4";
	FormatLabel1 = UTILS_CreateElement('span',null,'format',UTILS_GetText('announce_rating_example'));

	ToLabel	= UTILS_CreateElement('span',null,'bold',UTILS_GetText('oldgame_to'));
	ToInput = UTILS_CreateElement('input');
	ToInput.size = "5";
	ToInput.maxLength = "4";
	FormatLabel2 = UTILS_CreateElement('span',null,'format',UTILS_GetText('announce_rating_example'));

	Br2 = UTILS_CreateElement("br");
	Br3 = UTILS_CreateElement("br");

	// Buttons Elements
	ButtonsDiv = UTILS_CreateElement('div', 'ButtonsDiv');

	// Submit the challenge
	Announce = UTILS_CreateElement('input', null, 'button');
	Announce.value = UTILS_GetText("challenge_announce_match");
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
		ANNOUNCE_SendAnnounce(Username, Color, TimeSelect.value, IncSelect.value, CatSelect.value, Rated, FromInput.value, ToInput.value);
	}

	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.value = UTILS_GetText('window_cancel');
	Cancel.type = "button";

	// Appending childs

	// PieceDiv
	PieceDiv.appendChild(ColorLabel);
	PieceDiv.appendChild(ColorOptW);
	PieceDiv.appendChild(ColorOptWImg);
	PieceDiv.appendChild(ColorOptB);
	PieceDiv.appendChild(ColorOptBImg);
	PieceDiv.appendChild(AutoColorOpt);
	PieceDiv.appendChild(RandomColorOptImg);
	PieceDiv.appendChild(AutoColorLabel);
	
	// CategoryDiv
	CategoryDiv.appendChild(CatLabel);
	CategoryDiv.appendChild(CatSelect);

	// Layer1
	// Left
	L1LeftDiv.appendChild(TimeLabel);
	L1LeftDiv.appendChild(TimeSelect);
	L1LeftDiv.appendChild(TimeLabelMin);
	L1LeftDiv.appendChild(TimeBr);

	// Right
	L1RightDiv.appendChild(IncLabel);
	L1RightDiv.appendChild(IncSelect);
	L1RightDiv.appendChild(IncLabelSeg);
	L1RightDiv.appendChild(IncBr);
	
	Layer1Div.appendChild(L1LeftDiv);
	Layer1Div.appendChild(L1RightDiv);

	// Layer2
	L2LeftDiv.appendChild(RatingCheckbox);
	L2LeftDiv.appendChild(RatingLabel);

	L2RightDiv.appendChild(PrivateCheckbox);
	L2RightDiv.appendChild(PrivateLabel);

	Layer2Div.appendChild(L2LeftDiv);
	Layer2Div.appendChild(L2RightDiv);
	// Disabled
//	Layer3Div.appendChild(AutoFlagCheckbox);
//	Layer3Div.appendChild(AutoFlagLabel);
	
	// Interval Div
	IntervalDiv.appendChild(IntervalLabel);

	FromDiv.appendChild(FromLabel);
	FromDiv.appendChild(FromInput);
	FromDiv.appendChild(Br2);
	FromDiv.appendChild(FormatLabel1);

	ToDiv.appendChild(ToLabel);
	ToDiv.appendChild(ToInput);
	ToDiv.appendChild(Br3);
	ToDiv.appendChild(FormatLabel2);

	IntervalDiv.appendChild(FromDiv);
	IntervalDiv.appendChild(ToDiv);
	// End Interval

	ButtonsDiv.appendChild(Announce);
	Buttons.push(Announce);
	ButtonsDiv.appendChild(Cancel);
	Buttons.push(Cancel);


	// Mount Main Div
	Div.appendChild(PieceDiv);
	Div.appendChild(CategoryDiv);
	Div.appendChild(Layer1Div);
	Div.appendChild(Layer2Div);
	Div.appendChild(IntervalDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons}
}
