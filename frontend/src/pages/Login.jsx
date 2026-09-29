import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User,Lock,Eye,EyeOff,Hospital } from "lucide-react";
import { login } from "../services/authService";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword]=useState(false)
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setUsernameError("");
        setPasswordError("");
        setAuthError("");

        let hasError = false;

        if (!username.trim()) {
            setUsernameError("Le nom d'utilisateur est obligatoire.");
            hasError = true;
        }

        if (!password.trim()) {
            setPasswordError("Le mot de passe est obligatoire.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            setLoading(true);

            const data = await login(username, password);

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                console.log("Connexion réussie !");
                navigate("/dashboard");
        } catch (error) {
            console.error("Erreur de connexion :", error);
            setAuthError(
                error.response?.status === 401
                    ? "Nom d'utilisateur ou mot de passe incorrect."
                    : "Impossible de se connecter au serveur."
            );
        } finally {
            setLoading(false);
        }
    };
    return(
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-white/70 p-6 border rounded-xl shadow-lg">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 rounded-3xl text-white bg-indigo-600 flex items-center justify-center">
                        <Hospital size={30} strokeWidth={2} />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-indigo-600">
                    Gestion Clinique
                </h1>
                <p className="text-center text-xs font-semibold text-gray-700 mt-1">
                    Connectez-vous pour continuer
                </p>

                {authError && (
                    <div className="mt-4 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs text-center">
                        {authError}
                    </div>
                )}

                <form onSubmit={handleLogin} className="mt-6">

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-xs font-medium text-gray-900 mb-1">
                            Nom d'utilisateur
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                            <input type="text" id="username" name="username" placeholder="nom d'utilisateur" value={username} onChange={(e) =>  { setUsername(e.target.value);setUsernameError("");}} 
                                className={`w-full h-10 pl-12 pr-4 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-500 focus:outline-none
                                ${
                                usernameError
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-indigo-400 focus:border-indigo-500"
                                }`}/>
                        </div>
                        {usernameError && (
                            <p className="mt-1 text-xs text-red-500">
                                {usernameError}
                            </p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block text-xs font-medium text-gray-900 mb-1">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600" size={18}/>
                            <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="********" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError("");}} 
                                className={`w-full h-10 pl-12 pr-4 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-500 focus:outline-none
                                ${
                                passwordError
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-indigo-400 focus:border-indigo-500"
                                }`}/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800">
                                {showPassword ? (
                                    <EyeOff size={22}/>
                                ):(
                                    <Eye size={22}/>
                                )}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="mt-1 text-xs text-red-500">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="w-full h-10 bg-indigo-700 text-white rounded-xl font-bold hover:bg-indigo-700 transition duration-200" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;