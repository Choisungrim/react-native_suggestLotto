import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import { getRecentLotto, resetSchema } from '../LottoDB';

const HistoryScreen = () => {
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = () => {
    getRecentLotto(50, setHistory);
  };

  const clearAll = () => {
    Alert.alert('전체 삭제', '모든 회차 기록을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          resetSchema();
          loadHistory();
        },
      },
    ]);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
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
  scrollBox: { marginTop: 20 },
  item: { fontSize: 16, marginBottom: 10 },
});

export default HistoryScreen;
