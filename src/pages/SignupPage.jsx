import { Link } from "react-router-dom";
import { useState } from "react";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nickname,
        }),
      });

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      alert("회원가입 성공!");
    } catch (error) {
      console.error(error);
      alert("회원가입 실패");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card signup-card">
        <p className="auth-kicker">MOODIARY</p>
        <h1 className="auth-title">회원가입</h1>

        <div className="auth-avatar" aria-hidden="true">
          <span className="auth-avatar-face">♡</span>
        </div>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSignup();
          }}
        >
          <label className="auth-field">
            <span>닉네임</span>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>

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
            가입하기
          </button>
        </form>

        <div className="auth-links auth-links-center">
          <span>이미 계정이 있나요?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
