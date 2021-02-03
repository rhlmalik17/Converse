import Carousal from '../utilities/Carousal/Carousal';
import CarousalDots from '../utilities/Carousal/CarousalDots';
import './Authentication.scss';

const Authentication = () => {

    return (
        <div className={"main__container"}>
            <div className={"auth__container"}>

                <div className={"auth__carousal d-flex flex-column"}>

                    <div className={"auth__carousal__parent d-flex align-items-end justify-content-center"}>
                        <div className={"auth__carousal__container"}>
                            <Carousal />
                            <CarousalDots />
                        </div>
                    </div>

                </div>

                <div className="auth__forms">

                </div>

            </div>
        </div>
    )
}

export default Authentication;