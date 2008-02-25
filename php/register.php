<?header('Content-Type: text/xml');?>

<?php

require_once("connection.php");
require_once("md5lib.php");

$ENC_TYPE="md5";

$username=$_POST["username"];
$mail=$_POST["mail"];
$pwd=$_POST["pwd"];


if($ENC_TYPE == "md5"){
    $salt = $pwd[3] . $pwd[4];
    $magic = "$1$";

    $encpwd = md5crypt($pwd , $salt, $magic);

}else
    $encpwd=sha1($pwd);




$dbConn = new db();

$query = "select * from standart_register('$username', '$mail', '$encpwd', 'shiva')";

$result = $dbConn->executeData($query);

$xmlRet = "<result type='inert'>\n\t<username>$username</username><mail>$mail</mail><sql_result>$result</sql_result></result>";
echo($xmlRet);

?>
