import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Modal from "../components/ui/Modal";
import { Plus, Search, UserRound } from "lucide-react";
import api from "../services/api";

function Patient() {

    const [patients, setPatients] = useState([]);
    const [recherche, setRecherche] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [scanEnCours, setScanEnCours] = useState(false)
    const fileInputRef = useRef(null)

    const chargerPatients = async () => {
        try {
            setLoading(true);
            const response = await api.get("/patients");
            setPatients(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des patients :", error);
            setError("Impossible de charger la liste des patients.");
        } finally {
            setLoading(false);
        }
    };

    // Charge la liste des patients au montage du composant
    useEffect(() => {
        chargerPatients();
    }, []);

    // Données du formulaire
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        telephone: "",
        adresse: "",
        sexe: ""
    });

    // Gestion des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleOpenModal = () => {
        setFormData({
            prenom: "",
            nom: "",
            telephone: "",
            adresse: "",
            sexe: ""
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Envoie le patient au backend (POST /patients/new)
    // puis recharge la liste depuis le serveur.
    const handleSubmit = async (e) => {
            e.preventDefault();
            setError("");
            try {
                setLoading(true);
                await api.post("/patients/new", formData);
                await chargerPatients();
                setIsModalOpen(false);
            } catch (error) {
                console.error("Erreur lors de l'enregistrement du patient :", error);
                setError("Impossible d'enregistrer le patient. Vérifiez les champs et réessayez.");
            } finally {
                setLoading(false);
            }
        };

    function ouvrirSelecteurCarte() {
		fileInputRef.current?.click()
	}

    // Envoie l'image au backend (POST /api/cartes-identite/extraire-patient)
    // via l'instance axios "api" (qui ajoute déjà le token depuis localStorage)
	async function scannerCarte(e) {
		const fichier = e.target.files?.[0]
		if (!fichier) return
		setScanEnCours(true)
		setError("");
		try {
			const formDataScan = new FormData()
			formDataScan.append('fichier', fichier);

			const response = await api.post(
                "/api/cartes-identite/extraire-patient",
                formDataScan,
                { headers: { "Content-Type": "multipart/form-data" } }
			);

            const donnees = response.data;

			setFormData({
                prenom: donnees.prenom || "",
                nom: donnees.nom || "",
                telephone: "",
                adresse: "",
                sexe: donnees.sexe || ""
            });

			setIsModalOpen(true);
        } catch (err) {
            console.error("Erreur lors du scan de la carte :", err);
            setError("Échec de la lecture de la carte d'identité.");
        } finally {
            setScanEnCours(false);
            e.target.value = "";
        }
	}

    // Filtrage local (prénom, nom, téléphone) sur la liste déjà chargée
    const patientsFiltres = patients.filter((patient) => {
        const terme = recherche.trim().toLowerCase();
        if (!terme) return true;
        return (
            patient.prenom?.toLowerCase().includes(terme) ||
            patient.nom?.toLowerCase().includes(terme) ||
            patient.telephone?.includes(terme)
        );
    });

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

                    <div className="flex justify-end gap-3 mb-3">
                        <div className="">
                            <div className="relative max-w-xs">
                                <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 font-semibold"/>
                                <input type="text" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher un patient..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                        </div>

                        <input type="file" ref={fileInputRef} accept="image/*"
						    onChange={scannerCarte} className="hidden" />
                        <button onClick={ouvrirSelecteurCarte} disabled={scanEnCours}
                            className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white
                                hover:bg-indigo-50 disabled:opacity-50 px-4 py-2 rounded-xl
                                text-sm font-semibold flex items-center gap-2 transition-colors">
                            {scanEnCours
                                ? <div className="w-4 h-4 border-2 border-indigo-700/30 border-t-indigo-700 rounded-full animate-spin" />
                                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="M21 15l-5-5L5 21" />
                                    </svg>
                            }
                            Scanner une carte
                        </button>

                        <button type="button" onClick={handleOpenModal} className="flex items-center gap-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition">
                            <Plus size={19} />
                            <span>Ajouter un patient</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-170px)]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white backdrop-blur-sm  border-b-2">
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Patient</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Téléphone</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Adresse</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Sexe</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {loading && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-6 text-center text-sm text-gray-400">
                                                Chargement...
                                            </td>
                                        </tr>
                                    )}
                                
                                    {!loading && patientsFiltres.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-6 text-center text-gray-400">
                                                Aucun patient trouvé.
                                            </td>
                                        </tr>
                                    )}
                                
                                    {!loading && patientsFiltres.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center">
                                                        <UserRound size={18} className="text-purple-700"/>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {patient.prenom} {patient.nom}
                                                        </p>
                                                        <p className="text-xs text-gray-500">ID #{patient.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{patient.telephone}</td>
                                            <td className="px-6 py-4 text-gray-600">{patient.adresse}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                                                    {patient.sexe === "HOMME" ? "Homme" : "Femme"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Ajouter un patient">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                            <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required maxLength={20} placeholder="Ex : Massama" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                            <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required maxLength={20} placeholder="Ex : Goïta" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                            <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required maxLength={8} placeholder="Ex : 76000000" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                        <div>
                            <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-1.5">Sexe</label>
                            <select id="sexe" name="sexe" value={formData.sexe} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Sélectionner</option>
                                <option value="HOMME">Homme</option>
                                <option value="FEMME">Femme</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
                            <input type="text" id="adresse" name="adresse" value={formData.adresse} onChange={handleChange} required maxLength={20} placeholder="Ex : Bamako" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">Annuler</button>
                        <button type="submit" disabled={loading} className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50">
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </Modal> 
        </div>
    );
}

export default Patient;
                                