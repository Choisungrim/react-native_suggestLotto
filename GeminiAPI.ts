// GeminiAPI.ts
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: 'AIzaSyBsJJDZhVSoHXdRBOZRmg3peI7Ms6DwejQ',
}); // 🔑 본인의 Gemini API 키 입력

export const callGeminiAPI = async (history: any[]): Promise<string> => {
  try {
    const prompt = generatePrompt(history);

    const response = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = (await response).text;
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

  return `당신은 최고의 수학자이자 통계 기반 예측 모델입니다. 다음 회차 로또 번호를 예측해 주세요.
다음은 최근 10개 회차의 로또 당첨 번호입니다:

${recent}

규칙:
- 반드시 6개의 숫자 + 보너스 숫자 1개를 "숫자, 숫자, ..., 숫자 + 보너스(숫자)" 형식으로 출력하세요.
- 다른 설명이나 문장은 포함하지 마세요. 오직 숫자 추천 결과만 출력해주세요.
- 추천 번호는 1부터 45 사이의 숫자여야 합니다.
- 중복된 숫자는 포함하지 마세요.
- 추천 번호는 반드시 6개이며, 보너스 번호는 1개입니다
- 추천 번호는 항상 오름차순으로 정렬되어야 합니다.
- 총 5개의 추천번호를 출력하세요.`;
};
