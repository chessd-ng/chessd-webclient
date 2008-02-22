var HttpRequest;

function post()
{
	var name, user, mail, pwd, confpwd;

	pwd = document.getElementById("pwd").value;
	confpwd = document.getElementById("confpwd").value;
	mail = document.getElementById("mail").value;
	user = document.getElementById("username").value;
	valid = dateValidate(user, mail, pwd, confpwd);
	
	if(valid > 0)
	{
		alert(getError(valid));
		return false;
	}
		sendData(user, mail, pwd);
}

function getError(err)
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

function dateValidate(user, mail, pwd, confpw)
{
		
	var re_mail = /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/;
	var re_username = /^\w{1,}$/
	if(!re_username.test(user))
		return 1 
	if(mail.length > 0){
	if(!re_mail.test(mail))
		return  2;
	}

	if(!(pwd == confpw && pwd.length > 3))
		return 3;

	return 0;

}
 

function sendData(user, mail, pwd)
{
  
	var Post = "username="+user+"&mail="+mail+"&pwd="+pwd; 
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
           	HttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    	}
    }

    // Avoid browser caching
    DT = Math.floor(Math.random()*10000);
	
    HttpRequest.open('POST','php/register.php?jabber?id='+DT , true);
    HttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

   	HttpRequest.onreadystatechange = ReceiveXml;

   	// Send request to server
   	HttpRequest.send(Post)

}



/**
*
* @return none
* @public
*/
function ReceiveXml()
{
    var XmlDoc;
	var sql;
	var user;

    if (HttpRequest.readyState == 4)
    {
        if (HttpRequest.status == 200)
        {
            XmlDoc = HttpRequest.responseXML;
			sql = XmlDoc.getElementsByTagName("sql_result")[0].childNodes[0].nodeValue;
			user = XmlDoc.getElementsByTagName("username")[0].childNodes[0].nodeValue;
			if(sql != "ok"){
				alert(getDatabaseError(sql, user));

			}else
				window.location=(".");
        }
    }
}


function getDatabaseError(msg, usr)
{

	var errmsg = /violates unique constraint/

	if(errmsg.test(msg))
		return "Nome de usurio "+usr+" ja cadastrado, tente outro nome";
	
	return msg;
}


function msgBox(msg){
/*
	var div, label, bt, body;
	body = document.getElementsByTag
	div = document.createElement("div");
	label = document.createElement("p");
	bt = document.createElement("input");
	label.innerHTML = msg;
	bt.value="Ok";
	div.appendChild(label);
	div.appendChild(bt);
*/
}



