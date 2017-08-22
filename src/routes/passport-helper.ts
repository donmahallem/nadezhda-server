import * as express from "express";
import * as passport from "passport";
import {
    Strategy as LocalStrategy
} from "passport-local";

const bearerRegex: RegExp = new RegExp("bearer [a-z0-9]{1,2048}", "i");

export const authenticate: express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.get("Authorization")) {
        if (bearerRegex.test(req.get("Authorization"))) {

        } else {
            next(new Error("no valid auth header"));
        }
    } else {
        next(new Error("no auth header"));
    }
};