import { useState, useEffect } from "react";
import { CarouselDotBroadCaster, carouselImages } from "./Carousal";
import "./Carousal.css"

const CarousalDots = () => {
    const [dotIndex, setDotIndex] = useState(0);
        
    let carouselDotSubscription = CarouselDotBroadCaster.subscribe((index: any) => {
        setDotIndex(index);
    });

    useEffect(() => {
        return () => {
            /* UNSUBSCRIBE THE SUBSCRIPTIONS */
            carouselDotSubscription.unsubscribe();
        }
    }, [carouselDotSubscription]);

    return (
        <div className="d-flex  justify-content-center carousal__dots__container">
            <div className="carousal__dots align-items-center d-flex justify-content-between">
                {
                    carouselImages.map((illus, index) => (
                        <div key={index} className={"dot" + ((dotIndex === index) ? " selected__dot" : '')} ></div>
                    ))
                }
            </div>
        </div>
    )
}

export default CarousalDots;
