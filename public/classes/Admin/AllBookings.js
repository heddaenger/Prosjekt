//Functions which is to output all user made bookings for the admin to see
function allBookings() {

    //Defines variable bookings and retrieves booking data from localstorage with the method getItem() and the JSON parse() method
    var bookings = JSON.parse(localStorage.getItem("bookings"));

    //Creates empty array
    var bookingArray = [];

    //For loop which loops over all bookings and pushes these bookings into the empty newly created array
    for(var i = 0; i < bookings.length; i++) {
        console.log(bookings[i]);
        bookingArray.push(bookings[i]);

    }

    //Defines the elements for a table, that is to show all booking info
    let row, cell, text, rowSize, columnSize,

        //Defines properties which are objects in the booking class
        properties = ['bookingNumber','seatsChosen', 'date', 'time','user'],

        //Defines the table as a DIV in html
        table = document.getElementById("adminTable"),
        data = bookingArray;

    //For loop which loops over the booking and creates a row for each element represented in the array
    for (rowSize = 0; rowSize < data.length; rowSize++) {

        //We use the .createElement method to create the rows in our html.
        row = document.createElement('tr');

        //For loop which loops over the 5 properties defined in the function
        for (columnSize = 0; columnSize < 5; columnSize++) {

            //Creates the cells in our html once using the .createElement method
            cell = document.createElement('td');

            //Creates a row for each element in our booking array and creates cells with the information for the properties
            text = document.createTextNode(data[rowSize][properties[columnSize]]);

            //Uses the method .appendChild to insert the data to the cells
            cell.appendChild(text); //indsætter data i cellen

            //Inserts the cells into the rows
            row.appendChild(cell);  //indsætter celler i rækker

        }
        //Creates the final table by inserting the rows into table
        table.appendChild(row);
    }
}

//Functions which is to output all users in the system for the admin to see
function allInformation() {

    //Defines information as the users in local storage. We use the JSON method .parse to objectify the string stored in localstorage
    let information = JSON.parse(localStorage.getItem("info")),

        //Creates an empty array for users
        userArray = [];

    //For loop which loops over the user array and pushes each user into the array
    for(var i = 0;i < information.length; i++) {
        userArray.push(information[i]);
    }


    //Defines the elements for a table, that is to show all booking info
    let row, cell, text, rowSize, columnSize,

        //Defines properties which are objects in the user class
        properties = ['fullName', "email", "phone"],
        table = document.getElementById("myInformation"),
        data = userArray;

    //For loop which loops over the userArray  and creates a row for each element represented in the array
    for (rowSize = 0; rowSize < data.length; rowSize++) {
        row = document.createElement('tr');

        //For loop which loops over the 3 properties defined in the function
        for (columnSize = 0; columnSize < 3; columnSize++) {

            //Creates the cells in our html once using the .createElement method
            cell = document.createElement('td');

            //Creates a row for each element in our booking array and creates cells with the information for the properties
            text = document.createTextNode(data[rowSize][properties[columnSize]]);

            //Uses the method .appendChild to insert the data to the cells
            cell.appendChild(text);

            //Inserts the cells into the rows
            row.appendChild(cell);

        }
        //Creates the final table by inserting the rows into table
        table.appendChild(row);
    }
}

//Creates new function displayInfo which executes when loading the html page
function displayInfo() {
    allInformation();
    allBookings();
}
