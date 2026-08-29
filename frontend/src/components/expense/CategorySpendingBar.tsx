import React from 'react';
import { CategoryAnalytics, ExpenseCategory } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Card } from '../common/UIComponents';
import { PieChart, Utensils, Hotel, Car, Ticket, ShoppingBag, Compass, HelpCircle } from 'lucide-react';

interface CategorySpendingBarProps {
  categories: CategoryAnalytics[];
  currency: string;
}

const CATEGORY_META: Record<
  ExpenseCategory,
  { label: string; icon: React.ReactNode; colorBg: string; colorBar: string; colorText: string }
> = {
  FOOD: {
    label: 'Food & Dining',
    icon: <Utensils size={15} />,
    colorBg: 'bg-emerald-50',
    colorBar: 'bg-emerald-500',
    colorText: 'text-emerald-700',
  },
  ACCOMMODATION: {
    label: 'Lodging & Hotels',
    icon: <Hotel size={15} />,
    colorBg: 'bg-indigo-50',
    colorBar: 'bg-indigo-500',
    colorText: 'text-indigo-700',
  },
  TRANSPORT: {
    label: 'Transit & Rides',
    icon: <Car size={15} />,
    colorBg: 'bg-sky-50',
    colorBar: 'bg-sky-500',
    colorText: 'text-sky-700',
  },
  ACTIVITY: {
    label: 'Activities & Tours',
    icon: <Compass size={15} />,
    colorBg: 'bg-amber-50',
    colorBar: 'bg-amber-500',
    colorText: 'text-amber-700',
  },
  TICKETS: {
    label: 'Tickets & Entry',
    icon: <Ticket size={15} />,
    colorBg: 'bg-rose-50',
    colorBar: 'bg-rose-500',
    colorText: 'text-rose-700',
  },
  SHOPPING: {
    label: 'Shopping & Souvenirs',
    icon: <ShoppingBag size={15} />,
    colorBg: 'bg-purple-50',
    colorBar: 'bg-purple-500',
    colorText: 'text-purple-700',
  },
  OTHER: {
    label: 'Other & Miscellaneous',
    icon: <HelpCircle size={15} />,
    colorBg: 'bg-slate-100',
    colorBar: 'bg-slate-500',
    colorText: 'text-slate-700',
  },
};

export const CategorySpendingBar: React.FC<CategorySpendingBarProps> = ({
  categories,
  currency,
}) => {
  const { formatDual } = useCurrency();

  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <PieChart size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Spending by Category</h4>
            <p className="text-[11px] text-slate-500">Distribution of expenses across travel categories</p>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <p className="text-xs font-semibold text-slate-600">No category spending data</p>
          <p className="text-[11px] text-slate-400">Log expenses to see category breakdown</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.category] || CATEGORY_META.OTHER;
            const pct = Math.min(100, Math.max(0, cat.percentage));

            return (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-md ${meta.colorBg} ${meta.colorText}`}>
                      {meta.icon}
                    </div>
                    <span className="font-bold text-slate-800">{meta.label}</span>
                    <span className="text-[10px] text-slate-400">
                      ({cat.expenseCount} bill{cat.expenseCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="font-bold text-slate-900">{formatDual(cat.totalAmount, currency)}</span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${meta.colorBar} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
