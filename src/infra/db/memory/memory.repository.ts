import { AddAccountRepository } from "../../../datalayer/usecases/add-account/protocols/add-account-repository.protocol";
import { AddAccountRequest } from "../../../domain/add-account/add-account-request.model";
import { AccountModel } from "../../../domain/add-account/add-account.protocol";

class MemoryRepository implements AddAccountRepository {
  constructor(private readonly db: Array<AccountModel>) {}
  add(account: AddAccountRequest): Promise<AccountModel> {
    return new Promise((resolve, reject) => {
      const id = `user_${this.db.length + 1}`;
      this.db.push({
        email: account.email,
        id,
        username: account.username,
        timestamp: new Date(),
      });
      resolve({
        email: account.email,
        id,
        username: account.username,
        timestamp: new Date(),
      });
    });
  }
}
export { MemoryRepository };
