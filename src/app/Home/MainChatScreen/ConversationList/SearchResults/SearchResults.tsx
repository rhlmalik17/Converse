import { useState } from 'react'
import './SearchResults.css'
import searchLoader from "../../../../../assets/home/loader.svg"
import noSearchResults from "../../../../../assets/home/no-search-results.svg"
import defaultProfileImage from "../../../../../assets/home/default-profile-picture.svg";

const SearchResults = (props: any) => {
    const [searchResultState ] = useState<any>({
        isLoading: false,
        searchResults: [{ first_name: "Michael", last_name: "Wong", email: "wong.michael@gmail.com" },
        { first_name: "Michael", last_name: "Wong", email: "wong.michael@gmail.com" }]
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
                     <div className="search__results__list w-100">
                         
                        {
                            searchResultState.searchResults.map((result: any, index: number) => (
                                <div className="search__result" key={index}>
                                        <div className="selected__border"></div>
                                        <div className="conversation__card mb-2">
                                            <div className="conversation__img position-relative">
                                                <img className="profile-img" alt="" src={result.profile_image_url || defaultProfileImage} />
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
