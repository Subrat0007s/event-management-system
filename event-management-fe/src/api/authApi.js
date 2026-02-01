import api from "./axios";

export const registerUser = (data) => api.post("/user/register", data);

export const loginUser = (data) => api.post("/user/login", data);

export const socialLogin = (data) => api.post("/user/social-login", data);

export const linkSocialAccount = (userId, data) =>
  api.post(`/user/link-social/${userId}`, data);

export const verifyOtp = (email, otp) =>
  api.post("/user/verify-otp", null, {
    params: { email, otp },
  });

export const resendOtp = (email) =>
  api.post("/user/resend-otp", null, {
    params: { email },
  });

export const updateProfile = (email, name) =>
  api.put("/user/update-profile", null, {
    params: { email, name },
  });

export const changePassword = (email, oldPwd, newPwd) =>
  api.put("/user/change-password", null, {
    params: { email, oldPwd, newPwd },
  });

export const verifyEmail = (token) =>
  api.get("/user/verify", {
    params: { token },
  });

export const logout = (userId) =>
  api.post("/user/logout", null, {
    params: { userId },
  });
