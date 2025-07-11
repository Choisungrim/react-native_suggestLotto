import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'LottoDB', location: 'default' });

// ✅ 테이블 생성 (최초 1회만 호출)
export const createSchema = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS LottoHistory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        round INTEGER UNIQUE,
        numbers TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
    );
  });
};

// ✅ 데이터 삽입 (round 중복 시 무시)
export const insertLotto = (round: number, numbers: number[]) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT OR IGNORE INTO LottoHistory (round, numbers) VALUES (?, ?)',
      [round, JSON.stringify(numbers)],
    );
  });
};

// ✅ 최근 회차 데이터 조회
export const getRecentLotto = (
  limit: number = 50,
  callback: (results: any[]) => void,
) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM LottoHistory ORDER BY round DESC LIMIT ?',
      [limit],
      (_, { rows }) => {
        const result: any[] = [];
        for (let i = 0; i < rows.length; i++) {
          result.push(rows.item(i));
        }
        callback(result);
      },
    );
  });
};

// ✅ 특정 데이터 삭제 (단건)
export const deleteLotto = (id: number) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM LottoHistory WHERE id = ?', [id]);
  });
};

// ✅ 전체 초기화 (테이블 DROP → 재생성)
export const resetSchema = () => {
  db.transaction(tx => {
    tx.executeSql('DROP TABLE IF EXISTS LottoHistory');
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS LottoHistory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        round INTEGER UNIQUE,
        numbers TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
    );
  });
};

export default db;
