import { LOAD_StartLoad } from 'load/load.js';
import { PARSER_ParseXml } from 'parser/parser.js';
import { UTILS_GetText } from 'utils/utils.js';
import {
	MESSAGE_MakeXMPP,
	MESSAGE_Wait,
	MESSAGE_SendUsername,
	MESSAGE_SendPasswd,
	MESSAGE_StartConnection,
} from 'xmpp_messages/message.js';
import { START_Restart } from 'start.js';
import { LOGIN_LoginMsg, LOGIN_LoginFailed, LOGIN_EndLogin } from 'login/login.js';
import { MainData, START_Webclient } from 'start.js';

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
* @file		connection/connection.js
* @brief	This file has all functions that is used to provide a connection
* 		with a Jabber Server.
*/

/**
* @brief	Open connection with Jabber server
*
* @return 	Empty string;
* @author	Pedro Rocha
*/
export function CONNECTION_ConnectJabber(XML)
{
	if(XML == null)
	{
		//switch (MainData.ConnectionStatus)
		switch (MainData.GetConnectionStatus())
		{
			// Start connection, open stream with bosh
			case (1):
				CONNECTION_SendJabber(MESSAGE_StartConnection());
				LOGIN_LoginMsg(UTILS_GetText("login_connection_start"));
				break;

			// Send Username
			case (2):
				CONNECTION_SendJabber(MESSAGE_SendUsername());
				LOGIN_LoginMsg(UTILS_GetText("login_connection_user"));
				break;

			// Send password and resource to login
			case (3):
				CONNECTION_SendJabber(MESSAGE_SendPasswd());
				LOGIN_LoginMsg(UTILS_GetText("login_connection_passwd"));
				break;
		}
	}
	else
	{
		// Send a wait message
		CONNECTION_SendJabber();
	}

	return "";
}

/**
* @brief	Send a XML post
*
* You can pass more than one XML message as parameter
*
* @return	Empty string
* @author	Pedro Rocha
*/
export function CONNECTION_SendJabber()
{
	var Post = "", DT, i;
	var HttpRequest;

	// If receive too many parameters, merge then
	for (i=0; i<arguments.length; i++)
	{
		Post += arguments[i];
	}

	// Check if connection status == "disconnected" or SID not initialized
	if ((MainData.GetSID() != -1) && (MainData.GetConnectionStatus() != -1))
	{
		Post = MESSAGE_MakeXMPP(Post);
	}

	// Create XMLHttpRequest
	if (window.XMLHttpRequest) 
	{
		// Mozilla, Opera, Galeon
		HttpRequest = new XMLHttpRequest();
		if (HttpRequest.overrideMimeType) 
			HttpRequest.overrideMimeType("text/xml");
	}
	else if (window.ActiveXObject) 
	{
		// Internet Explorer
		try
		{
			HttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(e)
		{
			HttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}
	}

	// This variable is used to avoid browser caching
	DT = Math.floor(Math.random()*10000);

	HttpRequest.open('POST','http://'+MainData.GetHostPost()+'/jabber' , true);
	
	// Normal parse messages responses
	if (MainData.GetConnectionStatus() == 0)
	{
		HttpRequest.onreadystatechange = function(){
			CONNECTION_ReceiveXml(HttpRequest);
		}
	}
	// Conection parse messages responses
	else if (MainData.GetConnectionStatus() > 0)
	{
		HttpRequest.onreadystatechange = function(){
			CONNECTION_ReceiveConnection(HttpRequest);
		}
	}

	// Send request to server
	HttpRequest.send(Post);

	// Save last post in Data Struct
	MainData.LastXML = Post;

	// Add Post in data Struct
	MainData.AddHttpPost(HttpRequest);

	// Increment RID
	MainData.SetRID(MainData.GetRID()+1);

	return "";
}


/**
* @brief	Receive Connection messages and make all steps to connect user
*
* @return 	Empty string
* @author	Pedro Rocha
*/
function CONNECTION_ReceiveConnection(HttpRequest)
{
	var XML, XMLBuffer;
	var Error, ErrorCode;
	var BodyType;
	var Iq, IqType;
	var Status;

	// Check ready state of HTTP Request
	if (HttpRequest.readyState == 4 )
	{
		try
		{
			Status = HttpRequest.status;
		}
		catch(e)
		{
			return "";
		}	

		if(Status == 200)
		{
			XML = HttpRequest.responseXML;

			// Check Bosh connection 
			BodyType = XML.getElementsByTagName("body")[0].getAttribute("type");
			if(BodyType != null)
			{
				if(BodyType == "terminate")
				{
					LOGIN_LoginFailed(UTILS_GetText("login_connection_closed"));
					return "";
				}
			}

			//switch (MainData.ConnectionStatus)
			switch (MainData.GetConnectionStatus())
			{
				 case (1):
					if(XML.getElementsByTagName("body")[0].getAttribute("sid") == null)
					{
						LOGIN_LoginFailed(UTILS_GetText("login_connection_refused"));
						return "";
					}
					else // Step one OK
					{
						// Get SID from first message
						MainData.SetSID(XML.getElementsByTagName("body")[0].getAttribute("sid"));

						//MainData.ConnectionStatus++;
						MainData.SetConnectionStatus(MainData.GetConnectionStatus() + 1);

						// Send second step connection
						CONNECTION_ConnectJabber();
					}
					break;

				case(2):
					Iq = XML.getElementsByTagName("iq")[0];
					if(Iq != null)
					{
						IqType = Iq.getAttribute("type");
						if(IqType == "result")
						{
							//MainData.ConnectionStatus++;
							MainData.SetConnectionStatus(MainData.GetConnectionStatus() + 1);
							// Send third step connection
							CONNECTION_ConnectJabber();
						}
					}
					// this case should happen when server is very slow to response authentication;
					else
					{
						// Send wait to bosh until server response the first message of authentication
						CONNECTION_ConnectJabber(MESSAGE_Wait());
					}
					break;

				case(3):
					Iq = XML.getElementsByTagName("iq")[0];
					if(Iq != null)
					{
						IqType = Iq.getAttribute("type");
						// Check errors in username and passwd authentication
						if(IqType == "error")
						{
							Error = XML.getElementsByTagName("error")[0];
							if (Error != null)
							{
								ErrorCode = Error.getAttribute("code");
								switch(ErrorCode)
								{
									// Username and passwd invalid
									case "401":
										LOGIN_LoginFailed(UTILS_GetText("login_invalid_user"));
										break;
									// User was banned by admin
									case "405":
										LOGIN_LoginFailed(UTILS_GetText("login_banned_user"));
										break;
								}
							}
						}
						else //if(IqType == "result")
						{

              LOGIN_EndLogin();
              START_Webclient()

							// Set connected status
							MainData.SetConnectionStatus(0);

							CONNECTION_SendJabber(MESSAGE_Wait());
						}
					}
					// this case should happen when server is very slow to response authentication;
					else
					{
						// Send wait to bosh until server response the second message of authentication
						CONNECTION_ConnectJabber(MESSAGE_Wait());
					}

					break;
			}
		}
		// Server offline
		else if (HttpRequest.status == 503)
		{
			LOGIN_LoginFailed(UTILS_GetText("login_server_down"));
		}
		// Server not founded
		else if (HttpRequest.status == 404)
		{
			LOGIN_LoginFailed(UTILS_GetText("login_server_not_founded"));
		}
		// Server offline
		else
		{	
			LOGIN_LoginFailed(UTILS_GetText("login_server_down"));
		}

		// Remove post from data struct
		MainData.RemoveHttpPost(HttpRequest);
	}
	return "";
}


/**
* @brief 	Receive a Jabber message when user is already connected
*
* @return 	Empty string
* @author	Pedro Rocha
*/
function CONNECTION_ReceiveXml(HttpRequest)
{
	var XML, Buffer = "";
	var State, Status;

	// User was disconnected 
	if (MainData.GetConnectionStatus() == -1)
	{
		return "";
	}


	//if (MainData.HttpRequest.readyState == 4)
	if (HttpRequest.readyState == 4)
	{
		// Try to get http request status
		try
		{
			Status = HttpRequest.status;
		}
		catch (e)
		{
			return "";
		}

		if (Status == 200)
		{
			// Get Xml response
			XML = HttpRequest.responseXML;

			// User disconnected 
			if (MainData.GetConnectionStatus() == -1)
			{
				return "";
			}

			// Forward XML to parser functions
			Buffer = PARSER_ParseXml(XML);

			// Parser returned some xml: send it
			if ((Buffer != "") && (Buffer != null) && (Buffer != undefined))
			{
				CONNECTION_SendJabber(Buffer);
			}
			else
			{
				// Remove post from data struct
				MainData.RemoveHttpPost(HttpRequest);

				// Send a wait message to jabber if is there 
				// no pendend post
				if(MainData.GetHttpRequestLength() == 0)
				{
					CONNECTION_SendJabber(MESSAGE_Wait());
				}

				return "";
			}
		}

		// Re-send last XML
		else if (HttpRequest.status == 502)
		{
			CONNECTION_SendJabber(MainData.LastXML);
		}

		// Server down
		else if (HttpRequest.status == 503)
		{
			// Show this message if user is connected
			if(MainData.GetConnectionStatus() == 0)
			{
				alert(UTILS_GetText("error_disconnected"));
			
				START_Restart();	
			}
		}

		// Remove post from data struct
		MainData.RemoveHttpPost(HttpRequest);
	}

	return "";
}
