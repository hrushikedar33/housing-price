"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EstimatorPage() {
  const [formData, setFormData] = useState({
    square_footage: '',
    bedrooms: '',
    bathrooms: '',
    year_built: '',
    lot_size: '',
    distance_to_city_center: '',
    school_rating: ''
  });
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        square_footage: parseFloat(formData.square_footage),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        year_built: parseInt(formData.year_built),
        lot_size: parseFloat(formData.lot_size),
        distance_to_city_center: parseFloat(formData.distance_to_city_center),
        school_rating: parseFloat(formData.school_rating)
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_APP1_BFF_URL || 'http://localhost:8001'}/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        throw new Error(await res.text() || "Estimation failed");
      }
      const data = await res.json();
      setResult(data.price);
      
      // Save history
      const history = JSON.parse(localStorage.getItem('estimateHistory') || '[]');
      history.push({ ...payload, price: data.price, date: new Date().toISOString() });
      localStorage.setItem('estimateHistory', JSON.stringify(history));

    } catch (err: Error | unknown) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Property Value Estimator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Square Footage</label>
                        <input required type="number" step="0.1" name="square_footage" value={formData.square_footage} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                        <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                        <input required type="number" step="0.1" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Year Built</label>
                        <input required type="number" name="year_built" value={formData.year_built} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lot Size</label>
                        <input required type="number" step="0.1" name="lot_size" value={formData.lot_size} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Distance to Center</label>
                        <input required type="number" step="0.1" name="distance_to_city_center" value={formData.distance_to_city_center} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">School Rating (0-10)</label>
                        <input required type="number" step="0.1" max="10" min="0" name="school_rating" value={formData.school_rating} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
                    </div>
                </div>
                <button disabled={loading} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                    {loading ? 'Estimating...' : 'Get Estimate'}
                </button>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </form>
        </div>
        
        <div>
            {result !== null && (
                <div className="bg-indigo-50 p-6 rounded-lg text-center shadow mb-6">
                    <h2 className="text-xl font-medium text-indigo-800">Estimated Value</h2>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recent Estimates</h2>
                    <button onClick={() => router.push('/estimator/compare')} className="text-indigo-600 text-sm hover:underline">Compare</button>
                 </div>
                 <div className="text-sm text-gray-500">History available in compare view.</div>
            </div>
        </div>
      </div>
    </div>
  );
}
