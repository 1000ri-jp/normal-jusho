import {
  Database,
  Building2,
  Hash,
  MapPin,
  Layers,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'ハイブリッドデータ',
    description: '国土交通省と郵便局のデータを組み合わせ、高精度な住所解析を実現',
  },
  {
    icon: Building2,
    title: '事業所マッチング',
    description: '企業名・官公庁名から住所を特定し、正規化',
  },
  {
    icon: Layers,
    title: '大規模建物認識',
    description: 'タワーマンション・商業施設など、大規模建物を認識',
  },
  {
    icon: Hash,
    title: '数字自動変換',
    description: '漢数字・全角数字・「の」区切りを自動でアラビア数字に変換',
  },
  {
    icon: MapPin,
    title: '住居表示・地番両対応',
    description: '住居表示と地番の両方に対応し、適切に正規化',
  },
  {
    icon: Zap,
    title: '超高速レスポンス',
    description: '最適化されたインデックスとキャッシュで、平均5ms以下の高速処理',
  },
  {
    icon: Shield,
    title: '信頼度スコア',
    description: '正規化結果の確からしさを0〜1のスコアとマッチレベルで返却',
  },
  {
    icon: Globe,
    title: 'ローマ字対応',
    description: '都道府県・市区町村・町域のローマ字表記を自動生成',
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            特徴
          </h2>
          <p className="text-gray-600">
            日本の住所特有の複雑さに対応した正規化エンジン
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Performance Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              <Zap className="inline-block w-6 h-6 mr-2 -mt-1" />
              パフォーマンス
            </h3>
            <p className="text-blue-100">
              最適化されたインデックスとキャッシュにより、従来比最大60倍の高速化を実現
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">60<span className="text-xl">x</span></div>
              <div className="text-sm text-blue-100 mb-1">市区町村のみ</div>
              <div className="text-xs text-blue-200">211ms → 3.5ms</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">50<span className="text-xl">x</span></div>
              <div className="text-sm text-blue-100 mb-1">京都住所（通り名）</div>
              <div className="text-xs text-blue-200">221ms → 4.4ms</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">28<span className="text-xl">x</span></div>
              <div className="text-sm text-blue-100 mb-1">町名のみ</div>
              <div className="text-xs text-blue-200">259ms → 9.3ms</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
