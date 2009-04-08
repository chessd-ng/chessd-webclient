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
* @file		interface/tourney.js
* @brief	Contains all functions to create and manage tourney elements
*/

/**
* @brief	Create elements to create tourney window content
*
* @return	Tourney main HTML DOM Div and Buttons array
* @author	Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowCreateTourneyWindow()
{
	var Div;

	var DefaultDiv;

	var TNameDiv;
	var TNameLeftDiv;
	var TNameLabel;
	var TNameRightDiv;
	var TNameInput, Br, TNameCharCount;

	var CatTimeDiv;
	var CatLeftDiv, CatRightDiv;
	var CatLabel, CatOptLi, CatOptBl, CatOptSt, CatOptUt, CatSelect;
	var TimeLeftDiv, TimeRightDiv;
	var TimeLabel, TimeLabelMin, TimeSelect, TimeOpt;

	var RoundDiv;
	var RoundRightDiv, RoundLeftDiv;
	var RoundLabel;
	var AutoLabel, AutoRadio, AutoHelpLabel, DefineLabel, DefineRadio, DefineSelect, DefineOpt;

	var DateInitDiv;
	var DateInitLeftDiv, DateInitRightDiv;
	var DateInitLabel;

	var DateDiv;
	var DateRightDiv, DateLeftDiv;
	var DateLabel, DateInput, DateBr, DateFormatLabel;

	var HourDiv;
	var HourRightDiv, HourLeftDiv;
	var HourLabel, HourInput, HourBr, HourFormatLabel;
	
	var AdvancedLabelDiv;
	var AdvancedLabel;

	var AdvancedDiv;

	var DescDiv;
	var DescLeftDiv, DescRightDiv;
	var DescLabel, DescBr, DescTextArea, DescCounterLabel;

	var SubscribeDiv;
	var SubscribeRightDiv, SubscribeLeftDiv;
	var SubscribeLabel, SubscribeCheckbox, SubscribeInput;

	var IntervalDiv;
	var IntervalRightDiv, IntervalLeftDiv;
	var IntervalCheckbox, IntervalLabel;
	var FromDiv;
	var FromLeftDiv, FromRightDiv;
	var FromLabel,FromInput, FromBr, FormatLabel1;
	var ToDiv;
	var ToLeftDiv, ToRightDiv;
	var ToLabel,ToInput, ToBr, FormatLabel2;

	var RestrictDiv;
	var RestrictRightDiv, RestrictLeftDiv;
	var RestrictLabel, RestrictCheckbox, RestrictInput, RestrictPasswd;

	var WaitTimeDiv;
	var WaitTimeRightDiv, WaitTimeLeftDiv;
	var WaitTimeLabel, WaitTimeCheckbox, WaitTimeInput, WaitTimeHelpLabel, WaitTimeMinLabel;

	var SubmitPeriodDiv
	var SubmitPeriodLeftDiv;
	var SubmitPeriodCheckbox, SubmitPeriodLabel;

	var SubmitPeriodRightDiv;
	var SPFromDiv;
	var SPFromLeftDiv, SPFromRightDiv;
	var SPFromLabel;
	var SPFromDateDiv, SPFromHourDiv;
	var SPFromDateInput ,SPFromDateBr, SPFromDateFormatLabel;
	var SPFromHourInput, SPFromHourBr, SPFromHourFormatLabel;
	var SPBr;
	var SPToDiv;
	var SPToLeftDiv, SPToRightDiv;
	var SPToLabel;
	var SPToDateDiv, SPToHourDiv;
	var SPToDateInput, SPToDateBr, SPToDateFormatLabel;
	var SPToHourInput, SPToHourBr, SPToHourFormatLabel;

	var SequencedRoundDiv;
	var SequencedRoundCheckbox, SequencedRoundLabel, SequencedRoundInput, SequencedRoundBr;

	var AddRoundDiv;
	var RoundDateDiv, RoundHourDiv, AddRoundButtonDiv;
	var RoundDateDiv;
	var RoundDateRightDiv, RoundDateLeftDiv;
	var RoundDateLabel, RoundDateInput, RoundDateBr, RoundDateFormatLabel;

	var RoundHourDiv;
	var RoundHourRightDiv, RoundHourLeftDiv;
	var RoundHourLabel, RoundHourInput, RoundHourBr, RoundHourFormatLabel;
	var AddButton;

	var ButtonsDiv;
	var Create, Cancel;
	
	var Buttons = new Array();

	var Type, i;

	// Main Div
	Div = UTILS_CreateElement('div', 'CreateTourneyDiv');

	// DefaultDiv
	DefaultDiv = UTILS_CreateElement('div', 'DefaultDiv');

	// TNameDiv
	TNameDiv = UTILS_CreateElement('div', 'TNameDiv');

	TNameLeftDiv = UTILS_CreateElement('div', 'TNameLeftDiv');
	TNameLabel = UTILS_CreateElement('p', null, null, UTILS_GetText('tourney_name'));

	TNameRightDiv = UTILS_CreateElement('div', 'TNameRightDiv');
	TNameInput = UTILS_CreateElement('input','TNameInput');
	TNameInput.type = 'text';
	Br = UTILS_CreateElement('br');
	TNameCharCount = UTILS_CreateElement('span',null,'counter',UTILS_GetText("window_character"));
	TNameCharCount.innerHTML = TNameCharCount.innerHTML.replace(/%s/,"0");

	TNameInput.onkeyup = function () {
		TNameCharCount.innerHTML = UTILS_GetText("window_character");
		TNameCharCount.innerHTML = TNameCharCount.innerHTML.replace(/%s/,TNameInput.textLength);
	}

	// CatTimeDiv
	CatTimeDiv = UTILS_CreateElement('div', 'CatTimeDiv');
	
	CatLeftDiv = UTILS_CreateElement('div', 'CatLeftDiv');
	CatLabel = UTILS_CreateElement('p',null,null,UTILS_GetText("tourney_category"));

	CatRightDiv = UTILS_CreateElement('div', 'CatRightDiv');
	
	CatOptLi = UTILS_CreateElement('option', null, null, 'Lightning');
	CatOptLi.value = "lightning";
	CatOptBl = UTILS_CreateElement('option', null, null, 'Blitz');
	CatOptBl.value = "blitz";
	CatOptSt = UTILS_CreateElement('option', null, null, 'Standard');
	CatOptSt.value = "standard";
	
	// UNTIMED category option
	CatOptUt = UTILS_CreateElement('option', null, null, 'Untimed');
	CatOptUt.value = "untimed";

	CatSelect =	UTILS_CreateElement('select',null,'drop_select');
	CatSelect.appendChild(CatOptLi);
	CatSelect.appendChild(CatOptBl);
	CatSelect.appendChild(CatOptSt);
	
	//Append untimed option
	CatSelect.appendChild(CatOptUt);

	CatSelect.onchange = function () 
	{
		Type = CatSelect.options.selectedIndex;
		i=0;
		
		// Remove todos os filhos
		while (TimeSelect.firstChild)
		{
			TimeSelect.removeChild (TimeSelect.firstChild);
		}

		// Enable select time and select increment		
		TimeSelect.disabled = false;

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
			TimeSelect.appendChild(TimeOpt);
			TimeOpt = UTILS_CreateElement('option',null,null,"190");
			TimeOpt.value = 190;
			TimeSelect.appendChild(TimeOpt);
		}
		// Untimed = 3
		else if (Type == 3)
		{
			// Disable select time and select increment
			TimeSelect.disabled = true;

			TimeOpt = UTILS_CreateElement('option',null,null,"&#8734");
			TimeOpt.value = "untimed";
			TimeSelect.appendChild(TimeOpt);

		}
	}

	TimeLeftDiv = UTILS_CreateElement('div','TimeLeftDiv');
	TimeLabel =	UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_time_label'));
	
	TimeRightDiv = UTILS_CreateElement('div','TimeRightDiv');

	TimeLabelMin =	UTILS_CreateElement('span',null,'italic',UTILS_GetText('challenge_time_label_min'));
	TimeSelect = UTILS_CreateElement('select',null,'drop_select');
	
	for (i=3; i <= 10; i++)
	{
		TimeOpt = document.createElement("option");
		TimeOpt.innerHTML = i;
		TimeOpt.value = i;

		TimeSelect.appendChild(TimeOpt);
	}

	CatSelect.options.selectedIndex = 1;

	// RoundDiv
	RoundDiv =	UTILS_CreateElement('div', 'RoundDiv');
	
	RoundLeftDiv = UTILS_CreateElement('div', 'RoundLeftDiv');
	RoundLabel = UTILS_CreateElement('p', null,null, UTILS_GetText("tourney_rounds"));

	RoundRightDiv = UTILS_CreateElement('div', 'RoundRightDiv');
	try
	{
		AutoRadio = document.createElement("<input class='round_radio' type='radio' name='round' checked='checked' />");
	}
	catch(err)
	{
		AutoRadio =	UTILS_CreateElement('input', null, 'round_radio');
		AutoRadio.type = "radio";
		AutoRadio.name = "round";
		AutoRadio.checked = true;
	}
	AutoLabel = UTILS_CreateElement('span',null,null,UTILS_GetText('tourney_auto'));
	AutoHelpLabel = UTILS_CreateElement('span',null,'help','?');
	try
	{
		DefineRadio = document.createElement("<input class='round_radio' type='radio' name='round' />");
	}
	catch(err)
	{
		DefineRadio =	UTILS_CreateElement('input', null, 'round_radio');
		DefineRadio.type = "radio";
		DefineRadio.name = "round";
	}
	DefineLabel = UTILS_CreateElement('span',null,null,UTILS_GetText('tourney_define'));
	DefineSelect = UTILS_CreateElement('select',null,'drop_select');
	DefineSelect.disabled = true;
	DefineSelect.style.backgroundColor = "#C0C0C0";
	
	for (i=1; i <= 99; i++)
	{
		DefineOpt = document.createElement("option");
		DefineOpt.innerHTML = i;
		DefineOpt.value = i;

		DefineSelect.appendChild(DefineOpt);
	}
	
	AutoRadio.onchange = function () {
		if (AutoRadio.checked == true)
		{
			DefineSelect.disabled = true;
			DefineSelect.style.backgroundColor = "#C0C0C0";
		}
		else 
		{
			DefineSelect.disabled = false;
			DefineSelect.style.backgroundColor = "#C0C0C0";
		}
	}
	DefineRadio.onchange = function () {
		if (DefineRadio.checked == true)
		{
			DefineSelect.disabled = false;
			DefineSelect.style.backgroundColor = "#FFF";
		}
		else 
		{
			DefineSelect.disabled = true;
			DefineSelect.style.backgroundColor = "#FFF";
		}
	}

	// DateInitDiv
	DateInitDiv =	UTILS_CreateElement('div', 'DateInitDiv');
	
	DateInitLeftDiv =	UTILS_CreateElement('div', 'DateInitLeftDiv');
	DateInitLabel = UTILS_CreateElement('p',null,null, UTILS_GetText('tourney_init'));
	DateInitRightDiv =	UTILS_CreateElement('div', 'DateInitRightDiv');

	DateDiv = UTILS_CreateElement('div','DateDiv');
	DateLeftDiv = UTILS_CreateElement('div','DateLeftDiv');
	DateLabel = UTILS_CreateElement('p', null,null,UTILS_GetText('tourney_day'));
	DateRightDiv = UTILS_CreateElement('div','DateRightDiv');
	DateInput = UTILS_CreateElement('input');
	DateInput.size = "11";
	DateInput.maxLength = "10";
	DateBr = UTILS_CreateElement("br");
	DateFormatLabel = UTILS_CreateElement('span',null,'format_enabled',UTILS_GetText('tourney_day_format'));

	HourDiv = UTILS_CreateElement('div','HourDiv');
	HourLeftDiv = UTILS_CreateElement('div','HourLeftDiv');
	HourLabel = UTILS_CreateElement('p', null,null,UTILS_GetText('tourney_hour'));
	HourRightDiv = UTILS_CreateElement('div','HourRightDiv');
	HourInput = UTILS_CreateElement('input');
	HourInput.size = "11";
	HourInput.maxLength = "5";
	HourBr = UTILS_CreateElement("br");
	HourFormatLabel = UTILS_CreateElement('span',null,'format_enabled',UTILS_GetText('tourney_hour_format'));

	// AdvancedDiv
	AdvancedLabelDiv = UTILS_CreateElement('div',"AdvancedLabelDiv");
	AdvancedDiv = UTILS_CreateElement('div',"AdvancedDiv");
	AdvancedDiv.style.display = "none"; 
	AdvancedLabel = UTILS_CreateElement('span',null,'advanced', UTILS_GetText("tourney_see_advanced"));
	AdvancedLabel.onclick = function () {
		if (AdvancedDiv.style.display == "block")
		{
			AdvancedDiv.style.display = "none";
			AdvancedLabel.innerHTML = UTILS_GetText("tourney_see_advanced");
		}
		else
		{
			AdvancedDiv.style.display = "block";
			AdvancedLabel.innerHTML = UTILS_GetText("tourney_hide_advanced");
		}
	}
	AdvancedLabel.onmouseover = function () { this.style.color = "#FFA200"; this.style.borderBottomColor = "#FFA200"; }
	AdvancedLabel.onmouseout = function () { this.style.color = "#216678"; this.style.borderBottomColor = "#216678"; }

	// Description Div
	DescDiv = UTILS_CreateElement('div','DescDiv');
	DescLeftDiv = UTILS_CreateElement('div','DescLeftDiv');
	DescLabel = UTILS_CreateElement('p',null,null,UTILS_GetText("tourney_description"));
	DescRightDiv = UTILS_CreateElement('div','DescRightDiv');
	DescTextArea = UTILS_CreateElement("textarea");
	DescTextArea.rows = 4;
	DescTextArea.cols = 38;
	DescBr = UTILS_CreateElement("br");
	DescCounterLabel = UTILS_CreateElement('span',null,'counter',UTILS_GetText("window_character"));
	DescCounterLabel.innerHTML = DescCounterLabel.innerHTML.replace(/%s/,200);

	DescTextArea.onkeyup = function ()
	{
		if (200 - DescTextArea.value.length < 0)
		{
			DescTextArea.value = DescTextArea.value.substr(0,200);
		}
		DescCounterLabel.innerHTML = UTILS_GetText("window_character");
		DescCounterLabel.innerHTML = DescCounterLabel.innerHTML.replace(/%s/,200 - DescTextArea.value.length);
	}

	// SubscribeDiv
	SubscribeDiv = UTILS_CreateElement('div','SubscribeDiv');
	SubscribeLeftDiv = UTILS_CreateElement('div','SubscribeLeftDiv');
	SubscribeRightDiv = UTILS_CreateElement('div','SubscribeRightDiv');
	SubscribeInput = UTILS_CreateElement('input');
	SubscribeInput.type = "text";
	SubscribeInput.disabled = true;
	SubscribeInput.size = 10; 
	SubscribeInput.className = "disabled";
	try
	{
		SubscribeCheckbox = document.createElement("<input type='checkbox' name='subscribe' />");
	}
	catch(err)
	{
		SubscribeCheckbox =	UTILS_CreateElement('input', null);
		SubscribeCheckbox.type = "checkbox";
		SubscribeCheckbox.name = "subscribe";
		SubscribeCheckbox.checked = false;
	}
	SubscribeLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_subscribe'));

	SubscribeCheckbox.onchange = function () {
		if (this.checked == true)
		{
			SubscribeInput.disabled = false;
			SubscribeInput.className = "enabled";
		}
		else
		{
			SubscribeInput.disabled = true;
			SubscribeInput.value = "";
			SubscribeInput.className = "disabled";
		}
	}

	// IntervalDiv
	IntervalDiv = UTILS_CreateElement('div','IntervalDiv');
	IntervalLeftDiv = UTILS_CreateElement('div','IntervalLeftDiv');
	IntervalRightDiv = UTILS_CreateElement('div','IntervalRightDiv');

	try
	{
		IntervalCheckbox = document.createElement("<input type='checkbox' name='interval' />");
	}
	catch(err)
	{
		IntervalCheckbox =	UTILS_CreateElement('input', null);
		IntervalCheckbox.type = "checkbox";
		IntervalCheckbox.name = "interval";
	}
	IntervalLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_rating_interval'));

	// DateInit Form
	FromDiv = UTILS_CreateElement('div','FromDiv');
	FromRightDiv = UTILS_CreateElement('div','FromRightDiv');
	FromLeftDiv = UTILS_CreateElement('div','FromLeftDiv');
	ToDiv = UTILS_CreateElement('div','ToDiv');
	ToRightDiv = UTILS_CreateElement('div','ToRightDiv');
	ToLeftDiv = UTILS_CreateElement('div','ToLeftDiv');

	FromLabel	= UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('window_from'));
	try
	{
		FromInput = document.createElement("<input class='disabled' type='text' maxLength='4' size='5' disabled='disabled' />");
	}
	catch(err)
	{
		FromInput	= UTILS_CreateElement('input',null,'disabled');
		FromInput.size = "5";
		FromInput.type = "text";
		FromInput.maxLength = "4";
		FromInput.disabled = true;
	}
	FormatLabel1 = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('announce_min_rating_example'));

	ToLabel	= UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('window_to'));
	try
	{
		ToInput = document.createElement("<input class='disabled' type='text' maxLength='4' size='5' disabled='disabled' />");
	}
	catch(err)
	{
		ToInput	= UTILS_CreateElement('input',null,'disabled');
		ToInput.size = "5";
		ToInput.type = "text";
		ToInput.maxLength = "4";
		ToInput.disabled = true;
	}
	FormatLabel2 = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('announce_max_rating_example'));

	ToBr = UTILS_CreateElement("br");
	FromBr = UTILS_CreateElement("br");

	IntervalCheckbox.onchange= function() {
		if (this.checked == true)
		{
			FromInput.disabled = false;
			FromInput.className = "enabled";
			FromLabel.className = "advopt_enabled";
			ToInput.disabled = false;
			ToInput.className = "enabled";
			ToLabel.className = "advopt_enabled";
			FormatLabel1.className = "format_enabled";
			FormatLabel2.className = "format_enabled";
		}
		else
		{
			FromInput.disabled = true;
			FromInput.className = "disabled";
			FromLabel.className = "advopt_disabled";
			FromInput.value = "";
			ToInput.disabled = true;
			ToInput.className = "disabled";
			ToInput.value = "";
			ToLabel.className = "advopt_disabled";
			FormatLabel1.className = "format_disabled";
			FormatLabel2.className = "format_disabled";
		}
	}

	// RestrictDiv
	RestrictDiv = UTILS_CreateElement('div','RestrictDiv');
	RestrictRightDiv = UTILS_CreateElement('div','RestrictRightDiv');
	RestrictLeftDiv = UTILS_CreateElement('div','RestrictLeftDiv');
	RestrictInput = UTILS_CreateElement('input');
	RestrictInput.type = "text";
	RestrictInput.disabled = true;
	RestrictInput.size = 10; 
	RestrictInput.className = "disabled";
	try
	{
		RestrictCheckbox = document.createElement("<input type='checkbox' name='subscribe' />");
	}
	catch(err)
	{
		RestrictCheckbox =	UTILS_CreateElement('input', null);
		RestrictCheckbox.type = "checkbox";
		RestrictCheckbox.name = "subscribe";
		RestrictCheckbox.checked = false;
	}
	RestrictLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_restrict'));
	RestrictPasswd = UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('tourney_passwd'));

	RestrictCheckbox.onchange = function () {
		if (this.checked == true)
		{
			RestrictInput.disabled = false;
			RestrictPasswd.className = "advopt_enabled";
			RestrictInput.className = "enabled";
		}
		else
		{
			RestrictInput.disabled = true;
			RestrictInput.value = "";
			RestrictInput.className = "disabled";
			RestrictPasswd.className = "advopt_disabled";
		}
	}

	// WaiTimeDiv
	WaitTimeDiv = UTILS_CreateElement('div','WaitTimeDiv');
	WaitTimeRightDiv = UTILS_CreateElement('div','WaitTimeRightDiv');
	WaitTimeLeftDiv = UTILS_CreateElement('div','WaitTimeLeftDiv');
	WaitTimeInput = UTILS_CreateElement('input');
	WaitTimeInput.type = "text";
	WaitTimeInput.disabled = true;
	WaitTimeInput.size = 10; 
	WaitTimeInput.className = "disabled";
	try
	{
		WaitTimeCheckbox = document.createElement("<input type='checkbox' name='subscribe' />");
	}
	catch(err)
	{
		WaitTimeCheckbox =	UTILS_CreateElement('input', null);
		WaitTimeCheckbox.type = "checkbox";
		WaitTimeCheckbox.name = "subscribe";
		WaitTimeCheckbox.checked = false;
	}
	WaitTimeLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_delay'));
	WaitTimeMinLabel = UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('window_min'));
	WaitTimeHelpLabel = UTILS_CreateElement('span',null,'advopt_enabled','?');

	WaitTimeCheckbox.onchange = function () {
		if (this.checked == true)
		{
			WaitTimeInput.disabled = false;
			WaitTimeInput.className = "enabled";
			WaitTimeMinLabel.className = "advopt_enabled";
		}
		else
		{
			WaitTimeInput.disabled = true;
			WaitTimeInput.value = "";
			WaitTimeInput.className = "disabled";
			WaitTimeMinLabel.className = "advopt_disabled";
		}
	}

	// SubmitPeriodDiv
	SubmitPeriodDiv = UTILS_CreateElement('div','SubmitPeriodDiv');
	SubmitPeriodRightDiv = UTILS_CreateElement('div','SubmitPeriodRightDiv');
	SubmitPeriodLeftDiv = UTILS_CreateElement('div','SubmitPeriodLeftDiv');
	SubmitPeriodLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_submit_period'));
	try
	{
		SubmitPeriodCheckbox = document.createElement("<input type='checkbox' name='subperiod' />");
	}
	catch(err)
	{
		SubmitPeriodCheckbox =	UTILS_CreateElement('input', null);
		SubmitPeriodCheckbox.type = "checkbox";
		SubmitPeriodCheckbox.name = "subperiod";
		SubmitPeriodCheckbox.checked = false;
	}

	SPFromDiv = UTILS_CreateElement('div','SPFromDiv');
	SPFromRightDiv = UTILS_CreateElement('div','SPFromRightDiv');
	SPFromDateDiv = UTILS_CreateElement('div','SPFromDateDiv');
	SPFromHourDiv = UTILS_CreateElement('div','SPFromHourDiv');
	SPFromLeftDiv = UTILS_CreateElement('div','SPFromLeftDiv');
	SPToDiv = UTILS_CreateElement('div','SPToDiv');
	SPToRightDiv = UTILS_CreateElement('div','SPToRightDiv');
	SPToDateDiv = UTILS_CreateElement('div','SPToDateDiv');
	SPToHourDiv = UTILS_CreateElement('div','SPToHourDiv');
	SPToLeftDiv = UTILS_CreateElement('div','SPToLeftDiv');

	SPFromLabel	= UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('window_from'));
	try
	{
		SPFromDateInput = document.createElement("<input class='disabled' type='text' maxLength='4' size='5' disabled='disabled' />");
	}
	catch(err)
	{
		SPFromDateInput	= UTILS_CreateElement('input',null,'disabled');
		SPFromDateInput.size = "11";
		SPFromDateInput.type = "text";
		SPFromDateInput.maxLength = "10";
		SPFromDateInput.disabled = true;
	}
	SPFromDateBr = UTILS_CreateElement("br");
	SPFromDateFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_day_format'));

	try
	{
		SPFromHourInput = document.createElement("<input class='disabled' type='text' maxLength='4' size='5' disabled='disabled' />");
	}
	catch(err)
	{
		SPFromHourInput	= UTILS_CreateElement('input',null,'disabled');
		SPFromHourInput.size = "11";
		SPFromHourInput.type = "text";
		SPFromHourInput.maxLength = "5";
		SPFromHourInput.disabled = true;
	}
	SPFromHourBr = UTILS_CreateElement("br");
	SPFromHourFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_hour_format'));

	SPToLabel	= UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('window_to'));
	try
	{
		SPToDateInput = document.createElement("<input class='disabled' type='text' maxLength='4' size='5' disabled='disabled' />");
	}
	catch(err)
	{
		SPToDateInput	= UTILS_CreateElement('input',null,'disabled');
		SPToDateInput.size = "11";
		SPToDateInput.type = "text";
		SPToDateInput.maxLength = "10";
		SPToDateInput.disabled = true;
	}
	SPToDateBr = UTILS_CreateElement("br");
	SPToDateFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_day_format'));

	try
	{
		SPToHourInput = document.createElement("<input class='disabled' type='text' maxLength='4' size='5' disabled='disabled' />");
	}
	catch(err)
	{
		SPToHourInput	= UTILS_CreateElement('input',null,'disabled');
		SPToHourInput.size = "11";
		SPToHourInput.type = "text";
		SPToHourInput.maxLength = "5";
		SPToHourInput.disabled = true;
	}
	SPToHourBr = UTILS_CreateElement("br");
	SPToHourFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_hour_format'));

	SubmitPeriodCheckbox.onchange = function () {
		if (this.checked == true)
		{
			SPFromDateInput.disabled = false;
			SPFromHourInput.disabled = false;
			SPToDateInput.disabled = false;
			SPToHourInput.disabled = false;
			SPFromDateInput.className = "enabled";
			SPFromHourInput.className = "enabled";
			SPToDateInput.className = "enabled";
			SPToHourInput.className = "enabled";
			SPFromLabel.className = "advopt_enabled";
			SPToLabel.className = "advopt_enabled";
			SPFromHourInput.value = "00:00";
			SPToHourInput.value = "23:59";
			SPFromDateFormatLabel.className = 'format_enabled';
			SPFromHourFormatLabel.className = 'format_enabled';
			SPToDateFormatLabel.className = 'format_enabled';
			SPToHourFormatLabel.className = 'format_enabled';
		}
		else
		{
			SPFromDateInput.disabled = true;
			SPFromHourInput.disabled = true;
			SPToDateInput.disabled = true;
			SPToHourInput.disabled = true;
			SPFromDateInput.className = "disabled";
			SPFromHourInput.className = "disabled";
			SPToDateInput.className = "disabled";
			SPToHourInput.className = "disabled";
			SPFromDateInput.value = "";
			SPFromHourInput.value = "";
			SPToDateInput.value = "";
			SPToHourInput.value = "";
			SPFromLabel.className = "advopt_disabled";
			SPToLabel.className = "advopt_disabled";
			SPFromDateFormatLabel.className = 'format_disabled';
			SPFromHourFormatLabel.className = 'format_disabled';
			SPToDateFormatLabel.className = 'format_disabled';
			SPToHourFormatLabel.className = 'format_disabled';
		}
	}
	
	SPBr = UTILS_CreateElement("br");
	
	// SequencedRoundDiv
	SequencedRoundDiv = UTILS_CreateElement('div','SequencedRoundDiv');
	SequencedRoundInput = UTILS_CreateElement('textarea');
	SequencedRoundInput.disabled = true;
	SequencedRoundInput.cols = 48; 
	SequencedRoundInput.rows = 4; 
	SequencedRoundInput.className = "disabled";
	SequencedRoundBr = UTILS_CreateElement("br");
	try
	{
		SequencedRoundCheckbox = document.createElement("<input type='checkbox' name='sequenced' />");
	}
	catch(err)
	{
		SequencedRoundCheckbox =	UTILS_CreateElement('input', null);
		SequencedRoundCheckbox.type = "checkbox";
		SequencedRoundCheckbox.name = "sequenced";
		SequencedRoundCheckbox.checked = true;
	}
	SequencedRoundLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_sequenced_rounds'));

	// AddRoundDiv
	AddRoundDiv = UTILS_CreateElement('div','AddRoundDiv');
	RoundDateDiv = UTILS_CreateElement('div','RoundDateDiv');
	RoundHourDiv = UTILS_CreateElement('div','RoundHourDiv');
	RoundDateLeftDiv = UTILS_CreateElement('div','RoundDateLeftDiv');
	RoundDateLabel = UTILS_CreateElement('span', null,'advopt_disabled',UTILS_GetText('tourney_day'));
	RoundDateRightDiv = UTILS_CreateElement('div','RoundDateRightDiv');
	RoundDateInput = UTILS_CreateElement('input');
	RoundDateInput.size = "11";
	RoundDateInput.maxLength = "10";
	RoundDateInput.disabled = true;
	RoundDateInput.className = 'disabled';
	RoundDateBr = UTILS_CreateElement("br");
	RoundDateFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_day_format'));

	RoundHourLeftDiv = UTILS_CreateElement('div','RoundHourLeftDiv');
	RoundHourLabel = UTILS_CreateElement('span', null,'advopt_disabled',UTILS_GetText('tourney_hour'));
	RoundHourRightDiv = UTILS_CreateElement('div','RoundHourRightDiv');
	RoundHourInput = UTILS_CreateElement('input');
	RoundHourInput.size = "11";
	RoundHourInput.maxLength = "5";
	RoundHourInput.disabled = true;
	RoundHourInput.className = 'disabled';
	RoundHourBr = UTILS_CreateElement("br");
	RoundHourFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_hour_format'));
	
	AddRoundButtonDiv = UTILS_CreateElement('div','AddRoundButtonDiv');
	AddButton = UTILS_CreateElement('input', null, 'button');
	AddButton.value = UTILS_GetText("tourney_add_round");
	AddButton.type = "button";
	
	SequencedRoundCheckbox.onchange = function () {
		if (this.checked == true)
		{
			SequencedRoundInput.disabled = true;
			SequencedRoundInput.value = "";
			SequencedRoundInput.className = "disabled";

			RoundHourInput.disabled = true;
			RoundHourInput.className = "disabled";
			RoundDateInput.disabled = true;
			RoundDateInput.className = "disabled";

			RoundDateFormatLabel.className = 'format_disabled';
			RoundHourFormatLabel.className = 'format_disabled';
		}
		else
		{
			SequencedRoundInput.disabled = false;
			SequencedRoundInput.className = "enabled";
			
			RoundHourInput.disabled = false;
			RoundHourInput.className = "enabled";
			RoundDateInput.disabled = false;
			RoundDateInput.className = "enabled";

			RoundDateFormatLabel.className = 'format_enabled';
			RoundHourFormatLabel.className = 'format_enabled';
		}
	}

	// ButtonsDiv	
	ButtonsDiv =	UTILS_CreateElement('div', 'ButtonsDiv');

	Create = UTILS_CreateElement('input', null, 'button');
	Create.value = UTILS_GetText("tourney_create");
	Create.type = "button";
	
	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.value = UTILS_GetText('window_cancel');
	Cancel.type = "button";
	
	// Mount elements tree

	// TNameLeftDiv
	TNameLeftDiv.appendChild(TNameLabel);

	// TNameRightDiv
	TNameRightDiv.appendChild(TNameInput);
	TNameRightDiv.appendChild(Br);
	TNameRightDiv.appendChild(TNameCharCount);

	// TNameDiv
	TNameDiv.appendChild(TNameLeftDiv);
	TNameDiv.appendChild(TNameRightDiv);

	// CatLeftDiv
	CatLeftDiv.appendChild(CatLabel);
	CatRightDiv.appendChild(CatSelect);

	// TimeLeftDiv
	TimeLeftDiv.appendChild(TimeLabel);
	TimeRightDiv.appendChild(TimeSelect);
	TimeRightDiv.appendChild(TimeLabelMin);

	// CatTimeDiv
	CatTimeDiv.appendChild(CatLeftDiv);
	CatTimeDiv.appendChild(CatRightDiv);
	CatTimeDiv.appendChild(TimeLeftDiv);
	CatTimeDiv.appendChild(TimeRightDiv);

	// RoundLeftDiv
	RoundLeftDiv.appendChild(RoundLabel);
	
	// RoundRightDiv
	RoundRightDiv.appendChild(AutoRadio);
	RoundRightDiv.appendChild(AutoLabel);
	RoundRightDiv.appendChild(AutoHelpLabel);
	RoundRightDiv.appendChild(DefineRadio);
	RoundRightDiv.appendChild(DefineLabel);
	RoundRightDiv.appendChild(DefineSelect);

	// RoundDiv
	RoundDiv.appendChild(RoundLeftDiv);
	RoundDiv.appendChild(RoundRightDiv);

	// DateInitLeftDiv
	DateInitLeftDiv.appendChild(DateInitLabel);

	// DateLeftDiv
	DateLeftDiv.appendChild(DateLabel);

	// DateRightDiv
	DateRightDiv.appendChild(DateInput);
	DateRightDiv.appendChild(DateBr);
	DateRightDiv.appendChild(DateFormatLabel);

	// DateDiv
	DateDiv.appendChild(DateLeftDiv)
	DateDiv.appendChild(DateRightDiv)

	// HourLeftDiv
	HourLeftDiv.appendChild(HourLabel);
	
	// HourRightDiv
	HourRightDiv.appendChild(HourInput);
	HourRightDiv.appendChild(HourBr);
	HourRightDiv.appendChild(HourFormatLabel);

	// HourDiv
	HourDiv.appendChild(HourLeftDiv)
	HourDiv.appendChild(HourRightDiv)

	// DateInitRightDiv
	DateInitRightDiv.appendChild(DateDiv)
	DateInitRightDiv.appendChild(HourDiv)

	// DateInitDiv
	DateInitDiv.appendChild(DateInitLeftDiv);
	DateInitDiv.appendChild(DateInitRightDiv);

	// AdvancedLabelDiv
	AdvancedLabelDiv.appendChild(AdvancedLabel);

	// DescLeft Div
	DescLeftDiv.appendChild(DescLabel);

	// DescRight Div
	DescRightDiv.appendChild(DescTextArea);
	DescRightDiv.appendChild(DescBr);
	DescRightDiv.appendChild(DescCounterLabel);

	// Desc Div
	DescDiv.appendChild(DescLeftDiv);
	DescDiv.appendChild(DescRightDiv);

	// SubscribeLeftDiv
	SubscribeLeftDiv.appendChild(SubscribeCheckbox);
	SubscribeLeftDiv.appendChild(SubscribeLabel);

	// SubscribeRightDiv
	SubscribeRightDiv.appendChild(SubscribeInput);
	
	// SubscribeDiv
	SubscribeDiv.appendChild(SubscribeLeftDiv);
	SubscribeDiv.appendChild(SubscribeRightDiv);

	// IntervalLeftDiv
	IntervalLeftDiv.appendChild(IntervalCheckbox);
	IntervalLeftDiv.appendChild(IntervalLabel);

	// FromLeftDiv
	FromLeftDiv.appendChild(FromLabel);
	
	// FromRightDiv
	FromRightDiv.appendChild(FromInput);
	FromRightDiv.appendChild(FromBr);
	FromRightDiv.appendChild(FormatLabel1);

	// ToLeftDiv
	ToLeftDiv.appendChild(ToLabel);
	
	// ToRightDiv
	ToRightDiv.appendChild(ToInput);
	ToRightDiv.appendChild(ToBr);
	ToRightDiv.appendChild(FormatLabel2);

	// FromDiv
	FromDiv.appendChild(FromLeftDiv);
	FromDiv.appendChild(FromRightDiv);

	// ToDiv
	ToDiv.appendChild(ToLeftDiv);
	ToDiv.appendChild(ToRightDiv);

	// IntervalRightDiv
	IntervalRightDiv.appendChild(FromDiv);
	IntervalRightDiv.appendChild(ToDiv);

	// IntervalDiv
	IntervalDiv.appendChild(IntervalLeftDiv);
	IntervalDiv.appendChild(IntervalRightDiv);

	// RestrictLeftDiv
	RestrictLeftDiv.appendChild(RestrictCheckbox);
	RestrictLeftDiv.appendChild(RestrictLabel);

	// RestrictRightDiv
	RestrictRightDiv.appendChild(RestrictPasswd);
	RestrictRightDiv.appendChild(RestrictInput);
	
	// RestrictDiv
	RestrictDiv.appendChild(RestrictLeftDiv);
	RestrictDiv.appendChild(RestrictRightDiv);

	// WaitTimeLeftDiv
	WaitTimeLeftDiv.appendChild(WaitTimeCheckbox);
	WaitTimeLeftDiv.appendChild(WaitTimeLabel);

	// WaitTimeRightDiv
	WaitTimeRightDiv.appendChild(WaitTimeInput);
	WaitTimeRightDiv.appendChild(WaitTimeMinLabel);
	WaitTimeRightDiv.appendChild(WaitTimeHelpLabel);
	
	// WaitTimeDiv
	WaitTimeDiv.appendChild(WaitTimeLeftDiv);
	WaitTimeDiv.appendChild(WaitTimeRightDiv);

	// SubmitPeriodLeftDiv
	SubmitPeriodLeftDiv.appendChild(SubmitPeriodCheckbox);
	SubmitPeriodLeftDiv.appendChild(SubmitPeriodLabel);

	// SPFromLeftDiv
	SPFromLeftDiv.appendChild(SPFromLabel);
	
	// SPFromDateDiv
	SPFromDateDiv.appendChild(SPFromDateInput);
	SPFromDateDiv.appendChild(SPFromDateBr);
	SPFromDateDiv.appendChild(SPFromDateFormatLabel);

	// SPFromHourDiv
	SPFromHourDiv.appendChild(SPFromHourInput);
	SPFromHourDiv.appendChild(SPFromHourBr);
	SPFromHourDiv.appendChild(SPFromHourFormatLabel);

	// SPFromRightDiv
	SPFromRightDiv.appendChild(SPFromDateDiv);
	SPFromRightDiv.appendChild(SPFromHourDiv);

	// SPFromDiv
	SPFromDiv.appendChild(SPFromLeftDiv);
	SPFromDiv.appendChild(SPFromRightDiv);

	// SPToLeftDiv
	SPToLeftDiv.appendChild(SPToLabel);

	// SPToDateDiv
	SPToDateDiv.appendChild(SPToDateInput);
	SPToDateDiv.appendChild(SPToDateBr);
	SPToDateDiv.appendChild(SPToDateFormatLabel);

	// SPToHourDiv
	SPToHourDiv.appendChild(SPToHourInput);
	SPToHourDiv.appendChild(SPToHourBr);
	SPToHourDiv.appendChild(SPToHourFormatLabel);

	// SPToRightDiv
	SPToRightDiv.appendChild(SPToDateDiv);
	SPToRightDiv.appendChild(SPToHourDiv);

	// SPToDiv
	SPToDiv.appendChild(SPToLeftDiv);
	SPToDiv.appendChild(SPToRightDiv);
	
	// SubmitPeriodRightDiv
	SubmitPeriodRightDiv.appendChild(SPFromDiv);
	SubmitPeriodRightDiv.appendChild(SPBr);
	SubmitPeriodRightDiv.appendChild(SPToDiv);

	// SubmitPeriod Div
	SubmitPeriodDiv.appendChild(SubmitPeriodLeftDiv);
	SubmitPeriodDiv.appendChild(SubmitPeriodRightDiv);

	// Sequenced Round Div
	SequencedRoundDiv.appendChild(SequencedRoundCheckbox);
	SequencedRoundDiv.appendChild(SequencedRoundLabel);
	SequencedRoundDiv.appendChild(SequencedRoundBr);
	SequencedRoundDiv.appendChild(SequencedRoundInput);

	// RoundDateLeftDiv
	RoundDateLeftDiv.appendChild(RoundDateLabel);

	// RoundDateRightDiv
	RoundDateRightDiv.appendChild(RoundDateInput);
	RoundDateRightDiv.appendChild(RoundDateBr);
	RoundDateRightDiv.appendChild(RoundDateFormatLabel);

	// RoundDateDiv
	RoundDateDiv.appendChild(RoundDateLeftDiv)
	RoundDateDiv.appendChild(RoundDateRightDiv)

	// RoundHourLeftDiv
	RoundHourLeftDiv.appendChild(RoundHourLabel);
	
	// RoundHourRightDiv
	RoundHourRightDiv.appendChild(RoundHourInput);
	RoundHourRightDiv.appendChild(RoundHourBr);
	RoundHourRightDiv.appendChild(RoundHourFormatLabel);

	// RoundHourDiv
	RoundHourDiv.appendChild(RoundHourLeftDiv)
	RoundHourDiv.appendChild(RoundHourRightDiv)

	// AddRoundRoundDiv
	AddRoundButtonDiv.appendChild(AddButton);

	// Add Round Div
	AddRoundDiv.appendChild(RoundDateDiv);
	AddRoundDiv.appendChild(RoundHourDiv);
	AddRoundDiv.appendChild(AddRoundButtonDiv);

	// AdvancedDiv
	AdvancedDiv.appendChild(DescDiv);
	AdvancedDiv.appendChild(SubscribeDiv);
	AdvancedDiv.appendChild(IntervalDiv);
	AdvancedDiv.appendChild(RestrictDiv);
	AdvancedDiv.appendChild(WaitTimeDiv);
	AdvancedDiv.appendChild(SubmitPeriodDiv);
	AdvancedDiv.appendChild(SequencedRoundDiv);
	AdvancedDiv.appendChild(AddRoundDiv);

	// DefaultDiv
	DefaultDiv.appendChild(TNameDiv);
	DefaultDiv.appendChild(CatTimeDiv);
	DefaultDiv.appendChild(RoundDiv);
	DefaultDiv.appendChild(DateInitDiv);
	DefaultDiv.appendChild(AdvancedLabelDiv);
	DefaultDiv.appendChild(AdvancedDiv);

	// ButtonsDiv
	ButtonsDiv.appendChild(Create);
	Buttons.push(Create);
	ButtonsDiv.appendChild(Cancel);
	Buttons.push(Cancel);

	// MainDiv
	Div.appendChild(DefaultDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons}
}
