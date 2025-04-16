import { useEffect, useState } from 'react';
import InputComponents from '../../../components/InputComponents';
import axios from 'axios';
import reset from '../../../assets/reset.svg';

function UsersPage() {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [refreshUsersData, setRefreshUsersData] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [insertUser, setInsertUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [editUser, setEditUser] = useState({
        id: '',
        name: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/showall`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsersData(response.data.data);
            } catch (error) {
                if (error.message) console.log(error.message);
            }
        }
        fetchData();
    }, [refreshUsersData]);

    useEffect(() => {
        if (selectedId !== null && selectedId !== 'new') {
            const selectedUser = usersData.find((u) => u.id === selectedId);
            if (selectedUser) {
                setEditUser({
                    id: selectedUser.id,
                    name: selectedUser.name,
                    email: selectedUser.email,
                    role: selectedUser.role,
                });
            }
        }
    }, [selectedId, usersData]);

    const handleHardClick = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    function handleNewClick() {
        setSelectedId(selectedId === 'new' ? null : 'new');
    }

    function handleChanges(e) {
        const { name, value } = e.target;
        setInsertUser({ ...insertUser, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setIsSubmitLoading(true);
            if (!insertUser.name || !insertUser.email || !insertUser.password) {
                window.alert('Semua Kolom Wajib Diisi');
                setIsSubmitLoading(false);
                return;
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, insertUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setInsertUser({
                name: '',
                email: '',
                password: '',
                role: 'user',
            });
            setRefreshUsersData(!refreshUsersData);
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            alert('Error: ' + `${errorMessage}` || `${error.message}`);
        } finally {
            setIsSubmitLoading(false);
        }
    }

    async function handleEdit(e) {
        e.preventDefault();
        try {
            setIsSubmitLoading(true);
            await axios.put(`${import.meta.env.VITE_API_URL}/users/edituser`, editUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRefreshUsersData(!refreshUsersData);
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
        } finally {
            setIsSubmitLoading(false);
        }
    }

    async function handleDelete(e) {
        e.preventDefault();
        try {
            if (!window.confirm('Hapus user ini?')) return;

            await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                data: { id: selectedId },
            });

            setRefreshUsersData(!refreshUsersData);
            setSelectedId(null);
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
        }
    }

    async function handleSearchUsers(e) {
        e.preventDefault();
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/showone`, {
                params: { name: searchValue },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsersData(response.data.data);
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
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
                                onClick={() => setRefreshUsersData(!refreshUsersData)}
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
                                onClick={handleSearchUsers}
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
                                        <th className="p-2">Nama</th>
                                        <th className="p-2">Email</th>
                                        <th className="p-2">Role</th>
                                        <th className="p-2">Dibuat Pada</th>
                                        <th className="p-2">Terakhir Diupdate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersData.map((user) => (
                                        <tr
                                            key={user.id}
                                            onClick={() => handleHardClick(user.id)}
                                            className={`hover:bg-moca3 cursor-grab transition-all duration-100 ${selectedId === user.id ? 'bg-moca3' : ''}`}>
                                            <td className="p-2 border-r-2">{user.id}</td>
                                            <td className="p-2">{user.name}</td>
                                            <td className="p-2">{user.email}</td>
                                            <td className="p-2">{user.role}</td>
                                            <td className="p-2">
                                                {new Date(user.created_at).toLocaleString('id-ID', {
                                                    hour12: false,
                                                })}
                                            </td>
                                            <td className="p-2">
                                                {new Date(user.updated_at).toLocaleString('id-ID', {
                                                    hour12: false,
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {selectedId === null ? null : selectedId === 'new' ? (
                    <div className="w-[25vw] bg-moca2 border-2 flex flex-col justify-center items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                        <form className="w-full">
                            <div className="w-full p-3 flex flex-col gap-4">
                                <InputComponents
                                    name="name"
                                    type="text"
                                    value={insertUser.name}
                                    onChange={handleChanges}
                                    placeholder="Nama"
                                />
                                <InputComponents
                                    name="email"
                                    type="email"
                                    value={insertUser.email}
                                    onChange={handleChanges}
                                    placeholder="Email"
                                />
                                <InputComponents
                                    name="password"
                                    type="password"
                                    value={insertUser.password}
                                    onChange={handleChanges}
                                    placeholder="Password"
                                />
                                <div className="w-full">
                                    <select
                                        name="role"
                                        value={insertUser.role}
                                        onChange={handleChanges}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
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
                    <div className="w-[25vw] bg-moca2 border-2 flex flex-col justify-center items-center gap-4 p-3 h-[80vh] border-moca1 rounded">
                        <form className="w-full">
                            <div className="w-full p-3 flex flex-col gap-4">
                                <InputComponents
                                    name="name"
                                    type="text"
                                    value={editUser.name}
                                    onChange={(e) => setEditUser((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nama"
                                />
                                <InputComponents
                                    name="email"
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="Email"
                                />
                                <div className="w-full">
                                    <select
                                        name="role"
                                        value={editUser.role}
                                        onChange={(e) => setEditUser((prev) => ({ ...prev, role: e.target.value }))}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
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
                                    className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-red-600 transition duration-300 hover:bg-red-600 hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                                    Hapus
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default UsersPage;
