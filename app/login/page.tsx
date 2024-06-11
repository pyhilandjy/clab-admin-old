"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
  const backendUrl = process.env.BACKEND_URL;
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/users/login/`, {
        id: id,
        pw: password,
      });
      localStorage.setItem("token", response.data.access_token);
      router.push("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:2456/users/login/", {
  //       id: id,
  //       pw: password,
  //     });
  //     console.log(response);
  //     localStorage.setItem("token", response.data.access_token);
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //   }
  // };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
