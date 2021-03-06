import { useState } from 'react'
import './SearchResults.css'
import searchLoader from "../../../../../assets/home/loader.svg"
import noSearchResults from "../../../../../assets/home/no-search-results.svg"

const SearchResults = (props: any) => {
    const [searchResultState, setSearchResultState] = useState<any>({
        isLoading: false,
        searchResults: [{ first_name: "Michael", last_name: "Wong", email: "wong.michael@gmail.com" }]
    });

    return (
        <div className="search__result__container h-100 w-100">

            {
                //Render the loader if API hit is ongoing
                (searchResultState.isLoading) ?
                    (
                        <div className="search__loader">
                            <img src={searchLoader} alt="" />
                        </div>
                    ) : null
            }
           
            {
                //Render the no results found if no search results found
                (searchResultState.searchResults.length < 1 && !searchResultState.isLoading) ?
                    (
                        <div className="no__search__results">
                            <img src={noSearchResults} alt=""/>
                        </div>
                    ) : null
            }

            {
                 //Render the search results for the user
                 (searchResultState.searchResults.length > 0 && !searchResultState.isLoading) ?
                 (
                     <div className="search__results__list">
                         
                        {
                            searchResultState.searchResults.map((result: any, index: number) => {
                                <div className="search__result" key={index}>
                                    
                                </div>
                            })
                        }

                     </div>
                 ) : null
            }

        </div>
    )
}

export default SearchResults
