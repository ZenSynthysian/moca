import PenjualanCard from '../../../components/PenjualanCard';
import LinkComponents from '../../../components/LinkComponents';
import InputComponents from '../../../components/InputComponents';
import { useState } from 'react';

function PenjualanPage() {
    const [selectedItems, setSelectedItems] = useState({});
    const [isItems, setIsItems] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    console.log(selectedId);

    function handleSelect(id) {
        setSelectedItems((prev) => {
            const updatedItems = { ...prev };

            // Jika item sudah ada, hapus item dari object
            if (updatedItems[id]) {
                delete updatedItems[id];
            } else {
                // Jika item belum ada, tambahkan dengan quantity 1
                updatedItems[id] = 1;
            }

            return updatedItems;
        });
    }

    function handleHistory() {
        setIsItems(isItems == true ? false : true);
    }

    function handleIncrease(id) {
        setSelectedItems((prev) => ({
            ...prev,
            [id]: prev[id] + 1,
        }));
    }

    function handleDecrease(id) {
        setSelectedItems((prev) => {
            const updatedItems = { ...prev };
            if (updatedItems[id] > 1) {
                updatedItems[id] -= 1;
            } else {
                delete updatedItems[id]; // Hapus item jika jumlahnya 0
            }
            return updatedItems;
        });
    }

    function handleReset() {
        setSelectedItems({});
    }

    const handleHardClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    console.log(selectedItems);

    return (
        <>
            {isItems ? (
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
                                <div
                                    key={id}
                                    onClick={() => handleSelect(id)}
                                    className={`cursor-pointer rounded transition-all duration-200 ${selectedItems[id] ? 'bg-moca3' : ''}`}>
                                    <PenjualanCard />
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
                        <div className="w-[22vw] bg-moca2 border-2 flex flex-col justify-between items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                            <div className="w-full p-3 flex flex-col gap-4">
                                {/* list */}
                                {Object.entries(selectedItems).map(([id, quantity]) => (
                                    <div
                                        key={id}
                                        className="flex flex-row justify-between text-moca4 bg-moca1 rounded p-2">
                                        <div>Cappuchino Latte</div>
                                        <div className="grid grid-cols-3 justify-between gap-3">
                                            <div
                                                className="bg-moca3 rounded-full text-moca1 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca2"
                                                onClick={() => handleDecrease(id)}>
                                                -
                                            </div>
                                            <div>{quantity}</div>
                                            <div
                                                className="bg-moca3 rounded-full text-moca1 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca2"
                                                onClick={() => handleIncrease(id)}>
                                                +
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* end list */}
                            </div>
                            <div className="flex gap-4">
                                <div onClick={() => handleReset()}>
                                    <LinkComponents name="Reset" />
                                </div>
                                <div>
                                    <LinkComponents name="Selesai" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row p-3 justify-between gap-3">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-row gap-5 justify-between">
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
                            <div
                                onClick={handleHistory}
                                className="p-1 border-2 border-moca1 hover:bg-moca3 transition-all duration-150 rounded-2xl">
                                <div className="text-center">history</div>
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
                    {selectedId === null ? null : (
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
            )}
        </>
    );
}

export default PenjualanPage;
