import { useState } from 'react';
import { bookAdSlot, unbookAdSlot } from '@/lib/actions';
import { set } from 'better-auth';

export function AdSlotBookingCard({
  adSlotId,
  sponsorId,
}: {
  adSlotId: string;
  sponsorId: string;
}) {
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

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
      <div className="sticky rounded-lg bg-(--color-foreground) border border-slate-200 top 24 overflow-hidden"></div>
    </>
  );
}
