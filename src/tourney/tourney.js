import { WINDOW_CreateTourney } from 'window/window.js';

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

function TOURNEY_OpenCreateTourneyWindow()
{
	if (document.getElementById("CreateTourneyDiv"))
		return;

	var Elements;

	Elements = WINDOW_CreateTourney();

	var DateInputD = Elements.DateInputD;
	var DateInputM = Elements.DateInputM;
	var DateInputY = Elements.DateInputY;
	var HourInputH = Elements.HourInputH;
	var HourInputM = Elements.HourInputM;

	var RoundDInput = Elements.RoundDInput;
	var RoundMInput = Elements.RoundMInput;
	var RoundYInput = Elements.RoundYInput;
	var RoundHInput = Elements.RoundHInput;
	var RoundMiInput = Elements.RoundMiInput;

	var SPFromDateInputD = Elements.SPFromDateInputD;
	var SPFromDateInputM = Elements.SPFromDateInputM;
	var SPFromDateInputY = Elements.SPFromDateInputY;
	var SPFromHourInputH = Elements.SPFromHourInputH;
	var SPFromHourInputM = Elements.SPFromHourInputM;

	var SPToDateInputD = Elements.SPToDateInputD;
	var SPToDateInputM = Elements.SPToDateInputM;
	var SPToDateInputY = Elements.SPToDateInputY;
	var SPToHourInputH = Elements.SPToHourInputH;
	var SPToHourInputM = Elements.SPToHourInputM;

	var TBody = Elements.TBody;

	// Init Date
	DateInputD.onfocus = function() 
	{
		Elements.ClearField(DateInputD);
	};
	DateInputD.onblur = function()
	{
		Elements.FillField(DateInputD);
		if (DateInputD.value == "__")
		{
			if (TBody.rows[0])
			{
				TBody.rows[0].childNodes[2].childNodes[0].value = "__";
			}
		}
	};
	DateInputD.onkeyup = function()
	{
		Elements.NextField(DateInputD, DateInputM);
		if (TBody.rows[0])
		{
			TBody.rows[0].childNodes[2].childNodes[0].value = DateInputD.value;
		}
	};

	DateInputM.onfocus = function() 
	{
		Elements.ClearField(DateInputM);
	};
	DateInputM.onblur = function()
	{
		Elements.FillField(DateInputM);
		if (DateInputM.value == "__")
		{
			if (TBody.rows[0])
			{
				TBody.rows[0].childNodes[2].childNodes[2].value = "__";
			}
		}
	};
	DateInputM.onkeyup = function()
	{
		Elements.NextField(DateInputM, DateInputY);
		if (TBody.rows[0])
		{
			TBody.rows[0].childNodes[2].childNodes[2].value = DateInputM.value;
		}
	};

	DateInputY.onfocus = function() 
	{
		Elements.ClearField(DateInputY);
	};
	DateInputY.onblur = function()
	{
		Elements.FillField(DateInputY);
		if (DateInputY.value == "____")
		{
			if (TBody.rows[0])
			{
				TBody.rows[0].childNodes[2].childNodes[4].value = "____";
			}
		}
	};
	DateInputY.onkeyup = function()
	{
		Elements.NextField(DateInputY, HourInputH);
		if (TBody.rows[0])
		{
			TBody.rows[0].childNodes[2].childNodes[4].value = DateInputY.value;
		}
	};

	HourInputH.onfocus = function() 
	{
		Elements.ClearField(HourInputH);
	};
	HourInputH.onblur = function()
	{
		Elements.FillField(HourInputH);
		if (HourInputH.value == "__")
		{
			if (TBody.rows[0])
			{
				TBody.rows[0].childNodes[3].childNodes[0].value = "__";
			}
		}
	};
	HourInputH.onkeyup = function()
	{
		Elements.NextField(HourInputH, HourInputM);
		if (TBody.rows[0])
		{
			TBody.rows[0].childNodes[3].childNodes[0].value = HourInputH.value;
		}
	};

	HourInputM.onfocus = function() 
	{
		Elements.ClearField(HourInputM);
	};
	HourInputM.onblur = function()
	{
		Elements.FillField(HourInputM);
		if (HourInputM.value == "__")
		{
			if (TBody.rows[0])
			{
				TBody.rows[0].childNodes[3].childNodes[2].value = "__";
			}
		}
	};

	HourInputM.onkeyup = function()
	{
		if (TBody.rows[0])
		{
			TBody.rows[0].childNodes[3].childNodes[2].value = HourInputM.value;
		}
	};

	// First Row
	RoundDInput.onfocus = function() 
	{
		Elements.ClearField(RoundDInput);
	};
	RoundDInput.onblur = function()
	{
		Elements.FillField(RoundDInput);
		if (RoundDInput.value == "__")
		{
			DateInputD.value = "__";
		}
	};
	RoundDInput.onkeyup = function()
	{
		Elements.NextField(RoundDInput, RoundMInput);
		DateInputD.value = RoundDInput.value;
	};

	RoundMInput.onfocus = function() 
	{
		Elements.ClearField(RoundMInput);
	};
	RoundMInput.onblur = function()
	{
		Elements.FillField(RoundMInput);
		if (RoundMInput.value == "__")
		{
			DateInputM.value = "__";
		}
	};
	RoundMInput.onkeyup = function()
	{
		Elements.NextField(RoundMInput, RoundYInput);
		DateInputM.value = RoundMInput.value;
	};

	RoundYInput.onfocus = function() 
	{
		Elements.ClearField(RoundYInput);
	};
	RoundYInput.onblur = function()
	{
		Elements.FillField(RoundYInput);
		if (RoundYInput.value == "____")
		{
			DateInputY.value = "____";
		}
	};
	RoundYInput.onkeyup = function()
	{
		Elements.NextField(RoundYInput, RoundHInput);
		DateInputY.value = RoundYInput.value;
	};

	RoundHInput.onfocus = function() 
	{
		Elements.ClearField(RoundHInput);
	};
	RoundHInput.onblur = function()
	{
		Elements.FillField(RoundHInput);
		if (RoundHInput.value == "__")
		{
			HourInputH.value = "__";
		}
	};
	RoundHInput.onkeyup = function()
	{
		Elements.NextField(RoundHInput, RoundMiInput);
		HourInputH.value = RoundHInput.value;
	};

	RoundMiInput.onfocus = function() 
	{
		Elements.ClearField(RoundMiInput);
	};
	RoundMiInput.onblur = function()
	{
		Elements.FillField(RoundMiInput);
		if (RoundMiInput.value == "__")
		{
			HourInputM.value = "__";
		}
	};

	RoundMiInput.onkeyup = function()
	{
		HourInputM.value = RoundMiInput.value;
	};

	// Subscribe From
	SPFromDateInputD.onfocus = function() 
	{
		Elements.ClearField(SPFromDateInputD);
	};
	SPFromDateInputD.onblur = function()
	{
		Elements.FillField(SPFromDateInputD);
	};
	SPFromDateInputD.onkeyup = function()
	{
		Elements.NextField(SPFromDateInputD, SPFromDateInputM);
	};

	SPFromDateInputM.onfocus = function() 
	{
		Elements.ClearField(SPFromDateInputM);
	};
	SPFromDateInputM.onblur = function()
	{
		Elements.FillField(SPFromDateInputM);
	};
	SPFromDateInputM.onkeyup = function()
	{
		Elements.NextField(SPFromDateInputM, SPFromDateInputY);
	};

	SPFromDateInputY.onfocus = function() 
	{
		Elements.ClearField(SPFromDateInputY);
	};
	SPFromDateInputY.onblur = function()
	{
		Elements.FillField(SPFromDateInputY);
	};
	SPFromDateInputY.onkeyup = function()
	{
		Elements.NextField(SPFromDateInputY, SPFromHourInputH);
	};

	SPFromHourInputH.onfocus = function() 
	{
		Elements.ClearField(SPFromHourInputH);
	};
	SPFromHourInputH.onblur = function()
	{
		Elements.FillField(SPFromHourInputH);
	};
	SPFromHourInputH.onkeyup = function()
	{
		Elements.NextField(SPFromHourInputH, SPFromHourInputM);
	};

	SPFromHourInputM.onfocus = function() 
	{
		Elements.ClearField(SPFromHourInputM);
	};
	SPFromHourInputM.onblur = function()
	{
		Elements.FillField(SPFromHourInputM);
	};

	// Subscribe To
	SPToDateInputD.onfocus = function() 
	{
		Elements.ClearField(SPToDateInputD);
	};
	SPToDateInputD.onblur = function()
	{
		Elements.FillField(SPToDateInputD);
	};
	SPToDateInputD.onkeyup = function()
	{
		Elements.NextField(SPToDateInputD, SPToDateInputM);
	};

	SPToDateInputM.onfocus = function() 
	{
		Elements.ClearField(SPToDateInputM);
	};
	SPToDateInputM.onblur = function()
	{
		Elements.FillField(SPToDateInputM);
	};
	SPToDateInputM.onkeyup = function()
	{
		Elements.NextField(SPToDateInputM, SPToDateInputY);
	};

	SPToDateInputY.onfocus = function() 
	{
		Elements.ClearField(SPToDateInputY);
	};
	SPToDateInputY.onblur = function()
	{
		Elements.FillField(SPToDateInputY);
	};
	SPToDateInputY.onkeyup = function()
	{
		Elements.NextField(SPToDateInputY, SPToHourInputH);
	};

	SPToHourInputH.onfocus = function() 
	{
		Elements.ClearField(SPToHourInputH);
	};
	SPToHourInputH.onblur = function()
	{
		Elements.FillField(SPToHourInputH);
	};
	SPToHourInputH.onkeyup = function()
	{
		Elements.NextField(SPToHourInputH, SPToHourInputM);
	};

	SPToHourInputM.onfocus = function() 
	{
		Elements.ClearField(SPToHourInputM);
	};
	SPToHourInputM.onblur = function()
	{
		Elements.FillField(SPToHourInputM);
	};

	Elements.TNameInput.focus();
}
