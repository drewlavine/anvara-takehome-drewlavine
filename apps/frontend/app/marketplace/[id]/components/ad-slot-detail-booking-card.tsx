import { useState } from 'react';
import { bookAdSlot } from '@/lib/actions';
import Link from 'next/link';

export function AdSlotDetailBookingCard({
  adSlotId,
  sponsorId,
  monthlyCost,
  name,
}: {
  adSlotId: string;
  sponsorId: string;
  monthlyCost: number;
  name: string;
}) {
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [startedBooking, setStartedBooking] = useState(false);

  const handleBooking = async () => {
    if (!sponsorId || !adSlotId) return;

    setBooking(true);
    setBookingError(null);

    try {
      const result = await bookAdSlot(adSlotId, sponsorId, message || undefined);

      if (!result.success) {
        throw new Error(result.error || 'Failed to book placement');
      }

      setBookingSuccess(true);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Failed to book placement');
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <div className="sticky rounded-lg bg-(--color-foreground) border border-slate-200 top-24  overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 flex items-center justify-between pb-0 p-6">
          <h3 className="text-md font-semibold uppercase text-slate-900">Starting Price</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-(--color-primary) font-semibold text-xl">
              ${Number(monthlyCost).toLocaleString('en-US')}
              <span className="text-slate-500 text-sm font-medium">/mo</span>
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!bookingSuccess ? (
            <>
              <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Deliverables</h4>
              <ul className="space-y-3">
                {[
                  'First deliverable from api',
                  'Second deliverable from api',
                  'Third deliverable from api',
                  'Fourth deliverable from api',
                ].map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="indigo"
                      className="size-4 shrink-0 mt-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    {deliverable}
                  </li>
                ))}
              </ul>

              {!startedBooking ? (
                sponsorId ? (
                  <button
                    onClick={() => setStartedBooking(true)}
                    className="flex w-full bg-(--color-primary) hover:bg-(--color-primary-hover) text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-slate-900/10  items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    Request Placement{' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </button>
                ) : (
                  <div>
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 font-semibold text-gray-500"
                    >
                      Request This Placement
                    </button>
                    <p className="mt-2 text-center text-sm text-slate-500">
                      Log in as a sponsor to request this placement
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="border-t border-slate-100 pt-4 -mt-2">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">
                      Request This Placement
                    </h4>

                    {bookingError && (
                      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                        {bookingError}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                          Your Name
                        </label>
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute left-3 top-2.5 size-4 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>

                          <input
                            type="text"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-(--color-primary-light)/20 focus:border-(--color-primary-light)"
                            defaultValue={name || ''}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                          Your Company
                        </label>
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="absolute left-3 top-2.5 size-4 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                            />
                          </svg>

                          <input
                            type="text"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-(--color-primary-light)/20 focus:border-(--color-primary-light)"
                            defaultValue="Placeholder Inc."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">
                          Message to Publisher (Optional)
                        </label>
                        <textarea
                          placeholder="Tell the publisher about your campaign goals..."
                          className="w-full p-3 h-24 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-(--color-primary-light)/20 focus:border-(--color-primary-light) resize-none"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStartedBooking(false)}
                      className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={booking}
                      onClick={() => {
                        setStartedBooking(false);
                        handleBooking();
                      }}
                      className="flex-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                    >
                      {booking ? 'Booking...' : 'Book This Placement'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-center py-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full bg-green-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="green"
                    className="w-8 h-8 size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">Request Sent!</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Your request to book this ad slot has been sent successfully.
                </p>
                <Link
                  href="/marketplace"
                  className="text-(--color-primary) font-bold text-sm hover:underline"
                >
                  Back to Marketplace
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
