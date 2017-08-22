import {
    Request,
    Response,
    NextFunction,
    RequestHandler
} from "express";
import {
    Validator,
    Schema,
    ValidatorResult
} from "jsonschema";
import {
    UserDatabase
} from "./../../database/user-database";
import {
    TokenDatabase
} from "./../../database/token-database";

export class GroupsEndpoints {
    public static create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        if (!req.hasOwnProperty("body")) {
            next(new Error("No body provided"));
            return;
        }
        const validator: Validator = new Validator();
        const loginDataSchema: Schema = {
            "id": "/LoginDataSubmission",
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    maxLength: 140
                },
                "subtitle": {
                    "type": "string",
                    maxLength: 140
                }, "parent": {
                    "type": "string"
                }
            },
            "required": ["title"]
        };
        const validatorResult: ValidatorResult = validator.validate(req.body, loginDataSchema);
        if (validatorResult.valid) {
            UserDatabase.createGroup(req.body.title, req.body.subtitle, "d59d0392-751c-4f92-9ec4-af5af71052d7", req.body.parent)
                .then(result => {
                    res.json(result);
                }).catch(err => {
                    next(err);
                });
        } else {
            next(new Error(validatorResult.errors[0].message));
        }
    };
    public static getGroup: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        UserDatabase.getGroup(req.params.groupId)
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                next(error);
            });
    };
}