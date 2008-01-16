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

   	XMPP  = "<iq type='get' id='GetOffline'>";
	XMPP += "<query xmlns='jabber:iq:roster'/></iq>";

	return MESSAGE_MakeXMPP(XMPP);
}
