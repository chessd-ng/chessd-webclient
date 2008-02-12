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
function MESSAGE_MakeXMPP(Msg)
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

/**
* Ask friend list to jabber
*/
function MESSAGE_OfflineUsers()
{
	var XMPP;

   	XMPP  = "<iq type='get' id='"+MainData.Const.IQ_ID_GetUserList+"'>";
	XMPP += "<query xmlns='jabber:iq:roster'/></iq>";

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
	if (To == null)
	{
		return MESSAGE_MakeXMPP('<presence from="'+MainData.Username+'@'+MainData.Host+'"/>');
	}
	else
	{
		return MESSAGE_MakeXMPP('<presence to="'+To+'"/>');
	}
}

/**
* Change Status
*/
function MESSAGE_ChangeStatus(NewStatus, RoomName)
{
	// Message to room
	if (RoomName)
	{
		return MESSAGE_MakeXMPP ('<presence to="'+RoomName+'" ><show>'+NewStatus+'</show></presence>');
	}
	
	// General status change
	else
	{
		return MESSAGE_MakeXMPP('<presence xmlns="jabber:client"><show>'+NewStatus+'</show></presence>');
	}
}


/**
* Set offline on jabber or exit on a room
*/
function MESSAGE_Unavailable (RoomName)
{
	// Exit from a room
	if (RoomName)
	{
		return MESSAGE_MakeXMPP('<presence to="'+RoomName+'" xmlns="jabber:client" type="unavailable"></presence>');
	}

	// If 'RoomName' is null then user logged out
	else
	{
		return MESSAGE_MakeXMPP(Presence ='<presence xmlns="jabber:client" type="unavailable"><status>Logged out</status></presence>');
	}
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
 * MESSAGES - RATING
 **********************************/

/**
* Message to get users ratings
*/
function MESSAGE_Rating(UserList, RatingType)
{
	var XMPP, action;
	var ratingList='';
	var jidTmp;

	
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
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#rating' action='fetch'>";

	for (i=0; i < UserList.length; i++)
	{
		XMPP += "<rating jid='"+UserList[i]+"@"+MainData.Host+"' category='"+RatingType+"' />";
	}
	XMPP += "</query></iq>";
	
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


/**********************************
 * MESSAGES - CHALLENGE
 **********************************/

/**
* Send a Challenge message
*/
function MESSAGE_Challenge(Category, Player)
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
	
	var XMPP="";

	// Tag the id with the challenged player's name
	XMPP  = "<iq type='set' to='match."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Challenge+"_"+Player.Name+"'>";

	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#match#offer'>";
	XMPP += "<match category='"+Category+"' >";
	XMPP += "<player jid='"+MainData.Username+"@"+MainData.Host+"/"+MainData.Resource+"' time='"+Player.Time+"' inc='"+Player.Inc+"' color='"+Player.Color+"' />";
	XMPP += "<player jid='"+Player.Name+"@"+MainData.Host+"/"+MainData.Resource+"' time='"+Player.Time+"' inc='"+Player.Inc+"' color='"+Player.Color+"' />";

	XMPP += "</match></query></iq>";
	
	return MESSAGE_MakeXMPP(XMPP);
}


/**
* Accept a challange 
*/
function MESSAGE_Accept(ChallangeID)
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
function MESSAGE_Decline(ChallangeID)
{
	var XMPP="";

	XMPP  = "<iq type='set' to='match."+MainData.Host+"' id='"+MainData.Const.IQ_ID_Challenge+"'>";
	XMPP += "<query xmlns='"+MainData.Xmlns+"/chessd#match#decline'>";
	XMPP += "<match id='"+ChallengeID+"'>";
	XMPP += "</match></query></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}
