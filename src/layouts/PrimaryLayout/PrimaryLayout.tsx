// Librairies
import { FC, ReactNode } from 'react';

// Application
import './primary-layout.scss';
import { Sidebar } from '@/components/Sidebar';

interface Props {
    children: ReactNode;
    isSidebarReduced: boolean;
}

const PrimaryLayout: FC<Props> = ({ children, isSidebarReduced }) => {
    return (
        <section className='primary-layout'>
            <Sidebar isReduced={isSidebarReduced} />
            <main>
                {children}
            </main>
        </section>
    );
}

export default PrimaryLayout;