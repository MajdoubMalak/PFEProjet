import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import {SubscriptionRequestService} from './subscription-request.service'
@Controller('subscription-request')
export class SubscriptionRequestController {
    constructor(private readonly SubscriptionRequestService: SubscriptionRequestService){}  
    @Post()
    async createSubscriptionRequest(
    @Body('sender') sender: string,
    @Body('receiver') receiver: string ){          
    const request = await this.SubscriptionRequestService.createSubscriptionRequest(sender,receiver);
        return request;
    }
    @Delete()
    async DeleteSubReq(@Body('requestId') requestId: string, @Body('receiverId') receiverId: string){
      return  await this.SubscriptionRequestService.Delete(requestId, receiverId);
      
    }
    @Post('AcceptOrganizer')
    async AcceptRequestOrganizer(@Body('reqId') reqId: string ){
      return await this.SubscriptionRequestService.AcceptRequestOrganizer(reqId)
    }
}

