"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ComparePage() {
    const [history, setHistory] = useState<{
        square_footage: number;
        bedrooms: number;
        bathrooms: number;
        year_built: number;
        lot_size: number;
        distance_to_city_center: number;
        school_rating: number;
        price: number;
        date: string;
    }[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('estimateHistory') || '[]');
        setHistory(stored);
    }, []);

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6">
                <Link href="/estimator" className="text-indigo-600 hover:underline">← Back</Link>
                <h1 className="text-3xl font-bold">Estimate History Comparison</h1>
            </div>

            {history.length === 0 ? (
                <p>No history available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SqFt</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beds/Baths</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history.map((h, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(h.date).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.square_footage}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.bedrooms} / {h.bathrooms}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.year_built}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${h.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
