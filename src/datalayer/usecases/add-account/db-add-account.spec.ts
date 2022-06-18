import { DbAccount } from "./index";
import { EncrypterStub } from "../../../presentation/lib/encrypter";
import { Result } from "../../../presentation/lib/result.base";

const makeSut = () => {
  const encrypt = new EncrypterStub();
  return {
    dbAccount: new DbAccount(encrypt),
    encrypt,
  };
};
describe("DbAccount add account", function () {
  test("should call encrypt method to encrypt the password", () => {
    const { dbAccount, encrypt } = makeSut();
    const encryptSpy = jest.spyOn(encrypt, "encrypt");
    dbAccount.add({
      email: "valid_mail@gmail.com",
      username: "username",
      password: "password",
    });
    expect(encryptSpy).toHaveBeenCalled();
  });
  test("should call encrypt method to encrypt the password with correct arguments", () => {
    const { dbAccount, encrypt } = makeSut();
    const encryptSpy = jest.spyOn(encrypt, "encrypt");
    dbAccount.add({
      email: "valid_mail@gmail.com",
      username: "username",
      password: "password",
    });
    expect(encryptSpy).toHaveBeenCalledWith("password");
  });

  test("should throw an exception if encrypt method throws an exception", () => {
    const { dbAccount, encrypt } = makeSut();
    jest.spyOn(encrypt, "encrypt").mockImplementation(() => {
      return Promise.reject(Result<Error>.fail("Server Error"));
    });
    dbAccount
      .add({
        email: "valid_mail@gmail.com",
        username: "username",
        password: "password",
      })
      .catch(({ isSuccess, isFailure, error }: Result<Error>) => {
        expect(isSuccess).toEqual(false);
        expect(isFailure).toEqual(true);
        expect(error).toEqual("Server Error");
      });
  });
});
