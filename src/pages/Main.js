import React, { useEffect, useState } from "react";
import api from "../services/api";
import io from "socket.io-client";
import Logo from "../assets/logo.svg";
import Like from "../assets/like.svg";
import Dislike from "../assets/dislike.svg";
import ItsaMatch from "../assets/itsamatch.png";

import "./main.css";

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: { user: match.params.id }
      });
      setUsers(response.data);
    }
    loadUsers();
  }, [match.params.id]);

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: { user: match.params.id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [match.params.id]);

  async function handlelike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }
  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <img src={Logo} alt="Tindev" />
      <ul>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>
              <div className="buttons">
                <button type="button" onClick={() => handleDislike(user._id)}>
                  <img src={Dislike} alt="Dislike" />
                </button>
                <button type="button" onClick={() => handlelike(user._id)}>
                  <img src={Like} alt="Like" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <h2>Lista Vazia</h2>
        )}
      </ul>
      {matchDev && (
        <div className="match-container">
          <img src={ItsaMatch} alt="It's a Match!" />
          <img className="avatar" src={matchDev.avatar} alt={matchDev.name} />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>
          <button type="button" onClick={() => setMatchDev(null)}>
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
