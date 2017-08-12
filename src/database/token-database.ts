import {
    User,
    TokenPair
} from "./../models";
import * as crypto from "crypto";

export class TokenDatabase {

    public static randomBytes(length: number = 256): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            crypto.randomBytes(length, (err, buf) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buf.toString('hex'));
                }
            });
        });
    }

    public static generateToken(user: User): Promise<TokenPair> {
        return Promise.all([this.randomBytes(256), this.randomBytes(256)])
            .then(results => {
                return {
                    access_token: results[0],
                    refresh_token: results[1]
                };
            })
    }
}