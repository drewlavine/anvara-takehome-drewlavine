import { getIconByName } from '@/assets/icons';

export function AdSlotDetailAudienceInsights() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        {getIconByName('users')} Audience Demographics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Top Locations
          </h4>
          <div className="space-y-4">
            {[
              { loc: 'United States', val: 45 },
              { loc: 'United Kingdom', val: 15 },
              { loc: 'Germany', val: 12 },
            ].map((item) => (
              <div key={item.loc}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">{item.loc}</span>
                  <span className="text-slate-900 font-bold">{item.val}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${item.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Titles */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Job Titles
          </h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Senior Developer', 'CTO / VP Eng', 'DevOps', 'Student'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex gap-3 items-start">
            <div className="bg-indigo-600 p-1 rounded-full mt-0.5">{getIconByName('star', 4)}</div>
            <p className="text-xs text-indigo-900 leading-snug">
              <strong>High Intent:</strong> 65% of audience makes software purchasing decisions for
              their team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
