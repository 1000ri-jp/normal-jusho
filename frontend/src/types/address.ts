export interface NormalizeRequest {
  address: string;
}

export interface JigyosyoInfo {
  jigyosyo_name: string;
  jigyosyo_name_kana: string;
  handling_office: string;
  address_detail: string;
}

export interface BuildingInfo {
  building: string;
  building_short: string;
  floor: string;
  floor_kanji: string;
  room: string;
}

export interface RomajiInfo {
  pref: string;
  city: string;
  town: string;
  full: string;
}

export interface NormalizeResponse {
  post_code: string;
  pref: string;
  city: string;
  town: string;
  citycode: string;
  full_address: string;
  match_type: string;
  is_jigyosyo: boolean;
  is_tatemono: boolean;
  pref_kana: string;
  city_kana: string;
  town_kana: string;
  version: string;
  kokudo_version: string;
  kenall_version: string;
  long_name?: string;
  banchi: string;
  go: string;
  building_name: string;
  koaza: string;
  phone_code: string;
  lat?: string;
  lng?: string;
  pref_code?: string;
  city_code?: string;
  town_code?: string;
  jigyosyo_info?: JigyosyoInfo;
  building_info?: BuildingInfo;
  romaji?: RomajiInfo;
  confidence?: number;
  match_level?: number;
  match_level_label?: string;
}

export interface NormalizeError {
  detail: string;
}
