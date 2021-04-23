import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionRequest } from './subscription-request.model';
import {OrganisatorService} from '../organisator/organisator.service'
@Injectable()
export class SubscriptionRequestService {
    constructor(@InjectModel('SubscriptionRequest') private readonly SubscriptionRequestModel: Model<SubscriptionRequest>,
    private organisatorservice: OrganisatorService){}
    
    async  createSubscriptionRequest(sender: string,receiver:string){

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();

        const SubscriptionRequestRequest= new this.SubscriptionRequestModel({
            date: date,
            time: time,
            senderuser: sender,
            receiverorganizer: receiver})
            const saved_resetrequest = await SubscriptionRequestRequest.save()
            this.organisatorservice.addSubRequest(receiver,saved_resetrequest._id);
            return await saved_resetrequest;        
     }  
 
     async Delete(requestId:string, receiverId:string){
        return this.organisatorservice.DeleteSubReq( receiverId, requestId);
     }
     async AcceptRequestOrganizer(requestId: string){
           const req= this.SubscriptionRequestModel.findOne({_id:requestId}).populate('senderuser').exec(); 
           //const req= this.SubscriptionRequestModel.findOne({_id:requestId}).populate('receiverorganizer').exec();    
           const sender = (await req).senderuser;
           this.organisatorservice.addSubscriber((await req).receiverorganizer._id, sender)
          return req;
           }
}




