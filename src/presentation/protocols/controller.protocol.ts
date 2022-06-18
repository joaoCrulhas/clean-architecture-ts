import { HttpRequest, HttpResponse } from "./HttpResponse";
import { Result } from "../../lib/result.base";

interface Controller {
  handle(httpRequest: HttpRequest): Promise<Result<HttpResponse>>;
}
export { Controller };
