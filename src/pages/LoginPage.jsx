import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LOGIN_API_URL = import.meta.env.DEV
  ? "http://15.165.95.129:8080/auth/login"
  : "/api/auth/login";

const readResponseBody = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("로그인 응답을 JSON으로 해석하지 못했습니다.", error);
    return text;
  }
};

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await readResponseBody(response);
      console.log("로그인 요청 URL:", LOGIN_API_URL);
      console.log("로그인 상태코드:", response.status);
      console.log("로그인 응답:", data);

      if (!response.ok) {
        alert("로그인에 실패했습니다.");
        return;
      }

      if (!data?.accessToken) {
        alert("로그인 응답에 토큰이 없습니다.");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.userId);

      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
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
          <span className="auth-muted-link">아이디 · 비밀번호 찾기</span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
