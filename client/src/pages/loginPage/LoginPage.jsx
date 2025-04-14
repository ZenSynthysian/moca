import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputComponents from '../../components/InputComponents';
import axios from 'axios';

function LoginPage() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    console.log(loginData);

    function handleChange(e) {
        const { name, value } = e.target;
        setLoginData((prevState) => ({ ...prevState, [name]: value }));
    }

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, loginData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message || 'Login gagal';
                console.log('Error:', message);
                setErrorMessage(message);
            } else {
                // Error lainnya (jaringan, dll)
                console.log('Unexpected error:', error.message);
                setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
            }
        }
    }

    return (
        <div className="bg-[#FEF9E1] min-h-screen flex flex-col justify-center items-center">
            {/* Header */}
            <div className="text-center p-4">
                <h1 className="text-4xl font-bold text-[#C14600]">MOCA</h1>
                <p className="text-xl text-[#C14600]">Aplikasi Kasir Untuk Ujikom</p>
            </div>

            {/* Login Box */}
            <div className="bg-[#FF9D23] w-[40vw] h-[40vh] rounded-xl border-2 border-[#C14600] shadow-lg flex flex-col items-center justify-center p-6">
                <div className="text-red-500">{errorMessage}</div>
                <form className="w-full flex flex-col space-y-6">
                    {/* Username Input */}
                    <InputComponents
                        name="email"
                        type="mail"
                        placeholder="Username"
                        onChange={handleChange}
                    />

                    {/* Password Input */}
                    <InputComponents
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    {/* Login Button */}
                    <button
                        className="w-full bg-[#C14600] text-white py-2 rounded-md text-lg font-semibold transition duration-300 hover:bg-[#9E3A00]"
                        onClick={handleLogin}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
