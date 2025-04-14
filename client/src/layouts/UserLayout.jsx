import LinkComponents from '../components/LinkComponents';
import { Outlet } from 'react-router-dom';
import { UserContext } from '../contexts/UserContexts';
import { useContext } from 'react';
import axios from 'axios';
function UserLayout() {
    const { userProfile } = useContext(UserContext);
    function handleLogout() {
        localStorage.removeItem('token');
        try {
            axios.get(`${import.meta.env.VITE_API_URL}/users/logout`);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {/* navbar */}
            <div className="pl-10 flex flex-row justify-between p-4 bg-moca3 border-b-2 text-moca1 border-moca1">
                <div className="flex flex-row gap-10">
                    <LinkComponents
                        name="Home"
                        link=""
                    />
                    <LinkComponents
                        name="Produk"
                        link="produk"
                    />
                    <LinkComponents
                        name="Penjualan"
                        link="penjualan"
                    />
                    <LinkComponents
                        name="Pelanggan"
                        link="pelanggan"
                    />
                </div>
                <div className="flex flex-row gap-10 items-center">
                    <div>{userProfile?.name}</div>
                    <form>
                        <button
                            type="submit"
                            onClick={handleLogout}
                            className="text-moca1 px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                            Logout
                        </button>
                    </form>
                </div>
            </div>

            {/* content */}
            <div className="min-h-lvh bg-moca4">
                <Outlet />
            </div>
        </>
    );
}

export default UserLayout;
