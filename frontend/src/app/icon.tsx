import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090909",
          borderRadius: 6,
        }}
      >
        <svg width="20" height="25" viewBox="0 0 32 40" fill="none">
          <path d="M4 16 H28 L16 38 Z" fill="#F5F5F0" />
          <rect x="10" y="2" width="12" height="15" fill="#C9A24A" />
          <line x1="16" y1="17" x2="16" y2="32" stroke="#090909" strokeWidth="1.6" />
        </svg>
      </div>
    ),
    size,
  );
}
