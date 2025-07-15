import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Newsletter Signup */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-4">
              Abunə Ol və Endirim Qazanın
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Xüsusi təkliflər, pulsuz hədiyyələr və eksklüziv kampaniyalar üçün abunə olun.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="E-poçt ünvanınızı daxil edin"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 w-fit">
                Abunə Ol
              </button>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-4">
              Şirkət
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Haqqımızda
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Rəylər
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Bloq
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  VIP Mətn Klubu
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  100% Orijinal
                </a>
              </li>
              <li>
                <a href="mailto:contact@watches.com" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  valorewatch@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-4">
              Mağaza
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Brendlər
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Kolleksiyalar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Kişilər
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Qadınlar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Yeni
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Endirimlər
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-4">
              Müştəri Xidməti
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Hesabım
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Navidium Mühafizəsi
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Çatdırılma
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Geri Qaytarma
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Tez-tez Verilən Suallar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Bizimlə Əlaqə
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-4">
              Hüquqi Məlumat
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  İstifadə Şərtləri
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Əlçatanlıq
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  Məxfilik Siyasəti
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="playfair-display text-4xl text-[#bd8334]">
              VALORE WATCH
            </span>
          </div>
          <p className="text-sm text-gray-600">© 2025 Watches.com Bütün Hüquqlar Qorunur</p>
        </div>
      </div>
    </footer>
  );
}
