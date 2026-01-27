import { ScanText, FormInput, Package, FileSpreadsheet } from 'lucide-react';

const useCases = [
  {
    icon: ScanText,
    title: 'OCR 後処理',
    description: '手書き住所をOCRで読み取った後の誤認識・表記ゆれを自動補正。「渋谷区渋谷2の21の1」→「渋谷区渋谷二丁目21-1」',
    examples: ['手書き申込書のデジタル化', '郵便物の宛先読み取り', 'FAX注文書の処理'],
  },
  {
    icon: FormInput,
    title: 'Web フォーム入力支援',
    description: 'ユーザーが入力した住所をリアルタイムで正規化。入力ミスを減らし、データ品質を向上。',
    examples: ['EC サイトの配送先入力', '会員登録フォーム', '予約システム'],
  },
  {
    icon: FileSpreadsheet,
    title: '顧客データクレンジング',
    description: '既存の住所データベースを一括で正規化。重複検出や名寄せの前処理に最適。',
    examples: ['CRM データの整備', 'DM 発送リストの精査', '顧客マスタの統合'],
  },
  {
    icon: Package,
    title: '物流・配送システム',
    description: '配送先住所を正規化し、郵便番号・緯度経度を自動付与。配送ルート最適化の基盤に。',
    examples: ['配送管理システム', '倉庫管理（WMS）', 'ラストワンマイル配送'],
  },
];

export function UseCases() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            利用シーン
          </h2>
          <p className="text-gray-600">
            表記ゆれを徹底的に補正するから、様々なシーンで活躍
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <useCase.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {useCase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.examples.map((example) => (
                      <span
                        key={example}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
