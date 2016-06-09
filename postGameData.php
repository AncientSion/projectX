<?php

error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();


$dbManager = DBManager::app();
$manager = new Manager($_SESSION["userid"]);
$manager->gameid = $_SESSION["gameid"];


if (isset($_POST["order"])){
	debug::log("post");
	if ($_POST["order"] == "endTurn"){
		if ($manager->endCurrentTurn()){
			Debug::log("turn adjusted to END");
		}
		else {
			Debug::log("turn NOT adjusted to END");
		}
	}
}
else if (isset($_POST["lanes"])){	
	$lanes = JSON_decode($_POST["lanes"]);

	foreach ($lanes as $lane){
		if ($dbManager->insertLane($lane, $_SESSION["gameid"])){		
			Debug::log("lane created");
		}
		else {
			Debug::log("lane ERROR");
		}
	}
}
else if (isset($_POST["gateLaneItem"])){
	$items = JSON_decode($_POST["gateLaneItem"], true);
//	var_dump($items);

	if ($dbManager->insertGatesAndLanes($items)){
		Debug::log("gate / lane created");
	}
}
else if (isset($_POST["gates"])){
	$gates = JSON_decode($_POST["gates"], true);

	if ($gates["type"] == "create"){
		if ($dbManager->insertGates($gates)){
			Debug::log("gate created");
		}
		else {
			Debug::log("gate ERROR");
		}
	}
	else if ($gates["type"] == "destroy"){
		if ($dbManager->deleteLane($gates)){
			Debug::log("lane/gates deleted");
		}
		else {
			Debug::log("lane/gates delete ERROR");
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

	if (isset($_POST["type"])){
		if ($_POST["type"] == "create"){
			$fleetid = $dbManager->insertNewFleet($fleets);
			if ($fleetid){
				echo $fleetid;
			}
		}
		else if ($_POST["type"] == "delete"){
			if ($dbManager->deleteEmptyFleet($fleets)){
				return true;
			}
		}
	}
	else {
			
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
}
else if (isset($_POST["moveOrder"])){
	$moves = JSON_decode($_POST["moveOrder"], true);
	echo $manager->insertMoves($moves);
}
else if (isset($_POST["type"])){
	if ($_POST["type"] == "join"){
		$gameid = $_POST["gameid"];
		$playerid = $_SESSION["userid"];
	//	Debug::log("type");
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
else if (isset($_POST["nameChange"])){
	$dbManager->changeName($_POST["nameChange"]);	
}
else if (isset($_POST["shipTransfer"])){
	$dbManager->shipTransfer($_POST["shipTransfer"]);	
}
else if (isset($_POST["marker"])){
	$marker = JSON_decode($_POST["marker"], true);

	if ($marker["type"] == "create"){
		$dbManager->createMarker($marker);
	}
	else if ($marker["type"] == "delete"){
		$dbManager->deleteMarker($marker);
	}
}
else {
	echo "no data to be found";
}

?>
