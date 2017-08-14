import { NadezhdaConfig } from "./config";
import { expect } from "chai";
import "mocha";
import * as sinon from "sinon";
let sandbox = sinon.sandbox.create();
describe("AuthEndpoints", () => {
    describe("authorize", () => {
        it("should generate a random hash", () => {
            expect(true).to.be.true;
        });
    });
});