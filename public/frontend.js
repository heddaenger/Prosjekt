//shows users bookings and deletes them
async function bookingAdmin() {
    try{
        const table = document.getElementById("itemTable");

        const result = await fetch("http://localhost:3000/users/booking", {method:"GET", mode: 'no-cors'});
        const bInformation = await result.json();
        bInformation.forEach(t=>{

            const row = table.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            cell1.innerHTML = t.id;
            cell2.innerHTML = t.seatschosen;
            cell3.innerHTML = t.date;
            cell4.innerHTML = t.time;
            const button = document.createElement("button"); //creates the button
            cell5.appendChild(button);
            button.addEventListener("click", async e => { //adds the event that on click: deletes from side
                const jsonRequest = {};
                jsonRequest.id = t.id;
                const result = await fetch("http://localhost:3000/users/booking", {method: "DELETE",
                    headers: {"content-type": "application/json"}, body: JSON.stringify(jsonRequest)});
                const success = await result.json();
                await bookingAdmin();
                location.reload();
            });
        })
    }
    catch (e) {
        console.log(`Error reading the bookings.${e}`)
    }
}

//shows the info about the user logged in.
async function manageUser() {
    const myDiv = document.getElementById("myInformation");

    const result = await fetch("http://localhost:3000/users/me", {method: "GET", mode: 'no-cors'});
    const uInformation = await result.json();

    myDiv.innerHTML =
        "<h2>Your Information: </h2>" +
        "<b>Your Name:</b> " + uInformation.fullname +
        "<br> <b>Your Phone: </b>" + uInformation.phone +
        "<br> <b> Your email: </b>" + uInformation.email;
}


//does the same as bookingAdmin, only for admins.
async function manageAllBookings() {
    try{
        const allBookings = document.getElementById("allBookings");
        const result = await fetch("http://localhost:3000/users/allBookings", {method:"GET"});
        const aBInformation = await result.json();
        aBInformation.forEach(t=>{

            const row = allBookings.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            cell1.innerHTML = t.id;
            cell2.innerHTML = t.seatschosen;
            cell3.innerHTML = t.date;
            cell4.innerHTML = t.time;
            const button = document.createElement("button");
            cell5.appendChild(button);
            button.addEventListener("click", async e => {
                const jsonRequest = {};
                jsonRequest.id = t.id;
                const result = await fetch("http://localhost:3000/users/booking", {method: "DELETE",
                    headers: {"content-type": "application/json"}, body: JSON.stringify(jsonRequest)});
                await manageAllBookings();
                location.reload();
            });
        })
    }
    catch (e) {
        console.log(`Error reading the bookings.${e}`)
    }
}


//shows and deletes users for admin.
async function manageAllUsers() {
    try{
        const allUsers = document.getElementById("allUsers");
        const result = await fetch("http://localhost:3000/users/", {method:"GET", mode: 'no-cors'});
        const aUInformation = await result.json();

        aUInformation.forEach(t => {
            const row = allUsers.insertRow(-1);
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);
            cell1.innerHTML = t.id;
            cell2.innerHTML = t.fullname;
            cell3.innerHTML = t.email;
            cell4.innerHTML = t.phone;
            cell5.innerHTML = t.usertype;
            const button = document.createElement("button");
            cell6.appendChild(button);
            button.addEventListener("click", async e => {
                const jsonRequest = {};
                jsonRequest.id = t.id;
                const result = await fetch("http://localhost:3000/users/", {
                    method: "DELETE",
                    headers: {"content-type": "application/json"}, body: JSON.stringify(jsonRequest)
                });
                await manageAllUsers();
                location.reload();
            });
        })
}
catch (e){
    console.log(`Error reading the users.${e}`)
    }
}

//posts to the endpoint logout.
async function logout() {
    await fetch('http://localhost:3000/users/logout', { method: 'POST', credentials: 'same-origin' })
}

//exports all the functions to the HTML.
module.exports.bookingAdmin = bookingAdmin;
module.exports.manageUser = manageUser;
module.exports.manageAllBookings = manageAllBookings;
module.exports.manageAllUsers = manageAllUsers;
module.exports.logout = logout;