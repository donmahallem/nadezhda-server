import {
    Pool,
    Client,
    PoolConfig,
    QueryResult
} from "pg";
import {
    User
} from "./../models/";

export class UserDatabase {
    private databasePool: Pool;
    constructor() {
        let config: PoolConfig = {
            user: "postgres",
            database: "nadezhda",
            password: "password",
            host: "localhost",
            min: 1,
            max: 4
        }
        this.databasePool = new Pool(config);
    }

    public initDatabase(): Promise<Boolean> {
        return this.databasePool.connect()
            .then(client => {
                return client.query("CREATE SCHEMA IF NOT EXISTS nadezhda;")
                    .catch(error => {
                        client.release();
                        return error;
                    })
                    .then(result => {
                        client.release();
                        return client.query("CREATE TABLE IF NOT EXISTS nadezhda.users( _id UUID PRIMARY KEY DEFAULT gen_random_uuid(), _name char(128) NOT NULL UNIQUE, _created TIMESTAMP WITH TIME ZONE DEFAULT now(), _password TEXT NOT NULL);")
                    });
            })
            .then(result => {
                return true;
            });
    }

    public checkLogin(user: string, password: string): Promise<User> {
        return this.databasePool.connect().then(client => {
            const queryText: string = "SELECT _name AS name, _created AS created, _id as ID FROM nadezhda.users WHERE _name = $1 AND _password = crypt($2, _password);";
            const queryValues: any[] = [user, password];
            return client.query(queryText, queryValues)
                .catch(error => {
                    client.release();
                    return error;
                })
                .then(result => {
                    client.release();
                    if (result.rowCount != 1) {
                        return Promise.reject(new Error("User could not be found"));
                    } else {
                        return result.rows[0];
                    }
                })
        });
    }

    public createUser(user: string, password: string): Promise<string> {
        return this.databasePool.connect().then(client => {
            const queryText: string = "INSERT INTO nadezhda.users (_name, _password, _created) VALUES($1, crypt($2, gen_salt('bf', 8)), now()) RETURNING _id;";
            const queryValues: any[] = [user, password];
            return client.query(queryText, queryValues)
                .catch(error => {
                    client.release();
                    return error;
                })
                .then(result => {
                    client.release();
                    let row = result.rows[0];
                    return row._id;
                });
        });
    }
}