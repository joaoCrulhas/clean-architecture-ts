import {
  AccountModel,
  AddAccount,
} from "../../../domain/add-account/add-account.protocol";
import { AddAccountRequest } from "../../../domain/add-account/add-account-request.model";
import { Encrypt } from "../../../presentation/protocols/encrypter";
import { AddAccountRepository } from "./protocols/add-account-repository.protocol";

class DbAccount implements AddAccount {
  constructor(
    private readonly encrypt: Encrypt,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  async add(account: AddAccountRequest): Promise<AccountModel> {
    const passwordEncryptedResult = await this.encrypt.encrypt(
      account.password
    );
    const passwordEncrypted: string = passwordEncryptedResult.getValue() || "";
    if (!passwordEncrypted) {
      throw new Error("passwordEncrypted is empty");
    }
    const response = await this.addAccountRepository.add({
      email: account.email,
      password: passwordEncrypted,
      username: account.username,
    });
    return response;
  }
}

export { DbAccount };
