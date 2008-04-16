var HttpRequest;

var RegisterData;


/*
* Prepare data to send to register server
* @parameter void
* @return void
*/
/*function REGISTER_RegisterData(Host){
	
	this.UserName = "";
	this.UserPassword = "";
	this.Mail = "";
	this.Host = REGISTER_GetHost();
	this.SID = "";
	this.RID = parseInt(Math.random()*1000000000);
	this.Step = 0;

}
*/
function REGISTER_MakeXMPP(Msg){

	var XMPP = "<body rid='"+RegisterData.RID+"' sid='"+RegisterData.SID+"' xmlns='http://jabber.org/protocol/httpbind'>"+Msg+"</body>";
	this.RID++;

	return XMPP;
}

function REGISTER_Post()
{

	var User, Mail, Pwd, ConfPwd;
	var Valid;

	Pwd = document.getElementById("pwd").value;
	ConfPwd = document.getElementById("confpwd").value;
	Mail = document.getElementById("mail").value;
	User = document.getElementById("username").value;
	Valid = REGISTER_DateValidate(User, Mail, Pwd, ConfPwd);

	
	if(Valid > 0)
	{
		alert(REGISTER_GetError(valid));
		return false;
	}

	// RegisterData is used to register direct in Jabber, but now
	// this feature is not implemented
	/*
	RegisterData = new REGISTER_RegisterData();
   	var Msg = "<body hold='1' rid='"+RegisterData.RID+"' to='"+RegisterData.Host+"' ver='1.6' wait='10' xml:lang='en' xmlns='http://jabber.org/protocol/httpbind'/>";
	REGISTER_SendData(Msg);
	*/
	REGISTER_SendDataPHP(User, Mail, Pwd);
}


/*
* Get error in register user 
* @parameter var err int error code
* @return 	string error description
*/

function REGISTER_GetError(err)
{
	switch(err)
	{
		case 1: 
			return "User name invalido";
		case 2:
			return "Mail invlido";
		case 3:
			return "Senha invalida";
	}
}

/*
* Validate date before send
* @parameter var user - user name 
* @parameter var mail - user mail
* @parameter var pwd - user password
* @parameter var confpw - user password confirmation
* @return 0 sucess or error code
*/

function REGISTER_DateValidate(User, Mail, Pwd, ConfPW)
{
	//RE = regular expression	
	var REMail = /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/;
	var REUsername = /^\w{1,}$/

	if(!REUsername.test(User))
	{
		return 1;
	}

	if(Mail.length > 0)
	{
		if(!REMail.test(Mail))
		{
			return  2;
		}
	}

	if(!(Pwd == ConfPW && Pwd.length > 3))
	{
		return 3;
	}

	return 0;
}
 


/*
* Send data to register server
* @parameter var user - user name 
* @parameter var mail - user mail
* @parameter var pwd - user password
*/

function REGISTER_SendData(Msg)
{

// Create XMLHttpRequest
	if (window.XMLHttpRequest)
	{
		// Mozilla, Opera, Galeon
		HttpRequest = new XMLHttpRequest();

		if (HttpRequest.overrideMimeType)
		{
			HttpRequest.overrideMimeType("text/xml");
		}
	}
	else if (window.ActiveXObject)
	{
		// Internet Explorer
		try
		{
			HttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e)
		{
			HttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	// Avoid browser caching
	DT = Math.floor(Math.random()*10000);

	HttpRequest.open('POST', 'http://'+RegisterData.Host+'/jabber?id='+DT , true);
	HttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

	// ReceiveXml is used to register direct in Jabber, but now
	// this feature is not implemented
	//HttpRequest.onreadystatechange = REGISTER_ReceiveXml;
	HttpRequest.onreadystatechange = REGISTER_ReceiveXmlPHP;

	// Send request to server
	HttpRequest.send(Msg)

}



/**
*
* @return none
* @public
*/
function REGISTER_ReceiveXml()
{
	var XmlDoc;

	if (HttpRequest.readyState == 4)
	{
		if (HttpRequest.status == 200)
		{
			XmlDoc = HttpRequest.responseXML;
			REGISTER_ProcessMessage(XmlDoc);
		}
	}
}


function REGISTER_ProcessMessage(XmlDoc){

	var Msg, Uname, Passwd, TestBody, TestIq;
		
	TestIq = XmlDoc.getElementsByTagName("iq");
	TestBody = XmlDoc.getElementsByTagName("body");

	if(TestBody[0].getAttribute("condition"))
	{
		return;
	}

	if(TestIq.length == 0){
		Msg = "<iq type='get' id='reg1' to='shiva'><query xmlns='jabber:iq:register'/></iq>";
		RegisterData.SID = XmlDoc.getElementsByTagName("body")[0].getAttribute("sid");
		Msg = REGISTER_MakeXMPP(Msg);
		REGISTER_SendData(Msg);
	}
	else if(TestIq[0].getAttribute("id") == "reg1")
	{
			Uname = "<username>"+document.getElementById("username").value+"</username>";
			Passwd = "<password>"+document.getElementById("pwd").value+"</password>";
			Msg = "<iq type='set' id='reg2'><query xmlns='jabber:iq:register'>"
			Msg += Uname + Passwd + "</query></iq>";
			Msg = REGISTER_MakeXMPP(Msg);
			REGISTER_SendData(Msg);
	}
}

function REGISTER_GetDatabaseError(Msg, Usr)
{
	var ErrMsg = /violates unique constraint/

	if(ErrMsg.test(Msg))
		return "Nome de usurio "+Usr+" ja cadastrado, tente outro nome";
	
	return Msg;
}


/*
* Get language parameter
* @parameter string page url
* @return string language xml file
*/

function REGISTER_GetLanguage(URL)
{
	var QString = URL.split('?');

	if(QString[1]){
		QString = URL.split('=');
		if(QString[1])
			return "./scripts/lang/"+QString[1];
	}

	return "./scripts/lang/pt_BR.xml"
}


function REGISTER_GetHost(){
	
	var CONF = UTILS_OpenXMLFile("scripts/data/conf.xml");
	return UTILS_GetTag(CONF, "host");

}


function REGISTER_Labels()
{

	var XML = UTILS_OpenXMLFile(REGISTER_GetLanguage(window.location.href));
	var Inf = document.getElementById("register_inf");
	var Usrname = document.getElementById("register_user_name");
	var Mail = document.getElementById("register_mail");
	var MailInf = document.getElementById("register_mail_inf");
	var Pass = document.getElementById("register_passwd");
	var PassConf = document.getElementById("register_passwd_confirm");
	var Title =  document.getElementById("register_title");
	var BtConfirm = document.getElementById("register");
	var BtCancel = document.getElementById("cancel");

	Inf.innerHTML = UTILS_GetTag(XML, "register_inf");
	Usrname.innerHTML = UTILS_GetTag(XML, "register_user_name");
	Mail.innerHTML = UTILS_GetTag(XML, "register_mail");
	MailInf.innerHTML = UTILS_GetTag(XML, "register_mail_inf");
	Pass.innerHTML = UTILS_GetTag(XML, "register_passwd");
	PassConf.innerHTML = UTILS_GetTag(XML, "register_passwd_confirm");
	Title.innerHTML = UTILS_GetTag(XML, "register_title");
	BtConfirm.value = UTILS_GetTag(XML, "register_bt_confirm");
	BtCancel.value = UTILS_GetTag(XML, "register_bt_cancel");


}

/**************************************
***************** PHP *****************
**************************************/
function REGISTER_SendDataPHP(user, mail, pwd)
{

	var Post = "username="+user+"&mail="+mail+"&pwd="+pwd;
	// Create XMLHttpRequest
	if (window.XMLHttpRequest)
	{
		// Mozilla, Opera, Galeon
		HttpRequest = new XMLHttpRequest();
		if (HttpRequest.overrideMimeType)
		{
			HttpRequest.overrideMimeType("text/xml");
		}
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
			HttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	// Avoid browser caching
	DT = Math.floor(Math.random()*10000);

	HttpRequest.open('POST','php/register.php?jabber?id='+DT , true);
	HttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

	HttpRequest.onreadystatechange = REGISTER_ReceiveXmlPHP;

	// Send request to server
	HttpRequest.send(Post);
}

/**
*
* @return none
* @public
*/
function REGISTER_ReceiveXmlPHP()
{
    var XmlDoc;
        var Sql;
        var User;

    if (HttpRequest.readyState == 4)
    {
        if (HttpRequest.status == 200)
        {
            XmlDoc = HttpRequest.responseXML;
                        Sql = XmlDoc.getElementsByTagName("sql_result")[0].childNodes[0].nodeValue;
                        User = XmlDoc.getElementsByTagName("username")[0].childNodes[0].nodeValue;
                        if(Sql != "ok"){
                                alert(REGISTER_GetDatabaseError(Sql, User));

                        }else
                                window.location=(".");
        }
    }
}

