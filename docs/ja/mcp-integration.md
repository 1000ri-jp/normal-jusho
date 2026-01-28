# MCP（Model Context Protocol）連携ガイド

JushoはMCPサーバーを内蔵しており、Claude、Cursor等のAIアシスタントから直接住所正規化を利用できます。

## MCPとは

Model Context Protocol（MCP）は、AIアシスタントと外部ツール・データソースを接続するための標準プロトコルです。JushoのMCP連携により、AIアシスタントが以下のことを行えます。

- 日本語住所の正規化
- 郵便番号の検索
- 事業所名から住所の取得
- 大型ビルの階別郵便番号の取得

## クライアント設定

### Claude Desktop

Claude DesktopのMCP設定ファイルに以下を追加します。

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jusho": {
      "url": "https://api.jusho.dev/mcp"
    }
  }
}
```

### Cursor

CursorのMCP設定に以下を追加します。

```json
{
  "mcpServers": {
    "jusho": {
      "url": "https://api.jusho.dev/mcp"
    }
  }
}
```

### その他のMCPクライアント

Streamable HTTPトランスポートに対応した任意のMCPクライアントから接続可能です。

```
https://api.jusho.dev/mcp
```

## 利用可能なツール

MCP接続後、以下のツールが利用可能になります。

### `normalize_address`

住所文字列を正規化し、構造化データを返します。

**パラメータ:**

| パラメータ | 型 | 説明 |
|------------|------|------|
| `address` | string | 住所文字列、事業所名、またはビル名 |

**マッチング順序:**

1. 事業所辞書（例: "宮内庁", "日本銀行"）
2. 大型ビル辞書（例: "六本木ヒルズ森タワー30F"）
3. 標準住所（国土交通省 + 日本郵便データ）

**戻り値:**

以下のトップレベルキーを持つ辞書を返します。

- `address` -- 正規化された住所の構成要素（pref, city, town, banchi 等）
- `address_variants` -- ソース別住所表記（kokudo vs kenall）
- `kana` -- カタカナ読み
- `codes` -- 郵便番号、都道府県コード、市区町村コード、町域コード
- `geo` -- 緯度・経度
- `meta` -- マッチタイプ、バージョン情報

住所がマッチしない場合は `None` を返します。

## 使用例

設定完了後、AIアシスタントに以下のように質問できます。

- 「東京都千代田区千代田1-1の郵便番号は？」
- 「この住所を正規化して: 大阪府大阪市北区梅田1-1-1」
- 「宮内庁の住所を調べて」
- 「六本木ヒルズ森タワー30階の郵便番号は？」
- 「渋谷区道玄坂1-2-3を構造化データに変換して」

AIアシスタントが `normalize_address` ツールを呼び出し、構造化された結果を返します。

## MCP状態の確認

MCPが利用可能かどうかをAPIで確認できます。

```bash
curl https://api.jusho.dev/mcp-status
```

```json
{
  "available": true,
  "endpoint": "/mcp",
  "server_name": "jusho",
  "client_config": {
    "mcpServers": {
      "jusho": {
        "url": "https://api.jusho.dev/mcp"
      }
    }
  }
}
```

## セルフホスティング

独自のJushoインスタンスを運用する場合、`mcp` エクストラをインストールすれば `/mcp` エンドポイントが自動的に利用可能になります。

```bash
pip install address-kokudo-kenall[all]
```

MCPサーバーをスタンドアロンで起動（stdioトランスポート）:

```bash
address-mcp-server
```

これはローカル開発や、公開APIを経由せずにローカルのAIクライアントと接続する場合に便利です。

## 技術的詳細

- **トランスポート**: Streamable HTTP（FastAPIアプリ上の `/mcp` にマウント）
- **サーバー名**: `jusho`
- **プロトコル**: MCP (Model Context Protocol)
- **セキュリティ**: DNSリバインディング防止有効。`api.jusho.dev` および `localhost` からのアクセスを許可
- **依存関係**: `mcp` Pythonパッケージが必要（`pip install mcp[cli]>=1.4.1`）

## トラブルシューティング

### MCPが利用不可

`/mcp-status` が `"available": false` を返す場合、MCP関連の依存パッケージがインストールされていない可能性があります。

```bash
pip install address-kokudo-kenall[all]
```

### 接続拒否

MCPクライアントに正しいURL（`https://api.jusho.dev/mcp`）が設定されていること、およびStreamable HTTPトランスポートに対応していることを確認してください。

### 初回リクエストが遅い

初回のMCPツール呼び出しで辞書データの読み込みが発生するため、数秒かかることがあります。REST APIの `POST /warmup` を呼び出して事前にウォームアップできます。
