//The following code contains all classes and functions allowing the customer to create and store a new user and login

//Defining a class with a constructor holding attributes that make up an object of the class
class User {
    constructor(fullName, email, password, phone) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }
}


function createAUser(){
    const user = new User (this.fullName, this.email, this.password, this.phone);
    fetch('http://localhost:3050/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user).then(r => r)
    }).then(response => response.json())

        .then(json => {
            if (!json.ok){
                console.log(json);
                alert(json);
            } else if (json.ok === true){
                console.log(json.ok);
                window.location = 'http://localhost:3050/loginPage.html';
            }
        })}


        const result = await fetch("http://localhost:3050/registration", {method:"POST",
        headers: {"content-type" : "application/json"}, body: JSON.stringify(json)})
    const success = await result.json()
    alert("created!")
});

//const btnCreate = document.getElementById("btnCreate");
//btnCreate.addEventListener("click", async e=> {

//Adding method to class that creates alert when called for an object
  createAlert() {
        return "Hi " + document.getElementById("fullName").value + " you have been registered";
    }

}

//The following function is meant to instatiate a new object of class and stores that object to localstorage.
function addUserInfo () {

    //Defines multiple variables to use in function
    var requirementsPassword, password, requirementsEmail, email, requirementsPhone, phone, info;

       //Instantiates a new object of the type user and fetches object values from the html input
        info = new user(document.getElementById("fullName").value, document.getElementById("email").value,
        document.getElementById("password").value, document.getElementById("phoneNumber").value);

        //function that stores the userinfo into an array in localstorage
    function storeLogin (values) {

        //Defining a binding. Getting the key info from localstorage and uses JSON.parse method to get as object instead of a string
        values = JSON.parse(localStorage.getItem("info"));

        //If statement that checks if LocalStorage item bookings does not exist and reassigns values to an empty array.
        //in this way we prevents javascript from overwriting data in our array in localstorage by only making a new array if userbookings does not exist
        //consequently we are utilizing our existing values array to store several objects
        if (values === null) {
            values = [];
        }
        //Pushes values of localstorage item bookings into empty array
        values.push(info);
        //stores values of values of array to local storage and sets assigns key "info" to the array
        localStorage.setItem("info", JSON.stringify(values));
    }

    //Binds variables to html-input
    password = document.getElementById("password");
    email = document.getElementById("email");
    phone = document.getElementById("phoneNumber");

    //Regular expressions are patterns used to match character combinations in strings
    //Defining regular expressions. If the user password does not match these expressions, it returns null
    requirementsPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)^(?!@)[a-zA-Z\d]{8,}$/;
    requirementsEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    requirementsPhone =/\d{8}/;

    //defining if statements to check for empty or if input values match requirements
    //using the HTML DOM style object with property border to style input border as the color red if input values does not match requirements.

        if(document.getElementById("fullName").value !== "") {
            document.getElementById("fullName").style.border = "none";
            document.getElementById("fullNameValidation").innerHTML = "";
        } else {
            document.getElementById("fullName").style.border = "1px solid red";

            //Using the HMTL DOM property innerHTML to append text within quotation marks to HTML element if if statement evaluates to false
            document.getElementById("fullNameValidation").innerHTML="Please fill out";
        }

        //using the inbuilt method element.match to check if the password contains the specified requirements.
        if(password.value.match(requirementsPassword)) {
            document.getElementById("password").style.border = "none";
            document.getElementById("passwordValidation").innerHTML = "";
        } else {
            document.getElementById("password").style.border = "1px solid red";
            document.getElementById("passwordValidation").innerHTML="Password must contain at least eight characters, " +
                "one uppercase letter, one lowercase letter and one number";
        }

            if(email.value.match(requirementsEmail))
            {
                document.getElementById("email").style.border = "none";
                document.getElementById("emailValidation").innerHTML="";


            } else {
                document.getElementById("email").style.border = "1px solid red";
                document.getElementById("emailValidation").innerHTML="Please enter valid email";
            }

            if(phone.value.match(requirementsPhone))
            {
                document.getElementById("phoneValidation").innerHTML ="";
                document.getElementById("phoneNumber").style.border = "none";
            } else {
                document.getElementById("phoneValidation").innerHTML ="Please enter valid phone number";
                document.getElementById("phoneNumber").style.border = "1px solid red";
            }

//returns false on submit if any of the user inputs dont match the specified requirements.
//Prevents users to get access to the system in case of login fail
    if(password.value.match(requirementsPassword) === null || email.value.match(requirementsEmail) === null || phone.value.match(requirementsPhone) === null)
    {
        return false;
    }

    //returns false on submit if any of the user inputs is empty.
if (info.email ==""|| info.password =="" || info.phone =="" || info.fullName =="")
{
    return false;
}

//Creates a new user if localstorage is empty. If no user has been created there is no chance for duplicates
    if (localStorage.length === 0) {
        storeLogin();

        //calling class method and alerting it
        alert(new user().createAlert());

        //using window object with location property and replace method to redirect user to html page
        //the user should not be able return to login page when successfully logged in, that's why we use replace method.
        window.location.replace("loginPage.html");

        //return false statement prevents form from submitting without waiting for response of function
        return false;
    }

    //using else if statement to specify a new condition to test if the first condition is false.
        //using indexOf method to test if input email already is present in user array in localstorage
    else if (localStorage.getItem("info").indexOf(document.getElementById("email").value) === -1) {
            storeLogin();

            //calling user class method and alerting it
            alert(new user().createAlert());
            window.location.replace("loginPage.html");
            return false;

        } else {
            alert("ERROR: email already being used");
            return false;
        }
}


//function that checks if email and password is correct on login
function checkIfLoginIsCorrect1(userArray, username, password) {

    //getting values from HTML
        userArray = JSON.parse(localStorage.getItem("info"));
        username = document.getElementById("enteredName").value;
        password = document.getElementById("enteredPassword").value;

        //Following if statements checks if localstorage is empty
    if (localStorage.length === 0) {
        alert("User not registered");
        return false;
    }

    //checking for empty input fields
    if (username == "" || password == "") {
        alert("please fill out all forms");
        return false;
    }

//using for loop to iterate through userArray and console logs array properties "email" and "password" to see if we get the correct values
    for (var i = 0; i < userArray.length; i++) {
        console.log(userArray[i].email);
        console.log(userArray[i].password);

        //using if statement to check if user input and password input matches values in localstorage array
        //using variable "i" as an index to access the array properties "email" and "password"
        if (username == userArray[i].email && password == userArray[i].password) {
            console.log("email and password correct");
            currentUser();
            window.location.replace("Index.html");
            return false;
        }
    }
    alert("wrong email or password");
    return false;
}

//Function that is able to log out user from system
//using confirm method to return either true or false depending on user input in the event of log out button clicked
function logout() {
    if(confirm("Are you sure you want to log out?")) {
        sessionStorage.removeItem("loggedIn");
        localStorage.removeItem("current_user");
        window.location.replace("loginPage.html");
        return false;
    }
}

//function that creates an array in localstorage that stores the user property of our userArray as an object in localstorage
function currentUser () {
    let index, inputName, currentUserArray,
        info = JSON.parse(localStorage.getItem("info"));
    inputName = document.getElementById("enteredName").value;
    //defining empty array to push user information to
    currentUserArray = [];

    //The findIndex() method executes the function once for each element present in the array
    // it's the same as: info.findIndex(function(x) { return x.email == "inputName" }). the "=>" defines a new function wth the parameter "X"
    //If it finds an array element where the function returns a true value
    // findIndex() returns the index of that array element (and does not check the remaining values);
    //we only need to find that one user in localstorage that logs in, that's why dont need a for loop to iterate through all values
    index = info.findIndex(x => x.email === inputName);
    console.log(info[index]);

    //using the method push to push values of true index to array
    currentUserArray.push(info[index]);

    //Stores current user in localstorage
    localStorage.setItem("current_user", JSON.stringify(currentUserArray));


    //sets key loggedIn with the value true, so inline script in html can check if logged in
    //using sessionstorage in stead of localstorage to automatically remove loggedIn if browser tab is closed
    sessionStorage.setItem("loggedIn", "true");
}





