//Import express to create and configure the HTTP server.
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var crimes = JSON.parse(fs.readFileSync('crime_offences.json', 'utf8'));
var population = JSON.parse(fs.readFileSync('population.json', 'utf8'));

//Set up a databse using SQLite3
var db = new sqlite3.Database(':memory:');


db.serialize(function() 
{
    db.run('CREATE TABLE crime_offences(GardaStation Text, Crime Text, Y2006Q1 INTEGER, Y2006Q2 INTEGER, Y2006Q3 INTEGER, Y2006Q4 INTEGER,                      Y2011Q1 INTEGER, Y2011Q2 INTEGER, Y2011Q3 INTEGER, Y2011Q4 INTEGER)');
    
    var stmt = db.prepare('INSERT INTO crime_offences VALUES (?,?,?,?,?,?,?,?,?,?)');
    crimes.forEach(function (fill) 
    {
        stmt.run(fill.GardaStation, fill.Crime, fill.Y2006Q1, fill.Y2006Q2, fill.Y2006Q3, fill.Y2006Q4, fill.Y2011Q1, fill.Y2011Q2, fill.Y2011Q3,                   fill.Y2011Q4);                   
    });
    
    db.run('CREATE TABLE population(Sex Text, Y2006 INTEGER, Y2011 INTEGER, City Text)');
    
    var stmt = db.prepare('INSERT INTO population VALUES (?,?,?,?)');
    population.forEach(function (fill)
    {
        stmt.run(fill.Sex, fill.Y2006, fill.Y2011, fill.City);
        console.log(fill.Sex, fill.Y2006, fill.Y2011, fill.City);
    });
    
    stmt.finalize();
});

//db.close();

//Create a HTTP server app.
var app = express();

//When a user goes to /, return a small help string
app.get('/', function(req, res) {
    res.send("Welcome to the api.");
    console.log("Port 8080: Something Happening!");
});

//When a user goes to /allc, return all the crimes database
var postsc = [];
db.serialize(function() {
    db.each("SELECT * FROM crime_offences", function(err, row) {
        postsc.push({GardaStation: row.GardaStation, Crime: row.Crime, Y2006Q1: row.Y2006Q1, Y2006Q2: row.Y2006Q2, Y2006Q3: row.Y2006Q3, Y2006Q4:            row.Y2006Q4, Y2011Q1: row.Y2011Q1, Y2011Q2: row.Y2011Q2, Y2011Q3: row.Y2011Q3, Y2011Q4: row.Y2011Q4})
    }, function() {
    })
})

app.get('/allc', function(req, res){
    console.log("Retrieving crime offences data...");
    res.send(postsc);
});

var postsp = [];
db.serialize(function() {
    db.each("SELECT * FROM population", function(err, row) {
        postsp.push({Sex: row.Sex, Y2006: row.Y2006, Y2011: row.Y2011, City: row.City})
    }, function() {
        
    })
})

app.get('/allp', function(req, res) {
    console.log("Retrieving population data...");
    res.send(postsp);
});

//Start the server.
var server = app.listen(8080);