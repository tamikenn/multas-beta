# MULTAs v3 CORS問題解決ガイド

## 問題の本質
Google Apps Script (GAS) は異なるドメインで動作するため、ブラウザのCORS制限により直接的なAPI呼び出しができません。

## 解決策

### 方法1: GAS WebアプリとしてHTMLを提供（推奨）
HTMLファイルとGASコードを同じプロジェクトに配置し、GASからHTMLを提供します。

**修正手順:**

1. **コード.gsの修正**
```javascript
// doGet関数を修正
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('MULTAs v3')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

2. **index.htmlの修正**
```javascript
// gasUrlの行を削除し、google.script.run を使用
// 変更前:
// const response = await fetch(gasUrl, {...});

// 変更後:
google.script.run
  .withSuccessHandler(function(result) {
    console.log('成功:', result);
    // 結果処理
  })
  .withFailureHandler(function(error) {
    console.error('エラー:', error);
  })
  .classifyRecord(content);
```

3. **GAS側に新しい関数追加**
```javascript
// クライアントから直接呼び出せる関数
function classifyRecordForClient(text) {
  return classifyRecord(text);
}
```

### 方法2: iframe経由での通信
現在のHTMLファイルを別サーバーに置き、iframeでGASページを埋め込む方法。

### 方法3: GASをAPIとして使い、プロキシサーバー経由
別途プロキシサーバーを立てて、CORS制限を回避。

## 即座に試せる修正

### 1. APIキーの設定
```javascript
// GASエディタで実行
function setupAPIKey() {
  const apiKey = 'sk-proj-YOUR_ACTUAL_API_KEY'; // 実際のキーに置き換え
  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', apiKey);
  console.log('APIキー設定完了');
}
```

### 2. デプロイ設定の確認
- 実行者: 自分
- アクセス: 全員（匿名ユーザーを含む）
- 新しいデプロイを作成

### 3. テスト用の簡易版
```javascript
// テスト用のシンプルなdoPost
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // CORSを考慮せず、単純なレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        result: {
          category: 'medical_knowledge',
          confidence: 90,
          reason: 'テスト応答',
          timestamp: new Date().toISOString(),
          aiProcessed: false
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 動作確認方法

### 1. curlでのテスト
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"action":"test"}' \
  "YOUR_GAS_URL"
```

### 2. Postmanでのテスト
- Method: POST
- Headers: Content-Type: application/json
- Body: {"action": "classify", "text": "テスト"}

## 推奨される最終構成

1. **すべてをGAS内に統合**
   - index.html → GASプロジェクト内
   - コード.gs → 修正版
   - google.script.run でやり取り

2. **メリット**
   - CORS問題が発生しない
   - セキュアな通信
   - デプロイが簡単

3. **デメリット**
   - GASの制約内での開発
   - UIの制限がある

次のステップをお選びください:
A) GAS統合版への移行
B) 現在の構成での回避策
C) 別のアプローチの検討