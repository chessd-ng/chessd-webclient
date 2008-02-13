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
	var Div, Title, Close;
	var Username, Label;
	var ChalLeftDiv;
	var ColorLabel, ColorOptW, ColorOptWImg, Color;
	var ChalRightDiv;

	Div = UTILS_CreateElement('div','ChallengeDiv');
	Title = UTILS_CreateElement('span','title');
	Close = UTILS_CreateElement('span','window_close');
	Username = UTILS_CreateElement('h3');
	Label = UTILS_CreateElement('p',null,'label_information');
	ChalLeftDiv = UTILS_CreateElement('div','ChalLeftDiv');
	ChalRightDiv = UTILS_CreateElement('div','ChalRightDiv');

}
