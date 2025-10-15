// Client-side storage for non-sensitive data
export function setUserData(user: any) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("user", JSON.stringify(user));
  }
}

export function getUserData() {
  if (typeof window !== "undefined") {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function clearUserData() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("user");
  }
}

// Check if user is authenticated (client-side)
export function isAuthenticated() {
  return !!getUserData();
}
