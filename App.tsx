// App.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import XLSX from 'xlsx';
import {
  createSchema,
  insertLotto,
  getRecentLotto,
  resetSchema,
} from './LottoDB';

const App = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    createSchema();
    loadExcelFromAssets();
  }, []);

  const loadHistory = () => {
    getRecentLotto(50, setHistory);
  };

  const addSample = () => {
    const round = Math.floor(Math.random() * 1000);
    const numbers = Array.from(
      { length: 6 },
      () => Math.floor(Math.random() * 45) + 1,
    );
    insertLotto(round, numbers);
    loadHistory();
  };

  const clearAll = () => {
    resetSchema();
    loadHistory();
  };

  const loadExcelFromAssets = async () => {
    try {
      const asset = require('./assets/lotto.xlsx');
      const response = await fetch(asset);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (data.length > 0) {
        resetSchema();
      }

      data.forEach((row: any) => {
        if (row.length >= 7) {
          const round = Number(row[0]);
          const numbers = row.slice(1, 8).map(Number);
          if (!isNaN(round) && numbers.every(n => !isNaN(n))) {
            insertLotto(round, numbers);
          }
        }
      });

      loadHistory();
      Alert.alert(
        '성공',
        '엑셀 데이터가 추가되었습니다.\n\n[엑셀 예시]\n회차 | 번호1 | 번호2 | 번호3 | 번호4 | 번호5 | 번호6 | 보너스',
      );
    } catch (error) {
      Alert.alert('오류', '리소스에서 엑셀 파일을 불러오지 못했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 AI 로또 추천 + 회차 기록 🎯</Text>

      <Button title="샘플 회차 추가" onPress={addSample} />
      <Button title="전체 데이터 삭제" onPress={clearAll} color="red" />

      <ScrollView style={styles.scrollBox}>
        {history.map(item => {
          const nums = JSON.parse(item.numbers);
          const mainNumbers = nums.slice(0, 6).join(', ');
          const bonusNumber = nums[6];
          return (
            <Text key={item.id} style={styles.item}>
              {item.round}회: {mainNumbers} + 보너스({bonusNumber})
            </Text>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20 },
  scrollBox: { marginTop: 20 },
  item: { fontSize: 16, marginBottom: 10 },
});

export default App;
