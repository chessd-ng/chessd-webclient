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
function CONNECTION_Connect()
{
	switch (MainData.ConnectionStatus)
	{
		// Start connection
		case (1):
			CONNECTION_SendJabber()
			break;

		case (2):
			break;

		case (3):
			break;

		case (4):
			break;

		case (5):
			break;
	}
}

/**
* Send a XML post
*
* @return none
* @public
*/
function CONNECTION_SendJabber(Post)
{
	var DT;

	// Create XMLHttpRequest
	if (window.XMLHttpRequest) 
	{
		// Mozilla, Opera, Galeon
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) 
			http_request.overrideMimeType("text/xml");
	}
	else if (window.ActiveXObject) 
	{
		// Internet Explorer
		try{
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	// Avoid browser caching
	DT = Math.floor(Math.random()*10000);

	http_request.open('POST','http://'+MainData.Host+'/jabber?id='+DT , true);
	http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	
	// Normal messages
	if (MainData.ConnectionStatus == 0)
	{
		http_request.onreadystatechange = JABBER_ReceiveXml;
	}
	// Conection messages
	else
	{
		http_request.onreadystatechange = JABBER_ReceiveConnection;
	}

	// Send request to server
	http_request.send(Post);

	// Save last post in Data Struct
	MainData.LastXML = Post;
}
