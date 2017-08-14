import { AuthEndpoints } from "./auth-endpoints";
import { expect } from "chai";
import {
    TokenDatabase,
    UserDatabase
} from "./../database";
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
        describe("succeed", () => {
            let generateTokenStub: sinon.SinonStub;
            let checkLoginStub: sinon.SinonStub;
            let responseJsonStub: sinon.SinonStub;
            let nextStub: sinon.SinonStub;
            const testTokenData: object = {
                "id": "user_id",
                "name": "user name",
                "created": "date",
                "access_token": "access_token",
                "refresh_token": "refresh_token"
            };
            before(() => {
                responseJsonStub = sinon.stub();
                nextStub = sinon.stub();
            })
            beforeEach(() => {
                generateTokenStub = sinon.stub(TokenDatabase, "generateToken");
                checkLoginStub = sinon.stub(UserDatabase, "checkLogin");
            });
            afterEach(() => {
                generateTokenStub.restore();
                checkLoginStub.restore();
                responseJsonStub.reset();
                nextStub.reset();
            });
            it("should generate a successfull login", (doneCallback) => {
                let reqObject: any = {
                    body: {
                        "name": "username",
                        "password": "password12345"
                    }
                };
                const callback: any = ((body) => {
                    expect(checkLoginStub.calledOnce, "password from database only once").to.be.true;
                    expect(checkLoginStub.calledWith(reqObject.body.name, reqObject.body.password)).to.be.true;
                    expect(generateTokenStub.calledOnce, "generateToken should be called only once").to.be.true;
                    expect(nextStub.notCalled, "next should not be called").to.be.true;
                    expect(responseJsonStub.calledOnce, "json response should be generated").to.be.true;
                    expect(body).to.deep.equal(testTokenData);
                    doneCallback();
                }).bind(this);

                nextStub = nextStub.callsFake(callback);
                responseJsonStub = responseJsonStub.callsFake(callback);

                let resObject: any = {
                    json: responseJsonStub
                };
                generateTokenStub.callsFake((data) => {
                    return Promise.resolve(testTokenData);
                });
                checkLoginStub.callsFake((username, password) => {
                    return Promise.resolve(testTokenData);
                });
                AuthEndpoints.authorize(reqObject, resObject, nextStub);
            });
        });
        describe("fails", () => {
            beforeEach(() => {
            });
            afterEach(() => {

            });
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
});