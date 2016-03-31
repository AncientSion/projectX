function Admin(){
	this.sectors = [];
	this.planets = [];
	this.lanes = [];
	this.fleets = [];
	this.gates = [];
	this.sectorSpecials = [];
	this.gateLaneItems = []
	this.currentLane = false;
	this.active = false;
	this.inLaneMode = false;
	this.inPlanetMode = false;
	this.inFleetMode = false;
	this.inGateMode = false;
	this.killGateMode = false;
	this.activePopUp = false;

	this.startSectorMode = function(){
		this.inSectorMode = true;
		document.getElementById("stopSectorMode").className = "";	
	}

	this.stopSectorMode = function(){
		this.inSectorMode = false;
		document.getElementById("stopSectorMode").className = "disabled";	
	}

	this.showSectorCreation = function(hex){
		this.activePopUp = true;
	
		var topDiv = document.createElement("div");
			topDiv.id = "sectorCreationDiv";
			
			var subDiv = document.createElement("div");
				var table = document.createElement("table");
					table.id = "sectorCreationTable";
					$(table).data("loc", hex.id);
				
				var tr = document.createElement("tr");
				var th = document.createElement("th");
					th.innerHTML = "Sector Creation for System: " + hex.id;
					
				tr.appendChild(th);
				table.appendChild(tr);


				var tr = document.createElement("tr");
				var th = document.createElement("th");
					th.innerHTML = "Select Special(s):";
					
				tr.appendChild(th);
				table.appendChild(tr);

				var specials = [
								"Hyperspace Waveforms",
								"Nebula",
								"Radiation Cloud",
								"Supernova",
								"Black Hole",
								"Vortex"
								];

				for (var i = 0; i < specials.length; i++){
					var tr = document.createElement("tr");
					var td = document.createElement("td");
						td.style.border = "1px solid white";
						td.innerHTML = specials[i];
						td.addEventListener("click", function(){

							var found = false;

							for (var i = 0; i < admin.sectorSpecials.length; i++){
								if (admin.sectorSpecials[i] == this.innerHTML){
									this.style.backgroundColor = "black";
									found = true;
									admin.sectorSpecials.splice(i, 1);
									break;
								}	
							}							
								
							if (! found){
								this.style.backgroundColor = "red";
								admin.sectorSpecials.push(this.innerHTML);
							}
						});

						tr.appendChild(td);
					table.appendChild(tr);
				}


			var tr = document.createElement("tr");
			var td = document.createElement("td");
			var input = document.createElement("input");
				input.value = "Confirm";
				input.onclick = function(){admin.createSector()};
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr)

			var tr = document.createElement("tr");
			var td = document.createElement("td");
			var input = document.createElement("input");
				input.value = "CANCEL"
				input.onclick = function(){admin.cancelSector()};
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr)

			subDiv.appendChild(table);
			topDiv.appendChild(subDiv);

		document.body.appendChild(topDiv);
			
	}

	this.createSector = function(){
		var table = $("#sectorCreationTable")
		var sector = {
			gameid: gameid,
			loc: table.data("loc"),
			specials: this.sectorSpecials
		}

		$("#sectorCreationDiv").remove();
		this.sectors.push(sector);
		this.sectorSpecials = [];
		this.activePopUp = false;

		if (this.sectors.length > 0){
			console.log("ding");
			document.getElementById("logSectors").className = "";
			document.getElementById("commitSectors").className = "";
		}
		
	}

	this.cancelSector = function(){
		$("#sectorCreationDiv").remove();
		this.sectorSpecials = [];
		this.activePopUp = false;
	}

	this.logSectors = function(){
		for (var i = 0; i < this.sectors.length; i++){
			console.log(this.sectors[i]);
		}
	}

	this.commitSectors = function(){
		if (this.sectors.length > 0){
			ajax.postSectors(this.sectors);
			this.sectors = [];
			document.getElementById("commitSectors").className = "disabled";
		}
		else {
			alert("no sectors in queue");
		}
	}
	
	this.startLanes = function(){
		this.inLaneMode = true;
		this.currentLane = [];
		document.getElementById("startLaneMode").className = "disabled";
		document.getElementById("stopLaneMode").className = "";
		document.getElementById("endCurrentLane").className = "";
	}
	
	this.endCurrentLane = function(){

		if (this.currentLane.length ==  0){
			alert("no lanes in the current workflow")
		}

		var trs = [];
	
		var topDiv = document.createElement("div");
			topDiv.id = "gateCreationDiv";
			
			var subDiv = document.createElement("div");

		var table = document.createElement("table");
		var tr = document.createElement("tr");
		var th = document.createElement("th");
			th.colSpan = "2";
			th.innerHTML = "CONFIRM THIS ROUTE";
			tr.appendChild(th);
			trs.push(tr);


		var tr = document.createElement("tr");
		var td = document.createElement("td");
			td.innerHTML = "From:";
			tr.appendChild(td);
			trs.push(tr);

		for (var i = 0; i < this.currentLane.length; i++){
			var tr = document.createElement("tr");
			if (i == 0 || i == this.currentLane.length-1){
				var td = document.createElement("td");
					td.innerHTML = this.currentLane[i];
					tr.appendChild(td);
					
				var td = document.createElement("td");
				var input = document.createElement("input");
					input.placeholder = "Gate Owner ID";
					input.id = "startGate";
					input.style.width = "100px";
				td.appendChild(input);
				tr.appendChild(td);

				trs.push(tr);
			}
			else {
				var td = document.createElement("td");
					td.colspan = "2";
					td.innerHTML = this.currentLane[i];
					tr.appendChild(td);
					trs.push(tr);
				}
		}

		var tr = document.createElement("tr");
		var td = document.createElement("td");
			td.colSpan = "2";
		var input = document.createElement("input");
			input.value = "Confirm Lane and Gates"
			input.onclick = function(){admin.createLane()};
			td.appendChild(input);
			tr.appendChild(td);
			trs.push(tr);

		var tr = document.createElement("tr");
		var td = document.createElement("td");
			td.colSpan = "2";
		var input = document.createElement("input");
			input.value = "CANCEL"
			input.onclick = function(){admin.cancelLane()};
			td.appendChild(input);
			tr.appendChild(td);
			trs.push(tr);


		for (var i = 0; i < trs.length; i++){
			table.appendChild(trs[i]);
		}
		
		subDiv.appendChild(table);
		topDiv.appendChild(subDiv);
				
		document.body.appendChild(topDiv);

	}

	this.createLane = function(){
		var div = document.getElementById("gateCreationDiv");
		var inputs = div.getElementsByTagName("input");

		var item = {}

		var gate = {
			gameid: gameid,
			damage: 0,
			useable: true,
			owner: Math.floor(inputs[0].value),
			loc: this.currentLane[0]
		}
			item.startGate = gate;

		var gate = {
			gameid: gameid,
			damage: 0,
			useable: true,
			owner: Math.floor(inputs[1].value),
			loc: this.currentLane[this.currentLane.length-1]
		}
			item.endGate = gate;

			item.lane = this.currentLane


		this.currentLane = [];

		this.gateLaneItems.push(item);

		var div = document.getElementById("gateCreationDiv");
			div.parentNode.removeChild(div);

		document.getElementById("endCurrentLane").className = "disabled";
	}

	this.cancelLane = function(){
		this.currentLane = [];
		var div = document.getElementById("gateCreationDiv");
			div.parentNode.removeChild(div);
	}
		document.getElementById("endCurrentLane").className = "disabled";


	this.endLaneMode = function(){
		this.inLaneMode = false;
		this.currentLane = false;
		document.getElementById("stopLaneMode").className = "disabled";
		document.getElementById("startLaneMode").className = "";

		if (this.gateLaneItems.length > 0){
			document.getElementById("confirmLaneButton").className = "";
		}
	},
	
	this.addHexToRoute = function(hex){
		if (this.currentLane.length == 0){
			this.currentLane.push(hex.id);
		}	
		else if (this.currentLane.length < 6){
			document.getElementById("endCurrentLane").className = "";
			if (! isEqual(this.currentLane[this.currentLane.length-1], hex.id)) {
				this.currentLane.push(hex.id);
			}
		}
		else {
			alert("max size reached");
		}
	}				
	
	this.logLanes = function(){
		for (var i in this.lanes){
			console.log(this.lanes[i]);
		}
	}
	
	this.commitLanes = function(){
		if (this.gateLaneItems.length > 0){
			ajax.postGateAndLane(this.gateLaneItems);
		//	this.gateLaneItems = [];
		}
		else {
			alert("no lanes in queue");
		}
	}
	
	this.initiateCreatePlanet = function(){
		this.inPlanetMode = true;
		document.getElementById("stopPlanetMode").className = "";
	},
	
	this.showPlanetCreation = function(hex){
		this.activePopUp = true;
	
		var topDiv = document.createElement("div");
			topDiv.id = "planetCreationDiv";
			
			var subDiv = document.createElement("div");
				var table = document.createElement("table");
					table.id = "planetCreationTable";
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.innerHTML = "Planet Creation for System: " + hex.id;
					$(table).data("loc", hex.id);
					
				tr.appendChild(td);
				table.appendChild(tr);


				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.innerHTML = "Type:";
					tr.appendChild(td);
	
				var td = document.createElement("td");
				var form = document.createElement("form");
				var select = document.createElement("select");
					select.id = "createPlanetType";

				var options = [
								"Large Planet",
								"Planet",
								"Large Moon",
								"Moon",
								"Large Asteroid Field",
								"Medium Asteroid Field",
								"Small Asteroid Field",
								];

				for (var i = 0; i < options.length; i++){
					var option = document.createElement("option");
						option.innerHTML = options[i];
					select.appendChild(option);
				}

				form.appendChild(select)
				td.appendChild(form);
				tr.appendChild(td);
				table.appendChild(tr);



				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.innerHTML = "Enviroment:";
					tr.appendChild(td);
	
				var td = document.createElement("td");
				var form = document.createElement("form");
				var select = document.createElement("select");
					select.id = "createPlanetEnviroment";

				var options = [
								"Fertile",
								"Wet",
								"Water",
								"Swamp",
								"Ice",
								"Arid",
								"Barren",
								"Radiated",
								"Toxic",
								];

				for (var i = 0; i < options.length; i++){
					var option = document.createElement("option");
						option.innerHTML = options[i];
					select.appendChild(option);
				}

				form.appendChild(select)
				td.appendChild(form);
				tr.appendChild(td);
				table.appendChild(tr);

				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.colSpan = "2";
					
					var input = document.createElement("input");
						input.placeholder = "Enter Owner ID Here";
						input.id = "createPlanetOwner";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");	
					td.colSpan = "2";	
					
					var input = document.createElement("input");
						input.placeholder = "Enter Planet Name Here";
						input.id = "createPlanetName";						
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.colSpan = "2";
				
					var input = document.createElement("input");
						input.placeholder = "Enter Planet Level Here";
						input.id = "createPlanetLevel";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.colSpan = "2";
				
					var input = document.createElement("input");
						input.placeholder = "Enter Base Income Here";
						input.id = "createPlanetBaseIncome";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.colSpan = "2";
				
					var input = document.createElement("input");
						input.placeholder = "Enter Base Trade Volume Here";
						input.id = "createPlanetTradeVolume";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.colSpan = "2";
				
					var input = document.createElement("input");
						input.placeholder = "NOTES #1";
						input.id = "createPlanetNotes1";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.colSpan = "2";
				
					var input = document.createElement("input");
						input.placeholder = "NOTES #2";
						input.id = "createPlanetNotes2";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.colSpan = "2";
				
					var input = document.createElement("input");
						input.placeholder = "NOTES #3";
						input.id = "createPlanetNotes3";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				var input = document.createElement("input");
					input.type = "button";
					input.value = "confirm";
					input.onclick = function(){admin.createPlanet()};
					input.style.width = "80px";
					input.style.margin = "auto";
					input.style.display = "inline";
					
					td.appendChild(input);
					tr.appendChild(td);
					table.appendChild(tr);
					
				var td = document.createElement("td");
				var input = document.createElement("input");
					input.type = "button";
					input.value = "cancel";
					input.onclick = function(){admin.cancelPlanet()};
					input.style.width = "80px";
					input.style.margin = "auto";
					input.style.display = "inline";
					
					td.appendChild(input);
					tr.appendChild(td);
					table.appendChild(tr);
		
		subDiv.appendChild(table);
		topDiv.appendChild(subDiv);
				
		document.body.appendChild(topDiv);
		
	},
	
	this.createPlanet = function(){
		var table = document.getElementById("planetCreationTable");
		var loc = $(table).data("loc");

		var type = document.getElementById("createPlanetType");
			type = type.options[type.selectedIndex].text;
		var enviroment = document.getElementById("createPlanetEnviroment");
			enviroment = enviroment.options[enviroment.selectedIndex].text;

		var owner = Math.floor(document.getElementById("createPlanetOwner").value);
		var name = document.getElementById("createPlanetName").value;
		var level = Math.floor(document.getElementById("createPlanetLevel").value);
		var baseIncome = Math.floor(document.getElementById("createPlanetBaseIncome").value);
		var baseTrade = Math.floor(document.getElementById("createPlanetTradeVolume").value);

		var notes_1 = document.getElementById("createPlanetNotes1").value;
		var notes_2 = document.getElementById("createPlanetNotes2").value;
		var notes_3 = document.getElementById("createPlanetNotes3").value;
		
		if (owner == "" && name == "" && level == "" && baseIncome == ""){
			owner = 0;
			name = "undefined";
			level = 0;
			baseIncome = 0;			
		}
		else if (owner != "" && name == ""){
			alert("INVALID INPUT");
			return;
		}

		if (notes_1 == ""){
			notes_1 = null;
		}

		if (notes_2 == ""){
			notes_2 = null;
		}

		if (notes_3 == ""){
			notes_3 = null;
		}
		
		var planet = {
					gameid: gameid,
					type: type,
					enviroment: enviroment,
					owner: owner,
					name: name,
					loc: loc,
					level: level,
					baseIncome: baseIncome,
					baseTrade: baseTrade,
					notes_1: notes_1,
					notes_2: notes_2,
					notes_3: notes_3,
					}
					console.log(planet);
		this.planets.push(planet);
		this.activePopUp = false;
			
		var div = document.getElementById("planetCreationDiv");
			div.parentNode.removeChild(div);
		
		if (this.planets.length > 0){
			document.getElementById("logPlanetsButton").className = "";
			document.getElementById("confirmPlanetsButton").className = "";
		}
	},
	
	this.cancelPlanet = function(){
		this.activePopUp = false;
		var div = document.getElementById("planetCreationDiv");
			div.parentNode.removeChild(div);
	},
	
	this.stopCreatePlanet = function(){
		this.activePopUp = false;
		this.inPlanetMode = false;
		document.getElementById("stopPlanetMode").className = "disabled";
	}
	
	this.logPlanets = function(){
		if (this.planets.length > 0){
			for (var i = 0; i < this.planets.length; i++){
				console.log(this.planets[i]);
			}
		}
	}
	
	this.commitPlanets = function(){
		if (this.planets.length > 0){
			ajax.postPlanets(this.planets);
			this.planets = [];
		}
		else {
			alert("no planets in queue");
		}
	}

	this.initiateCreateFleet = function(){
		this.inFleetMode = true;
		document.getElementById("stopFleetMode").className = "";
	},
	
	this.stopCreateFleet = function(){
		this.inFleetMode = false;
		document.getElementById("stopFleetMode").className = "disabled";
	},
	
	this.showFleetCreation = function(hex){
	
		this.activePopUp = true;
	
		var topDiv = document.createElement("div");
			topDiv.id = "fleetCreationDiv";
			
			var subDiv = document.createElement("div");
				var table = document.createElement("table");
					table.id = "fleetCreationTable";
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.innerHTML = "Fleet Creation for System: " + hex.id;
					$(table).data("loc", hex.id);
					
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");				
					
					var input = document.createElement("input");
						input.placeholder = "Enter Owner ID Here";
						input.id = "createFleetOwner";						
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");		
					
					var input = document.createElement("input");
						input.placeholder = "Enter Fleet Name Here";
						input.id = "createFleetName";						
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");		
					
					var input = document.createElement("input");
						input.placeholder = "Enter Taskforce Number Here";
						input.id = "createFleetTF";						
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				var input = document.createElement("input");
					input.type = "button";
					input.value = "Add Ship to Fleet";
					input.style.width = "120px";
					input.style.margin = "auto";
					input.style.display = "inline";	
					
					input.onclick = function(){
						var tr = document.createElement("tr");
					//	var td = document.createElement("td");
					//		td.style.textAlign = "center";
					//		td.innerHTML = "<input type'form' style='width: 50px' placeholder='Ship ID'>";
							
					//		tr.appendChild(td);			
							
						var td = document.createElement("td");
							td.style.textAlign = "center";
							td.innerHTML = "<input type'form' style='width: 120px' placeholder='Ship Size'>";
						tr.appendChild(td);					
							
						var td = document.createElement("td");
							td.style.textAlign = "center";
							td.innerHTML = "<input type'form' style='width: 120px' placeholder='Ship Model'>";
						tr.appendChild(td);					

							
						var td = document.createElement("td");
							td.style.textAlign = "center";
							td.innerHTML = "<input type'form' style='width: 120px' placeholder='Ship Name'>";
						tr.appendChild(td);					
							
						var td = document.createElement("td");
							td.style.textAlign = "center";
							td.innerHTML = "<input type'form' style='width: 120px' placeholder='Elint 1/0'>";
						tr.appendChild(td);					

						var td = document.createElement("td");
							td.style.textAlign = "center";
							td.innerHTML = "<input type'form' style='width: 120px' placeholder='Scanner Rating'>";
						tr.appendChild(td);					
							
						var td = document.createElement("td");
							td.style.textAlign = "center";
							td.innerHTML = "<input type'form' style='width: 120px' placeholder='JumpDrive 1/0'>";
						tr.appendChild(td);	

						var td = document.createElement("td");
							td.style.textAlign = "center";
							td.innerHTML = "<input type'form' style='width: 120px' placeholder='FREE NOTES'>";
						tr.appendChild(td);	

						$(tr).appendTo($("#shipTable"))	
					};	
					
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				var input = document.createElement("input");
					input.type = "button";
					input.value = "confirm";
					input.style.width = "80px";
					input.style.margin = "auto";
					input.style.display = "inline";
					input.onclick = function(){admin.createFleet()};
					
					td.appendChild(input);
					tr.appendChild(td);
					table.appendChild(tr);
					
				var input = document.createElement("input");
					input.type = "button";
					input.value = "cancel";
					input.style.width = "80px";
					input.style.margin = "auto";
					input.style.display = "inline";
					input.onclick = function(){admin.cancelFleet()};
					
					td.appendChild(input);
					tr.appendChild(td);
					table.appendChild(tr);
		
		subDiv.appendChild(table);
		topDiv.appendChild(subDiv);
					
		var shipTable = document.createElement("table");
			shipTable.id = "shipTable";
			
		topDiv.appendChild(shipTable);
				
		document.body.appendChild(topDiv);
	},
	
	this.createFleet = function(){
		var table = document.getElementById("fleetCreationTable");
		var loc = $(table).data("loc");
		var playerid = Math.floor(document.getElementById("createFleetOwner").value);
		var name = document.getElementById("createFleetName").value;
		var tfnumber = Math.floor(document.getElementById("createFleetTF").value);
					
		if (playerid == "" || name == "" || tfnumber == ""){
			alert("FATAL ERROR MISSING DATA");
			return;
		}
		
		var fleet = {
					gameid: gameid,
					playerid: playerid,
					name: name,
					loc: loc,
					tfnumber: tfnumber,
					ships: []
					};
					
					
					
		var shipTRs = $("#shipTable").find("tr");
		
		for (var i = 0; i < shipTRs.length; i++){
			var forms = $(shipTRs[i]).find("input");
			
			var ship = [];
				
			for (var j = 0; j < forms.length; j++){
				ship.push(forms[j].value);
			}

			ship[3] = Math.floor(ship[3]);
			ship[4] = Math.floor(ship[4]);
			ship[5] = Math.floor(ship[5]);

			if (ship[0] != ""){
				fleet.ships.push(ship);
			}
		}
		
		
		
		this.fleets.push(fleet);
		this.activePopUp = false;
			
		var div = document.getElementById("fleetCreationDiv");
			div.parentNode.removeChild(div);
		
		if (this.fleets.length > 0){
			document.getElementById("logFleetButton").className = "";
			document.getElementById("confirmFleetButton").className = "";
		}
	},
	
	this.cancelFleet = function(){
		this.activePopUp = false;	
		var div = document.getElementById("fleetCreationDiv");
			div.parentNode.removeChild(div);
	},
	
	this.logFleets = function(){
		if (this.fleets.length > 0){
			for (var i in this.fleets){
				console.log(this.fleets[i]);
			}
		}
	},
	
	this.commitFleets = function(){
		if (this.fleets.length > 0){
			ajax.postFleets(this.fleets);
		//	this.fleets = [];
		}
		else {
			alert("no fleets in queue");
		}
	},

	this.switchGateMode = function(){
		if (! this.inGateMode){
			this.inGateMode = true;
			$("#createGateButton").show();
			$("#destroyGateButton").show();
		}
		else {
			this.inGateMode = false;
			$("#createGateButton").hide();
			$("#destroyGateButton").hide()
		}
	},

	this.createGate = function(){
		this.createGateMode = true;
	}

	this.showGateCreation = function(hex){
		this.activePopUp = true;
	
		var topDiv = document.createElement("div");
			topDiv.id = "gateCreationDiv";
			
			var subDiv = document.createElement("div");
				var table = document.createElement("table");
					table.id = "gateCreationTable";
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.innerHTML = "GATE Creation for System: " + hex.id;
					$(table).data("loc", hex.id);
					
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");				
					
					var input = document.createElement("input");
						input.placeholder = "Enter Owner ID Here";
						input.id = "createGateOwner";						
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");		
					
					var input = document.createElement("input");
						input.placeholder = "Damage ? If so, enter % dmg";
						input.id = "createGateDamage";						
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				
					var input = document.createElement("input");
						input.placeholder = "Useable ? type 0 ONLY if not";
						input.id = "createGateUseable";
				td.appendChild(input);
				tr.appendChild(td);
				table.appendChild(tr);

				
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				var input = document.createElement("input");
					input.type = "button";
					input.value = "confirm";
					input.onclick = function(){admin.doCreateGate()};
					input.style.width = "80px";
					input.style.margin = "auto";
					input.style.display = "inline";
					
					td.appendChild(input);
					tr.appendChild(td);
					table.appendChild(tr);
					
				var input = document.createElement("input");
					input.type = "button";
					input.value = "cancel";
					input.onclick = function(){admin.cancelGate()};
					input.style.width = "80px";
					input.style.margin = "auto";
					input.style.display = "inline";
					
					td.appendChild(input);
					tr.appendChild(td);
					table.appendChild(tr);
		
		subDiv.appendChild(table);
		topDiv.appendChild(subDiv);
				
		document.body.appendChild(topDiv);
	},

	this.doCreateGate = function(){
		var table = document.getElementById("gateCreationTable");
		var loc = $(table).data("loc");
		var owner = Math.floor(document.getElementById("createGateOwner").value);
		var damage = Math.floor(document.getElementById("createGateDamage").value);
			if (damage == ""){damage = 0}
		var useable = Math.floor(document.getElementById("createGateUseable").value);
			if (useable == ""){useable = true}
					
		if (owner == ""){
			alert("FATAL ERROR MISSING DATA");
			return;
		}
		
		var gate = {
					gameid: gameid,
					owner: owner,
					loc: loc,
					damage: damage,
					useable: useable,
					};
		
		this.gates.push(gate);
		this.activePopUp = false;
			
		var div = document.getElementById("gateCreationDiv");
			div.parentNode.removeChild(div);
		
		if (this.gates.length > 0){
			document.getElementById("confirmGateButton").className = "";
		}
	},
	
	this.cancelGate = function(){
		this.activePopUp = false;
		var div = document.getElementById("gateCreationDiv");
			div.parentNode.removeChild(div);
	},

	this.destroyGate = function(hex){
		if (! this.killGateMode){
			this.killGateMode = true;
		}
		else {
			this.killGateMode = false;
		}
	},

	this.showGateSelect = function(hex){

		var gates = [];
		var tds = [];

		for (var i = 0; i < hex.contains.length; i++){
			if (hex.contains[i] instanceof Jumpgate){
				gates.push(hex.contains[i]);
			}
		}


		var th = document.createElement("th");
			th.innerHTML = "Select which Jumpgate to kill:";
			tds.push(th);


		for (var i = 0; i < gates.length; i++){
			var td = document.createElement("td");
				td.innerHTML = "Jumpgate ID: " + gates[i].id;
				$(td).data("id", gates[i].id);
				td.addEventListener("click", function(){
					if ($(this).hasClass("gateSelected")){
						$(this).removeClass("gateSelected");
					}
					else {
						$(this).addClass("gateSelected");
					}
				});
				tds.push(td);
		}

		var table = document.createElement("table");
			table.id = "gateKillDiv";

		for (var i = 0; i < tds.length; i++){
			var tr = document.createElement("tr");
				tr.appendChild(tds[i]);
			table.appendChild(tr);
		}

		var tr = document.createElement("tr");
			tr.innerHTML = "<td><input type='button' value='confirm' onclick='admin.killGate()'</input></td>";
		table.appendChild(tr);

		document.body.appendChild(table);
	},

	this.killGate = function(){
		var div = document.getElementById("gateKillDiv");
		var rows = div.getElementsByTagName("td");
		var gates = [];

		for (var i = 0; i < rows.length; i++){
			if (rows[i].className == "gateSelected"){
				gates.push($(rows[i]).data("id"));
			}
		}

		$(div).remove();

		ajax.killGates(gates);

	},


	this.logGates = function(){
		for (var i = 0; i < this.gates.length; i++){
			console.log(this.gates[i]);
		}
	}

	this.commitGates = function(){
		console.log("commit");
		if (this.gates.length > 0){
			ajax.postGates(this.gates);
			this.gates = [];
		}
		else {
			alert("no gates in queue");
		}
	}
}