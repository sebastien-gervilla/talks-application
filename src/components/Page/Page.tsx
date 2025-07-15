// Librairies
import { FC, ReactNode } from 'react';

// Application
import './page.scss';

interface Props {
    id: string;
    children: ReactNode;
}

const Page: FC<Props> = ({ id, children }) => {
    return (
        <section id={id} className='page'>
            {children}
        </section>
    );
};

export default Page;