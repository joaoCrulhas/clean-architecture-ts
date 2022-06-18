import { DbAccount } from "./index";
import { EncrypterStub } from "../../../lib/encrypter";
import { Result } from "../../../lib/result.base";
import { AddAccountRequest } from "../../../domain/add-account/add-account-request.model";
import { AccountModel } from "../../../domain/add-account/add-account.protocol";
import { AddAccountRepository } from "./protocols/add-account-repository.protocol";

class AddAccountRepositoryStub implements AddAccountRepository {
  add(account: AddAccountRequest): Promise<AccountModel> {
    return Promise.resolve({
      email: "email@gmail.com",
      username: "username",
      timestamp: new Date("10-10-2020"),
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
  test("should throws if addAccountRepository throws", () => {
    const { dbAccount, addAccountRepository } = makeSut();
    jest.spyOn(addAccountRepository, "add").mockImplementationOnce(() => {
      throw new Error("Error to add account");
    });
    dbAccount
      .add({
        email: "valid_mail@gmail.com",
        username: "username",
        password: "password",
      })
      .catch(error => {
        expect(error.message).toEqual("Error to add account");
      });
  });
  test("should return an account if correct values are provided", async () => {
    const { dbAccount } = makeSut();
    const response = await dbAccount.add({
      email: "valid_mail@gmail.com",
      username: "username",
      password: "password",
    });
    expect(response).toEqual({
      email: "email@gmail.com",
      username: "username",
      timestamp: new Date("10-10-2020"),
      id: "fakeId",
    });
    console.log(response);
  });
});
