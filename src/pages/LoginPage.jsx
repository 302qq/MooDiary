import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">MOODIARY</p>
        <h1 className="auth-title">로그인</h1>

        <div className="auth-avatar" aria-hidden="true">
          <span className="auth-avatar-face">♡</span>
        </div>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <label className="auth-field">
            <span>이메일</span>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>비밀번호</span>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="auth-submit" type="submit">
            로그인
          </button>
        </form>

        <div className="auth-links">
          <span className="auth-muted-link">아이디, 비밀번호 찾기</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
