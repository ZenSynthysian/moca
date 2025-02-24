import { useState } from 'react';
import ProductCard from '../../../components/ProductCard';
import InputComponents from '../../../components/InputComponents';
import LinkComponents from '../../../components/LinkComponents';

function ProdukPage() {
    const [selectedId, setSelectedId] = useState(null);

    const handleHardClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    return (
        <>
            <div className="flex flex-row p-3 justify-between gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-5 justify-between">
                        <div className="w-full">
                            <input
                                type="text"
                                className="outline-none w-full p-1 pl-5 bg-moca3 border-2 border-moca1 rounded-full transition-all duration-100 focus:bg-moca1 focus:border-moca2 focus:text-moca4"
                            />
                        </div>
                        <div className="w-10">
                            <button className="w-full h-full bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
                                {'->'}
                            </button>
                        </div>
                    </div>
                    <div className="w-[75vw] flex-wrap border-2 flex flex-row justify-center gap-10 p-3 border-moca1 rounded">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((id) => (
                            <ProductCard
                                key={id}
                                id={id}
                                isSelected={selectedId === id}
                                onClick={handleHardClick}
                            />
                        ))}
                    </div>
                </div>
                {selectedId == null ? (
                    // form simpan
                    <div className="w-[25vw] bg-moca2 border-2 flex flex-col justify-center items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                        <div className="w-full p-3 flex flex-col gap-4">
                            <InputComponents
                                name="namaProduk"
                                type="text"
                                value={''}
                                placeholder="Nama Produk"
                            />
                            <InputComponents
                                name="harga"
                                type="number"
                                value={''}
                                placeholder="Harga"
                            />
                            <InputComponents
                                name="stok"
                                type="number"
                                value={''}
                                placeholder="Stok"
                            />
                        </div>
                        <div className="w-full p-4">
                            <LinkComponents name="simpan" />
                        </div>
                    </div>
                ) : (
                    // form ubah dan hapus
                    <div className="w-[25vw] bg-moca2 border-2 flex flex-col justify-center items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                        <div className="w-full p-3 flex flex-col gap-4">
                            <InputComponents
                                name="namaProduk"
                                type="text"
                                value="Nama Produk"
                                placeholder="Nama Produk"
                            />
                            <InputComponents
                                name="harga"
                                type="number"
                                value={25000}
                                placeholder="Harga"
                            />
                            <InputComponents
                                name="stok"
                                type="number"
                                value={30}
                                placeholder="Stok"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <LinkComponents name="Hapus" />
                            </div>
                            <div>
                                <LinkComponents name="Simpan Perubahan" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProdukPage;
