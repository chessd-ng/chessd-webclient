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
* @file		message.js
* @brief	Contain all functions to create XMPP messages
*
* Create all messages used both Jabber and Chess Server (see Chess server XMPP protocol)
*
*/


/**
* @brief	Append XMPP body to messages (used to BOSH control)
* @param	Msg	XMPP message to send
*
* @return	XMPP message with body tag
* @author	Pedro Rocha
*/
function MESSAGE_MakeXMPP(Msg)
{
	var XMPP;
	

	if (Msg != "")
	{
		XMPP = "<body rid='"+MainData.GetRID()+"' sid='"+MainData.GetSID()+"' xmlns='http://jabber.org/protocol/httpbind'>"+Msg+"</body>";
	}
	else
	{
		XMPP = '<body rid="'+MainData.GetRID()+'" sid="'+MainData.GetSID()+'" xmlns="http://jabber.org/protocol/httpbind"/>';
	}

	return XMPP;
}

/**
* @brief	Create a terminate connection with BOSH message
*
* @param	Unavailable	Message with presence unavailable to Jabber or rooms
* @return	XMPP message
* @author	Pedro Rocha
*/
function MESSAGE_EndConnection(Unavailable)
{
	var XMPP = "<body type='terminate' rid='"+MainData.GetRID()+"' sid='"+MainData.GetSID()+"' xmlns='http://jabber.org/protocol/httpbind' >"+Unavailable+"</body>";

	return XMPP;
}

/**
* @brief	Create a wait message
*
* This message is used to make a pesistent conection to BOSH. In certain interval of time, this message is send to notificate BOSH that client is still connected.
*
* @return	Empty string
* @author	Pedro Rocha
*/
function MESSAGE_Wait()
{
    return "";
}


/**********************************
 * MESSAGES - CONNECTION 
 **********************************/

/**
* @brief	Create first message to open a connection with Jabber
*
* @return	XMPP message
* @author	Pedro Rocha
*/
function MESSAGE_StartConnection()
{
	var XMPP = "<body hold='1' rid='"+MainData.GetRID()+"' to='"+MainData.GetHost()+"' ver='1.6' wait='10' xml:lang='en' xmlns='http://jabber.org/protocol/httpbind'/>";

	return XMPP;
}

/**
* @brief	Create message with first authentication step
*
* This message contais the first message to authenticate a user. Send username.
*
* @return	XMPP message
* @author	Pedro Rocha
*/
function MESSAGE_SendUsername()
{
	var XMPP;
	var MyUsername = MainData.GetUsername();

	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' id='auth_1' to='"+MainData.GetHost()+"'>";
	XMPP += "<query xmlns='jabber:iq:auth'>";
	XMPP += "<username>"+MyUsername+"</username>";
	XMPP += "</query></iq>";

	return XMPP;
}

/**
* @brief	Create message with second authentication step
*
* Send username again, password and resource.
*
* @return	XMPP message
* @author	Pedro Rocha
*/
function MESSAGE_SendPasswd()
{
	var XMPP;
	var MyUsername = MainData.GetUsername();
	
	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' id='auth_2' to='"+MainData.GetHost()+"' >";
	XMPP += "<query xmlns='jabber:iq:auth'>";
	XMPP += "<username>"+MyUsername+"</username>";
	XMPP += "<password>"+MainData.GetPassword()+"</password>";
	XMPP += "<resource>"+MainData.GetResource()+"</resource></query></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - USER AND ROOM LIST
 **********************************/

/**
* @brief	Create a messate to ask for user's jabber contact list
*
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_UserList()
{
	var XMPP;
	
	var Consts = MainData.GetConst();

   	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' id='"+Consts.IQ_ID_GetUserList+"'>";
	XMPP += "<query xmlns='jabber:iq:roster'/></iq>";

	return XMPP;
}

/**
* @brief	Create a message to ask for room list to jabber
*
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_RoomList()
{
	var XMPP;
	var Consts = MainData.GetConst();

   	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' id='"+Consts.IQ_ID_GetRoomList+"' to='"+MainData.GetConferenceComponent()+"."+MainData.GetHost()+"'>";
	XMPP += "<query xmlns='http://jabber.org/protocol/disco#items'/></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - PRESENCE
 **********************************/
	
/**
* @brief	Create a message with Jabber presence
*
* If 'To' isn't passed, send your presence to jabber, otherwise send presence to 'To' destiny
*
* @param	To		Room's JID
* @return	XMPP message
* @author	Ulysses Bomfim
*/
function MESSAGE_Presence(To)
{
	var XMPP;
	var MyUsername = MainData.GetUsername();
	var MyUser = MainData.GetUser(MyUsername);
	var MyUserStatus = MyUser.GetStatus();

	XMPP = "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' from='"+MyUsername+"@"+MainData.GetHost()+"' ";

	// Presence to someone
	if (To != null)
	{
		XMPP += "to='"+To+"' ";
	}
	XMPP += ">";

	// Setting user status
	if (MyUserStatus != "available")
	{
		XMPP += "<show>"+MyUserStatus+"</show>";
	}

	XMPP += "</presence>";

	return XMPP;
}

/**
* @brief	Create a message to change user's status
*
* @param	NewStatus	New user's status
* @param	RoomName	Room's name 
* @return	XMPP message
* @see		scripts/contact/status.js for user's status types
* @author	Ulysses Bomfim
*/
function MESSAGE_ChangeStatus(NewStatus, RoomName)
{
	var XMPP;
	var MyUsername = MainData.GetUsername();

	// Message to room - Change status in some room
	if (RoomName)
	{
		if (NewStatus == "available")
		{
			XMPP = "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' to='"+RoomName+"/"+MyUsername+"' />";
		}
		else
		{
			XMPP = "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' to='"+RoomName+"/"+MyUsername+"' ><show>"+NewStatus+"</show></presence>";
		}
	}
	
	// General status change
	else
	{
		if (NewStatus == "available")
		{
			XMPP = "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' xmlns='jabber:client' />";
		}
		else
		{
			XMPP = "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' xmlns='jabber:client'><show>"+NewStatus+"</show></presence>";
		}
	}
	return XMPP;
}


/**
* @brief	Create message to logout on jabber or leave from some room
*
* @param	RoomName	Room's name 
* @return	XMPP message
* @author	Ulysses Bomfim
*/
function MESSAGE_Unavailable(RoomName)
{
	var XMPP = "";
	var Type = null;

	// Exit from a room
	if (RoomName)
	{
		XMPP = "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' to='"+RoomName+"' xmlns='jabber:client' type='unavailable'></presence>";
	}
	else // Exit from jabber
	{
		XMPP = "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' xmlns='jabber:client' type='unavailable'></presence>";
	}
	return XMPP;
}

/**********************************
 * MESSAGES - CHAT AND GROUPCHAT
 **********************************/

/**
* @brief	Create a chat message
*
* @param	To		Message user destiny
* @param	Message		Chat text
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_Chat(To, Message)
{
	var XMPP;

	XMPP  = "<message xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' to='"+To+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' type='chat'>"
	XMPP += "<body>"+Message+"</body>";
	XMPP += "</message>";

	return XMPP;
}

/**
* @brief	Create a groupchat message
*
* @param	To		Room's JID
* @param	Message		Room chat text
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_GroupChat(To, Message)
{
	var XMPP;

	XMPP  = "<message xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' to='"+To+"' type='groupchat'>"
	XMPP += "<body>"+Message+"</body>";
	XMPP += "</message>";

	return XMPP;
}

/**********************************
 * MESSAGES - RATING AND USER TYPE
 **********************************/

/**
* @brief	Create message to get user's ratings
*
* @param	User	User's name
* @return	XMPP message
* @author	Rubens Suguimoto
* @deprecated
*/
function MESSAGE_Info(User)
{
	var XMPP;
	var Consts = MainData.GetConst();
	var MyUsername = MainData.GetUsername();

	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' from='"+MyUsername+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GetRating+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#info'>";
	XMPP += "<rating jid='"+User+"@"+MainData.GetHost()+"' />";
	XMPP += "<type jid='"+User+"@"+MainData.GetHost()+"' />";
	XMPP += "</query></iq>";
	
	return XMPP;
}

/**
* @brief	Create message to get user's ratings profile
*
* @param	User	User's name
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_InfoProfile(User)
{
	var XMPP;
	var Consts = MainData.GetConst();
	var MyUsername = MainData.GetUsername();

	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' from='"+MyUsername+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GetRating+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#profile'>";
	XMPP += "<profile jid='"+User+"@"+MainData.GetHost()+"' />";
	XMPP += "</query></iq>";
	
	return XMPP;
}


/**********************************
 * MESSAGES - INVITE
 **********************************/

/**
* @brief 	Create message to send a invite to add some user to contact list
* 
* @param	To	User's name to invite destiny
* @return	XMPP message
* @author	Ulysses Bomfim
*/
function MESSAGE_Invite(To)
{
	 return "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='subscribe' to='"+To+"@"+MainData.GetHost()+"' />"; 
}

/**
* @brief	Create message to send a accept invite to other user
* 
* @param	To	User's name to accept invite
* @return	XMPP message
* @author	Ulysses Bomfim
*/
function MESSAGE_InviteAccept(To)
{
	return "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='subscribed' to='"+To+"@"+MainData.GetHost()+"' />";
}

/**
* @brief	Create message to send a resign invite to other user
* 
* @param	To	User's name to resign invite
* @return	XMPP message
* @author	Ulysses Bomfim
*/
function MESSAGE_InviteDeny(To)
{
	return "<presence xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='unsubscribed' to='"+To+"@"+MainData.GetHost()+"' />";
}

/**
* @brief	Create message to remove user from your contact list
* @param	User	User's name to resign invite
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_RemoveContact(User)
{
	var XMPP;

	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' id='RemoveUser'>";
	XMPP += "<query xmlns='jabber:iq:roster'>";
	XMPP += "<item subscription='remove' jid='"+User+"@"+MainData.GetHost()+"' />";
	XMPP += "</query></iq>";

	return XMPP;
}


/**********************************
 * MESSAGES - CHALLENGE
 **********************************/

/**
* @brief 	Create message to send a challenge message
*
* Should be extended to support Bughouse with more two players.
* The Player's structure has the following fields:
*  - Name
*  - Color
*  - Inc
*  - Time
* The 'Color' field must contain just the first letter of color
*
* @param	ChallengeID	Challenge identification number (integer)
* @param	Category	Game cateory
* @param	Rated		Game rated flag
* @param 	Players		List of Players Object(with username, color, increment, time)
* @param	MatchID		Match identification number (integer)
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_Challenge(ChallengeID, Category, Rated, Players, MatchID)
{
	var i;
	var Id;
	var XMPP = "";

	var Consts = MainData.GetConst();

	// Setting iq's id
	if(ChallengeID == null)
	{
		Id = Consts.IQ_ID_Challenge;
	}
	else
	{
		Id = ChallengeID;
	}

	// Tag the id with the challenged player's name
	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Id+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#match#offer'>";

	// Game offer
	if (MatchID == null)
	{
		XMPP += "<match category='"+Category+"' rated='"+Rated+"' >";
	}
	// Reoffer
	else 
	{
		XMPP += "<match category='"+Category+"' rated='"+Rated+"' id='"+MatchID+"' >";
	}

	// Creating players tags
	for (i=0; i < Players.length; i++)
	{
		// If player color was chose
		if (Players[i].Color != "")
		{
			XMPP += "<player jid='"+Players[i].Name+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' time='"+Players[i].Time+"' inc='"+Players[i].Inc+"' color='"+Players[i].Color+"' />";
		}
		else
		{
			XMPP += "<player jid='"+Players[i].Name+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' time='"+Players[i].Time+"' inc='"+Players[i].Inc+"' />";
		}
	}
	XMPP += "</match></query></iq>";
	
	return XMPP;
}


/**
* @brief	Create a accept a challenge message
*
* @param	ChallengeID	Challenge identification number (integer)
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_ChallengeAccept(ChallengeID)
{
	var XMPP="";
	var Consts = MainData.GetConst();

	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_Challenge+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#match#accept'>";
	XMPP += "<match id='"+ChallengeID+"'>";
	XMPP += "</match></query></iq>";

	return XMPP;
}


/**
* @brief	Create a decline a challenge message
*
* @param	ChallengeID	Challenge identification number (integer)
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_ChallengeDecline(ChallengeID)
{
	var XMPP="";
	var Consts = MainData.GetConst();

	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_Challenge+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#match#decline'>";
	XMPP += "<match id='"+ChallengeID+"'>";
	XMPP += "</match></query></iq>";

	return XMPP;
}

/**
* @brief	Create a message to get a adjourn games list
*
* @param	Num		Number of adjourned games to get (integer)
* @param	Offset		Offset base of adjourn list
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_ChallengeGetAdjournList(Num, Offset)
{
	var XMPP="";

	XMPP += "<iq type='get' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='get_adj'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#adjourned#list'>";
	XMPP += "<search results='"+Num+"' offset='"+Offset+"'/>";
	XMPP += "</query></iq>";

	return XMPP;
}

/**
* @brief	Create a message to resume some adjourned game
* @param	Id		Adjourned game identification number (integer)
* @param	ChallengeId	XMPP challenge identification number (integer)
* @return	XMPP message
* @author	Rubens Suguimoto
*/
function MESSAGE_ChallengeResumeGame(Id, ChallengeId)
{
	var XMPP = "";
	XMPP += "<iq to='"+MainData.GetServer()+"."+MainData.GetHost()+"' type='set' id='"+ChallengeId+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#match#offer'>";
	XMPP += "<match adjourned_id='"+Id+"'/>";
	XMPP += "</query></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - GAME
 **********************************/

/**
* @brief	Create message to get the list of all games been played
* 
* @return	XMPP message
* @author 	Ulysses Bomfim
*/
function MESSAGE_GameRoomList()
{
	var XMPP;
	var Consts = MainData.GetConst();

   	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' id='"+Consts.IQ_ID_GetGamesList+"' to='"+MainData.GetServer()+"."+MainData.GetHost()+"'>";
	XMPP += "<query xmlns='http://jabber.org/protocol/disco#items'/></iq>";

	return XMPP;
}

/**
* @brief	Create message to get the list information of all games  been played
* 
* @param	Room	Room's name
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameRoomInfoList(Room)
{
	var XMPP;
	var Consts = MainData.GetConst();

	XMPP  = "<iq type='get' to='"+Room+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameInfo+"'>";
	XMPP += "<query xmlns='http://jabber.org/protocol/disco#info'/></iq>";

	return XMPP;
}

/**
* @brief	Create message used to check if some game exists
* 
* @param	Room	Room's name
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameEnterRoom(Room)
{
	var XMPP;
	var Consts = MainData.GetConst();

	XMPP  = "<iq type='get' to='"+Room+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameEnterRoom+"'>";
	XMPP += "<query xmlns='http://jabber.org/protocol/disco#info'/></iq>";

	return XMPP;
}

/**
* @brief	Create a message to send a game move
*
* @param	Move		Chess Move
* @param	GameID		Game room name Identification
* @param	Promotion	Promotion piece used to change pawn
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameMove(Move, GameID, Promotion)
{
	var XMPP="";
	var Consts = MainData.GetConst();

	XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameMove+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#move'>";
	XMPP += "<move long='"+Move+Promotion+"'>";
	XMPP += "</move></query></iq>";

	return XMPP;
}

/**
* @brief	Make a draw request
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameRequestDraw (GameID)
{
	return (MESSAGE_GameRequests("Draw", GameID));
}

/**
* @brief	Make a cancel request
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameRequestCancel (GameID)
{
	return (MESSAGE_GameRequests("Cancel", GameID));
}

/**
* @brief	Make a adjourn request
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameRequestAdjourn (GameID)
{
	return (MESSAGE_GameRequests("Adjourn", GameID));
}

/**
* @brief	Make a resign message
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameResign (GameID)
{
	return (MESSAGE_GameRequests("Resign", GameID));
}

/**
* @brief	Create the game action requests messages to opponent
*
* Action can be "Draw", "Cancel", "Adjourn" and "Resign".
*
* @param	Action		String with action to do when playing some game
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameRequests(Action, GameID)
{
	var XMPP = "";
	var Consts = MainData.GetConst();

	switch (Action) 
	{
		case "Draw":
			XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameDraw+"'>";
			XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#draw'>";
			break;

		case "Cancel":
			XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameCancel+"'>";
			XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#cancel'>";
			break;

		case "Adjourn":
			XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameAdjourn+"'>";
			XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#adjourn'>";
			break;
	
		case "Resign":
			XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameResign+"'>";
			XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#resign'>";
			break;
	
		default:
			break;
	}

	XMPP += "</query></iq>";

	return XMPP;
}


/**
* @brief	Make a draw accept
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameDrawAccept (GameID)
{
	return (MESSAGE_GameResponse("Draw", GameID, ""));
}

/**
* @brief	Make a draw deny
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameDrawDeny (GameID)
{
	return (MESSAGE_GameResponse("Draw", GameID, "-decline"));
}

/**
* @brief	Make a cancel accept
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameCancelAccept (GameID)
{
	return (MESSAGE_GameResponse("Cancel", GameID, ""));
}

/**
* @brief	Make a cancel deny
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameCancelDeny (GameID)
{
	return (MESSAGE_GameResponse("Cancel", GameID, "-decline"));
}

/**
* @brief	Make a adjourn accept
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameAdjournAccept (GameID)
{
	return (MESSAGE_GameResponse("Adjourn", GameID, ""));
}

/**
* @brief	Make a adjourn deny
*
* @param	GameID		Game room name Identification
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameAdjournDeny (GameID)
{
	return (MESSAGE_GameResponse("Adjourn", GameID, "-decline"));
}

/**
* @brief	Create the game actions response messages
*
* Action can be "Draw", "Cancel" and "Adjourn".
*
* @param	Action		String with action to do when playing some game
* @param	GameID		Game room name Identification
* @param	Response	Create a response with accept ou decline ("" = accept or "-decline" = decline)
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameResponse(Action, GameID, Response)
{
	var XMPP="";
	var Consts = MainData.GetConst();

	switch (Action) 
	{
		case "Draw":
			XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameDraw+"'>";
			XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#draw"+Response+"'>";
			break;

		case "Cancel":
			XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameCancel+"'>";
			XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#cancel"+Response+"'>";
			break;

		case "Adjourn":
			XMPP  = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+GameID+"@"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GameAdjourn+"'>";
			XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#game#adjourn"+Response+"'>";
			break;
	
		default:
			break;
	}

	XMPP += "</query></iq>";

	return XMPP;
}

/**
* @brief	Create message to search for your's current games
*
* @return	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GameSearchCurrentGame()
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	var MyUsername = MainData.GetUsername();

	XMPP += "<iq type='get' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_SearchCurrentGame+"'>";
	XMPP += "<search xmlns='http://c3sl.ufpr.br/chessd#game'>";
	XMPP += "<game>";

	XMPP += "<player jid='"+MyUsername+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"'/>";

	XMPP += "</game></search></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - SEARCH USER
 **********************************/



/**
* @brief	Make a search user message
*
* @param	Username	User's name
* @param	Option		Option to select by username or full name(0 = username or 1 = full name)
* @return 	XMPP message
* @author	Danilo Kiyoshi Simizu Yorinori
*/
function MESSAGE_SearchUser(Username, Option)
{
	var XMPP="";
	var Consts = MainData.GetConst();
	
	XMPP = "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' to='"+MainData.GetSearchComponent()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_SearchUser+"' >";
	XMPP +=	"<query xmlns='jabber:iq:search'>";
	XMPP += "<x xmlns='jabber:x:data' type='submit' >";
	if (Option == 0)
	{
		XMPP += "<field type='text-single' var='user' >";
		XMPP += "<value>"+Username+"*</value>";
		XMPP += "</field>";
	}
	if (Option == 1)
	{
		XMPP += "<field type='text-single' var='fn' >";
		XMPP += "<value>"+Username+"*</value>";
		XMPP +=	"</field>";
	}
	/*Fields that could be used
		<field type="text-single" var="given" >
		<value></value>
		</field>
		<field type="text-single" var="middle" >
		<value></value>
		</field>
		<field type="text-single" var="family" >
		<value></value>
		</field>
		<field type="text-single" var="nickname" >
		<value></value>
		</field>
		<field type="text-single" var="bday" >
		<value></value>
		</field>
		<field type="text-single" var="ctry" >
		<value></value>
		</field>
		<field type="text-single" var="locality" >
		<value></value>
		</field>
		<field type="text-single" var="email" >
		<value></value>
		</field>
		<field type="text-single" var="orgname" >
		<value></value>
		</field>
		<field type="text-single" var="orgunit" >
		<value></value>
		</field>
	*/
	XMPP +=	"</x></query></iq>";

	return XMPP;
}


/**********************************
 * MESSAGES - ADMIN 
 **********************************/

/**
* @brief	Create a message to admin kick a user from some room
* 
* @param 	Room 	The room that the target user is
* @param 	To 	Nick name of the target user in room
* @param 	Role 	User's privilege in room
* @param 	Reason 	Why the user will be kicked
* @return 	XMPP message
* @author 	Ulysses Bomfim
*/
function MESSAGE_KickUserRoom (Room, To, Role, Reason)
{
	var XMPP = "";
	var Consts = MainData.GetConst();

	XMPP += "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' id='"+Consts.IQ_ID_KickUserRoom+"' to='"+Room+"@"+MainData.GetConferenceComponent()+"."+MainData.GetHost()+"' type='set' >";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/protocol/muc#admin' >";
	XMPP += "<item nick='"+To+"' role='"+Role+"' />";
	XMPP += "<reason>"+Reason+"</reason>";
	XMPP += "</query></iq>";
	
	return XMPP;
}

/**
* @brief	Create a message to kick a user from jabber
*
* @param 	Username	User's name
* @param	Reason		Reason to kick this user
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_KickUser(Username, Reason)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_KickUser+"'>";
	XMPP += "<kick xmlns='"+MainData.GetXmlns()+"/chessd#admin' jid='"+Username+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"'>";
	XMPP += "<reason>"+Reason+"</reason>";
	XMPP += "</kick></iq>";
	
	return XMPP;
}

/**
* @brief	Create a message to ban a user from jabber
*
* @param 	Username	User's name
* @param	Reason		Reason to ban this user
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_BanUser(Username, Reason)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"/"+MainData.GetResource()+"' id='"+Consts.IQ_ID_BanUser+"'>";
	XMPP += "<ban xmlns='"+MainData.GetXmlns()+"/chessd#admin' jid='"+Username+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"'>";
	XMPP += "<reason>"+Reason+"</reason>";
	XMPP += "</ban></iq>";
	
	return XMPP;
}

/**
* @brief 	Create message to unban user from jabber.
*
* @param 	Username	User's name
* @param	Reason		Reason to unban this user
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_UnbanUser(Username, Reason)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"/"+MainData.GetResource()+"' id='"+Consts.IQ_ID_UnbanUser+"'>";
	XMPP += "<unban xmlns='"+MainData.GetXmlns()+"/chessd#admin' jid='"+Username+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"'>";
	XMPP += "<reason>"+Reason+"</reason>";
	XMPP += "</unban></iq>";
	
	return XMPP;
}

/**
* @brief	 Create message to get a list of all banned users
*
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GetBanList()
{
	var XMPP = "";
	var Consts = MainData.GetConst();

	XMPP += "<iq type='get' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GetBanList+"'>"
	XMPP += "<banned-list xmlns='"+MainData.GetXmlns()+"/chessd#admin'/>"
	XMPP += "</iq>"

	return XMPP;
}

/**
* @brief	 Create message to get a list of banned words
*
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_GetBannedWords()
{
	var XMPP = "";
	var Consts = MainData.GetConst();


	XMPP += "<iq type='get' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GetBannedWords+"'>";
	XMPP += "<banned-words-list xmlns='"+MainData.GetXmlns()+"/chessd#admin'/>";
	XMPP += "</iq>";

	return XMPP;
}

/**
* @brief	Create a message to ban one word
*
* @param	Word		Word string
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_AddBannedWord(Word)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	
	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_AddBannedWords+"'>";
	XMPP += "<ban-word xmlns='"+MainData.GetXmlns()+"/chessd#admin'>";
	XMPP += "<word word='"+Word+"' />";
	XMPP += "</ban-word>";
	XMPP += "</iq>";

	return XMPP;
}

/**
* @brief	Create a message to unban some word
*
* @param	Word		Word string
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/
function MESSAGE_RemoveBannedWord(Word)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	
	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_RemoveBannedWords+"'>";
	XMPP += "<unban-word xmlns='"+MainData.GetXmlns()+"/chessd#admin'>";
	XMPP += "<word word='"+Word+"'/>";
	XMPP += "</unban-word></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - PROFILE - vCard
**********************************/

/**
* @brief	Create a message to get profile of some user
*
* @param	Username	User's name
* @param	Id		XMPP identification attribute
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_GetProfile(Username, Id)
{
	var XMPP = "";
	var Consts = MainData.GetConst();

	if (Id == null)
	{
		Id = Consts.IQ_ID_GetProfile;
	}

	XMPP += "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' to='"+Username+"@"+MainData.GetHost()+"' id='"+Id+"'>";
	XMPP += "<vCard xmlns='vcard-temp' prodid='-//HandGen//NONSGML vGen v1.0//EN' version='2.0' />";
	XMPP += "</iq>";

	return XMPP;
}

/**
* @brief	Create a message to set your profile in Jabber
*
* @param	Username	User's name
* @param	FullName	User's full name
* @param	Desc		User's description
* @param	ImgType		User's image type (png, jpg, bmp...)
* @param	Img64		User's image in base 64
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_SetProfile(Username, FullName, Desc, ImgType, Img64)
{
	var XMPP = "";
	XMPP += "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='set' >";
	XMPP += "<vCard xmlns='vcard-temp' prodid='-//HandGen//NONSGML vGen v1.0//EN' version='2.0'>";
	XMPP += "<FN>"+FullName+"</FN>";
	XMPP += "<DESC>"+Desc+"</DESC>";
	XMPP += "<PHOTO>"
	XMPP += "<TYPE>"+ImgType+"</TYPE>"
	XMPP += "<BINVAL>"+Img64+"</BINVAL>"
	XMPP += "</PHOTO></vCard></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - SEARCH OLDGAME
 **********************************/
/**
* @brief	Create a message to get old games list with some filters
*
* @param 	Id		Oldgame window Id (Quick fix)
* @param	Jid1		First player username
* @param	Jid2		Second player username
* @param	NumGames	Number of games to be search
* @param	Offset		List off set of old games
* @param	Color		First player color (if not defined, search for all colors)
* @param	From		Date begin interval (if not defined, is considerate infinit)
* @param	To		Date end interval (if not defined, is considerate infinit)
* @return 	XMPP message
* @author 	Rubens Suguimoto and Danilo Yorinori
*/ 
function MESSAGE_GetOldGames(Id,Jid1, Jid2, NumGames, Offset, Color, To, From)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	XMPP += "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' type='get' id='"+Consts.IQ_ID_OldGameSearch+"-"+Id+"' to='"+MainData.GetServer()+"."+MainData.GetHost()+"'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#search_game'>";
	XMPP += "<search results='"+NumGames+"' offset='"+Offset+"'>";
	if (Jid1 != "")
	{
		if (Color != undefined && Color != "") 
		{
			XMPP += "<player jid='"+Jid1+"@"+MainData.GetHost()+"' role='"+Color+"' />";
		}
		else
		{
			XMPP += "<player jid='"+Jid1+"@"+MainData.GetHost()+"' />";
		}
	}
	if (Jid2 != "")
	{
		XMPP += "<player jid='"+Jid2+"@"+MainData.GetHost()+"' />";
	}
	if (((To != undefined ) && ( To != "")) ||  ((From != undefined) && (From != "")))
	{
		XMPP += "<date ";
		if ((From != undefined ) && ( From != ""))
		{
			XMPP += "begin='"+From+"' ";	
		}
		if ((To != undefined ) && ( To != ""))
		{
			XMPP += "end='"+To+"' ";	
		}
		XMPP += "/>";
	}
	XMPP += "</search></query></iq>";

	return XMPP;
}

/**
* @brief	Create a message to see some old game
*
* @param 	OldGameId		Oldgame identification number (integer)
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_FetchOldGame(OldGameId)
{
	var XMPP = "";
	XMPP += "<iq xml:lang='"+UTILS_JabberLang(MainData.GetLang())+"' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' type='get' id='get_rating'>";
	XMPP += "<query xmlns='"+MainData.GetXmlns()+"/chessd#fetch_game'>";
	XMPP += "<game id='"+OldGameId+"'/>";
	XMPP += "</query></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - ANNOUNCE CHALLENGES
 **********************************/
/**
* @brief	Create a message to announce a match
*
* @param	Player		Player Object(Username, color, time, increment)
* @param	Rated		Rated game flag
* @param	Category	Game category
* @param	Min		Minimum rating interval
* @param	Max		Maximun rating interval
* @param	Autoflag	Flag to set game over when some player time's end
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_AnnounceMatch(Player, Rated, Category, Min, Max, Autoflag)
{
	var XMPP = "";
	var Consts = MainData.GetConst();

	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_AnnounceMatch+"'>";
	XMPP += "<create xmlns='http://c3sl.ufpr.br/chessd#match_announcement'>";
	XMPP += "<announcement rated='"+Rated+"' category='"+Category+"' autoflag='"+Autoflag+"' ";
	if (Min != "")
	{
		XMPP += "minimum_rating='"+Min+"' ";
	}
	if (Max != "")
	{
		XMPP += "maximum_rating='"+Max+"' ";
	}
	XMPP += ">";

	if(Player.Color == "")
	{
		XMPP += "<player jid='"+Player.Name+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' time='"+Player.Time+"' inc='"+Player.Inc+"' />";
	}
	else
	{
		XMPP += "<player jid='"+Player.Name+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' time='"+Player.Time+"' inc='"+Player.Inc+"' color='"+Player.Color+"'/>";
	}

	XMPP += "</announcement></create></iq>";

	return XMPP;
}

/**
* @brief	Create a message get announced matchs list with some parameters
*
* @param	Offset		List off set of announced matchs
* @param	NumResult	Number of announced matchs to be get
* @param	Category	Game category
* @param	MinTime		Minimum time interval
* @param	MaxTime		Maximun time interval
* @param	User		Flag to check if you want to get your's own announces
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_GetAnnounceMatch(Offset, NumResult, MinTime, MaxTime, Category, User)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	var MyUsername = MainData.GetUsername();

	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_GetAnnounceMatch+"'>";
	XMPP += "<search xmlns='http://c3sl.ufpr.br/chessd#match_announcement'>";
	XMPP += "<parameters offset='"+Offset+"' results='"+NumResult+"' ";
	
	if(MinTime != "")
	{
		XMPP += "minimum_time='"+MinTime+"' ";
	}

	if(MaxTime != "")
	{
		XMPP += "maximum_time='"+MaxTime+"' ";
	}

	if(Category != "")
	{
		XMPP += "category='"+Category+"' ";
	}

	if (User == true)
	{
		XMPP += "player='"+MyUsername+"@"+MainData.GetHost()+"/"+MainData.GetResource()+"' />";
	}
	else
	{
		XMPP += "/>";
	}
	XMPP += "</search></iq>";

	return XMPP;
}

/**
* @brief	Create a message cancel one of your announced match
*
* @param	Id		Announce match identification number
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_RemoveAnnounceMatch(Id)
{
	var XMPP = "";
	var Consts = MainData.GetConst();

	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_RemoveAnnounceMatch+"'>";
	XMPP += "<delete xmlns='http://c3sl.ufpr.br/chessd#match_announcement'>";
	XMPP += "<announcement id='"+Id+"'/>";
	XMPP += "</delete></iq>";

	return XMPP;
}

/**
* @brief	Create a message accept some announced match
*
* @param	Id		Announce match identification number
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_AcceptAnnounceMatch(Id)
{
	var XMPP = "";
	var Consts = MainData.GetConst();

	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_AcceptAnnounceMatch+"'>";
	XMPP += "<accept xmlns='http://c3sl.ufpr.br/chessd#match_announcement'>";
	XMPP += "<announcement id='"+Id+"'/>";
	XMPP += "</accept></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - TOURNEY
 **********************************/
/**
* @brief	Create a message to create a tourney
*
* @param	Name String of tourney Namen
* @param	Category String of game category
* @param	GameTime Number of time of games
* @param	StartTime	Number of tourney StartTime
* @param	MaxPlayers	Number of maximum players
* @param	RatingInterval	Object contains min and max ratings
* @param	Password	String of password
* @param	WaitTime	Number of minutes to wait a player before match start
* @param	SeqRounds	String 
* @param	SubmitPeriod	Object
* @param	Desc	String with tourney description
* @param	Rounds	Array with start time of rounds
* @return 	XMPP message
* @author 	Rubens Suguimoto
*/ 
function MESSAGE_CreateTourney(Name, Category, GameTime, StartTime, MaxPlayers, RatingInterval, Password, WaitTime, SeqRounds, SubmitPeriod, Desc, Rounds)
{
	var XMPP = "";
	var Consts = MainData.GetConst();
	var i;

	// TODO verify server/host
	XMPP += "<iq type='set' to='"+MainData.GetServer()+"."+MainData.GetHost()+"' id='"+Consts.IQ_ID_CreateTourney+"'>";
	XMPP += "<create xmlns='http://c3sl.ufpr.br/chessd#tourney'>";
	XMPP += "<tourney name='"+Name+"' category='"+Category+"' game_time='"+GameTime+"' start_time='"+StartTime+"'";
	if (MaxPlayers != null)
	{
		XMPP += " max_players='"+MaxPlayers+"'";
	}
	// Set rating interval
	if (RatingInterval != null)
	{
		XMPP += " min_rating='"+RatingInterval.From+"' max_rating='"+RatingInterval.To+"'";
	}
	// Set tourney password
	if (Password != null)
	{
		XMPP += " password='"+Password+"'";
	}
	// Set wait time
	if (WaitTime != null)
	{
		XMPP += " delay='"+WaitTime+"'";
	}
	// Set sequence rounds (true,false)
	XMPP += " sequence_rounds='"+SeqRounds+"'";
	// Set subscription period
	if (SubmitPeriod != null)
	{
		XMPP += " start_subscription='"+SubmitPeriod.From+"' end_subscription='"+SubmitPeriod.To+"'";
	}
	XMPP += " >";
	// Set tourney's description
	if (Desc != "")
	{
		XMPP += "<description>"+Desc+"</description>";
	}
	// Set rounds
	if ((SeqRounds == false) && (Rounds != null))
	{
		for (i=0; i<Rounds.length; i++)
		{
			XMPP += "<round start_time='"+Rounds[i]+"' />";
		}
	}
	XMPP += "</tourney>";
	XMPP += "</create></iq>";
	return XMPP;
}
