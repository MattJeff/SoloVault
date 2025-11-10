'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, X } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

export default function RevenueCalculator({ onClose }: CalculatorProps) {
  const [monthlyVisitors, setMonthlyVisitors] = useState(1000);
  const [conversionRate, setConversionRate] = useState(2);
  const [averagePrice, setAveragePrice] = useState(29);
  const [churnRate, setChurnRate] = useState(5);

  // Calculations
  const monthlySignups = (monthlyVisitors * conversionRate) / 100;
  const mrr = monthlySignups * averagePrice;
  const arr = mrr * 12;
  const netMrr = mrr * (1 - churnRate / 100);
  const yearlyNetRevenue = netMrr * 12;

  const handleSaveResults = async () => {
    const email = localStorage.getItem('solovault_email');
    if (email) {
      // Track calculator usage for gamification
      await fetch('/api/track-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'USE_CALCULATOR',
          metadata: {
            monthlyVisitors,
            conversionRate,
            averagePrice,
            mrr,
            arr
          }
        })
      });
    }

    alert(`📊 Résultats sauvegardés ! MRR estimé : ${Math.round(mrr)}€/mois`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Calculateur de Revenue SaaS</h2>
              <p className="text-zinc-400 text-sm">Estime ton potentiel de revenue mensuel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                <span>Visiteurs mensuels</span>
                <span className="text-orange-500 font-bold">{monthlyVisitors.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={monthlyVisitors}
                onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>100</span>
                <span>100K</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                <span>Taux de conversion (%)</span>
                <span className="text-orange-500 font-bold">{conversionRate}%</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>0.5%</span>
                <span>10%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                <span>Prix moyen (€/mois)</span>
                <span className="text-orange-500 font-bold">{averagePrice}€</span>
              </label>
              <input
                type="range"
                min="5"
                max="200"
                step="1"
                value={averagePrice}
                onChange={(e) => setAveragePrice(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>5€</span>
                <span>200€</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                <span>Churn mensuel (%)</span>
                <span className="text-orange-500 font-bold">{churnRate}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={churnRate}
                onChange={(e) => setChurnRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>1%</span>
                <span>15%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-sm text-zinc-400">MRR (Monthly Recurring Revenue)</span>
              </div>
              <div className="text-4xl font-bold text-green-500 mb-1">
                {Math.round(mrr).toLocaleString()}€
              </div>
              <div className="text-sm text-zinc-500">
                {Math.round(monthlySignups)} nouveaux clients/mois
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-zinc-400">ARR (Annual Recurring Revenue)</span>
              </div>
              <div className="text-4xl font-bold text-blue-500 mb-1">
                {Math.round(arr).toLocaleString()}€
              </div>
              <div className="text-sm text-zinc-500">
                Revenue annuel potentiel
              </div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-xl p-6">
              <div className="text-sm text-zinc-400 mb-3">Après churn ({churnRate}%)</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">MRR Net</span>
                  <span className="font-bold text-orange-500">{Math.round(netMrr).toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Revenue Net Annuel</span>
                  <span className="font-bold text-orange-500">{Math.round(yearlyNetRevenue).toLocaleString()}€</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4 text-sm">
              <p className="text-zinc-400 mb-2">💡 <strong>Conseil :</strong></p>
              <p className="text-zinc-300">
                Pour un SaaS solo rentable, vise un MRR de 3K€+
                (= {Math.round((3000 / averagePrice) * 100 / conversionRate).toLocaleString()} visiteurs/mois)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSaveResults}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
          >
            💾 Sauvegarder mes résultats
          </button>
          <button
            onClick={() => {
              setMonthlyVisitors(1000);
              setConversionRate(2);
              setAveragePrice(29);
              setChurnRate(5);
            }}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
