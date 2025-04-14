import { useEffect, useState } from 'react';
import ProductCard from '../../../components/ProductCard';
import InputComponents from '../../../components/InputComponents';
import axios from 'axios';
import reset from '../../../assets/reset.svg';

function ProdukPage() {
    const [selectedId, setSelectedId] = useState(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [insertProducts, setInsertProducts] = useState({
        NamaProduk: '',
        Harga: '',
        Stok: '',
    });
    const [editProduct, setEditProduct] = useState({
        ProdukID: '',
        NamaProduk: '',
        Harga: '',
        Stok: '',
    });

    useEffect(() => {
        const fetchProduk = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/showall`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProducts(response.data.data);
            } catch (error) {
                if (error.message) {
                    console.log(error.message);
                }
            }
        };
        fetchProduk();
    }, [refreshProduct]);
    console.log(products);

    useEffect(() => {
        if (selectedId !== null) {
            const selectedProduct = products.find((p) => p.ProdukID === selectedId);
            if (selectedProduct) {
                setEditProduct({
                    ProdukID: selectedProduct.ProdukID,
                    NamaProduk: selectedProduct.NamaProduk,
                    Harga: selectedProduct.Harga,
                    Stok: selectedProduct.Stok,
                });
            }
        }
    }, [selectedId, products]);

    const handleHardClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setInsertProducts((prevState) => ({ ...prevState, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitLoading(true);
        await axios.post(`${import.meta.env.VITE_API_URL}/products/store`, insertProducts, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setInsertProducts({
            NamaProduk: '',
            Harga: '',
            Stok: '',
        });

        setIsSubmitLoading(false);
        setRefreshProduct(!refreshProduct);
    }

    async function handleDelete(e) {
        e.preventDefault();
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/delete`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: { ProdukID: selectedId },
        });
        setSelectedId(null);
        setRefreshProduct(!refreshProduct);
    }

    async function handleEditProduk(e) {
        e.preventDefault();
        await axios.put(`${import.meta.env.VITE_API_URL}/products/update`, editProduct, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setRefreshProduct(!refreshProduct);
    }

    async function handleSearchProduk(e) {
        e.preventDefault();
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/products/showone`,
            { NamaProduk: `${searchValue}` },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        setProducts(response.data.data);
    }

    return (
        <>
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
                    <div className="w-[75vw] flex-wrap border-2 flex flex-row justify-center gap-10 p-3 border-moca1 rounded">
                        {products.map((product) => (
                            <ProductCard
                                key={product.ProdukID}
                                id={product.ProdukID}
                                isSelected={selectedId === product.ProdukID}
                                onClick={handleHardClick}
                                namaProduk={product.NamaProduk}
                                harga={product.Harga}
                                stok={product.Stok}
                            />
                        ))}
                    </div>
                </div>
                {selectedId == null ? (
                    // form simpan
                    <div className="w-[25vw] bg-moca2 border-2 flex flex-col justify-center items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                        <form className="w-full">
                            <div className="w-full p-3 flex flex-col gap-4">
                                <InputComponents
                                    name="NamaProduk"
                                    type="text"
                                    placeholder="Nama Produk"
                                    value={insertProducts.NamaProduk}
                                    onChange={handleChange}
                                />
                                <InputComponents
                                    name="Harga"
                                    type="number"
                                    placeholder="Harga"
                                    value={insertProducts.Harga}
                                    onChange={handleChange}
                                />
                                <InputComponents
                                    name="Stok"
                                    type="number"
                                    placeholder="Stok"
                                    value={insertProducts.Stok}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="w-full p-4">
                                <button
                                    className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95"
                                    onClick={handleSubmit}>
                                    {isSubmitLoading ? <div className="animate-pulse">Loading...</div> : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    // form ubah dan hapus
                    <div className="w-[25vw] bg-moca2 border-2 flex flex-col justify-center items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                        <form>
                            <div className="w-full p-3 flex flex-col gap-4">
                                <InputComponents
                                    name="NamaProduk"
                                    type="text"
                                    value={editProduct.NamaProduk}
                                    placeholder="Nama Produk"
                                    onChange={(e) => setEditProduct((prev) => ({ ...prev, NamaProduk: e.target.value }))}
                                />

                                <InputComponents
                                    name="Harga"
                                    type="number"
                                    value={editProduct.Harga}
                                    placeholder="Harga"
                                    onChange={(e) => setEditProduct((prev) => ({ ...prev, Harga: parseInt(e.target.value) }))}
                                />

                                <InputComponents
                                    name="Stok"
                                    type="number"
                                    value={editProduct.Stok}
                                    placeholder="Stok"
                                    onChange={(e) => setEditProduct((prev) => ({ ...prev, Stok: parseInt(e.target.value) }))}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <button
                                        onClick={handleEditProduk}
                                        className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                                        Simpan Perubahan
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleDelete}
                                        className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProdukPage;
