import * as nconf from "nconf";

nconf.argv({
    "config": {
        alias: "c",
        describe: "path to the config file",
        demand: true
    }
});

nconf.file({ file: nconf.get("config") });

export class NadezhdaDatabaseConfig {
    public static get port(): number {
        return nconf.get("database:port");
    }
    public static get host(): number {
        return nconf.get("database:host");
    }
    public static get username(): string {
        return nconf.get("database:username");
    }
    public static get password(): string {
        return nconf.get("database:password");
    }
    public static get poolMin(): number {
        return nconf.get("database:pool:min");
    }
    public static get poolMax(): number {
        return nconf.get("database:pool:max");
    }
}

export class NadezhdaJwtConfig {
    public static get secret(): string {
        return nconf.get("jwt:secret");
    }
    public static get issuer(): string {
        return nconf.get("jwt:issuer");
    }
}

export class NadezhdaConfig {

    public static get host(): string {
        return nconf.get("host");
    }

    public static get port(): number {
        return nconf.get("port");
    }
}