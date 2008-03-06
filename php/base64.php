<?php

$image = $_FILES["image"];
$result = 0;
$type = "";


if(eregi("^image\/(jpg|jpeg|png|gif)$", $image["type"])){
	if(is_uploaded_file($_FILES["image"]["tmp_name"])){
		
		$type = $image["type"];
		$fd = fopen($image['tmp_name'], "rb");
		$convert=fread($fd, $image['size'] );
		$convert = base64_encode($convert);
		fclose($fd);

	}else{
		$result = 1;
		$convert="Error: Invalid file";
	}
}else{
		$result = 2;
		$convert="Error: Invalid file type ".$image['type'];
}

?>

<HTML>
<script>
	imageResult();
	function imageResult(){
		
		if(<?=$result?>)
			document.write("Erro: <?=$convert?>");
		else
			document.write("<?=$convert?>");

		parent.IMAGE_B64Img("<?=$convert?>", "<?=$type?>");
	}
</script>

</HTML>

