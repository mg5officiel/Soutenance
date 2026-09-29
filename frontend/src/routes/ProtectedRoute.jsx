import { Navigate, Outlet } from "react-router-dom";
import { getRoleFromToken } from "../services/tokenService";

function ProtectedRoute({ roles = [] }) {

	const accessToken = localStorage.getItem("accessToken");

	if (!accessToken) {
		return <Navigate to="/login" replace />;
	}

	if (roles.length > 0) {
		const userRole = getRoleFromToken();

		if (!roles.includes(userRole)) {
			return <Navigate to="/dashboard" replace />;
		}
	}

	return <Outlet />;
}

export default ProtectedRoute;