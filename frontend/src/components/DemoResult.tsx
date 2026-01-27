import { CheckCircle, AlertCircle, Building2, Briefcase, Navigation } from 'lucide-react';
import type { NormalizeResponse } from '../types/address';

interface DemoResultProps {
  result: NormalizeResponse | null;
  inputAddress: string | null;
  error: string | null;
}

export function DemoResult({ result, inputAddress, error }: DemoResultProps) {
  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">エラー</span>
        </div>
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Format postal code
  const formatPostCode = (code: string) => {
    if (!code) return '-';
    return `〒${code.slice(0, 3)}-${code.slice(3)}`;
  };

  // Combine kana readings
  const fullKana = [result.pref_kana, result.city_kana, result.town_kana]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
      <div className="flex items-center gap-2 text-green-700 mb-4">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">正規化完了</span>
      </div>

      <div className="space-y-4">
        {/* Input */}
        {inputAddress && (
          <div>
            <p className="text-sm text-gray-500 mb-1">入力</p>
            <p className="text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200">
              {inputAddress}
            </p>
          </div>
        )}

        {/* Jigyosyo name */}
        {result.is_jigyosyo && result.jigyosyo_info && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-600">事業所</p>
              <p className="text-lg font-bold text-blue-900">{result.jigyosyo_info.jigyosyo_name}</p>
              {result.jigyosyo_info.jigyosyo_name_kana && (
                <p className="text-xs text-blue-600">{result.jigyosyo_info.jigyosyo_name_kana}</p>
              )}
            </div>
          </div>
        )}

        {/* Building info */}
        {result.is_tatemono && result.building_info && (
          <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <Building2 className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-purple-600">建物</p>
              <p className="text-lg font-bold text-purple-900">{result.building_info.building_short || result.building_info.building}</p>
              {(result.building_info.floor || result.building_info.room) && (
                <p className="text-sm text-purple-700">
                  {result.building_info.floor && <span>{result.building_info.floor}階</span>}
                  {result.building_info.floor && result.building_info.room && <span> / </span>}
                  {result.building_info.room && <span>{result.building_info.room}号室</span>}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Output - Full address */}
        <div>
          <p className="text-sm text-gray-500 mb-1">正規化結果</p>
          <p className="text-lg font-medium text-gray-900 bg-white px-3 py-2 rounded-lg border border-green-300">
            {result.full_address}
          </p>
          {fullKana && (
            <p className="text-xs text-gray-500 mt-1 ml-1">{fullKana}</p>
          )}
        </div>

        {/* Address details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">郵便番号</p>
            <p className="font-medium text-gray-800">{formatPostCode(result.post_code)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">都道府県</p>
            <p className="font-medium text-gray-800">{result.pref || '-'}</p>
            {result.pref_kana && <p className="text-xs text-gray-400">{result.pref_kana}</p>}
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">市区町村</p>
            <p className="font-medium text-gray-800">{result.city || '-'}</p>
            {result.city_kana && <p className="text-xs text-gray-400">{result.city_kana}</p>}
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">町域</p>
            <p className="font-medium text-gray-800">{result.town || '-'}</p>
            {result.town_kana && <p className="text-xs text-gray-400">{result.town_kana}</p>}
          </div>
        </div>

        {/* Address details row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {result.koaza && (
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">小字</p>
              <p className="font-medium text-gray-800">{result.koaza}</p>
            </div>
          )}
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">番地</p>
            <p className="font-medium text-gray-800">{result.banchi || '-'}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">号</p>
            <p className="font-medium text-gray-800">{result.go || '-'}</p>
          </div>
          {result.building_name && (
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">建物名</p>
              <p className="font-medium text-gray-800">{result.building_name}</p>
            </div>
          )}
        </div>

        {/* Codes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {result.pref_code && (
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">都道府県コード</p>
              <p className="font-medium text-gray-800">{result.pref_code}</p>
            </div>
          )}
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">市区町村コード</p>
            <p className="font-medium text-gray-800">{result.city_code || result.citycode || '-'}</p>
          </div>
          {result.town_code && (
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">町域コード</p>
              <p className="font-medium text-gray-800 text-xs">{result.town_code}</p>
            </div>
          )}
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">マッチタイプ</p>
            <p className="font-medium text-gray-800">{result.match_type || '-'}</p>
          </div>
        </div>

        {/* Geo */}
        {result.lat && result.lng && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Navigation className="w-4 h-4" />
            <span>緯度経度: </span>
            <a
              href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {result.lat}, {result.lng}
            </a>
          </div>
        )}

        {/* Version info */}
        <div className="pt-2 text-xs text-gray-400 flex flex-wrap gap-4">
          <span>API: v{result.version}</span>
          <span>国土: {result.kokudo_version}</span>
          <span>KEN_ALL: {result.kenall_version}</span>
        </div>
      </div>
    </div>
  );
}
