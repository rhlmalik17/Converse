class ChatTimeStampService {
    currentDate: Date = new Date();

    sameDay(dateOne: Date, dateTwo: Date): boolean {
        return dateOne.getFullYear() === dateTwo.getFullYear() &&
          dateOne.getMonth() === dateTwo.getMonth() &&
          dateOne.getDate() === dateTwo.getDate();
      }

    getChatMessageTimeStamp(messageDate: Date): string {
        if(!messageDate)
        return "";

        //Timestamp is altered on multiple levels

        //Same day level: return message Time
        if(this.sameDay(messageDate, this.currentDate)) {
            return Math.floor(messageDate.getHours() % 12) + ":" + ('0' + messageDate.getMinutes()).slice(-2) + " "
                   + (Math.floor(messageDate.getHours() / 12) > 0 ? "PM" : "AM"); 
        }

        // if(this.sameWeek)

        return "";
    }
}

export default new ChatTimeStampService();