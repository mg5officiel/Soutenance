import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
	const token = localStorage.getItem("accessToken");

	if (!token) {
		return null;
	}

	try {
		return jwtDecode(token);
	} catch (error) {
		console.error("Token JWT invalide :", error);
		return null;
	}
};

// Retourne le rôle extrait du token JWT.
export const getRoleFromToken = () => {
	const user = getUserFromToken();
	return user?.role ?? null;
};

// Vérifie si l'utilisateur connecté possède l'un des rôles autorisés.
export const hasRole = (allowedRoles = []) => {
	const role = getRoleFromToken();
	return allowedRoles.includes(role);
};