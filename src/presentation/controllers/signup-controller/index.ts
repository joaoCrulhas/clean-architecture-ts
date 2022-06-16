export default class SignupController {
  handle(httpRequest: any): any {
    if(!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error("Missing param: name"),
      };
    }
    if(!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: new Error("Missing param: password"),
      };
    }
  }
}