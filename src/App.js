import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("login"); // login | signup | dashboard
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  const handleLogin = (tok, name) => {
    localStorage.setItem("token", tok);
    localStorage.setItem("userName", name);
    setToken(tok);
    setUserName(name);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken("");
    setUserName("");
    setPage("login");
  };

  if (token && page !== "login" && page !== "signup") {
    return <Dashboard token={token} userName={userName} onLogout={handleLogout} />;
  }

  if (page === "signup") {
    return <Signup onSwitch={() => setPage("login")} />;
  }

  return <Login onLogin={handleLogin} onSwitch={() => setPage("signup")} />;
}

export default App;