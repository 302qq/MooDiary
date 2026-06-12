const parseStoredDiaries = () => {
  try {
    return JSON.parse(localStorage.getItem("diaries")) || [];
  } catch (error) {
    console.warn("저장된 일기 날짜 정보를 읽지 못했습니다.", error);
    return [];
  }
};

const normalizeText = (value) => String(value || "").trim();

export const findStoredDiary = (post) => {
  const diaries = parseStoredDiaries();
  const postId = normalizeText(post?.id);
  const title = normalizeText(post?.title);
  const content = normalizeText(post?.content);

  return (
    diaries.find((diary) => normalizeText(diary.id) === postId) ||
    diaries.find(
      (diary) =>
        normalizeText(diary.title) === title &&
        normalizeText(diary.content) === content
    ) ||
    null
  );
};

export const getDiaryDisplayDate = (post, aiResult) => {
  const storedDiary = findStoredDiary(post);
  const rawDate =
    post?.date ||
    post?.diaryDate ||
    post?.createdAt ||
    storedDiary?.date ||
    aiResult?.diaryDate ||
    "";

  if (!rawDate) {
    return "날짜 없음";
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
    return rawDate.slice(0, 10);
  }

  return rawDate;
};
