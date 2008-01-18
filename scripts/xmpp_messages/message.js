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
function MESSAGE_MakeWait()
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
 ************************************/

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
 ************************************/

/**
* If 'To' isn't passed, send your presence to jabber,
* otherwise send presence to 'To'
*/
function MESSAGE_MakePresence(To)
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


/**********************************
 * MESSAGES - RATING
 ************************************/

/**
* Message to get users ratings
*/
function MESSAGE_MakeRating(UserList, RatingType)
{
	var XML, action;
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
	XML  = "<iq type='get' from='"+MainData.Username+"@"+MainData.Host+"/"+MainData.Resource+"' to='rating."+MainData.Host+"' id='"+MainData.Const.IQ_ID_GetRating+"'>";
	XML += "<query xmlns='"+MainData.Xmlns+"/chessd#rating' action='fetch'>";

	for (i=0; i < UserList.length; i++)
	{
		XML += "<rating jid='"+UserList[i]+"@"+MainData.Host+"/"+MainData.Resource+"' category='"+RatingType+"' />";
	}
	XML += "</query></iq>";

	return MESSAGE_MakeXMPP(XML);
}


/**********************************
 * MESSAGES - INVITE
 ************************************/

/**
* Send a invite to user
*/
function MAKER_MakeInvite(To)
{
	 return MAKER_MakeXMPP("<presence type='subscribe' to='"+To+"@"+MainData.Host+"' />"); 
}

/**
* Send a subscribed to user
*/
function MAKER_MakeInviteAccept(To)
{
	return MAKER_MakeXMPP ("<presence type='subscribed' to='"+To+"@"+MainData.Host+"' />");
}

/**
* Send a unsubscribed to user
*/
function MAKER_MakeInviteDeny(To)
{
	return MAKER_MakeXMPP ("<presence type='unsubscribed' to='"+To+"@"+MainData.Host+"' />");
}
