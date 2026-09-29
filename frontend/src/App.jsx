import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patient from "./pages/Patient";
import Personnel from "./pages/Personnel";
import Consultation from "./pages/Consultation";
import DossierMedical from "./pages/DossierMedical";
import Utilisateur from "./pages/Utilisateur";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
	return (
	<BrowserRouter>

		<Routes>
			<Route path="/" element={<Navigate to="/login" replace />}/>

			<Route path="/login" element={<Login />} />

			<Route element={<ProtectedRoute />}>
        		<Route path="/dashboard" element={<Dashboard />} />
        	</Route>

			<Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
				<Route path="/patients" element={<Patient />} />
				<Route path="/personnel" element={<Personnel />} />
				<Route path="/utilisateur" element={<Utilisateur />} />
				<Route path="/consultations" element={<Consultation />} />
				<Route path="/dossiers" element={<DossierMedical />} />
			</Route>

			<Route element={<ProtectedRoute roles={["ROLE_SECRETAIRE"]} />}>
				<Route path="/patients" element={<Patient />} />
			</Route>

			<Route element={<ProtectedRoute roles={["ROLE_MEDECIN"]} />}>
				<Route path="/consultations" element={<Consultation />} />
				<Route path="/dossiers" element={<DossierMedical />} />
				<Route path="/personnel" element={<Personnel />} />
			</Route>

			<Route element={<ProtectedRoute roles={["ROLE_INFIRMIER"]} />}>
				<Route path="/consultations" element={<Consultation />} />
				<Route path="/dossiers" element={<DossierMedical />} />
			</Route>

		</Routes>

	</BrowserRouter>
	);
}

export default App;