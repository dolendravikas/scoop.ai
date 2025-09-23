import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TwitterController } from "./twitter.controller";
import { TwitterService } from "./twitter.service";

@Module({
  imports: [HttpModule],
  controllers: [TwitterController],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}



