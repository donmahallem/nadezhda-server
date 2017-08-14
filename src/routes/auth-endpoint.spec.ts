import { AuthEndpoints } from "./auth-endpoints";
import { expect } from "chai";
import "mocha";
import * as sinon from "sinon";
import * as crypto from "crypto";
import {
    User,
    TokenPair
} from "./../models";
let sandbox = sinon.sandbox.create();
describe("AuthEndpoints", () => {
    describe("authorize", () => {
        it("should fail to parse content", () => {
            let nextSpy: sinon.SinonSpy = sinon.spy();
            let reqObject: any = {
                body: {

                }
            };
            let resObject: any = {

            };
            AuthEndpoints.authorize(reqObject, resObject, nextSpy);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.args[0].length).to.equal(1);
            expect(nextSpy.args[0][0]).to.be.a("error");
        });
    });
});