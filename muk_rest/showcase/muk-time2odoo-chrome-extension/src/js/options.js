'use strict';

const apiUrlInput = document.getElementById('apiUrl');
const clientIdInput = document.getElementById('clientId');
const clientSecretInput = document.getElementById('ClientSecret');
const accessTokenInput = document.getElementById('accessToken');
const refreshTokenInput = document.getElementById('refreshToken');
const userIdInput = document.getElementById('userId');
const userNameInput = document.getElementById('userName');
const userLoginInput = document.getElementById('userLogin');
const userEmailInput = document.getElementById('userEmail');
const loginButton = document.getElementById('login');
const refreshButton = document.getElementById('refresh');

// Listeners

loginButton.addEventListener('click', function() {
    apiUrl = apiUrlInput.value;
    clientId = clientIdInput.value;
    clientSecret = clientSecretInput.value;
    writeStorage();
    authorize(function(){
        getUserinfo(render);
    })
});

refreshButton.addEventListener('click', function () {
    retrieveToken('refresh_token', refreshToken, function () {
        getUserinfo(render);
    });
});

// Render

function render() {
    apiUrlInput.value = apiUrl;
    clientIdInput.value = clientId;
    clientSecretInput.value = clientSecret;
    accessTokenInput.value = accessToken;
    refreshTokenInput.value = refreshToken;
    userIdInput.value = userId;
    userNameInput.value = userName;
    userLoginInput.value = userLogin;
    userEmailInput.value = userEmail;
}

// Start

readStorage(render);
