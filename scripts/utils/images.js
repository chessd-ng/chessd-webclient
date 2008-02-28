
	function createFormToEncode(form_id, action){
		var form, body, file;

		body = document.getElementsByTagName("body")[0];
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
		body.appendChild(form);
	}


	function imageDecode(image_id){
		var img = document.getElementById(image_id);
		nada = document.getElementById("nada").src="webclient/php/base64_decode.php?"+img.src.slice(5);
		img.src = "webclient/php/base64_decode.php?"+img.src.slice(5);

	}

	function imageEncode(formId){
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

	function b64Img(image, type){
		var img, body;

		img = document.createElement("img");
		img.src = "data:image/"+type+";base64,"+image;
		body = document.getElementsByTagName("body")[0];
		body.appendChild(img);

	}
