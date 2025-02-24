import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/loginPage/LoginPage';
import UserLayout from '../layouts/UserLayout';
import ProdukPage from '../pages/dashboard/produk/ProdukPage';
import PenjualanPage from '../pages/dashboard/penjualan/PenjualanPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    {
        path: '/dashboard',
        element: <UserLayout />,
        children: [
            {
                path: '',
                element: <div>dashboard</div>,
            },
            {
                path: 'produk',
                element: <ProdukPage />,
            },
            {
                path: 'penjualan',
                element: <PenjualanPage />,
            },
            {
                path: 'pelanggan',
                element: <div>pelanggan</div>,
            },
        ],
    },
]);

export default router;
