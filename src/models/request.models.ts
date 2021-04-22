export class SearchUsers {
    search_pattern: string = '';
    page_number: string | number = '';
    constructor(pattern: string, page_number: string | number) {
        this.search_pattern = pattern;
        this.page_number = page_number;
    }
}

/**
 * Fetch Messages Request model
 */

export class FetchMessages {
    public chat_id: string = "";
    public page_number: string | number = '';
    constructor(chat_id: string, page_number: string | number) {
        this.chat_id = chat_id;
        this.page_number = page_number;
    }
}