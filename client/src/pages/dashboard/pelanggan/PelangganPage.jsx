import { useState } from 'react';
import InputComponents from '../../../components/InputComponents';
import LinkComponents from '../../../components/LinkComponents';

function PelangganPage() {
    const [selectedId, setSelectedId] = useState(null);

    const handleHardClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    function handleNewClick() {
        setSelectedId(selectedId === 'new' ? null : 'new');
    }

    return (
        <>
            <div className="flex flex-row p-3 justify-between gap-3">
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-row gap-5 justify-between">
                        <div className="w-10 ">
                            <button
                                onClick={handleNewClick}
                                className="w-full h-full bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
                                {'+'}
                            </button>
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                className="outline-none w-full p-1 pl-5 bg-moca3 border-2 border-moca1 rounded-full transition-all duration-100 focus:bg-moca1 focus:border-moca2 focus:text-moca4"
                            />
                        </div>
                        <div className="w-10 ">
                            <button className="w-full h-full bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
                                {'->'}
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex-wrap border-2 flex flex-row justify-center gap-10 p-3 border-moca1 rounded">
                        <div>
                            <table>
                                <thead className="border-b-2">
                                    <tr className="text-left">
                                        <th className="p-2 border-r-2">ID</th>
                                        <th className="p-2">Nama Pelanggan</th>
                                        <th className="p-2">Alamat</th>
                                        <th className="p-2">Nomor Telepon</th>
                                        <th className="p-2">Terakhir Diupdate</th>
                                        <th className="p-2">Dibuat Pada</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3].map((id) => {
                                        return (
                                            <tr
                                                key={id}
                                                onClick={() => handleHardClick(id)}
                                                className={`hover:bg-moca3 cursor-grab transition-all duration-100 ${selectedId === id ? 'bg-moca3' : ''}`}>
                                                <td className="p-2 border-r-2">1</td>
                                                <td className="p-2">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                                <td className="p-2">Malcolm Lockyer</td>
                                                <td className="p-2">1961</td>
                                                <td className="p-2">1961</td>
                                                <td className="p-2">1961</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>{' '}
                            <div className="flex items-center justify-center p-2">
                                <div className="p-2">{'<'}</div>
                                <div className="border p-1 rounded-full w-7 h-7 flex justify-center items-center">1</div>
                                <div className="p-2">{'>'}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {selectedId === null ? null : selectedId == 'new' ? (
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
                            <LinkComponents name="ubah" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default PelangganPage;
