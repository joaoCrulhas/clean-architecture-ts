import request from "supertest";
import { app } from "../config"

describe('BodyParser middleware',  function () {
    it("", async () => {
        app.post("/test",(req,res) => {
            res.send(req.body);
        });
        const response = await request(app)
            .post("/test")
            .send({name: 'test'});
        const { name } = response.body;
        expect(name).toEqual("test");
    });
});