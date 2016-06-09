<?php


class DBManager {

	private $connection = null;
	static protected $instance = null;

	function __construct(){

		if ($this->connection === null){
			$this->connection = new PDO("mysql:host=localhost;dbname=projectx",
						//	"aatu",
						//	"Kiiski",
							"root",
							"147147",
							array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		}
	//	if ($this->connection != null){
	//		Debug::log("Connection established");
	//	}
	//	else {
	//		Debug::log("Failure connecting");
	//	}
	}
	
	static public function app(){
        if(self::$instance === null OR !is_a(self::$instance, 'DBManager')) { //With is_a we are making sure our self::$instance variable holds a class instance of DBManager
            self::$instance = new DBManager();
        }
        return self::$instance;
	}
	

	public function test($sql){
		Debug::log($sql);
	}

	public function getLastInsertId(){
		return $this->connection->lastInsertId();
	}


	public function query($sql){
		
		$stmt = $this->connection->prepare($sql);
		
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function registerAccount($name, $pass){
		
		$sql = "SELECT * FROM player";
		$result = $this->query($sql);
		
		$valid = true;
		
		if ($result){
			foreach ($result as $entry){
				if ($entry["username"] == $name){
					$valid = false;
					break;
				}
			}
		}
		
		if ($valid){
			$stmt = $this->connection->prepare("
				INSERT INTO player
					(username, password, access)
				VALUES
					(:username, :password, :access)
			");

			$access = 0;
			
			$stmt->bindParam(":username", $name);
			$stmt->bindParam(":password", $pass);
			$stmt->bindParam(":access", $access);
			
			$stmt->execute();
			echo "<script>alert('Account created, please login');</script>";
		}
		else { 
			echo "Account already exists !";
		}
	}
	
	public function validateLogin($name, $pass){
		
		$stmt = $this->connection->prepare("
			SELECT id, access FROM player
			WHERE username = :username
			AND	password = :password
		");
		
		$stmt->bindParam(":username", $name);
		$stmt->bindParam(":password", $pass);
		$stmt->execute();
				
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		
		if ($result){
			return $result;
		}
		else {
			return false;
		}	
	}
	
	public function getUsername($id){	
		$sql = "(SELECT username FROM player WHERE ID = ".$id.")";
		$result = $this->query($sql);		
		return $result["username"];
	}
	

	public function getCurrentTurn($gameid){
		$sql = "(SELECT turn from games WHERE id = ".$gameid.")";
		$result = $this->query($sql);	
		return $result["turn"];
	}
	
	public function getGameStatus($gameid, $playerid, $turn){
	
		$stmt = $this->connection->prepare("
			SELECT status FROM playerstatus
			WHERE gameid = :gameid
			AND playerid = :playerid
			AND turn = :turn
		");
		
		$stmt->bindParam(":gameid", $gameid);
		$stmt->bindParam(":playerid", $playerid);
		$stmt->bindParam(":turn", $turn);
		$stmt->execute();
				
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		
		if ($result){
			return $result;
		}
		else {
			return false;
		}
	}

	public function getGameDetails($id){

		$stmt = $this->connection->prepare("
			SELECT * FROM games WHERE id = :id
			");

		$stmt->bindParam(":id", $id);
		$stmt->execute();				
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $result[0];
	}
		
	public function getPlayersInGame($gameid){

		$stmt = $this->connection->prepare("
			SELECT player.id AS userid, player.username, playerstatus.status FROM player
			JOIN playerstatus 
			ON playerstatus.gameid = :gameid
			AND player.id = playerstatus.playerid
			");

		$stmt->bindParam(":gameid", $gameid);
		$stmt->execute();				
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	
	public function getSectors($userid, $gameid){

		$stmt = $this->connection->prepare("
			SELECT x, y, type FROM sectorspecials 
			WHERE gameid = :gameid
			");
		
		$stmt->bindParam(":gameid", $gameid);
		$stmt->execute();				
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		if ($result){
			return $result;
		}
		else {
			return false;
		}
	}

	
	public function getPlanets($userid, $gameid){

		$sql = "SELECT * FROM planets WHERE gameid = ".$gameid;
		$stmt = $this->connection->prepare($sql);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
	}
	
	public function getGates($userid, $gameid){

		$stmt = $this->connection->prepare("
			SELECT id, owner, x, y FROM jumpgates WHERE gameid = :gameid
		");

		$stmt->bindParam(":gameid", $gameid);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if ($result){
			return $result;
		}
	}


	public function getLanes($userid, $gameid){

		$stmt = $this->connection->prepare("
			SELECT jumplanes.id, jumplanes.startGate, jumplanes.endGate, jumplanes.x, jumplanes.y
			FROM jumplanes
			LEFT JOIN jumpgates
			ON jumpgates.id = jumplanes.startGate
			WHERE jumpgates.gameid = :gameid 
		");

		$stmt->bindParam(":gameid", $gameid);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
	}	


	public function getLaneById($gateid){

		$stmt = $this->connection->prepare("
			SELECT * FROM jumplanes
			WHERE startGate = :gateid
		");

		$stmt->bindParam(":gateid", $gateid);
		$stmt->execute();
		
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
	}


	public function getLaneSteps($laneid){

		$stmt = $this->connection->prepare("
			SELECT * FROM lanesteps
			WHERE jumplaneid = :jumplaneid
		");

		$stmt->bindParam(":jumplaneid", $laneid);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
	}

		
	public function getFleets($userid, $gameid){
		$stmt = $this->connection->prepare("
			SELECT id, gameid, playerid, name, tfnumber, x, y
			FROM fleets
			WHERE gameid = :gameid
		");				
				
		$stmt->bindParam(":gameid", $gameid);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
		else {
			Debug::log("no fleet results");
		}		
	}
	
	public function getShips($userid, $gameid){
		$stmt = $this->connection->prepare("
			SELECT * FROM ships
		");

		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
		else {
			Debug::log("no ships results");
		}		
	}	
		
	public function getMovesForFleets($userid, $gameid){

		$stmt = $this->connection->prepare("
			SELECT moves.fleetid, moves.step, moves.x, moves.y, moves.hmp, moves.turn
			FROM moves
			LEFT JOIN fleets
			ON moves.fleetid = fleets.id
			AND fleets.playerid = :playerid
			AND fleets.gameid = :gameid
			ORDER BY moves.fleetid ASC, moves.step ASC
		");
		
		$stmt->bindParam(":playerid", $userid);
		$stmt->bindParam(":gameid", $gameid);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if ($result){
			return $result;
		}
		else {
	//		Debug::log("no getMovesForFleets results");
		}		
	}

	public function getValidLaneIdForFleets($userid, $gameid, $turn){
		$stmt = $this->connection->prepare("
			SELECT validlanes.fleetid, validlanes.jumplaneid, jumpgates.x, jumpgates.y FROM validlanes
			INNER JOIN fleets
				ON validlanes.fleetid = fleets.id
				AND fleets.playerid = :playerid
				AND fleets.gameid = :gameid
			INNER JOIN jumplanes 
				ON validlanes.jumplaneid = jumplanes.id
			INNER JOIN jumpgates
				ON jumplanes.startGate = jumpgates.id
			WHERE validlanes.validForTurn = :turn
		");

		$stmt->bindParam(":playerid", $userid);
		$stmt->bindParam(":gameid", $gameid);
		$stmt->bindParam(":turn", $turn);

		$stmt->execute();

		if ($stmt->errorCode() == 0){
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			return $result;
		}
	}

	public function getOngoingGames($id){
		$stmt = $this->connection->prepare("
			SELECT id, name, turn, status
			FROM games
			WHERE status = :status
		");
		
		$ongoing = "ongoing";
		$stmt->bindParam(":status", $ongoing);
		$stmt->execute();
		
		$result = $stmt->fetchAll();
		
		if (sizeof($result) >= 1){
		//	debug::log("Games found: ".sizeof($result));
			return $result;
		}
		else {
		//	debug::log("no gams found");
			return null;
		}
	}


	
	public function getOpenGames($id){
	
		$null = 0;
		
		$stmt = $this->connection->prepare("
			SELECT * FROM games
			WHERE games.status = :status
		");
		
		$open = "open";
		$stmt->bindParam (":status", $open);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);		


		if ($result){
			return $result;
		}
		else {
			return null;
		}
	}


	public function getWaitingForOpponentGames($id){
	
		$null = 0;
		
		$stmt = $this->connection->prepare("
			SELECT id, name
			FROM games
			WHERE playerA = :value1
			AND playerB = 0
			OR playerB = :value1
			AND playerA = 0
		");
		
		$stmt->bindParam(":value1", $id);
		$stmt->execute();
		
		$result = $stmt->fetchAll();
		
		if (sizeof($result) >= 1){
		//	debug::log("Games found: ".sizeof($result));
			return $result;
		}
		else {
		//	debug::log("no gams found");
			return null;
		}
	}



	public function getAllUnfinishedGames(){

	/*	$stmt = $this->connection->prepare("
			SELECT games.id, games.name, games.status as gamestatus, games.turn, playerstatus.playerid, playerstatus.turn, playerstatus.status as playerstatus, player.username FROM games
				INNER JOIN playerstatus
				ON games.id = playerstatus.gameid
				INNER JOIN player
				ON playerstatus.playerid = player.id
			WHERE games.status <> (:finished)
		");
	*/

		$stmt = $this->connection->prepare("
			SELECT * FROM games
			WHERE status <> (:finished)
		");
		$finished = "finished";
		$stmt->bindParam(":finished", $finished);

		$stmt->execute();

		$result = $stmt->FetchAll(PDO::FETCH_ASSOC);
		$playerInfo = array();

		for ($i = 0; $i < sizeof($result); $i++){
			
			$result[$i]["playerdata"] = array();

			$stmt = $this->connection->prepare("
				SELECT playerstatus.playerid, playerstatus.status, player.username FROM playerstatus
				INNER JOIN player
					ON playerstatus.playerid = player.id
				WHERE playerstatus.gameid = :gameid
			");

			$stmt->bindParam(":gameid", $result[$i]["id"]);

			$stmt->execute();

			$playerdata = $stmt->FetchAll(PDO::FETCH_ASSOC);

			if ($playerdata){
				$result[$i]["playerdata"] = $playerdata;
			}

		}
		
		if ($result){
			return $result;
		}
		else {
			return null;
		}
	}
	
	public function createGame($id, $name){
		
		$stmt = $this->connection->prepare("
			INSERT INTO games
				(name, status, turn)
			VALUES
				(:name, :status, :turn)
		");
		
		$open = "open";
		$turn = 0;
		
		$stmt->bindParam(":name", $name);
		$stmt->bindParam(":status", $open);
		$stmt->bindParam(":turn", $turn);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return $stmt->errorCode();
		}	
	}
	
	public function joinGame($gameid, $playerid){
		
		$stmt = $this->connection->prepare("
			INSERT INTO playerstatus
				(gameid, playerid, turn, status)
			VALUES
				(:gameid, :playerid, :turn, :status)
		");
		
		$joined = "joined";
		$turn = 1;
		
		$stmt->bindParam(":gameid", $gameid);
		$stmt->bindParam(":playerid", $playerid);
		$stmt->bindParam(":turn", $turn);
		$stmt->bindParam(":status", $joined);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return $stmt->errorCode();
		}	
	}
	
	public function leaveGame($gameid, $playerid){

		$stmt = $this->connection->prepare("
			DELETE FROM playerstatus
			WHERE gameid = :gameid
			AND playerid = :playerid
		");		
		
		$stmt->bindParam(":gameid", $gameid);
		$stmt->bindParam(":playerid", $playerid);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return $stmt->errorCode();
		}
	}

	public function startGame($id){
		
		$stmt = $this->connection->prepare("
			UPDATE games
			SET 
				status = :status,
				turn = :turn
			WHERE 
				id = :id
		");
		
		$status = "ongoing";
		$turn = 1;
		
		$stmt->bindParam(":status", $status);
		$stmt->bindParam(":turn", $turn);
		$stmt->bindParam(":id", $id);
		$stmt->execute();
		

		if ($stmt->errorCode() == 0){
			$players = $this->getPlayersInGame($id);
			$this->updatePlayerStatus($players, $id, "waiting");
		}
		else {
			Debug::log("error update game");
		}
	}


	public function updatePlayerStatus($players, $gameid, $status){

		$stmt = $this->connection->prepare("
				UPDATE playerstatus
				SET
					status = :status
				WHERE
					gameid = :gameid
				AND 
					playerid = :playerid
		");

		foreach ($players as $player){
		//	Debug::log("userid: ".$player["userid"]);	
		//	Debug::log("gameid: ".$gameid);	
		//	Debug::log("status: ".$status);				

			$stmt->bindParam(":status", $status);
			$stmt->bindParam(":gameid", $gameid);
			$stmt->bindParam(":playerid", $player["userid"]);

			$stmt->execute();

			if ($stmt->errorCode() == 0){
				continue;
			}
			else {
				Debug::log("error update playerstatus");
				break;
			}
		}
	}


	public function insertGatesAndLanes($items){
		foreach ($items as $item){
			$gates = array();
			$gates[] = $item["startGate"];
			$gates[] = $item["endGate"];

			if ($this->insertGates($gates)){
				$id = $this->getLastInsertId();
				if ($this->insertLane($id, $item["startGate"]["gameid"])){
					$id = $this->getLastInsertId();
					if ($this->insertLaneSteps($id, $item["lane"])){
						return true;
					}
				}
			}
		}
	}

	public function insertGates($gates){

		$stmt = $this->connection->prepare("
			INSERT INTO jumpgates
				(gameid, owner, x, y, turn_build, damage, useable)
			VALUES
				(:gameid, :owner, :x, :y, :turn_build, :damage, :useable)
		");

		$start = 0;

		foreach ($gates as $gate){
				
			$stmt->bindParam(":gameid", $gate["gameid"]);
			$stmt->bindParam(":owner", $gate["owner"]);
			$stmt->bindParam(":x", $gate["loc"][0]);
			$stmt->bindParam(":y", $gate["loc"][1]);
			$stmt->bindParam(":turn_build", $start);
			$stmt->bindParam(":damage", $gate["damage"]);
			$stmt->bindParam(":useable", $gate["useable"]);
			
			$stmt->execute();
			
			if ($stmt->errorCode() == 0){
				continue;
			}
			else {
				return false;
			}
		}
		return true;
	}


	public function insertLane($lastGateId, $gameid){

		$stmt = $this->connection->prepare("
			INSERT INTO jumplanes 
				(startGate, endGate)
			VALUES
				(:startGate, :endGate)
		");

		$startGate = floor($lastGateId - 1);

		$stmt->bindParam(":startGate", $startGate);
		$stmt->bindParam(":endGate", $lastGateId);
	
		$stmt->execute();

		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}
	}

	public function insertLaneSteps($laneid, $steps){
		$stmt = $this->connection->prepare("
			INSERT INTO lanesteps
				(jumplaneid, x, y)
			VALUES
				(:jumplaneid, :x, :y)
			");


		foreach ($steps as $step){
			$stmt->bindParam(":jumplaneid", $laneid);
			$stmt->bindParam(":x", $step[0]);
			$stmt->bindParam(":y", $step[1]);

			$stmt->execute();

			if ($stmt->errorCode() == 0){
				continue;
			}
			else {
				return false;
			}
		}
	}

	public function deleteLane($obj){

		$laneid = $obj["laneid"];

		$sql = "SELECT * FROM jumplanes WHERE id = ".$laneid;
		$result = $this->query($sql);

		$startGate = $result["startGate"];
		$endGate = $result["endGate"];

		$array = array();

		$array[] = "DELETE FROM jumplanes WHERE id = ".$laneid;
		$array[] = "DELETE FROM jumpgates WHERE id = ".$startGate." OR id = ".$endGate;
		$array[] = "DELETE FROM lanesteps WHERE jumplaneid = ".$laneid;

		foreach ($array as $sql){
			$this->connection->query($sql);
		}

		return true;
	}
	
	public function insertSector($sector){

		foreach ($sector["specials"] as $special){
			$stmt = $this->connection->prepare("
				INSERT INTO sectorspecials
					(gameid, x, y, type)
				VALUES
					(:gameid, :x, :y, :type)
			");
			
			$stmt->bindParam(":gameid", $sector["gameid"]);
			$stmt->bindParam(":x", $sector["loc"][0]);
			$stmt->bindParam(":y", $sector["loc"][1]);
			$stmt->bindParam(":type", $special);
			$stmt->execute();
			
			if ($stmt->errorCode() == 0){
				continue;
			}
			else {
				return false;
			}
		}

		return true;
	}
	
	public function insertPlanet($planet){

		
		$stmt = $this->connection->prepare("
			INSERT INTO planets
				(gameid, x, y, owner, type, enviroment, name, level, baseIncome, baseTrade, notes_1, notes_2, notes_3)
			VALUES
				(:gameid, :x, :y, :owner, :type, :enviroment, :name, :level, :baseIncome, :baseTrade, :notes_1, :notes_2, :notes_3)
		");
		
		$stmt->bindParam(":gameid", $planet["gameid"]);
		$stmt->bindParam(":x", $planet["loc"][0]);
		$stmt->bindParam(":y", $planet["loc"][1]);
		$stmt->bindParam(":owner", $planet["owner"]);
		$stmt->bindParam(":type", $planet["type"]);
		$stmt->bindParam(":enviroment", $planet["enviroment"]);
		$stmt->bindParam(":name", $planet["name"]);
		$stmt->bindParam(":level", $planet["level"]);
		$stmt->bindParam(":baseIncome", $planet["baseIncome"]);
		$stmt->bindParam(":baseTrade", $planet["baseTrade"]);
		$stmt->bindParam(":notes_1", $planet["notes_1"]);
		$stmt->bindParam(":notes_2", $planet["notes_2"]);
		$stmt->bindParam(":notes_3", $planet["notes_3"]);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}
	}
	
	public function insertFleet($fleet){
		
		$stmt = $this->connection->prepare("
			INSERT INTO fleets
				(gameid, playerid, name, tfnumber, x, y)
			VALUES
				(:gameid, :playerid, :name, :tfnumber, :x, :y)
		");
		
		
		$stmt->bindParam(":gameid", $fleet["gameid"]);
		$stmt->bindParam(":playerid", $fleet["playerid"]);
		$stmt->bindParam(":name", $fleet["name"]);
		$stmt->bindParam(":tfnumber", $fleet["tfnumber"]);
		$stmt->bindParam(":x", $fleet["loc"][0]);
		$stmt->bindParam(":y", $fleet["loc"][1]);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}	
	}

	public function insertNewFleet($fleet){

		$stmt = $this->connection->prepare("
			INSERT INTO fleets
				(gameid, playerid, name, tfnumber, x, y)
			VALUES
				(:gameid, :playerid, :name, :tfnumber, :x, :y)
		");
		
		$tfnumber = 0;

		$stmt->bindParam(":gameid", $fleet["gameid"]);
		$stmt->bindParam(":playerid", $fleet["playerid"]);
		$stmt->bindParam(":name", $fleet["name"]);
		$stmt->bindParam(":tfnumber", $tfnumber);
		$stmt->bindParam(":x", $fleet["location"][0]);
		$stmt->bindParam(":y", $fleet["location"][1]);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return $this->getLastInsertId();
		}
		else {
			return false;
		}
	}

	public function deleteEmptyFleet($fleet){

		$stmt = $this->connection->prepare("
			DELETE FROM fleets WHERE id = :id
		");

		$stmt->bindParam(":id", $fleet["id"]);

		$stmt->execute();

		if ($stmt->errorCode() == 0 ){
			return true;
		}
		else {
			return false;
		}
	}
	
	
	public function insertShip($ship, $fleetid){

		if (! isset($ship[6])) {
			$ship[6] = null;
		}
		
		$stmt = $this->connection->prepare("
			INSERT INTO ships
				(fleetid, size, model, name, elint, scanner, jumpdrive, notes)
			VALUES
				(:fleetid, :size, :model, :name, :elint, :scanner, :jumpdrive, :notes)
		");
		
		$stmt->bindParam(":fleetid", $fleetid);	
		$stmt->bindParam(":size", $ship[0]);
		$stmt->bindParam(":model", $ship[1]);
		$stmt->bindParam(":name", $ship[2]);
		$stmt->bindParam(":elint", $ship[3]);
		$stmt->bindParam(":scanner", $ship[4]);
		$stmt->bindParam(":jumpdrive", $ship[5]);
		$stmt->bindParam(":notes", $ship[6]);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}	
	}

	public function checkForFleetMoveOrder($fleetid){

		$stmt = $this->connection->prepare("
			SELECT * FROM moves
			WHERE fleetid = :fleetid
			LIMIT 1
			");

		$stmt->bindParam(":fleetid", $fleetid);
		$stmt->execute();

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

		return $result;
	}

	public function deleteOldMoves($fleetid){

		$stmt = $this->connection->prepare("
			DELETE FROM moves WHERE fleetid = :fleetid"
		);

		$stmt->bindParam(":fleetid", $fleetid);
		$stmt->execute();

		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}
	}


	public function insertMoves($order){
	//	Debug::log("DB insertMoves");

		if ($this->deleteOldMoves($order["fleetid"])) {

			$stmt = $this->connection->prepare("
				INSERT INTO moves
					(fleetid, turn, step, x, y, hmp)
				VALUES
					(:fleetid, :turn, :step, :x, :y, :hmp)
					");

			for ($i = 0; $i < sizeof($order["moves"]); $i++) {
				$subMove = $order["moves"][$i];

				$stmt->bindParam(":fleetid", $order["fleetid"]);
				$stmt->bindParam(":turn", $order["turn"]);
				$stmt->bindParam(":step", $i);
				$stmt->bindParam(":x", $subMove[0]);
				$stmt->bindParam(":y", $subMove[1]);
				$stmt->bindParam(":hmp", $order["hmp"][$i]);
				$stmt->execute();

			}
			
			if ($stmt->errorCode() == 0){
				return true;
			}
			else {
				return false;
			}
		}
	}

	public function checkForValidLaneEntries($order){
	//	Debug::log("checkForValidLaneEntries");

		$stmt = $this->connection->prepare("
			SELECT * FROM validlanes WHERE fleetid = :fleetid
		");

		$stmt->bindParam(":fleetid", $order["fleetid"]);
		$stmt->execute();

		$result = $stmt->fetch();

		if ($stmt->errorCode() == 0){			
			if ($result){
				return true;
			}
			else {
				return false;
			}
		}
	}

	public function deleteOldValidLaneEntries($order){
	//	Debug::log("deleteOldValidLaneEntries");

		$stmt = $this->connection->prepare("
			DELETE FROM validlanes WHERE fleetid = :fleetid
		");

		$stmt->bindParam(":fleetid", $order["fleetid"]);
		$stmt->execute();				

		if ($stmt->errorCode() == 0){
			return true;
		}
	}

	public function insertNewValidLaneEntries($order){
	//		Debug::log("insertNewValidLaneEntries");
		
		$turn = $order["turn"] + 1;
		
		$stmt = $this->connection->prepare("
			INSERT INTO validlanes
				(fleetid, jumplaneid, validForTurn)
			VALUES
				(:fleetid, :jumplaneid, :validForTurn)
		");
		

		foreach ($order["validLanes"] as $valid){
			$stmt->bindParam(":fleetid", $order["fleetid"]);
			$stmt->bindParam(":jumplaneid", $valid["id"]);
			$stmt->bindParam(":validForTurn", $turn);

			$stmt->execute();
			if ($stmt->errorCode() == 0){
				Debug::log("success");
				continue;
			}
			else {
				Debug::log("error");
				return false;
			}
		}

		return true;

	}


	public function endTurnForPlayerInGame($playerid, $gameid){

	//	debug::log("ding");

		$stmt = $this->connection->prepare("
			UPDATE playerstatus
			SET
				status = :status
			WHERE 
				gameid = :gameid
			AND
				playerid = :playerid
			"); 

		$ready = "ready";
		$stmt->bindParam(":status", $ready);
		$stmt->bindParam(":gameid", $gameid);
		$stmt->bindParam(":playerid", $playerid);

		$stmt->execute();			
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}
	}

	public function changeName($obj){
		$type = $obj["type"];
		$gameid = $obj["gameid"];
		$objectid = $obj["id"];
		$newName = $obj["newName"];

		if ($obj["type"] == "planet"){
			return $this->changePlanetName($obj);
		}
		else if ($obj["type"] == "fleet"){
			return $this->changeFleetName($obj);			
		}
		else if ($obj["type"] == "ship"){
			return $this->changeShipName($obj);			
		}

	}


	public function changePlanetName($obj){
		$sql = "UPDATE planets SET name = '".$obj["newName"]."' WHERE gameid = ".$obj["gameid"]." AND id = ".$obj["id"];

		if ($this->connection->query($sql)){
			return true;
		}
		else {
			return false;
		}
	}

	public function changeFleetName($obj){
		$sql = "UPDATE fleets SET name = '".$obj["newName"]."' WHERE gameid = ".$obj["gameid"]." AND id = ".$obj["id"];

		if ($this->connection->query($sql)){
			return true;
		}
		else {
			return false;
		}
	}

	public function changeShipName($obj){
		$sql = "UPDATE ships SET name = '".$obj["newName"]."' WHERE id = ".$obj["id"];

		if ($this->connection->query($sql)){
			return true;
		}
		else {
			return false;
		}
	}

	public function shipTransfer($obj){
		$gameid = $obj["gameid"];
		$actions = $obj["items"];

		$stmt = $this->connection->prepare("
			UPDATE ships
			SET
				fleetid = :fleetid
			WHERE 
				id = :id
		");

		foreach ($actions as $act){
			$stmt->bindParam(":fleetid", $act["to"]);
			$stmt->bindParam(":id", $act["shipid"]);

			$stmt->execute();		

			if ($stmt->errorCode() == 0){
				continue;
			}
			else {
				return false;
			}
		}

		return true;
	}

	public function createMarker($obj){
		$stmt = $this->connection->prepare("
			INSERT INTO markers
				(gameid, playerid, x, y, notes)
			VALUES
				(:gameid, :playerid, :x, :y, :notes)
			");

		$stmt->bindParam("gameid", $obj["gameid"]);
		$stmt->bindParam("playerid", $obj["playerid"]);
		$stmt->bindParam("x", $obj["loc"][0]);
		$stmt->bindParam("y", $obj["loc"][1]);
		$stmt->bindParam("notes", $obj["note"]);

		$stmt->execute();		

		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}
	}

	public function deleteMarker($marker){

		$stmt = $this->connection->prepare("
			DELETE FROM markers
			WHERE
				id = :id
		");



		$stmt->bindParam(":id", $marker["id"]);

		$stmt->execute();

		if ($stmt->errorCode() == 0){
			return true;
		}
		else return false;
	}


	public function getMarkers($playerid, $gameid){
		$stmt = $this->connection->prepare("
			SELECT id, x, y, notes FROM markers
			WHERE 
				playerid = :playerid
			AND
				gameid = :gameid
			");

		$stmt->bindParam(":gameid", $gameid);
		$stmt->bindParam(":playerid", $playerid);

		$stmt->execute();
				
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		if ($result){
			return $result;
		}
		else {
			return false;
		}
	}


	public function getFleetInfoForTurnProcession($gameid){
	
		$stmt = $this->connection->prepare("
			SELECT fleets.id, fleets.playerid, fleets.name, fleets.x, fleets.y FROM fleets
			WHERE
				fleets.gameid = :gameid
			ORDER BY fleets.playerid
		");
		
		$stmt->bindParam(":gameid", $gameid);
		
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if ($result){

			$stmt = $this->connection->prepare("
				SELECT step, x, y, hmp from moves
				WHERE
					fleetid = :fleetid
			");

			for ($i = 0; $i < sizeof($result); $i++){

				$stmt->bindParam(":fleetid", $result[$i]["id"]);

				$stmt->execute();

				$subResult = $stmt->fetchAll(PDO::FETCH_ASSOC);

				$result[$i]["moves"] = $subResult;
			}
			
			return $result;
		}
		else {
			return false;
		}
	}

	public function getSubTickForGame($gameid){

		$stmt = $this->connection->prepare("
			SELECT subtick FROM subticks WHERE gameid = :gameid
		");

		$stmt->bindParam(":gameid", $gameid);
		$result = $stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);

		return $result;
	}

}		

?>
