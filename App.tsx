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
import {
  createSchema,
  insertLotto,
  getRecentLotto,
  resetSchema,
} from './LottoDB';
import { getLottoPrediction } from './GeminiAPI';

const App = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<string>('');

  useEffect(() => {
    createSchema();
    loadHistory();
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

  const handlePredictLotto = async () => {
    const prompt = `다음 로또 번호를 예측해줘. 최근 회차 데이터: \n${history
      .map(item => {
        const nums = JSON.parse(item.numbers).join(', ');
        return `${item.round}회: ${nums}`;
      })
      .join('\n')}`;

    const result = await getLottoPrediction(prompt);
    setPrediction(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 AI 로또 추천 + 회차 기록 🎯</Text>

      <Button title="샘플 회차 추가" onPress={addSample} />
      <Button title="전체 데이터 삭제" onPress={clearAll} color="red" />
      <Button
        title="다음 회차 AI 추천"
        onPress={handlePredictLotto}
        color="green"
      />

      {prediction ? (
        <View style={styles.predictionBox}>
          <Text style={styles.predictionTitle}>AI 추천 번호:</Text>
          <Text style={styles.predictionText}>{prediction}</Text>
        </View>
      ) : null}

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
  predictionBox: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  predictionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  predictionText: { fontSize: 16 },
});

export default App;
