# 🏥 MULTAs - 医学実習記録システム

AI分類機能を搭載した医学生のための実習記録・レポート生成システム

## 🎯 プロジェクト概要

MULTAs（Medical University Learning and Training Assistant System）は、医学生の臨床実習体験を効率的に記録・分類・レポート化するWebアプリケーションです。

### 主な機能

- 📝 **簡単記録**: 実習体験をその場で素早く記録
- 🤖 **AI自動分類**: 8つの医学教育カテゴリに自動分類
- 📊 **体験整理**: カテゴリ別に学習内容を可視化
- 📄 **レポート生成**: 日次・週次レポートを自動生成

## 🚀 現在の開発状況

- ✅ **v1完成**: 基本的な記録・表示機能
- 🔄 **v2開発中**: AI分類機能の統合
- 📋 **Phase 1**: モニター1,2実装済み、モニター3開発中

## 📁 プロジェクト構成

```
MULTAs-medical-training/
├── MULTAs_v2_implementation_phase1.html   # メインアプリケーション
├── MULTAs_v2_architecture_design.md       # システム設計書
├── MULTAs_simple_AI_implementation.gs     # Google Apps Script (AI処理)
├── AI_integration_code_snippet.js         # AI統合用コード
└── README.md                              # このファイル
```

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **バックエンド**: Google Apps Script
- **AI**: OpenAI GPT-4o-mini API
- **データストレージ**: LocalStorage → Google Sheets（予定）

## 🏃‍♂️ クイックスタート

### ローカルで確認
```bash
# リポジトリをクローン
git clone https://github.com/[your-username]/MULTAs-medical-training.git

# ファイルを開く
open MULTAs_v2_implementation_phase1.html
```

### Google Apps Scriptでデプロイ
1. Google Apps Scriptプロジェクトを作成
2. `MULTAs_simple_AI_implementation.gs`の内容をコピー
3. OpenAI APIキーを設定
4. Webアプリとしてデプロイ

## 📊 8つの医学実習カテゴリ

1. 📚 **医学知識・理論** - 病態、症状、治療法など
2. 🔧 **技術・手技** - 測定、検査、医療技術など
3. 💬 **患者コミュニケーション** - 患者・家族との対話
4. 👥 **チーム医療** - 他職種との連携
5. ⚖️ **倫理・プロフェッショナリズム** - 医療倫理
6. 🧠 **臨床推論** - 診断プロセス
7. 🪞 **自己省察** - 学習の振り返り
8. 🏥 **医療システム理解** - 制度・仕組み

## 🔄 開発ロードマップ

- [x] v1: 基本記録機能
- [x] v2 Phase 1: AI分類とモニター切り替え
- [ ] v2 Phase 2: 日次レポート生成
- [ ] v2 Phase 3: 5日間総合レポート
- [ ] v3: マルチユーザー対応

## 🤝 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m '✨ Add AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスのもとで公開されています。

## 👨‍💻 開発者

- 開発サポート: Claude (Anthropic)
- プロジェクトオーナー: [Your Name]

---

**最終更新**: 2025年7月23日