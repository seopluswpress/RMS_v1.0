import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GOOGLE_CLIENT_ID = "230293164062-d9soskfk1uqflleoo88k7q1djkrdk2av.apps.googleusercontent.com";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("https://hemanth525.pythonanywhere.com/user/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_or_username: emailOrUsername,
          password: password
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.detail || data.non_field_errors?.[0] || "Invalid credentials");
        return;
      }
  
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Set axios default header for JWT auth
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
      navigate("/dashboard");
    } catch (err) {
      setError("Network error");
    }
  };

const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetSuccess("");
    setError("");

    try {
      const res = await fetch("https://hemanth525.pythonanywhere.com/user/request-reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();
      if (res.ok) {
        setResetSuccess("Password reset email sent! Check your inbox.");
        setResetEmail("");
        setShowResetForm(false);
      } else {
        setError(data.error || "Unable to send reset email");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <section className='auth bg-base d-flex flex-wrap' style={{ minHeight: '100vh' }}>
      <div className='auth-left d-lg-block d-none' style={{ flex: 1, background: '#e3f0ff' }}>
        <img src='assets/images/auth/auth-img.jpg' alt='' style={{ objectFit: 'cover', width: '100%', height: '100vh' }} />
      </div>

      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center' style={{ flex: 1, minWidth: 350 }}>
        <div className='max-w-464-px mx-auto w-100' style={{ maxWidth: 340, margin: '0 auto', background: '#fff', borderRadius: 14, padding: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <img src='assets/images/logo.png' alt='RMS Logo' style={{ maxWidth: 120, marginBottom: 12 }} />
            <h4 style={{ fontWeight: 700, color: '#30314f' }}>Sign In</h4>
            <p className='text-secondary-light' style={{ fontSize: 15, color: '#6c757d' }}>Welcome back!</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email or Username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email or Username'
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            {error && <div className="text-danger text-center">{error}</div>}
            {resetSuccess && <div className="text-success text-center">{resetSuccess}</div>}

            <style>{`
  .login-btn-custom:hover, .login-btn-custom:focus {
    background-color: #d1b480 !important;
    color: #fff;
    border-color: #d1b480 !important;
  }
`}</style>
            <button type="submit" className="btn w-100 mt-2 login-btn-custom" style={{ backgroundColor: '#30314f', borderColor: '#30314f', color: '#fff' }}>Login</button>
          </form>

          <div className="text-center mt-2">
            <button className="btn btn-link" onClick={() => setShowResetForm(true)}>
              Forgot Password?
            </button>
          </div>

          <div className='text-center mt-3'>
            <span>Don't have an account?</span>
            <button onClick={() => navigate('/signup')} className='btn btn-outline-primary ms-2'>Register</button>
          </div>

          <div className='mt-4 text-center'>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={async ({ credential }) => {
                  const res = await fetch("https://hemanth525.pythonanywhere.com/user/api/google-auth/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_token: credential })
                  });

                  const data = await res.json();
                  console.log("🧪 Google login response:", data);

                  if (res.ok) {
                    localStorage.setItem("access", data.access);
                    localStorage.setItem("refresh", data.refresh);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    // Set axios default header for JWT auth after Google login
                    axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

                    if (!data.user?.type) {
                      alert("❌ No user type returned from backend");
                      return;
                    }

                    navigate("/dashboard");
                  } else {
                    setError(data.detail || "Google login failed");
                  }
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 10,
            padding: 30,
            width: 350,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <h5 className="mb-3 text-center">Reset Password</h5>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="form-control"
                  placeholder="Enter your registered email"
                  required
                />
              </div>
              {error && <div className="text-danger text-center">{error}</div>}
              {resetSuccess && <div className="text-success text-center">{resetSuccess}</div>}
              <button type="submit" className="btn btn-warning w-100">Send Reset Link</button>
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => {
                  setShowResetForm(false);
                  setError("");
                  setResetSuccess("");
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}