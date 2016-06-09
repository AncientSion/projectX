<?php


class Manager {
	public $userid;
	
	function __construct($userid, $gameid = 0){
		$this->userid = $userid;
		$this->gameid = $gameid;
	}
	
	public function getUsername(){
		$name = DBManager::app()->getUsername($this->userid);
		
		if ($name){
			return $name;
		}
	}
	
	public function getOngoingGames(){
		$list = DBManager::app()->getOngoingGames($this->userid);
		if ($list){
			return $list;
		}
		else {
			return null;
		}
	}
	
	public function getOpenGames(){
		$list = DBManager::app()->getOpenGames($this->userid);
		if ($list){
			return $list;
		}
		else {
			return null;
		}
	}
	
	public function getWaitingForOpponentGames(){
		$list = DBManager::app()->getWaitingForOpponentGames($this->userid);
		if ($list){
			return $list;
		}
		else {
			return null;
		}
	}	
		
	public function createGame($name){
		if (DBManager::app()->createGame($this->userid, $name)){
			return true;
		}
	}	

	public function getGameStatus($gameid, $turn){
		$status = DBManager::app()->getGameStatus($gameid, $this->userid, $turn);
		
		if ($status){
			return $status;
		}
	}
	
	public function getMarkers(){
		$markers = DBManager::app()->getMarkers($this->userid, $this->gameid);
		
		if ($markers){
			return $markers;
		}
	}
	public function getSectors(){
		$sectors = DBManager::app()->getSectors($this->userid, $this->gameid);
		
		if ($sectors){
			return $sectors;
		}
	}
	
	public function getPlanets(){
		$planets = DBManager::app()->getPlanets($this->userid, $this->gameid);
		
		if ($planets){
			return $planets;
		}
	}
	
	public function getGatesAndLanes(){
		$gates = DBManager::app()->getGates($this->userid, $this->gameid);

		$transfer = array();

		for ($i = 0; $i < sizeof($gates); $i += 2){
			$item = array();
			$item["startGate"] = $gates[$i];
			$item["endGate"] = $gates[$i+1];

			$lane = DBManager::app()->getLaneById($gates[$i]["id"]);
			$steps = DBManager::app()->getLaneSteps($lane["id"]);

			foreach ($steps as $step){
				$lane["path"][] = array($step["x"], $step["y"]);
			}


			$item["lane"] = $lane;

			$transfer[] = $item;

		}

		return $transfer;
	}
	
	public function getLanes(){
		$lanes = DBManager::app()->getLanes($this->userid, $this->gameid);
		
		if ($lanes){
			return $lanes;
		}
	}

	public function getFleets(){
		$fleets = DBManager::app()->getFleets($this->userid, $this->gameid);
		
		if ($fleets){
			return $fleets;
		}
	}

	public function getShips(){
		$ships = DBManager::app()->getShips($this->userid, $this->gameid);
		
		if ($ships){
			return $ships;
		}
	}

	public function getMovesForFleets(){
		$moves = DBManager::app()->getMovesForFleets($this->userid, $this->gameid);
		return $moves;
	}

	public function getValidLanesForFleets($turn){
		$laneids = DBManager::app()->getValidLaneIdForFleets($this->userid, $this->gameid, $turn);
		return $laneids;
	}

	public function insertMoves($order){
	
	//	Debug::log("insertMoves");
		
		if (isset($order["cancel"])){
			if (DBManager::app()->deleteOldMoves($order["fleetid"])) {
				return true;
			}
			else {
				return false;
			}
		}
		
		if (DBManager::app()->insertMoves($order)){
			if (DBManager::app()->insertNewValidLaneEntries($order)){
				echo ("insert moves success");
			}
		}
		else {
			echo "insert moves error";
		}
	}

	public function endCurrentTurn(){
		if (DBManager::app()->endTurnForPlayerInGame($this->userid, $this->gameid)){
			return true;
		}
		else {
			return false;
		}
	}

	public function processTurnForGame($gameid, $turn){
		Debug::log($gameid);
		Debug::log($turn);
	}

	public function getSubTickForGame($gameid){
		return DBManager::app()->getSubTickForGame($gameid);
	}
}

?>
