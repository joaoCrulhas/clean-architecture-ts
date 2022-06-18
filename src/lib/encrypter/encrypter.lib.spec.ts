import { Result } from "../result.base";
import { Encrypt } from "../../presentation/protocols/encrypter";
import { EncrypterStub } from "./index";

const makeSut = (): { encrypt: Encrypt } => {
  return {
    encrypt: new EncrypterStub(),
  };
};
describe("Encrypter library", () => {
  test("should return a hashed_password", () => {
    const { encrypt } = makeSut();
    encrypt.encrypt("original_password").catch((error: Result<string>) => {
      expect(error.error).toEqual("password not provided");
      expect(error.isSuccess).toEqual(false);
      expect(error.isFailure).toEqual(true);
    });
  });
  test("should return an error if an empty password is provided", async () => {
    const { encrypt } = makeSut();
    try {
      await encrypt.encrypt("");
    } catch (error) {
      console.log(error);
    }
  });
  test("should call encrypt with correct argument", async () => {
    const { encrypt } = makeSut();
    const encryptSpy = jest.spyOn(encrypt, "encrypt");
    await encrypt.encrypt("original_password");
    expect(encryptSpy).toHaveBeenCalledWith("original_password");
  });
});
