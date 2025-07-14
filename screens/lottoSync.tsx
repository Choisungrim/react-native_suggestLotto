// lottoSync.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { insertLotto } from '../LottoDB';
import rawData from '../assets/lotto.json';

const lottoData = rawData['excel.xls']; // 실제 배열 추출
const SYNC_KEY = 'lastLottoSyncDate';

export const syncLottoFromAssets = async (): Promise<number> => {
  let inserted = 0;

  for (const item of lottoData) {
    const round = Number(item['회차']);
    const numbers = [
      Number(item['1']),
      Number(item['2']),
      Number(item['3']),
      Number(item['4']),
      Number(item['5']),
      Number(item['6']),
      Number(item['보너스']),
    ];

    if (!isNaN(round) && numbers.every(n => !isNaN(n))) {
      await insertLotto(round, numbers);
      inserted++;
    }
  }

  return inserted;
};

export const checkAndAutoSync = async (): Promise<number | null> => {
  try {
    const today = new Date();
    const isSunday = today.getDay() === 0;
    const dateString = today.toISOString().split('T')[0];

    const lastSynced = await AsyncStorage.getItem(SYNC_KEY);

    if (isSunday && lastSynced !== dateString) {
      const inserted = await syncLottoFromAssets();
      await AsyncStorage.setItem(SYNC_KEY, dateString);
      return inserted;
    }

    return null;
  } catch (e) {
    console.error('자동 동기화 실패:', e);
    return null;
  }
};
