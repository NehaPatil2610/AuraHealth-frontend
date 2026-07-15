import React from 'react'

/**
 * AuraHealth — Minimalist geometric SVG brand mark.
 * A shield silhouette with an integrated pulse/heartbeat line,
 * rendered in emerald-500 (#059669) accent.
 *
 * @param {number} size - Icon dimension in px (default 32)
 * @param {string} className - Additional CSS classes
 */
export default function AuraHealthLogo({ size = 32, className = '' }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="AuraHealth Logo"
        >
            {/* Outer shield shape — rounded geometric form */}
            <path
                d="M24 4L8 12V22C8 33.05 14.84 43.22 24 46C33.16 43.22 40 33.05 40 22V12L24 4Z"
                fill="url(#shield-gradient)"
                fillOpacity="0.15"
                stroke="url(#shield-stroke)"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />

            {/* Inner pulse line — the heartbeat signature */}
            <path
                d="M12 26H18L21 20L24 32L27 22L29 26H36"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Top accent dot — status indicator */}
            <circle
                cx="24"
                cy="12"
                r="2"
                fill="#34d399"
            />

            {/* Gradient definitions */}
            <defs>
                <linearGradient id="shield-gradient" x1="24" y1="4" x2="24" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#059669" />
                    <stop offset="1" stopColor="#047857" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="shield-stroke" x1="24" y1="4" x2="24" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#059669" stopOpacity="0.2" />
                </linearGradient>
            </defs>
        </svg>
    )
}
