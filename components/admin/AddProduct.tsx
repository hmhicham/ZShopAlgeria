
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Minus, CheckCircle2, Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Category, Product } from '../../types';
import { supabase } from '../../lib/supabase';

interface AdminProductFormProps {
  onAdd: (p: any) => void;
  onUpdate: (p: any) => void;
  categories: Category[];
  editProduct?: Product | null;
  onCancel: () => void;
}

export const AddProduct: React.FC<AdminProductFormProps> = ({ onAdd, onUpdate, categories, editProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_price: '',
    category_id: categories[0]?.id || 0,
    stock_quantity: '50',
    sku: '',
    image_url: '', // Legacy/Fallback
    images: [''] // Array of image URLs
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        slug: editProduct.slug || '',
        description: editProduct.description || '',
        price: editProduct.price?.toString() || '',
        compare_price: editProduct.compare_price?.toString() || '',
        category_id: editProduct.category_id || categories[0]?.id || 0,
        stock_quantity: editProduct.stock_quantity?.toString() || '0',
        sku: editProduct.sku || '',
        image_url: editProduct.image || '',
        images: editProduct.images && editProduct.images.length > 0 ? editProduct.images : [editProduct.image || '']
      });
    }
  }, [editProduct]);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) window.clearTimeout(submitTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    // Validate images
    const validImages = formData.images.filter(url => url.trim().length > 0);
    if (validImages.length === 0) {
      setErrorMessage("At least one product image is required.");
      return;
    }

    console.group('[Admin: Product Submission]');
    console.log('Mode:', editProduct ? 'Edit' : 'Create');
    setStatus('loading');
    setErrorMessage(null);

    submitTimeoutRef.current = window.setTimeout(() => {
      if (status === 'loading') {
        setStatus('idle');
        console.error('Submission Timed Out after 15s');
        setErrorMessage("Request timed out. Please check your network and try again.");
      }
    }, 15000);

    const productPayload = {
      name: (formData.name || '').trim(),
      slug: (formData.slug || (formData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim(),
      description: (formData.description || '').trim(),
      price: parseFloat(formData.price || '0'),
      compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
      category_id: formData.category_id,
      stock_quantity: parseInt(formData.stock_quantity || '0'),
      sku: (formData.sku || '').trim() || `SKU-${Date.now()}`
    };

    console.log('Payload:', productPayload);

    try {
      if (editProduct) {
        // Update Product 
        const { data: updatedProduct, error: prodError } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editProduct.id)
          .select()
          .single();

        if (prodError) throw prodError;

        console.log('Product Record Updated:', updatedProduct.id);

        // Delete existing images (simplified approach: delete all, re-insert)
        // A better approach would be diffing, but for now full replace ensures order
        await supabase.from('product_images').delete().eq('product_id', editProduct.id);

        // Insert new images
        const imageInserts = validImages.map((url, idx) => ({
          product_id: editProduct.id,
          image_url: url,
          is_primary: idx === 0
        }));

        const { error: imgError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imgError) console.warn('Image Update Note:', imgError.message);

        onUpdate({ ...updatedProduct, image: validImages[0], images: validImages });
      } else {
        // Create Product
        const { data: newProduct, error: prodError } = await supabase
          .from('products')
          .insert(productPayload)
          .select()
          .single();

        if (prodError) throw prodError;

        console.log('New Product Created:', newProduct.id);

        const imageInserts = validImages.map((url, idx) => ({
          product_id: newProduct.id,
          image_url: url,
          is_primary: idx === 0
        }));

        await supabase
          .from('product_images')
          .insert(imageInserts);

        onAdd({ ...newProduct, image: validImages[0], images: validImages });
      }

      console.log('Submission Success');
      setStatus('success');
      setTimeout(onCancel, 800);
    } catch (err: any) {
      console.error('Submission Failed:', err.message);
      setErrorMessage(err.message || "A database error occurred.");
      setStatus('idle');
    } finally {
      if (submitTimeoutRef.current) window.clearTimeout(submitTimeoutRef.current);
      console.groupEnd();
    }
  };

  return (
    <div className="max-w-4xl animate-fadeIn pb-12">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900">
            {editProduct ? 'Edit Product' : 'New Entry'}
          </h2>
          <p className="text-slate-500">
            {editProduct ? `Ref: ${editProduct.sku}` : 'Deploy a new item to the master catalog.'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Dismiss</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-100/50 space-y-8">
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex gap-3 animate-pulse">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Product Name</label>
            <input
              type="text" required value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Slug (URL Path)</label>
            <input
              type="text" value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              placeholder="unique-product-link"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Catalog Category</label>
            <select
              value={formData.category_id}
              onChange={e => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer font-bold"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Current Price (DZD)</label>
            <input
              type="number" step="0.01" required value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Original Price (Show Offer)</label>
            <input
              type="number" step="0.01" value={formData.compare_price}
              onChange={e => setFormData({ ...formData, compare_price: e.target.value })}
              placeholder="e.g. 5000"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-400 line-through font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Initial Stock</label>
            <input
              type="number" required value={formData.stock_quantity}
              onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Product Gallery</label>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
              className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add Image
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((url, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 space-y-1">
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={e => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      placeholder={index === 0 ? "Primary Image URL..." : "Additional Image URL..."}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm pr-12"
                    />
                    {index === 0 && (
                      <span className="absolute right-4 top-3 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Main
                      </span>
                    )}
                  </div>
                </div>
                {url && (
                  <div className="w-12 h-12 rounded-xl border border-gray-200 overflow-hidden shrink-0 shadow-sm bg-white">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="mt-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <div className="w-8 h-8 flex items-center justify-center hover:bg-rose-50 rounded-full">
                      <Minus size={16} />
                    </div>
                  </button>
                )}
              </div>
            ))}
            {formData.images.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-slate-400 text-sm">No images added</p>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [''] })}
                  className="mt-2 text-indigo-600 font-bold hover:underline"
                >
                  Add First Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Product Specification</label>
          <textarea
            rows={4} required value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none text-sm leading-relaxed"
          />
        </div>

        <div className="pt-6 border-t border-gray-50 flex justify-end">
          <button
            type="submit"
            disabled={status !== 'idle'}
            className={`w-full md:w-auto px-12 py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3 shadow-xl ${status === 'success' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-slate-900 hover:bg-indigo-600 shadow-slate-200 active:scale-95 disabled:opacity-50'
              }`}
          >
            {status === 'loading' ? <Loader2 size={20} className="animate-spin" /> : status === 'success' ? <CheckCircle2 size={20} /> : <Save size={20} />}
            {status === 'loading' ? 'Processing...' : status === 'success' ? 'Saved Successfully' : editProduct ? 'Update Changes' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
