import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #ff1a40 0%, #ff0033 50%, #d60029 100%)',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 2px 6px rgba(255, 0, 51, 0.4)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 8.2C7 7.2 7.9 6.5 8.9 6.8L12.7 7.9C13.5 8.1 14 8.8 14 9.6V18.4C14 19.2 13.5 19.9 12.7 20.1L8.9 21.2C7.9 21.5 7 20.8 7 19.8V8.2Z"
            fill="#ffffff"
          />
          <path
            d="M16 9.4C16 8.5 17 8.0 17.7 8.5L22.8 12.3C23.4 12.8 23.4 13.7 22.8 14.1L17.7 17.9C17 18.4 16 17.9 16 17.0V9.4Z"
            fill="#ffffff"
          />
          <circle cx="10.5" cy="14" r="1.2" fill="#ff0033" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
