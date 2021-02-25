import { useEffect, useState } from 'react';
import './IsTypingMessage.css';

//Common Carousal Interval
let carouselInterval: any = undefined;
let dotSwitchDelay: number = 400;

//Set initially to 0
let waitingDotIndex = 0;

const IsTypingMessage = (props: any) => {
    
    const waitingDots = [1,2,3];
    const [selectedDot, setSelectedDot] = useState(0);

    const dotIterator = () => {
        if(carouselInterval !== undefined)
        return;

        carouselInterval = setInterval(() => {

            if (waitingDotIndex === waitingDots.length - 1) {
                waitingDotIndex = 0;
            } else {
                waitingDotIndex += 1;
            }

            setSelectedDot(waitingDotIndex);

        }, dotSwitchDelay);
    }

    useEffect(() => {
        dotIterator();
        return () => {
            if(carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = undefined;
            }
            
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
