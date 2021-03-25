import { useEffect, useState } from 'react'
import './SearchResults.css'
import Skeleton from '@material-ui/lab/Skeleton';
import noSearchResults from "../../../../../assets/home/no-search-results.svg"
import defaultProfileImage from "../../../../../assets/home/default-profile-picture.svg";
import httpClient from '../../../../../services/api-services/http-client';
import { apiUrls } from '../../../../../services/api-services/api-urls';
import { SearchUsers } from '../../../../../models/request.models';
import { AxiosRequestConfig } from 'axios';
import { SearchResultPaginator } from '../../../../../models/app.model';

/* Paginate Records */
const no_of_records: number = 12;
let paginationOptions: SearchResultPaginator = new SearchResultPaginator(no_of_records);

const SearchResults = (props: any) => {
    const skeletonRows: Array<any> = new Array(4).fill(4);
    const [ searchResultState, setSearchResultState ] = useState<any>({
        isLoading: true,
        searchResults: []
    });

    const searchApplicants = () => {
        if(paginationOptions.halt_lazy_loading)
        return;

        paginationOptions['ongoing_request'] = true;
        let searchApplicantQueryParams: AxiosRequestConfig = { params: new SearchUsers(props.searchText, paginationOptions.page_number) };
        
        httpClient.get(apiUrls['search-users'].route, searchApplicantQueryParams)
        .then((response: any) => {
            let allResults = response.search_results || [];
            let searchResults = (paginationOptions.page_number > 1) ? 
                                searchResultState.searchResults.concat(allResults)
                                : allResults;

            /* Increment Page for Pagination */
            paginationOptions.page_number++;
            setSearchResultState({ isLoading: false, searchResults: searchResults });

            if(allResults.length < paginationOptions.per_page_record)
            paginationOptions.halt_lazy_loading = true;
        })
        /*Handle Error and stop loading*/
        .catch((reason: any) => {
            setSearchResultState({ isLoading: false, searchResults: [] });
        }).finally(() => { 
            paginationOptions['ongoing_request'] = false; 
        });
    }

    const lazyLoadConversationList = (event: React.UIEvent<HTMLElement>) => {
        if(
            paginationOptions.ongoing_request ||
            paginationOptions.halt_lazy_loading ||
            !(event.currentTarget.offsetHeight + event.currentTarget.scrollTop >= event.currentTarget.scrollHeight)
            )
        return;

        //Scrolled at bottom
        searchApplicants();
    }

    useEffect(() => {
        //Reset page number
        paginationOptions = new SearchResultPaginator(no_of_records);

        //Search for applicants
        searchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.searchText])

    return (
        <div className="search__result__container d-flex flex-column h-100 w-100">

            {
                //Render the loader if API hit is ongoing
                (searchResultState.isLoading) ?

                skeletonRows.map((skeleton: any, index: number) => (
                    <div key={index} className="search__loader">
                        <Skeleton variant="circle" width={40} height={40} />
                        <Skeleton className="ml-2" variant="rect" width={'84%'} height={40} />
                    </div>
                ))
                    : null
            }
           
            {
                //Render the no results found if no search results found
                (searchResultState.searchResults.length < 1 && !searchResultState.isLoading) ?
                    (
                        <div className="no__search__results align-items-center h-100">
                            <img src={noSearchResults} alt=""/>
                        </div>
                    ) : null
            }

            {
                 //Render the search results for the user
                 (searchResultState.searchResults.length > 0 && !searchResultState.isLoading) ?
                 (
                     <div onScroll={(event: any) => lazyLoadConversationList(event)} className="search__results__list w-100">
                         
                        {
                            searchResultState.searchResults.map((result: any, index: number) => (
                                <div onClick={() => props.onSearchClick(result)} className="search__result" key={index}>
                                        <div className="selected__border"></div>
                                        <div className="conversation__card mb-3">
                                            <div className="conversation__img position-relative">
                                                <img className="profile-img" alt="" src={result.profile_img || defaultProfileImage} />
                                                <img className="" alt="" />
                                            </div>
                                            <div className="conversation__details">
                                                <div className="conversation__title">
                                                    <span>{result.first_name + " " + result.last_name}</span>
                                                </div>
                                                <div className="conversation__last__message">
                                                    <span className="conversation__message">{result.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            ))
                        }

                     </div>
                 ) : null
            }

        </div>
    )
}

export default SearchResults
