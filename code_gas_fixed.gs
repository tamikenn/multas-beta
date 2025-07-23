/**
 * MULTAs GAS - CORS問題解決版
 * google.script.run対応
 */

// === APIキー設定 ===
function setOpenAIAPIKey() {
  const apiKey = 'sk-proj-YOUR_API_KEY_HERE'; // ←実際のAPIキーに設定
  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', apiKey);
  Logger.log('APIキーが設定されました');
}

// === 医学教育特化プロンプト ===
const MEDICAL_PROMPT = `医学実習記録を8項目に分類してください。

1. medical_knowledge: 医学知識・理論学習
2. technical_skills: 技術・手技・臨床スキル  
3. patient_communication: 患者コミュニケーション
4. team_collaboration: 他職種連携・チーム医療
5. ethics_professionalism: 医療倫理・プロフェッショナリズム
6. patient_information: 患者情報・診療プロセス
7. community_medicine: 地域医療・社会的影響
8. personal_growth: 自身の成長・学習成果

重要：
- 「糖尿病の合併症は『し・め・じ』」→ medical_knowledge
- 「院外薬局とのやり取り見学」→ team_collaboration  
- 「看護師さんからありがとう」→ team_collaboration

出力形式: カテゴリID|信頼度|理由
例: medical_knowledge|95|糖尿病合併症の医学的知識`;

// === doGet: HTMLページを返す ===
function doGet(e) {
  // index_gas_integrated.htmlファイルを返す
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('MULTAs v3')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// === クライアントから呼び出される関数 ===
function processRequest(data) {
  Logger.log('processRequest開始:', data);
  
  try {
    switch (data.action) {
      case 'classify':
        if (!data.text) throw new Error('テキストが指定されていません');
        return {
          success: true,
          result: classifyRecord(data.text)
        };
        
      case 'test':
        return {
          success: true,
          result: {
            message: 'MULTAs API接続成功',
            timestamp: new Date().toISOString(),
            version: 'v3.0-gas-integrated'
          }
        };
        
      default:
        throw new Error('不明なアクション: ' + data.action);
    }
  } catch (error) {
    Logger.log('processRequestエラー:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// === 分類関数 ===
function classifyRecord(recordText) {
  if (!recordText || typeof recordText !== 'string') {
    return createFallbackClassification('');
  }
  
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    if (!apiKey) {
      Logger.log('APIキー未設定 - フォールバック分類使用');
      return createFallbackClassification(recordText);
    }
    
    Logger.log('OpenAI API呼び出し開始...');
    
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: MEDICAL_PROMPT },
          { role: 'user', content: '分類対象: "' + recordText + '"' }
        ],
        temperature: 0.1,
        max_tokens: 150
      })
    });
    
    const responseData = JSON.parse(response.getContentText());
    Logger.log('API応答: ' + response.getResponseCode());
    
    if (response.getResponseCode() === 200) {
      const aiResponse = responseData.choices[0].message.content;
      Logger.log('AI応答内容: ' + aiResponse);
      
      const parts = aiResponse.split('|');
      if (parts.length >= 3) {
        return {
          category: parts[0].trim(),
          confidence: Math.min(100, Math.max(0, parseInt(parts[1]) || 85)),
          reason: parts[2].trim(),
          timestamp: new Date().toISOString(),
          aiProcessed: true
        };
      }
    }
    
    throw new Error('API応答の解析に失敗');
    
  } catch (error) {
    Logger.log('エラー発生: ' + error.toString());
    return createFallbackClassification(recordText);
  }
}

// === フォールバック分類 ===
function createFallbackClassification(text) {
  if (!text) {
    return {
      category: 'personal_growth',
      confidence: 50,
      reason: '入力テキストなし',
      timestamp: new Date().toISOString(),
      aiProcessed: false
    };
  }
  
  // プロジェクトナレッジ特別ルール
  if (text.includes('糖尿病') && text.includes('し・め・じ')) {
    return {
      category: 'medical_knowledge',
      confidence: 95,
      reason: '糖尿病合併症の医学的知識（特別ルール）',
      timestamp: new Date().toISOString(),
      aiProcessed: false
    };
  }
  
  if (text.includes('薬局') && text.includes('やり取り')) {
    return {
      category: 'team_collaboration',
      confidence: 92,
      reason: '他職種連携学習（特別ルール）',
      timestamp: new Date().toISOString(),
      aiProcessed: false
    };
  }
  
  if (text.includes('看護師') && text.includes('ありがとう')) {
    return {
      category: 'team_collaboration',
      confidence: 88,
      reason: '他職種コミュニケーション（特別ルール）',
      timestamp: new Date().toISOString(),
      aiProcessed: false
    };
  }
  
  // 基本キーワード分類
  const keywords = {
    medical_knowledge: ['病気', '疾患', '症状', '治療', '薬', '診断', '病態', '医学'],
    technical_skills: ['手技', '技術', '測定', '検査', '処置', '操作', '初めて'],
    patient_communication: ['患者', '家族', '説明', 'コミュニケーション', '対話'],
    team_collaboration: ['看護師', '薬剤師', '連携', 'チーム', '協力'],
    patient_information: ['カルテ', '記録', '情報', '診療', 'プロセス'],
    community_medicine: ['地域', '社会', '医療制度', 'アクセス'],
    ethics_professionalism: ['倫理', '責任', '守秘', 'プロ'],
    personal_growth: ['成長', '学習', '変化', '実感', '芽生え']
  };
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return {
        category: category,
        confidence: 80,
        reason: 'キーワード分類（' + words.find(word => text.includes(word)) + '）',
        timestamp: new Date().toISOString(),
        aiProcessed: false
      };
    }
  }
  
  return {
    category: 'personal_growth',
    confidence: 75,
    reason: 'デフォルト分類',
    timestamp: new Date().toISOString(),
    aiProcessed: false
  };
}

// === テスト関数 ===
function testFullSystem() {
  Logger.log('=== システム全体テスト開始 ===');
  
  // APIキーの確認
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  Logger.log('APIキー設定: ' + (apiKey ? '設定済み' : '未設定'));
  
  const testCases = [
    '糖尿病の合併症は『し・め・じ』で覚えると良いと学んだ',
    '院外薬局とのやり取りを見学して連携の重要性を実感した',
    '看護師さんから手伝いに対して『ありがとう』と言われた',
    '初めて血圧測定を実際にやらせてもらった'
  ];
  
  testCases.forEach((testCase, index) => {
    Logger.log('\n--- テスト ' + (index + 1) + ' ---');
    Logger.log('入力: ' + testCase);
    
    const result = classifyRecord(testCase);
    Logger.log('分類: ' + result.category);
    Logger.log('信頼度: ' + result.confidence + '%');
    Logger.log('理由: ' + result.reason);
    Logger.log('AI処理: ' + (result.aiProcessed ? 'GPT-4o' : 'フォールバック'));
  });
  
  Logger.log('\n=== システム全体テスト完了 ===');
  return 'テスト完了 - ログを確認してください';
}

// === 直接呼び出し用のテスト関数 ===
function testDirectCall() {
  const result = processRequest({
    action: 'classify',
    text: '糖尿病の合併症は『し・め・じ』で覚えると良いと学んだ'
  });
  
  Logger.log('直接呼び出しテスト結果:', result);
  return result;
}