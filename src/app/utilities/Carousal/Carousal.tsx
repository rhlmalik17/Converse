import './Carousal.css'
import illusOne from "../../../assets/carousal/0.svg";
import illusTwo from "../../../assets/carousal/1.svg";
import illusThree from "../../../assets/carousal/2.svg";
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';

export const CarouselDotBroadCaster = new Subject();
//Add all the images here
export const carouselImages = [
    illusOne,
    illusTwo,
    illusThree
];

//Common Carousal Interval
let carouselInterval: any = undefined;

//Total Carousel Translation
let translatedCarousel: number = 0;


const Carousal = () => {

    //Component Hooks
    const [translationX, setTranslationX] = useState({ index: 0, translation: 0, transitionDuration: "none" });

    //Transition Delay In Seconds
    const transitionDelay: number = 2 * 1100;

    //Transition Duration
    let transitionDuration: string = "2s ease";

    //Image Width in percentage
    let imageWidth = 100;

    const handleTransitionEnds = (event: any) => {
        if(translatedCarousel <= (carouselImages.length * imageWidth * -1)) {
            //Last slide
            translatedCarousel = 0;
            setTranslationX({ index: 0, translation: translatedCarousel, transitionDuration: "none" });
        }
    }

    const carouselIterator = () => {
        if(carouselInterval !== undefined)
        return;
                
        let carouselWindow = document.getElementById("carousal-window");
        carouselWindow?.addEventListener("transitionend", handleTransitionEnds);

        carouselInterval = setInterval(() => {

            if(translatedCarousel > (imageWidth * carouselImages.length * -1))
            translatedCarousel -= imageWidth;
            
            let newIndex = (translatedCarousel / imageWidth) * -1;
            
            if(newIndex >= carouselImages.length) {
                newIndex = 0;
            }

            transitionDuration = "2s ease";
            setTranslationX({ index: newIndex, translation: translatedCarousel, transitionDuration: transitionDuration });
        }, transitionDelay);
    }

    useEffect(() => {
        carouselIterator();

        return () => {
            if(carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = undefined;
            }
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="carousal__parent overflow-hidden">
            <div style={{ transform: `translateX(${translationX.translation}%)`, transition: `${translationX.transitionDuration}` }} id="carousal-window" className="carousal__window">
                {
                    carouselImages.map((illus, index) => (
                        <div key={index} className="carousal__slide">
                            <img src={illus} alt="" />
                        </div>
                    ))
                }

                {(carouselImages.length > 0) ? (
                    <div className="carousal__slide">
                        <img src={carouselImages[0]} alt="" />
                    </div>
                ) : null}
            </div>

            <div className="d-flex  justify-content-center carousal__dots__container">
                <div className="carousal__dots align-items-center d-flex justify-content-between">
                    {
                        carouselImages.map((illus, index) => (
                            <div key={index} className={"dot" + ((translationX.index === index) ? " selected__dot" : '')} ></div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Carousal;
