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
*CJQ03:Population by Sex, Province or County and CensusYear
http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/saveselections.asp
*CDD01:Recorded Crime Offences by Garda Division, Type of Offence and Quarter
http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/saveselections.asp

###Querying the API
##General Actions:
Accessing the root link **(localhost:8000/)** will bring the user to welcome page of the API, a welcome message is displayed as shown below:

The API can also be accessed by using the flowwing links to query the two datasets and return specific information dependant on what the user enters:
*(localhost:8000/allc)
Entering this page of the API will return all of the information displayed in the Crimes.db file.
*(localhost:8000/allp)

##Specific Actions Ussing Parameters:
Entering this page followed by a numberic value will query the Crimes.db file for the psecific id entered by the user.
*(localhost:8000/offenceId/:id)
Entering this page followed by a string value will query the Crimes.db file for crime offence records with similar values to the string entered by the user.
*(localhost:8000/crimesbyoffence/:offence)

#####*This Readme will be updated as the project continues..*

