import * as express from "express";
import { RouteError } from "./route-error";
import { UserRequest } from "./../helper/user-request";
import { Permissions } from "./permissions.model";


export class PermissionMiddleware {

    public static createAnd(scopes: number): express.RequestHandler {
        return (req: UserRequest, res: express.Response, next: express.NextFunction) => {
            if (req.user.scopes) {
                if ((req.user.scopes & scopes) == scopes) {
                    next();
                }
            }
            next(new RouteError(401, "Not authorized"));
        };
    }

    public static createOr(scopes: number): express.RequestHandler {
        return (req: UserRequest, res: express.Response, next: express.NextFunction) => {
            if (req.user.scopes) {
                if ((req.user.scopes & scopes) > 0) {
                    next();
                }
            }
            next(new RouteError(401, "Not authorized"));
        };
    }

    /**
     * Verifies the provided cookie
     * @alias express.verifyAuthCookie
     * @method express.verifyAuthCookie
     * @memberof module:helper.express
     * @param {Object} req - express request object
     * @param {Object} res - express response object
     * @param {Function} next - next callback
     * @static
     */
    public static verifyAuthCookie: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.signedCookies["AUTH-TOKEN"]) {
            /* helper.jwtVerify(req.signedCookies["AUTH-TOKEN"], function (err, decoded) {
                 if (decoded) {
                     req.user = {
                         "authenticated": true,
                         "csrfToken": decoded.csrfToken,
                         "token": helper.hashWithSalt(decoded.csrfToken, appDefaults.csrfSecret)
                     };
                 } else {
                     req.user = {
                         "authenticated": false
                     };
                 }
                 next();
             });*/
        } else {
            req["user"] = {
                "authenticated": false
            };
            next();
        }
    };
}