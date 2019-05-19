"use strict";

const usernamePattern = /^([A-Za-z0-9_]){3,16}$/g;

const headerIcons = Object.freeze({
    "user": 1,
    "clock": 2,
    "ok": 3,
    "cancel": 4
});

const sections = Object.freeze({
    "query": 1,
    "loading": 2,
    "result": 3,
    "error": 4
});

function initialization() {

}

function switchHeader(icon) {
    let headerIcon = mainHeader.querySelector("div.icon > i");

    switch (icon) {
        case headerIcons.user:
            headerIcon.className = "icon-user";
            break;
        case headerIcons.clock:
            headerIcon.className = "icon-clock";
            break;
        case headerIcons.ok:
            headerIcon.className = "icon-ok";
            break;
        case headerIcons.cancel:
            headerIcon.className = "icon-cancel";
            break;
    }
}

function isUsernameValid(username) {
    return usernamePattern.test(username);
}

function switchSection(section) {
    mainApp.querySelector("section.main-section:not([hidden])").setAttribute("hidden", "");

    switch (section) {
        case sections.query:
            sectionQuery.removeAttribute("hidden");
            switchHeader(headerIcons.user);
            break;
        case sections.loading:
            sectionLoading.removeAttribute("hidden");
            switchHeader(headerIcons.clock);
            break;
        case sections.result:
            sectionResult.removeAttribute("hidden");
            switchHeader(headerIcons.ok);
            break;
        case sections.error:
            sectionError.removeAttribute("hidden");
            switchHeader(headerIcons.cancel);
            break;
    }
}
