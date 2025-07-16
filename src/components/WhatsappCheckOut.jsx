import React from 'react';
import PropTypes from 'prop-types';

const whatsappNumber = '994993490934'; // Tom formatında: 994xx...

export default function WhatsAppButton({ cart, getFormattedSubtotal }) {
  // Unicode ilə simvolları aydın şəkildə saxlayırıq
  const header   = '\u{1F6D2} Salam bu saatlarla maraqlanırdım və ya sipariş etmək istəyirdim.';
  const box      = '\u{1F4E6}';
  const money    = '\u{1F4B0}';
  const currency = '\u20BC';

  const generateMessage = () => {
    const itemsText = cart.map(item => 
      `${box} *${item.name}* - Miqdar: ${item.quantity} - Qiymət: ${parseFloat(item.price).toFixed(2)} ${currency}`
    ).join('\n');

    const total = `Cəmi: ${getFormattedSubtotal()} ${currency}`;
    const fullText = `${header}\n${itemsText}\n\n${money} ${total}`;
    return encodeURIComponent(fullText);
  };

  const handleClick = () => {
    if (!cart.length) {
      alert('Səbət boşdur.');
      return;
    }
    const text = generateMessage();
    const url  = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!cart.length}
      className={`
        w-full mt-4 py-3 rounded-lg font-semibold shadow-lg transition
        ${cart.length ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
      `}
    >
      WhatsApp ilə Sifariş Et
    </button>
  );
}

WhatsAppButton.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name:     PropTypes.string.isRequired,
      price:    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  getFormattedSubtotal: PropTypes.func.isRequired,
};
