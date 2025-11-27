import type { Request as ExpressRequest } from "express";
import { Get, Request, Route, Security } from "tsoa";
import { ADMIN_SCOPE } from "../middleware/authentication";
import { helloService } from "../services/helloService";

@Security("bearerAuth")
@Route("hello")
export class HelloController {
  @Get("/")
  async getHello(@Request() _req: ExpressRequest) {
    return helloService.hello();
  }

  @Security("bearerAuth", [ADMIN_SCOPE])
  @Get("/authenticated")
  async getAuthenticated(@Request() _req: ExpressRequest) {
    return helloService.helloAuthenticated();
  }
}
