import { Link } from 'react-router-dom';
import { MapPin, Github, FileText, Twitter, CircleDot } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-white">Jusho</span>
            </div>
            <p className="text-sm text-gray-400">
              日本の住所正規化サービス
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            <Link
              to="/docs"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>API ドキュメント</span>
            </Link>
            <a
              href="https://github.com/1000ri-jp/normal-jusho"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://github.com/1000ri-jp/normal-jusho/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <CircleDot className="w-4 h-4" />
              <span>正規化できない住所を報告</span>
            </a>
            <a
              href="https://x.com/senri_naofumi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span>お問い合わせ</span>
            </a>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2">データソース:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>
              「<a href="https://nlftp.mlit.go.jp" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">位置参照情報ダウンロードサービス</a>」（国土交通省）を加工して作成
            </li>
            <li>
              「<a href="https://www.post.japanpost.jp/zipcode/dl/readme.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">郵便番号データ</a>」（日本郵便株式会社）を加工して作成
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Jusho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
