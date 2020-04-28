//The following code contains all classes and functions allowing the admin to log in and view user booking and info.


//Class of admin user
class adminUser {
    // Attributes to admin class
    constructor (adminUsername, adminPassword) {
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }
}

//Creates Admin as a predefined user as an instance of the class adminUser
var adminBruger = new adminUser("admin", "1234");

//Uses Console.log which checks if admin is defined correctly
console.log("Admin username is: " + adminBruger.adminUsername + " with password: " + adminBruger.adminPassword);

//Function which is to store login information for the predefined admin user in localstorage
function storeLogin() {
    //Defines AdminArray as an empty array
    var adminArray = [];

    //Pushes user adminBruger to AdminArray
    adminArray.push(adminBruger);

    //Console logs the adminArray to check if the admin-user is pushed to array correctly
    console.log(adminArray);

//Stores admin array in local storage with key "AdminUsers" as a string using the .setItem() method
//Uses the .stringify() method to change the array to a string before storing
    localStorage.setItem("AdminUsers", JSON.stringify(adminArray));

}


//Function which is to check if Admin Login input is correct
function checkIfAdminLoginIsCorrect(adminInfo, adminUsername, adminPassword) {

    //Defines AdminInfo as a variable with the content of set key "AdminUsers" containing the admin users
    //Uses JSON.parse method to parse stored string and returns a JS object
    adminInfo = JSON.parse(localStorage.getItem("AdminUsers"));

    //Defines Username and Password as the input from HTML as a value
    adminUsername = document.getElementById("nameInput").value;
    adminPassword = document.getElementById("passwordInput").value;

    //If statement which checks if inputs for password and username is empty and alerts to user if so.
    if (adminUsername === "" || adminPassword === "") {
        alert("please fill out all forms");
        return false;
    }

    //As adminInfo acts as an array and we only have one user - we search for the item 0 in the array
    //Console.logs to check if the program is able to retrieve relevant information for following if statement
    console.log(adminInfo[0].adminUsername);
    console.log(adminInfo[0].adminPassword);

    // If statement which checks if user login input is the same as the predefined admin-user
    if (adminUsername === adminInfo[0].adminUsername && adminPassword === adminInfo[0].adminPassword) {
        alert("Username and password correct");
        window.location.replace("AdminPage.html");
        return false;
    }

    //Else statement which alerts that the user-input does not correspond to values for predefined user
    else(alert("wrong username or password"));
    return false;

}