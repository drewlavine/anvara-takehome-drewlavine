import Image from 'next/image';
import { AdSlot } from '@/lib/types';
import { getImage } from '@/lib/utils';
import { TypeIcon, typeColors } from '../../marketplaceUtils';
import { getIconByName } from '@/assets/icons';
import placeholder from '../../../../assets/logoPlaceholder.png';

interface StatBoxProps {
  icon: string;
  value: string;
  label: string;
  colorClass: string;
}

const StatBox = ({ icon, value, label, colorClass }: StatBoxProps) => (
  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
    <div className={`p-2 rounded-full bg-white shadow-sm ${colorClass}`}>
      {getIconByName(icon, 4)}
    </div>
    <div>
      <div className="text-slate-900 font-bold text-sm leading-none mb-1">{value}</div>
      <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

export function AdSlotDetailMainCard({ adSlot }: { adSlot: AdSlot }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg">
      {/* Channel Art / Video Preview */}
      <div className="h-56 bg-slate-900 relative group">
        <div className="absolute inset-0 "></div>
        {/* Mock UI for Video Player */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={getImage(adSlot?.type)}
            className="object-cover"
            fill
            alt="Ad Detail Image"
          ></Image>
          <span
            className={`absolute top-2 left-2 inline-flex items-center gap-0.5 rounded px-2 py-1 text-xs ${typeColors[adSlot?.type] || 'bg-gray-100'}`}
          >
            <TypeIcon type={adSlot?.type} />
            {adSlot?.type}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Image src={placeholder} width={200} height={200} alt="Publisher logo" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {adSlot?.publisher?.name || 'Channel Name'}
              </h1>
              <p className="text-slate-500 text-sm mb-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing.
              </p>
              <div className="flex gap-2">
                {adSlot?.publisher && (
                  <p className="text-[var(--color-muted)]">
                    {adSlot?.publisher.website && (
                      <>
                        <a
                          href={adSlot?.publisher.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          {adSlot?.publisher.website}
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* VISUAL STATS (Matching Marketplace but larger) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox icon="users" value="250k" label="Subscribers" colorClass="text-blue-600" />
          <StatBox icon="eye" value="55k" label="Avg Views" colorClass="text-orange-600" />
          <StatBox icon="stats" value="4.8%" label="Engagement" colorClass="text-green-600" />
          <StatBox icon="clock" value="Weekly" label="Uploads" colorClass="text-purple-600" />
        </div>

        {/* About the Opportunity */}
        <div className="prose prose-sm prose-slate max-w-none">
          <h3 className="text-slate-900 font-bold text-lg mb-3">About this Placement</h3>
          <p className="text-slate-600 leading-relaxed mb-4">{adSlot?.description}</p>
        </div>
      </div>
    </div>
  );
}
