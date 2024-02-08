import AbstractResponse from "openapi-validator/dist/classes/AbstractResponse";
import { RawRequestPromiseResponse } from "openapi-validator/dist/classes/RequestPromiseResponse";

export class MyResponse extends AbstractResponse {
  constructor(path: string, method: string, status: number, body: any) {
    super({} as RawRequestPromiseResponse);
    this.status = status;
    this.body = body;
    this.req = {
      method: method,
      path: path,
    };
    this.bodyHasNoContent = false;
  }

  getBodyForValidation(): any {
    return this.body;
  }
}
