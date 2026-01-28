import { Code, Terminal, Copy, Check, Package } from 'lucide-react';
import { useState } from 'react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
      title="コピー"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export function Usage() {
  const apiUrl = 'https://api.jusho.dev';

  const curlPost = `curl -X POST ${apiUrl}/normalize/batch \\
  -H "Content-Type: application/json" \\
  -d '{"addresses": ["東京都渋谷区渋谷２ー２１ー１", "大阪府大阪市北区梅田1-1-1"]}'`;

  const curlGet = `curl -G "${apiUrl}/normalize" \\
  --data-urlencode "address=東京都渋谷区渋谷２ー２１ー１"`;

  const responseExample = `{
  "full_address": "東京都渋谷区渋谷二丁目21-1",
  "post_code": "1500002",
  "pref": "東京都",
  "city": "渋谷区",
  "town": "渋谷二丁目",
  "banchi": "21",
  "go": "1",
  "lat": "35.659609",
  "lng": "139.705829",
  ...
}`;

  const mcpConfig = `{
  "mcpServers": {
    "jusho": {
      "url": "https://api.jusho.dev/mcp"
    }
  }
}`;

  const mcpExample = `// Claude Desktop での使用例
「東京都渋谷区渋谷２ー２１ー１を正規化して」

// レスポンス
住所を正規化しました:
- 正規化結果: 東京都渋谷区渋谷二丁目21-1
- 郵便番号: 〒150-0002
- 緯度経度: 35.659609, 139.705829`;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            利用方法
          </h2>
          <p className="text-gray-600">
            SDK、REST API、MCP で簡単に統合
          </p>
        </div>

        <div className="space-y-8">
          {/* SDK */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">SDK</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Python と TypeScript の公式 SDK を提供しています。パッケージマネージャでインストールするだけですぐに利用可能です。
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Python */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Python</p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`pip install jusho`}</code>
                  </pre>
                  <CopyButton text="pip install jusho" />
                </div>
                <div className="relative mt-3">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import jusho

result = jusho.normalize("東京都渋谷区渋谷２ー２１ー１")
print(result.full_address)
# => 東京都渋谷区渋谷二丁目21-1`}</code>
                  </pre>
                  <CopyButton text={`import jusho\n\nresult = jusho.normalize("東京都渋谷区渋谷２ー２１ー１")\nprint(result.full_address)`} />
                </div>
              </div>

              {/* TypeScript */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">TypeScript</p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`npm install jusho`}</code>
                  </pre>
                  <CopyButton text="npm install jusho" />
                </div>
                <div className="relative mt-3">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { normalize } from "jusho";

const result = await normalize("東京都渋谷区渋谷２ー２１ー１");
console.log(result.fullAddress);
// => 東京都渋谷区渋谷二丁目21-1`}</code>
                  </pre>
                  <CopyButton text={`import { normalize } from "jusho";\n\nconst result = await normalize("東京都渋谷区渋谷２ー２１ー１");\nconsole.log(result.fullAddress);`} />
                </div>
              </div>
            </div>
          </div>

          {/* REST API */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">REST API</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>ベースURL:</strong>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">{apiUrl}</code>
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">POST /normalize/batch（複数件一括処理・最大100件）</p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{curlPost}</code>
                  </pre>
                  <CopyButton text={curlPost} />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">GET /normalize</p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{curlGet}</code>
                  </pre>
                  <CopyButton text={curlGet} />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">レスポンス例</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{responseExample}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* MCP */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">MCP (Model Context Protocol)</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Claude Desktop、Cursor、その他の MCP 対応クライアントで利用可能です。リモートサーバー方式（Streamable HTTP）のため、インストール不要で即座に利用できます。
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Claude Desktop 設定 (<code className="bg-gray-100 px-1 rounded">claude_desktop_config.json</code>)
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{mcpConfig}</code>
                  </pre>
                  <CopyButton text={mcpConfig} />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">使用例</p>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{mcpExample}</code>
                </pre>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p><strong>利用可能なツール:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code className="bg-gray-100 px-1 rounded">normalize_address</code> - 住所を正規化して詳細情報を取得</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
