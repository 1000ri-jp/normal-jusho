import {
  Database,
  Building2,
  Hash,
  MapPin,
  Layers,
  Zap
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
    title: '高速レスポンス',
    description: '最適化されたアルゴリズムで、ミリ秒単位の高速処理',
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}
