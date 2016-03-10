<?php


class DBManager {

	private $connection = null;
	static protected $instance = null;

	function __construct(){

		if ($this->connection === null){
			$this->connection = new PDO("mysql:host=localhost;dbname=projectx",
							"aatu",
							"Kiiski",
						//	"root",
						//	"147147",
							array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		}
		if ($this->connection != null){
			Debug::log("Connection established");
		}
		else {
			Debug::log("Failure connecting");
		}
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
		Debug::log("getLastInsertId");
		return $this->connection->lastInsertId();
	}


	public function query($sql){
		
		$stmt = $this->connection->prepare($sql);
		
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function registerAccount($name, $pass){
		Debug::log("registerAccount");
		
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
					(username, password)
				VALUES
					(:username, :password)
			");
			
			$stmt->bindParam(":username", $name);
			$stmt->bindParam(":password", $pass);
			
			$stmt->execute();
			echo "<script>alert('Account created, please login');</script>";
		}
		else { 
			echo "Account already exists !";
		}
	}
	
	public function validateLogin($name, $pass){
		
		$stmt = $this->connection->prepare("
			SELECT id FROM player
			WHERE username = :username
			AND	password = :password
		");
		
		$stmt->bindParam(":username", $name);
		$stmt->bindParam(":password", $pass);
		$stmt->execute();
				
		$result = $stmt->fetch();
		
		if ($result){
			return $result["id"];
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
				
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
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
		Debug::log("getPlayersInGame");

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
		Debug::log("getSectors");
		Debug::log("user".$userid);
		Debug::log("game".$gameid);

		$stmt = $this->connection->prepare("
			SELECT x, y, type FROM sectorspecials 
			WHERE gameid = :gameid
			");
		
		$stmt->bindParam(":gameid", $gameid);
		$stmt->execute();				
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		if ($result){
			Debug::log("result");
			return $result;
		}
		else {
			Debug::log("no result");
		}
	}

	
	public function getPlanets($gameid){
		$sql = "SELECT id, x, y, owner, type, enviroment, name, level, baseIncome, baseTrade, notes_1, notes_2, notes_3 FROM planets WHERE gameid = ".$gameid;
		$stmt = $this->connection->prepare($sql);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
	}
	
	public function getGates($playerid, $userid){
		$stmt = $this->connection->prepare("
				SELECT id, owner, x, y FROM jumpgates
				");

		$stmt->execute();

		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if ($result){
			return $result;
		}
	}
	
	public function getLanes(){
		$sql = "SELECT id, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6 FROM jumplanes";
		$stmt = $this->connection->prepare($sql);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
	}	
		
	public function getFleets($user, $game){
		$stmt = $this->connection->prepare("
			SELECT id, gameid, playerid, name, tfnumber, x, y, elint
			FROM fleets
			WHERE gameid = :gameid
		");				
				
		$stmt->bindParam(":gameid", $game);
	//	$stmt->bindParam(":playerid", $user);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
		else {
			Debug::log("no fleet results");
		}		
	}
	
	public function getShips($user, $game){		
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
	
	public function getMovesForFleets($user, $game){	
		$stmt = $this->connection->prepare("
			SELECT moves.fleetid, moves.step, moves.x, moves.y, moves.hmp, moves.turn
			FROM moves
			LEFT JOIN fleets
			ON moves.fleetid = fleets.id
			AND fleets.gameid = :game
			ORDER BY moves.fleetid, moves.step 
		");
		
		$stmt->bindParam(":game", $game);
		$stmt->execute();
		
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
		if ($result){
			return $result;
		}
		else {
	//		Debug::log("no getMovesForFleets results");
		}		
	}

	public function getOngoingGames($id){
		$stmt = $this->connection->prepare("
			SELECT id, name, turn
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
		$turn = 0;
		
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
		$stmt->bindValue(":turn", $turn);
		$stmt->bindParam(":id", $id);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			Debug::log("start game set");
			$players = $this->getPlayersInGame($id);

			foreach ($players as $player){
			Debug::log($player["userid"]);
				
				$stmt = $this->connection->prepare("
						UPDATE playerstatus
						SET
							status = :status,
							turn = :turn
						WHERE playerid = :playerid
				");

				$status = "waiting";
				$turn = 1;
				$stmt->bindParam(":status", $status);
				$stmt->bindValue(":turn", $turn);
				$stmt->bindParam(":playerid", $player["userid"]);

				if ($stmt->errorCode() != 0){
					Debug::log("player set");
				}
				else {
					Debug::log("error update playerstatus");
				}
			}
		}
		else {
			Debug::log("error update game");
		}
	}

	public function insertLane($lane){
		$stmt = $this->connection->prepare("
			INSERT INTO jumplanes
				(x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6)
			VALUES
				(:x1, :y1, :x2, :y2, :x3, :y3, :x4, :y4, :x5, :y5, :x6, :y6)
		");
		
		$stmt->bindParam(":x1", $lane[0][0]);
		$stmt->bindParam(":y1", $lane[0][1]);
		$stmt->bindParam(":x2", $lane[1][0]);
		$stmt->bindParam(":y2", $lane[1][1]);
		$stmt->bindParam(":x3", $lane[2][0]);
		$stmt->bindParam(":y3", $lane[2][1]);
		$stmt->bindParam(":x4", $lane[3][0]);
		$stmt->bindParam(":y4", $lane[3][1]);
		$stmt->bindParam(":x5", $lane[4][0]);
		$stmt->bindParam(":y5", $lane[4][1]);
		$stmt->bindParam(":x6", $lane[5][0]);
		$stmt->bindParam(":y6", $lane[5][1]);
		
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			return false;
		}	
	}
	
	public function insertGate($gate){
		Debug::log("insertGate");

		$stmt = $this->connection->prepare("
			INSERT INTO jumpgates
				(gameid, owner, x, y, turn_build, damage, useable)
			VALUES
				(:gameid, :owner, :x, :y, :turn_build, :damage, :useable)
		");

		$start = 0;
		
		$stmt->bindParam(":gameid", $gate["gameid"]);
		$stmt->bindParam(":owner", $gate["owner"]);
		$stmt->bindParam(":x", $gate["loc"][0]);
		$stmt->bindParam(":y", $gate["loc"][1]);
		$stmt->bindParam(":turn_build", $start);
		$stmt->bindParam(":damage", $gate["damage"]);
		$stmt->bindParam(":useable", $gate["useable"]);
		
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
			return true;
		}
		else {
			Debug::log($stmt->errorCode());
			return false;
		}	
	}
	
	public function insertSector($sector){
		Debug::log("insertSector");

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
				Debug::log("special created");
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
				(gameid, playerid, name, tfnumber, x, y, elint)
			VALUES
				(:gameid, :playerid, :name, :tfnumber, :x, :y, :elint)
		");
		
		$elint = 0;
		
		$stmt->bindParam(":gameid", $fleet["gameid"]);
		$stmt->bindParam(":playerid", $fleet["playerid"]);
		$stmt->bindParam(":name", $fleet["name"]);
		$stmt->bindParam(":tfnumber", $fleet["tfnumber"]);
		$stmt->bindParam(":x", $fleet["loc"][0]);
		$stmt->bindParam(":y", $fleet["loc"][1]);
		$stmt->bindValue(":elint", $elint);
		$stmt->execute();
		
		if ($stmt->errorCode() == 0){
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
		Debug::log("checkForFleetMoveOrder");

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
		Debug::log("deleteOldMoves");

		$stmt = $this->connection->prepare("
			DELETE FROM moves WHERE fleetid = :fleetid"
		);

		$stmt->bindParam(":fleetid", $fleetid);
		$stmt->execute();

		if ($stmt->errorCode() == 0){
		Debug::log("error 0");
			return true;
		}
		else {
		Debug::log("error");
			return false;
		}
	}


	public function insertSubmoves($move){
		Debug::log("insertSubmoves");

		echo $move;

		if (isset($move["cancel"])) {
		//	Debug::log("cancel");
			if ($this->deleteOldMoves($move["fleetId"])) {
				return true;
			}
			else {
				return false;
			}
		}
		else if ($this->deleteOldMoves($move["fleetId"])) {

			for ($i = 0; $i < sizeof($move["moves"]); $i++) {
		//		Debug::log("sub");
				$subMove = $move["moves"][$i];

				$stmt = $this->connection->prepare("
					INSERT INTO moves
						(fleetid, turn, step, x, y, hmp)
					VALUES
						(:fleetid, :turn, :step, :x, :y, :hmp)
					");

				$stmt->bindParam(":fleetid", $move["fleetId"]);
				$stmt->bindParam(":turn", $move["turn"]);
				$stmt->bindParam(":step", $i);
				$stmt->bindParam(":x", $subMove[0]);
				$stmt->bindParam(":y", $subMove[1]);
				$stmt->bindParam(":hmp", $move["hmp"][$i]);
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

	public function endTurnForPlayerInGame($playerid, $gameid){
		Debug::log("endTurnForPlayerInGame");

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
}

?>
