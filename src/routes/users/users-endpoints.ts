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
    RouteError
} from "./../";
export class UsersEndpoints {
    public static create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        if (!req.hasOwnProperty("body")) {
            next(new Error("No body provided"));
            return;
        }
        const validator: Validator = new Validator();
        const loginDataSchema: Schema = {
            "id": "/CreateUserDataSubmission",
            "type": "object",
            "properties": {
                "username": {
                    "type": "string",
                    maxLength: 140,
                    minLength: 6
                },
                "password1": {
                    "type": "string",
                    minLength: 8,
                    maxLength: 1024
                },
                "password2": {
                    "type": "string",
                    minLength: 8,
                    maxLength: 1024
                }
            },
            "required": ["username", "password1", "password2"]
        };
        if (req.body.password1 != req.body.password2) {
            next(new RouteError(400, "The provided passwords dont match"));
            return;
        }
        const validatorResult: ValidatorResult = validator.validate(req.body, loginDataSchema);
        if (validatorResult.valid) {
            UserDatabase.createUser(req.body.username, req.body.password1)
                .then(result => {
                    res.json(result);
                }).catch(err => {
                    if (parseInt(err.code) == 23505) {
                        // Unique Violation
                        next(new RouteError(400, "Username already taken"));
                    } else {
                        next(err);
                    }
                });
        } else {
            next(new Error(validatorResult.errors[0].message));
        }
    };
    public static getUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        UserDatabase.getUser(req.params.userId)
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                next(error);
            });
    };
}