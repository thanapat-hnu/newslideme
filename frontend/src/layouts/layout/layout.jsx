import { Outlet } from 'react-router';

import Footer from '../footer/footer';

import './layout.css'

function Layout() {
    return (
        <div className='container-layout'>
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;