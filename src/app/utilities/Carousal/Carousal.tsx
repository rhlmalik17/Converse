import './Carousal.css'
import illusOne from "../../../assets/carousal/0.svg";
import illusTwo from "../../../assets/carousal/1.svg";
import illusThree from "../../../assets/carousal/2.svg";
import { useEffect } from 'react';
import { Subject } from 'rxjs';

export const CarouselDotBroadCaster = new Subject();
//Add all the images here
export const carouselImages = [
    illusOne,
    illusTwo,
    illusThree
];

const Carousal = () => {

    //Transition Delay In Seconds
    const transitionDelay = 2 * 1000;
    
    //Current X-axis translation in %age
    let translationX = 0;

    useEffect(() => {
        let carouselWindow = document.getElementById("carousal-window");
        let carouselDots = document.querySelectorAll(".dot");
        if(!carouselWindow || carouselDots.length < 1)
        return;

        
        setInterval(() => {
            if(!carouselWindow)
            return;

            if(translationX === ((carouselImages.length) * -100)) {
                carouselWindow.style.transition = "none";
                translationX = 0;
                carouselWindow.style.transform = `translateX(${translationX}%)`;
                return;
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
            translationX -= 100;   
            let dotIndex = ((translationX / 100));
            dotIndex = dotIndex * (dotIndex < 0 ? -1 : 1); 
            CarouselDotBroadCaster.next(dotIndex === carouselImages.length ? 0 : dotIndex);
            carouselWindow.style.transition = "1s ease";
            carouselWindow.style.transform = `translateX(${translationX}%)`;
        }, transitionDelay);

    }, []);


    return (
        <div className="carousal__parent overflow-hidden">
            <div className="carousal__window " id="carousal-window">
                {
                    carouselImages.map((illus, index) => (
                        <div key={index} className="carousal__slide">
                            <img src={illus} alt="" />
                        </div>
                    ))
                }

                { (carouselImages.length > 0) ? (
                    <div className="carousal__slide">
                        <img src={carouselImages[0]} alt="" />
                    </div>
                ) : null }
            </div>
        </div>
    )
}

export default Carousal;
