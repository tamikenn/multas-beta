/**
 * MULTAs v2 - シンプルAI処理実装
 * OpenAI GPT API統合版
 */

// === APIキー設定（初回のみ実行）===
function setupOpenAIKey() {
  const apiKey = 'sk-proj-ここに実際のAPIキーを入力';
  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', apiKey);
  console.log('OpenAI APIキー設定完了');
}

// === 医学実習8項目分類プロンプト ===
const CLASSIFICATION_PROMPT = `
医学実習の記録を以下の8項目のいずれかに分類してください：

1. medical_knowledge（医学知識・理論）- 病態、症状、治療法、薬理など
2. technical_skills（技術・手技）- 測定、検査、処置、医療技術など
3. patient_communication（患者コミュニケーション）- 患者・家族との対話
4. team_collaboration（チーム医療）- 他職種との連携、協働
5. ethics_professionalism（倫理・プロフェッショナリズム）- 倫理的配慮、責任
6. clinical_reasoning（臨床推論）- 診断過程、アセスメント
7. self_reflection（自己省察）- 自身の成長、学習の振り返り
8. system_understanding（医療システム理解）- 医療制度、病院の仕組み

応答形式（JSON）:
{
  "category": "カテゴリID",
  "confidence": 信頼度（0-100）,
  "reason": "分類理由"
}
`;

// === doGet: HTMLを返す ===
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('MULTAs v2')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// === クライアントから呼び出される関数 ===
function processAIClassification(records) {
  console.log('AI分類処理開始:', records.length + '件');
  
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('APIキーが設定されていません。setupOpenAIKey()を実行してください。');
    }
    
    // 複数レコードを一括処理
    const classifiedRecords = records.map(record => {
      try {
        const result = classifySingleRecord(record.text, apiKey);
        return {
          ...record,
          category: result.category,
          confidence: result.confidence,
          reason: result.reason,
          aiProcessed: true,
          processedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error('レコード分類エラー:', error);
        // エラー時はデフォルト分類
        return {
          ...record,
          category: 'self_reflection',
          confidence: 50,
          reason: 'AI処理エラー',
          aiProcessed: false
        };
      }
    });
    
    return {
      success: true,
      records: classifiedRecords
    };
    
  } catch (error) {
    console.error('AI処理エラー:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// === 単一レコードの分類 ===
function classifySingleRecord(text, apiKey) {
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const payload = {
    model: 'gpt-4o-mini', // コスト効率の良いモデル
    messages: [
      {
        role: 'system',
        content: CLASSIFICATION_PROMPT
      },
      {
        role: 'user',
        content: `以下の実習記録を分類してください：\n\n"${text}"`
      }
    ],
    temperature: 0.1, // 一貫性のある分類のため低めに設定
    max_tokens: 150,
    response_format: { type: "json_object" } // JSON形式で応答
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  
  if (responseCode !== 200) {
    console.error('OpenAI APIエラー:', response.getContentText());
    throw new Error('API呼び出しエラー');
  }
  
  const data = JSON.parse(response.getContentText());
  const content = data.choices[0].message.content;
  
  // JSONレスポンスをパース
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('JSON解析エラー:', content);
    // フォールバック
    return {
      category: 'self_reflection',
      confidence: 70,
      reason: 'AI応答の解析失敗'
    };
  }
}

// === テスト関数 ===
function testAIClassification() {
  const testRecords = [
    { id: 1, text: "初めて血圧測定を患者さんに実施した。手が震えた。" },
    { id: 2, text: "糖尿病の3大合併症について学んだ。網膜症、腎症、神経障害。" },
    { id: 3, text: "看護師さんと協力して患者さんの移乗を手伝った。" }
  ];
  
  const result = processAIClassification(testRecords);
  console.log('テスト結果:', JSON.stringify(result, null, 2));
  return result;
}

// === データ保存（オプション）===
function saveToSpreadsheet(records) {
  const sheetId = 'YOUR_SPREADSHEET_ID'; // スプレッドシートIDを設定
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  
  records.forEach(record => {
    sheet.appendRow([
      record.id,
      record.text,
      record.category,
      record.confidence,
      record.reason,
      record.timestamp,
      record.processedAt
    ]);
  });
  
  return { success: true };
}