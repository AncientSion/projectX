<?php

error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();


$dbManager = DBManager::app();
$manager = new Manager($_SESSION["userid"]);
$manager->gameid = $_SESSION["gameid"];

if (isset($_POST["lanes"])){	
	$lanes = JSON_decode($_POST["lanes"]);

	foreach ($lanes as $lane){
		if ($dbManager->insertLane($lane)){		
			Debug::log("lane created");
		}
		else {
			Debug::log("lane ERROR");
		}
	}
}
else if (isset($_POST["gates"])){
	$gates = JSON_decode($_POST["gates"], true);
	foreach ($gates as $gate){
		if ($dbManager->insertGate($gate)){
			Debug::log("gate created");
		}
		else {
			Debug::log("gate ERROR");
		}	
	}
}
else if (isset($_POST["sectors"])){
	$sectors = JSON_decode($_POST["sectors"], true);
		
	foreach ($sectors as $sector){
		if ($dbManager->insertSector($sector)){
			Debug::log("sector created");
		}
		else {
			Debug::log("sector ERROR");
		}	
	}
}
else if (isset($_POST["planets"])){
	$planets = JSON_decode($_POST["planets"], true);
		
	foreach ($planets as $planet){
		if ($dbManager->insertPlanet($planet)){
			Debug::log("planet created");
		}
		else {
			Debug::log("planet ERROR");
		}	
	}
}
else if (isset($_POST["fleets"])){
	$fleets = JSON_decode($_POST["fleets"], true);
		
	foreach ($fleets as $fleet){
		if ($dbManager->insertFleet($fleet)){
			Debug::log("fleet created");
		}
		else {
			Debug::log("fleet ERROR");
		}

		$lastid = $dbManager->getLastInsertId();

		foreach ($fleet["ships"] as $ship){
			if ($dbManager->insertShip($ship, $lastid)) {
				Debug::log("ship created");
			}
			else {
				Debug::log("ship ERROR");
			}
		}
	}
}
else if (isset($_POST["moves"])){	
	$moves = JSON_decode($_POST["moves"], true);	
	$return = $manager->insertMoves($moves);

	if ($return){
		Debug::log("moves success");
	}
}
else if (isset($_POST["order"])){
	$manager->endCurrentTurn();	
}
else if (isset($_POST["type"])){
	if ($_POST["type"] == "join"){
		$gameid = $_POST["gameid"];
		$playerid = $_SESSION["userid"];
		Debug::log("type");
			if ($dbManager->joinGame($gameid, $playerid)){
			return true;
		}
	}
	else if ($_POST["type"] == "leave"){
		$gameid = $_POST["gameid"];
		$playerid = $_SESSION["userid"];
		if ($dbManager->leaveGame($gameid, $playerid)){
			return true;
		}
	}
	else if ($_POST["type"] == "start"){
		$gameid = $_POST["gameid"];
		if ($dbManager->startGame($gameid)){
			return true;
		}
	}
}
else {
	echo "no data to be found";
}

?>
