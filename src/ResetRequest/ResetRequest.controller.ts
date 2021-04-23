import { Body, Controller, Post } from "@nestjs/common";
import { ResetRequestService } from "./ResetRequest.service";

@Controller('ResetRequest')
export class ResetRequestController {
    constructor(private readonly resetRequestService: ResetRequestService){}  
    @Post()
    async checkResetRequest(
    @Body('code') code: number, 
    ){   
       
    const request = await this.resetRequestService.SearchResetRequest(code);
        return request;
    }
}
