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
* Append initial files
*/

// Create NoCache object
var NoCache = new Object();

NoCache.DateTime = new Date();
NoCache.TimeStamp = "";
NoCache.TimeStamp += NoCache.DateTime.getMonth();
NoCache.TimeStamp += "/"+NoCache.DateTime.getDate();
NoCache.TimeStamp += "/"+NoCache.DateTime.getFullYear();
NoCache.TimeStamp += "-"+NoCache.DateTime.getHours();
NoCache.TimeStamp += ":"+NoCache.DateTime.getMinutes();
NoCache.TimeStamp += ":"+NoCache.DateTime.getSeconds();

/* 
 * @brief	Create script or link element and append file in head element
 *
 * @param	FileType	File's type
 * @param	Addr	File's address
 * @return	void
 * @author	Danilo Yorinori
 */
function INITIAL_AppendFiles(FileType,Addr)
{
	var File;
	var Head = document.getElementsByTagName("head")[0];

	switch(FileType)
	{
		case "scripts":
			File = document.createElement("script");
			File.src = Addr+"?"+NoCache.TimeStamp;
			File.type = "text/javascript";
			Head.appendChild(File);
			break;

		case "css":
			File = document.createElement("link");
			File.href = Addr+"?"+NoCache.TimeStamp;
			File.type = "text/css";
			File.rel = "stylesheet";
			Head.appendChild(File);
			break;

		case "favicon":
			File = document.createElement("link");
			File.href = Addr;
			File.rel = "shortcut icon";
			Head.appendChild(File);
			break;
	}
}

// Append favicon
INITIAL_AppendFiles("favicon","images/favicon.ico");

// Append css files
INITIAL_AppendFiles("css","css/Main.css");
INITIAL_AppendFiles("css","css/Login.css");
INITIAL_AppendFiles("css","css/Load.css");

// Append script files
INITIAL_AppendFiles("scripts","scripts/utils/utils.js");
INITIAL_AppendFiles("scripts","scripts/data/data.js");
INITIAL_AppendFiles("scripts","scripts/data/consts.js");
INITIAL_AppendFiles("scripts","scripts/login/login.js");
INITIAL_AppendFiles("scripts","scripts/load/load.js");
INITIAL_AppendFiles("scripts","scripts/connection/connection.js");
INITIAL_AppendFiles("scripts","scripts/xmpp_messages/message.js");
INITIAL_AppendFiles("scripts","scripts/parser/parser.js");
INITIAL_AppendFiles("scripts","scripts/parser/parser_presence.js");
INITIAL_AppendFiles("scripts","scripts/interface/login.js");
INITIAL_AppendFiles("scripts","scripts/interface/load.js");
INITIAL_AppendFiles("scripts","scripts/start.js");
