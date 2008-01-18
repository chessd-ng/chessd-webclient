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
* Jabber Connection
* This file has all functions that is used to provide a connection
* with a Jabber Server
*/

/**
* Start connection to Jabber server
*
* @return none
* @public
*/
function CONNECTION_ConnectJabber(XML)
{
	switch (MainData.ConnectionStatus)
	{
		// Start connection
		case (1):
			CONNECTION_SendJabber(MESSAGE_StartConnection());
			break;

		// Send Username
		case (2):
			CONNECTION_SendJabber(MESSAGE_SendUsername());
			break;

		// Send password and resource
		case (3):
			CONNECTION_SendJabber(MESSAGE_SendPasswd());
			break;

		// Get user list
		case (4):
			CONNECTION_SendJabber(MESSAGE_OfflineUsers());
			break;

		// Send presence, enter in 'default_room', 
		// presence to match manager and get ratings
		case (5):
			// Set interface as 'connected'
			MainData.ConnectionStatus = 0;
			CONNECTION_SendJabber(	
				MESSAGE_MakePresence(), 
				MESSAGE_MakePresence(UTILS_GetText("room_default")+"@conference."+MainData.Host+"/"+MainData.Username),
				MESSAGE_MakePresence("match."+MainData.Host),
				MESSAGE_MakeRating(null, "blitz"),
				XML
				);
			break;
	}
}

/**
* Send a XML post
*
* @return none
* @public
*/
function CONNECTION_SendJabber()
{
	var Post, DT;


	// If receive too many parameters, merge then
	if (arguments.length > 1)
	{
		Post = MESSAGE_MergeMessages(arguments);
	}
	else
	{
		Post = arguments[0];
	}

	// Create XMLHttpRequest
	if (window.XMLHttpRequest) 
	{
		// Mozilla, Opera, Galeon
		MainData.HttpRequest = new XMLHttpRequest();
		if (MainData.HttpRequest.overrideMimeType) 
			MainData.HttpRequest.overrideMimeType("text/xml");
	}
	else if (window.ActiveXObject) 
	{
		// Internet Explorer
		try
		{
			MainData.HttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(e)
		{
			MainData.HttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	// Avoid browser caching
	DT = Math.floor(Math.random()*10000);

	MainData.HttpRequest.open('POST','http://'+MainData.Host+'/jabber?id='+DT , true);
	MainData.HttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	
	// Normal messages
	if (MainData.ConnectionStatus == 0)
	{
		MainData.HttpRequest.onreadystatechange = CONNECTION_ReceiveXml;
	}
	// Conection messages
	else
	{
		MainData.HttpRequest.onreadystatechange = CONNECTION_ReceiveConnection;
	}

	// Send request to server
	MainData.HttpRequest.send(Post);

	// Save last post in Data Struct
	MainData.LastXML = Post;

	// Increment RID
	MainData.RID++;
}


/**
* Receive Connection messages and make all steps to connect user
*
* @return none
* @public
*/
function CONNECTION_ReceiveConnection()
{
	var XML, XMLBuffer;

	if (MainData.HttpRequest.readyState == 4 )
	{
		if(MainData.HttpRequest.status == 200)
		{
			XML = MainData.HttpRequest.responseXML;
		
			switch (MainData.ConnectionStatus)
			{
				 case (1):
					// Get SID from first message
					try
					{
						MainData.SID = XML.getElementsByTagName("body")[0].getAttribute("sid");
					}
					catch(e)
					{
						LOGIN_LoginFailed(MainData.Const.LOGIN_ConnectionRefused);
						return;
					}
					MainData.ConnectionStatus++;
					CONNECTION_ConnectJabber();
					break;

			    case(2):
					MainData.ConnectionStatus++;
					CONNECTION_ConnectJabber();
					break;

				case(3):
					// Check errors in username and passwd
					Error = XML.getElementsByTagName("error");
					if (Error.length > 0)
						LOGIN_LoginFailed(MainData.Const.LOGIN_InvalidUser);
					else
					{
						MainData.ConnectionStatus++;
						CONNECTION_ConnectJabber();
					}
					break;
			
			    case(4):
					MainData.ConnectionStatus++;
					XMLBuffer = PARSER_ParseXml(XML);
					CONNECTION_ConnectJabber(XMLBuffer);
				break;
			}
		}
		else if (MainData.HttpRequest.status == 503)
		{
			LOGIN_LoginFailed(MainData.Const.LOGIN_ServerDown);
		}
	}
}


/**
* Receive a Jabber message when user is already connected
*
* @return none
* @public
*/
function CONNECTION_ReceiveXml()
{
	var XML, Buffer = "";
	
	if (MainData.HttpRequest.readyState == 4)
	{
		if (MainData.HttpRequest.status == 200)
		{
			// Get Xml response
			XML = MainData.HttpRequest.responseXML;

		    // Forward XML to parser
			Buffer = PARSER_ParseXml(XML);
			
			// Parser returned some xml: send it
			if (Buffer != "" && Buffer != null)
			{
				CONNECTION_SendJabber(Buffer);
			}
			// Send a wait message to jabber
			else
			{
				CONNECTION_SendJabber(MESSAGE_MakeWait());
			}
		}

		// Re-send last XML
		else if (MainData.HttpRequest.status == 502)
		{
			CONNECTION_SendJabber(MainData.LastXML);
		}

		// Server down
		else if (MainData.HttpRequest.status == 503)
		{
			alert(UTILS_GetText("error_disconnected"));
		}
    }
}
