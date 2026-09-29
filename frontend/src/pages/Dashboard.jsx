import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/ui/StatCard";
import { Users, Stethoscope, FolderHeart, UserRound } from "lucide-react";
import api from "../services/api";
import { getRoleFromToken } from "../services/tokenService";

function Dashboard() {
	const [stats, setStats]     = useState(null);
	const [consultations, setConsultations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingConsult, setLoadingConsult] = useState(true);
	const [error, setError] = useState(null);
	const role = getRoleFromToken();
    const canSeeConsultations = ["ROLE_ADMIN", "ROLE_MEDECIN", "ROLE_INFIRMIER"].includes(role);
	
	// Un seul appel : /dashboard/stats Accessible à tous les rôles
	useEffect(() => {
        api.get("/dashboard/stats")
            .then(({ data }) => setStats(data))
            .catch(() => setError("Impossible de contacter le serveur. Vérifiez que le backend est démarré sur le port 8080."))
            .finally(() => setLoading(false));
    }, []);

	// Consultations récentes — uniquement pour les rôles autorisés
    useEffect(() => {
        if (!canSeeConsultations) {
            setLoadingConsult(false);
            return;
        }
        api.get("/consultations")
            .then(({ data }) => {
                const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
                setConsultations(sorted.slice(0, 5));
            })
            .catch(console.error)
            .finally(() => setLoadingConsult(false));
    }, []);
 
    const v = (key) => loading ? "…" : (stats?.[key] ?? 0);
	
		function formatDate(dateStr) {
			if (!dateStr) return "—";
			return new Date(dateStr).toLocaleDateString("fr-FR", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			});
		}
	return (
		<div className="min-h-screen bg-gray-100 flex">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="p-4">
					{error && (
						<div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
							{error}
						</div>
					)}

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
						<StatCard title="Patients" value={v("totalPatients")} icon={Users}/>
						<StatCard title="Consultations" value={v("totalConsultations")} icon={Stethoscope}/>
						<StatCard title="Dossiers médicaux" value={v("totalDossiers")} icon={FolderHeart}/>
						<StatCard title="Personnel" value={v("totalPersonnels")} icon={UserRound}/>
					</div>
					<div className="bg-white rounded-xl shadow-sm overflow-hidden mt-3">
						<div className="px-4 py-3 border-b flex items-center justify-between">
							<h2 className="text-sm font-semibold text-gray-700">
								Consultations récentes
							</h2>
							{!loading && consultations.length > 0 && (
								<span className="text-xs text-gray-400">
									{consultations.length} dernières
								</span>
							)}
						</div>
						<div className="overflow-x-auto">
							<table className="w-full rounded-xl">
								<thead>
                                    <tr className="bg-white backdrop-blur-sm  border-b">
										<th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Date</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Patient</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Personnel</th>
                                        <th className="text-left px-4 py-3 sticky top-0 z-10 font-semibold text-gray-500">Motif</th>
                                    </tr>
                                </thead>

								<tbody className="divide-y divide-gray-50">
									{loading ? (
										[...Array(3)].map((_, i) => (
											<tr key={i}>
												{[...Array(5)].map((_, j) => (
													<td key={j} className="px-4 py-3">
														<div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
													</td>
												))}
											</tr>
										))
									) : consultations.length === 0 ? (
										<tr>
											<td
												colSpan={5}
												className="px-4 py-10 text-center text-gray-400"
											>
												Aucune consultation enregistrée
											</td>
										</tr>
									) : (
										consultations.map((c) => (
											<tr key={c.id} className="hover:bg-gray-50 transition-colors"
											>
												<td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
													{formatDate(c.date)}
												</td>
												<td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
													{c.patient
														? `${c.patient.prenom} ${c.patient.nom}`
														: "—"}
												</td>
												<td className="px-4 py-3 text-gray-600 whitespace-nowrap">
													{c.personnel
														? `Dr. ${c.personnel.prenom} ${c.personnel.nom}`
														: "—"}
												</td>
												<td className="px-4 py-3 text-gray-600">
													{c.motif || "—"}
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
		</div>
	);
}

export default Dashboard;