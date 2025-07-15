/* src/components/CheckoutPage.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { send } from 'emailjs-com';
import { toast } from 'react-toastify';
import { useCart } from './CardContext';
import { auth } from './Firebase';
import { User, Phone, Home } from 'react-feather';

const SERVICE_ID   = 'service_62zlvkx';
const TEMPLATE_ID  = 'template_zk7ajg9';
const PUBLIC_KEY   = 'j8Nu21X7a2XGlWnYB';

export default function CheckoutPage() {
  const { cart, getFormattedSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Zəhmət olmasa bütün sahələri doldurun.');
      return;
    }
    setLoading(true);
    const itemsHtml = cart.map(item =>
      `<div style="margin-bottom:10px;"><strong>${item.name}</strong><br/>` +
      `Miqdar: ${item.quantity} × Qiymət: ${parseFloat(item.price).toFixed(2)} ₼</div>`
    ).join('');
    const templateParams = {
      user_name: formData.name,
      user_phone: formData.phone,
      user_address: formData.address,
      user_email: auth.currentUser?.email || '',
      items_html: itemsHtml,
      total_amount: getFormattedSubtotal(),
    };
    try {
      await send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      toast.success('Sifariş məlumatları emailə göndərildi.');
      await clearCart();
      navigate('/thank-you');
    } catch (err) {
      console.error(err);
      toast.error('Email göndərilməsində xəta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Ödəniş və Çatdırılma</h2>

        {/* Sepet */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Səbətiniz</h3>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center bg-gray-100 rounded-lg p-4 shadow-inner">
                <img
                  src={item.imageUrls?.[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600">Miqdar: {item.quantity}</p>
                  <p className="text-gray-600">Qiymət: {parseFloat(item.price).toFixed(2)} ₼</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <span className="text-lg font-bold">Cəmi: {getFormattedSubtotal()} ₼</span>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Ad Soyad"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="relative">
            <Phone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="0501234567"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="relative">
            <Home className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              placeholder="Ünvanınızı daxil edin"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            {loading ? 'Göndərilir...' : 'Sifarişi Tamamla'}
          </button>
        </form>
      </div>
    </div>
  );
}
