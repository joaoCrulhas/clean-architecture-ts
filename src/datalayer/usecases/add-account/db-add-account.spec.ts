import { DbAccount } from "./index";
import { EncrypterStub } from "../../../presentation/lib/encrypter";

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
});
