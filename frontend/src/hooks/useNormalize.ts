import { useState, useCallback } from 'react';
import type { NormalizeResponse, NormalizeError, AmbiguousMatchDetail } from '../types/address';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.jusho.dev';

// Check if error detail is an ambiguous match
function isAmbiguousMatchDetail(detail: unknown): detail is AmbiguousMatchDetail {
  return (
    typeof detail === 'object' &&
    detail !== null &&
    'error' in detail &&
    (detail as AmbiguousMatchDetail).error === 'ambiguous_town_match' &&
    'candidates' in detail &&
    Array.isArray((detail as AmbiguousMatchDetail).candidates)
  );
}

// Transform nested API response to flat format used by UI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformResponse(data: any): NormalizeResponse {
  // Already flat format — return as-is
  if (data.full_address !== undefined) {
    return data as NormalizeResponse;
  }

  // Nested format → flat format
  return {
    full_address: data.address?.full ?? '',
    pref: data.address?.pref ?? '',
    city: data.address?.city ?? '',
    town: data.address?.town ?? '',
    koaza: data.address?.koaza ?? '',
    banchi: data.address?.banchi ?? '',
    go: data.address?.go ?? '',
    building_name: data.address?.building ?? '',
    pref_kana: data.kana?.pref ?? '',
    city_kana: data.kana?.city ?? '',
    town_kana: data.kana?.town ?? '',
    post_code: data.codes?.post_code ?? '',
    pref_code: data.codes?.pref_code ?? '',
    city_code: data.codes?.city_code ?? '',
    citycode: data.codes?.city_code ?? '',
    town_code: data.codes?.town_code ?? '',
    lat: data.geo?.lat ?? '',
    lng: data.geo?.lng ?? '',
    match_type: data.meta?.match_type ?? '',
    is_jigyosyo: data.meta?.is_jigyosyo ?? false,
    is_tatemono: data.meta?.is_tatemono ?? false,
    version: data.meta?.version ?? '',
    kokudo_version: data.meta?.kokudo_version ?? '',
    kenall_version: data.meta?.kenall_version ?? '',
    phone_code: '',
    jigyosyo_info: data.jigyosyo_info,
    building_info: data.building_info,
    romaji: data.romaji,
    confidence: data.meta?.confidence,
    match_level: data.meta?.match_level,
    match_level_label: data.meta?.match_level_label,
    // 通り名（京都住所用）
    toorina: data.toorina?.value ?? '',
    normalized_address_type1_with_toorina: data.toorina?.full_address_with_toorina ?? '',
  };
}

interface UseNormalizeResult {
  normalize: (address: string) => Promise<void>;
  result: NormalizeResponse | null;
  inputAddress: string | null;
  error: string | null;
  ambiguousMatch: AmbiguousMatchDetail | null;
  isLoading: boolean;
  reset: () => void;
}

export function useNormalize(): UseNormalizeResult {
  const [result, setResult] = useState<NormalizeResponse | null>(null);
  const [inputAddress, setInputAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ambiguousMatch, setAmbiguousMatch] = useState<AmbiguousMatchDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const normalize = useCallback(async (address: string) => {
    if (!address.trim()) {
      setError('住所を入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setAmbiguousMatch(null);
    setInputAddress(address);

    try {
      const response = await fetch(`${API_URL}/normalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorData: NormalizeError = await response.json();
        // Check if this is an ambiguous match error
        if (isAmbiguousMatchDetail(errorData.detail)) {
          setAmbiguousMatch(errorData.detail);
          return;
        }
        const errorMessage = typeof errorData.detail === 'string'
          ? errorData.detail
          : `HTTP error ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResult(transformResponse(data));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('予期しないエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setInputAddress(null);
    setError(null);
    setAmbiguousMatch(null);
    setIsLoading(false);
  }, []);

  return { normalize, result, inputAddress, error, ambiguousMatch, isLoading, reset };
}
