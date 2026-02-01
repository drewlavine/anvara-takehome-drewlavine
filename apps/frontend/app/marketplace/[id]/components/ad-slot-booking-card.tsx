import { useState } from 'react';
import { bookAdSlot, unbookAdSlot } from '@/lib/actions';
import { set } from 'better-auth';
import Link from 'next/link';

export function AdSlotBookingCard({
  adSlotId,
  sponsorId,
  monthlyCost
}: {
  adSlotId: string;
  sponsorId: string;
  monthlyCost: number
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

  const handleUnbooking = async () => {
    if (!adSlotId) return;

    try {
      const result = await unbookAdSlot(adSlotId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to unbook');
      }

      setBookingSuccess(false);

    } catch (error) {
      console.log('Failed to unbook:', error);
      setBookingError(error instanceof Error ? error.message : 'Failed to unbook');

    }
  }



  return (
    <>
      <div className="sticky rounded-lg bg-(--color-foreground) border border-slate-200 top-24 p-6 overflow-hidden">

        <div className="border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">

            <h3 className="text-md font-semibold uppercase text-slate-900">Starting Price</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-(--color-primary) font-semibold text-xl">${Number(monthlyCost).toLocaleString("en-US")}
                <span className="text-slate-500 text-sm font-medium">/mo</span>
              </span>
          </div>
        </div>

        <div className="pb-0 p-6 space-y-6">
          {bookingSuccess ? (
            <>

            </>
          ) : (
            <>
              <div className="text-center py-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full bg-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-8 h-8 size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">Request Sent!</h3>
                <p className="text-slate-500 text-sm mb-4">Your request to book this ad slot has been sent successfully.</p>
                <Link
                  href="/marketplace"
                  className="text-(--color-primary) font-bold text-sm hover:underline"
                >Back to Marketplace</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
