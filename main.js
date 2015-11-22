//Install express to create and configure a HTTP server
var express = require('express');
//Install sqlite3 to create and handle the databases
var sqlite3 = require('sqlite3').verbose();
//Install body parser to parse the data from the body
var bodyParser = require('body-parser');
var fs = require('fs');

//Create a HTTP server app
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Read in the CSV files and convert them into JSON formatted data
var crimes = JSON.parse(fs.readFileSync('crime_offences.json', 'utf8'));
var population = JSON.parse(fs.readFileSync('population.json', 'utf8'));

//Set up a databse using SQLite3 locally
var db = new sqlite3.Database(':memory:');

//Create the crime_offences database and populate the table with the JSON files
db.serialize(function() {
        db.run('CREATE TABLE crime_offences(id INTEGER PRIMARY KEY AUTOINCREMENT, GardaStation Text, Crime Text, '
               + 'Y2006Q1 INTEGER, Y2006Q2 INTEGER, Y2006Q3 INTEGER, Y2006Q4 INTEGER, Y2011Q1 INTEGER, '
               + 'Y2011Q2 INTEGER, Y2011Q3 INTEGER, Y2011Q4 INTEGER)');
    
        var stmt = db.prepare('INSERT INTO crime_offences '
                              +'(GardaStation,Crime,Y2006Q1,Y2006Q2,Y2006Q3,Y2006Q4,Y2011Q1, '
                              +'Y2011Q2,Y2011Q3,Y2011Q4) VALUES (?,?,?,?,?,?,?,?,?,?)');
        
        //For each loop to populate the database with every JSON component
        crimes.forEach(function (fill) 
        {
            stmt.run(fill.GardaStation, fill.Crime, fill.Y2006Q1, fill.Y2006Q2, fill.Y2006Q3, fill.Y2006Q4, fill.Y2011Q1, fill.Y2011Q2,                             fill.Y2011Q3, fill.Y2011Q4);
        });
        
        stmt.finalize(); 

        db.run('CREATE TABLE population(Sex Text, Y2006 INTEGER, Y2011 INTEGER, City Text)');
        var stmt = db.prepare('INSERT INTO population VALUES (?,?,?,?)');
        population.forEach(function (fill)
        {
            stmt.run(fill.Sex, fill.Y2006, fill.Y2011, fill.City);
        });
        
        stmt.finalize(); 
});

//db.close();

//When a user goes to /, return a welcome string
app.get('/', function(req, res) {
    res.render('Crime.ejs');
    //res.send("Welcome to the api.");
    console.log("Port 8080: Something is Happening!");
});

//When a user goes to /allp, return the population database entirely (tab formatted).
app.get('/allp', function(req, res){
    console.log("Retrieving population data... ");
    db.all("SELECT * FROM population", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//When a user goes to /allc, return the population database (tab formatted).
app.get('/allc', function(req, res) {
    console.log("Retrieving crime data... ");
    db.all("SELECT * FROM crime_offences", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//Query the database using 
app.get('/crimesbyoffence/:offence', function(req, res) {
    console.log("Getting strings like...");
    db.all("SELECT * FROM crime_offences WHERE Crime LIKE \"%"+ req.params.offence + "%\"", function(err, row) { 
        rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        console.log(req.params.offence);
    });
});

app.get('/populationbysex/:sex', function (req, res) {
    db.all("SELECT * FROM population WHERE Sex LIKE \"%" + req.params.sex + "%\"", function(err,row)
    {
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        console.log(req.params.yearStr);
    });
});

//Crime Rates and total population by City
app.get('/compare/:offence/:city', function (req, res)
{
    db.all("SELECT DISTINCT crime_offences.GardaStation as Station, crime_offences.Crime as Crime, (crime_offences.Y2006Q1 + crime_offences.Y2006Q2 + crime_offences.Y2006Q3 + crime_offences.Y2006Q4 + crime_offences.Y2011Q1 + crime_offences.Y2011Q2 + crime_offences.Y2011Q3 + crime_offences.Y2011Q4) AS Total_Crimes, (population.Y2006 + population.Y2011) AS Total_Population, population.City as City FROM crime_offences LEFT JOIN population WHERE crime_offences.Crime LIKE \"%"+req.params.offence+"%\" AND population.City LIKE \"%"+req.params.city+"%\" ", function(err,row)
    {
        var rowString2 = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString2);
    });
});
var Crime = function(id, GardaStation, Crime , Y2006Q1, Y2006Q2, Y2006Q3, Y2006Q4, Y2011Q1, Y2011Q2, Y2011Q3, Y2011Q4) {
    this.id = (id) ? id : 0;
    this.GardaStation = (GardaStation) ? GardaStation : "Empty";
    this.Crime = (Crime) ? Crime : "Empty";
    this.Y2006Q1 = (Y2006Q1) ? Y2006Q1 : "0";
    this.Y2006Q2 = (Y2006Q2) ? Y2006Q1 : "0";
    this.Y2006Q3 = (Y2006Q3) ? Y2006Q1 : "0";
    this.Y2006Q4 = (Y2006Q4) ? Y2006Q1 : "0";
    this.Y2011Q1 = (Y2011Q1) ? Y2006Q1 : "0";
    this.Y2011Q2 = (Y2011Q2) ? Y2006Q1 : "0";
    this.Y2011Q3 = (Y2011Q3) ? Y2006Q1 : "0";
    this.Y2011Q4 = (Y2011Q4) ? Y2006Q1 : "0";
}

app.post('/add', function(req, res) {
    console.log("Trying to add");
    var temp_id = 999;
    var newCrime = new Crime(temp_id, req.body.GardaStation,
                         req.body.Crime, req.body.Y2006Q1,
                         req.body.Y2006Q2, req.body.Y2006Q3,
                         req.body.Y2006Q4, req.body.Y2011Q1,
                         req.body.Y2011Q2, req.body.Y2011Q3,
                         req.body.Y2011Q4);
    
    var stmt = crime_offences.prepare("INSERT into crime_offences"
    + " ('GardaStation', 'Crime', 'Y2006Q1', 'Y2006Q2', 'Y2006Q3', 'Y2006Q4', 'Y2011Q1', 'Y2011Q2', 'Y2011Q3', 'Y2011Q4') "
    + " VALUES (?,?,?,?,?,?,?,?,?,?)");

    stmt.run(newCrime.GardaStation, newCrime.Crime,
     newCrime.Y2006Q1, newCrime.Y2006Q2, newCrime.Y2006Q3,
     newCrime.Y2006Q4, newCrime.Y2011Q1, newCrime.Y2011Q2,
     newCrime.Y2011Q3, newCrime.Y2011Q4);
    
    console.log("New Crime Added.");
    crimes[crimes.length + 1] = " ";
});

app.get('/delete/:id', function (req, res) {
  var crime_id = req.params.id;
  var stmt = db.run("DELETE FROM crime_offences"
    + " WHERE id = " + crime_id, function(err, row) {
      res.send("Crime with ID " + crime_id + " deleted");
    });
  });

//Start the server.
var server = app.listen(8080);