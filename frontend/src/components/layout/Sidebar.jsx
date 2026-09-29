import { NavLink, useNavigate  } from "react-router-dom";
import { LayoutDashboard, UserRound, Stethoscope, FolderHeart, UsersRound, Settings, LogOut, Hospital,} from "lucide-react";
import { logout } from "../../services/authService";
import { getRoleFromToken } from "../../services/tokenService";

function Sidebar() {

	const navigate = useNavigate();

	const role = getRoleFromToken(); // "ROLE_ADMIN", "ROLE_MEDECIN" …
  	const is  = (r) => role === `ROLE_${r}`;
  	const any = (...roles) => roles.some((r) => is(r));

	const handleLogout = () => {
		logout();
		navigate("/login", { replace: true });
	};

	const linkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
    ${isActive
      ? "bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 text-white"
      : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-500 hover:text-white"
    }`;

	return (
		<aside className="w-64 min-h-screen bg-white text-gray-700 flex flex-col">
			<div className="h-20 flex items-center gap-3 px-6 border-b border-gray-300">
				<Hospital size={30} strokeWidth={2} />
				<h1 className="text-sm font-bold">
					Gestion Clinique
				</h1>
			</div>

			<nav className="flex-1 p-4">
				<div className="space-y-2 text-white font-semibold">
					<NavLink to="/dashboard" className={linkClass}>
						<LayoutDashboard size={20} strokeWidth={2} />
						<span>
							Tableau de bord
						</span>
					</NavLink>
					
					{any("ADMIN", "SECRETAIRE") && (
						<NavLink to="/patients" className={linkClass}>
							<UserRound size={20} strokeWidth={2} />
							<span>Patients</span>
						</NavLink>
					)}

					{any("ADMIN", "MEDECIN", "INFIRMIER") && (
						<NavLink to="/consultations" className={linkClass}>
						<Stethoscope size={20} strokeWidth={2} />
						<span>Consultations</span>
						</NavLink>
					)}

					{any("ADMIN", "MEDECIN", "INFIRMIER") && (
						<NavLink to="/dossiers" className={linkClass}>
							<FolderHeart size={20} strokeWidth={2} />
							<span>Dossiers médicaux</span>
						</NavLink>
					)}

					{is("ADMIN", "MEDECIN") && (
						<NavLink to="/personnel" className={linkClass}>
							<UsersRound size={20} strokeWidth={2} />
							<span>Personnel</span>
						</NavLink>
					)}

					{is("ADMIN") && (
						<NavLink to="/utilisateur" className={linkClass}>
							<UserRound size={20} strokeWidth={2} />
							<span>Utilisateurs</span>
						</NavLink>
					)}
				</div>
			</nav>

			<div className="p-1 border-t border-gray-300">
				<button onClick={handleLogout} className="w-full flex items-center font-semibold gap-3 px-4 py-3 rounded-lg text-red-700 hover:bg-red-700 hover:text-white transition">
					<LogOut size={20} strokeWidth={2} />
					<span>
						Déconnexion
					</span>
				</button>
			</div>

		</aside>
	);
}

export default Sidebar;