import './Home.css';
import React from 'react'
import SideBar from './Sidebar/SideBar';
import MainChatScreen from './MainChatScreen/MainChatScreen';

const Home = () => {
    return (
        <div className="main__container home__container">
           {/* Side Bar When Clicked on profile */}
            <SideBar />

            {/* Side Bar When Clicked on profile */}
            <MainChatScreen />
        </div>
    )
}

export default Home;
