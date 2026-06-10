import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log("로그인 상태코드:", response.status);
    console.log("로그인 응답:", data);

    if (!response.ok) {
      alert("로그인 실패");
      return;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userId", data.userId);

    alert("로그인 성공!");
    navigate("/");
  } catch (error) {
    console.error("로그인 에러:", error);
    alert("로그인 중 오류 발생");
  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h1>로그인</h1>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button type="button" onClick={handleLogin}>
        로그인
      </button>
    </div>
  );
}

export default LoginPage;