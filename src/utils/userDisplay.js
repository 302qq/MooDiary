const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json);
  } catch (error) {
    console.warn("JWT에서 닉네임 정보를 읽지 못했습니다.", error);
    return null;
  }
};

export const getDisplayNickname = () => {
  const token = localStorage.getItem("accessToken");
  const payload = token ? decodeJwtPayload(token) : null;

  return (
    payload?.nickname ||
    payload?.nickName ||
    payload?.name ||
    payload?.username ||
    "MooDiary 사용자"
  );
};
