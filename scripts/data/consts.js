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
* Constants definition
*/

function DATA_SetConsts()
{
	var Const = new Object();

	// Iq id's
	Const.IQ_ID_GetUserList = "GetUserList";
	Const.IQ_ID_GetRoomList = "GetRoomList";
	Const.IQ_ID_GetGamesList = "GetGamesList";
	Const.IQ_ID_GetRating = "GetRating";
	Const.IQ_ID_GetRooms = "GetRoomList";
	Const.IQ_ID_Challenge = "Challenge";
	Const.IQ_ID_GameMove = "GameMove";
	Const.IQ_ID_GameDraw = "GameDraw";
	Const.IQ_ID_GameCancel = "GameCancel";
	Const.IQ_ID_GameAdjourn = "GameAdjourn";
	Const.IQ_ID_GameResign = "GameResign";
	Const.IQ_ID_SearchUser = "SearchUser";
	Const.IQ_ID_KickUser = "KickUser";
	Const.IQ_ID_GetProfile = "GetProfile";
	Const.IQ_ID_GamePhoto = "GetGamePlayerPhoto";
	
	// Login errors
	Const.LOGIN_ServerDown = 1;
	Const.LOGIN_ConnectionRefused = 2;
	Const.LOGIN_InvalidUser = 3;

	return Const;
}
