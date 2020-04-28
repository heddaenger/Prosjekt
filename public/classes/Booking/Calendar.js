//Following code creates a date picker for the booking page

//getting elements from html by using query selector
const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');
const mth_element = document.querySelector('.date-picker .dates .month .mth');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');
const body = document.querySelector('body');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Instantiates a new Date() method to get todays date
let date = new Date();

// returns todays date
let day = date.getDate();

//returns current month as a number
let month = date.getMonth();
let year = date.getFullYear();

// we need two dates to compare, so we are defining new selected dates variables
let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

// using get month method as index to get our month in letters in the month array
// displaying month and year in our month selector
mth_element.textContent = months[month] + ' ' + year;

selected_date_element.textContent = formatDate(date);
selected_date_element.dataset.value = selectedDate;

populateDates();

// Adding the method event listener to our variables. When you click on the variable, which we defined as a HTML element
// the function added to the event listener gets called
date_picker_element.addEventListener('click', toggleDatePicker);

//When clicking on the element within the variables defined query selectors a function gets called
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);


// creating a function to toggle and display the calendar
function toggleDatePicker (e) {

    // Prevents calendar from closing display when toggling months,
    // When picking a date the calendar will close
    // prevents the function from executing if our month selector is present in our path
    // if our function is not true (path doesnt contain our month selector) then our if
    // statement will initialize our CSS class named 'active' which will
    //display our calendar days and months
    if (!checkEventPathForClass(e.path, 'month')) {
        dates_element.classList.toggle('active');
        console.log(e.path);
    }
}

// HELPER FUNCTIONS
/* checks for event path. So where we click, gives us an event pass, this functions gets the
path of where clicked
 if we click on an event inside the datepicker, it will tell us the whole path of what the parents are of every
 every single file from the element you clicked
 we basically loop trough every single item in that path and we check that the class list exists*/
function checkEventPathForClass (path, selector) {

    //the path is going to be an array of elements
    for (let i = 0; i < path.length; i++) {
        //console.log(path);
        // returns a live DOMTokenList collection of the class attributes of our path
        //console.log(path[i].classList);
        //console.log(path[i].classList.contains(selector));

        //checks the path if classlist exists and if it contains a selector
        if (path[i].classList && path[i].classList.contains(selector)) {
            return true;
        }
    }

    return false;
}


// Function to increase month by 1 each time next month arrow is being clicked
function goToNextMonth () {
    // Month is set to increase by one
    month++;
    // If month is bigger than 11, month = 0 (january) and year increases by 1
    if (month > 11) {
        month = 0;
        year++;
    }
    // using get month  method ([month]) as index to get our month in letters in the month array
// displaying month and year in our month selector
    mth_element.textContent = months[month] + ' ' + year;

    // updating calendar each time we go to next or previous month
    populateDates();
}

// Same concept as next month function, it now decreases
function goToPrevMonth () {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    mth_element.textContent = months[month] + ' ' + year;
    // updating calendar each time we go to next or previous month
    populateDates();
}

// populating all the days in the dates array to the calendar
function populateDates () {
    // every time we run the calendar we dont want to add the previous month's days to the next mont
    days_element.innerHTML = '';
    let amount_days = 31;

// using switch to alter the amount of days depending on each month
    switch (month) {
        case 1:
            amount_days = 28;
            break;
        case 3:
        case 5:
        case 8:
        case 10:
            amount_days = 30;
            break;
    }


// prevents user to pick a date in the past
    days_element.addEventListener('click', () => {
        let todaysDate = new Date();
        let todaysMonth = todaysDate.getMonth();
        let pickedDate = document.getElementById("datestring").innerHTML;

        // wraps code in try block to test if input is wrong
        if (month === todaysMonth) {
            try {
                if (selectedDay < day) throw (pickedDate + " is a date in the past");
            }
            // handles error
            catch (error) {
                alert("Something went wrong: " + error);
                selectedDay = day;
                location.reload();

            }
        }});

    // for loop to create and update values in date picker
    for (let i = 0; i < amount_days; i++) {
        // creating div for each day in month
        const day_element = document.createElement('div');
        //creating a class named 'day' for each day inside our div
        day_element.classList.add('day');
        // adding 1 to each day so we go 1-31 instead of 0-30
        day_element.textContent = i + 1;

// if statement that marks the current day with green (from style.css).
// selectedDay = getDate, so it is always going mark the current day
        if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
            day_element.classList.add('selected');
        }


        // Using an event listener with a function. So if we select a day, the event listener is going to mark it
        // up and change the date
        day_element.addEventListener('click', function () {

           // we are updating all these values
            selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
            selectedDay = (i + 1);
            selectedMonth = month;
            selectedYear = year;

            selected_date_element.textContent = formatDate(selectedDate);
            // enables us to easily get the value from the selected date
            selected_date_element.dataset.value = selectedDate;

            populateDates();
        });

// using method append child to insert values to calendar
        days_element.appendChild(day_element);
    }
}

// function to determine which date we are in depending on what what value gets passed through (d).
function formatDate (d) {
    let day = d.getDate();

    // Adding 0 to dates up to 9. (01, 02, 03 etc:)
    if (day < 10) {
        day = '0' + day;
    }
// adding 1 to month so its not 0-11 but 1-12
    let month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }

    let year = d.getFullYear();

    // Returns date formatted with forward slashes
    return day + ' / ' + month + ' / ' + year;

}

//https://www.youtube.com/watch?v=wY2dao1hJms&t=1962s

