
function IMAGE_CreateFormToEncode(form_id, action){
	var form, file;

	form = document.createElement("form");
	form.id= form_id;
	form.action = action;
	form.method = "post";
	form.name = form_id;
	form.enctype="multipart/form-data"
	file = document.createElement("input");
	file.type = "file";
	file.name = "image";
	
	form.appendChild(file);
	return form;
}


function IMAGE_ImageDecode(image_id){
	var img = document.getElementById(image_id);
	nada = document.getElementById("nada").src="webclient/php/base64_decode.php?"+img.src.slice(5);
	img.src = "webclient/php/base64_decode.php?"+img.src.slice(5);

}

function IMAGE_ImageEncode(formId){
	var frame, body, form;
	
	frame = document.createElement("iframe");
	frame.name = "nda";
	frame.setAttribute("style","width: 0; height: 0; border: none;");
	body = document.getElementsByTagName("body")[0];
	body.appendChild(frame);
	form = document.getElementById(formId);
	form.target = frame.name;
	form.submit();



}

//if type == ""; error!!!!
function IMAGE_B64Img(image, type){
	var Profile;
	var Img;

	// Set my profile data
	MainData.SetMyProfile("","","",type,image);

	Img = "data:"+type+";base64,"+image;

	Profile = MainData.GetProfile(MainData.Username+"@"+MainData.Host);
	if(Profile != null)
	{
		Profile.Profile.SetUserImg(Img);
	}
	
}
