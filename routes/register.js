module.exports = function(request, response){
        const fullName = request.body.fullName;
        const email = request.body.email;
        const password = request.body.password;
        const phone = request.body.phone;
        console.log(fullName, email, password, phone);
    }
}