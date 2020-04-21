window.onload = function() {
    const form = document.getElementById('profileForm');
    const name = document.getElementById('profileName');

    fetch ('/users/me')
        .then(response => response.json())
        .then(json => {
            form.action = `/users/${json.id}`;
            name.value = json.name;
        });
};