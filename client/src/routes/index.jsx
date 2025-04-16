import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/loginPage/LoginPage';
import UserLayout from '../layouts/UserLayout';
import ProdukPage from '../pages/dashboard/produk/ProdukPage';
import PenjualanPage from '../pages/dashboard/penjualan/PenjualanPage';
import PelangganPage from '../pages/dashboard/pelanggan/PelangganPage';
import DashboardPage from '../pages/dashboard/index/DashboardPage';
import PrivateRoute from '../components/PrivateRoute';
import UsersPage from '../pages/dashboard/users/UsersPage';
const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage />,
    },
    {
        path: '/dashboard',
        element: <PrivateRoute />,
        children: [
            {
                element: <UserLayout />,
                children: [
                    {
                        path: '',
                        element: <DashboardPage />,
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
                        element: <PelangganPage />,
                    },
                    {
                        path: 'users',
                        element: <UsersPage />,
                    },
                ],
            },
        ],
    },
]);

export default router;
