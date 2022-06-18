import { DbAccount } from "./index";
import { EncrypterStub } from "../../../presentation/lib/encrypter";
import { Result } from "../../../presentation/lib/result.base";
import { AddAccountRequest } from "../../../presentation/protocols/add-account/add-account-request.model";
import { AccountModel } from "../../../presentation/protocols/add-account/add-account.protocol";

export interface AddAccountRepository {
  add(account: AddAccountRequest): Promise<AccountModel>;
}
class AddAccountRepositoryStub implements AddAccountRepository {
  add(account: AddAccountRequest): Promise<AccountModel> {
    return Promise.resolve({
      email: "email@gmail.com",
      username: "username",
      timestamp: new Date(),
      id: "fakeId",
    });
  }
}

const makeSut = () => {
  const encrypt = new EncrypterStub();
  const addAccountRepository = new AddAccountRepositoryStub();
  return {
    addAccountRepository: addAccountRepository,
    dbAccount: new DbAccount(encrypt, addAccountRepository),
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
  test("should call AddAccount repository with correct arguments", async () => {
    const { dbAccount, addAccountRepository } = makeSut();
    const addAccountRepositorySpy = jest.spyOn(addAccountRepository, "add");
    await dbAccount.add({
      email: "valid_mail@gmail.com",
      username: "username",
      password: "password",
    });
    expect(addAccountRepositorySpy).toHaveBeenCalled();
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      email: "valid_mail@gmail.com",
      username: "username",
      password: "hashed_password",
    });
  });
});
