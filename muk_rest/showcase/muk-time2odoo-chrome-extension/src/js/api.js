'use strict';

const redirectUri = chrome.identity.getRedirectURL('provider_cb');
const codeRegExp = new RegExp('code=(.+?(?=$|&))');
const stateCode = Math.floor(Math.random() * 1000);

let apiUrl = '';
let clientId = '';
let clientSecret = '';

let accessToken = '';
let refreshToken = '';

let userId = null;
let userName = '';
let userLogin = '';
let userEmail = '';

let taskId = null;
let taskProjectId = null;
let taskDescription = '';
let taskStartDatetime = '';
let taskStopDatetime = '';

// Odoo MuK API calls

function saveTimesheetEntry(callback) {
    let amount = Math.abs(new Date(taskStopDatetime) - new Date(taskStartDatetime)) / 36e5;
    xhrRequest('POST', '/api/create/account.analytic.line', [
        ['values', JSON.stringify({
            'project_id': taskProjectId,
            'task_id': taskId,
            'name': taskDescription,
            'unit_amount': amount,
        })],
    ], function (response) {
        if (callback) {
            callback(response);
        }
    });
}

function getLastTimesheetEntry(projectId, taskId, callback) {
    return getLastTimesheetEntries(projectId, taskId, 1, callback);
}

function getLastTimesheetEntries(projectId, taskId, limit, callback) {
    let domain = [['employee_id.user_id', '=', userId]];
    if (projectId) {
        domain.push(['project_id', '=', projectId])
    }
    if (taskId) {
        domain.push(['task_id', '=', taskId])
    }
    xhrRequest('GET', '/api/search_read/account.analytic.line', [
        ['domain', JSON.stringify(domain)],
        ['fields', JSON.stringify(['id', 'name'])],
        ['limit', limit],
        ['orderby', 'date desc']
    ], function (response) {
        if (callback) {
            callback(response);
        }
    });
}

function getTasks(projectId, callback) {
    xhrRequest('GET', '/api/search_read/project.task', [
        ['domain', JSON.stringify([
            ['project_id', '=', projectId],
            ['stage_id.fold', '=', false],
        ])],
        ['fields', JSON.stringify(['id', 'name'])],
        ['limit', 0],
    ], function (response) {
        if (callback) {
            callback(response);
        }
    });
}

function getProjects(callback) {
    xhrRequest('GET', '/api/search_read/project.project', [
        ['fields', JSON.stringify(['id', 'name'])],
        ['limit', 0],
    ], function (response) {
        if (callback) {
            callback(response);
        }
    });
}

function getUserinfo(callback) {
    xhrRequest('GET', '/api/userinfo', [], function (response) {
        userId = response.sub;
        userName = response.name;
        userLogin = response.username;
        userEmail = response.email;
        writeStorage();
        if (callback) {
            callback(response);
        }
    });
}

// XHR requests

function xhrRequest(method, route, args, callback, isRetry) {
    let url = apiUrl + route;
    if (args && args.length) {
        let arg = args.pop();
        url += '?' + arg[0] + '=' + arg[1];
    }
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        url += '&' + arg[0] + '=' + arg[1];
    }
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = callback;
    xhr.onload = function () {
        if (this.status === 200) {
            callback(JSON.parse(this.responseText));
        } else if(this.status === 401 && !isRetry){
            retrieveToken('refresh_token', refreshToken, function () {
                xhrRequest(method, route, args, callback, true);
            });
        } else if(this.status === 401 && isRetry){
            console.log('Access Denied! Please try to log in through the options of your MuK Time2Odoo browser extension.')
        }
    }
    xhr.send();
}

// Authorization

function authorize(callback){
    const authorizeUrl = apiUrl + '/api/authentication/oauth2/authorize?'
        + 'client_id=' + clientId
        + '&redirect_uri=' + encodeURIComponent(redirectUri)
        + '&response_type=code'
        + '&scope=all'
        + '&state=' + stateCode;
    chrome.identity.launchWebAuthFlow({
        interactive: true,
        url: authorizeUrl
    }, function (response) {
        let code = response.match(codeRegExp)[1];
        retrieveToken('authorization_code', code, function () {
            callback();
        });
    });
}

function retrieveToken(grantType, token, callback) {
    let tokenUrl = apiUrl + '/api/authentication/oauth2/token?'
        + 'client_id=' + clientId
        + '&client_secret=' + clientSecret
        + '&state=' + stateCode
        + '&redirect_uri=' + encodeURIComponent(redirectUri)
        + '&grant_type=' + grantType;
    if(grantType === 'authorization_code'){
        tokenUrl += '&code=' + token;
    } else {
        tokenUrl += '&refresh_token=' + token;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', tokenUrl);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
        let response = JSON.parse(this.responseText);
        accessToken = response.access_token;
        refreshToken = response.refresh_token;
        writeStorage();
        callback();
    };
    xhr.send();
}

// CRUD

function readStorage(callback) {
    chrome.storage.sync.get({
        apiUrl: '',
        clientId: '',
        clientSecret: '',
        accessToken: null,
        refreshToken: null,
        userId: null,
        userName: '',
        userLogin: '',
        userEmail: '',
        taskId: null,
        taskProjectId: null,
        taskDescription: '',
        taskStartDatetime: '',
        taskStopDatetime: '',
    }, function (data) {
        apiUrl = data.apiUrl;
        clientId = data.clientId;
        clientSecret = data.clientSecret;
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;
        userId = data.userId;
        userName = data.userName;
        userLogin = data.userLogin;
        userEmail = data.userEmail;
        taskId = data.taskId;
        taskProjectId = data.taskProjectId;
        taskDescription = data.taskDescription;
        taskStartDatetime = data.taskStartDatetime;
        taskStopDatetime = data.taskStopDatetime;
        if (callback) {
            callback();
        }
    });
}

function writeStorage() {
    chrome.storage.sync.set({
        apiUrl: apiUrl,
        clientId: clientId,
        clientSecret: clientSecret,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId,
        userName: userName,
        userLogin: userLogin,
        userEmail: userEmail,
        taskId: taskId,
        taskProjectId: taskProjectId,
        taskDescription: taskDescription,
        taskStartDatetime: taskStartDatetime,
        taskStopDatetime: taskStopDatetime,
    });
}
