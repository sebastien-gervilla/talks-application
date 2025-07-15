// Librairies
import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Application
import { Login, Register, Conferences, Speakers } from '@/pages';
import { RouteSegment } from './types';
import ProtectedRoute from './ProtectedRoute';

const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path={`/${RouteSegment.Register}`} element={<Register />} />
                <Route path={`/${RouteSegment.Login}`} element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path={`/${RouteSegment.Conferences}`} element={<Conferences />} />
                    <Route path={`/${RouteSegment.Speakers}`} element={<Speakers />} />

                    <Route path='*' element={<Conferences />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default Router;