import { Scopes } from "./scope";

export class User {

    private _authenticated: boolean = false;
    private _scopes: number;

    public get scopes(): number {
        return this._scopes;
    }

    public get authenticated(): boolean {
        return this._authenticated;
    }
}