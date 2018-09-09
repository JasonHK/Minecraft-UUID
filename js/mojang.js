"use strict";

function getUserInfo(username) {
    const baseUrl = "https://cors-anywhere.herokuapp.com/https://api.mojang.com/users/profiles/minecraft/";
    let requestUrl = baseUrl + username;

    var request = new Request(requestUrl, {
        method: 'GET',
        mode: 'cors'
    });

    return new Promise(function(resolve, reject) {
        fetch(request).then(function(response) {
            if (response.ok) {
                return response.text();
            }
        }).then(function(data) {
            let json = data.length ? JSON.parse(data) : {};
            if (json.id == undefined) {
                reject(new Error("Username not exist."));
            } else {
                resolve(json);
            }            
        }).catch(function(error) {
            reject(error);
        });
    });
} 
