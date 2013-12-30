	
//Application core
	

	function init(){
		
		//Create or open the database
		  console.log("Opening database");
		  theDB = window.openDatabase("fpDB", "1.0", "Finger Printer", 3 * 1024 * 1024);
		  console.log("Checking theDB");
		  if(theDB) {
		    console.log(theDB);
		    console.log("Creating table");
		    theDB.transaction(createTable, onTxError, onTxSuccess);
		    theDB.transaction(createTableRecord, onTxError, onTxSuccess);
		    console.log("Finished creating table");
		  } else {
		    console.log("theDB object has not been created");
		    alert("this code shouldn't ever execute");
		  }
	}
	
	function createTable(tx) {
		
	  console.log("Entering createTable");
	  
	  var sqlStr = 'CREATE TABLE IF NOT EXISTS users (ssn INT, name TEXT, last_name TEXT, email TEXT)';
	  console.log(sqlStr);
	  
	  tx.executeSql(sqlStr, [], onSqlSuccess, onSqlError);
	  console.log("Leaving createTable");
	}
	
	// Create table to save fingerprint records
	function createTableRecord(tx) {
	
	  console.log("Entering createTableRecord");
	  
	  var sqlStr = 'CREATE TABLE IF NOT EXISTS records (type TEXT, date DATE)';
	  console.log(sqlStr);
	  
	  tx.executeSql(sqlStr, [], onSqlSuccess, onSqlError);
	  console.log("Leaving createTableRecord");
	}
	
	function onTxSuccess() {
	  console.log("TX: success");
	}

	function onTxError(tx, err) {
		
	  console.log("Entering onTxError");
	  var msgText;
	  //Did we get an error object (we should have)?
	  if(err) {
	    //Tell the user what happened
	    msgText = "TX: " + err.message + " (" + err.code + ")";
	  } else {
	    msgText = "TX: Unkown error";
	  }
	  console.error(msgText);
	  alert(msgText);
	  console.log("Leaving onTxError");
	}
	
	function saveRecord() {
	  
		console.log("Entering saveRecord");
		//Make sure we have a valid date before trying to save the entry
	
		//Make sure numMiles > 0 before trying to save the entry
	
		//Write the record to the database
		theDB.transaction(insertRecord, onTxError, onTxSuccess);
		console.log("Leaving saveRecord");
	}
	
	function insertRecord(tx) {
		
	  console.log("Entering insertRecord");
	  //Get information from form
	  var name = document.getElementById("name").value;
	  console.log("Name: " + name);
	  var lastName = document.getElementById("lastName").value;
	  console.log("Last name: " + lastName);
	  var ssn = document.getElementById("ssn").value;
	  console.log("Cédula: " + ssn);
	  var email = document.getElementById("email").value;
	  console.log("E-mail: " + email);
	  var sqlStr = 'INSERT INTO users (ssn, name, last_name, email) VALUES (?, ?, ?, ?)';
	  console.log(sqlStr);
	  tx.executeSql(sqlStr, [ssn, name, lastName, email], onSqlSuccess, onSqlError);

	  //Reset the form by setting a blank value for the input values
	  // using the jQuery $ selector
	  var blankVal = {
	    value : ''
	  };
	  $("#name").attr(blankVal);
	  $("#lastName").attr(blankVal);
	  $("#ssn").attr(blankVal);
	  $("#email").attr(blankVal);
	  console.log("Leaving insertRecord");
	}
	
	function insertInDateFingerprint(tx) {
	
	  console.log("Entering insertInDateFingerprint");
	  
	  var lastRegisterQuery = 'SELECT type FROM records ORDER BY date DESC LIMIT 1';
	  
	  tx.executeSql(lastRegisterQuery, [], 
	  	
	  	function(tx, success){
	  		
	  		if(success.rows.item(0).type == 'salida'){
	  			// Ejecutar consulta para agregar registro de entrada
  			   
			  var type= "entrada";
			  var date = new Date();
			  var month = addZ(date.getMonth() + 1);
			  var day = addZ(date.getDate());
			  var inDate = date.getFullYear()+"-"+month+"-"+day+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			  //alert(inDate);
			  var sqlStr = 'INSERT INTO records (type, date) VALUES (?, ?)';
			  
			  console.log(sqlStr);
  			  tx.executeSql(sqlStr, [type, inDate], onSqlSuccess, onSqlError);
	  			
	  		  alert("Ingreso registrado.");
	  		  
	  		}else{
	  		  alert("Ya registró; una entrada, por favor registre su salida.");
	  		}
	  		
	  	},
	  	onSqlError
	  );

	}
	
	function insertOutDateFingerprint(tx) {
		
	  console.log("Entering insertOutDateFingerprint");
	  
	  var lastRegisterQuery = 'SELECT type FROM records ORDER BY date DESC LIMIT 1';
	  
	  tx.executeSql(lastRegisterQuery, [], 
	  	
	  	function(tx, success){
	  	
	  		if(success.rows.item(0).type == 'entrada'){
	  			
	  			var type= "salida";
			    var date = new Date();
			    var month = addZ(date.getMonth() + 1);
			    var day = addZ(date.getDate());
			    var outDate = date.getFullYear()+"-"+month+"-"+day+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			    //alert(outDate);
			    var sqlStr = 'INSERT INTO records (type, date) VALUES (?, ?)';
			    
			    console.log(sqlStr);
			    tx.executeSql(sqlStr, [type, outDate], onSqlSuccess, onSqlError);
			    
			    alert("Salida registrada.");
	  			
	  		}else{
	  			
	  			alert("Ya registró; una salida, por favor registre su entrada.");
	  		}
	  	
	  	}, 
	  	onSqlError
  	  );
	}
	
	function deleteRecord(){
		
		theDB.transaction(deleteRow, onTxError, onTxSuccess);
		console.log("Leaving saveRecord");
				
	}
	
	function deleteRow(tx){
	
		var sqlStr= 'DELETE FROM users';
		console.log(sqlStr);
		
		tx.executeSql(sqlStr, [], onSqlSuccess, onSqlError);
	}
	
	function onSqlSuccess(tx, res) {
	  console.log("SQL: success");
	  if(res) {
	    console.log(res);
	  }
	}

	function onSqlError(tx, err) {
		
	  console.log("Entering onSqlError");
	  var msgText;
	  if(err) {
	    msgText = "SQL: " + err.message + " (" + err.code + ")";
	  } else {
	    msgText = "SQL: Unknown error";
	  }
	  console.error(msgText);
	  alert(msgText);
	  console.log("Leaving onSqlError");
	}
	
	function verifyUser(){
		var sqlStr = "SELECT * FROM users";
		
		console.log("SQL: " + sqlStr);
		
		theDB.transaction(function(tx) {
			tx.executeSql(sqlStr, [], onQuerySuccess, onQueryFailure);
		}, onTxError, onTxSuccess);
	}
	
	function onQuerySuccess(tx, results) {
		
	  console.log("Entering onQuerySuccess");
	  //alert("Num rows: "+results.rows.length);
	  
	  if(results.rows.length > 0) {
		  
		  $.mobile.changePage("#main", "slide", false, true);
		  
	  } else {
		  $("#login").show();
		  $.mobile.changePage("#login", "slide", false, true);
	  }
	}
	
	function onQueryFailure(tx, err) {
	  
		console.log("Entering onQueryFailure");
		var msgText;
		
		if(err) {
			msgText = "Query: " + err;
		} else {
			msgText = "Query: Unknown error";
		}
		
		console.error(msgText);
		alert(msgText);
		console.log("Leaving onQueryFailure");
	}


	function showConfigPage() {
	  $.mobile.changePage("#config", "slide", false, true);
	}

	function showRecordPage() {
	  $.mobile.changePage("#record", "slide", false, true);
	  showRecords();
	}
	
	// Income registers?
	function fingerPrintIn(){
		
		theDB.transaction(insertInDateFingerprint, onTxError, onTxSuccess);
		
		navigator.notification.vibrate(500);
		
	}
	
	// Outcome registers?
	function fingerPrintOut(){
		
		theDB.transaction(insertOutDateFingerprint, onTxError, onTxSuccess);
		
		navigator.notification.vibrate(500);
	}
	
	function showRecords(){
		var sqlStr = "SELECT * FROM records ORDER BY date ASC";
		
		console.log("SQL: " + sqlStr);
		
		theDB.transaction(function(tx) {
			
					tx.executeSql(sqlStr, [], 
					// Query success
					function(tx, results){
						
						// Clean record's table before show all records.
						$('#records-table > tbody tr').empty();
				
						var len = results.rows.length;
						var objDate;
						var strDate;
						var inOutCount = 0;
						var inOutDateArray = new Array();
						var ttalWorkedHrs = 0;
				
						for(var i = 0; i < len; i++){
							
							var d = new Date();
							strDate = results.rows.item(i).date;
							//d.setTime(results.rows.item(i).date);
							
							$("<tr id= 'record"+ i +"'><td>"+results.rows.item(i).type+"</td><td>"+strDate+"</td><td></td></tr>").prependTo('#records-table > tbody');
							$('t')
							//objDate = new Date(strDate);
							
							inOutDateArray[inOutCount] = strDate;
							
							if( i % 2 != 0){
								
								var inDate = new Date(inOutDateArray[0]);
								var outDate = new Date(inOutDateArray[1]);
								
								var diffSec = Math.abs(outDate - inDate) / 1000;
								var workedHrs = ((diffSec % 31536000) % 86400) / 3600;
								
								ttalWorkedHrs = ttalWorkedHrs + workedHrs;
								
								workedHrs = workedHrs.toFixed(4);
								
								//alert("in: "+ inDate + " out: "+ outDate + " worked hours: "+ workedHrs);
								
								$('#record' + i + ' td:last').text(workedHrs);
								
								inOutCount = 0;
							}else{
								
								inOutCount++;	
							}
							
						}
						
						$('#worked-hrs-table tr td:last').text(ttalWorkedHrs.toFixed(4));
						
						//alert("Dia: "+objDate.getDay());
						//alert("Type: "+results.rows.item(0).type+" Date: "+results.rows.item(0).date)
					},
					// Query failure
					function(tx, err){
						
						alert("Error al realizar la consulta");
					});
		}, onTxError, onTxSuccess);
	}
	
	function confDeleteRecords(){
		
		// Get value of month selected
		var selectedMonth = $('#monthList').find(":selected").val();
		
		var sqlString = "DELETE FROM records";
		var testQuery = "DELETE FROM records WHERE strftime('%m', 'now') = '"+selectedMonth+"'";
		alert(testQuery);
		var result = "";
		
		theDB.transaction(function(tx) {
			
			tx.executeSql(testQuery, [], 
				// Query success
				function(tx, results){
					
					/*
					var len = results.rows.length;
					alert("Número de registros: "+len);
					for(var i = 0; i < len; i++){
						
						var d = new Date();

						d.setTime(results.rows.item(i).date);
						
						result += d.toDateString()+" "+d.toTimeString()+"\n";
					}
					
					alert(result);
					*/
					alert("Se ha eliminado los registros");
				},
				// Query failure
				function(tx, err){
					console.log(err);
					alert("Error al realizar la consulta");
				}
			);
		}, onTxError, onTxSuccess);
		
	}
	
	function addZ(n){return n<10? '0'+n:''+n;}
	
