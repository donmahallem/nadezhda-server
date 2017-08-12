import {
    User,
    TokenPair
} from "./../models";
import { randomBytes } from "crypto";

export class TokenDatabase {

    public static randomBytes(length: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            randomBytes(256, (err, buf) => {
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