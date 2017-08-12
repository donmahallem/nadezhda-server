import { TokenDatabase } from "./token-database";
import { expect } from "chai";
import "mocha";
import * as sinon from "sinon";
import * as crypto from "crypto";

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
});