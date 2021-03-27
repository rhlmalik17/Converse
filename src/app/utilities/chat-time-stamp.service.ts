class ChatTimeStampService {
    sameDay(dateOne: Date, dateTwo: Date): boolean {
        return dateOne.getFullYear() === dateTwo.getFullYear() &&
          dateOne.getMonth() === dateTwo.getMonth() &&
          dateOne.getDate() === dateTwo.getDate();
      }

    getChatMessageTimeStamp(messageDate: Date): string {
        if(!messageDate)
        return "";

        let currentDate: Date = new Date();
        //Timestamp is altered on multiple levels

        //Same day level: return message Time
        if(this.sameDay(messageDate, currentDate)) {
            return Math.floor(messageDate.getHours() % 12) + ":" + ('0' + messageDate.getMinutes()).slice(-2) + " "
                   + (Math.floor(messageDate.getHours() / 12) > 0 ? "PM" : "AM"); 
        } else if(currentDate.getDate() - messageDate.getDate() === 1) {
            return "Yesterday";
        } else {
            return messageDate.getDate() + "/" + ("0" + (messageDate.getMonth()+1)).slice(-2) 
                   + "/"+ messageDate.getFullYear() 
        }
    }
}

export default new ChatTimeStampService();