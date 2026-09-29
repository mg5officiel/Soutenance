import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Modal from "../components/ui/Modal";
import { Plus, Users, Trash2, Loader2, ShieldCheck } from "lucide-react";
import api from "../services/api";

function Utilisateurs() {
    // DONNÉES
    const [users, setUsers] = useState([]);
    const [personnels, setPersonnels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // CRÉATION D'UN UTILISATEUR
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "",
        personnelId: ""
    });
    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        password: "",
        role: "",
        personnelId: ""
    });

    const handleOpenModal = () => {
        setFormData({ username: "", password: "", role: "", personnelId: "" });
        setFieldErrors({ username: "", password: "", role: "", personnelId: "" });
        setFormError("");
        setIsModalOpen(true);
    };
 
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormError("");
        setFieldErrors({ username: "", password: "", role: "" });
    };
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Effacer l'erreur du champ modifié
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // CHARGEMENT DES UTILISATEURS
    useEffect(() => {
        loadUsers();
        loadPersonnels();
    }, []);

    const loadPersonnels = async () => {
        try {
            const response = await api.get("/personnels");
            setPersonnels(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des personnels :", error);
        }
    };

    const loadUsers = async () => {
        setLoading(true);
        setError("");

        try {

            const response = await api.get("/user/users");
            setUsers(response.data);

        } catch (error) {
            console.error(
                "Erreur lors du chargement des utilisateurs :",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Votre session a expiré. Veuillez vous reconnecter."
                );

            } else if (error.response?.status === 403) {

                setError(
                    "Accès refusé. Cette page est réservée à l'administrateur."
                );

            } else {

                setError(
                    "Impossible de charger les utilisateurs."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    // SUPPRESSION
    const handleDelete = async (id) => {

        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer cet utilisateur ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            await api.delete(`/user/${id}`);
            setUsers((previous) =>
                previous.filter(
                    (user) => user.id !== id
                )
            );

        } catch (error) {
            console.error(
                "Erreur lors de la suppression :",
                error
            );

            if (error.response?.status === 403) {
                setError(
                    "Vous n'avez pas les droits nécessaires."
                );

            } else {
                setError(
                    "Impossible de supprimer cet utilisateur."
                );
            }
        }
    };

    // CRÉATION — POST /auth/register (réservé ADMIN, token envoyé automatiquement par api.js)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est obligatoire.";
        }
        if (!formData.password || formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
        }
        if (!formData.role) {
            newErrors.role = "Veuillez sélectionner un rôle.";
        }
        if (formData.role !== "ADMIN" && !formData.personnelId) {
            newErrors.personnelId = "Sélectionnez le personnel associé à ce compte.";
        }
        setFieldErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        try {
            setSubmitting(true);
            setFormError("");

            await api.post("/auth/register", {
                username: formData.username.trim(),
                password: formData.password,
                role: formData.role,
                personnelId: formData.personnelId ? Number(formData.personnelId) : null
            });

            setIsModalOpen(false);
            await loadUsers();

        } catch (err) {
            console.error("Erreur lors de la création de l'utilisateur :", err);

            if (err.response?.status === 409) {
                setFormError(err.response.data || "Ce nom d'utilisateur est déjà utilisé.");
            } else if (err.response?.status === 403) {
                setFormError("Vous n'avez pas les droits nécessaires pour créer un utilisateur.");
            } else if (err.response?.status === 400) {
                setFormError("Champs invalides. Vérifiez le nom d'utilisateur, le mot de passe et le rôle.");
            } else {
                setFormError("Impossible de créer l'utilisateur.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ROLE
    const getRoleLabel = (role) => {
        switch (role) {

            case "ADMIN":
                return "Administrateur";

            case "MEDECIN":
                return "Médecin";

            case "INFIRMIER":
                return "Infirmier";

            case "SECRETAIRE":
                return "Secrétaire";

            default:
                return role || "—";
        }
    };

    // AFFICHAGE
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4">
                    {error && (
                        <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end mb-3">
                        <button type="button" onClick={handleOpenModal} className="flex items-center gap-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition">
                            <Plus size={19} />
                            <span>Nouvel utilisateur</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 size={28}
                                    className="animate-spin text-indigo-600"/>
                                <span className="ml-3 text-sm text-gray-500">
                                    Chargement des utilisateurs...
                                </span>
                            </div>
                        ) : (

                            /* TABLEAU */
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white backdrop-blur-sm border-b-2">
                                            <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">
                                                Utilisateur
                                            </th>
                                            <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">
                                                Personnel
                                            </th>
                                            <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">
                                                Rôle
                                            </th>
                                            <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <Users size={40} className="mx-auto text-gray-300 mb-3"/>
                                                    <p className="font-medium text-gray-500">
                                                        Aucun utilisateur trouvé
                                                    </p>

                                                    <p className="text-gray-400 mt-1">
                                                        La liste des utilisateurs est vide.
                                                    </p>
                                                </td>
                                            </tr>

                                        ) : (

                                            users.map(
                                                (user) => (
                                                    <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-800">
                                                                    <ShieldCheck size={20}/>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-800">
                                                                        {user.username}
                                                                    </p>
                                                                    <p className="text-gray-400">
                                                                        ID : {user.id}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {user.personnel ? (
                                                                <div>
                                                                    <p className="font-medium text-gray-800">
                                                                        {user.personnel.prenom}{" "}
                                                                        {user.personnel.nom}
                                                                    </p>
                                                                    {user.personnel.type && (
                                                                        <p className="text-gray-400 mt-0.5">
                                                                            {user.personnel.type}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                            ) : (

                                                                <span className="text-gray-400">
                                                                    Aucun personnel associé
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl font-medium bg-indigo-200 text-indigo-800">
                                                                {getRoleLabel(user.role)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-end ">
                                                                <button type="button"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    className="p-2 bg-red-200 text-red-700 hover:bg-red-300 rounded-full transition "title="Supprimer">

                                                                    <Trash2 size={17}/>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Nouvel utilisateur">
                <form onSubmit={handleSubmit}>

                    {formError && (
                        <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 text-red-700 text-sm">
                            {formError}
                        </div>
                    )}

                    <div className="space-y-4">

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Ex : massama"
                                className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                                    fieldErrors.username
                                        ? "border border-red-500 focus:ring-red-500"
                                        : "border border-gray-300 focus:ring-indigo-500"
                                }`}
                            />
                            {fieldErrors.username && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="8 caractères minimum"
                                className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                                    fieldErrors.password
                                        ? "border border-red-500 focus:ring-red-500"
                                        : "border border-gray-300 focus:ring-indigo-500"
                                }`}
                            />
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Rôle
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 ${
                                    fieldErrors.role
                                        ? "border border-red-500 focus:ring-red-500"
                                        : "border border-gray-300 focus:ring-indigo-500"
                                }`}
                            >
                                <option value="">Sélectionner un rôle</option>
                                <option value="ADMIN">Administrateur</option>
                                <option value="MEDECIN">Médecin</option>
                                <option value="INFIRMIER">Infirmier</option>
                                <option value="SECRETAIRE">Secrétaire</option>
                            </select>
                            {fieldErrors.role && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.role}</p>
                            )}
                        </div>

                    </div>

                        <div>
                            <label htmlFor="personnelId" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Personnel associé
                            </label>
                            <select
                                id="personnelId"
                                name="personnelId"
                                value={formData.personnelId}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 ${
                                    fieldErrors.personnelId
                                        ? "border border-red-500 focus:ring-red-500"
                                        : "border border-gray-300 focus:ring-indigo-500"
                                }`}
                            >
                                <option value="">Sélectionner un personnel</option>
                                {personnels.map((personnel) => (
                                    <option key={personnel.id} value={personnel.id}>
                                        {personnel.prenom} {personnel.nom} — {personnel.type || "Personnel"}
                                    </option>
                                ))}
                            </select>
                            {fieldErrors.personnelId && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.personnelId}</p>
                            )}
                        </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                            Annuler
                        </button>
                        <button type="submit" disabled={submitting} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50">
                            {submitting ? "Création..." : "Créer"}
                        </button>
                    </div>

                </form>
            </Modal>
        </div>
    );
}


export default Utilisateurs;