import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { createSchema, getRecentLotto } from '../LottoDB';
import { callGeminiAPI } from '../GeminiAPI';
import { useNavigation } from '@react-navigation/native';
import { checkAndAutoSync, syncLottoFromAssets } from './lottoSync';

const HomeScreen = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    createSchema();
    checkAndAutoSync(); // 일요일 자동 동기화
    getRecentLotto(50, setHistory);
  }, []);

  const handlePredictLotto = async () => {
    setLoading(true);
    const result = await callGeminiAPI(history);
    setPrediction(result);
    setLoading(false);
  };

  const handleManualSync = async () => {
    const count = await syncLottoFromAssets();
    Alert.alert(`${count}개의 회차 데이터를 추가했습니다.`);
    getRecentLotto(count, setHistory); // 갱신
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> AI 로또 번호 추천 </Text>

      <Button
        title="다음 회차 AI 추천"
        onPress={handlePredictLotto}
        color="green"
      />
      <View style={{ height: 10 }} />
      <Button
        title="📜 회차 기록 보기"
        onPress={() => navigation.navigate('History')}
      />
      <Button
        title="로또 데이터 수동 동기화"
        onPress={handleManualSync}
        color="orange"
      />
      <View style={{ height: 10 }} />

      {loading ? (
        <View style={styles.predictionBox}>
          <Text style={styles.predictionText}>로딩중...</Text>
        </View>
      ) : prediction ? (
        <View style={styles.predictionBox}>
          <Text style={styles.predictionTitle}>
            {Math.max(...history.map(h => h.round), 0) + 1}회 추천 번호:
          </Text>
          <Text style={styles.predictionText}>{prediction}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20 },
  predictionBox: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  predictionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  predictionText: { fontSize: 16 },
});

export default HomeScreen;
