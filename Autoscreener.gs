/* This Google App script screen participants using two functions.
The first function categorizes applicants as "accept", "reject", or
"maybe." The first function is called "highlight."
*/
function highlighter() {
  
/*
Get the values needed to screen participants from the Google Sheet.
Currently, the Google Sheet "Psychology Experiment - Recruit" is
"bound" to this 
*/

  var sheet = SpreadsheetApp.getActive().getSheets()[0];
  var range = sheet.getDataRange();
  var objects = range.getValues();
  
  
/*
This color array will later help keep track of all the colors later on.
*/

  var colors = [];
  
/*
In this for loop, search for the column containing the eligibility information. In this case, it is column X. But it
if you want to do so. The loop goes to each row, checks the eligiblity, and it assigns a color to the three possible eligibility
values. If the value is "accept," it is colored green. If the value is "reject," it is colored red. If the value is "maybe", it is
colored orange.
*/ 

  
  for (var i = 0; i < objects.length; i++) {
    var eligibilityColumn = 'x';
    var lastIndex = eligibilityColumn.charCodeAt(0) - 'a'.charCodeAt(0);
    var colorRow = [];
    var currentColor = "white";
    
    if (objects[i][lastIndex] == "Accept") {
      currentColor = "#99FFBB";
    } else if (objects[i][lastIndex] == "Maybe") {
      currentColor = "#FFDD99";
    } else if (objects[i][lastIndex] == "Reject") {
      currentColor = "#FF9999";
    }
    
      
/*
The logger.log functions simply keep track of the values.
It may be removed if desired. Doing so will not affect the script.
*/
    
    Logger.log(objects[i][23]);
    Logger.log(currentColor);
    
/*
Planning Step: this for loop helps highlight the entire row instead of just the eligibility column. 
*/    
    
    for (var j = 0; j < objects[i].length; j++) {
        colorRow.push(currentColor);
    }
    
    colors.push(colorRow);
    
  }
  
/*
Now, the colors are actually applied to the spreadsheet and made visible.
*/    
  range.setBackgrounds(colors);
}

/*
This script deletes rejected participants in the Google Calendar that you are using to record
your experimental session. It will reject participants who are highlighted as "reject", but will
not check whether the accepted participants scheduled their followup session correctly*/    

function screener() {
  
  /*
    Gets the values from the spreadsheet
  */
  var sheetId = '1ERpSRmlVWp0OPGjy4G1FjiGsKSRGAmemGwwu_Jea5Ks';  //id sheet, taken from the URL
  var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0]; //since we only use one spreadsheet, we just take the first one
  var range = sheet.getDataRange(); //a range of all the cells
  var objects = range.getValues(); //gets the values
  
  
  /*
    This variable is the column that contains the elibility formula.  The columns are numbered starting with A = 0, B = 1, ... Z = 25.
  There is no limit to the number of columns that your Google Form may contain. Use as many as you like!
  */
 
  var eligibilityIndex = 23;
  
  /*
    Collects all the emails that are rejected into 'rejectEmails'
  */
  var rejectEmails = []  
  var emailColumn = 1; //By default we set the email column to 1
  for (var i = 0; i < objects.length; i++) { //collect all the emails that we need to reject from.
    if (objects[i][eligibilityIndex] == 'Reject') { 
      rejectEmails.push(objects[i][emailColumn]);
    }
  }
  
  /*
    This contains the date range for when the events are.
  */
  var startDate = new Date(); // the start date is the present day
  var endDate = new Date(startDate.getTime() + (365 *24 * 60 * 60 * 1000)); // the end date is next year in units of milliseconds
  
  
  /*
    The for loop looks through all events within the date range and finds events that contain people from the reject list.
    If the loop finds that someone was on the reject list, it deletes the event.
  */
  var calendarId = "nj1o5iaqhgtjrr4toppt3p2lpk@group.calendar.google.com";  //calendar also needs an id
  var events = CalendarApp.getCalendarById(calendarId).getEvents(startDate, endDate); 
  for (var i = 0; i < events.length; i++) { //each event
    var guestList = events[i].getGuestList(false); 
    for (var j = 0; j < guestList.length; j++) { //check its guest list for people that are in the reject email list
      Logger.log(guestList[j].getEmail());
      if (rejectEmails.indexOf(guestList[j].getEmail()) >= 0) { //the event contains a reject
        events[i].deleteEvent();
      }
    }
  }
  
  
  Logger.log(rejectEmails);
}
/*
This second function creates a custom menu called "Autolab" in the Google Sheet "Psychology Experiment - Recruit"
It allows the user to highlight directly from the Google Sheet instead of needing to open up the highlighter.gs
script separately. This kind of integration will save time.
*/  

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Autolab Menu')
      .addItem('Highlighter', 'highlighter')
      .addItem('Screener', 'screener')
      .addToUi();
  }
