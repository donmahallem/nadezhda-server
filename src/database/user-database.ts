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
    private static databasePool: Pool;
    public static initDatabase(): Promise<Boolean> {
        let config: PoolConfig = {
            user: "postgres",
            database: "nadezhda",
            password: "password",
            host: "localhost",
            min: 1,
            max: 4
        }
        this.databasePool = new Pool(config);
        return this.databasePool.connect()
            .then(client => {
                return client.query("CREATE SCHEMA IF NOT EXISTS nadezhda;")
                    .catch(error => {
                        client.release();
                        return error;
                    })
                    .then(result => {
                        return client.query("CREATE TABLE IF NOT EXISTS nadezhda.users( _id UUID PRIMARY KEY DEFAULT gen_random_uuid(), _name text NOT NULL UNIQUE, _created TIMESTAMP WITH TIME ZONE DEFAULT now(), _password TEXT NOT NULL);")
                    })
                    .then(result => {
                        return client.query("CREATE TABLE IF NOT EXISTS nadezhda.groups( _id UUID PRIMARY KEY DEFAULT gen_random_uuid(), _title text NOT NULL, _subtitle text, _created TIMESTAMP WITH TIME ZONE DEFAULT now(), _creator UUID NOT NULL REFERENCES nadezhda.users (_id) ON DELETE CASCADE, _parent UUID REFERENCES nadezhda.groups (_id) ON DELETE CASCADE);")
                    })
                    .then(result => {
                        client.release();
                        return true;
                    });
            })
            .then(result => {
                return true;
            });
    }

    public static createGroup(groupTitle: string, groupDescription: string, user: string, parent: string = null): Promise<User> {
        return this.databasePool.connect().then(client => {
            const queryText: string = "INSERT INTO nadezhda.groups (_title, _subtitle, _creator, _parent) VALUES($1, $2, $3, $4) RETURNING _id;";
            const queryValues: any[] = [groupTitle, groupDescription, user, parent];
            return client.query(queryText, queryValues)
                .catch(error => {
                    console.error(error);
                    client.release();
                    return error;
                })
                .then(result => {
                    client.release();
                    let row = result.rows[0];
                    return row._id;
                })
        });
    }
    public static getGroup(groupId: string): Promise<User> {
        return this.databasePool.connect().then(client => {
            const queryText: string = "SELECT * FROM nadezhda.groups WHERE _id = $1;";
            const queryValues: any[] = [groupId];
            return client.query(queryText, queryValues)
                .catch(error => {
                    client.release();
                    return error;
                })
                .then(result => {
                    client.release();
                    if (result.rowCount > 1) {
                        return Promise.reject(new Error("There should only be one row as result"));
                    } else if (result.rowCount == 0) {
                        return Promise.reject(new Error("Group could not be found"));
                    } else {
                        return result.rows[0];
                    }
                })
        });
    }

    public static checkLogin(user: string, password: string): Promise<User> {
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

    public static createUser(user: string, password: string): Promise<string> {
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