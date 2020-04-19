window.onload = function() {
    const form = document.getElementById('profileform');
    const name = document.getElementById('profilename');

    fetch ('/users/me')
        .then(response => response.json())
        .then(json => {
            form.action = `/users/${json.id}`;
            name.value = json.name;
        });
};