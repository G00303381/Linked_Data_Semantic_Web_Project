//Import express to create and configure the HTTP server.
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var crimes = JSON.parse(fs.readFileSync('crime_offences.json', 'utf8'));

//Set up a databse using SQLite3
var db = new sqlite3.Database(':memory:');


db.serialize(function() 
{
   db.run('CREATE TABLE crime_offences(GardaStation Text, Crime Text, Y2006Q1 INTEGER, Y2006Q2 INTEGER, Y2006Q3 INTEGER, Y2006Q4 INTEGER, Y2011Q1 INTEGER, Y2011Q2 INTEGER, Y2011Q3 INTEGER, Y2011Q4 INTEGER)');
    
    var stmt = db.prepare('INSERT INTO crime_offences VALUES (?,?,?,?,?,?,?,?,?,?)');
    crimes.forEach(function (fill) 
    {
        stmt.run(fill.GardaStation, fill.Crime, fill.Y2006Q1, fill.Y2006Q2, fill.Y2006Q3, fill.Y2006Q4, fill.Y2011Q1, fill.Y2011Q2, fill.Y2011Q3, fill.Y2011Q4);
        //console.log(fill.GardaStation + "\n", fill.Crime + "\n", fill.Y2006Q1 + "\n", fill.Y2006Q2 + "\n", fill.Y2006Q3 + "\n", fill.Y2006Q4 + "\n", fill.Y2011Q1 + "\n", fill.Y2011Q2 + "\n", fill.Y2011Q3 + "\n", fill.Y2011Q4 + "\n");
                          
    });
    
    stmt.finalize();
    
});
db.close();

//Create a HTTP server app.
var app = express();

//When a user goes to /, return a small help string
app.get('/', function(req, res) {
    res.send("Welcome to the api.");
    console.log("Port 8080: Something Happening!");
});

//When a user goes to /all, return all the database
app.get('/all', function(req, res) {
  db.all("SELECT * FROM crime_offences", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//Start the server.
var server = app.listen(8080);