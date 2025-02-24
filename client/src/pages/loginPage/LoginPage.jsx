import InputComponents from '../../components/InputComponents';

function LoginPage() {
    return (
        <div className="bg-[#FEF9E1] min-h-screen flex flex-col justify-center items-center">
            {/* Header */}
            <div className="text-center p-4">
                <h1 className="text-4xl font-bold text-[#C14600]">MOCA</h1>
                <p className="text-xl text-[#C14600]">Aplikasi Kasir Untuk Ujikom</p>
            </div>

            {/* Login Box */}
            <div className="bg-[#FF9D23] w-[40vw] h-[40vh] rounded-xl border-2 border-[#C14600] shadow-lg flex flex-col items-center justify-center p-6">
                <form className="w-full flex flex-col space-y-6">
                    {/* Username Input */}
                    <InputComponents
                        name="username"
                        type="text"
                        placeholder="Username"
                    />

                    {/* Password Input */}
                    <InputComponents
                        name="password"
                        type="password"
                        placeholder="Password"
                    />

                    {/* Login Button */}
                    <button className="w-full bg-[#C14600] text-white py-2 rounded-md text-lg font-semibold transition duration-300 hover:bg-[#9E3A00]">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
