import { BcryptAdapter } from "./brcypt.adapter";
import bcrypt from "bcrypt";
jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return Promise.resolve("hash");
  },
}));
describe("BcryptAdapter", function () {
  test("should call bcrypt with correct parameters", async function () {
    const sut = new BcryptAdapter(12);
    const spyBcrypt = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("password");
    expect(spyBcrypt).toHaveBeenCalled();
    expect(spyBcrypt).toHaveBeenCalledWith("password", 12);
  });

  test("should return a value if bcrypt is executed", async function () {
    const sut = new BcryptAdapter(12);
    const response = await sut.encrypt("password");
    expect(response.getValue()).toEqual("hash");
  });
});
