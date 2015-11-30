# Linked_Data_Semantic_Web_Project

######Daniel Maloney

###Scope:
The API will allow the user to compare the data between two data sets. 
The first data set is a public census taken for the years 2006 and 2011 in four major cities 
in Ireland (Galway, Limerick, Dublin and Cork). The second data set contains crime activity during
the corresponding years (2006 and 2011) in each of these four cities. The idea of which is to
draw comparrissons with the increase of population in a city and the increase of crime rate within that city, 
as well as the severity of the crime.

###The API uses two Data Sets:
- CJQ03:Population by Sex, Province or County and CensusYear
http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/saveselections.asp
- CDD01:Recorded Crime Offences by Garda Division, Type of Offence and Quarter
http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/saveselections.asp

###Querying the API
</br>The API makes use of typical REST capabilites (Get, Put, Post and Delete).

###Installing the API
</br>The necessary dependencies for the API to work have been added to the package.json file, one only needs to run the _npm install_ command in the project directory. 
</br>After the command has successfully installed the necesary dependencies, running the _node main.js_ command will initialise the API.
</br>To test the APIs REST capabilities I used the Postman dekstop applicaion to query the data, the link to the application can be found below.

##General Actions:
</br>Accessing the root link **(localhost:8080/)** will bring the user to welcome page of the API, a welcome message is displayed as shown below:

</br>The API can also be accessed by using the flowwing links to query the two datasets and return specific information dependant on what the user enters:
- **(localhost:8080/allc)**
```json
{
	"id": 2,
	"GardaStation": "23, Galway Garda Division",
	"Crime": "033 ,Harassment and related offences",
	"Y2006Q1": 20,
	"Y2006Q2": 12,
	"Y2006Q3": 17,
	"Y2006Q4": 28,
	"Y2011Q1": 28,
	"Y2011Q2": 36,
	"Y2011Q3": 24,
	"Y2011Q4": 21
},
{
	"id": 3,
	"GardaStation": "23, Galway Garda Division",
	"Crime": "034 ,Assault causing harm, poisoning",
	"Y2006Q1": 49,
	"Y2006Q2": 30,
	"Y2006Q3": 41,
	"Y2006Q4": 43,
	"Y2011Q1": 57,
	"Y2011Q2": 52,
	"Y2011Q3": 52,
	"Y2011Q4": 38
}
```
</br>Entering this page of the API will return all of the information displayed in the crime_offences table.</br>
- **(localhost:8080/allp)**
```json
{
	"id": 1,
	"Sex": "Both sexes",
	"Y2006": 1187176,
	"Y2011": 1273069,
	"City": "Dublin"
},	
{
    "id": 2,
	"Sex": "Both sexes",
	"Y2006": 481295,
	"Y2011": 519032,
	"City": "Cork"
}
```
##Specific Actions Using Parameters:
</br>Entering this page followed by a numberic value will query the crime_offences table for the specific id entered by the user.
- **(localhost:8080/offenceId/:id)**
</br>The expected response by searching using _(http://localhost:8080/offenceId/120)_:
```json
{
	"id": 120,
	"GardaStation": "35, Limerick Garda Division",
	"Crime": "1022 ,Possession of drugs for personal use"
}
```
</br>Entering this page followed by a string value will query the crime)offences table for crime offence records with similar values to the string entered by the user.
- **(localhost:8080/crimesbyoffence/:offence)**
</br>The expected response by querying the database using _(http://localhost:8080/crimesbyoffence/Rob)_:
```json
{
	"id": 8,
	"GardaStation": "23, Galway Garda Division",
	"Crime": "0611 ,Robbery of an establishment or institution",
	"Y2006Q1": 17,
	"Y2006Q2": 3,
	"Y2006Q3": 3,
	"Y2006Q4": 7,
	"Y2011Q1": 2,
	"Y2011Q2": 2,
	"Y2011Q3": 0,
	"Y2011Q4": 0
},
{
	"id": 9,
	"GardaStation": "23, Galway Garda Division",
	"Crime": "0612 ,Robbery of cash or goods in transit",
	"Y2006Q1": 0,
	"Y2006Q2": 0,
	"Y2006Q3": 2,
	"Y2006Q4": 2,
	"Y2011Q1": 0,
	"Y2011Q2": 0,
	"Y2011Q3": 0,
	"Y2011Q4": 0
},
```
</br>Entering this page followed by either Female or Male will query the population table for population results specific to each sex.
- **(localhost:8080/populationbysex/:sex)**
</br>The expected resonse from querying the database by the female sex _(https://localhost:8080/populationBySex/female)_:
```json
{
	"id": 11,
	"Sex": "Female",
	"Y2006": 91375,
	"Y2011": 95994,
	"City": "Limerick"
},
{
	"id": 12,
	"Sex": "Female",
	"Y2006": 115194,
	"Y2011": 125895,
	"City": "Galway"
}
```
##Updating a Record
By entering the following URLs followed by the listed parameters the database will find the records by their Id and update the records by the specified amount by year.
</br>**_Warning: removing data is permanent_**
- **(localhost:8080/updateCrime/:id/:year/:amount)**
- **(localhost:8080/updatePopulation/:id/:year/:amount)**
</br>To verify the updated records the following URLs provide a quick method of confimeing the results:
- **(localhost:8080/offenceId/:id)**
- **(localhost:8080/populationId/:id)**

##Deleting a Record
By entering the following pages followed by a numeric parameter the database will find records correpsonding to the numeric value and remove the records from tables completely.
</br>**_Warning: removing data is permanent_**
- **(localhost:8080/deleteCrime/:id)**
- **(localhost:8080/deletePopulation/:id)**

##Code Snippets
The following code snippets 
```javascript
app.get('/allc', function(req, res) {
    var dbC = new sqlite3.Database(file);
    console.log("Retrieving crime data... ");
    dbC.all("SELECT * FROM crime_offences", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
    dbC.close();
});
```
```javascript
app.get('/crimesbyoffence/:offence', function(req, res) {
    var dbC = new sqlite3.Database(file);
    console.log("Using string " + req.params.offence + " to query the database");
    dbC.all("SELECT * FROM crime_offences WHERE Crime LIKE \"%"+ req.params.offence + "%\"", function(err, row) { 
        rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
    });
    dbC.close();
});
```
```javascript
app.delete('/deleteCrime/:id', function (req, res) {
    var dbC = new sqlite3.Database(file);
    dbC.run("DELETE FROM crime_offences WHERE id =?", req.params.id, function(err, row)
    {
        // this.changes tells you how many changes were just made
        if (this.changes == 1) {
            result = "Deleted from Crimes DB with id: " +
                req.params.id + "\n";
            res.send(result);
            console.log("1 row deleted with ID: " + req.params.id);
        }
        else{
            result = "Could not find record with id: " +
                req.params.id + "\n";
            res.send(result);
            console.log("No rows deleted");
        }
    });
    dbC.close();
});
```

##References:
Whilst creating this API a number of useful articles and tools have been used to help me better understand how APIs are created, and how to implement REST functionalities. For further information please follow the links below:
- Node.JS and SQLite: <http://blog.modulus.io/nodejs-and-sqlite>
- Build a RESTful API Using Node and Express 4: <http://blog.modulus.io/nodejs-and-sqlite>
- Postman Developer Tool for testing the API: <https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en>
- For information on how to query databases: <http://www.w3schools.com/sql/default.asp> 

