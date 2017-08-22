import {
    User,
    TokenPair
} from "./../models";
import * as crypto from "crypto";
import * as redis from "redis";
import * as jwt from "jsonwebtoken";
import { NadezhdaJwtConfig } from "./../config";

export interface TokenInfoPair {
    token: string;
    jwt_token: string
}

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
        return Promise.all([this.createAccessToken(user, 256), this.createRefreshToken(user, 512)])
            .then(results => {
                return this.storeAccessToken(user, {
                    access_token: results[0].token,
                    refresh_token: results[1].token
                }).then(resp => {
                    return {
                        access_token: results[0].jwt_token,
                        refresh_token: results[1].jwt_token
                    }
                })
            })
    }

    public static generateTokensAndStore(user: User): Promise<TokenPair> {
        return this.generateToken(user)
            .then(tokenPair => {

                return tokenPair;
            });
    }

    public static createRedisClient(): Promise<redis.RedisClient> {
        return new Promise<redis.RedisClient>((resolve, reject) => {
            resolve(redis.createClient());
        });
    }


    public static createRefreshToken(user: User, tokenLength: number = 256): Promise<TokenInfoPair> {
        return this.randomBytes(tokenLength)
            .then(randomString => {
                return this.createJwtToken(user, {
                    token_type: "refresh",
                    token: randomString
                }, "7d")
                    .then(jwtToken => {
                        return {
                            token: randomString,
                            jwt_token: jwtToken
                        }
                    })
            })
    }
    public static createAccessToken(user: User, tokenLength: number = 256): Promise<TokenInfoPair> {
        return this.randomBytes(tokenLength)
            .then(randomString => {
                return this.createJwtToken(user, {
                    token_type: "access",
                    token: randomString
                }, "1h")
                    .then(jwtToken => {
                        return {
                            token: randomString,
                            jwt_token: jwtToken
                        }
                    })
            })
    }

    public static createJwtToken(user: User, body: object, expireDuration: string): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(body,
                NadezhdaJwtConfig.secret,
                {
                    expiresIn: expireDuration,
                    algorithm: "HS512",
                    issuer: NadezhdaJwtConfig.issuer,
                    subject: user.id
                }, (err, token) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(token);
                    }
                });
        });
    }

    public static redisSet(client: redis.RedisClient, key: any, value: any): Promise<'OK'> {
        return new Promise<'OK'>((resolve, reject) => {
            client.set(key, value, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    public static storeAccessToken(user: User, tokenPair: TokenPair): Promise<boolean> {
        return this.createRedisClient()
            .then(client => {
                return new Promise<boolean>((resolve, reject) => {
                    let multi = client.multi();

                    multi.hset("user::access_token", tokenPair.access_token, user.id);
                    multi.hset("user::refresh_token", tokenPair.refresh_token, user.id);

                    // drains multi queue and runs atomically
                    multi.exec((err, replies) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                });
            })
    }

}