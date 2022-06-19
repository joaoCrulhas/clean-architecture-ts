import { BcryptAdapter } from "./brcypt.adapter";
import bcrypt from "bcrypt";
describe("BcryptAdapter", function () {
  test("should call bcrypt with correct parameters", async function () {
    const sut = new BcryptAdapter(12);
    const spyBcrypt = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("password");
    expect(spyBcrypt).toHaveBeenCalled();
    expect(spyBcrypt).toHaveBeenCalledWith("password", 12);
  });
});
