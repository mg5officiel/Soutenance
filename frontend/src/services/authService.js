import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/auth/login", {
    username: username,
    password: password,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};