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
* Create elements to create tourney window
*
* @return									Div; Array
* @author									Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowCreateTourneyWindow()
{
	// Variables
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
	var RoundHelpImg;

	var DateInitDiv;
	var DateInitLeftDiv, DateInitRightDiv;
	var DateInitLabel;

	var DateDiv;
	var DateRightDiv, DateLeftDiv;
	var DateRightInputDiv, HourRightInputDiv;
	var DateLabel, DateInputD, DateInputM, DateInputY, DateBarSpan1, DateBarSpan2, DateBr, DateFormatLabel;

	var HourDiv;
	var HourRightDiv, HourLeftDiv;
	var HourightInputDiv;
	var HourLabel, HourInputH, HourInputM, HourColonSpan, HourBr, HourFormatLabel;
	
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
	var WaitTimeLabel, WaitTimeCheckbox, WaitTimeInput, WaitTimeHelpImg, WaitTimeMinLabel;

	var SubmitPeriodDiv
	var SubmitPeriodLeftDiv;
	var SubmitPeriodCheckbox, SubmitPeriodLabel;

	var SubmitPeriodRightDiv;
	var SPFromDiv;
	var SPFromLeftDiv, SPFromRightDiv;
	var SPFromLabel;
	var SPFromDateDiv, SPFromHourDiv;
	var SPFromDateRightDiv, SPFromHourRightDiv;
	var SPFromDateInputD, SPFromDateInputM, SPFromDateInputY, SPFromDateFormatLabel;
	var SPFromHourInputH, SPFromHourInputM, SPFromHourFormatLabel;
	var SPFromDateBar1, SPFromDateBar2, SPFromHourColon, SPFromDateInputDiv, SPFromHourInputDiv;
	var SPBr;
	var SPToDiv;
	var SPToLeftDiv, SPToRightDiv;
	var SPToLabel;
	var SPToDateDiv, SPToHourDiv;
	var SPToDateRightDiv, SPToHourRightDiv;
	var SPToDateInputD, SPToDateInputM, SPToDateInputY, SPToDateFormatLabel;
	var SPToHourInputH, SPToHourInputM, SPToHourFormatLabel;
	var SPToDateBar1, SPToDateBar2, SPToHourColon, SPToHourInputDiv, SPToDateInputDiv;

	var SequencedRoundDiv;
	var SequencedRoundCheckbox, SequencedRoundLabel, SequencedRoundBr;
	var SequencedRoundTableDiv, SequencedRoundTable;
	var RTd, DTd, HTd, Tr, Td, Hr, Checkbox;
	var RoundCheckbox;

	var THead, TBody;
	var RoundTd, RoundDInput, RoundMInput, RoundYInput, RoundHInput, RoundMiInput, RoundSpan1, RoundSpan2, RoundColon;
	var DInput, MInput, YInput, HInput, MiInput, Span1, Span2;

	var RoundButtonDiv;
	var AddButton, RemoveButton;

	var ButtonsDiv;
	var Create, Cancel;
	
	var Buttons = new Array();
	var Elements = new Object();

	var Type, i, RNumber;

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
	
	CatSelect =	UTILS_CreateElement('select');
	CatSelect.appendChild(CatOptLi);
	CatSelect.appendChild(CatOptBl);
	CatSelect.appendChild(CatOptSt);
	
	CatSelect.onchange = function () 
	{
		Type = CatSelect.options.selectedIndex;
		i=0;
		
		// Remove all childs 
		while (TimeSelect.firstChild)
		{
			TimeSelect.removeChild (TimeSelect.firstChild);
		}

		// Enable select time and select increment		
		TimeSelect.disabled = false;
		TimeSelect.className = "select_enabled";

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
	}

	TimeLeftDiv = UTILS_CreateElement('div','TimeLeftDiv');
	TimeLabel =	UTILS_CreateElement('p',null,null,UTILS_GetText('challenge_time_label'));
	
	TimeRightDiv = UTILS_CreateElement('div','TimeRightDiv');

	TimeLabelMin =	UTILS_CreateElement('span',null,'italic',UTILS_GetText('challenge_time_label_min'));
	TimeSelect = UTILS_CreateElement('select',null,'select_enabled');
	
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
	try
	{
		RoundCheckbox = document.createElement("<input class='checkbox' type='checkbox' name='auto' checked='checked' />");
	}
	catch(err)
	{
		RoundCheckbox =	UTILS_CreateElement('input', null);
		RoundCheckbox.type = "checkbox";
		RoundCheckbox.name = "auto";
		RoundCheckbox.className = "checkbox";
		RoundCheckbox.checked = true;
	}
	RoundLabel = UTILS_CreateElement('span', null,'advopt_enabled', UTILS_GetText("tourney_rounds"));
	RoundHelpImg = UTILS_CreateElement('img',null,'help');
	RoundHelpImg.src= "images/help-icon.png";

	// DateInitDiv
	DateInitDiv =	UTILS_CreateElement('div', 'DateInitDiv');
	
	DateInitLeftDiv =	UTILS_CreateElement('div', 'DateInitLeftDiv');
	DateInitLabel = UTILS_CreateElement('p',null,null, UTILS_GetText('tourney_init'));
	DateInitRightDiv =	UTILS_CreateElement('div', 'DateInitRightDiv');

	DateDiv = UTILS_CreateElement('div','DateDiv');
	DateLeftDiv = UTILS_CreateElement('div','DateLeftDiv');
	DateLabel = UTILS_CreateElement('p', null,null,UTILS_GetText('tourney_day'));
	DateRightDiv = UTILS_CreateElement('div','DateRightDiv');
	DateRightInputDiv = UTILS_CreateElement('div','DateRightInputDiv');
	DateInputD = UTILS_CreateElement('input', null,'no_board');
	DateInputD.size = "1";
	DateInputD.maxLength = "2";
	DateInputD.value = "__";
	DateInputM = UTILS_CreateElement('input', null,'no_board');
	DateBarSpan1 = UTILS_CreateElement('span',null,'space','/');
	DateInputM.size = "1";
	DateInputM.maxLength = "2";
	DateInputM.value = "__";
	DateInputY = UTILS_CreateElement('input', null, 'no_board');
	DateBarSpan2 = UTILS_CreateElement('span',null,'space','/');
	DateInputY.size = "3";
	DateInputY.maxLength = "4";
	DateInputY.value = "____";
	DateBr = UTILS_CreateElement("br");
	DateFormatLabel = UTILS_CreateElement('span',null,'format_enabled',UTILS_GetText('tourney_day_format'));

	HourDiv = UTILS_CreateElement('div','HourDiv');
	HourLeftDiv = UTILS_CreateElement('div','HourLeftDiv');
	HourLabel = UTILS_CreateElement('p', null,null,UTILS_GetText('tourney_hour'));
	HourRightDiv = UTILS_CreateElement('div','HourRightDiv');
	HourRightInputDiv = UTILS_CreateElement('div','HourRightInputDiv');
	HourInputH = UTILS_CreateElement('input', null, 'no_board');
	HourInputH.size = "1";
	HourInputH.maxLength = "2";
	HourInputH.value = "__";
	HourColonSpan = UTILS_CreateElement('span',null,'colon',':');
	HourInputM = UTILS_CreateElement('input', null, 'no_board');
	HourInputM.size = "1";
	HourInputM.maxLength = "2";
	HourInputM.value = "__";
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
		SubscribeCheckbox = document.createElement("<input class='checkbox' type='checkbox' name='subscribe' />");
	}
	catch(err)
	{
		SubscribeCheckbox =	UTILS_CreateElement('input', null);
		SubscribeCheckbox.type = "checkbox";
		SubscribeCheckbox.name = "subscribe";
		SubscribeCheckbox.className = "checkbox";
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
		IntervalCheckbox = document.createElement("<input class='checkbox' type='checkbox' name='interval' />");
	}
	catch(err)
	{
		IntervalCheckbox =	UTILS_CreateElement('input', null);
		IntervalCheckbox.type = "checkbox";
		IntervalCheckbox.className = "checkbox";
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
	RestrictInput.style.marginLeft = "5px";
	RestrictInput.className = "disabled";
	try
	{
		RestrictCheckbox = document.createElement("<input class='checkbox' type='checkbox' name='subscribe' />");
	}
	catch(err)
	{
		RestrictCheckbox =	UTILS_CreateElement('input', null);
		RestrictCheckbox.type = "checkbox";
		RestrictCheckbox.className = "checkbox";
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
		WaitTimeCheckbox = document.createElement("<input class='checkbox' type='checkbox' name='subscribe' />");
	}
	catch(err)
	{
		WaitTimeCheckbox =	UTILS_CreateElement('input', null);
		WaitTimeCheckbox.type = "checkbox";
		WaitTimeCheckbox.className = "checkbox";
		WaitTimeCheckbox.name = "subscribe";
		WaitTimeCheckbox.checked = false;
	}
	WaitTimeLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_delay'));
	WaitTimeMinLabel = UTILS_CreateElement('span',null,'min_disabled',UTILS_GetText('window_min'));
	WaitTimeHelpImg = UTILS_CreateElement('img',null,'help');
	WaitTimeHelpImg.src= "images/help-icon.png";

	WaitTimeCheckbox.onchange = function () {
		if (this.checked == true)
		{
			WaitTimeInput.disabled = false;
			WaitTimeInput.className = "enabled";
			WaitTimeMinLabel.className = "min_enabled";
		}
		else
		{
			WaitTimeInput.disabled = true;
			WaitTimeInput.value = "";
			WaitTimeInput.className = "disabled";
			WaitTimeMinLabel.className = "min_disabled";
		}
	}

	// SubmitPeriodDiv
	SubmitPeriodDiv = UTILS_CreateElement('div','SubmitPeriodDiv');
	SubmitPeriodRightDiv = UTILS_CreateElement('div','SubmitPeriodRightDiv');
	SubmitPeriodLeftDiv = UTILS_CreateElement('div','SubmitPeriodLeftDiv');
	SubmitPeriodLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_submit_period'));
	try
	{
		SubmitPeriodCheckbox = document.createElement("<input class='checkbox' type='checkbox' name='subperiod' />");
	}
	catch(err)
	{
		SubmitPeriodCheckbox =	UTILS_CreateElement('input', null);
		SubmitPeriodCheckbox.type = "checkbox";
		SubmitPeriodCheckbox.className = "checkbox";
		SubmitPeriodCheckbox.name = "subperiod";
		SubmitPeriodCheckbox.checked = false;
	}

	SPFromDiv = UTILS_CreateElement('div','SPFromDiv');
	SPFromRightDiv = UTILS_CreateElement('div','SPFromRightDiv');
	SPFromDateDiv = UTILS_CreateElement('div','SPFromDateDiv');
	SPFromDateInputDiv = UTILS_CreateElement('div','SPFromDateInputDiv','disabled');
	SPFromHourDiv = UTILS_CreateElement('div','SPFromHourDiv');
	SPFromHourInputDiv = UTILS_CreateElement('div','SPFromHourInputDiv','disabled');
	SPFromLeftDiv = UTILS_CreateElement('div','SPFromLeftDiv');
	SPToDiv = UTILS_CreateElement('div','SPToDiv');
	SPToRightDiv = UTILS_CreateElement('div','SPToRightDiv');
	SPToDateDiv = UTILS_CreateElement('div','SPToDateDiv');
	SPToDateInputDiv = UTILS_CreateElement('div','SPToDateInputDiv','disabled');
	SPToHourDiv = UTILS_CreateElement('div','SPToHourDiv');
	SPToHourInputDiv = UTILS_CreateElement('div','SPToHourInputDiv','disabled');
	SPToLeftDiv = UTILS_CreateElement('div','SPToLeftDiv');

	SPFromLabel	= UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('window_from'));
	try
	{
		SPFromDateInputD = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' value='__' />");
		SPFromDateInputM = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' value='__' />");
		SPFromDateInputY = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' value='__' />");
	}
	catch(err)
	{
		SPFromDateInputD	= UTILS_CreateElement('input',null,'disabled');
		SPFromDateInputD.size = "1";
		SPFromDateInputD.type = "text";
		SPFromDateInputD.maxLength = "2";
		SPFromDateInputD.value = "__";
		SPFromDateInputD.disabled = true;
		
		SPFromDateInputM	= UTILS_CreateElement('input',null,'disabled');
		SPFromDateInputM.size = "1";
		SPFromDateInputM.type = "text";
		SPFromDateInputM.maxLength = "2";
		SPFromDateInputM.value = "__";
		SPFromDateInputM.disabled = true;
		
		SPFromDateInputY	= UTILS_CreateElement('input',null,'disabled');
		SPFromDateInputY.size = "3";
		SPFromDateInputY.type = "text";
		SPFromDateInputY.maxLength = "4";
		SPFromDateInputY.value = "____";
		SPFromDateInputY.disabled = true;
	}
	SPFromDateBar1 = UTILS_CreateElement("span",null,'disabled',"/");
	SPFromDateBar2 = UTILS_CreateElement("span",null,'disabled',"/");
	SPFromDateFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_day_format'));

	try
	{
		SPFromHourInputH = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' />");
		SPFromHourInputM = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' />");
	}
	catch(err)
	{
		SPFromHourInputH	= UTILS_CreateElement('input',null,'disabled');
		SPFromHourInputH.size = "1";
		SPFromHourInputH.type = "text";
		SPFromHourInputH.maxLength = "2";
		SPFromHourInputH.value = "__";
		SPFromHourInputH.disabled = true;
		
		SPFromHourInputM	= UTILS_CreateElement('input',null,'disabled');
		SPFromHourInputM.size = "1";
		SPFromHourInputM.type = "text";
		SPFromHourInputM.maxLength = "2";
		SPFromHourInputM.value = "__";
		SPFromHourInputM.disabled = true;
	}
	SPFromHourColon = UTILS_CreateElement("span",null,'colon',":");
	SPFromHourFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_hour_format'));

	SPToLabel	= UTILS_CreateElement('span',null,'advopt_disabled',UTILS_GetText('window_to'));
	try
	{
		SPToDateInputD = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' />");
		SPToDateInputM = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' />");
		SPToDateInputY = document.createElement("<input class='disabled' type='text' maxLength='4' size='3' disabled='disabled' />");
	}
	catch(err)
	{
		SPToDateInputD	= UTILS_CreateElement('input',null,'disabled');
		SPToDateInputD.size = "1";
		SPToDateInputD.type = "text";
		SPToDateInputD.maxLength = "2";
		SPToDateInputD.value = "__";
		SPToDateInputD.disabled = true;

		SPToDateInputM	= UTILS_CreateElement('input',null,'disabled');
		SPToDateInputM.size = "1";
		SPToDateInputM.type = "text";
		SPToDateInputM.maxLength = "2";
		SPToDateInputM.value = "__";
		SPToDateInputM.disabled = true;

		SPToDateInputY	= UTILS_CreateElement('input',null,'disabled');
		SPToDateInputY.size = "3";
		SPToDateInputY.type = "text";
		SPToDateInputY.maxLength = "4";
		SPToDateInputY.value = "____";
		SPToDateInputY.disabled = true;
	}
	SPToDateBar1 = UTILS_CreateElement("span",null,'disabled',"/");
	SPToDateBar2 = UTILS_CreateElement("span",null,'disabled',"/");
	SPToDateFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_day_format'));

	try
	{
		SPToHourInputH = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' />");
		SPToHourInputM = document.createElement("<input class='disabled' type='text' maxLength='2' size='1' disabled='disabled' />");
	}
	catch(err)
	{
		SPToHourInputH	= UTILS_CreateElement('input',null,'disabled');
		SPToHourInputH.size = "1";
		SPToHourInputH.type = "text";
		SPToHourInputH.maxLength = "2";
		SPToHourInputH.value = "__";
		SPToHourInputH.disabled = true;
		
		SPToHourInputM	= UTILS_CreateElement('input',null,'disabled');
		SPToHourInputM.size = "1";
		SPToHourInputM.type = "text";
		SPToHourInputM.maxLength = "2";
		SPToHourInputM.value = "__";
		SPToHourInputM.disabled = true;
	}
	SPToHourColon = UTILS_CreateElement("span",null,'colon',":");
	SPToHourFormatLabel = UTILS_CreateElement('span',null,'format_disabled',UTILS_GetText('tourney_hour_format'));

	SubmitPeriodCheckbox.onchange = function () {
		if (this.checked == true)
		{
			SPFromDateInputD.disabled = false;
			SPFromDateInputM.disabled = false;
			SPFromDateInputY.disabled = false;

			SPFromHourInputH.disabled = false;
			SPFromHourInputM.disabled = false;

			SPToDateInputD.disabled = false;
			SPToDateInputM.disabled = false;
			SPToDateInputY.disabled = false;

			SPToHourInputH.disabled = false;
			SPToHourInputM.disabled = false;

			SPFromDateInputD.className = "enabled";
			SPFromDateInputM.className = "enabled";
			SPFromDateInputY.className = "enabled";

			SPFromHourInputH.className = "enabled";
			SPFromHourInputM.className = "enabled";

			SPToDateInputD.className = "enabled";
			SPToDateInputM.className = "enabled";
			SPToDateInputY.className = "enabled";

			SPToHourInputH.className = "enabled";
			SPToHourInputM.className = "enabled";

			SPFromLabel.className = "advopt_enabled";

			SPToLabel.className = "advopt_enabled";

			SPFromHourInputH.value = "00";
			SPFromHourInputM.value = "00";

			SPToHourInputH.value = "23";
			SPToHourInputM.value = "59";

			SPFromDateFormatLabel.className = 'format_enabled';
			SPFromHourFormatLabel.className = 'format_enabled';
			SPToDateFormatLabel.className = 'format_enabled';
			SPToHourFormatLabel.className = 'format_enabled';

			SPFromDateInputDiv.className = "enabled";
			SPFromHourInputDiv.className = "enabled";
			SPToDateInputDiv.className = "enabled";
			SPToHourInputDiv.className = "enabled";
	
			SPFromDateBar1.className = "enabled";
			SPFromDateBar2.className = "enabled";
			SPFromHourColon.className = "enabled";
			SPToDateBar1.className = "enabled";
			SPToDateBar2.className = "enabled";
			SPToHourColon.className = "enabled";
		}
		else
		{
			SPFromDateInputD.disabled = true;
			SPFromDateInputM.disabled = true;
			SPFromDateInputY.disabled = true;

			SPFromHourInputH.disabled = true;
			SPFromHourInputM.disabled = true;

			SPToDateInputD.disabled = true;
			SPToDateInputM.disabled = true;
			SPToDateInputY.disabled = true;

			SPToHourInputH.disabled = true;
			SPToDateInputM.disabled = true;

			SPFromDateInputD.className = "disabled";
			SPFromDateInputM.className = "disabled";
			SPFromDateInputY.className = "disabled";

			SPFromHourInputH.className = "disabled";
			SPFromHourInputM.className = "disabled";

			SPToDateInputD.className = "disabled";
			SPToDateInputM.className = "disabled";
			SPToDateInputY.className = "disabled";

			SPToHourInputH.className = "disabled";
			SPToHourInputM.className = "disabled";

			SPFromDateInputD.value = "__";
			SPFromDateInputM.value = "__";
			SPFromDateInputY.value = "____";

			SPFromHourInputH.value = "__";
			SPFromHourInputM.value = "__";

			SPToDateInputD.value = "__";
			SPToDateInputM.value = "__";
			SPToDateInputY.value = "____";

			SPToHourInputH.value = "__";
			SPToHourInputM.value = "__";

			SPFromLabel.className = "advopt_disabled";

			SPToLabel.className = "advopt_disabled";

			SPFromDateFormatLabel.className = 'format_disabled';

			SPFromHourFormatLabel.className = 'format_disabled';

			SPToDateFormatLabel.className = 'format_disabled';
			SPToHourFormatLabel.className = 'format_disabled';
			
			SPFromDateInputDiv.className = "disabled";
			SPFromHourInputDiv.className = "disabled";
			SPToDateInputDiv.className = "disabled";
			SPToHourInputDiv.className = "disabled";
			
			SPFromDateBar1.className = "disabled";
			SPFromDateBar2.className = "disabled";
			SPFromHourColon.className = "disabled";
			SPToDateBar1.className = "disabled";
			SPToDateBar2.className = "disabled";
			SPToHourColon.className = "disabled";
		}
	}
	
	SPBr = UTILS_CreateElement("br");
	
	// SequencedRoundDiv
	SequencedRoundDiv = UTILS_CreateElement('div','SequencedRoundDiv');
	SequencedRoundTableDiv = UTILS_CreateElement('div','SequencedRoundTableDiv');
	SequencedRoundTable = UTILS_CreateElement('table');
	THead = UTILS_CreateElement('thead');

	Tr = UTILS_CreateElement('tr');

	Td = UTILS_CreateElement('td',null,'cb_cell');
	Tr.appendChild(Td);

	RTd = UTILS_CreateElement('td',null,'th_disable','Rodada');
	Tr.appendChild(RTd);

	DTd = UTILS_CreateElement('td',null,'th_disable','Data');
	Tr.appendChild(DTd);

	HTd = UTILS_CreateElement('td',null,'th_disable','Hora');
	Tr.appendChild(HTd);

	THead.appendChild(Tr);

	Tr = UTILS_CreateElement('tr');
	Td = UTILS_CreateElement('td');
	Td.colSpan = "4";
	Hr= UTILS_CreateElement('hr',null,'invisible');
	Td.appendChild(Hr);
	Tr.appendChild(Td);

	THead.appendChild(Tr);

	SequencedRoundTable.appendChild(THead);
	
	TBody = UTILS_CreateElement('tbody');
	// First row
	Tr = UTILS_CreateElement('tr');
	Tr.vAlign = "top";

	Td= UTILS_CreateElement('td',null,'cb_cell');
	try
	{
		Checkbox = document.createElement("<input class='checkbox' type='checkbox' disabled='disabled' />");
	}
	catch(err)
	{
		Checkbox =	UTILS_CreateElement('input');
		Checkbox.type = "checkbox";
		Checkbox.className = "checkbox";
		Checkbox.disabled = true;
	}
	Td.appendChild(Checkbox);
	Tr.appendChild(Td)

	RNumber = TBody.rows.length + 1;
	RoundTd = UTILS_CreateElement('td',null, 'disable',"Rodada " + RNumber);
	Tr.appendChild(RoundTd)

	Td = UTILS_CreateElement('td');
	RoundDInput = UTILS_CreateElement('input',null, 'no_board_dis');
	RoundDInput.type = "text";
	RoundDInput.size = "1";
	RoundDInput.maxLength="2";
	RoundDInput.value= DateInputD.value;
					
	RoundMInput = UTILS_CreateElement('input',null,'no_board_dis');
	RoundMInput.type = "text";
	RoundMInput.size = "1";
	RoundMInput.maxLength="2";
	RoundMInput.value=DateInputM.value;
					
	RoundYInput = UTILS_CreateElement('input',null,'no_board_dis');
	RoundYInput.type= "text";
	RoundYInput.size = "3";
	RoundYInput.maxLength="4";
	RoundYInput.value=DateInputY.value;
					
	RoundSpan1 = UTILS_CreateElement("span",null,'disable',"/");
	RoundSpan2 = UTILS_CreateElement("span",null,'disable',"/");
	Td.appendChild(RoundDInput);
	Td.appendChild(RoundSpan1);
	Td.appendChild(RoundMInput);
	Td.appendChild(RoundSpan2);
	Td.appendChild(RoundYInput);
	Tr.appendChild(Td);

	Td = UTILS_CreateElement('td');
	RoundHInput = UTILS_CreateElement('input',null,'no_board_dis');
	RoundHInput.type = "text";
	RoundHInput.size = "1";
	RoundHInput.maxLength="2";
	RoundHInput.value=HourInputH.value;
					
	RoundMiInput = UTILS_CreateElement('input',null,'no_board_dis');
	RoundMiInput.type = "text";
	RoundMiInput.size = "1";
	RoundMiInput.maxLength="2";
	RoundMiInput.value=HourInputM.value;
					
	RoundColon = UTILS_CreateElement("span",null,'disable',":");
	Td.appendChild(RoundHInput);
	Td.appendChild(RoundColon);
	Td.appendChild(RoundMiInput);
	Tr.appendChild(Td);
	// End first row

	TBody.appendChild(Tr);
	SequencedRoundTable.appendChild(TBody);

	SequencedRoundBr = UTILS_CreateElement("br");

	try
	{
		SequencedRoundCheckbox = document.createElement("<input class='checkbox' type='checkbox' name='sequenced' disabled='disabled' />");
	}
	catch(err)
	{
		SequencedRoundCheckbox =	UTILS_CreateElement('input', null);
		SequencedRoundCheckbox.type = "checkbox";
		SequencedRoundCheckbox.className = "checkbox";
		SequencedRoundCheckbox.name = "sequenced";
		SequencedRoundCheckbox.checked = true;
		SequencedRoundCheckbox.disabled = true;
	}
	SequencedRoundLabel = UTILS_CreateElement('span',null,'advopt_enabled',UTILS_GetText('tourney_sequenced_rounds'));

	// RoundButtonDiv
	RoundButtonDiv = UTILS_CreateElement('div','RoundButtonDiv');
	AddButton = UTILS_CreateElement('input', null, 'button_disabled');
	AddButton.value = UTILS_GetText("tourney_add_round");
	AddButton.type = "button";
	AddButton.onclick = function () {
		if (SequencedRoundCheckbox.checked == true) {
			return false;
		}

		Tr = UTILS_CreateElement('tr');
		Tr.vAlign = "top";

		Td= UTILS_CreateElement('td',null,'cb_cell');
		try
		{
			Checkbox = document.createElement("<input class='checkbox' type='checkbox' />");
		}
		catch(err)
		{
			Checkbox =	UTILS_CreateElement('input');
			Checkbox.type = "checkbox";
			Checkbox.className = "checkbox";
		}
		Td.appendChild(Checkbox);
		Tr.appendChild(Td)

		var RNumber = TBody.rows.length + 1;
		Td = UTILS_CreateElement('td',null, 'enable', "Rodada " + RNumber);
		Tr.appendChild(Td)

		DInput = UTILS_CreateElement('input',null, 'no_board_en');
		MInput = UTILS_CreateElement('input',null,'no_board_en');
		YInput = UTILS_CreateElement('input',null,'no_board_en');
		HInput = UTILS_CreateElement('input',null,'no_board_en');
		MiInput = UTILS_CreateElement('input',null,'no_board_en');

		Td = UTILS_CreateElement('td');
		DInput.type = "text";
		DInput.size = "1";
		DInput.maxLength="2";
		DInput.value="__";
		DInput.onfocus = function () 
		{ 
			if (DInput.value == "__")
			{
				DInput.value="";
			}
		}
		DInput.onblur = function () 
		{ 
			if (DInput.value == "")
			{
				DInput.value="__";
			}
		}
		MInput.type = "text";
		MInput.size = "1";
		MInput.maxLength="2";
		MInput.value="__";
		MInput.onfocus = function () 
		{ 
			if (MInput.value == "__")
			{
				MInput.value="";
			}
		}
		MInput.onblur = function () 
		{ 
			if (MInput.value == "")
			{
				MInput.value="__";
			}
		}
		YInput.type= "text";
		YInput.size = "3";
		YInput.maxLength="4";
		YInput.value="____";
		YInput.onfocus = function () 
		{ 
			if (YInput.value == "____")
			{
				YInput.value="";
			}
		}
		YInput.onblur = function () 
		{ 
			if (YInput.value == "")
			{
				YInput.value="____";
			}
		}
		Span1 = UTILS_CreateElement("span",null,'enable',"/");
		Span2 = UTILS_CreateElement("span",null,'enable',"/");
		DInput.onkeyup = function () 
		{
			if (DInput.value.length == DInput.maxLength)
			{
				if ((MInput.value == "__") || (MInput.value == "____"))
				{
					MInput.focus();
				}
				else
				{
					MInput.select();
				}
			}
		}
		MInput.onkeyup = function () 
		{
			if (MInput.value.length == MInput.maxLength)
			{
				if ((YInput.value == "__") || (YInput.value == "____"))
				{
					YInput.focus();
				}
				else
				{
					YInput.select();
				}
			}
		}
		YInput.onkeyup = function () 
		{
			if (YInput.value.length == YInput.maxLength)
			{
				if ((HInput.value == "__") || (HInput.value == "____"))
				{
					HInput.focus();
				}
				else
				{
					HInput.select();
				}
			}
		}
		Td.appendChild(DInput);
		Td.appendChild(Span1);
		Td.appendChild(MInput);
		Td.appendChild(Span2);
		Td.appendChild(YInput);
		Tr.appendChild(Td);

		Td = UTILS_CreateElement('td');
		HInput.type = "text";
		HInput.size = "1";
		HInput.maxLength="2";
		HInput.value="__";
		HInput.onfocus = function () 
		{ 
			if (HInput.value == "__")
			{
				HInput.value="";
			}
		}
		HInput.onblur = function () 
		{ 
			if (HInput.value == "")
			{
				HInput.value="__";
			}
		}
		MiInput.type = "text";
		MiInput.size = "1";
		MiInput.maxLength="2";
		MiInput.value="__";
		MiInput.onfocus = function () 
		{ 
			if (MiInput.value == "__")
			{
				MiInput.value="";
			}
		}
		MiInput.onblur = function () 
		{ 
			if (MiInput.value == "")
			{
				MiInput.value="__";
			}
		}
		Span1 = UTILS_CreateElement("span",null,'enable',":");
		HInput.onkeyup = function () 
		{
			if (HInput.value.length == HInput.maxLength)
			{
				if ((MiInput.value == "__") || (MiInput.value == "____"))
				{
					MiInput.focus();
				}
				else
				{
					MiInput.select();
				}
			}
		}
		Td.appendChild(HInput);
		Td.appendChild(Span1);
		Td.appendChild(MiInput);
		Tr.appendChild(Td);

		TBody.appendChild(Tr);
	}
	
	RemoveButton = UTILS_CreateElement('input', null, 'button_disabled');
	RemoveButton.value = UTILS_GetText("tourney_remove_round");
	RemoveButton.type = "button";
	RemoveButton.onclick = function () {
		if (SequencedRoundCheckbox.checked == true) {
			return false;
		}

		var i, tam, Row, RNumber;
	 	tam	= TBody.rows.length;
	 	Row = TBody.rows;

		// Remove checked rows
		for (i=tam-1; i>=0; i--)
		{
			if (Row[i].childNodes[0].childNodes[0].checked == true)
			{
				TBody.removeChild(Row[i]);
			}
		}
	 	
		// Fix round numbers
		tam	= TBody.rows.length;
		for (i=tam-1; i>=0; i--)
		{
			RNumber = i+1;
			Row[i].childNodes[1].innerHTML = "Rodada "+ RNumber;
		}
	}
	
	SequencedRoundCheckbox.onchange = function () {
		if (this.checked == true)
		{
			RoundTd.className = 'disable';
			RoundDInput.className = 'no_board_dis';
			RoundMInput.className = 'no_board_dis';
			RoundYInput.className = 'no_board_dis';
			RoundSpan1.className = 'disable';
			RoundSpan2.className = 'disable';
			RoundHInput.className = 'no_board_dis';
			RoundMiInput.className = 'no_board_dis';
			RoundColon.className = 'disable';

			Hr.className = "invisible";
			DTd.className = "th_disable";
			HTd.className = "th_disable";
			RTd.className = "th_disable";

			AddButton.className = "button_disabled";
			RemoveButton.className = "button_disabled";
		
			var i, tam, Row, RNumber;
			tam	= TBody.rows.length;
			Row = TBody.rows;

			// Remove checked rows
			for (i=tam-1; i>=1; i--)
			{
				TBody.removeChild(Row[i]);
			}
		}
		else
		{
			RoundTd.className = 'enable';
			RoundDInput.className = 'no_board_en';
			RoundMInput.className = 'no_board_en';
			RoundYInput.className = 'no_board_en';
			RoundSpan1.className = 'enable';
			RoundSpan2.className = 'enable';
			RoundHInput.className = 'no_board_en';
			RoundMiInput.className = 'no_board_en';
			RoundColon.className = 'enable';

			Hr.className = "visible";
			RTd.className = "th_enable";
			HTd.className = "th_enable";
			DTd.className = "th_enable";
			
			AddButton.className = "button";
			RemoveButton.className = "button";
		}
	}
	
	RoundCheckbox.onchange = function () {
		if (this.checked == true)
		{
			SequencedRoundCheckbox.checked = true;
			SequencedRoundCheckbox.disabled = true;
			
			RoundTd.className = 'disable';
			RoundDInput.className = 'no_board_dis';
			RoundMInput.className = 'no_board_dis';
			RoundYInput.className = 'no_board_dis';
			RoundSpan1.className = 'disable';
			RoundSpan2.className = 'disable';
			RoundHInput.className = 'no_board_dis';
			RoundMiInput.className = 'no_board_dis';
			RoundColon.className = 'disable';

			Hr.className = "invisible";
			DTd.className = "th_disable";
			HTd.className = "th_disable";
			RTd.className = "th_disable";

			AddButton.className = "button_disabled";
			RemoveButton.className = "button_disabled";
		
			var i, tam, Row, RNumber;
			tam	= TBody.rows.length;
			Row = TBody.rows;

			// Remove checked rows
			for (i=tam-1; i>=1; i--)
			{
				TBody.removeChild(Row[i]);
			}
		}
		else
		{
			SequencedRoundCheckbox.checked = false;
			SequencedRoundCheckbox.disabled = false;

			RoundTd.className = 'enable';
			RoundDInput.className = 'no_board_en';
			RoundMInput.className = 'no_board_en';
			RoundYInput.className = 'no_board_en';
			RoundSpan1.className = 'enable';
			RoundSpan2.className = 'enable';
			RoundHInput.className = 'no_board_en';
			RoundMiInput.className = 'no_board_en';
			RoundColon.className = 'enable';

			Hr.className = "visible";
			RTd.className = "th_enable";
			HTd.className = "th_enable";
			DTd.className = "th_enable";
			
			AddButton.className = "button";
			RemoveButton.className = "button";
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

	// RoundDiv
	RoundDiv.appendChild(RoundCheckbox);
	RoundDiv.appendChild(RoundLabel);
	RoundDiv.appendChild(RoundHelpImg);

	// DateInitLeftDiv
	DateInitLeftDiv.appendChild(DateInitLabel);

	// DateLeftDiv
	DateLeftDiv.appendChild(DateLabel);

	// DateRightDiv
	DateRightInputDiv.appendChild(DateInputD);
	DateRightInputDiv.appendChild(DateBarSpan1);
	DateRightInputDiv.appendChild(DateInputM);
	DateRightInputDiv.appendChild(DateBarSpan2);
	DateRightInputDiv.appendChild(DateInputY);

	DateRightDiv.appendChild(DateRightInputDiv);
	DateRightDiv.appendChild(DateFormatLabel);

	// DateDiv
	DateDiv.appendChild(DateLeftDiv)
	DateDiv.appendChild(DateRightDiv)

	// HourLeftDiv
	HourLeftDiv.appendChild(HourLabel);
	
	// HourRightDiv
	HourRightInputDiv.appendChild(HourInputH);
	HourRightInputDiv.appendChild(HourColonSpan);
	HourRightInputDiv.appendChild(HourInputM);

	HourRightDiv.appendChild(HourRightInputDiv);
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
	WaitTimeRightDiv.appendChild(WaitTimeHelpImg);
	
	// WaitTimeDiv
	WaitTimeDiv.appendChild(WaitTimeLeftDiv);
	WaitTimeDiv.appendChild(WaitTimeRightDiv);

	// SubmitPeriodLeftDiv
	SubmitPeriodLeftDiv.appendChild(SubmitPeriodCheckbox);
	SubmitPeriodLeftDiv.appendChild(SubmitPeriodLabel);

	// SPFromLeftDiv
	SPFromLeftDiv.appendChild(SPFromLabel);
	
	// SPFromDateDiv
	SPFromDateInputDiv.appendChild(SPFromDateInputD);
	SPFromDateInputDiv.appendChild(SPFromDateBar1);
	SPFromDateInputDiv.appendChild(SPFromDateInputM);
	SPFromDateInputDiv.appendChild(SPFromDateBar2);
	SPFromDateInputDiv.appendChild(SPFromDateInputY);

	SPFromDateDiv.appendChild(SPFromDateInputDiv);
	SPFromDateDiv.appendChild(SPFromDateFormatLabel);

	// SPFromHourDiv
	SPFromHourInputDiv.appendChild(SPFromHourInputH);
	SPFromHourInputDiv.appendChild(SPFromHourColon);
	SPFromHourInputDiv.appendChild(SPFromHourInputM);

	SPFromHourDiv.appendChild(SPFromHourInputDiv);
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
	SPToDateInputDiv.appendChild(SPToDateInputD);
	SPToDateInputDiv.appendChild(SPToDateBar1);
	SPToDateInputDiv.appendChild(SPToDateInputM);
	SPToDateInputDiv.appendChild(SPToDateBar2);
	SPToDateInputDiv.appendChild(SPToDateInputY);

	SPToDateDiv.appendChild(SPToDateInputDiv);
	SPToDateDiv.appendChild(SPToDateFormatLabel);

	// SPToHourDiv
	SPToHourInputDiv.appendChild(SPToHourInputH);
	SPToHourInputDiv.appendChild(SPToHourColon);
	SPToHourInputDiv.appendChild(SPToHourInputM);

	SPToHourDiv.appendChild(SPToHourInputDiv);
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
	
	// Sequenced Round Table Div
	SequencedRoundTableDiv.appendChild(SequencedRoundTable);

	// Sequenced Round Div
	SequencedRoundDiv.appendChild(SequencedRoundCheckbox);
	SequencedRoundDiv.appendChild(SequencedRoundLabel);
	SequencedRoundDiv.appendChild(SequencedRoundBr);
	SequencedRoundDiv.appendChild(SequencedRoundTableDiv);

	// AddRoundRoundDiv
	RoundButtonDiv.appendChild(AddButton);
	RoundButtonDiv.appendChild(RemoveButton);

	// AdvancedDiv
	AdvancedDiv.appendChild(DescDiv);
	AdvancedDiv.appendChild(SubscribeDiv);
	AdvancedDiv.appendChild(IntervalDiv);
	AdvancedDiv.appendChild(RestrictDiv);
	AdvancedDiv.appendChild(WaitTimeDiv);
	AdvancedDiv.appendChild(SubmitPeriodDiv);

	// DefaultDiv
	DefaultDiv.appendChild(TNameDiv);
	DefaultDiv.appendChild(CatTimeDiv);
	DefaultDiv.appendChild(DateInitDiv);
	DefaultDiv.appendChild(RoundDiv);
	DefaultDiv.appendChild(SequencedRoundDiv);
	DefaultDiv.appendChild(RoundButtonDiv);
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

	Elements.TNameInput = TNameInput;
	Elements.DateInputD = DateInputD;
	Elements.DateInputM = DateInputM;
	Elements.DateInputY = DateInputY;
	Elements.HourInputH = HourInputH;
	Elements.HourInputM = HourInputM;

	Elements.RoundDInput = RoundDInput;
	Elements.RoundMInput = RoundMInput;
	Elements.RoundYInput = RoundYInput;
	Elements.RoundHInput = RoundHInput;
	Elements.RoundMiInput = RoundMiInput;

	Elements.SPFromDateInputD = SPFromDateInputD;
	Elements.SPFromDateInputM = SPFromDateInputM;
	Elements.SPFromDateInputY = SPFromDateInputY;
	Elements.SPFromHourInputH = SPFromHourInputH;
	Elements.SPFromHourInputM = SPFromHourInputM;

	Elements.SPToDateInputD = SPToDateInputD;
	Elements.SPToDateInputM = SPToDateInputM;
	Elements.SPToDateInputY = SPToDateInputY;
	Elements.SPToHourInputH = SPToHourInputH;
	Elements.SPToHourInputM = SPToHourInputM;

	Elements.TBody = TBody;

	Elements.NextField = INTERFACE_NextField;
	Elements.ClearField = INTERFACE_ClearField;
	Elements.FillField = INTERFACE_FillField;

	return {Div:Div, Buttons:Buttons, Elements:Elements}
}

/**
* Jump to next form field if maxLength of current field was reached
*
* @param	Field	Current Field
* @param	NextField Field to be jumped
* @return									none
* @author									Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_NextField(Field,NextField)
{
		if (Field.value.length == Field.maxLength)
		{
			if ((NextField.value == "__") || (NextField.value == "____"))
			{
				NextField.focus();
			}
			else
			{
				NextField.select();
			}
		}
}

/**
* Clear field passed by parameter
*
* @param Field Field to be cleared
* @return									none
* @author									Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ClearField(Field) 
{
	if ((Field.value == "__") || (Field.value == "____"))
	{
		Field.value = "";
	}
}

/**
* If Fields leaves empty then it will be filled
*
* @param Field Field to be filled
* @return									none
* @author									Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_FillField(Field) 
{ 
	if (Field.value == "")
	{
		if (Field.maxLength == 2)
		{
			Field.value = "__";
		}
		else if (Field.maxLength == 4)
		{
			Field.value = "____";
		}
	}
}
