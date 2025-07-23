# MULTAs v3 実装ガイド - CORS問題解決版

## 🎯 実装手順

### ステップ1: Google Apps Scriptプロジェクトの準備

1. **Google Apps Scriptにアクセス**
   - https://script.google.com にアクセス
   - 新しいプロジェクトを作成

2. **ファイル構成**
   ```
   プロジェクト/
   ├── コード.gs     (メインのサーバーコード)
   └── index.html    (UIファイル)
   ```

### ステップ2: コードの配置

1. **コード.gsの配置**
   - `code_gas_fixed.gs`の内容をコピー
   - GASエディタの`コード.gs`に貼り付け

2. **index.htmlの作成**
   - ファイル → 新規作成 → HTML
   - ファイル名を`index`に設定（.htmlは不要）
   - `index_gas_integrated.html`の内容をコピーして貼り付け

### ステップ3: APIキーの設定

```javascript
// GASエディタで実行
function setupAPIKey() {
  // 実際のOpenAI APIキーに置き換え
  const apiKey = 'sk-proj-ここに実際のAPIキーを入力';
  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', apiKey);
  console.log('APIキー設定完了');
}
```

1. 関数選択ドロップダウンから`setupAPIKey`を選択
2. 実行ボタンをクリック
3. 初回実行時は権限を承認

### ステップ4: デプロイ

1. **デプロイボタンをクリック**
   - 右上の「デプロイ」→「新しいデプロイ」

2. **デプロイ設定**
   ```
   種類の選択: ウェブアプリ
   説明: MULTAs v3
   実行者: 自分
   アクセス: 全員（匿名ユーザーを含む）
   ```

3. **デプロイ実行**
   - 「デプロイ」ボタンをクリック
   - 表示されたウェブアプリURLを保存

### ステップ5: 動作確認

1. **ウェブアプリURLにアクセス**
   - デプロイで取得したURLをブラウザで開く

2. **テスト入力**
   ```
   糖尿病の合併症は『し・め・じ』で覚えると良いと学んだ
   ```

3. **期待される結果**
   - 分類: medical_knowledge
   - 信頼度: 95%（フォールバック使用時）

## 🐛 トラブルシューティング

### エラー1: 「スクリプトが完了しましたが、何も返されませんでした」
**原因**: doGet関数が正しくHTMLを返していない
**解決**: 
```javascript
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('MULTAs v3');
}
```

### エラー2: 「google is not defined」
**原因**: 外部HTMLからGASを呼び出そうとしている
**解決**: HTMLファイルをGASプロジェクト内に配置

### エラー3: APIキーエラー
**原因**: APIキーが設定されていない
**解決**: `setupAPIKey()`関数を実行

## 📊 テスト手順

### 1. 単体テスト（GASエディタ内）
```javascript
// 実行する関数を選択
testFullSystem()
// または
testDirectCall()
```

### 2. 統合テスト（ブラウザ）
1. ウェブアプリにアクセス
2. テキストを入力して送信
3. 開発者ツールでコンソールログを確認

## 🚀 本番運用のポイント

### データ永続化
現在の実装はメモリ内のみ。永続化が必要な場合：

```javascript
// スプレッドシートへの保存例
function saveToSpreadsheet(record) {
  const sheet = SpreadsheetApp.openById('SPREADSHEET_ID').getActiveSheet();
  sheet.appendRow([
    record.timestamp,
    record.category,
    record.content,
    record.confidence
  ]);
}
```

### セキュリティ強化
```javascript
// 入力検証の追加
function validateInput(text) {
  if (!text || text.length > 1000) {
    throw new Error('無効な入力');
  }
  // XSS対策
  return text.replace(/[<>]/g, '');
}
```

### パフォーマンス最適化
- APIキャッシュの実装
- バッチ処理の検討
- 非同期処理の活用

## 📝 まとめ

この実装により、CORS問題を完全に回避し、安定したシステムが構築できます。
主な利点：
- ✅ CORS問題なし
- ✅ セキュアな通信
- ✅ 簡単なデプロイ
- ✅ Google認証の活用可能

質問や問題があれば、お気軽にお聞きください！