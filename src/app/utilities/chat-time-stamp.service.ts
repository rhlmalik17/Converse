import { ConversationType } from "../../models/ConversationModels/ConversationSwitch.model";
import { Message } from "../../models/ConversationModels/Message.model";

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

    showSegregator(messages: Array<Message>, index: number): boolean {
        if(!messages || index === undefined || index < 1 || index >= messages.length) return false;
        return !this.sameDay(new Date(messages[index - 1].updated_at),
                    new Date(messages[index].updated_at));
    }

    invalidTimeStamp(messages: Array<Message>, index: number): boolean {
        if(!messages || index === undefined) return false;

        let previousIndex = (index - 1), previousMessage = messages[index - 1], currentMessage = messages[index];
        if(previousIndex < 0) return false;

        return (this.getChatMessageTimeStamp(previousMessage.updated_at)
            === this.getChatMessageTimeStamp(currentMessage.updated_at)) && previousMessage.sender === currentMessage.sender;
    }

    dateTimeStamp(date: Date): string {
        return Math.floor(date.getHours() % 12) + ":" + ('0' + date.getMinutes()).slice(-2) + " "
        + (Math.floor(date.getHours() / 12) > 0 ? "PM" : "AM");
    }
}

export default new ChatTimeStampService();