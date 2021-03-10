import './HomeSkeletonLoader.css'
import Skeleton from '@material-ui/lab/Skeleton';

const HomeSkeletonLoader = () => {
    const skeletonConversationList: Array<any> = new Array<any>(4).fill(null);

    return (
        <div className="skeleton__parent d-flex h-100 w-100">
            <div className="skeleton__conversations">
                    <Skeleton className="skeleton__search" variant="rect" width={'100%'} height={40} />
                   
                <div className="skeleton__conversation__list mt-5">
                    {
                        skeletonConversationList.map((conversation: any, index: number) => (
                            <div className="skeleton__conversation mt-3 d-flex" key={index}>
                                <Skeleton variant="circle" width={40} height={40} />
                                <Skeleton className="ml-2" variant="rect" width={'84%'} height={40} />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="skeleton__chat__window">
            <Skeleton className="skeleton__search" variant="rect" width={'100%'} height={'100%'} />
            </div>
        </div>
    )
}

export default HomeSkeletonLoader;
