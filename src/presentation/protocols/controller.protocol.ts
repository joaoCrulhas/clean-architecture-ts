import { HttpRequest, HttpResponse } from "./HttpResponse";
import { Result } from "../lib/result.base";

interface Controller {
  handle(httpRequest: HttpRequest): Result<HttpResponse>;
}
export { Controller };
