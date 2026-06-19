"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MarketPage() {
    const [stats, setStats] = useState<{
        totalListings: number;
        minPrice: number;
        maxPrice: number;
        avgPrice: number;
        avgPricePerSqft: number;
        avgPriceByBedrooms: Record<string, number>;
        avgPriceByDecade: Record<string, number>;
        priceDistribution: Record<string, number>;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_MARKET_BFF_URL || 'http://localhost:8080'}/api/market/stats`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Could not load market stats");
                setLoading(false);
            });
    }, []);

    const downloadCSV = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_MARKET_BFF_URL || 'http://localhost:8080'}/api/market/listings`);
            const properties: unknown[] = await res.json();
            
            if (!properties || properties.length === 0) return;
            
            const header = Object.keys(properties[0] as Record<string, unknown>).join(",");
            const rows = properties.map((p: unknown) => Object.values(p as Record<string, unknown>).join(","));
            const csv = [header, ...rows].join("\n");
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `market_listings.csv`;
            a.click();
        } catch(e) {
            console.error("Export failed", e);
        }
    };

    if (loading) return <div>Loading market data...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!stats) return null;

    const chartData = Object.entries(stats.avgPriceByBedrooms || {}).map(([beds, avg]) => ({
        beds: `${beds} Beds`,
        avgPrice: Math.round(avg as number)
    }));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Property Market Analysis</h1>
                <button onClick={downloadCSV} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Export CSV</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Total Listings</div>
                    <div className="text-2xl font-bold">{stats.totalListings}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Average Price</div>
                    <div className="text-2xl font-bold">${stats.avgPrice?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Min Price</div>
                    <div className="text-2xl font-bold">${stats.minPrice?.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-gray-500 text-sm">Max Price</div>
                    <div className="text-2xl font-bold">${stats.maxPrice?.toLocaleString()}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl mb-4 font-semibold">Average Price by Bedrooms</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="beds" />
                            <YAxis />
                            <Tooltip formatter={(value) => value != null ? `$${Number(value).toLocaleString()}` : ''} />
                            <Bar dataKey="avgPrice" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-4 font-semibold">Price Distribution</h2>
                <ul className="space-y-2">
                    {Object.entries(stats.priceDistribution || {}).map(([range, count]) => (
                        <li key={range} className="flex justify-between border-b pb-2">
                            <span>{range}</span>
                            <span className="font-semibold">{String(count)} listings</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
