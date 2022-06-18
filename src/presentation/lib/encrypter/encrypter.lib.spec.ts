import { Result } from "../result.base";
import { Encrypt } from "../../protocols/encrypter";
import { EncrypterStub } from "./index";

const makeSut = (): { encrypt: Encrypt } => {
  return {
    encrypt: new EncrypterStub(),
  };
};
describe("Encrypter library", () => {
  test("should return a hashed_password", () => {
    const { encrypt } = makeSut();
    const result = encrypt.encrypt("original_password");
    expect(result.isSuccess).toEqual(true);
    expect(result.isFailure).toEqual(false);
    expect(result.getValue()).toEqual("hashed_password");
  });
  test("should return an error if an empty password is provided", () => {
    const { encrypt } = makeSut();
    const result = encrypt.encrypt("");
    expect(result.isSuccess).toEqual(false);
    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual("password not provided");
  });
  test("should call encrypt with correct argument", () => {
    const { encrypt } = makeSut();
    const encryptSpy = jest.spyOn(encrypt, "encrypt");
    const result = encrypt.encrypt("original_password");
    expect(encryptSpy).toHaveBeenCalledWith("original_password");
  });
});
