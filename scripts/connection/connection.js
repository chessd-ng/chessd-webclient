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
			CONNECTION_SendJabber(MESSAGE_UserList());
			break;

		// Get user information
		case (5):
			CONNECTION_SendJabber(MESSAGE_UserListInfo(), MESSAGE_GetProfile(MainData.Username, MainData.Const.IQ_ID_GetMyProfile));
			break;

		// Send presence, enter in 'default_room' and
		// presence to match manager
		case (6):
			// Set interface as 'connected'
			MainData.ConnectionStatus = 0;
			CONNECTION_SendJabber(	
				MESSAGE_Presence(), 
				MESSAGE_Presence("general@"+MainData.ConferenceComponent+"."+MainData.Host+"/"+MainData.Username),
				MESSAGE_Presence(MainData.MatchComponent+"."+MainData.Host),
				MESSAGE_Presence(MainData.RatingComponent+"."+MainData.Host),
				XML
				);
			LOGIN_Interface();
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
	var Post = "", DT, i;

	// If receive too many parameters, merge then
	for (i=0; i<arguments.length; i++)
	{
		Post += arguments[i];
	}

	if ((MainData.SID != -1) && (MainData.ConnectionStatus != -1))
	{
		Post = MESSAGE_MakeXMPP(Post);
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
			MainData.HttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
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
	else if (MainData.ConnectionStatus > 0)
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
	var Error, ErrorCode;
	var Status;

	if (MainData.HttpRequest.readyState == 4 )
	{
		try
		{
			Status = MainData.HttpRequest.status;
		}
		catch(e)
		{
			return null;
		}	

		if(Status == 200)
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
					{
						ErrorCode = Error[0].getAttribute("code");
						switch(ErrorCode)
						{
							// Username and passwd invalid
							case "401":
								LOGIN_LoginFailed(MainData.Const.LOGIN_InvalidUser);
								break;
							case "405":
								LOGIN_LoginFailed(MainData.Const.LOGIN_BannedUser);
								break;
								
						}
					}
					else
					{
						//MainData.ConnectionStatus++;

						// Send a wait message to bind, to
						// wait while loading scripts, css and images
						CONNECTION_SendJabber(MESSAGE_Wait());

						// Load scripts, css and images
						if (MainData.Load == -1)
						{
							MainData.Load = 0;
							LOGIN_Load();
						}
					}
					break;

			    default:
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
	var State, Status;

	if(MainData == null)
	{
		return;
	}

	//Check if HttpRequet Object exists
	if(MainData.HttpRequest == null)
	{
		return;
	}

	if (MainData.HttpRequest.readyState == 4)
	{
		// Try to get http request status
		try
		{
			Status = MainData.HttpRequest.status;
		}
		catch (e)
		{
			return null;
		}

		if (Status == 200)
		{
			// Get Xml response
			XML = MainData.HttpRequest.responseXML;

		    // Forward XML to parser
			Buffer = PARSER_ParseXml(XML);

			// User disconnected 
			if (MainData.ConnectionStatus == -1)
			{
				return null;
			}

			// Parser returned some xml: send it
			if ((Buffer != "") && (Buffer != null) && (Buffer != undefined))
			{
				CONNECTION_SendJabber(Buffer);
			}
			// Send a wait message to jabber
			else
			{
				CONNECTION_SendJabber(MESSAGE_Wait());
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
