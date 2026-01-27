import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { DemoInput } from './DemoInput';
import { DemoResult } from './DemoResult';
import { SampleButtons } from './SampleButtons';
import { useNormalize } from '../hooks/useNormalize';

export function Hero() {
  const [address, setAddress] = useState('');
  const { normalize, result, inputAddress, error, isLoading } = useNormalize();

  const handleSubmit = () => {
    normalize(address);
  };

  const handleSampleSelect = (sampleAddress: string) => {
    setAddress(sampleAddress);
    normalize(sampleAddress);
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            日本の住所を、正確に。
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            表記ゆれを自動修正し、正規化された住所を返します
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <BadgeCheck className="w-5 h-5" />
            精度 99.8% 超
          </div>
        </div>

        {/* Live Demo */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ライブデモ
          </h2>

          <DemoInput
            value={address}
            onChange={setAddress}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <SampleButtons
            onSelect={handleSampleSelect}
            disabled={isLoading}
          />

          <DemoResult result={result} inputAddress={inputAddress} error={error} />
        </div>
      </div>
    </section>
  );
}
