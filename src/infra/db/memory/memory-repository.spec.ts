import {MemoryRepository} from "./memory.repository";
import myData from "./data";

describe('Memory Repository', function () {
    it("should return a valid accountModel if correct values are provided", async function () {
        const sut = new MemoryRepository(myData);
        const response = await sut.add({
            email: 'email@gmail.com',
            username: 'username',
            password: 'hashed_password',
        });
        expect(response.email).toEqual("email@gmail.com");
        expect(response.id).toEqual("user_1");
        expect(response.username).toEqual("username");
    })
});