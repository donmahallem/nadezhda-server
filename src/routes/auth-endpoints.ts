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
} from "./../database/user-database";
import {
    TokenDatabase
} from "./../database/token-database";

export class AuthEndpoints {
    public static authorize: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        if (!req.hasOwnProperty("body")) {
            next(new Error("No body provided"));
            return;
        }
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
            UserDatabase.checkLogin(req.body.name, req.body.password)
                .then(result => {
                    return TokenDatabase.generateToken(result)
                        .then(tokens => {
                            TokenDatabase.storeAccessToken(result, tokens).then((ret) => {
                                console.log(ret);
                            })
                            return Object.assign(result, tokens);
                        });
                })
                .then(result => {
                    res.json(result);
                }).catch(err => {
                    next(err);
                });
        } else {
            next(new Error(validatorResult.errors[0].message));
        }
    };
    public static token: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        res.end();
    };
}