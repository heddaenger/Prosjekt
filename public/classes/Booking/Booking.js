//The following code contains all classes and functions allowing a booking to be placed and stored
//Also allows user to view bookings and user info.

//Defines booking class
class Booking {

    //Creates constructor with class attributes
    constructor(bookingNumber, seatsChosen, date, time, user) {

        this.bookingNumber = bookingNumber;
        this.seatsChosen = seatsChosen;
        this.date = date;
        this.time = time;
        this.user = user;
    }
    //Adds method to class, that gets called when a new booking is successful
    bookingAlert() {
        alert("you have made a new booking");

    }

    //Adds method to class, that gets called when a deletion of a booking is successfully executed
    bookingAlertDelete () {
        alert("Booking " + document.getElementById("deleteB").value + " succesfully deleted");
    }

    //Adds method to class, that gets called when delete-input is empty
    bookingAlertDeleteEmpty () {
        alert("type the number of the booking you want to delete")
    }
}

//Function, that stores a booking in LocalStorage
function setBooking() {
    let bookingArray = JSON.parse(localStorage.getItem("bookings"));

    //Defines global scope for all variables
    var bookingNumber, seats, date, timeSelector, time, userId, bookings, values;

    //If statement that assigns a number to a booking and increases by 1 for each booking made
    if (bookingArray == null) {
        bookingNumber = 1;
    } else {
        bookingNumber = bookingArray.length + 1;
    }
    //Retrieves user input from HTML page
    seats = document.getElementById("tableSeats").value;

    date = document.getElementById("datestring").innerHTML;

    timeSelector = document.getElementById("time");
    time = timeSelector.options[timeSelector.selectedIndex].value;

    if(time === undefined) {
        alert("please select time");
        return false;
    }

    userId = localStorage.getItem("current_user");



    //If statement which prompts a confirmation and returns true/false depending on user input if all conditions of a booking is met.
    if (confirm('Are you sure, you want to make a booking?')) {
        // Save it!

        //Defines booking variable as an object and retrieves items for "Bookings"


        //Instantiation of new objects for booking class
        bookings = new Booking(bookingNumber, seats, date, time, userId);

        //Defines values variable and retrives data from LocalStorage (Erstat med "BookingArray?)
        values = JSON.parse(localStorage.getItem("bookings"));

        //If statement which checks if LocalStorage item bookings is empty and creates a new empty array.
       if (values === null) {
           values = [];
       }
       //Pushes values of bookings into empty array
        values.push(bookings);

       //Stores key bookings with the value of values array
        localStorage.setItem("bookings", JSON.stringify(values));

       //Calls method bookingAlert from booking class.
      new Booking().bookingAlert();

      //Redirects to booking confirmation page when booking is created
      window.location.replace("bookingConfirmation.html");
      return false;
        //  alert("new booking made");
    }
}

//Function that allows user to delete a booking
function deleteBooking() {

        let bookings = JSON.parse(localStorage.getItem("bookings"));
        let iName = document.getElementById("deleteB").value;
        let user = localStorage.getItem("current_user");
        let indexArray = [];

        // For loop that loops over all bookings
        for (var i = 0; i < bookings.length; i++) {
            console.log(bookings[i]);

            // If a booking is equal to the bookingnumber. Booking is pushed to indexarray
            if (bookings[i].bookingNumber == iName) {
                console.log("found");
                indexArray.push(bookings[i]);
            } else {
                console.log("not found")
            }
        }

        // using findIndex method, and defining a function with the parameter x.
    // iterating through object properties of bookingNumber and compares them to input number of the booking the user wants to delete
        var ib = bookings.findIndex(x => x.bookingNumber == iName);

        // searches for the user inside the array containing the bookings of the specific user.
    // prevents the current user from deleting another users order
        var ob = indexArray.findIndex(x => x.user == user);

// Checks for empty input in the event of clicking the delete button
        if (iName == "") {
            new Booking().bookingAlertDeleteEmpty();
            return false;
        }

        // checks if the booking number in the booking array exists
        if (ib === undefined) {
            alert("you have no bookings");
            return false;
        }

        // checks if booking number exists in the booking array, and if the user has made the booking connected to the bookingnumber
        if (ib !== -1 && ob !== -1) {

            // Nested if statement if first condition is true.
            if (confirm("Are you sure you want to delete booking " + document.getElementById("deleteB").value+"?")) {

                console.log(ib);

                // using method splice to remove the object element in the array with the input booking number, and returns the new array
                // The 1 means that you are removing one element from the array
                bookings.splice(ib, 1);

                // storing the new updated booking array to localstorage
                localStorage.setItem('bookings', JSON.stringify(bookings));

                // alerting on succesfull delete
                new Booking().bookingAlertDelete();

                // refreshing the page so the user can see that the order has been deleted
                location.reload();
            }
        } else {
            alert("booking does not exist");
            return false;
        }
}
 //Function that allows user to view bookings.
function myBookings() {
    let i,
        bookings = JSON.parse(localStorage.getItem("bookings")),
        inputName =localStorage.getItem("current_user"),
        bookingArray = [];

    for(i = 0; i < bookings.length; i++) {
        console.log(bookings[i]);

        if (bookings[i].user == inputName) {
            console.log("found");
            bookingArray.push(bookings[i]);
        } else {
            console.log("not found")
        }
    }

    let row, cell, text, r, c,

        // properties under bookings, som for loop med var c henter værdier fra
        prop = ['bookingNumber','seatsChosen', 'date', 'time'],
        table = document.getElementById("myList1"),
        data = bookingArray;

    for (r = 0; r < data.length; r++) {

        // tr = table rows. Looper over bookingArray og laver rækker for hvert element i arrayet
        row = document.createElement('tr');

        //laver 4 celler
        for (c = 0; c < 4; c++) {

            //td =table data. Laver celler i tabel
            cell = document.createElement('td');

            //laver række for hvert element: data[r], og inden i rækken laves celler med de værdier der tilhører propertiesene i bookingArray [prop[c]].
            text = document.createTextNode(data[r][prop[c]]);

            //indsætter data i cellen
            cell.appendChild(text);

            //indsætter celler i rækker
            row.appendChild(cell);
        }

        //indsætter tabel i dokument
        table.appendChild(row);
    }
}

function myInformation() {
    let information =JSON.parse(localStorage.getItem("current_user")), //skiftes ud med identifier
        infoArray = [];

    infoArray.push(information[0]);

    let row, cell, text, r, c,
        //properties under user, som for loop med variabel c henter værdier fra
        prop = ['fullName', "email", "phone"],
        table = document.getElementById("myInformation"),
        data = infoArray;

    for (r = 0; r < data.length; r++) {

        // tr = table rows. Looper over bookingArray og laver rækker for hvert element i arrayet
        row = document.createElement('tr');

        //laver 3 celler
        for (c = 0; c < 3; c++) {

            //td =table data. Laver celler i tabel
            cell = document.createElement('td');

            //laver række for hvert element: data[r], og inden i rækken laves celler med de værdier der tilhører propertiesene i bookingArray [prop[c]].
            text = document.createTextNode(data[r][prop[c]]);

            //indsætter data i cellen
            cell.appendChild(text);

            //indsætter celler i rækker
            row.appendChild(cell);
            //table.appendChild(header);
        }

        //indsætter tabel i dokument
        table.appendChild(row);
    }
}

// samler functionerne i en, som bliver eksekveret når side loader
function displayInfo() {
    myInformation();
    myBookings();
}