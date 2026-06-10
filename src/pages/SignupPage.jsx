import { useState } from "react";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSignup = async () => {
    try {
      const response = await fetch(
        "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            nickname,
          }),
        }
      );

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
    <div style={{ padding: "30px" }}>
      <h1>회원가입</h1>

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

      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}

export default SignupPage;