import { Search, Loader2 } from 'lucide-react';

interface DemoInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function DemoInput({ value, onChange, onSubmit, isLoading }: DemoInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && !e.nativeEvent.isComposing) {
      onSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="住所を入力してください..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Search className="w-5 h-5" />
        )}
        正規化
      </button>
    </div>
  );
}
