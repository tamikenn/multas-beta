# MULTAs プロジェクトコンテキスト

## 🎯 プロジェクト概要
医学実習記録システム「MULTAs」の開発
- 目的: 医学生の実習体験を記録・分類・レポート化
- 現在: v2 Phase 1実装中

## 📊 現在の状態
- ✅ v1: 基本的な記録・表示機能（完成）
- 🔄 v2: AI分類機能の統合（実装中）
- 📋 3つのモニター設計（1,2実装済み、3未実装）

## 🤖 AI活用ポイント
1. **入力直後のタグ付け**（実装中）
2. **日次レポート生成**（未実装）
3. **5日間総合レポート**（未実装）

## 📁 重要ファイル
```
/Users/kentarotamiya/claude_code_workspace/
├── MULTAs_v2_implementation_phase1.html  # 最新の実装
├── MULTAs_v2_architecture_design.md      # 設計書
├── MULTAs_simple_AI_implementation.gs    # GAS用AIコード
└── AI_integration_code_snippet.js        # AI統合コード
```

## 🔑 技術スタック
- フロントエンド: Pure HTML/CSS/JavaScript
- バックエンド: Google Apps Script
- AI: OpenAI GPT-4o-mini API
- データ: ローカルストレージ → Google Sheets（予定）

## 🚧 現在の課題
1. CORS問題 → GAS統合で解決
2. AI処理の実装 → OpenAI API統合待ち
3. レポート生成機能 → Phase 3で実装予定

## 💡 次のステップ
1. OpenAI APIキーの設定
2. GASへのデプロイ
3. モニター3（レポート機能）の実装

## 📝 セッション引き継ぎ用コマンド
```
新しいセッションで以下を伝えてください：
「MULTAsプロジェクトの続きです。/Users/kentarotamiya/claude_code_workspace/MULTAs_PROJECT_CONTEXT.mdを確認して、現在の状態から続けてください。」
```

---
最終更新: 2025-07-23