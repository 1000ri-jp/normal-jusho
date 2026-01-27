import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-white" title="コピー">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

export function ApiDocs() {
  const baseUrl = 'https://api.jusho.dev';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>トップに戻る</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">API ドキュメント</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">概要</h2>
            <p className="text-gray-600 mb-4">
              Jusho API は日本の住所を正規化するための REST API です。
              表記ゆれ（全角/半角、漢数字、「の」区切り等）を自動的に修正し、
              構造化された住所データを返します。
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>ベース URL:</strong>{' '}
                <code className="bg-blue-100 px-2 py-0.5 rounded">{baseUrl}</code>
              </p>
            </div>
          </section>

          {/* Authentication */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">認証</h2>
            <p className="text-gray-600">
              現在、API は認証なしで利用可能です。将来的にレート制限や API キー認証を導入する予定です。
            </p>
          </section>

          {/* Endpoints */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">エンドポイント</h2>

            {/* POST /normalize/batch */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-mono font-bold rounded">POST</span>
                <code className="text-lg font-mono">/normalize/batch</code>
              </div>
              <p className="text-gray-600 mb-4">複数の住所を一括で正規化します（最大100件）。</p>

              <h4 className="font-semibold text-gray-900 mb-2">リクエストボディ</h4>
              <div className="mb-4">
                <CodeBlock
                  code={`{
  "addresses": [
    "東京都渋谷区渋谷２ー２１ー１",
    "大阪府大阪市北区梅田1-1-1"
  ]
}`}
                                  />
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">パラメータ</h4>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4">名前</th>
                    <th className="text-left py-2 pr-4">型</th>
                    <th className="text-left py-2 pr-4">必須</th>
                    <th className="text-left py-2">説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-blue-600">addresses</td>
                    <td className="py-2 pr-4">string[]</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">正規化する住所文字列の配列（最大100件）</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-semibold text-gray-900 mb-2">curl 例</h4>
              <CodeBlock
                code={`curl -X POST ${baseUrl}/normalize/batch \\
  -H "Content-Type: application/json" \\
  -d '{"addresses": ["東京都渋谷区渋谷２ー２１ー１", "大阪府大阪市北区梅田1-1-1"]}'`}
              />
            </div>

            {/* GET /normalize */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-mono font-bold rounded">GET</span>
                <code className="text-lg font-mono">/normalize</code>
              </div>
              <p className="text-gray-600 mb-4">クエリパラメータで住所を指定して正規化します。</p>

              <h4 className="font-semibold text-gray-900 mb-2">クエリパラメータ</h4>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4">名前</th>
                    <th className="text-left py-2 pr-4">型</th>
                    <th className="text-left py-2 pr-4">必須</th>
                    <th className="text-left py-2">説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-blue-600">address</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">正規化する住所文字列（URLエンコード必須）</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-semibold text-gray-900 mb-2">curl 例</h4>
              <CodeBlock
                code={`curl -G "${baseUrl}/normalize" \\
  --data-urlencode "address=東京都渋谷区渋谷２ー２１ー１"`}
              />
            </div>
          </section>

          {/* Response */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">レスポンス</h2>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">GET /normalize 成功時 (200 OK)</h3>
            <CodeBlock
              code={`{
  "full_address": "東京都渋谷区渋谷二丁目21-1",
  "post_code": "1500002",
  "pref": "東京都",
  "city": "渋谷区",
  "town": "渋谷二丁目",
  "banchi": "21",
  "go": "1",
  "building_name": "",
  "koaza": "",
  "pref_kana": "トウキョウト",
  "city_kana": "シブヤク",
  "town_kana": "シブヤ（ツギノビルヲノゾク）",
  "lat": "35.659609",
  "lng": "139.705829",
  "pref_code": "13",
  "city_code": "13113",
  "town_code": "131130014002",
  "citycode": "13113",
  "match_type": "address",
  "is_jigyosyo": false,
  "is_tatemono": false,
  "version": "0.3.6",
  "kokudo_version": "2026.01.25",
  "kenall_version": "2026.01.25"
}`}
                          />

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">POST /normalize/batch 成功時 (200 OK)</h3>
            <CodeBlock
              code={`{
  "total": 2,
  "success_count": 2,
  "error_count": 0,
  "results": [
    {
      "input": "東京都渋谷区渋谷２ー２１ー１",
      "success": true,
      "result": { "full_address": "東京都渋谷区渋谷二丁目21-1", ... },
      "error": null
    },
    ...
  ]
}`}
                          />

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">レスポンスフィールド</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-2 px-3">フィールド</th>
                    <th className="text-left py-2 px-3">型</th>
                    <th className="text-left py-2 px-3">説明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 px-3 font-mono text-blue-600">full_address</td><td className="py-2 px-3">string</td><td className="py-2 px-3">正規化された完全な住所</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">post_code</td><td className="py-2 px-3">string</td><td className="py-2 px-3">郵便番号（ハイフンなし）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">pref</td><td className="py-2 px-3">string</td><td className="py-2 px-3">都道府県</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">city</td><td className="py-2 px-3">string</td><td className="py-2 px-3">市区町村</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">town</td><td className="py-2 px-3">string</td><td className="py-2 px-3">町域（丁目含む）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">banchi</td><td className="py-2 px-3">string</td><td className="py-2 px-3">番地</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">go</td><td className="py-2 px-3">string</td><td className="py-2 px-3">号</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">building_name</td><td className="py-2 px-3">string</td><td className="py-2 px-3">建物名</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">koaza</td><td className="py-2 px-3">string</td><td className="py-2 px-3">小字</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">pref_kana</td><td className="py-2 px-3">string</td><td className="py-2 px-3">都道府県（カナ）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">city_kana</td><td className="py-2 px-3">string</td><td className="py-2 px-3">市区町村（カナ）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">town_kana</td><td className="py-2 px-3">string</td><td className="py-2 px-3">町域（カナ）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">lat</td><td className="py-2 px-3">string</td><td className="py-2 px-3">緯度</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">lng</td><td className="py-2 px-3">string</td><td className="py-2 px-3">経度</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">pref_code</td><td className="py-2 px-3">string</td><td className="py-2 px-3">都道府県コード（JIS X 0401）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">city_code</td><td className="py-2 px-3">string</td><td className="py-2 px-3">市区町村コード（JIS X 0402）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">town_code</td><td className="py-2 px-3">string</td><td className="py-2 px-3">町域コード</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">match_type</td><td className="py-2 px-3">string</td><td className="py-2 px-3">マッチタイプ（address, jigyosyo, building 等）</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">is_jigyosyo</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">事業所住所かどうか</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">is_tatemono</td><td className="py-2 px-3">boolean</td><td className="py-2 px-3">大規模建物かどうか</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-blue-600">version</td><td className="py-2 px-3">string</td><td className="py-2 px-3">API バージョン</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">事業所の場合</h3>
            <p className="text-gray-600 mb-3">
              <code className="bg-gray-100 px-1 rounded">is_jigyosyo: true</code> の場合、追加で <code className="bg-gray-100 px-1 rounded">jigyosyo_info</code> が含まれます。
            </p>
            <CodeBlock
              code={`{
  "is_jigyosyo": true,
  "jigyosyo_info": {
    "jigyosyo_name": "経済産業省",
    "jigyosyo_name_kana": "ｹｲｻﾞｲｻﾝｷﾞﾖｳｼﾖｳ",
    "handling_office": "銀座",
    "address_detail": "１丁目３－１"
  }
}`}
                          />

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">大規模建物の場合</h3>
            <p className="text-gray-600 mb-3">
              <code className="bg-gray-100 px-1 rounded">is_tatemono: true</code> の場合、追加で <code className="bg-gray-100 px-1 rounded">building_info</code> が含まれます。
            </p>
            <CodeBlock
              code={`{
  "is_tatemono": true,
  "building_info": {
    "building": "六本木六本木ヒルズ森タワー",
    "building_short": "六本木ヒルズ森タワー",
    "floor": "45",
    "floor_kanji": "四十五階",
    "room": "4501"
  }
}`}
                          />
          </section>

          {/* Error Handling */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">エラーハンドリング</h2>
            <p className="text-gray-600 mb-4">
              エラー発生時は適切な HTTP ステータスコードと JSON レスポンスを返します。
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">400 Bad Request</h3>
            <CodeBlock
              code={`{
  "detail": "address is required"
}`}
                          />

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-3">422 Unprocessable Entity</h3>
            <CodeBlock
              code={`{
  "detail": "住所を解析できませんでした"
}`}
                          />
          </section>

          {/* Rate Limiting */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">レート制限</h2>
            <p className="text-gray-600">
              現在、明示的なレート制限は設けていませんが、過度なリクエストは制限される場合があります。
              大量のリクエストが必要な場合はお問い合わせください。
            </p>
          </section>

          {/* Examples */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">使用例</h2>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">JavaScript (fetch)</h3>
            <CodeBlock
              code={`const response = await fetch('${baseUrl}/normalize/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ addresses: ['東京都渋谷区渋谷２ー２１ー１'] })
});
const data = await response.json();
console.log(data.results[0].result.full_address); // 東京都渋谷区渋谷二丁目21-1`}
                          />

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Python (requests)</h3>
            <CodeBlock
              code={`import requests

response = requests.post(
    '${baseUrl}/normalize/batch',
    json={'addresses': ['東京都渋谷区渋谷２ー２１ー１']}
)
data = response.json()
print(data['results'][0]['result']['full_address'])  # 東京都渋谷区渋谷二丁目21-1`}
                          />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Jusho API</p>
        </div>
      </footer>
    </div>
  );
}
