'use strict';

const projectSelection = document.getElementById('project');
const taskSelection = document.getElementById('task');
const descriptionInput = document.getElementById('description');
const durationInput = document.getElementById('duration');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

// Listeners

projectSelection.addEventListener('change', function () {
    taskProjectId = parseInt(projectSelection.value);
    taskId = null;
    taskDescription = '';
    writeStorage();
    _getTaskSelectionOptions();
});

taskSelection.addEventListener('change', function () {
    taskId = parseInt(taskSelection.value);
    taskDescription = '';
    writeStorage();
    _getDescriptionSuggestion();
});

startButton.addEventListener('click', function () {
    let startDatetime = new Date();
    taskDescription = descriptionInput.value;
    taskStartDatetime = startDatetime.toJSON();
    taskStopDatetime = null;
    writeStorage();
    render();
    setTimerUI();
});

stopButton.addEventListener('click', function () {
    let stopDatetime = new Date();
    taskDescription = descriptionInput.value;
    taskStopDatetime = stopDatetime.toJSON();
    writeStorage();
    saveTimesheetEntry(render);
    setTimerUI();
});

// Render

function render() {
    descriptionInput.value = taskDescription;
    projectSelection.value = taskProjectId;
    taskSelection.value = taskId;
    if (taskStopDatetime || !taskStartDatetime) {
        startButton.setAttribute('style', '');
        stopButton.setAttribute('style', 'display: none');
    } else {
        startButton.setAttribute('style', 'display: none');
        stopButton.setAttribute('style', '');
    }
}

// Helper

function _getProjectSelectionOptions() {
    getProjects(function (projects) {
        projectSelection.innerHTML = '';
        projects.forEach(function (project) {
            let option = document.createElement('option');
            option.appendChild(document.createTextNode(project.name));
            option.value = project.id;
            projectSelection.appendChild(option);
        });
        if (!taskProjectId) {
            taskProjectId = parseInt(projectSelection.value);
        }
        _getTaskSelectionOptions();
    });
}

function _getTaskSelectionOptions() {
    getTasks(taskProjectId, function (tasks) {
        taskSelection.innerHTML = '';
        tasks.forEach(function (task) {
            let option = document.createElement('option');
            option.appendChild(document.createTextNode(task.name));
            option.value = task.id;
            taskSelection.appendChild(option);
        });
        if (!taskId) {
            taskId = parseInt(taskSelection.value);
        }
        render();
        _getDescriptionSuggestion();
    });
}

function _getDescriptionSuggestion() {
    getLastTimesheetEntry(taskProjectId, taskId, function (entry) {
        if (entry) {
            taskDescription = entry[0].name;
            render();
        }
    });
}

// Clock

function setTimerUI(){
    let now = null;
    if (taskStopDatetime) {
        now = new Date(taskStopDatetime);
    } else {
        now = new Date();
    }

    let minutes = Math.floor(Math.abs(now - new Date(taskStartDatetime)) / 6e4);
    let hours = Math.floor(Math.abs(now - new Date(taskStartDatetime)) / 36e5);

    if(!minutes){
        minutes = 0;
    }
    if(!hours){
        hours = 0;
    }

    minutes -= hours * 60;

    durationInput.value = String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0');
}

function timer() {
    setTimerUI();
    setTimeout(timer, 10 * 1000);
}

// Start

readStorage(function () {
    if (taskStopDatetime || !taskStartDatetime) {
        startButton.setAttribute('style', '');
        stopButton.setAttribute('style', 'display: none');
    } else {
        startButton.setAttribute('style', 'display: none');
        stopButton.setAttribute('style', '');
    }
    _getProjectSelectionOptions();
    timer();
});
