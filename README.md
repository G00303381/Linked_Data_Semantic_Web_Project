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
The API makes use of typical REST capabilites (Get, Put, Post and Delete).
##General Actions:
Accessing the root link **(localhost:8000/)** will bring the user to welcome page of the API, a welcome message is displayed as shown below:

The API can also be accessed by using the flowwing links to query the two datasets and return specific information dependant on what the user enters:
- **(localhost:8000/allc)**
</br>Entering this page of the API will return all of the information displayed in the Crimes.db file.</br>
- **(localhost:8000/allp)**

##Specific Actions Using Parameters:
Entering this page followed by a numberic value will query the Crimes.db file for the psecific id entered by the user.
- **(localhost:8000/offenceId/:id)**
</br>Entering this page followed by a string value will query the Crimes.db file for crime offence records with similar values to the string entered by the user.
- **(localhost:8000/crimesbyoffence/:offence)**
</br>Entering this page followed by either Female or Male will query the Population.db file for population results specific to each sex.
- **(localhost:8000/populationbysex/:sex)**
</br>

##Deleting a Record
By entering the following pages followed by a numeric parameter the databases will find records correpsonding to the numeric value and remove the records from tables completely.
##Warning: Removing data is permanent.
- **(localhost:8000/deleteCrime/:id)**
- **(localhost:8000/deletePopulation/:id)**

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
#####*This Readme will be updated as the project continues..*

