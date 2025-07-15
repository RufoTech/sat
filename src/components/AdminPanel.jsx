import React, { useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

// Firebase users koleksiyonundan rol kontrolü
async function checkIfAdmin(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() && snap.data().role === "admin";
}

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    brand: "",
    name: "",
    gender: "",
    color: "",
    price: "",
    caseMaterial: "",
    caseSize: "",
    caseThickness: "",
    lugToLug: "",
    indexAndLuminous: "",
    lens: "",
    crownType: "",
    band: "",
    waterResistance: "",
    watchWeight: "",
    warranty: "",
    imageFiles: [],
    onSale: false,
    originalPrice: ""
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ ...newProduct });

  // Cloudinary konfigürasyonu
  const CLOUD_NAME = 'di8zz8sc1';
  const UPLOAD_PRESET = 'watch1';

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: data }
    );
    const result = await res.json();
    return result.secure_url;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const admin = await checkIfAdmin(user.uid);
        setIsAdmin(admin);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin && !loading) return;
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, [isAdmin, loading]);

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.brand) return;
    
    const cleanName = newProduct.name.trim();
    const cleanBrand = newProduct.brand.trim();
    const productData = {
      brand: cleanBrand,
      name: cleanName,
      nameLower: `${cleanBrand.toLowerCase()} ${cleanName.toLowerCase()}`,
      gender: newProduct.gender,
      color: newProduct.color,
      price: parseFloat(newProduct.price),
      caseMaterial: newProduct.caseMaterial,
      caseSize: newProduct.caseSize,
      caseThickness: newProduct.caseThickness,
      lugToLug: newProduct.lugToLug,
      indexAndLuminous: newProduct.indexAndLuminous,
      lens: newProduct.lens,
      crownType: newProduct.crownType,
      band: newProduct.band,
      waterResistance: newProduct.waterResistance,
      watchWeight: newProduct.watchWeight,
      warranty: newProduct.warranty,
      onSale: newProduct.onSale,
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
      createdAt: Timestamp.now(),
      imageUrls: []
    };

    const docRef = await addDoc(collection(db, "products"), productData);
    
    // Tüm resimleri yükle
    if (newProduct.imageFiles.length > 0) {
      const uploadPromises = newProduct.imageFiles.map(file => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      await updateDoc(docRef, { imageUrls: urls });
    }
    
    setNewProduct({
      brand: "",
      name: "",
      gender: "",
      color: "",
      price: "",
      caseMaterial: "",
      caseSize: "",
      caseThickness: "",
      lugToLug: "",
      indexAndLuminous: "",
      lens: "",
      crownType: "",
      band: "",
      waterResistance: "",
      watchWeight: "",
      warranty: "",
      imageFiles: [],
      onSale: false,
      originalPrice: ""
    });
    
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData({
      brand: product.brand,
      name: product.name,
      gender: product.gender,
      color: product.color,
      price: product.price.toString(),
      caseMaterial: product.caseMaterial,
      caseSize: product.caseSize,
      caseThickness: product.caseThickness,
      lugToLug: product.lugToLug,
      indexAndLuminous: product.indexAndLuminous,
      lens: product.lens,
      crownType: product.crownType,
      band: product.band,
      waterResistance: product.waterResistance,
      watchWeight: product.watchWeight,
      warranty: product.warranty,
      onSale: product.onSale || false,
      originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
      imageFiles: [],
      existingImages: product.imageUrls || []
    });
  };

  const handleUpdate = async () => {
    const cleanName = editData.name.trim();
    const cleanBrand = editData.brand.trim();
    const docRef = doc(db, "products", editId);
    const updateData = {
      brand: cleanBrand,
      name: cleanName,
      nameLower: `${cleanBrand.toLowerCase()} ${cleanName.toLowerCase()}`,
      gender: editData.gender,
      color: editData.color,
      price: parseFloat(editData.price),
      caseMaterial: editData.caseMaterial,
      caseSize: editData.caseSize,
      caseThickness: editData.caseThickness,
      lugToLug: editData.lugToLug,
      indexAndLuminous: editData.indexAndLuminous,
      lens: editData.lens,
      crownType: editData.crownType,
      band: editData.band,
      waterResistance: editData.waterResistance,
      watchWeight: editData.watchWeight,
      warranty: editData.warranty,
      onSale: editData.onSale,
      originalPrice: editData.originalPrice ? parseFloat(editData.originalPrice) : null
    };

    // Mevcut resimleri koru
    updateData.imageUrls = [...editData.existingImages];
    
    // Yeni resimleri yükle ve URL'leri ekle
    if (editData.imageFiles.length > 0) {
      const uploadPromises = editData.imageFiles.map(file => uploadToCloudinary(file));
      const newUrls = await Promise.all(uploadPromises);
      updateData.imageUrls = [...updateData.imageUrls, ...newUrls];
      
      // Maksimum 7 resim sınırı
      if (updateData.imageUrls.length > 7) {
        updateData.imageUrls = updateData.imageUrls.slice(0, 7);
      }
    }

    await updateDoc(docRef, updateData);
    
    setEditId(null);
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(products.filter(p => p.id !== id));
  };

  const handleImageChange = (e, isEdit = false) => {
    const files = Array.from(e.target.files);
    
    // Maksimum 7 resim kontrolü
    if (isEdit) {
      const totalImages = editData.existingImages.length + files.length;
      if (totalImages > 7) {
        alert('Maksimum 7 resim ekleyebilirsiniz!');
        return;
      }
    } else {
      if (files.length > 7) {
        alert('Maksimum 7 resim ekleyebilirsiniz!');
        return;
      }
    }
    
    if (isEdit) {
      setEditData({
        ...editData,
        imageFiles: [...editData.imageFiles, ...files]
      });
    } else {
      setNewProduct({
        ...newProduct,
        imageFiles: [...newProduct.imageFiles, ...files]
      });
    }
  };

  const removeImage = (index, isEdit = false, isExisting = false) => {
    if (isEdit) {
      if (isExisting) {
        const updatedImages = [...editData.existingImages];
        updatedImages.splice(index, 1);
        setEditData({
          ...editData,
          existingImages: updatedImages
        });
      } else {
        const updatedFiles = [...editData.imageFiles];
        updatedFiles.splice(index, 1);
        setEditData({
          ...editData,
          imageFiles: updatedFiles
        });
      }
    } else {
      const updatedFiles = [...newProduct.imageFiles];
      updatedFiles.splice(index, 1);
      setNewProduct({
        ...newProduct,
        imageFiles: updatedFiles
      });
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!isAdmin) return <p>Bu sayfa sadece yöneticiler içindir.</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel - Ürün Yönetimi</h1>

      {/* Yeni Ürün Ekleme Formu */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Temel Bilgiler */}
          <div className="space-y-3">
            <h3 className="font-medium">Temel Bilgiler</h3>
            <input
              className="w-full border p-2 rounded"
              placeholder="Marka"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Model Adı"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded"
              value={newProduct.gender}
              onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
            >
              <option value="">Cinsiyet Seçin</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
              <option value="Unisex">Unisex</option>
              <option value="Çocuk">Çocuk</option>
            </select>
            <input
              className="w-full border p-2 rounded"
              placeholder="Renk"
              value={newProduct.color}
              onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Fiyat"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
          </div>

          {/* Teknik Özellikler */}
          <div className="space-y-3">
            <h3 className="font-medium">Teknik Özellikler</h3>
            <input
              className="w-full border p-2 rounded"
              placeholder="Kasa Materyali"
              value={newProduct.caseMaterial}
              onChange={(e) => setNewProduct({ ...newProduct, caseMaterial: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Kasa Boyutu (mm)"
              value={newProduct.caseSize}
              onChange={(e) => setNewProduct({ ...newProduct, caseSize: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Kasa Kalınlığı (mm)"
              value={newProduct.caseThickness}
              onChange={(e) => setNewProduct({ ...newProduct, caseThickness: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Lug to Lug (mm)"
              value={newProduct.lugToLug}
              onChange={(e) => setNewProduct({ ...newProduct, lugToLug: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Index & Luminous"
              value={newProduct.indexAndLuminous}
              onChange={(e) => setNewProduct({ ...newProduct, indexAndLuminous: e.target.value })}
            />
          </div>

          {/* Diğer Özellikler */}
          <div className="space-y-3">
            <h3 className="font-medium">Diğer Özellikler</h3>
            <input
              className="w-full border p-2 rounded"
              placeholder="Lens"
              value={newProduct.lens}
              onChange={(e) => setNewProduct({ ...newProduct, lens: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Kurma Kolu Tipi"
              value={newProduct.crownType}
              onChange={(e) => setNewProduct({ ...newProduct, crownType: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Kordon"
              value={newProduct.band}
              onChange={(e) => setNewProduct({ ...newProduct, band: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Su Geçirmezlik"
              value={newProduct.waterResistance}
              onChange={(e) => setNewProduct({ ...newProduct, waterResistance: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Ağırlık (g)"
              value={newProduct.watchWeight}
              onChange={(e) => setNewProduct({ ...newProduct, watchWeight: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Garanti"
              value={newProduct.warranty}
              onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
            />
          </div>

          {/* Resim ve İndirim */}
          <div className="space-y-3">
            <h3 className="font-medium">Resimler (Maksimum 7)</h3>
            <input
              className="w-full border p-2 rounded"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e, false)}
            />
            
            {/* Seçilen resimlerin önizlemesi */}
            <div className="flex flex-wrap gap-2">
              {newProduct.imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index}`} 
                    className="h-16 w-16 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeImage(index, false)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newProduct.onSale}
                onChange={(e) => setNewProduct({ ...newProduct, onSale: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span>İndirimde</span>
            </label>
            {newProduct.onSale && (
              <input
                className="w-full border p-2 rounded"
                placeholder="Orijinal Fiyat"
                type="number"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
              />
            )}
            <button 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              onClick={handleAdd}
            >
              Ürün Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Mevcut Ürünler Listesi */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Mevcut Ürünler</h2>
        {products.length === 0 ? (
          <p>Henüz ürün bulunmamaktadır.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resimler</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marka</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cinsiyet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {product.imageUrls?.slice(0, 3).map((url, index) => (
                          <img 
                            key={index} 
                            src={url} 
                            alt={product.name} 
                            className="h-12 w-12 object-cover rounded border" 
                          />
                        ))}
                        {product.imageUrls?.length > 3 && (
                          <div className="h-12 w-12 bg-gray-100 rounded border flex items-center justify-center text-xs">
                            +{product.imageUrls.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.onSale ? (
                        <>
                          <span className="text-red-600">{product.price} ₺</span>
                          <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice} ₺</span>
                        </>
                      ) : (
                        <span>{product.price} ₺</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => startEdit(product)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Düzenleme Modalı */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ürün Düzenle</h2>
              <button 
                onClick={() => setEditId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Düzenleme Formu */}
              <div className="space-y-3">
                <h3 className="font-medium">Temel Bilgiler</h3>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Marka"
                  value={editData.brand}
                  onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Model Adı"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <select
                  className="w-full border p-2 rounded"
                  value={editData.gender}
                  onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                >
                  <option value="">Cinsiyet Seçin</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Çocuk">Çocuk</option>
                </select>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Renk"
                  value={editData.color}
                  onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Fiyat"
                  type="number"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Resimler (Maksimum 7)</h3>
                <input
                  className="w-full border p-2 rounded"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(e, true)}
                />
                
                {/* Mevcut resimler */}
                <div className="flex flex-wrap gap-2">
                  {editData.existingImages?.map((url, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img 
                        src={url} 
                        alt={`Existing ${index}`} 
                        className="h-16 w-16 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeImage(index, true, true)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Yeni eklenen resimler */}
                <div className="flex flex-wrap gap-2">
                  {editData.imageFiles?.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`New ${index}`} 
                        className="h-16 w-16 object-cover rounded border"
                      />
                      <button
                        onClick={() => removeImage(index, true, false)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.onSale}
                    onChange={(e) => setEditData({ ...editData, onSale: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span>İndirimde</span>
                </label>
                {editData.onSale && (
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Orijinal Fiyat"
                    type="number"
                    value={editData.originalPrice}
                    onChange={(e) => setEditData({ ...editData, originalPrice: e.target.value })}
                  />
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Teknik Özellikler</h3>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Kasa Materyali"
                  value={editData.caseMaterial}
                  onChange={(e) => setEditData({ ...editData, caseMaterial: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Kasa Boyutu (mm)"
                  value={editData.caseSize}
                  onChange={(e) => setEditData({ ...editData, caseSize: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Kasa Kalınlığı (mm)"
                  value={editData.caseThickness}
                  onChange={(e) => setEditData({ ...editData, caseThickness: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Lug to Lug (mm)"
                  value={editData.lugToLug}
                  onChange={(e) => setEditData({ ...editData, lugToLug: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Index & Luminous"
                  value={editData.indexAndLuminous}
                  onChange={(e) => setEditData({ ...editData, indexAndLuminous: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Diğer Özellikler</h3>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Lens"
                  value={editData.lens}
                  onChange={(e) => setEditData({ ...editData, lens: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Kurma Kolu Tipi"
                  value={editData.crownType}
                  onChange={(e) => setEditData({ ...editData, crownType: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Kordon"
                  value={editData.band}
                  onChange={(e) => setEditData({ ...editData, band: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Su Geçirmezlik"
                  value={editData.waterResistance}
                  onChange={(e) => setEditData({ ...editData, waterResistance: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Ağırlık (g)"
                  value={editData.watchWeight}
                  onChange={(e) => setEditData({ ...editData, watchWeight: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Garanti"
                  value={editData.warranty}
                  onChange={(e) => setEditData({ ...editData, warranty: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}