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
	
	public function getSectors(){
		$sectors = DBManager::app()->getSectors($this->userid, $this->gameid);
		
		if ($sectors){
			return $sectors;
		}
	}
	
	public function getPlanets(){
		$planets = DBManager::app()->getPlanets($this->userid);
		
		if ($planets){
			return $planets;
		}
	}
	
	public function getGates(){
		$gates = DBManager::app()->getGates($this->userid, $this->gameid);
		
		if ($gates){
			return $gates;
		}
	}
	
	public function getLanes(){
		$lanes = DBManager::app()->getLanes($this->userid);
		
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
		
		if ($moves){
			return $moves;
		}
	}

	public function insertMoves($moves){
		$moves = JSON_decode($_POST["moves"], true);
			
		foreach ($moves as $move){
			DBManager::app()->insertSubmoves($move);
		}
	}

	public function endCurrentTurn(){
		if (DBManager::app()->endTurnForPlayerInGame($this->userid, $this->gameid)){
			echo "turn adjusted";
		}
		else {
			echo "turn NOT adjusted";
		}

	}
}

?>
