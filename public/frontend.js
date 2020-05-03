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
            const button = document.createElement("button");
            cell5.appendChild(button);
            button.addEventListener("click", async e => {
                const jsonRequest = {};
                jsonRequest.id = t.id;
                const result = await fetch("http://localhost:3000/users/booking", {method: "DELETE",
                    headers: {"content-type": "application/json"}, body: JSON.stringify(jsonRequest)});
                const success = await result.json();
                await bookingAdmin();
                console.log("reloading");
                location.reload();
            });
        })
    }
    catch (e) {
        console.log(`Error reading the bookings.${e}`)
    }
}


async function showUser(){
    const myDiv = document.getElementById("myInformation");

    const result = await fetch("http://localhost:3000/users/me", {method:"GET", mode: 'no-cors'});
    const uInformation = await result.json();

    myDiv.innerHTML =
        "<h2>Your Information: </h2>" +
        "<b>Your Name: </b> " + uInformation.fullname +
        "<br> <b>Your Phone: </b>" + uInformation.phone +
        "<br> <b> Your email: </b>" + uInformation.email;
    }



async function manageAllBookings() {
    try{
        const allBookings = document.getElementById("allBookings");

        const result = await fetch("http://localhost:3000/users/allBookings", {method:"GET", mode: 'no-cors'});
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
                const result = await fetch("http://localhost:3000/users/allBookings", {method: "DELETE",
                    headers: {"content-type": "application/json"}, body: JSON.stringify(jsonRequest)});
                const success = await result.json();
                await manageAllBookings();
                console.log("reloading");
                location.reload();
            });
        })
    }
    catch (e) {
        console.log(`Error reading the bookings.${e}`)
    }
}



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
            cell1.innerHTML = t.id;
            cell2.innerHTML = t.fullname;
            cell3.innerHTML = t.email;
            cell4.innerHTML = t.phone;
            const button = document.createElement("button");
            cell5.appendChild(button);
            button.addEventListener("click", async e => {
                const jsonRequest = {};
                jsonRequest.id = t.id;
                const result = await fetch("http://localhost:3000/users/", {
                    method: "DELETE",
                    headers: {"content-type": "application/json"}, body: JSON.stringify(jsonRequest)
                });
                const success = await result.json();
                await manageAllUsers();
                location.reload();
            });
        })
}
catch (e){
    console.log(`Error reading the users.${e}`)
    }
}

//module.exports - liten forklaring
module.exports.showUser = showUser;
module.exports.bookingAdmin = bookingAdmin;
module.exports.manageAllBookings = manageAllBookings;
module.exports.manageAllUsers = manageAllUsers;