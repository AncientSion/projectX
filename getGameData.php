<?php


error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();



if (isset($_SESSION["userid"]) && isset($_SESSION["gameid"])){



	$dbManager = DBManager::app();
	$manager = new Manager($_SESSION["userid"], $_SESSION["gameid"]);
	$gameid = $_SESSION["gameid"];

	Debug::log("get game: ".$gameid);
		
	if (isset($_GET["type"])){
		if ($_GET["type"] == "status"){
			$status = $dbManager->getGameStatus(
												$_GET["gameid"],
												$_GET["userid"],
												$_GET["currentTurn"]
											);
			echo JSON_encode($status);
		}
		else if ($_GET["type"] == "sectors"){
			$sectors = $manager->getSectors($gameid);
			echo JSON_encode($sectors, JSON_NUMERIC_CHECK);
		}
		else if ($_GET["type"] == "planets"){
			$planets = $manager->getPlanets($gameid);
			echo JSON_encode($planets, JSON_NUMERIC_CHECK);
		}
		else if ($_GET["type"] == "gates"){
			$gates = $manager->getGates($gameid);
			echo JSON_encode($gates, JSON_NUMERIC_CHECK);
		}
		else if ($_GET["type"] == "lanes"){
			$lanes = $manager->getLanes($gameid);
			echo JSON_encode($lanes, JSON_NUMERIC_CHECK);
		}
		else if ($_GET["type"] == "fleets"){
			$fleets = $manager->getFleets($gameid);
			echo JSON_encode($fleets, JSON_NUMERIC_CHECK);
		}
		else if ($_GET["type"] == "ships"){
			$ships = $manager->getShips($gameid);
			echo JSON_encode($ships, JSON_NUMERIC_CHECK);
		}
		else if ($_GET["type"] == "moves"){
			$moves = $manager->getMovesForFleets($gameid);
			echo JSON_encode($moves, JSON_NUMERIC_CHECK);
		}
	}
}
	



?>
