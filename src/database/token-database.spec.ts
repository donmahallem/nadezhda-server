import {
    TokenDatabase,
    TokenInfoPair
} from "./token-database";
import { expect } from "chai";
import "mocha";
import * as sinon from "sinon";
import * as crypto from "crypto";
import {
    User,
    TokenPair
} from "./../models";
let sandbox = sinon.sandbox.create();
describe("TokenDatabase", () => {
    describe("randomBytes", () => {
        let randomBytesStub: sinon.SinonStub;
        const testValue: Buffer = Buffer.from("test_data");
        const testResult: string = testValue.toString("hex");
        const testNumber: number = 64;
        beforeEach(() => {
            randomBytesStub = sandbox.stub(crypto, "randomBytes").callsFake((byteNum, callback) => {
                callback(null, testValue);
            });
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should generate a random hash", () => {
            return TokenDatabase.randomBytes(testNumber)
                .then(result => {
                    expect(result).to.equal(testResult);
                    expect(randomBytesStub.callCount).to.equal(1);
                    expect(randomBytesStub.args[0][0]).to.be.a("number");
                    expect(randomBytesStub.args[0][0]).to.be.equal(testNumber);
                    expect(randomBytesStub.args[0][1]).to.be.a("function");
                });
        });
    });
    describe("generateToken", () => {
        let createAccessTokenStub: sinon.SinonStub;
        const testAccessToken: string = "access_token_12345";
        const testRefreshToken: string = "refresh_token_12345";
        let createRefreshTokenStub: sinon.SinonStub;
        let storeTokenStub: sinon.SinonStub;
        const createS = (value: string): Promise<TokenInfoPair> => {
            return Promise.resolve({
                "token": value,
                "jwt_token": "jwt_" + value
            });
        }
        beforeEach(() => {
            createAccessTokenStub = sandbox.stub(TokenDatabase, "createAccessToken")
                .returns(createS(testAccessToken))
            createRefreshTokenStub = sandbox.stub(TokenDatabase, "createRefreshToken")
                .returns(createS(testRefreshToken))
            storeTokenStub = sandbox.stub(TokenDatabase, "storeAccessToken")
                .returns(Promise.resolve(true));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should generate a token pair", () => {
            let user: User = {
                name: "username",
                created: "1.1.2017",
                id: "longid"
            }
            return TokenDatabase.generateToken(user)
                .then(result => {
                    expect(result).to.not.be.null;
                    expect(result).to.deep.equal({
                        "access_token": "jwt_" + testAccessToken,
                        "refresh_token": "jwt_" + testRefreshToken
                    });
                    expect(result).to.not.be.null;
                });
        });
    });
});