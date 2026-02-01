import { useState } from 'react';

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

  return (
    <>
      <div className="sticky rounded-lg bg-(--color-foreground) border border-slate-200 top 24 overflow-hidden"></div>
    </>
  );
}
