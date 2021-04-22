import Skeleton from '@material-ui/lab/Skeleton'
import {  useState } from 'react';
import './MessagesSkeleton.css'


const MessagesSkeleton = () => {
    const [skeletonMessages] = useState<Array<number>>(new Array<number>(10).fill(0));

    const getRandomDimensions = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;;
    }

    return (
        <>
            {
                skeletonMessages.map((value: number, index: number) => (
                    <Skeleton 
                    height={`${getRandomDimensions(40, 50)}px`} 
                    width={`${getRandomDimensions(10, 50)}%`} 
                    className="message__skeleton" variant="rect" key={index} />
                ))
            }
        </>
    )
}

export default MessagesSkeleton;
