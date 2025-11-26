import type { Request as ExpressRequest } from "express";
import { Get, Request, Route, Security } from "tsoa";
import { BEARER_AUTH, MEMBER_SCOPE } from "../middleware/authentication";
import { helloService } from "../services/helloService";

@Security(BEARER_AUTH, [MEMBER_SCOPE])
@Route("hello")
export class HelloController {
  @Get("/")
  async getHello(@Request() _req: ExpressRequest) {
    return helloService.hello();
  }
}
