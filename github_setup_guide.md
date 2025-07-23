# 🚀 GitHub 10分セットアップガイド - MULTAsプロジェクト

## ステップ1: GitHubでリポジトリ作成（3分）

1. **GitHub.comにログイン**
   - https://github.com にアクセス

2. **新しいリポジトリ作成**
   - 右上の「+」→「New repository」
   - Repository name: `MULTAs-medical-training`
   - Description: `医学実習記録システム - AI分類機能付き`
   - **Private**を選択（プライベートリポジトリ）
   - 「Create repository」をクリック

3. **作成後のページをそのまま開いておく**

## ステップ2: ローカル設定（5分）

ターミナルで以下のコマンドを順番に実行：

```bash
# 1. プロジェクトフォルダに移動
cd /Users/kentarotamiya/claude_code_workspace

# 2. Gitユーザー設定（初回のみ）
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメール@example.com"

# 3. Git初期化
git init

# 4. 不要ファイルを除外する設定
echo "*.log" > .gitignore
echo ".DS_Store" >> .gitignore
echo "node_modules/" >> .gitignore

# 5. 全ファイルを追加
git add .

# 6. 最初のコミット
git commit -m "🎉 MULTAs v2 初期コミット - AI分類機能実装"

# 7. GitHubリポジトリと接続（URLは作成したリポジトリのものを使用）
git remote add origin https://github.com/あなたのユーザー名/MULTAs-medical-training.git

# 8. プッシュ（アップロード）
git push -u origin main
```

## ステップ3: 今後の使い方（2分で覚える）

### 📝 変更を保存する時（毎回これだけ！）

```bash
# 変更を確認
git status

# 全ての変更を追加
git add .

# コミット（保存）
git commit -m "✨ モニター2のカテゴリ表示を実装"

# GitHubにアップロード
git push
```

### 🔄 他のPCやセッションで続きを開発

```bash
# プロジェクトをダウンロード（初回のみ）
git clone https://github.com/あなたのユーザー名/MULTAs-medical-training.git

# 最新版を取得（2回目以降）
git pull
```

## 💡 便利な使い方

### コミットメッセージの絵文字ルール
- 🎉 新機能: `git commit -m "🎉 レポート生成機能を追加"`
- 🐛 バグ修正: `git commit -m "🐛 AI分類のエラーを修正"`
- ✨ 改善: `git commit -m "✨ UIの表示を改善"`
- 📝 ドキュメント: `git commit -m "📝 README更新"`

### よく使うコマンド
```bash
# 変更内容を確認
git status

# 変更履歴を見る
git log --oneline

# 直前のコミットを修正
git commit --amend
```

## 🎯 GitHub活用のメリット

1. **セッション間の継続性**
   - Claude AIの新しいセッションで「GitHubのURLを見て続きから」と言える

2. **完全なバックアップ**
   - コードが消える心配なし

3. **変更履歴**
   - いつ、何を変更したか全て記録

4. **共同開発**
   - 他の人とも簡単に共有可能

---

## 🚨 トラブルシューティング

### 「main」ではなく「master」と言われた場合
```bash
git branch -M main
```

### プッシュでエラーが出た場合
```bash
# 強制プッシュ（初回のみ）
git push -u origin main --force
```

### パスワードを聞かれる場合
GitHubの設定 → Developer settings → Personal access tokens でトークンを作成

---

これで完了です！🎉