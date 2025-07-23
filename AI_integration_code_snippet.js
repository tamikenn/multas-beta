/**
 * HTML側のAI処理実装部分
 * classifyWithAI関数を以下のコードに置き換えてください
 */

async function classifyWithAI(records) {
    console.log('AI分類処理開始:', records.length + '件');
    
    // GAS環境かどうかを判定
    if (typeof google !== 'undefined' && google.script && google.script.run) {
        // GAS環境での実行
        return new Promise((resolve, reject) => {
            updateStats(); // UIを更新
            
            google.script.run
                .withSuccessHandler((result) => {
                    console.log('GAS AI処理成功:', result);
                    if (result.success) {
                        // 分類結果をローカルデータに反映
                        result.records.forEach(classifiedRecord => {
                            const index = allRecords.findIndex(r => r.id === classifiedRecord.id);
                            if (index !== -1) {
                                allRecords[index] = classifiedRecord;
                            }
                        });
                        
                        // v2画面を更新
                        renderAIResults();
                        updateStats();
                        
                        resolve({
                            success: true,
                            processedCount: result.records.length
                        });
                    } else {
                        reject(new Error(result.error));
                    }
                })
                .withFailureHandler((error) => {
                    console.error('GAS AI処理エラー:', error);
                    reject(error);
                })
                .processAIClassification(records);
        });
        
    } else {
        // ローカル環境でのテスト（GAS外での動作確認用）
        console.log('ローカル環境でのシミュレーション');
        
        // シミュレーション処理
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        records.forEach(record => {
            // テスト用の分類
            const categories = [
                'medical_knowledge',
                'technical_skills', 
                'patient_communication',
                'team_collaboration'
            ];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            
            record.category = randomCategory;
            record.confidence = 80 + Math.floor(Math.random() * 20);
            record.reason = 'ローカルテスト分類';
            record.aiProcessed = true;
        });
        
        renderAIResults();
        updateStats();
        
        return {
            success: true,
            processedCount: records.length
        };
    }
}

// === カテゴリ定義を8項目に更新 ===
const AI_CATEGORIES = {
    medical_knowledge: {
        label: '医学知識・理論',
        icon: '📚',
        color: '#e74c3c'
    },
    technical_skills: {
        label: '技術・手技',
        icon: '🔧',
        color: '#3498db'
    },
    patient_communication: {
        label: '患者コミュニケーション',
        icon: '💬',
        color: '#2ecc71'
    },
    team_collaboration: {
        label: 'チーム医療',
        icon: '👥',
        color: '#f39c12'
    },
    ethics_professionalism: {
        label: '倫理・プロフェッショナリズム',
        icon: '⚖️',
        color: '#9b59b6'
    },
    clinical_reasoning: {
        label: '臨床推論',
        icon: '🧠',
        color: '#1abc9c'
    },
    self_reflection: {
        label: '自己省察',
        icon: '🪞',
        color: '#34495e'
    },
    system_understanding: {
        label: '医療システム理解',
        icon: '🏥',
        color: '#95a5a6'
    }
};

// === AI結果の表示を更新 ===
function createAIRecordHTML(record) {
    const category = AI_CATEGORIES[record.category] || AI_CATEGORIES.self_reflection;
    
    return `
        <div class="ai-record-item" style="border-left: 4px solid ${category.color};">
            <div class="ai-category">
                <span class="category-icon">${category.icon}</span>
                <span class="category-label">${category.label}</span>
                <span class="confidence-badge">${record.confidence}%</span>
            </div>
            <div class="record-text">${record.text}</div>
            <div class="record-meta">
                <span class="timestamp">${new Date(record.timestamp).toLocaleString('ja-JP')}</span>
                ${record.reason ? `<span class="ai-reason">📍 ${record.reason}</span>` : ''}
            </div>
        </div>
    `;
}