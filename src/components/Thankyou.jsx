import React from 'react';
import { Link } from 'react-router-dom';

export default function ThankYouPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <img src="/thank.gif" alt="" />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">Sifariş etdiyiniz üçün təşəkkür edirik!</h1>
        <p className="text-gray-600 mt-2">
          Sifarişiniz alındı və emal olunur. Tezliklə sizinlə əlaqə saxlanılacaq.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
        >
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    </div>
  );
}
