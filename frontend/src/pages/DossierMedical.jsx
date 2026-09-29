import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Modal from "../components/ui/Modal";
import { Search, FolderHeart, Pencil, Stethoscope } from "lucide-react";
import api from "../services/api";


function DossierMedical() {

    // Patients récupérés depuis le backend (GET /patients)
    const [patients, setPatients] = useState([]);

    // Erreur globale (chargement patients / dossier / consultations)
    const [errorGlobal, setErrorGlobal] = useState("");

    // Dossier médical du patient sélectionné (GET /dossier-medical/patient/{id})
    const [dossier, setDossier] = useState(null);
    const [loadingDossier, setLoadingDossier] = useState(false);

    // Consultations du patient sélectionné (GET /consultations/patient/{id})
    const [consultations, setConsultations] = useState([]);
    const [loadingConsultations, setLoadingConsultations] = useState(false);

    // Patient sélectionné
    const [patientId, setPatientId] = useState("");

    // Modal (sert à la fois pour créer et modifier les infos médicales)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Formulaire (uniquement les champs du dossier médical)
    const [formData, setFormData] = useState({
        groupeSanguin: "",
        allergies: "",
        traitementEnCours: ""
    });

    // Erreurs
    const [errors, setErrors] = useState({
        groupeSanguin: "",
        allergies: "",
        traitementEnCours: ""
    });

    // Recherche
    const [search, setSearch] = useState("");


    // Charge la liste des patients au montage
    const chargerPatients = async () => {
        try {
            const response = await api.get("/patients");
            setPatients(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement des patients :", err);
            setErrorGlobal("Impossible de charger la liste des patients.");
        }
    };

    useEffect(() => {
        chargerPatients();
    }, []);


    // Erreur commune (401/403/générique) pour les chargements liés à un patient
    const messageErreur = (err, messageParDefaut) => {
        if (err.response?.status === 401) {
            return "Votre session a expiré. Veuillez vous reconnecter.";
        }
        if (err.response?.status === 403) {
            return "Accès refusé à cette ressource.";
        }
        return messageParDefaut;
    };


    // Charge le dossier médical du patient sélectionné
    const chargerDossier = async (id) => {
        try {
            setLoadingDossier(true);
            setErrorGlobal("");
            const response = await api.get(`/dossier-medical/patient/${id}`);
            // Le backend renvoie un Optional<DossierMedical> : null si aucun dossier
            setDossier(response.data || null);
        } catch (err) {
            console.error("Erreur lors du chargement du dossier médical :", err);
            setErrorGlobal(messageErreur(err, "Impossible de charger le dossier médical."));
            setDossier(null);
        } finally {
            setLoadingDossier(false);
        }
    };


    // Charge les consultations du patient sélectionné
    const chargerConsultationsPatient = async (id) => {
        try {
            setLoadingConsultations(true);
            const response = await api.get(`/consultations/patient/${id}`);
            setConsultations(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement des consultations :", err);
            setErrorGlobal(messageErreur(err, "Impossible de charger les consultations du patient."));
            setConsultations([]);
        } finally {
            setLoadingConsultations(false);
        }
    };


    // Changement de patient : recharge dossier + consultations
    const handlePatientChange = (e) => {
        const id = e.target.value;
        setPatientId(id);

        if (id) {
            chargerDossier(id);
            chargerConsultationsPatient(id);
        } else {
            setDossier(null);
            setConsultations([]);
        }
    };


    // Gestion des champs du formulaire
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


    // Ouvre le modal, pré-rempli avec le dossier existant s'il y en a un
    // (sinon champs vides — un seul formulaire sert à créer ET modifier)
    const handleOpenModal = () => {
        setFormError("");

        setFormData({
            groupeSanguin: dossier?.groupeSanguin || "",
            allergies: dossier?.allergies || "",
            traitementEnCours: dossier?.traitementEnCours || ""
        });

        setErrors({
            groupeSanguin: "",
            allergies: "",
            traitementEnCours: ""
        });

        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    // Validation puis envoi au backend — POST si le patient n'a pas encore
    // de dossier, PUT sinon. La décision se base uniquement sur `dossier`.
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (formData.groupeSanguin.length > 10) {
            newErrors.groupeSanguin =
                "Le groupe sanguin ne doit pas dépasser 10 caractères.";
        }

        if (formData.allergies.length > 250) {
            newErrors.allergies =
                "Les allergies ne doivent pas dépasser 250 caractères.";
        }

        if (formData.traitementEnCours.length > 250) {
            newErrors.traitementEnCours =
                "Le traitement ne doit pas dépasser 250 caractères.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Relation OneToOne vers Patient : envoyée sous forme d'objet { id }
        const payload = {
            groupeSanguin: formData.groupeSanguin.trim(),
            allergies: formData.allergies.trim(),
            traitementEnCours: formData.traitementEnCours.trim(),
            patient: { id: Number(patientId) }
        };

        try {
            setSubmitting(true);
            setFormError("");

            if (dossier) {
                await api.put(`/dossier-medical/update/${dossier.id}`, payload);
            } else {
                await api.post("/dossier-medical/new", payload);
            }

            await chargerDossier(patientId);
            setIsModalOpen(false);

        } catch (err) {
            console.error("Erreur lors de l'enregistrement du dossier médical :", err);
            setFormError(messageErreur(err, "Impossible d'enregistrer le dossier médical."));
        } finally {
            setSubmitting(false);
        }
    };


    // Patient actuellement sélectionné (objet complet, pour afficher ses infos)
    const patientSelectionne = patients.find(
        (patient) => String(patient.id) === String(patientId)
    );


    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="p-4">

                    {errorGlobal && (
                        <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 text-sm">
                            {errorGlobal}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FolderHeart size={21} className="text-indigo-600"/>
                            <h2 className="font-semibold text-gray-800">
                                Dossiers médicaux
                            </h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value) } placeholder="Rechercher un patient..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            </div>

                            <select value={patientId} onChange={handlePatientChange} className="md:w-80 px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">

                                <option value="">
                                    Sélectionner un patient
                                </option>

                                {patients
                                    .filter((patient) => {
                                        const nom =
                                            `${patient.prenom} ${patient.nom}`
                                                .toLowerCase();

                                        return nom.includes(
                                            search.toLowerCase()
                                        );

                                    })
                                    .map((patient) => (

                                        <option
                                            key={patient.id}
                                            value={patient.id}
                                        >
                                            {patient.prenom} {patient.nom}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {patientId && patientSelectionne && (
                        <div className="bg-white rounded-xl shadow-sm mb-6">
                            <div className="flex items-center justify-between px-6 py-4 border-b">
                                <div>
                                    <h2 className="font-semibold text-gray-800">
                                        Informations du patient
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        Identité, coordonnées et informations médicales
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button type="button" onClick={handleOpenModal} className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-200 text-indigo-700 hover:bg-indigo-300 transition">
                                        <Pencil size={17} />
                                        <span>
                                            Modifier
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {loadingDossier ? (

                                    <p className="text-center text-gray-400 py-10">
                                        Chargement...
                                    </p>

                                ) : (

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                                        {/* Nom complet */}
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">
                                                Nom complet
                                            </p>
                                            <p className="text-gray-800">
                                                {patientSelectionne.prenom || "Non renseigné"} {patientSelectionne.nom || ""}
                                            </p>
                                        </div>

                                        {/* Téléphone */}
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">
                                                Téléphone
                                            </p>
                                            <p className="text-gray-800">
                                                {patientSelectionne.telephone || "Non renseigné"}
                                            </p>
                                        </div>

                                        {/* Adresse */}
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">
                                                Adresse
                                            </p>
                                            <p className="text-gray-800">
                                                {patientSelectionne.adresse || "Non renseigné"}
                                            </p>
                                        </div>

                                        {/* Sexe */}
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">
                                                Sexe
                                            </p>
                                            <p className="text-gray-800">
                                                {patientSelectionne.sexe === "HOMME"
                                                    ? "Homme"
                                                    : patientSelectionne.sexe === "FEMME"
                                                        ? "Femme"
                                                        : "Non renseigné"}
                                            </p>
                                        </div>

                                        {/* Groupe sanguin */}
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">
                                                Groupe sanguin
                                            </p>
                                            <p className="text-gray-800">
                                                {dossier?.groupeSanguin || "Non renseigné"}
                                            </p>
                                        </div>

                                        {/* Allergies */}
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">
                                                Allergies
                                            </p>
                                            <p className="text-gray-800">
                                                {dossier?.allergies || "Non renseigné"}
                                            </p>
                                        </div>

                                        {/* Traitement */}
                                        <div>
                                            <p className="font-medium text-gray-500 mb-1">
                                                Traitement en cours
                                            </p>
                                            <p className="text-gray-800">
                                                {dossier?.traitementEnCours || "Non renseigné"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {patientId && (
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="flex items-center gap-2 px-4 py-3 border-b">
                                <Stethoscope size={19} className="text-indigo-600" />
                                <h2 className="font-semibold text-gray-800">
                                    Consultations
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                                                Date
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                                                Type
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                                                Personnel
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                                                Motif
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingConsultations && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-400">
                                                    Chargement...
                                                </td>
                                            </tr>
                                        )}

                                        {!loadingConsultations && consultations.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-400">
                                                    Aucune consultation enregistrée pour ce patient.
                                                </td>
                                            </tr>
                                        )}

                                        {!loadingConsultations && consultations.map((consultation) => (
                                            <tr key={consultation.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {consultation.date}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {consultation.type?.type}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {consultation.personnel?.prenom} {consultation.personnel?.nom}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {consultation.motif}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal — sert à la fois à créer et à modifier le dossier médical */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}
                title={
                    dossier
                        ? "Modifier les informations médicales"
                        : "Renseigner les informations médicales"
                }
            >
                <form onSubmit={handleSubmit}>

                    {formError && (
                        <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 text-red-700 text-sm">
                            {formError}
                        </div>
                    )}

                    {/* Groupe sanguin */}
                    <div className="mb-4">
                        <label htmlFor="groupeSanguin" className="block font-medium text-gray-700 mb-1.5">
                            Groupe sanguin
                        </label>

                        <input type="text" id="groupeSanguin" name="groupeSanguin" value={formData.groupeSanguin} onChange={handleChange} maxLength={10} placeholder="Ex : A+"
                            className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2
                                ${
                                    errors.groupeSanguin
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-indigo-500"
                                }`}
                        />

                        {errors.groupeSanguin && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.groupeSanguin}
                            </p>
                        )}
                    </div>

                    {/* Allergies */}
                    <div className="mb-4">
                        <label htmlFor="allergies" className="block font-medium text-gray-700 mb-1.5">
                            Allergies
                        </label>
                        <textarea id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} maxLength={250} rows={3} placeholder="Allergies connues..."
                            className={`w-full px-3 py-2.5 border rounded-lg resize-none focus:outline-none focus:ring-2
                                ${
                                    errors.allergies
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-indigo-500"
                                }`}
                        />
                        {errors.allergies && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.allergies}
                            </p>
                        )}

                    </div>

                    {/* Traitement */}
                    <div className="mb-5">
                        <label htmlFor="traitementEnCours" className="block font-medium text-gray-700 mb-1.5">
                            Traitement en cours
                        </label>
                        <textarea id="traitementEnCours" name="traitementEnCours" value={formData.traitementEnCours} onChange={handleChange} maxLength={250} rows={3} placeholder="Traitement en cours..."
                            className={`w-full px-3 py-2.5 border rounded-lg resize-none focus:outline-none focus:ring-2
                                ${
                                    errors.traitementEnCours
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-indigo-500"
                                }`}
                        />
                        {errors.traitementEnCours && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.traitementEnCours}
                            </p>
                        )}
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                            Annuler
                        </button>

                        <button type="submit" disabled={submitting} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50">
                            {submitting
                                ? "Enregistrement..."
                                : dossier
                                    ? "Modifier"
                                    : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default DossierMedical;