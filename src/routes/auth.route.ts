/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";
import * as readline from "readline";
import * as through2 from "through2"
import { RouteError } from "./route-error";
import * as moment from "moment";
import { QueryTypes } from "./../models";
import {
    Validator,
    Schema,
    ValidatorResult
} from "jsonschema";
import {
    UserDatabase
} from "./../database/user-database";
import {
    TokenDatabase
} from "./../database/token-database";
/**
 * @apiDefine NotAuthorized
 * @apiError NotAuthorized The requester is not authorized to access this endpoint
 * @apiErrorExample NotAuthorized Response:
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "error":{
 *         "code":401,
 *         "message":"Not authorized"
 *       }
 *     }
 */

/**
 * @apiDefine admin AdminUser
 * A logged in user
 */

/**
 * @apiDefine none public
 * This api endpoint is public
 */

/**
 * @apiDefine InvalidRequest
 * @apiError InvalidRequest The request is malformed
 * @apiErrorExample InvalidRequest Response:
 *     HTTP/1.1 400 Invalid Request
 *     {
 *       "error":{
 *         "code":400,
 *         "message":"Bad Request"
 *       }
 *     }
 */

/**
 * @apiDefine ErrorNotFound
 * @apiError NotFound The requested resource is unknown to the server
 * @apiErrorExample NotFound Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error":{
 *         "code":404,
 *         "message":"Not found"
 *       }
 *     }
 */

/**
 * The router for the api endpoints
 * @exports apiRouter
 */
let router = express.Router();

let db: UserDatabase = new UserDatabase();

/**
 * @api {get} /api/data/queryTypes Get Querytypes
 * @apiName GetDataQueryTypes
 * @apiGroup Data
 * @apiVersion 1.0.1
 * @apiPermission admin
 *
 * @apiSuccess {Object[]} queryTypes Array with query types
 * @apiSuccess {String} queryTypes.type query type
 * @apiSuccess {Number} queryTypes.count number of queries with this type
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "queryTypes":[
 *         {
 *           "type": "AAAA",
 *           "count": 299
 *         },
 *         {
 *           "type": "AA",
 *           "count": 100
 *         }
 *       ]
 *     }
 * @apiUse InvalidRequest
 * @apiUse NotAuthorized
 */
router.post("/authorize", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const validator: Validator = new Validator();
    const loginDataSchema: Schema = {
        "id": "/LoginDataSubmission",
        "type": "object",
        "properties": {
            "name": { "type": "string" },
            "password": { "type": "string" }
        },
        "required": ["password", "name"]
    };
    const validatorResult: ValidatorResult = validator.validate(req.body, loginDataSchema);

    if (validatorResult.valid) {
        db.checkLogin(req.body.name, req.body.password)
            .then(result => {
                return TokenDatabase.generateToken(result)
                    .then(tokens => {
                        return Object.assign(result, tokens);
                    });
            })
            .then(result => {
                res.json(result);
            }).catch(err => {
                next(err);
            });
    } else {
        next(validatorResult.errors[0]);
    }
});
router.post("/token", (req: express.Request, res: express.Response, next: express.NextFunction) => {

});

export = router;
