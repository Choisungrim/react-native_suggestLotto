// GeminiAPI.ts

import axios from 'axios';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const API_KEY = ''; // 🔑 여기에 본인의 Gemini API 키 입력

export const callGeminiAPI = async (history: any[]): Promise<string> => {
  try {
    const prompt = generatePrompt(history);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || '추천 결과를 받아오지 못했습니다.';
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    return '오류가 발생했습니다.';
  }
};

const generatePrompt = (history: any[]): string => {
  const recent = history
    .slice(0, 10)
    .map(
      item =>
        `${item.round}회: ${JSON.parse(item.numbers)
          .slice(0, 6)
          .join(', ')} + 보너스(${JSON.parse(item.numbers)[6]})`,
    )
    .join('\n');

  return `다음 회차 로또 번호를 추천해줘. 다음은 최근 회차 데이터야:\n${recent}\n\n추천 번호 6개 + 보너스 번호 1개로 알려줘.`;
};
