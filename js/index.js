"use strict";

let mainApp = document.body.querySelector("main#app");
let mainHeader = mainApp.querySelector("header#main");
let sectionQuery = mainApp.querySelector("section#query");
let sectionLoading = mainApp.querySelector("section#loading");
let sectionResult = mainApp.querySelector("section#result");
let sectionError = mainApp.querySelector("section#error");

function queryValidation() {
    let queryForm = sectionQuery.querySelector("form#query");
    let username = queryForm.querySelector("input#username");
    let message = queryForm.querySelector("p#message");

    if (!username.validity.valid) {
        username.classList.add("invalid");
        message.textContent = "";
        message.classList.remove("hidden");

        if (username.validity.valueMissing) {
            message.textContent = "Please insert a username.";
        } else if ((username.validity.tooShort) || (username.validity.tooLong)) {
            message.textContent = "The length must between 3 to 16 character long.";
        } else if (username.validity.patternMismatch) {
            message.textContent = "The username has one or more invalid characters.";
        } else {
            message.textContent = "Unknown error.";
        }
        
        username.focus();
        username.select();    
        return false;
    } else {
        username.classList.remove("invalid");
        message.textContent = "";
        message.classList.add("hidden");

        return true;
    }
}

function querySubmit() {
    let queryForm = sectionQuery.querySelector("form#query");
    let username = queryForm.querySelector("input#username");

    if (queryValidation()) {
        switchSection(sections.loading);

        getUserInfo(username.value).then(function(userInfo) {
            let resultForm = sectionResult.querySelector("form#result");
            let uuidResult = resultForm.querySelector("input#uuid");            
            uuidResult.value = userInfo.id;

            switchSection(sections.result);
            if (uuidResult.value == "069a79f444e94726a5befca90e38aaf5") {
                let headerIcon = mainHeader.querySelector("div.icon > i");
                headerIcon.className = "notch-apple";
            }
            uuidResult.focus();
        }).catch(function(error) {
            let errorForm = sectionError.querySelector("form#error");
            let errorInfo = errorForm.querySelector("p#error");            
            errorInfo.textContent = error;

            switchSection(sections.error);
        });
    }
}

function returnHome() {
    let queryForm = sectionQuery.querySelector("form#query");
    let username = queryForm.querySelector("input#username");
    switchSection(sections.query);

    username.focus();
    username.select();
}

window.addEventListener("DOMContentLoaded", function(event) {
    let queryForm = sectionQuery.querySelector("form#query");
    queryForm.querySelector("input#username").value = "";
    queryForm.addEventListener("submit", function(event) {
        if (!queryValidation()) {
            event.preventDefault();
        }
    }, false);

    let resultForm = sectionResult.querySelector("form#result");
    let uuidResult = resultForm.querySelector("input#uuid");
    uuidResult.value = "";
    uuidResult.addEventListener("click", function(event) {
        uuidResult.focus();
        uuidResult.select();
    });
    let copyButton = resultForm.querySelector("button#copy");
    let clipboard = new ClipboardJS("form#result button#copy");
    clipboard.on("success", function(event) {
        copyButton.innerHTML = "COPIED!";
        copyButton.classList.add("success");
        event.clearSelection();
        setTimeout(function() {
            copyButton.innerHTML = "COPY";
            copyButton.classList.remove("success");
        }, 5000);
    });
    clipboard.on('error', function(event) {
        uuidResult.focus();
        uuidResult.select();
    });
}, false);