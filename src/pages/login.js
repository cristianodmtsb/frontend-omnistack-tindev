import React, { useState } from "react";
import Logo from "../assets/logo.svg";

import api from "../services/api";

import "./login.css";

export default function Login({ history }) {
  const [username, setUsername] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post("/devs", { username });
    const { _id } = response.data;

    console.log(_id);

    history.push(`/dev/${_id}`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={Logo} alt="Tindev" />
        <input
          placeholder="Digite seu uruario no Github"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
