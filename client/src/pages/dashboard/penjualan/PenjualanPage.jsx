import PenjualanCard from '../../../components/PenjualanCard';
import LinkComponents from '../../../components/LinkComponents';
import { useState, useEffect } from 'react';
import axios from 'axios';
import getCurrentDateTime from '../../../helper/getCurrentDateTime';
import reset from '../../../assets/reset.svg';
import InputComponents from '../../../components/InputComponents';
import formatDate from '../../../helper/formatDate';

function PenjualanPage() {
    const [pelangganID, setPelangganID] = useState('');
    const [pelangganList, setPelangganList] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [isItems, setIsItems] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [insertPenjualanData, setInsertPenjualanData] = useState({
        TanggalPenjualan: '',
        TotalHarga: '',
        PelangganID: '',
        details: [],
    });
    const [oneToManyData, setOneToManyData] = useState([]);
    const [updatePenjualanData, setUpdatePenjualanData] = useState({
        PenjualanID: '',
        TanggalPenjualan: '',
        TotalHarga: '',
        PelangganID: '',
        details: [],
    });
    const [historyData, setHistoryData] = useState([]);
    const [searchHistoryValue, setSearchHistoryValue] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
    });

    console.log(updatePenjualanData);

    useEffect(() => {
        const fetchPelanggan = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/pelanggan/showall`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPelangganList(response.data.data || []);
            } catch (error) {
                console.error('Gagal mengambil data pelanggan:', error);
            }
        };
        fetchPelanggan();
    }, [refreshProduct]); // Refresh saat ada perubahan data

    useEffect(() => {
        if (selectedId && oneToManyData && Array.isArray(oneToManyData.data) && oneToManyData.data.length > 0) {
            const newDetails = oneToManyData.data.map((item) => ({
                DetailID: item.DetailID,
                ProdukID: item.ProdukID,
                JumlahProduk: item.JumlahProduk,
                Subtotal: parseInt(item.Subtotal),
            }));

            const totalHarga = newDetails.reduce((acc, item) => acc + item.Subtotal, 0);

            setUpdatePenjualanData({
                PenjualanID: selectedId?.PenjualanID,
                TanggalPenjualan: oneToManyData.data[0]?.created_at || '',
                TotalHarga: totalHarga,
                PelangganID: oneToManyData.data[0]?.penjualan?.pelanggan?.PelangganID || '',
                details: newDetails,
            });

            const converted = {};
            oneToManyData.data.forEach((item) => {
                converted[item.ProdukID] = {
                    ProdukID: item.ProdukID,
                    JumlahProduk: item.JumlahProduk,
                    Subtotal: parseInt(item.Subtotal),
                };
            });
            setSelectedItems(converted);
        }
    }, [oneToManyData, selectedId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/penjualan/showonetomany`, selectedId, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOneToManyData(response.data);
            } catch (error) {
                if (error.message) console.error(error.message);
            }
        };
        fetchData();
    }, [selectedId]);
    useEffect(() => {
        const newDetails = Object.values(selectedItems);
        const totalHarga = newDetails.reduce((acc, item) => acc + item.Subtotal, 0);

        const now = getCurrentDateTime();

        setInsertPenjualanData((prev) => ({
            ...prev,
            TanggalPenjualan: now,
            TotalHarga: totalHarga,
            details: newDetails,
        }));
    }, [selectedItems]);
    // useEffect "terbaru" (sudah ada paginasi)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, historyRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/products/showall`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/penjualan/showall`, {
                        params: {
                            page: pagination.currentPage,
                            perPage: pagination.perPage,
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }),
                ]);

                // Filter duplikat berdasarkan PenjualanID
                const uniqueHistoryData = historyRes.data.data.filter((item, index, self) => index === self.findIndex((t) => t.PenjualanID === item.PenjualanID));

                setProducts(productsRes.data.data || []);
                setHistoryData(uniqueHistoryData);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: historyRes.data.pagination?.lastPage || 1,
                }));
            } catch (error) {
                console.error('Fetch error:', error);
                setHistoryData([]);
            }
        };
        fetchData();
    }, [refreshProduct, pagination.currentPage, pagination.perPage]);

    function handleSelect(id) {
        const selectedProduct = products.find((p) => p.ProdukID === id);

        setSelectedItems((prev) => {
            const updatedItems = { ...prev };

            if (updatedItems[id]) {
                // Jika sudah ada, hapus dari keranjang
                delete updatedItems[id];
            } else {
                // Tambahkan dengan default jumlah 1 dan subtotal
                updatedItems[id] = {
                    ProdukID: selectedProduct.ProdukID,
                    JumlahProduk: 1,
                    Subtotal: parseInt(selectedProduct.Harga),
                };
            }

            return updatedItems;
        });
    }

    function handleHistory() {
        setIsItems(isItems == true ? false : true);
    }

    function handleIncrease(id) {
        setSelectedItems((prev) => {
            const updated = { ...prev };
            updated[id].JumlahProduk += 1;
            updated[id].Subtotal = updated[id].JumlahProduk * products.find((p) => p.ProdukID === parseInt(id)).Harga;
            return updated;
        });
    }

    function handleDecrease(id) {
        setSelectedItems((prev) => {
            const updated = { ...prev };
            if (updated[id].JumlahProduk > 1) {
                updated[id].JumlahProduk -= 1;
                updated[id].Subtotal = updated[id].JumlahProduk * products.find((p) => p.ProdukID === parseInt(id)).Harga;
            } else {
                delete updated[id];
            }
            return updated;
        });
    }

    function handleIncreaseUpdate(id) {
        setUpdatePenjualanData((prev) => {
            const updatedDetails = prev.details.map((item) => {
                if (item['ProdukID'] == id) {
                    const harga = products.find((p) => p.ProdukID == id)?.Harga || 0;
                    const jumlahBaru = item['JumlahProduk'] + 1;
                    return {
                        ...item,
                        JumlahProduk: jumlahBaru,
                        Subtotal: jumlahBaru * harga,
                    };
                }
                return item;
            });

            const totalHargaBaru = updatedDetails.reduce((acc, item) => acc + item.Subtotal, 0);

            return {
                ...prev,
                details: updatedDetails,
                TotalHarga: totalHargaBaru,
            };
        });
    }

    function handleDecreaseUpdate(id) {
        setUpdatePenjualanData((prev) => {
            let updatedDetails = prev.details.map((item) => {
                if (item['ProdukID'] == id) {
                    const harga = products.find((p) => p.ProdukID == id)?.Harga || 0;
                    const jumlahBaru = item['JumlahProduk'] - 1;
                    return {
                        ...item,
                        JumlahProduk: jumlahBaru,
                        Subtotal: jumlahBaru * harga,
                    };
                }
                return item;
            });

            // Filter keluar produk yang jumlahnya <= 0
            updatedDetails = updatedDetails.filter((item) => item.JumlahProduk > 0);

            const totalHargaBaru = updatedDetails.reduce((acc, item) => acc + item.Subtotal, 0);

            return {
                ...prev,
                details: updatedDetails,
                TotalHarga: totalHargaBaru,
            };
        });
    }

    function handleReset() {
        setSelectedItems({});
    }

    const handleHardClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    async function handleSubmit() {
        try {
            setIsSubmitLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/penjualan/store`, insertPenjualanData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setInsertPenjualanData({
                TanggalPenjualan: '',
                TotalHarga: '',
                PelangganID: pelangganID,
                details: [],
            });
            setSelectedItems({});
            setIsSubmitLoading(false);
            setRefreshProduct(!refreshProduct);
        } catch (error) {
            if (error.message) console.error(error.message);
        }
    }

    async function handleSearchProduk(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/products/search`,
                {
                    search: searchValue,
                    page: 1,
                    perPage: 20, // Sesuaikan sesuai kebutuhan
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setProducts(response.data.data);
            setPagination((prev) => ({
                ...prev,
                currentPage: response.data.pagination?.currentPage || 1,
                totalPages: response.data.pagination?.lastPage || 1,
            }));
        } catch (error) {
            console.error('Search error:', error);
        }
    }
    const handleSearchHistory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/penjualan/search`,
                {
                    search: searchHistoryValue,
                    page: 1,
                    perPage: pagination.perPage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            // Filter duplikat di frontend (fallback)
            const uniqueHistoryData = response.data.data.filter((item, index, self) => index === self.findIndex((t) => t.PenjualanID === item.PenjualanID));

            setHistoryData(uniqueHistoryData);
            setPagination((prev) => ({
                ...prev,
                currentPage: response.data.pagination?.currentPage || 1,
                totalPages: response.data.pagination?.lastPage || 1,
            }));
        } catch (error) {
            console.error('Search error:', error);
            setHistoryData([]);
        }
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };
    // tampilkan pagination di jsx
    const renderPagination = () => (
        <div className="flex items-center justify-center p-2">
            <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="p-2 disabled:opacity-50"
                disabled={pagination.currentPage === 1}>
                {'<'}
            </button>
            <div className="border p-1 rounded-full w-7 h-7 flex justify-center items-center">{pagination.currentPage}</div>
            <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="p-2 disabled:opacity-50"
                disabled={pagination.currentPage === pagination.totalPages}>
                {'>'}
            </button>
        </div>
    );
    async function handleUpdate() {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/penjualan/update`, updatePenjualanData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setSelectedItems({});
            setSelectedId(null);
            setRefreshProduct(!refreshProduct);
        } catch (error) {
            if (error.message) console.error(error.message);
        }
    }

    const handleDelete = async () => {
        try {
            if (!selectedId?.PenjualanID) return;
            if (!window.confirm('Hapus transaksi ini?')) return;

            await axios.delete(`${import.meta.env.VITE_API_URL}/penjualan/delete`, {
                data: { PenjualanID: selectedId.PenjualanID },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Refresh data dan reset selection
            setSelectedId(null);
            setRefreshProduct(!refreshProduct);
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <>
            {isItems ? (
                <div className="flex flex-row p-3 justify-between gap-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-5 justify-between">
                            <div className="w-10 ">
                                <button
                                    onClick={() => setRefreshProduct(!refreshProduct)}
                                    className="w-full h-full flex justify-center items-center bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
                                    <img
                                        className="w-5"
                                        src={reset}
                                    />
                                </button>
                            </div>
                            <div className="w-full">
                                <input
                                    type="text"
                                    value={searchValue}
                                    className="outline-none w-full p-1 pl-5 bg-moca3 border-2 border-moca1 rounded-full transition-all duration-100 focus:bg-moca1 focus:border-moca2 focus:text-moca4"
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                            <div className="w-10">
                                <button
                                    onClick={handleSearchProduk}
                                    className="w-full h-full bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
                                    {'->'}
                                </button>
                            </div>
                        </div>
                        <div className="w-[70vw] flex-wrap border-2 flex flex-row justify-center gap-10 p-3 border-moca1 rounded">
                            {products.map((product) => (
                                <div
                                    key={product.ProdukID}
                                    onClick={() => handleSelect(product.ProdukID)}
                                    className={`cursor-pointer rounded transition-all duration-200 ${selectedItems[product.ProdukID] ? 'bg-moca3' : ''}`}>
                                    <PenjualanCard
                                        NamaProduk={product.NamaProduk}
                                        Harga={product.Harga}
                                        Stok={product.Stok}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div
                            onClick={handleHistory}
                            className="p-1 border-2 border-moca1 hover:bg-moca3 transition-all duration-150 rounded-2xl">
                            <div className="text-center">history</div>
                        </div>
                        <div className="w-[26vw] bg-moca2 border-2 flex flex-col justify-between items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                            <div className="w-full p-3 flex flex-col gap-4 h-full overflow-y-scroll">
                                {/* list */}
                                {Object.entries(selectedItems).map(([id, item]) => {
                                    const product = products.find((p) => p.ProdukID === parseInt(id));

                                    return (
                                        <div
                                            key={id}
                                            className="flex flex-row justify-between text-moca4 bg-moca1 rounded p-2">
                                            <div>{product?.NamaProduk || 'Produk tidak ditemukan'}</div>
                                            <div className="flex gap-3">
                                                <div>|</div>
                                                <div>{item.Subtotal}</div>
                                                <div>|</div>
                                            </div>
                                            <div className="grid grid-cols-3 justify-between gap-3">
                                                <div
                                                    className="bg-moca3 rounded-full text-moca1 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca2"
                                                    onClick={() => handleDecrease(id)}>
                                                    -
                                                </div>
                                                <div>{item.JumlahProduk}</div>
                                                <div
                                                    className="bg-moca3 rounded-full text-moca1 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca2"
                                                    onClick={() => handleIncrease(id)}>
                                                    +
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* end list */}
                            </div>
                            <div className="flex-col gap-4">
                                <div className="w-full mb-4">
                                    <select
                                        value={insertPenjualanData.PelangganID}
                                        onChange={(e) =>
                                            setInsertPenjualanData((prev) => ({
                                                ...prev,
                                                PelangganID: e.target.value,
                                            }))
                                        }
                                        className="w-full p-2 bg-moca4 border-2 outline-none border-moca1 rounded">
                                        <option value="">Pilih Pelanggan</option>
                                        {pelangganList.map((pelanggan) => (
                                            <option
                                                key={pelanggan.PelangganID}
                                                value={pelanggan.PelangganID}>
                                                {pelanggan.NamaPelanggan}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex">
                                    <div>
                                        <button
                                            className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95"
                                            onClick={handleSubmit}>
                                            {isSubmitLoading ? <div className="animate-pulse">Loading...</div> : 'Selesai'}
                                        </button>{' '}
                                    </div>
                                    <div onClick={() => handleReset()}>
                                        <LinkComponents name="Reset" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row p-3 justify-between gap-3">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-row gap-5 justify-between">
                            <div className="w-10 ">
                                <button
                                    onClick={() => setRefreshProduct(!refreshProduct)}
                                    className="w-full h-full flex justify-center items-center bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
                                    <img
                                        className="w-5"
                                        src={reset}
                                    />
                                </button>
                            </div>
                            <div className="w-full">
                                <input
                                    type="text"
                                    value={searchHistoryValue}
                                    className="outline-none w-full p-1 pl-5 bg-moca3 border-2 border-moca1 rounded-full transition-all duration-100 focus:bg-moca1 focus:border-moca2 focus:text-moca4"
                                    onChange={(e) => setSearchHistoryValue(e.target.value)}
                                />
                            </div>
                            <div className="w-10">
                                <button
                                    onClick={handleSearchHistory}
                                    className="w-full h-full bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
                                    {'->'}
                                </button>
                            </div>
                            <div
                                onClick={handleHistory}
                                className="p-1 border-2 border-moca1 hover:bg-moca3 transition-all duration-150 rounded-2xl">
                                <div className="text-center">Kembali</div>
                            </div>
                        </div>
                        <div className="w-full flex-wrap border-2 flex flex-row justify-center gap-10 p-3 border-moca1 rounded">
                            <div>
                                <table>
                                    <thead className="border-b-2">
                                        <tr className="text-left">
                                            <th className="p-2 border-r-2">ID</th>
                                            <th className="p-2">Nama Pelanggan</th>
                                            <th className="p-2">Total</th>
                                            <th className="p-2">Kasir</th>
                                            <th className="p-2">Terakhir Diupdate</th>
                                            <th className="p-2">Dibuat Pada</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="p-2 text-center">
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        ) : (
                                            historyData.map((history) => {
                                                return (
                                                    <tr
                                                        key={history.DetailID} // Fallback ID
                                                        onClick={() => handleHardClick(history)}
                                                        className={`hover:bg-moca3 cursor-grab transition-all duration-100 ${selectedId === history ? 'bg-moca3' : ''}`}>
                                                        <td className="p-2 border-r-2">{history?.penjualan?.PenjualanID}</td>
                                                        <td className="p-2">{history?.penjualan?.pelanggan?.NamaPelanggan || '-'}</td>
                                                        <td className="p-2">{history?.penjualan?.TotalHarga ? parseInt(history.penjualan.TotalHarga) : '-'}</td>
                                                        <td className="p-2">{history?.user?.name || '-'}</td> <td className="p-2">{formatDate(history.updated_at)}</td>
                                                        <td className="p-2">{formatDate(history.created_at)}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>

                                {renderPagination()}
                            </div>
                        </div>
                    </div>
                    {selectedId === null ? null : (
                        <div className="w-[26vw] bg-moca2 border-2 flex flex-col justify-between items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                            <div className="w-full p-3 flex flex-col gap-4">
                                {updatePenjualanData.details.map((item) => {
                                    const id = item.ProdukID;
                                    const product = products.find((p) => p.ProdukID === parseInt(id));
                                    return (
                                        <div
                                            key={id}
                                            className="flex flex-row justify-between text-moca4 bg-moca1 rounded p-2">
                                            <div>{product?.NamaProduk || 'Produk tidak ditemukan'}</div>
                                            <div className="flex gap-3">
                                                <div>|</div>
                                                <div>{item.Subtotal}</div>
                                                <div>|</div>
                                            </div>
                                            <div className="grid grid-cols-3 justify-between gap-3">
                                                <div
                                                    className="bg-moca3 rounded-full text-moca1 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca2"
                                                    onClick={() => handleDecreaseUpdate(id)}>
                                                    -
                                                </div>
                                                <div>{item.JumlahProduk}</div>
                                                <div
                                                    className="bg-moca3 rounded-full text-moca1 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca2"
                                                    onClick={() => handleIncreaseUpdate(id)}>
                                                    +
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="w-full p-4 flex gap-2">
                                <button
                                    className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95"
                                    onClick={() => handleUpdate()}>
                                    Ubah
                                </button>
                                <button
                                    className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-red-600 transition duration-300 hover:bg-red-600 hover:text-[#FEF9E1] hover:shadow-lg active:scale-95"
                                    onClick={handleDelete}>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default PenjualanPage;
