interface SampleButtonsProps {
  onSelect: (address: string) => void;
  disabled?: boolean;
}

const sampleGroups = [
  {
    label: 'タワーマンション',
    addresses: [
      '東京都港区六本木6-10-1六本木ヒルズ森タワー',
      '東京都中央区晴海2-108タワーズ台場',
      '東京都港区芝浦4-16-1東京ベイシティタワー',
      '大阪市北区大淀中1-1-88梅田スカイビル',
      '東京都新宿区西新宿2-8-1都庁第一本庁舎',
      '東京都墨田区押上1-1-2東京スカイツリー',
      '横浜市西区みなとみらい2-2-1横浜ランドマークタワー',
      '東京都港区台場2-4-8フジテレビ本社ビル',
      '名古屋市中村区名駅1-1-4JRセントラルタワーズ',
      '東京都豊島区東池袋3-1-1サンシャイン60',
    ],
  },
  {
    label: '事業所',
    addresses: [
      '千代田区霞が関1-3-1　経済産業省',
      '千代田区霞が関2-1-2　外務省',
      '千代田区永田町1-7-1　国会議事堂',
      '千代田区大手町1-3-1　JAビル',
      '港区虎ノ門1-23-1　虎ノ門ヒルズ',
      '渋谷区神宮前1-5-1　表参道ヒルズ',
      '中央区銀座4-6-16　銀座三越',
      '新宿区新宿3-38-1　ルミネエスト',
      '品川区東品川4-12-4　品川シーサイドフォレスト',
      '港区赤坂5-3-1　赤坂Bizタワー',
    ],
  },
  {
    label: '全角数字',
    addresses: [
      '東京都渋谷区渋谷２ー２１ー１',
      '大阪府大阪市北区梅田３ー１ー１',
      '神奈川県横浜市中区山下町１２３ー４',
      '愛知県名古屋市中区栄３ー１５ー３３',
      '福岡県福岡市中央区天神１ー８ー１',
      '北海道札幌市中央区北５条西４ー７',
      '京都府京都市下京区四条通烏丸東入長刀鉾町２０',
      '兵庫県神戸市中央区三宮町１ー９ー１',
      '広島県広島市中区基町６ー７８',
      '宮城県仙台市青葉区一番町３ー１１ー１５',
    ],
  },
  {
    label: '漢数字混在',
    addresses: [
      '新宿区西新宿二丁目８番１号',
      '港区六本木一丁目九番十号',
      '千代田区丸の内一丁目二番三号',
      '渋谷区道玄坂二丁目二十四番十二号',
      '中央区日本橋三丁目五番一号',
      '文京区本郷七丁目三番一号',
      '台東区上野公園七番二十号',
      '品川区大井一丁目四十九番十五号',
      '豊島区南池袋一丁目二十八番一号',
      '目黒区自由が丘二丁目十一番七号',
    ],
  },
  {
    label: '「の」区切り',
    addresses: [
      '大阪市北区梅田１の１の３',
      '神戸市中央区三宮町１の９の１',
      '京都市中京区河原町通三条下ル２の１の５',
      '名古屋市中区栄３の５の１',
      '横浜市中区山下町１の２の３',
      '札幌市中央区北１条西２の１',
      '福岡市博多区博多駅前２の１の１',
      '仙台市青葉区中央１の２の３',
      '広島市中区紙屋町１の２の２２',
      '川崎市川崎区駅前本町１１の２',
    ],
  },
  {
    label: '標準形式',
    addresses: [
      '福岡県福岡市博多区博多駅前2-2-1',
      '東京都千代田区丸の内1-9-1',
      '大阪府大阪市中央区難波5-1-60',
      '愛知県名古屋市中村区名駅1-1-4',
      '北海道札幌市北区北7条西4-1-1',
      '神奈川県横浜市西区高島2-16-1',
      '京都府京都市下京区烏丸通塩小路下ル東塩小路町901',
      '兵庫県神戸市中央区東川崎町1-7-2',
      '広島県広島市南区松原町2-37',
      '宮城県仙台市青葉区中央1-1-1',
    ],
  },
];

function getRandomAddress(addresses: string[]): string {
  const index = Math.floor(Math.random() * addresses.length);
  return addresses[index];
}

export function SampleButtons({ onSelect, disabled }: SampleButtonsProps) {
  const handleClick = (addresses: string[]) => {
    const randomAddress = getRandomAddress(addresses);
    onSelect(randomAddress);
  };

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500 mb-2">サンプル住所で試す（クリックでランダム選択）:</p>
      <div className="flex flex-wrap gap-2">
        {sampleGroups.map((group) => (
          <button
            key={group.label}
            onClick={() => handleClick(group.addresses)}
            disabled={disabled}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {group.label}
          </button>
        ))}
      </div>
    </div>
  );
}
