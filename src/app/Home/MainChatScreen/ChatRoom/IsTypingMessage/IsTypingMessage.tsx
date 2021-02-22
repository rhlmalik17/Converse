import { useEffect, useState } from 'react';
import './IsTypingMessage.css';

const IsTypingMessage = (props: any) => {
    
    const waitingDots = [1,2,3];
    const [selectedDot, setSelectedDot] = useState(0);

    //Common Carousal Interval
    let carouselInterval: any = undefined;
    let dotSwitchDelay: number = 600;

    const dotIterator = () => {
        if(carouselInterval !== undefined)
        return;
        
        carouselInterval = setInterval(() => {
            let newIndex = selectedDot + 1;

            if(newIndex === waitingDots.length) {
                setSelectedDot(0);
            } else {
                setSelectedDot(newIndex);
            }
        
        }, dotSwitchDelay);
    }

    useEffect(() => {
        dotIterator();
        return () => {
            if(carouselInterval)
            clearInterval(carouselInterval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="is__typing__message">
            <span>{ (props.username || "") } is typing</span>

            <div className="waiting__dots">
                {
                    waitingDots.map((dot: any, index: number) => (
                        <div key={index} 
                        className={"waiting__dot " + ((selectedDot === index) ? "selected__waiting__dot" : "") }
                        ></div>
                    ))
                }
            </div>
        </div>
    )
}

export default IsTypingMessage
