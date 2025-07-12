// Utility for authenticated fetch with JWT and auto-refresh
export async function authFetch(url, options = {}) {
  let access = localStorage.getItem("access");
  let headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    "Authorization": `Bearer ${access}`,
  };

  let response = await fetch(url, { ...options, headers });

  // If token expired, try to refresh
  if (response.status === 401 && localStorage.getItem("refresh")) {
    // Attempt token refresh
    const refreshResponse = await fetch("https://hemanth525.pythonanywhere.com/user/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      localStorage.setItem("access", refreshData.access);
      headers["Authorization"] = `Bearer ${refreshData.access}`;
      response = await fetch(url, { ...options, headers });
    } else {
      // Refresh failed, log out user
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  }

  return response;
}
