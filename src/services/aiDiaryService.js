const AI_CHAT_URL = "https://dlqudwn153-moo-diary-ai-prompt.hf.space/chat";
const AI_RESULT_CACHE_KEY = "mooDiaryAiResults";

export const EMOTION_STAMPS = {
  joy: { emoji: "😊", label: "기쁨" },
  sadness: { emoji: "😢", label: "슬픔" },
  anger: { emoji: "😠", label: "분노" },
  fear: { emoji: "😰", label: "두려움" },
  surprise: { emoji: "😮", label: "놀람" },
  disgust: { emoji: "🤢", label: "싫음" },
  neutral: { emoji: "😐", label: "중립" },
};

const VALID_EMOTIONS = Object.keys(EMOTION_STAMPS);
const EMOTION_ALIASES = {
  happy: "joy",
};

const normalizeEmotion = (emotion) => {
  const normalizedEmotion = String(emotion || "")
    .trim()
    .toLowerCase();
  const mappedEmotion = EMOTION_ALIASES[normalizedEmotion] || normalizedEmotion;

  return VALID_EMOTIONS.includes(mappedEmotion)
    ? mappedEmotion
    : "neutral";
};

const normalizeCacheKey = (postId) => String(postId || "").trim();

const normalizeDiaryText = (value) => String(value || "").trim();

export const formatDiaryDateForAi = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const normalizeAiDiaryResponse = (data, fallbackDate) => {
  return {
    emotion: normalizeEmotion(data?.emotion),
    aiText: data?.aiText || "",
    homeComment: data?.homeComment || "",
    diaryDate: data?.diaryDate || fallbackDate,
  };
};

export const requestDiaryAi = async ({ userText, diaryDate }) => {
  const response = await fetch(AI_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recent_emotions: "neutral",
      user_text: userText,
      diary_date: diaryDate,
    }),
  });

  if (!response.ok) {
    throw new Error("AI API 요청 실패");
  }

  const data = await response.json();
  return normalizeAiDiaryResponse(data, diaryDate);
};

export const getEmotionStamp = (emotion) => {
  return EMOTION_STAMPS[emotion] || EMOTION_STAMPS.neutral;
};

const readAiResultCache = () => {
  try {
    return JSON.parse(sessionStorage.getItem(AI_RESULT_CACHE_KEY)) || {};
  } catch (error) {
    console.warn("AI 결과 임시 캐시를 읽지 못했습니다.", error);
    return {};
  }
};

export const saveDiaryAiResult = (postId, aiResult) => {
  const cacheKey = normalizeCacheKey(postId);

  if (!cacheKey || !aiResult) return;

  const cache = readAiResultCache();
  sessionStorage.setItem(
    AI_RESULT_CACHE_KEY,
    JSON.stringify({
      ...cache,
      [cacheKey]: aiResult,
      latest: aiResult,
    })
  );
};

export const getDiaryAiResult = (postId) => {
  const cacheKey = normalizeCacheKey(postId);

  if (!cacheKey) return null;

  const cache = readAiResultCache();
  return cache[cacheKey] || null;
};

export const getDiaryAiResultByDiary = ({ title, content }) => {
  const normalizedTitle = normalizeDiaryText(title);
  const normalizedContent = normalizeDiaryText(content);
  const cache = readAiResultCache();

  return (
    Object.values(cache).find(
      (aiResult) =>
        normalizeDiaryText(aiResult?.diaryTitle) === normalizedTitle &&
        normalizeDiaryText(aiResult?.diaryContent) === normalizedContent
    ) || null
  );
};

export const getLatestDiaryAiResult = () => {
  const cache = readAiResultCache();
  return cache.latest || null;
};
