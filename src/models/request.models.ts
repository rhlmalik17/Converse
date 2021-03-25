export class SearchUsers {
    search_pattern: string = '';
    page_number: string | number = '';
    constructor(pattern: string, page_number: string | number) {
        this.search_pattern = pattern;
        this.page_number = page_number;
    }
}