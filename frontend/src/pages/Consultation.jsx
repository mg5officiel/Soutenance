import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Modal from "../components/ui/Modal";
import { Plus, Search, Stethoscope, Pencil, Trash2 } from "lucide-react";
import api from "../services/api";

function Consultation() {
    // Liste des consultations, remplie par GET /consultations
    const [consultations, setConsultations] = useState([]);
    // Listes utilisées dans le formulaire
    const [patients, setPatients] = useState([]);
    const [personnels, setPersonnels] = useState([]);
    const [typesConsultation, setTypesConsultation] = useState([]);
    // Recherche
    const [recherche, setRecherche] = useState("");
    // Chargement / erreurs globales (réseau)
    const [loading, setLoading] = useState(false);
    const [errorGlobal, setErrorGlobal] = useState("");
    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Id de la consultation en cours de modification (null = création)
    const [consultationEnEdition, setConsultationEnEdition] = useState(null);
    // Formulaire
    const [formData, setFormData] = useState({
        date: "",
        motif: "",
        patient: "",
        personnel: "",
        type: ""
    });
    // Erreurs de validation du formulaire
    const [errors, setErrors] = useState({
        date: "",
        motif: "",
        patient: "",
        personnel: "",
        type: ""
    });

    // Charge la liste des consultations depuis le backend
    const chargerConsultations = async () => {
        try {
            setLoading(true);
            const response = await api.get("/consultations");
            setConsultations(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement des consultations :", err);
            setErrorGlobal("Impossible de charger la liste des consultations.");
        } finally {
            setLoading(false);
        }
    };

    // Charge les listes utilisées dans le formulaire (patients, personnel, types)
    const chargerListesFormulaire = async () => {
        try {
            const [resPatients, resPersonnels, resTypes] = await Promise.all([
                api.get("/patients"),
                api.get("/personnels"),
                api.get("/type-consultation")
            ]);
            setPatients(resPatients.data);
            setPersonnels(resPersonnels.data);
            setTypesConsultation(resTypes.data);
        } catch (err) {
            console.error("Erreur lors du chargement des listes du formulaire :", err);
            setErrorGlobal("Impossible de charger les patients, le personnel ou les types de consultation.");
        }
    };

    useEffect(() => {
        chargerConsultations();
        chargerListesFormulaire();
    }, []);

    // Gestion des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ""
        });
    };
    
    // Ouvrir le modal — sans argument : création, avec une consultation : édition
    const handleOpenModal = (consultation = null) => {
        if (consultation) {
            setConsultationEnEdition(consultation.id);
            setFormData({
                date: consultation.date || "",
                motif: consultation.motif || "",
                patient: consultation.patient?.id ? String(consultation.patient.id) : "",
                personnel: consultation.personnel?.id ? String(consultation.personnel.id) : "",
                type: consultation.type?.id ? String(consultation.type.id) : ""
            });
        } else {
            setConsultationEnEdition(null);
            setFormData({
                date: "",
                motif: "",
                patient: "",
                personnel: "",
                type: ""
            });
        }
        setErrors({
            date: "",
            motif: "",
            patient: "",
            personnel: "",
            type: ""
        });
        setIsModalOpen(true);
    };

    // Fermer le modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Validation puis envoi au backend (création ou modification)
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newErrors = {};
        if (!formData.date) {
            newErrors.date = "La date est obligatoire.";
        }
        if (!formData.motif.trim()) {
            newErrors.motif = "Le motif est obligatoire.";
        } else if (formData.motif.length > 255) {
            newErrors.motif = "Le motif ne doit pas dépasser 255 caractères.";
        }
        if (!formData.patient) {
            newErrors.patient = "Veuillez sélectionner un patient.";
        }
        if (!formData.personnel) {
            newErrors.personnel = "Veuillez sélectionner le personnel.";
        }
        if (!formData.type) {
            newErrors.type = "Veuillez sélectionner un type de consultation.";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
    
        // Le backend attend des relations ManyToOne (Patient, Personnel,
        // TypeConsultation) : on envoie chacune sous forme d'objet { id }.
        const payload = {
            date: formData.date,
            motif: formData.motif.trim(),
            patient: { id: Number(formData.patient) },
            personnel: { id: Number(formData.personnel) },
            type: { id: Number(formData.type) }
        };
    
        try {
            setLoading(true);
            setErrorGlobal("");
            if (consultationEnEdition) {
                await api.put(`/consultations/update/${consultationEnEdition}`, payload);
            } else {
                await api.post("/consultations/new", payload);
            }
            await chargerConsultations();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de la consultation :", err);
            setErrorGlobal("Impossible d'enregistrer la consultation.");
        } finally {
            setLoading(false);
        }
    };
    
    // Suppression d'une consultation
    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette consultation ?")) return;
        try {
            setErrorGlobal("");
            await api.delete(`/consultations/delete/${id}`);
            await chargerConsultations();
        } catch (err) {
            console.error("Erreur lors de la suppression de la consultation :", err);
            setErrorGlobal("Impossible de supprimer la consultation.");
        }
    };
    
    // Filtrage local sur patient, personnel, motif ou type
    const consultationsFiltrees = consultations.filter((consultation) => {
        const terme = recherche.trim().toLowerCase();
        if (!terme) return true;
        return (
            consultation.patient?.prenom?.toLowerCase().includes(terme) ||
            consultation.patient?.nom?.toLowerCase().includes(terme) ||
            consultation.personnel?.prenom?.toLowerCase().includes(terme) ||
            consultation.personnel?.nom?.toLowerCase().includes(terme) ||
            consultation.motif?.toLowerCase().includes(terme) ||
            consultation.type?.type?.toLowerCase().includes(terme)
        );
    });

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4">
                    {errorGlobal && (
                        <div className="mb-3 px-4 py-2.5 rounded-lg bg-red-50 text-red-700 text-sm">
                            {errorGlobal}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mb-3">
                        <div className="">
                            <div className="relative max-w-md">
                                <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input type="text" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher une consultation..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                        </div>
                        <button type="button" onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition">
                            <Plus size={19} />
                            <span>
                                Nouvelle consultation
                            </span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-170px)]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white backdrop-blur-sm border-b-2">
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Date</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Patient</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Personnel</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Type</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Motif</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                
                                    {loading && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400">
                                                Chargement...
                                            </td>
                                        </tr>
                                    )}
                                
                                    {!loading && consultationsFiltrees.length === 0 ? (
                                
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <Stethoscope size={40} className="mx-auto text-gray-300 mb-3"/>
                                                <p className="font-medium text-gray-500">
                                                    Aucune consultation trouvée
                                                </p>
                                
                                                <p className="text-gray-400 mt-1">
                                                    La liste des consultations est vide.
                                                </p>
                                            </td>
                                        </tr>
                                
                                    ) : (
                                
                                        !loading && consultationsFiltrees.map((consultation) => (
                                            <tr key={consultation.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-700">
                                                    {consultation.date}
                                                </td>
                                
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {consultation.patient?.prenom}{" "}
                                                    {consultation.patient?.nom}
                                                </td>
                                
                                                <td className="px-4 py-3 text-gray-700">
                                                    {consultation.personnel?.prenom}{" "}
                                                    {consultation.personnel?.nom}
                                                </td>
                                
                                                <td className="px-4 py-3 text-gray-700">
                                                    {consultation.type?.type}
                                                </td>
                                
                                                <td className="px-4 py-3 text-gray-600">
                                                    {consultation.motif}
                                                </td>
                                
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                
                                                        <button type="button" onClick={() => handleOpenModal(consultation)} className="p-2 bg-indigo-200 text-indigo-700 hover:bg-indigo-300 rounded-full transition">
                                                            <Pencil size={17} />
                                                        </button>
                                
                                                        <button type="button" onClick={() => handleDelete(consultation.id)} className="p-2 bg-red-200 text-red-700 hover:bg-red-300 rounded-full transition">
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={consultationEnEdition ? "Modifier la consultation" : "Nouvelle consultation"}
            >

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Date
                            </label>
                            <input type="date" id="date" name="date"
                                value={formData.date} onChange={handleChange}  className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2
                                    ${
                                        errors.date
                                            ? "border border-red-500 focus:ring-red-500"
                                            : "border border-gray-300 focus:ring-indigo-500"
                                    }`}
                            />
                            {errors.date && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.date}
                                </p>
                            )}
                        </div>

                        {/* Patient */}
                        <div>
                            <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Patient
                            </label>
                            <select id="patient" name="patient"
                                value={formData.patient} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2
                                    ${
                                        errors.patient
                                            ? "border border-red-500 focus:ring-red-500"
                                            : "border border-gray-300 focus:ring-indigo-500"
                                    }`}
                            >
                                <option value="">
                                    Sélectionner un patient
                                </option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.prenom} {patient.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.patient && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.patient}
                                </p>
                            )}
                        </div>

                        {/* Personnel */}
                        <div>
                            <label htmlFor="personnel" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Personnel
                            </label>
                            <select id="personnel" name="personnel" 
                                value={formData.personnel} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2
                                    ${
                                        errors.personnel
                                            ? "border border-red-500 focus:ring-red-500"
                                            : "border border-gray-300 focus:ring-indigo-500"
                                    }`}
                            >
                                <option value="">
                                    Sélectionner le personnel
                                </option>
                                {personnels.map((personnel) => (
                                    <option key={personnel.id} value={personnel.id}>
                                        {personnel.prenom} {personnel.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.personnel && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.personnel}
                                </p>
                            )}
                        </div>

                        {/* Type de consultation */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Type de consultation
                            </label>
                            <select id="type" name="type"
                                value={formData.type} onChange={handleChange} className={`w-full px-3 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2
                                    ${
                                        errors.type
                                            ? "border border-red-500 focus:ring-red-500"
                                            : "border border-gray-300 focus:ring-indigo-500"
                                    }`}
                            >
                                <option value="">
                                    Sélectionner un type
                                </option>
                                {typesConsultation.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.type}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* Motif */}
                        <div className="md:col-span-2">
                            <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Motif
                            </label>
                            <textarea id="motif" name="motif"
                                value={formData.motif} onChange={handleChange} maxLength={255} rows={3} placeholder="Motif de la consultation" className={`w-full px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2
                                    ${
                                        errors.motif
                                            ? "border border-red-500 focus:ring-red-500"
                                            : "border border-gray-300 focus:ring-indigo-500"
                                    }`}
                            />
                            {errors.motif && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.motif}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2.5 rounded-lx bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white font-medium hover:bg-indigo-700 transition">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Consultation;