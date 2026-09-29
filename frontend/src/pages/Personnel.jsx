import { useEffect, useState } from "react";
import { Plus, Search, Users, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Modal from "../components/ui/Modal";
import api from "../services/api";

function Personnel() {
    // Liste réelle venant du backend
    const [personnels, setPersonnels] = useState([]);
    // Recherche
    const [search, setSearch] = useState("");
    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Mode modification
    const [isEditing, setIsEditing] = useState(false);
    // Personnel sélectionné pour modification
    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    // Chargement
    const [loading, setLoading] = useState(false);
    // Erreur générale
    const [serverError, setServerError] = useState("");
    // Erreurs de validation
    const [errors, setErrors] = useState({});

    const initialFormData = {
        type: "",
        prenom: "",
        nom: "",
        telephone: "",
        adresse: "",
        specialite: ""
    };

    const [formData, setFormData] = useState(initialFormData);

    // TYPES DU PERSONNEL
    const typesPersonnel = [
        "MEDECIN",
        "INFIRMIER",
        "SAGEFEMME",
        "AIDESOIGNANT",
        "SECRETAIRE"
    ];

    // RÉCUPÉRER LES PERSONNELS
    const fetchPersonnels = async () => {

        try {

            setServerError("");

            const response = await api.get("/personnels");

            setPersonnels(response.data);

        } catch (error) {

            console.error(
                "Erreur lors du chargement des personnels :",
                error
            );

            setServerError(
                "Impossible de charger la liste du personnel."
            );
        }
    };

    // CHARGEMENT INITIAL
    useEffect(() => {

        fetchPersonnels();

    }, []);

    // MODIFICATION D'UN CHAMP
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Supprimer l'erreur du champ dès qu'on le modifie
        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));

        // Supprimer l'erreur serveur
        setServerError("");
    };

    // OUVRIR MODAL - AJOUT
    const handleOpenCreate = () => {

        setIsEditing(false);

        setSelectedPersonnel(null);

        setFormData(initialFormData);

        setErrors({});

        setServerError("");

        setIsModalOpen(true);
    };

    // OUVRIR MODAL - MODIFICATION
    const handleOpenEdit = (personnel) => {
        setIsEditing(true);
        setSelectedPersonnel(personnel);
        setFormData({
            type: personnel.type || "",
            prenom: personnel.prenom || "",
            nom: personnel.nom || "",
            telephone: personnel.telephone || "",
            adresse: personnel.adresse || "",
            specialite: personnel.specialite || ""
        });

        setErrors({});

        setServerError("");

        setIsModalOpen(true);
    };

    // FERMER MODAL
    const handleCloseModal = () => {

        if (loading) {
            return;
        }

        setIsModalOpen(false);

        setIsEditing(false);

        setSelectedPersonnel(null);

        setFormData(initialFormData);

        setErrors({});

        setServerError("");
    };

    // VALIDATION
    const validateForm = () => {

        const newErrors = {};
        if (!formData.type) {
            newErrors.type = "Le type de personnel est obligatoire.";
        }
        if (!formData.prenom.trim()) {
            newErrors.prenom = "Le prénom est obligatoire.";

        } else if (formData.prenom.trim().length > 20) {
            newErrors.prenom = "Le prénom ne doit pas dépasser 20 caractères.";
        }
        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom est obligatoire.";

        } else if (formData.nom.trim().length > 20) {
            newErrors.nom = "Le nom ne doit pas dépasser 20 caractères.";
        }
        if (!formData.telephone.trim()) {
            newErrors.telephone = "Le téléphone est obligatoire.";

        } else if (formData.telephone.trim().length > 8) {
            newErrors.telephone = "Le téléphone ne doit pas dépasser 8 caractères.";
        }
        if (!formData.adresse.trim()) {
            newErrors.adresse = "L'adresse est obligatoire.";

        } else if (formData.adresse.trim().length > 20) {
            newErrors.adresse = "L'adresse ne doit pas dépasser 20 caractères.";
        }
        if (formData.specialite.trim().length > 20) {
            newErrors.specialite = "La spécialité ne doit pas dépasser 20 caractères.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ENREGISTRER / MODIFIER
    const handleSubmit = async (e) => {

        e.preventDefault();

        setServerError("");

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            // Nettoyage des données avant envoi
            const data = {
                type: formData.type,
                prenom: formData.prenom.trim(),
                nom: formData.nom.trim(),
                telephone: formData.telephone.trim(),
                adresse: formData.adresse.trim(),
                specialite: formData.specialite.trim()
            };
            // MODIFICATION
            if (isEditing) {
                await api.put(
                    `/personnels/update/${selectedPersonnel.id}`,
                    data
                );
            }
            // CRÉATION
            else {
                await api.post(
                    "/personnels/new",
                    data
                );
            }

            // Recharger les données depuis le backend
            await fetchPersonnels();

            // Fermer le modal
            setIsModalOpen(false);

            setIsEditing(false);

            setSelectedPersonnel(null);

            setFormData(initialFormData);

            setErrors({});

        } catch (error) {
            console.error(
                "Erreur lors de l'enregistrement :",
                error
            );

            if (error.response) {

                if (error.response.data) {

                    if (typeof error.response.data === "string") {
                        setServerError(
                            error.response.data
                        );

                    } else {
                        setServerError(
                            "Une erreur est survenue lors de l'enregistrement."
                        );
                    }

                } else {
                    setServerError(
                        `Erreur serveur : ${error.response.status}`
                    );
                }

            } else {
                setServerError(
                    "Impossible de contacter le serveur."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    // SUPPRESSION
    const handleDelete = async (id) => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce personnel ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            setServerError("");
            await api.delete(
                `/personnels/delete/${id}`
            );

            await fetchPersonnels();

        } catch (error) {

            console.error(
                "Erreur lors de la suppression :",
                error
            );
            setServerError(
                "Impossible de supprimer ce personnel."
            );
        }
    };

    // RECHERCHE
    const filteredPersonnels = personnels.filter(
        (personnel) => {

            const texte = `
                ${personnel.type || ""}
                ${personnel.prenom || ""}
                ${personnel.nom || ""}
                ${personnel.telephone || ""}
                ${personnel.adresse || ""}
                ${personnel.specialite || ""}
            `.toLowerCase();

            return texte.includes(
                search.toLowerCase()
            );
        }
    );

    // AFFICHAGE
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4">
                    <div className="flex justify-end gap-3 mb-3">
                        <div className="">
                            <div className="relative max-w-md">
                                <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un personnel..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                        </div>

                        <button type="button" onClick={handleOpenCreate} className="flex items-center gap-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition">
                            <Plus size={19} />
                            <span>
                                Nouveau personnel
                            </span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-170px)]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white backdrop-blur-sm border-b-2">
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Type</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Prénom</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Nom</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Téléphone</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Spécialité</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredPersonnels.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className=" px-6 py-14 text-center">
                                                <Users  size={42} className="mx-auto text-gray-300 mb-3"/>
                                                <p className="font-medium text-gray-500">
                                                    Aucun personnel trouvé
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPersonnels.map(
                                            (personnel) => (
                                                <tr key={personnel.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-medium">
                                                            {personnel.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {personnel.prenom}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-800">
                                                        {personnel.nom}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {personnel.telephone}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">
                                                        {personnel.specialite || "Non renseignée"}
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            {/* MODIFIER */}
                                                            <button type="button" onClick={() => handleOpenEdit(personnel)} title="Modifier" className="p-2 bg-indigo-200 text-indigo-700 hover:bg-indigo-300 rounded-full transition">
                                                                <Pencil size={17}/>
                                                            </button>
                                                            {/* SUPPRIMER */}
                                                            <button type="button" onClick={() => handleDelete(personnel.id)} title="Supprimer" className="p-2 bg-red-200 text-red-700 hover:bg-red-300 rounded-full transition">
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
                    </div>
                </main>
            </div>
            {/* MODAL */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={ isEditing ? "Modifier le personnel" : "Nouveau personnel"}>
                <form onSubmit={handleSubmit}>
                    {/* ERREUR SERVEUR DANS LE MODAL */}
                    {serverError && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {serverError}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* TYPE */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Type de personnel
                            </label>
                            <select id="type" name="type" value={formData.type} onChange={handleChange} className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2
                                    ${
                                        errors.type
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                    }
                                `}
                            >
                                <option value="">
                                    Sélectionner un type
                                </option>
                                {typesPersonnel.map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* PRÉNOM */}
                        <div>
                            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Prénom
                            </label>
                            <input id="prenom" name="prenom" type="text" value={formData.prenom} onChange={handleChange} maxLength={20} placeholder="Prénom"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2
                                    ${
                                        errors.prenom
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                    }
                                `}
                            />

                            {errors.prenom && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.prenom}
                                </p>
                            )}
                        </div>

                        {/* NOM */}
                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nom
                            </label>
                            <input id="nom" name="nom" type="text" value={formData.nom} onChange={handleChange} maxLength={20} placeholder="Nom"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2
                                    ${
                                        errors.nom
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                    }
                                `}
                            />
                            {errors.nom && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.nom}
                                </p>
                            )}
                        </div>

                        {/* TÉLÉPHONE */}
                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Téléphone
                            </label>
                            <input id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} maxLength={8} placeholder="Téléphone"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2
                                    ${
                                        errors.telephone
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                    }
                                `}
                            />
                            {errors.telephone && (
                                <p className=" text-xs text-red-500 mt-1">
                                    {errors.telephone}
                                </p>
                            )}
                        </div>

                        {/* ADRESSE */}
                        <div className="md:col-span-2">
                            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Adresse
                            </label>
                            <input id="adresse" name="adresse" type="text" value={formData.adresse} onChange={handleChange} maxLength={20} placeholder="Adresse"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2
                                    ${
                                        errors.adresse
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                    }
                                `}
                            />
                            {errors.adresse && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.adresse}
                                </p>
                            )}
                        </div>

                        {/* SPÉCIALITÉ */}
                        <div className="md:col-span-2">
                            <label htmlFor="specialite" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Spécialité
                                <span className="text-gray-400">
                                    {" "} (optionnel)
                                </span>
                            </label>
                            <input id="specialite" name="specialite" type="text" value={formData.specialite} onChange={handleChange} maxLength={20} placeholder="Spécialité"
                                className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2
                                    ${
                                        errors.specialite
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-indigo-500"
                                    }
                                `}
                            />
                            {errors.specialite && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.specialite}
                                </p>
                            )}
                        </div>
                    </div>

                    {/*BOUTONS*/}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        {/* ANNULER */}
                        <button type="button" onClick={handleCloseModal} disabled={loading} className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            Annuler
                        </button>

                        {/* ENREGISTRER */}
                        <button type="submit" disabled={loading} className="px-4 py-2.5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Enregistrement..." : isEditing ? "Modifier" : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Personnel;