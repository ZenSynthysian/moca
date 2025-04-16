import user from '../../../assets/user.svg';
import product from '../../../assets/product.svg';
import cart from '../../../assets/cart.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import formatDate from '../../../helper/formatDate'; // Tambahkan di bagian atas file

function DashboardPage() {
    const [produk, setProduk] = useState([]);
    const [pelanggan, setPelanggan] = useState([]);
    const [penjualan, setPenjualan] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Promise.allSettled([
                    axios.get(`${import.meta.env.VITE_API_URL}/products/showall`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/pelanggan/showall`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/penjualan/showall`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }),
                ]);
                console.log(response);
                response[0].status == 'fulfilled' ? setProduk(response[0].value.data.data) : setProduk([]);
                response[1].status == 'fulfilled' ? setPelanggan(response[1].value.data.data) : setPelanggan([]);
                response[2].status == 'fulfilled' ? setPenjualan(response[2].value.data.data) : setPenjualan([]);
                setIsLoading(false);
            } catch (error) {
                if (error.message) {
                    console.log(error.message);
                }
            }
        }
        fetchData();
    }, []);
    return (
        <>
            <div className="flex flex-col">
                <div className="flex gap-3 p-5 justify-between items-center text-center">
                    <div className="w-[33vw] flex-col justify-center items-center gap-5 border-2 rounded">
                        <div className="p-2 border-b-2 bg-moca1 text-moca3">PELANGGAN</div>
                        <div className="p-2">
                            <img
                                src={user}
                                alt="Pelanggan"
                                className="w-32 h-32 mx-auto"
                            />
                        </div>
                        <div className="p-2 bg-moca3">{isLoading ? <div className="animate-pulse">Loading...</div> : pelanggan?.length}</div>
                    </div>
                    <div className="w-[33vw] flex-col justify-center items-center gap-5 border-2 rounded">
                        <div className="p-2 border-b-2 bg-moca1 text-moca3">PRODUK</div>
                        <div className="p-2">
                            <img
                                src={product}
                                alt="Produk"
                                className="w-32 h-32 mx-auto"
                            />
                        </div>
                        <div className="p-2 bg-moca3">{isLoading ? <div className="animate-pulse">Loading...</div> : produk?.length}</div>
                    </div>
                    <div className="w-[33vw] flex-col justify-center items-center gap-5 border-2 rounded">
                        <div className="p-2 border-b-2 bg-moca1 text-moca3">PENJUALAN</div>
                        <div className="p-2">
                            <img
                                src={cart}
                                alt="Penjualan"
                                className="w-32 h-32 mx-auto"
                            />
                        </div>
                        <div className="p-2 bg-moca3">{isLoading ? <div className="animate-pulse">Loading...</div> : penjualan?.length}</div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="w-full flex justify-center items-center">
                        <table className="w-[80vw] border-2 rounded-2xl">
                            <thead className="border-b-2 text-left bg-moca1 shadow-2xl">
                                <tr>
                                    <th className="text-moca3 p-2 border-r-2">ID</th>
                                    <th className="text-moca3 p-2">Nama Pelanggan</th>
                                    <th className="text-moca3 p-2">Total</th>
                                    <th className="text-moca3 p-2">Kasir</th>
                                    <th className="text-moca3 p-2">Terakhir Diupdate</th>
                                    <th className="text-moca3 p-2">Dibuat Pada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {penjualan.map((history) => (
                                    <tr
                                        key={history.PenjualanID}
                                        className={history.PenjualanID % 2 === 0 ? 'bg-moca3' : ''}>
                                        {console.log(history)}
                                        <td className="pl-2 border-r-2">{history.PenjualanID}</td>
                                        <td className="pl-2">{history.pelanggan?.NamaPelanggan || 'Anonim'}</td>
                                        <td className="pl-2">Rp{parseInt(history?.penjualan?.TotalHarga).toLocaleString('id-ID')}</td>
                                        <td className="pl-2">{history.user?.name || '-'}</td>
                                        <td className="pl-2">{formatDate(history.updated_at)}</td>
                                        <td className="pl-2">{formatDate(history.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>{' '}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;
