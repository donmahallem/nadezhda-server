import { TokenDatabase } from "./token-database";
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
        let randomBytesStub: sinon.SinonStub;
        const testAccessToken: string = "access_token_12345";
        const testRefreshToken: string = "refresh_token_12345";
        beforeEach(() => {
            randomBytesStub = sandbox.stub(TokenDatabase, "randomBytes")
                .onCall(0).returns(Promise.resolve(testAccessToken))
                .onCall(1).returns(Promise.resolve(testRefreshToken));
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should generate a random hash", () => {
            let user: User = new User();
            return TokenDatabase.generateToken(user)
                .then(result => {
                    expect(result).to.not.be.null;
                    expect(result).to.deep.equal({
                        "access_token": testAccessToken,
                        "refresh_token": testRefreshToken
                    });
                    expect(result).to.not.be.null;
                });
        });
    });
});