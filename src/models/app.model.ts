export class SearchResultPaginator {
    page_number: number;
    per_page_record: string | number;
    ongoing_request: boolean;
    halt_lazy_loading: boolean;

    constructor(per_page_record: string | number) {
        this.page_number = 1;
        this.per_page_record = per_page_record;
        this.ongoing_request = false;
        this.halt_lazy_loading = false;
    }
}