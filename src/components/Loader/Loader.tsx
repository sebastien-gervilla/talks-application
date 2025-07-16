// Librairies
import { FC } from 'react';
import { LoaderCircle } from 'lucide-react';

// Application
import './loader.scss';

interface Props {
    size?: number
}

const Loader: FC<Props> = ({ size = 40 }) => {
    return (
        <div className='loader'>
            <LoaderCircle
                size={size}
            />
        </div>
    );
};

export default Loader;