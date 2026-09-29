import { Bell, UserRound,} from "lucide-react";
import { getUserFromToken } from "../../services/tokenService";

function Header() {
	const user = getUserFromToken();

	return (
		<header className="h-20 bg-white border-b flex items-center justify-between px-6 py-3 z-10">
			<div>
				<h2 className="text-xl font-bold text-gray-800">
					Tableau de bord
				</h2>
				<p className="text-xs text-gray-500">
					{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
				</p>
			</div>

			<div className="flex items-center gap-6">

				<button className="relative text-gray-600 hover:text-indigo-700 transition">
					<Bell size={22} strokeWidth={2}/>
					<span className="absolute -top-1 -right-1 w-2 h-2 bg-red-700 rounded-full"/>
				</button>

				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
						<UserRound size={20} strokeWidth={2} className="text-indigo-600" />
					</div>

					<div>
						<p className="text-sm font-semibold text-gray-800">
							{user?.sub || "Utilisateur"}
						</p>

						<p className="text-xs text-gray-500">
							{user?.role || "Utilisateur"}
						</p>
					</div>

				</div>

			</div>

		</header>
	);
}

export default Header;