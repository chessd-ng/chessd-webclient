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
* Create xmpp messages
*/


/**
* Append xmpp body to messages
*/
function MESSAGE_MakeXMPP(Msg, Type)
{
	var XMPP;
	

	if (Msg != "")
	{
		if (Type == null)
		{
			XMPP = "<body rid='"+MainData.RID+"' sid='"+MainData.SID+"' xmlns='http://jabber.org/protocol/httpbind'>"+Msg+"</body>";
		}
		// Disconnecting
		else 
		{
			XMPP = "<body type='"+Type+"' rid='"+MainData.RID+"' sid='"+MainData.SID+"' xmlns='http://jabber.org/protocol/httpbind'>"+Msg+"</body>";
		}
	}
	else
	{
		XMPP = '<body rid="'+MainData.RID+'" sid="'+MainData.SID+'" xmlns="http://jabber.org/protocol/httpbind"/>';
	}

	return XMPP;
}


/**
* Make a wait message
*/
function MESSAGE_Wait()
{
    return MESSAGE_MakeXMPP("");
}


/**
* Merge messages into one
*/
function MESSAGE_MergeMessages(Msgs)
{
	var Msg, i, XML = "";


	for (i=0; i<Msgs.length; i++)
	{
		if (Msgs[i] == "")
			continue;

		Msg = Msgs[i].replace(/<body .*?>/,"");
		Msg = Msg.replace("</body>","");

		XML += Msg;
	}
	
	return MESSAGE_MakeXMPP(XML);
}


/**********************************
 * MESSAGES - CONNECTION 
 **********************************/

/**
* Get an SID from bind
*/
function MESSAGE_StartConnection()
{
	var XMPP = "<body hold='1' rid='"+MainData.RID+"' to='"+MainData.Host+"' ver='1.6' wait='10' xml:lang='en' xmlns='http://jabber.org/protocol/httpbind'/>";

	return XMPP;
}

/**
* Send username to jabber
*/
function MESSAGE_SendUsername()
{
	var XMPP;

	XMPP  = "<iq type='get' id='auth_1' to='"+MainData.Host+"'>";
	XMPP += "<query xmlns='jabber:iq:auth'>";
	XMPP += "<username>"+MainData.Username+"</username>";
	XMPP += "</query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}

/**
* Send password to jabber
*/
function MESSAGE_SendPasswd()
{
	var XMPP;
	
	XMPP  = "<iq type='set' id='auth_2' to='"+MainData.Host+"' >";
	XMPP += "<query xmlns='jabber:iq:auth'>";
	XMPP += "<username>"+MainData.Username+"</username>";
	XMPP += "<password>"+MainData.Password+"</password>";
	XMPP += "<resource>"+MainData.Resource+"</resource></query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}


/**********************************
 * MESSAGES - USER AND ROOM LIST
 **********************************/

/**
* Ask contact list to jabber
*/
function MESSAGE_UserList()
{
	var XMPP;

   	XMPP  = "<iq type='get' id='"+MainData.Const.IQ_ID_GetUserList+"'>";
	XMPP += "<query xmlns='jabber:iq:roster'/></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}

/**
* Ask room list to jabber
*/
function MESSAGE_RoomList()
{
	var XMPP;

   	XMPP  = "<iq type='get' id='"+MainData.Const.IQ_ID_GetRoomList+"' to='conference."+MainData.Host+"'>";
	XMPP += "<query xmlns='http://jabber.org/protocol/disco#items'/></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}


/**********************************
 * MESSAGES - PRESENCE
 **********************************/
	
/**
* If 'To' isn't passed, send your presence to jabber,
* otherwise send presence to 'To'
*/
function MESSAGE_Presence(To)
{
	var XMPP;

	XMPP = "<presence from='"+MainData.Username+"@"+MainData.Host+"' ";

	// Presence to someone
	if (To != null)
	{
		XMPP += "to='"+To+"' ";
	}
	XMPP += ">";

	// Setting user status
	if (MainData.Status != "available")
	{
		XMPP += "<show>"+MainData.Status+"</show>";
	}

	// Setting user type
	if ((MainData.Type != null) && (MainData.Type != "user"))
	{
		XMPP += "<type>"+MainData.Type+"</type>";
	}

	// Setting rating
	if ((MainData.RatingBlitz != "0") || (MainData.RatingLightning != "0") || (MainData.RatingStandard != "0"))
	{
		XMPP += "<rating ";

		// Bllitz rating
		if (MainData.RatingBlitz != "0")
		{
			XMPP += "blitz='"+MainData.RatingBlitz+"' ";
		}
		// Lightning rating
		if (MainData.RatingLightning != "0")
		{
			XMPP += "lightning='"+MainData.RatingLightning+"' ";
		}
		// Standard rating
		if (MainData.RatingStandard != "0")
		{
			XMPP += "standard='"+MainData.RatingStandard+"' ";
		}

		XMPP += "/>";
	}

	XMPP += "</presence>";

	return MESSAGE_MakeXMPP(XMPP);
}

/**
* Change Status
*/
function MESSAGE_ChangeStatus(NewStatus, RoomName)
{
	var XMPP;

	// Message to room
	if (RoomName)
	{
		if (NewStatus == "available")
		{
			XMPP = "<presence to='"+RoomName+"@conference."+MainData.Host+"' />";
		}
		else
		{
			XMPP = "<presence to='"+RoomName+"@conference."+MainData.Host+"' ><show>"+NewStatus+"</show></presence>";
		}
	}
	
	// General status change
	else
	{
		if (NewStatus == "available")
		{
			XMPP = "<presence xmlns='jabber:client' />";
		}
		else
		{
			XMPP = "<presence xmlns='jabber:client'><show>"+NewStatus+"</show></presence>";
		}
	}
	return MESSAGE_MakeXMPP(XMPP);
}


/**
* Set offline on jabber or exit on a room
*/
function MESSAGE_Unavailable(RoomName)
{
	var XMPP = "";
	var Type = null;

	// Exit from a room
	if (RoomName)
	{
		XMPP = "<presence to='"+RoomName+"@conference."+MainData.Host+"' xmlns='jabber:client' type='unavailable'></presence>";
	}

	// If 'RoomName' is null then user logged out
	else
	{
		XMPP = '<presence xmlns="jabber:client" type="unavailable"><status>Logged out</status></presence>';
		Type = "terminate";
	}

	return MESSAGE_MakeXMPP(XMPP, Type);
}

/**********************************
 * MESSAGES - CHAT AND GROUPCHAT
 **********************************/

/**
* Create a chat message
*/
function MESSAGE_Chat(To, Message)
{
	var XMPP;

	XMPP  = "<message to='"+To+"' type='chat'>"
	XMPP += "<body>"+Message+"</body>";
	XMPP += "</message>";

	return MESSAGE_MakeXMPP(XMPP);
}

/**
* Create a groupchat message
*/
function MESSAGE_GroupChat(To, Message)
{
	var XMPP;

	XMPP  = "<message to='"+To+"' type='groupchat'>"
	XMPP += "<body>"+Message+"</body>";
	XMPP += "</message>";

	return MESSAGE_MakeXMPP(XMPP);
}

/**********************************
 * MESSAGES - RATING AND USER TYPE
 **********************************/

/**
* Message to get users ratings
*
* @deprecated
*/
function MESSAGE_Rating(UserList, RatingType)
{
	var XMPP;

	
	if (UserList == null)
	{
		UserList = new Array();

		for (var i=0; i < MainData.UserList.length; i++)
			UserList[i] = MainData.UserList[i].Username;
	}

	// Search user rating too
	UserList[UserList.length] = MainData.Username

	// Create message to get rating of users
	XMPP  = "<iq type='get' from='"+MainData.Username+"@"+MainData.Host+"/"+MainData.Resource+"' to='rating."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GetRating+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#info' action='fetch'>";

	for (i=0; i < UserList.length; i++)
	{
		XMPP += "<rating jid='"+UserList[i]+"@"+MainData.Host+"' category='"+RatingType+"' />";
	}
	XMPP += "</query></iq>";
	
	return MESSAGE_MakeXMPP(XMPP);
}

/**
* Message to get users ratings
*/
function MESSAGE_UserListInfo()
{
	var XMPP, i;


	XMPP  = "<iq type='get' from='"+MainData.Username+"@"+MainData.Host+"/"+MainData.Resource+"' to='rating."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GetRating+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#info' action='fetch'>";
	XMPP += "<rating jid='"+MainData.Username+"@"+MainData.Host+"' category='blitz' />";
	XMPP += "<type jid='"+MainData.Username+"@"+MainData.Host+"' />";

	// Ask for all contact list
	for (i=0; i<MainData.UserList.length; i++)
	{
		XMPP += "<rating jid='"+MainData.UserList[i].Username+"@"+MainData.Host+"' category='blitz' />";
		XMPP += "<type jid='"+MainData.UserList[i].Username+"@"+MainData.Host+"' />";
	}
	XMPP += "</query></iq>"

	return MESSAGE_MakeXMPP(XMPP);
}

/**********************************
 * MESSAGES - INVITE
 **********************************/

/**
* Send a invite to user
*/
function MESSAGE_Invite(To)
{
	 return MESSAGE_MakeXMPP("<presence type='subscribe' to='"+To+"@"+MainData.Host+"' />"); 
}

/**
* Send a subscribed to user
*/
function MESSAGE_InviteAccept(To)
{
	return MESSAGE_MakeXMPP ("<presence type='subscribed' to='"+To+"@"+MainData.Host+"' />");
}

/**
* Send a unsubscribed to user
*/
function MESSAGE_InviteDeny(To)
{
	return MESSAGE_MakeXMPP ("<presence type='unsubscribed' to='"+To+"@"+MainData.Host+"' />");
}

/**
* Remove user from yout contact list
*/
function MESSAGE_RemoveContact(User)
{
	var XML;

	XML  = "<iq type='set' id='RemoveUser'>";
	XML += "<query xmlns='jabber:iq:roster'>";
	XML += "<item subscription='remove' jid='"+User+"@"+MainData.Host+"' />";
	XML += "</query></iq>";

	return MESSAGE_MakeXMPP(XML);
}


/**********************************
 * MESSAGES - CHALLENGE
 **********************************/

/**
* Send a Challenge message
*/
function MESSAGE_Challenge(Category, Players)
{
	/** 
	* Should be extended to support Bughouse with more two players.
	* The Player's structure has the following fields:
	*  - Name
	*  - Color
	*  - Inc
	*  - Time
	*
	* The 'Color' field must content just the first letter
	*/
	var i, Id, XMPP = "";

	// Setting iq's id
	Id = MainData.Const.IQ_ID_Challenge;
	for (i=0; i < Players.length; i++)
	{
		if (Players[i].Name == MainData.Username)
		{
			continue;
		}
		Id += "_"+Players[i].Name;
	}

	// Tag the id with the challenged player's name
	XMPP  = "<iq type='set' to='match."+MainData.Host+"' id='"+Id+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#match#offer'>";
	XMPP += "<match category='"+Category+"' >";

	// Creating players tags
	for (i=0; i < Players.length; i++)
	{
		XMPP += "<player jid='"+Players[i].Name+"@"+MainData.Host+"/"+MainData.Resource+"' time='"+Players[i].Time+"' inc='"+Players[i].Inc+"' color='"+Players[i].Color+"' />";
	}
	XMPP += "</match></query></iq>";
	
	return MESSAGE_MakeXMPP(XMPP);
}


/**
* Accept a challange 
*/
function MESSAGE_ChallengeAccept(ChallengeID)
{
	var XMPP="";

	XMPP  = "<iq type='set' to='match."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Challenge+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#match#accept'>";
	XMPP += "<match id='"+ChallengeID+"'>";
	XMPP += "</match></query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}


/**
* Decline a challange 
*/
function MESSAGE_ChallengeDecline(ChallengeID)
{
	var XMPP="";

	XMPP  = "<iq type='set' to='match."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Challenge+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#match#decline'>";
	XMPP += "<match id='"+ChallengeID+"'>";
	XMPP += "</match></query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}


/**********************************
 * MESSAGES - GAME
 **********************************/

/**
* Send a game moviment
*/
function MESSAGE_GameMove(Move, RoomID)
{
	var XMPP="";

	XMPP  = "<iq type='set' to='"+RoomID+"@game."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Challenge+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#move'>";
	XMPP += "<move long='"+Move+"'>";
	XMPP += "</move></query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}

/**
* Make a draw request
*/
function MESSAGE_GameRequestDraw (RoomID)
{
	return (MESSAGE_GameRequests("Draw", RoomID));
}

/**
* Make a cancel request
*/
function MESSAGE_GameRequestCancel (RoomID)
{
	return (MESSAGE_GameRequests("Cancel", RoomID));
}

/**
* Make a adjourn request
*/
function MESSAGE_GameRequestAdjourn (RoomID)
{
	return (MESSAGE_GameRequests("Adjourn", RoomID));
}

/**
* Create the game requests messages
*/
function MESSAGE_GameRequests(Action, RoomID)
{
	var XMPP="";

	switch (Action) 
	{
	case "Draw":
		XMPP  = "<iq type='set' to='"+RoomID+"@game."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Draw+"'>";
		XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#draw'>";
		break;

	case "Cancel":
		XMPP  = "<iq type='set' to='"+RoomID+"@game."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Cancel+"'>";
		XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#cancel'>";
		break;

	case "Adjourn":
		XMPP  = "<iq type='set' to='"+RoomID+"@game."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Adjourn+"'>";
		XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#adjourn'>";
		break;
	
	default:
		break;
	}

	XMPP += "</query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}


/**
* Make a draw accept
*/
function MESSAGE_GameDrawAccept (RoomID)
{
	return (MESSAGE_GameRequests("Draw", RoomID, ""));
}

/**
* Make a draw deny
*/
function MESSAGE_GameDrawDeny (RoomID)
{
	return (MESSAGE_GameRequests("Draw", RoomID, "-decline"));
}

/**
* Make a cancel accept
*/
function MESSAGE_GameCancelAccept (RoomID)
{
	return (MESSAGE_GameRequests("Cancel", RoomID, ""));
}

/**
* Make a cancel deny
*/
function MESSAGE_GameCancelDeny (RoomID)
{
	return (MESSAGE_GameRequests("Cancel", RoomID, "-decline"));
}

/**
* Make a adjourn accept
*/
function MESSAGE_GameAdjournAccept (RoomID)
{
	return (MESSAGE_GameRequests("Adjourn", RoomID, ""));
}

/**
* Make a adjourn deny
*/
function MESSAGE_GameAdjournDeny (RoomID)
{
	return (MESSAGE_GameRequests("Adjourn", RoomID, "-decline"));
}

/**
* Create the game response messages
*/
	function MESSAGE_GameResponse(Action, RoomID, Response)
{
	var XMPP="";

	switch (Action) 
	{
	case "Draw":
		XMPP  = "<iq type='set' to='"+RoomID+"@game."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Draw+"'>";
		XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#draw"+Response+"'>";
		break;

	case "Cancel":
		XMPP  = "<iq type='set' to='"+RoomID+"@game."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Cancel+"'>";
		XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#cancel"+Response+"'>";
		break;

	case "Adjourn":
		XMPP  = "<iq type='set' to='"+RoomID+"@game."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Adjourn+"'>";
		XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#adjourn"+Response+"'>";
		break;
	
	default:
		break;
	}

	XMPP += "</query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}
