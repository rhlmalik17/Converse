import { ConversationType } from "../../models/ConversationModels/ConversationSwitch.model";

class ChatTimeStampService {
    sameDay(dateOne: Date, dateTwo: Date): boolean {
        return dateOne.getFullYear() === dateTwo.getFullYear() &&
          dateOne.getMonth() === dateTwo.getMonth() &&
          dateOne.getDate() === dateTwo.getDate();
      }

    sortConversationListUsingTimeStamp(allConversations: ConversationType): Array<string> {
        if(!allConversations || Object.keys(allConversations).length < 1) return [];

        return Object.keys(allConversations).sort((conversationOne: string, conversationTwo: string) => {
            let timeOne: Date = allConversations[conversationOne]?.updated_at as Date;
            let timeTwo: Date = allConversations[conversationTwo]?.updated_at as Date;

            if(!timeOne || !timeTwo) return 0;
            return timeTwo.getTime() - timeOne.getTime();
        });
    }

    getChatMessageTimeStamp(messageDate: Date): string {
        if(!messageDate)
        return "";

        let currentDate: Date = new Date();
        //Timestamp is altered on multiple levels

        //Same day level: return message Time
        if(this.sameDay(messageDate, currentDate)) {
            return this.dateTimeStamp(messageDate); 
        } else if(currentDate.getDate() - messageDate.getDate() === 1) {
            return "Yesterday ";
        } else {
            return messageDate.getDate() + "/" + ("0" + (messageDate.getMonth()+1)).slice(-2) 
                   + "/"+ messageDate.getFullYear() 
        }
    }

    dateTimeStamp(date: Date): string {
        return Math.floor(date.getHours() % 12) + ":" + ('0' + date.getMinutes()).slice(-2) + " "
        + (Math.floor(date.getHours() / 12) > 0 ? "PM" : "AM");
    }
}

export default new ChatTimeStampService();