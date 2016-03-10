<?php

error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();



if (isset($_SESSION["userid"])){
	if (isset($_POST["data"])){
		$dbManager = DBManager::app();
		$manager = new Manager($_SESSION["userid"]);
			
		if ($manager->createGame($_POST["data"])){
			Debug::log("Game created");
		}
		else {
			Debug::log("error creating");
		}
	}
	else {
		Debug::log("no data");
	}
}
else {
	Debug::log("no userid");
	echo "no userid!";
}

?>

<!DOCTYPE html>
<html>
<head>
	<link rel='stylesheet' href='style.css'/>
	<script src="jquery-2.1.1.min.js"></script>
	<script src='script.js'></script>
	<script src='ajax.js'></script>
</head>
	<body>
	</body>
</html>

<script>
</script>
