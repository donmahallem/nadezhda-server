/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

import * as express from "express";

import {
    UsersEndpoints
} from "./users-endpoints";
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
router.post("", UsersEndpoints.create);
router.get("/:userId", UsersEndpoints.getUser);

export = router;
