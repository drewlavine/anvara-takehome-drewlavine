'use client';

//own component, would normally pull this data from an api or would be in the api call for the ad slot
function DisplayStats() {
  return (
    <div className="grid grid-cols-2 gap-2 my-4">
      <div className="bg-blue-50/50 px-2 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2 transition-colors hover:border-blue-200">
        <div className="bg-white p-1 rounded-full shadow-sm text-blue-600">
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>{' '}
        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">340k</div>
          <div className="text-blue-600/80 text-[10px] uppercase font-bold tracking-wide">
            Monthly Visitors
          </div>
        </div>
      </div>
      <div className="bg-orange-50/50 p-2 rounded-xl border border-orange-100 flex items-center gap-3 transition-colors hover:border-orange-200">
        <div className="bg-white px-2 py-1.5 rounded-full shadow-sm text-orange-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
</svg>

        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">180k</div>
          <div className="text-orange-600/80 text-[10px] uppercase font-bold tracking-wide">
            Avg Clicks
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoStats() {
  return (
    <div className="grid grid-cols-2 gap-2 my-4">
      <div className="bg-blue-50/50 px-2 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2 transition-colors hover:border-blue-200">
        <div className="bg-white p-1 rounded-full shadow-sm text-blue-600">
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>{' '}
        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">250k</div>
          <div className="text-blue-600/80 text-[10px] uppercase font-bold tracking-wide">
            Subscribers
          </div>
        </div>
      </div>
      <div className="bg-orange-50/50 p-2 rounded-xl border border-orange-100 flex items-center gap-3 transition-colors hover:border-orange-200">
        <div className="bg-white px-2 py-1.5 rounded-full shadow-sm text-orange-600">
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
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>{' '}
        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">55k</div>
          <div className="text-orange-600/80 text-[10px] uppercase font-bold tracking-wide">
            Avg Views
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsletterStats() {
  return (
    <div className="grid grid-cols-2 gap-2 my-4">
      <div className="bg-blue-50/50 px-2 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2 transition-colors hover:border-blue-200">
        <div className="bg-white p-1 rounded-full shadow-sm text-blue-600">
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>{' '}
        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">78k</div>
          <div className="text-blue-600/80 text-[10px] uppercase font-bold tracking-wide">
            Subscribers
          </div>
        </div>
      </div>
      <div className="bg-orange-50/50 p-2 rounded-xl border border-orange-100 flex items-center gap-3 transition-colors hover:border-orange-200">
        <div className="bg-white px-2 py-1.5 rounded-full shadow-sm text-orange-600">
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
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>{' '}
        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">20k</div>
          <div className="text-orange-600/80 text-[10px] uppercase font-bold tracking-wide">
            Avg Readers
          </div>
        </div>
      </div>
    </div>
  );
}

// I had AI generate the SVG for this icon since I couldn't find a good free svg headphone icon
function PodcastStats() {
  return (
    <div className="grid grid-cols-2 gap-2 my-4">
      <div className="bg-blue-50/50 px-2 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2 transition-colors hover:border-blue-200">
        <div className="bg-white p-1 rounded-full shadow-sm text-blue-600">
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
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>{' '}
        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">50k</div>
          <div className="text-blue-600/80 text-[10px] uppercase font-bold tracking-wide">
            Subscribers
          </div>
        </div>
      </div>
      <div className="bg-orange-50/50 p-2 rounded-xl border border-orange-100 flex items-center gap-3 transition-colors hover:border-orange-200">
        <div className="bg-white px-2 py-1.5 rounded-full shadow-sm text-orange-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <rect x="4" y="12" width="4" height="6" rx="1" />
            <rect x="16" y="12" width="4" height="6" rx="1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 13.5A8 8 0 0 1 20 13.5" />
          </svg>
        </div>
        <div>
          <div className="text-slate-900 font-bold text-sm leading-tight">3k</div>
          <div className="text-orange-600/80 text-[10px] uppercase font-bold tracking-wide">
            Avg Listeners
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialInfo({ type }: { type: string }) {
  switch (type) {
    case 'DISPLAY':
      return <DisplayStats />;
    case 'VIDEO':
      return <VideoStats />;
    case 'NEWSLETTER':
      return <NewsletterStats />;
    case 'PODCAST':
      return <PodcastStats />;
    default:
      return null;
  }
}
