# pg-mali

復古**方形燈圈小瑪莉**瀏覽器小品：押注 → 跑燈 → 結算。純娛樂、無真實金錢／兌現。

經典感來自**自製電子音效**（Web Audio 即時合成），未使用商業機台取樣、ROM 或任天堂等受保護素材。

也可當作 [Playgrounds（遊樂場）](https://samkuo.me/playgrounds/) 的 **SAM**（`index.html` 入口）。

## 一鍵開 SAM 小

**[一鍵開 SAM 小](https://samkuo.me/playgrounds/?open=sampot%2Fpg-mali&name=%E5%B0%8F%E7%91%AA%E8%8E%89)**

```
https://samkuo.me/playgrounds/?open=sampot/pg-mali&name=小瑪莉
```

同源會重用本機已匯入的沙盒；要強制新建可加 `&fresh=1`。

## 試玩（本機）

```bash
npx --yes serve .
# 或
python3 -m http.server 8080
```

瀏覽器需允許音訊（點一下頁面後音效才會出聲）。

## 操作

| 操作 | 說明 |
| --- | --- |
| **+50 幣** | 增加娛樂幣 |
| 點下方圖案 | 每點押 1 幣 |
| **開始** | 跑燈（聲畫同步）後結算 |
| **撤銷押注** | 退回本局未開跑的押注 |
| **音效開／關** | 靜音切換 |

方形燈圈 24 格（沿邊跑燈）、八種圖案與賠率為本專案原創配置，僅向「小瑪莉機台」類型致敬，不還原任何特定機台。

## 檔案

| 檔案 | 說明 |
| --- | --- |
| `index.html` | 結構 |
| `styles.css` | 機台感版面 |
| `app.js` | UI 與跑燈動畫 |
| `game.js` | 押注／賠率／路徑 |
| `audio.js` | Web Audio 合成音效 |
| `functions.js` | Playgrounds 可選 stub |

## License

MIT
