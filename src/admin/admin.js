import {
	UTILS_SortByIncident,
	UTILS_SortByTime,
	UTILS_GetNodeText,
	UTILS_SortByDate,
	UTILS_SortByCategory,
	UTILS_SortByBUsername,
	UTILS_GetText,
	UTILS_SortByReason,
	UTILS_SortByPunish,
	UTILS_SortByWUsername,
	UTILS_SortByRated,
	UTILS_SortByInc,
	UTILS_SortByPeriod,
	UTILS_SortByLevel,
	UTILS_SortByUsernameAsc,
	UTILS_SortByWRatingValue,
	UTILS_SortByBRatingValue,
} from 'utils/utils.js';
import {
	MESSAGE_UnbanUser,
	MESSAGE_RemoveBannedWord,
	MESSAGE_GetBannedWords,
	MESSAGE_GetBanList,
	MESSAGE_KickUser,
	MESSAGE_AddBannedWord,
	MESSAGE_BanUser,
} from 'xmpp_messages/message.js';
import { INTERFACE_AddBannedUser } from 'interface/admin.js';
import { AdminCenterObj, INTERFACE_CreateAdminCenter } from 'interface/admincenter.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import { WINDOW_Alert } from 'window/window.js';
import { INTERFACE_ShowAdminIcon } from 'interface/top.js';
import { MainData } from 'main_data.js';

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
* @file	admin/admin.js
* @brief Contains all parsers and actions to admin messages
*
* See interface functions to admin (script/interface/admin.js)
*/

/**
* @brief	Parser admin messages for rooms
*
* @param 	XML 	XML with admin commands results
* @return 	Buffer with other XMPP to send
* @author 	Ulysses Bomfim
*/
export function ADMIN_HandleRoomAdmin(XML)
{
	//TODO 
	var Buffer = "";
	
	return Buffer;
}

/**
* @brief	Parser administrative messages for admin
*
* Parser messages with administrative commands
* 
* @param 	XML 	XML with admin datas
* @return 	Buffer with other XMPP to send
* @author 	Rubens Suguimoto
*/
export function ADMIN_HandleAdmin(XML)
{
	var Id = XML.getAttribute("id");
	var Buffer = "";
	var Consts = MainData.GetConst();

	switch(Id)
	{
		// Show banned user's list
		case Consts.IQ_ID_GetBanList:
			ADMIN_HandleBanList(XML);
			break;

		// Show a window alert with banned user confirmation 
		/*
		case Consts.IQ_ID_BanUser:
			ADMIN_Notification(XML)
			break;
		*/

		// Show a window alert with unbanned user confirmation 
		case Consts.IQ_ID_UnbanUser:
			ADMIN_Notification(XML)
			break;

		// Show a window alert with kiked user confirmation 
		/*
		case Consts.IQ_ID_KickUser:
			ADMIN_Notification(XML)
			break;
		*/
		case Consts.IQ_ID_AddBannedWords:
			ADMIN_HandleAddWord(XML)
			break;
		case Consts.IQ_ID_RemoveBannedWords:
			ADMIN_HandleRemoveWord(XML)
			break;
		case Consts.IQ_ID_GetBannedWords:
			ADMIN_HandleBannedWordsList(XML)
			break;
	}
	
	return Buffer;
}

/**
* @brief	Parser administrative messages errors for admin
*
* Parser messages with administrative commands result errors
* 
* @param 	XML 	XML with admin data erros
* @return 	Buffer with other XMPP to send
* @author 	Rubens Suguimoto
*/
export function ADMIN_HandleAdminError(XML)
{
	var Id = XML.getAttribute("id");
	var Buffer = "";
	var Consts = MainData.GetConst();

	switch(Id)
	{
		// Show banned user's list
		case Consts.IQ_ID_GetBanList:
			ADMIN_HandleBanList(XML);
			break;

		// Show a window alert with banned user confirmation 
		/*
		case Consts.IQ_ID_BanUser:
			ADMIN_Notification(XML)
			break;
		*/

		// Show a window alert with unbanned user confirmation 
		case Consts.IQ_ID_UnbanUser:
			ADMIN_Notification(XML)
			break;

		// Show a window alert with kiked user confirmation 
		/*
		case Consts.IQ_ID_KickUser:
			ADMIN_Notification(XML)
			break;
		*/
		case Consts.IQ_ID_AddBannedWords:
			ADMIN_HandleAddWord(XML)
			break;
		case Consts.IQ_ID_RemoveBannedWords:
			ADMIN_HandleRemoveWord(XML)
			break;
		case Consts.IQ_ID_GetBannedWords:
			ADMIN_HandleBannedWordsList(XML)
			break;
	}
	
	return Buffer;
}

/**
* @brief	Parser user type to idenfify admin.
*
* Parser user type to show menu item to access administrative tools.
* 
* @param 	XML 	XML with user type
* @return 	Empty string
* @see		INTERFACE_ShowAdminIcon
* @author 	Rubens Suguimoto
*/
export function ADMIN_HandleInfo(XML)
{
	var TypeNode = XML.getElementsByTagName("type");
	var Type = TypeNode[0].getAttribute("type");
	var MyUsername = MainData.GetUsername();
	var ProfileNode = XML.getElementsByTagName("profile")[0];
	var Username = ProfileNode.getAttribute("jid").split("@")[0];

	if(Username == MyUsername)
	{
		if(Type == "admin")
		{
			INTERFACE_ShowAdminIcon();
		}
	}

	return "";
}

/**
* @brief	Parser and show notification of some action done by admin.
*
* Parse admin message with result of some action done and show in interface.
* 
* @param 	XML 	Xml with the messages
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
function ADMIN_Notification(XML)
{
	var Node = XML.firstChild;

	switch(Node.tagName)
	{
		case "kick":
			WINDOW_Alert("Kick",UTILS_GetText("admin_kick_ok"));
			break;
		case "ban":
			WINDOW_Alert("Ban",UTILS_GetText("admin_ban_ok"));
			break;
		case "unban":
			WINDOW_Alert("Unban",UTILS_GetText("admin_unban_ok"));
			break;
	}
	return "";
}

/**
 * @brief	Parser and show notification of some action done by admin to normal user.
 *
* Parse admin message with result of some action done and show in interface to normal user.
* 
* @param 	XML 	Xml with notification message
* @return 	Buffer with other XMPP to send;
* @author 	Rubens Suguimoto
*/
export function ADMIN_HandleUserNotification(XML)
{	
	var Node = XML.firstChild;
	var ReasonTag = XML.getElementsByTagName("reason")[0];
	var Reason = UTILS_GetNodeText(ReasonTag);
	var Buffer= "";

	switch(Node.tagName)
	{
		case "ban":
			alert(UTILS_GetText("admin_user_ban")+Reason);
			break;
		case "kick":
			alert(UTILS_GetText("admin_user_kick")+Reason);
			break;
	}	
	return Buffer;
}

/**
 * @brief	Parse and show banned user list to admin.
 *
 * Parse admin message with banned users and show as list in interface to admin.
* 
* @param 	XML 	XML with banned users
* @return 	Buffer with other XMPP to send
* @author 	Rubens Suguimoto
*/
function ADMIN_HandleBanList(XML)
{	
	var Users = XML.getElementsByTagName("user");
	var i;
	var Username;
	var Buffer = "";
	var ACenter = MainData.GetAdmincenter();
	var Reason;

	//Get all users in the message and show;
	for(i=0;i<Users.length;i++)
	{
		Username = Users[i].getAttribute("jid").split("@")[0];
		//INTERFACE_AddBannedUser(Username);
		Reason = UTILS_GetNodeText(Users[i]);
	
		ACenter.Punish.add(Username, "---","---","---","---",Reason);
		MainData.AddPunish(Username, "---","---","---","---",Reason);
	}

	return Buffer;
}

/**
* @brief	Handle banned words added notification
*
* @param	XML	XML with banned words notification
* @return 	Empty string;
* @author 	Rubens Suguimoto
*/
function ADMIN_HandleAddWord(XML)
{
	var Words;
	var WordTmp;
	var ACenter = MainData.GetAdmincenter();
	var IqType;
	
	IqType = XML.getAttribute("type");

	if(IqType == "result")
	{
		Words = XML.getElementsByTagName("word")[0];
		WordTmp = Words.getAttribute("word");

		ACenter.Words.add(WordTmp);
		MainData.AddWords(WordTmp);
	}
	else //if (IqType == "error")
	{
		WINDOW_Alert("Error", "Error to add word. Check if chess server is online or word was added before");
	}
	
	return "";
}

/**
* @brief	Handle banned words removed notification
*
* @param	XML	XML with banned words notification
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
function ADMIN_HandleRemoveWord(XML)
{
	var Words;
	var WordTmp;
	var ACenter = MainData.GetAdmincenter();
	var IqType;
	
	IqType = XML.getAttribute("type");

	if(IqType == "result")
	{
		Words = XML.getElementsByTagName("word")[0];
		WordTmp = Words.getAttribute("word");

		ACenter.Words.remove(WordTmp);
		MainData.RemoveWords(WordTmp);
	}	
	else //if (IqType == "error")
	{
		WINDOW_Alert("Error", "Error to remove word. Check if chess server is online or word was removed before");
	}

	return "";
}

/**
* @brief	Handle banned words list
*
* @param	XML	XML with banned words
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
function ADMIN_HandleBannedWordsList(XML)
{
	var Words;
	var WordTmp;
	var i;	
	var ACenter = MainData.GetAdmincenter();

	Words = XML.getElementsByTagName("word");

	for(i=0; i<Words.length ; i++)
	{
		WordTmp = Words[i].getAttribute("word");
		ACenter.Words.add(WordTmp);
		MainData.AddWords(WordTmp);
	}
	
	return "";
}


/************************
 * ADMIN - MESSAGES
 * **********************/
/**
 * @brief	Create and send message to kick some user and reason;
 *
 * Create and send message to kick some user and reason to kick him/her;
* 
* @param	Username	User name used by user
* @param	Reason		Reason to kick user
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function ADMIN_KickUser(Username, Reason)
{
	CONNECTION_SendJabber(MESSAGE_KickUser(Username,Reason));

	return "";
}

/**
 * @brief	Create and send message to ban some user and reason;
 *
 * Create and send message to ban some user and reason to ban him/her;
* 
* @param	Username	User name used by user
* @param	Reason		Reason to ban user
* @return 	Empty string;
* @author 	Rubens Suguimoto
*/
export function ADMIN_BanUser(Username, Reason)
{
	CONNECTION_SendJabber(MESSAGE_BanUser(Username, Reason));

	return "";
}

/**
 * @brief	Create and send message to unban some user and reason;
 *
 * Create and send message to unban some user and reason to unban him/her;
* 
* @param	Username	User name used by user
* @param	Reason		Reason to unban user
* @return 	Empty string;
* @author 	Rubens Suguimoto
*/
export function ADMIN_UnbanUser(Username, Reason)
{
	CONNECTION_SendJabber(MESSAGE_UnbanUser(Username, Reason));

	return "";
}

/**
 * @brief	Create and send message to get banned users's list
 *
 * Create and send message to get all banned users from server 
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function ADMIN_GetBanList()
{
	CONNECTION_SendJabber(MESSAGE_GetBanList());
	
	return "";
}

/**
* @brief	Create and send message to ban some word
*
* Create and send message to ban some word 
* 
* @param 	Word 	String to ban
* @return 	Empty string;
* @author 	Rubens Suguimoto
*/
export function ADMIN_BanWord(Word)
{
	CONNECTION_SendJabber(MESSAGE_AddBannedWord(Word));

	return "";
}

/**
* @brief	Create and send message to unban some word
*
* Create and send message to unban some word 
* 
* @param 	Word 	String to ban
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function ADMIN_RemoveBannedWord(Word)
{
	CONNECTION_SendJabber(MESSAGE_RemoveBannedWord(Word));

	return "";
}

/**
* @brief	Create and send message to get all banned words
*
* Create and send message to get all banned words
*
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
export function ADMIN_GetBannedWords()
{
	CONNECTION_SendJabber(MESSAGE_GetBannedWords());

	return "";
}

/************************
 * ADMINCENTER - START
 * **********************/

/**
* @brief	Start admin center object
*
* Create and show admin center object in interface. Get all banned words
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_StartAdminCenter()
{
	var ACenterObj = new AdminCenterObj();
	
	MainData.SetAdmincenter(ACenterObj);

	//Get banned words list
	ADMIN_GetBannedWords();
}

/**
* @brief	Show punish tab in admin center object
*
* Show punished players tab in admin center object and hide others tabs
* 
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_ShowPunish()
{
	var AdminCenterObj = MainData.GetAdmincenter();

	if (AdminCenterObj.CurrentDiv != AdminCenterObj.Punish)
	{
		AdminCenterObj.CurrentDiv.hide();
		AdminCenterObj.Punish.show(AdminCenterObj.AdminCenterDiv);

		AdminCenterObj.CurrentDiv = AdminCenterObj.Punish;
	}
}

/**
* @brief	Show admin level tab in admin center object
*
* Show admin level tab in admin center object and hide others tabs
* 
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_ShowAdminLevel()
{
	var AdminCenterObj = MainData.GetAdmincenter();

	if (AdminCenterObj.CurrentDiv != AdminCenterObj.AdminLevel)
	{
		AdminCenterObj.CurrentDiv.hide();
		AdminCenterObj.AdminLevel.show(AdminCenterObj.AdminCenterDiv);

		AdminCenterObj.CurrentDiv = AdminCenterObj.AdminLevel;
	}
}

/**
* @brief	Show player's level tab in admin center object
*
* Show player's level tab in admin center object and hide others tabs
* 
* @return	none 
* @see		INTERFACE_CreateAdminCenter 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_ShowLevel()
{
	var AdminCenterObj = MainData.GetAdmincenter();

	if (AdminCenterObj.CurrentDiv != AdminCenterObj.Level)
	{
		AdminCenterObj.CurrentDiv.hide();
		AdminCenterObj.Level.show(AdminCenterObj.AdminCenterDiv);

		AdminCenterObj.CurrentDiv = AdminCenterObj.Level;
	}
}

/**
* @brief	Show adjourned games tab in admin center object
*
* Show adjourned games tab in admin center object and hide others tabs
* 
* @return	none 
* @see		INTERFACE_CreateAdminCenter 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_ShowAdjourn()
{
	var AdminCenterObj = MainData.GetAdmincenter();

	if (AdminCenterObj.CurrentDiv != AdminCenterObj.Adjourn)
	{
		AdminCenterObj.CurrentDiv.hide();
		AdminCenterObj.Adjourn.show(AdminCenterObj.AdminCenterDiv);

		AdminCenterObj.CurrentDiv = AdminCenterObj.Adjourn;
	}
}

/**
* @brief	Show banned words tab in admin center object
*
* Show banned words tab in admin center object and hide others tabs
* 
* @return	none 
* @see		INTERFACE_CreateAdminCenter 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_ShowWords()
{
	var AdminCenterObj = MainData.GetAdmincenter();

	if (AdminCenterObj.CurrentDiv != AdminCenterObj.Words)
	{
		AdminCenterObj.CurrentDiv.hide();
		AdminCenterObj.Words.show(AdminCenterObj.AdminCenterDiv);

		AdminCenterObj.CurrentDiv = AdminCenterObj.Words;
	}
}

/**
* @brief	Clear banned words list in admin center object
*
* Remove all words in banned words list inside admin center object
* 
* @return	none 
* @see		INTERFACE_CreateAdminCenter 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_ClearBannedWordsList()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var Word;
	
	for(i=AdminCenterObj.Words.WordsList.length-1; i>=0; i--)
	{
		Word = AdminCenterObj.Words.WordsList[i].Id;
		AdminCenterObj.Words.remove(Word);
	}
}

/**
* @brief	Clear punished players list in admin center object
*
* Remove all players in punished players list inside admin center object
* 
* @return	none 
* @see		INTERFACE_CreateAdminCenter 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_ClearPunishList()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var Punish;
	
	for(i=AdminCenterObj.Punish.PunishList.length-1; i>=0; i--)
	{
		Punish = AdminCenterObj.Punish.PunishList[i].Id;
		AdminCenterObj.Punish.remove(Punish);
	}
}

/*****************************
 * ADMINCENTER - SORT FUNCTIONS
 * ***************************/

/**
* @brief	Sort punished players list by username
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_PunishSortByUsername()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var PunishList = MainData.GetPunishList();
	var SortMethod = UTILS_SortByUsernameAsc;
	var i;
	var PunishItem;

	PunishList.sort(SortMethod);

	for(i=0; i<PunishList.length; i++)
	{
		PunishItem = PunishList[i];
		AdminCenterObj.Punish.remove(PunishItem.Id);

		AdminCenterObj.Punish.add(PunishItem.Username, PunishItem.Punish, PunishItem.Incident,  PunishItem.Date, PunishItem.Period, PunishItem.Reason );
	}
}

/**
* @brief	Sort punished players list by punish
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_PunishSortByPunish()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var PunishList = MainData.GetPunishList();
	var SortMethod = UTILS_SortByPunish;
	var i;
	var PunishItem;

	PunishList.sort(SortMethod);

	for(i=0; i<PunishList.length; i++)
	{
		PunishItem = PunishList[i];
		AdminCenterObj.Punish.remove(PunishItem.Id);

		AdminCenterObj.Punish.add(PunishItem.Username, PunishItem.Punish, PunishItem.Incident,  PunishItem.Date, PunishItem.Period, PunishItem.Reason );
	}
}

/**
* @brief	Sort punished players list by incident
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_PunishSortByIncident()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var PunishList = MainData.GetPunishList();
	var SortMethod = UTILS_SortByIncident;
	var i;
	var PunishItem;

	PunishList.sort(SortMethod);

	for(i=0; i<PunishList.length; i++)
	{
		PunishItem = PunishList[i];
		AdminCenterObj.Punish.remove(PunishItem.Id);

		AdminCenterObj.Punish.add(PunishItem.Username, PunishItem.Punish, PunishItem.Incident,  PunishItem.Date, PunishItem.Period, PunishItem.Reason );
	}

}

/**
* @brief	Sort punished players list by date
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_PunishSortByDate()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var PunishList = MainData.GetPunishList();
	var SortMethod = UTILS_SortByDate;
	var i;
	var PunishItem;

	PunishList.sort(SortMethod);

	for(i=0; i<PunishList.length; i++)
	{
		PunishItem = PunishList[i];
		AdminCenterObj.Punish.remove(PunishItem.Id);

		AdminCenterObj.Punish.add(PunishItem.Username, PunishItem.Punish, PunishItem.Incident,  PunishItem.Date, PunishItem.Period, PunishItem.Reason );
	}

}

/**
* @brief	Sort punished players list by period
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_PunishSortByPeriod()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var PunishList = MainData.GetPunishList();
	var SortMethod = UTILS_SortByPeriod;
	var i;
	var PunishItem;

	PunishList.sort(SortMethod);

	for(i=0; i<PunishList.length; i++)
	{
		PunishItem = PunishList[i];
		AdminCenterObj.Punish.remove(PunishItem.Id);

		AdminCenterObj.Punish.add(PunishItem.Username, PunishItem.Punish, PunishItem.Incident,  PunishItem.Date, PunishItem.Period, PunishItem.Reason );
	}

}
/**
* @brief	Sort punished players list by reason
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_PunishSortByReason()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var PunishList = MainData.GetPunishList();
	var SortMethod = UTILS_SortByReason;
	var i;
	var PunishItem;

	PunishList.sort(SortMethod);

	for(i=0; i<PunishList.length; i++)
	{
		PunishItem = PunishList[i];
		AdminCenterObj.Punish.remove(PunishItem.Id);

		AdminCenterObj.Punish.add(PunishItem.Username, PunishItem.Punish, PunishItem.Incident,  PunishItem.Date, PunishItem.Period, PunishItem.Reason );
	}

}

/**
* @brief	Sort admin level list by username
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdminLevelSortByUsername()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdminLevelList = MainData.GetAdminLevelList();
	var SortMethod = UTILS_SortByUsernameAsc;
	var i;
	var AdminLevelItem;

	AdminLevelList.sort(SortMethod);

	for(i=0; i<AdminLevelList.length; i++)
	{
		AdminLevelItem = AdminLevelList[i];
		AdminCenterObj.AdminLevel.remove(AdminLevelItem.Id);

		AdminCenterObj.AdminLevel.add(AdminLevelItem.Username, AdminLevelItem.Level );
	}
}

/**
* @brief	Sort admin level list by level
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdminLevelSortByLevel()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdminLevelList = MainData.GetAdminLevelList();
	var SortMethod = UTILS_SortByLevel;
	var i;
	var AdminLevelItem;

	AdminLevelList.sort(SortMethod);

	for(i=0; i<AdminLevelList.length; i++)
	{
		AdminLevelItem = AdminLevelList[i];
		AdminCenterObj.AdminLevel.remove(AdminLevelItem.Id);

		AdminCenterObj.AdminLevel.add(AdminLevelItem.Username, AdminLevelItem.Level );
	}
}

/**
* @brief	Sort level list by username
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_LevelSortByUsername()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var LevelList = MainData.GetLevelList();
	var SortMethod = UTILS_SortByUsernameAsc;
	var i;
	var LevelItem;

	LevelList.sort(SortMethod);

	for(i=0; i<LevelList.length; i++)
	{
		LevelItem = LevelList[i];
		AdminCenterObj.Level.remove(LevelItem.Id);

		AdminCenterObj.Level.add(LevelItem.Username, LevelItem.Level );
	}
}

/**
* @brief	Sort level list by level
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_LevelSortByLevel()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var LevelList = MainData.GetLevelList();
	var SortMethod = UTILS_SortByLevel;
	var i;
	var LevelItem;

	LevelList.sort(SortMethod);

	for(i=0; i<LevelList.length; i++)
	{
		LevelItem = LevelList[i];
		AdminCenterObj.Level.remove(LevelItem.Id);

		AdminCenterObj.Level.add(LevelItem.Username, LevelItem.Level );
	}
}

/**
* @brief	Sort adjourn list by white player rating
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdjournSortByWRating()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByWRatingValue;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}

/**
* @brief	Sort adjourn list by black player rating
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdjournSortByBRating()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByBRatingValue;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}

/**
* @brief	Sort adjourn list by white player username
*
* @return	none 
* @author 	Rubens Suguimoto
*/
function ADMINCENTER_AdjournSortByWUsername()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByWUsername;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}

/**
* @brief	Sort adjourn list by black player username
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdjournSortByBUsername()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByBUsername;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}

/**
* @brief	Sort adjourn list by game category
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdjournSortByCategory()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByCategory;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}

/**
* @brief	Sort adjourn list by game time
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdjournSortByTime()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByTime;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}

/**
* @brief	Sort adjourn list by game time increment
*
* @return	none 
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdjournSortByInc()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByInc;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}

/**
* @brief	Sort adjourn list by game rated
*
* @return	none
* @author 	Rubens Suguimoto
*/
export function ADMINCENTER_AdjournSortByRated()
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var AdjournList = MainData.GetAdjournList();
	var SortMethod = UTILS_SortByRated;
	var i;
	var AdjournItem;

	AdjournList.sort(SortMethod);

	for(i=0; i<AdjournList.length; i++)
	{
		AdjournItem = AdjournList[i];
		AdminCenterObj.Adjourn.remove(AdjournItem.Id);

		AdminCenterObj.Adjourn.add(AdjournItem.WPlayer, AdjournItem.WRating, AdjournItem.BPlayer, AdjournItem.BRating, AdjournItem.Category, AdjournItem.Time, AdjournItem.Inc, AdjournItem.Rated, AdjournItem.Id );
	}
}
