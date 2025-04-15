import { useEffect, useState } from 'react';
import InputComponents from '../../../components/InputComponents';
import axios from 'axios';
import reset from '../../../assets/reset.svg';

function PelangganPage() {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [refreshPelangganData, setRefreshPelangganData] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [pelangganData, setPelangganData] = useState([]);
    const [insertPelanggan, setInsertPelanggan] = useState({
        NamaPelanggan: '',
        Alamat: '',
        NomorTelepon: '',
    });
    const [editPelanggan, setEditPelanggan] = useState({
        PelangganID: '',
        NamaPelanggan: '',
        Alamat: '',
        NomorTelepon: '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/pelanggan/showall`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPelangganData(response.data.data);
            } catch (error) {
                if (error.message) console.log(error.message);
            }
        }
        fetchData();
    }, [refreshPelangganData]);

    useEffect(() => {
        if (selectedId !== null) {
            const selectedPelanggan = pelangganData.find((p) => p.PelangganID === selectedId);
            if (selectedPelanggan) {
                setEditPelanggan({
                    PelangganID: selectedPelanggan.PelangganID,
                    NamaPelanggan: selectedPelanggan.NamaPelanggan,
                    Alamat: selectedPelanggan.Alamat,
                    NomorTelepon: selectedPelanggan.NomorTelepon,
                });
            }
        }
    }, [selectedId, pelangganData]);

    const handleHardClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };
    function handleNewClick() {
        setSelectedId(selectedId === 'new' ? null : 'new');
    }

    function handleChanges(e) {
        const { name, value } = e.target;
        setInsertPelanggan({ ...insertPelanggan, [name]: value });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setIsSubmitLoading(true);
            if (insertPelanggan.NamaPelanggan == '' || insertPelanggan.Alamat == '' || insertPelanggan.NomorTelepon == '') {
                window.alert('Semua Kolom Wajib Diisi');
                setIsSubmitLoading(false);
                return;
            }
            await axios.post(`${import.meta.env.VITE_API_URL}/pelanggan/store`, insertPelanggan, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setIsSubmitLoading(false);
            setInsertPelanggan({
                NamaPelanggan: '',
                Alamat: '',
                NomorTelepon: '',
            });
            setRefreshPelangganData(!refreshPelangganData);
        } catch (error) {
            if (error.message) console.log(error.message);
        }
    }

    async function handleEdit(e) {
        e.preventDefault();
        try {
            setIsSubmitLoading(true);
            axios.put(`${import.meta.env.VITE_API_URL}/pelanggan/update`, editPelanggan, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setIsSubmitLoading(false);
            setRefreshPelangganData(!refreshPelangganData);
        } catch (error) {
            if (error.message) console.log(error.message);
        }
    }

    async function handleDelete(e) {
        e.preventDefault();
        try {
            axios.delete(`${import.meta.env.VITE_API_URL}/pelanggan/delete`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                data: { PelangganID: selectedId },
            });
            setRefreshPelangganData(!refreshPelangganData);
            setSelectedId(null);
        } catch (error) {
            if (error.message) console.log(error);
        }
    }

    async function handleSearchPelanggan(e) {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/pelanggan/showone`,
                { NamaPelanggan: `${searchValue}` },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setPelangganData(response.data.data);
        } catch (error) {
            if (error.message) console.log(error.message);
        }
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
                        <div className="w-10 ">
                            <button
                                onClick={() => setRefreshPelangganData(!refreshPelangganData)}
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
                                onChange={(e) => setSearchValue(e.target.value)}
                                value={searchValue}
                                className="outline-none w-full p-1 pl-5 bg-moca3 border-2 border-moca1 rounded-full transition-all duration-100 focus:bg-moca1 focus:border-moca2 focus:text-moca4"
                            />
                        </div>
                        <div className="w-10 ">
                            <button
                                onClick={handleSearchPelanggan}
                                className="w-full h-full bg-moca3 rounded-full text-moca1 ring-2 ring-moca2 text-center cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-moca1">
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
                                        <th className="p-2">Dibuat Pada</th>
                                        <th className="p-2">Terakhir Diupdate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pelangganData.map((pelanggan) => {
                                        return (
                                            <tr
                                                key={pelanggan.PelangganID}
                                                onClick={() => handleHardClick(pelanggan.PelangganID)}
                                                className={`hover:bg-moca3 cursor-grab transition-all duration-100 ${selectedId === pelanggan.PelangganID ? 'bg-moca3' : ''}`}>
                                                <td className="p-2 border-r-2">{pelanggan.PelangganID}</td>
                                                <td className="p-2">{pelanggan.NamaPelanggan}</td>
                                                <td className="p-2">{pelanggan.Alamat}</td>
                                                <td className="p-2">{pelanggan.NomorTelepon}</td>
                                                <td className="p-2">
                                                    {new Date(pelanggan.created_at).toLocaleString('id-ID', {
                                                        hour12: false,
                                                    })}
                                                </td>
                                                <td className="p-2">
                                                    {new Date(pelanggan.updated_at).toLocaleString('id-ID', {
                                                        hour12: false,
                                                    })}
                                                </td>
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
                        <form className="w-full">
                            <div className="w-full p-3 flex flex-col gap-4">
                                <InputComponents
                                    name="NamaPelanggan"
                                    type="text"
                                    value={insertPelanggan.NamaPelanggan}
                                    onChange={handleChanges}
                                    placeholder="Nama Pelanggan"
                                />
                                <InputComponents
                                    name="Alamat"
                                    type="text"
                                    value={insertPelanggan.Alamat}
                                    onChange={handleChanges}
                                    placeholder="Alamat"
                                />
                                <InputComponents
                                    name="NomorTelepon"
                                    type="text"
                                    value={insertPelanggan.NomorTelepon}
                                    onChange={handleChanges}
                                    placeholder="Nomor Telepon"
                                />
                            </div>
                            <div className="w-full p-4">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                                    {isSubmitLoading ? <div className="animate-pulse">Loading...</div> : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    // form ubah dan hapus
                    <div className="w-[25vw] bg-moca2 border-2 flex flex-col justify-center items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                        <form className="w-full">
                            <div className="w-full p-3 flex flex-col gap-4">
                                <InputComponents
                                    name="NamaPelanggan"
                                    type="text"
                                    value={editPelanggan.NamaPelanggan}
                                    onChange={(e) => setEditPelanggan((prev) => ({ ...prev, NamaPelanggan: e.target.value }))}
                                    placeholder="Nama Pelanggan"
                                />
                                <InputComponents
                                    name="Alamat"
                                    type="text"
                                    value={editPelanggan.Alamat}
                                    onChange={(e) => setEditPelanggan((prev) => ({ ...prev, Alamat: e.target.value }))}
                                    placeholder="Alamat"
                                />
                                <InputComponents
                                    name="NomorTelepon"
                                    type="text"
                                    value={editPelanggan.NomorTelepon}
                                    onChange={(e) => setEditPelanggan((prev) => ({ ...prev, NomorTelepon: e.target.value }))}
                                    placeholder="Nomor Telepon"
                                />
                            </div>
                            <div className="w-full p-4 flex gap-3">
                                <button
                                    onClick={handleEdit}
                                    type="submit"
                                    className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                                    {isSubmitLoading ? <div className="animate-pulse">Loading...</div> : 'Simpan'}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                                    {isSubmitLoading ? <div className="animate-pulse">Loading...</div> : 'Hapus'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default PelangganPage;
