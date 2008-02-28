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
		XMPP = "<body rid='"+MainData.RID+"' sid='"+MainData.SID+"' xmlns='http://jabber.org/protocol/httpbind'>"+Msg+"</body>";
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
    return "";
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
* End connection
*/
function MESSAGE_EndConnection()
{
	XMPP = "<body type='terminate' rid='"+MainData.RID+"' sid='"+MainData.SID+"' xmlns='http://jabber.org/protocol/httpbind' />";

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

	return XMPP;
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

	return XMPP;
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

	return XMPP;
}

/**
* Ask room list to jabber
*/
function MESSAGE_RoomList()
{
	var XMPP;

   	XMPP  = "<iq type='get' id='"+MainData.Const.IQ_ID_GetRoomList+"' to='conference."+MainData.Host+"'>";
	XMPP += "<query xmlns='http://jabber.org/protocol/disco#items'/></iq>";

	return XMPP;
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

	XMPP += "</presence>";

	return XMPP;
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
			XMPP = "<presence to='"+RoomName+"/"+MainData.Username+"' />";
		}
		else
		{
			XMPP = "<presence to='"+RoomName+"/"+MainData.Username+"' ><show>"+NewStatus+"</show></presence>";
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
	return XMPP;
}


/**
* Set offline on jabber or exit a room
*/
function MESSAGE_Unavailable(RoomName)
{
	var XMPP = "";
	var Type = null;

	// Exit from a room
	if (RoomName)
	{
		XMPP = "<presence to='"+RoomName+"' xmlns='jabber:client' type='unavailable'></presence>";
	}
	return XMPP;
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

	XMPP  = "<message to='"+To+"@"+MainData.Host+"/"+MainData.Resource+"' type='chat'>"
	XMPP += "<body>"+Message+"</body>";
	XMPP += "</message>";

	return XMPP;
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

	return XMPP;
}

/**********************************
 * MESSAGES - RATING AND USER TYPE
 **********************************/

/**
* Message to get users ratings
*
* @deprecated
*/
function MESSAGE_Info(User)
{
	var XMPP;

	XMPP  = "<iq type='get' from='"+MainData.Username+"@"+MainData.Host+"/"+MainData.Resource+"' to='rating."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GetRating+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#info'>";
	XMPP += "<rating jid='"+User+"@"+MainData.Host+"' />";
	XMPP += "<type jid='"+User+"@"+MainData.Host+"' />";
	XMPP += "</query></iq>";
	
	return XMPP;
}

/**
* Message to get users ratings
*/
function MESSAGE_UserListInfo()
{
	var XMPP, i;

	XMPP  = "<iq type='get' from='"+MainData.Username+"@"+MainData.Host+"/"+MainData.Resource+"' to='rating."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GetRating+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#info'>";
	XMPP += "<rating jid='"+MainData.Username+"@"+MainData.Host+"' />";
	XMPP += "<type jid='"+MainData.Username+"@"+MainData.Host+"' />";

	// Ask for all contact list
	for (i=0; i<MainData.UserList.length; i++)
	{
		XMPP += "<rating jid='"+MainData.UserList[i].Username+"@"+MainData.Host+"' />";
		XMPP += "<type jid='"+MainData.UserList[i].Username+"@"+MainData.Host+"' />";
	}
	XMPP += "</query></iq>"

	return XMPP;
}

/**********************************
 * MESSAGES - INVITE
 **********************************/

/**
* Send a invite to user
*/
function MESSAGE_Invite(To)
{
	 return "<presence type='subscribe' to='"+To+"@"+MainData.Host+"' />"; 
}

/**
* Send a subscribed to user
*/
function MESSAGE_InviteAccept(To)
{
	return "<presence type='subscribed' to='"+To+"@"+MainData.Host+"' />";
}

/**
* Send a unsubscribed to user
*/
function MESSAGE_InviteDeny(To)
{
	return "<presence type='unsubscribed' to='"+To+"@"+MainData.Host+"' />";
}

/**
* Remove user from yout contact list
*/
function MESSAGE_RemoveContact(User)
{
	var XMPP;

	XMPP  = "<iq type='set' id='RemoveUser'>";
	XMPP += "<query xmlns='jabber:iq:roster'>";
	XMPP += "<item subscription='remove' jid='"+User+"@"+MainData.Host+"' />";
	XMPP += "</query></iq>";

	return XMPP;
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
	
	return XMPP;
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

	return XMPP;
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

	return XMPP;
}


/**********************************
 * MESSAGES - GAME
 **********************************/

/**
* Get the list of all games been played
* 
* @return 	XMPP with iq to get all games been played
* @author 	Ulysses
*/
function MESSAGE_GameRoomList()
{
	var XMPP;

   	XMPP  = "<iq type='get' id='"+MainData.Const.IQ_ID_GetGamesList+"' to='games."+MainData.Host+"'>";
	XMPP += "<query xmlns='http://jabber.org/protocol/disco#items'/></iq>";

	return XMPP;
}

/**
* Send a game moviment
*/
function MESSAGE_GameMove(Move, GameID)
{
	var XMPP="";

	XMPP  = "<iq type='set' to='"+GameID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameMove+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#move'>";
	XMPP += "<move long='"+Move+"'>";
	XMPP += "</move></query></iq>";

	return XMPP;
}

/**
* Make a draw request
*/
function MESSAGE_GameRequestDraw (GameID)
{
	return (MESSAGE_GameRequests("Draw", GameID));
}

/**
* Make a cancel request
*/
function MESSAGE_GameRequestCancel (GameID)
{
	return (MESSAGE_GameRequests("Cancel", GameID));
}

/**
* Make a adjourn request
*/
function MESSAGE_GameRequestAdjourn (GameID)
{
	return (MESSAGE_GameRequests("Adjourn", GameID));
}

/**
* Make a resign message
*/
function MESSAGE_GameResign (GameID)
{
	return (MESSAGE_GameRequests("Resign", GameID));
}

/**
* Create the game requests messages
*/
function MESSAGE_GameRequests(Action, GameID)
{
	var XMPP = "";

	switch (Action) 
	{
		case "Draw":
			XMPP  = "<iq type='set' to='"+GameID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameDraw+"'>";
			XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#draw'>";
			break;

		case "Cancel":
			XMPP  = "<iq type='set' to='"+GameID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameCancel+"'>";
			XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#cancel'>";
			break;

		case "Adjourn":
			XMPP  = "<iq type='set' to='"+GameID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameAdjourn+"'>";
			XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#adjourn'>";
			break;
	
		case "Resign":
			XMPP  = "<iq type='set' to='"+GameID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameResign+"'>";
			XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#resign'>";
			break;
	
		default:
			break;
	}

	XMPP += "</query></iq>";

	return XMPP;
}


/**
* Make a draw accept
*/
function MESSAGE_GameDrawAccept (RoomID)
{
	return (MESSAGE_GameResponse("Draw", RoomID, ""));
}

/**
* Make a draw deny
*/
function MESSAGE_GameDrawDeny (RoomID)
{
	return (MESSAGE_GameResponse("Draw", RoomID, "-decline"));
}

/**
* Make a cancel accept
*/
function MESSAGE_GameCancelAccept (RoomID)
{
	return (MESSAGE_GameResponse("Cancel", RoomID, ""));
}

/**
* Make a cancel deny
*/
function MESSAGE_GameCancelDeny (RoomID)
{
	return (MESSAGE_GameResponse("Cancel", RoomID, "-decline"));
}

/**
* Make a adjourn accept
*/
function MESSAGE_GameAdjournAccept (RoomID)
{
	return (MESSAGE_GameResponse("Adjourn", RoomID, ""));
}

/**
* Make a adjourn deny
*/
function MESSAGE_GameAdjournDeny (RoomID)
{
	return (MESSAGE_GameResponse("Adjourn", RoomID, "-decline"));
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
			XMPP  = "<iq type='set' to='"+RoomID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameDraw+"'>";
			XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#draw"+Response+"'>";
			break;

		case "Cancel":
			XMPP  = "<iq type='set' to='"+RoomID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameCancel+"'>";
			XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#cancel"+Response+"'>";
			break;

		case "Adjourn":
			XMPP  = "<iq type='set' to='"+RoomID+"@games."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GameAdjourn+"'>";
			XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#game#adjourn"+Response+"'>";
			break;
	
		default:
			break;
	}

	XMPP += "</query></iq>";

	return XMPP;
}

/**********************************
 * MESSAGES - SEARCH USER
 **********************************/

/**
*
*	Make search user message
*
*	@return	String with search user message
*	@author	Danilo Kiyoshi Simizu Yorinori

function MESSAGE_SearchUser()
{
	var XMPP;
	
	XMPP = "<iq type='get' to='"+MainData.SearchComponent+"."+MainData.Host+"' id='"+MainData.Const.IQ_ID_SearchUser+"'><query xmlns='jabber:iq:search'/></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}

/**
*
*	Make search user message
*
*	@return	String with search user message
*	@author	Danilo Kiyoshi Simizu Yorinori
*/
function MESSAGE_SearchUser(Username)
{
	var XMPP="";
	
	XMPP 	= "<iq type='set' to='"+MainData.SearchComponent+"."+MainData.Host+"' id='"+MainData.Const.IQ_ID_SearchUser+"' >";
	XMPP +=	"<query xmlns='jabber:iq:search'>";
	XMPP += "<x xmlns='jabber:x:data' type='submit' >";
	XMPP += "<field type='text-single' var='user' >";
	XMPP += "<value>"+Username+"*</value>";
	XMPP += "</field>";
	/* Fields that could be use
		<field type='text-single' var='fn' >
		<value></value>
		</field>
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
