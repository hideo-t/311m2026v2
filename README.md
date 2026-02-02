# 3.11 メモリークエスト：COLOR & VOICE（#9）

**色と声で、あの日をつなぐ**

## 🎮 概要

「第5回 福島の子供たちのために 3.11〜あの日を忘れない〜」イベントの体験型告知ゲーム。  
ポスターの4色ブロックをモチーフに、「覚える」ではなく「感じる」体験として設計されています。

## ✨ 特徴

- **Pure JavaScript**（外部フレームワーク不使用）
- **モバイル最適化**（iPhone Safari完全対応）
- **体験時間**: 3〜5分
- **レトロゲーム風UI**
- **WebAudio API**による効果音

## 🎯 ゲームフロー

### Scene 0: タイトル
- ゲームスタート

### Scene 1: カラー選択
- 4色ブロック（黄/緑/青/紫）から気持ちに近い色を選択
- 中央に白い雲がふわふわ浮かぶ

### Scene 2: 波形マッチ
- 音ゲー風の簡単なリズムゲーム
- 共鳴ゾーンでアイコンをタップ
- 5回成功でクリア

### Scene 3: 出演者発見
- 21名の出演者からランダムに5名表示
- カードをタップで一言コメント表示

### Scene 4: 共鳴マップ
- 粒子が #9 に集まるアニメーション
- イベント詳細情報を表示

### Scene 5: 結果画面
- あなたの COLOR と TYPE
- 合言葉コード生成
- シェア機能

## 📊 スコアシステム

3つのゲージ:
- **MEMORY**: 色選択・出演者発見・情報確認で上昇
- **HOPE**: 波形マッチ成功で上昇
- **LINK**: シェアで上昇

## 🎨 カラーシステム

| 色 | TYPE | 意味 |
|----|------|------|
| YELLOW | HOPE RUNNER | 希望を走らせる |
| GREEN | HARMONY MAKER | 調和を創る |
| CYAN | MEMORY CARRIER | 記憶を運ぶ |
| PURPLE | VOICE KEEPER | 声を守る |

## 📅 イベント情報

- **日時**: 2026年3月8日（日） 開場11:40 / 開演12:00
- **会場**: EVENT SPACE Koriyama #9
- **住所**: 郡山市大町1-4-15（第2増子ビル地下）
- **電話**: 024-973-5242
- **入場**: 無料（全席自由）
- **ドリンク**: 大人400円
- **特典**: 来場プレゼント先着150名（高校生以下）

## 🎤 出演者（21名）

テルG / 高橋迷人 / 加藤漢太 / 岡田純子 / 橋本妙子 / 清水兼一 / 伊藤和哉 / マヒロスターズフラチーム / 大槻いくを / 原田雪見 / KUSANO / アベマンセイ / 相良裕成 / "~ing / Lumiere / mone / 大督 / 芦原会館 / 福島スポーツアカデミー（FSAダンススクール） / STUDIO DANCE HEAD / 空先拓海

## 📱 動作環境

- Chrome 90+
- Safari 14+ (iOS 14+)
- Firefox 88+
- Edge 90+

## 🚀 GitHub Pagesで公開

```bash
# 1. GitHubリポジトリを作成してファイルをpush
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/311-memory-quest.git
git push -u origin main

# 2. Settings → Pages → Branch: main → Save
```

公開URL: `https://あなたのユーザー名.github.io/311-memory-quest/`

## 📂 ファイル構成

```
311-memory-quest/
├── index.html    # メインHTML
├── style.css     # スタイルシート
├── main.js       # ゲームロジック
└── README.md     # このファイル
```

## 🔧 技術スタック

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+
- Canvas API
- WebAudio API
- Web Share API
- Clipboard API

## 📝 開発ポイント

### requestAnimationFrame
波形マッチ、パーティクル、マップアニメーションで使用

### state管理
グローバル `state` オブジェクトで一元管理

### iOS対策
WebAudio APIは最初のユーザー操作後に初期化

### モバイル最適化
- タッチイベント最適化
- 横スクロール禁止
- viewport設定

## 🎨 デザインコンセプト

- レトロゲーム風（太字、角丸、グロー効果）
- 4色ブロック → ポスターモチーフ
- 白い雲 → 記憶の核
- 粒子・波形 → 共鳴・つながり

## 📄 ライセンス

このプロジェクトは「第5回 福島の子供たちのために 3.11〜あの日を忘れない〜」イベントの告知用ゲームとして作成されました。

---

**色と声で、あの日をつなぐ。**

© 2026 3.11 Memory Quest: COLOR & VOICE Project
