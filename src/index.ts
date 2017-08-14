import { PiholeApp } from "./app";

import { UserDatabase } from "./database/user-database";
import { NadezhdaConfig } from "./config";

/*

let db = new UserDatabase();
db.initDatabase().then(res => {

    db.createUser("username", "longpassword")
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err);
        })
});*/

/*
db.createUser("user", "password")
    .then(res => {
        console.log("success", res);
    })
    .catch(err => {
        console.error(err);
    })*/

let app: PiholeApp = new PiholeApp(NadezhdaConfig.port);

app.start();