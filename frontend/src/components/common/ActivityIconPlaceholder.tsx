import React from 'react';
import {
  Landmark,
  Church,
  Castle,
  Building2,
  TreePine,
  Trees,
  Mountain,
  MountainSnow,
  Waves,
  Eye,
  UtensilsCrossed,
  Ship,
  ShoppingBag,
  ShoppingCart,
  Zap,
  Music,
  MapPin,
  Sparkles,
  Moon,
  Bird,
  Footprints,
  Palette,
  Flower2,
  Leaf,
  Coffee,
  Sunrise,
  type LucideIcon,
} from 'lucide-react';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export type IconComponent = React.ComponentType<IconProps> | LucideIcon;

// Custom Monochrome Outline SVG Icons matching Lucide aesthetic (24x24 viewBox, stroke-width=1.5, stroke="currentColor", fill="none")

export const HinduTempleIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M4 21v-2h16v2" />
    <path d="M6 19v-5h12v5M9 19v-4h6v4" />
    <path d="M6 14c1-3 3-6 6-9c3 3 5 6 6 9H6z" />
    <path d="M8 11.5h8M9.5 9h5" />
    <circle cx="12" cy="4" r="1" />
    <path d="M12 3V1M12 1l4 1.5L12 4" />
  </svg>
);

export const GurudwaraIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M4 21v-7h16v7" />
    <path d="M9.5 21v-4a2.5 2.5 0 0 1 5 0v4" />
    <path d="M7 14c0-4 2.2-7 5-7s5 3 5 7H7z" />
    <path d="M12 7V3.5M12 3.5l1.5 1M12 3.5l-1.5 1" />
    <path d="M4 14v-2c0-1.5 1-2.5 2-2.5s2 1 2 2.5v2M16 14v-2c0-1.5 1-2.5 2-2.5s2 1 2 2.5v2" />
  </svg>
);

export const MosqueIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M5 21v-9h14v9" />
    <path d="M6 12c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5H6z" />
    <path d="M12 6.5V3.5" />
    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    <path d="M3 21V8M21 21V8" />
    <path d="M2 8l1-2 1 2M20 8l1-2 1 2" />
  </svg>
);

export const IndoIslamicArchIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18M5 21V9M19 21V9" />
    <path d="M5 9c0-2.5 3.5-4 7-6c3.5 2 7 3.5 7 6" />
    <path d="M8 21v-7c0-2 2-3 4-4.5c2 1.5 4 2.5 4 4.5v7" />
    <path d="M12 3V1" />
  </svg>
);

export const AncientRuinsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h7M11 21h11" />
    <path d="M4 21V6M7 21V6M3 6h5M3 3h5v3H3z" />
    <path d="M15 21v-9M18 21v-12M14 12l2-2 3 1" />
    <path d="M10 19h2v2h-2zM12 16h3v2h-3z" />
  </svg>
);

export const StepwellIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="6" y="6" width="12" height="12" rx="1" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M3 3l3 3M21 3l-3 3M3 21l3-3M21 21l-3 3" />
  </svg>
);

export const StoneArchComplexIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M3 21V7l9-4l9 4v14" />
    <path d="M7 21v-7a5 5 0 0 1 10 0v7" />
    <path d="M3 11h4M17 11h4M3 15h4M17 15h4M9 3.7l3-1.3l3 1.3" />
  </svg>
);

export const HaveliIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18M4 21V8l8-4 8 4v13" />
    <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
    <path d="M8 11h8M8 14h8" />
    <path d="M10 7a2 2 0 0 1 4 0" />
  </svg>
);

export const PalaceExteriorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M3 21V10h18v11" />
    <path d="M8 10c0-3 1.8-5 4-5s4 2 4 5H8z" />
    <path d="M12 5V2" />
    <path d="M4 10V7.5C4 6.5 5 6 6 6s2 .5 2 1.5V10M16 10V7.5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5V10" />
    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
  </svg>
);

export const PalaceCourtyardIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M4 21V5M20 21V5M4 5h16" />
    <path d="M7 21v-9a5 5 0 0 1 10 0v9" />
    <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
    <path d="M12 18v3M10 18h4" />
  </svg>
);

export const MuseumExteriorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M3 21v-2h18v2M4 9h16" />
    <path d="M2 9l10-6l10 6H2z" />
    <path d="M6 9v10M10 9v10M14 9v10M18 9v10" />
  </svg>
);

export const MuseumInteriorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M2 3v18M22 3v18" />
    <rect x="5" y="6" width="7" height="8" rx="1" />
    <circle cx="8.5" cy="9" r="1" />
    <path d="M6 13l2-2l3 3" />
    <path d="M15 21v-7h4v7" />
    <path d="M17 14V9a2 2 0 0 0-2-2" />
    <circle cx="17" cy="7" r="1.5" />
  </svg>
);

export const TigerPawIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 11.5c-2.5 0-4.5 1.8-4.5 4c0 2.2 2 4.5 4.5 4.5s4.5-2.3 4.5-4.5c0-2.2-2-4-4.5-4z" />
    <ellipse cx="6" cy="9.5" rx="1.8" ry="2.2" transform="rotate(-20 6 9.5)" />
    <ellipse cx="9.8" cy="6.5" rx="1.8" ry="2.2" transform="rotate(-7 9.8 6.5)" />
    <ellipse cx="14.2" cy="6.5" rx="1.8" ry="2.2" transform="rotate(7 14.2 6.5)" />
    <ellipse cx="18" cy="9.5" rx="1.8" ry="2.2" transform="rotate(20 18 9.5)" />
  </svg>
);

export const WildlifeLionIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a9 9 0 1 0 9 9 9 9 0 0 0-9-9z" />
    <path d="M12 5a6 6 0 1 0 6 6 6 6 0 0 0-6-6z" />
    <path d="M10 13a2 2 0 0 0 4 0v-1" />
    <path d="M11 11.5h2l-1 1.5z" />
    <circle cx="9.5" cy="9.5" r="0.8" fill={color} />
    <circle cx="14.5" cy="9.5" r="0.8" fill={color} />
  </svg>
);

export const WildlifeElephantIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 10c2-5-1-8-6-8S6 5 6 9v3" />
    <path d="M6 9C4 9 2.5 10.5 2.5 13S4 16 6 15" />
    <path d="M12 10v6c0 2 1.5 3 3 3s2.5-1 2.5-2.5v-1" />
    <path d="M10 15c-1 0-2-1-2-2.5V11" />
    <circle cx="10.5" cy="6.5" r="0.8" fill={color} />
  </svg>
);

export const TropicalSandyBeachIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 19c4 0 6-2 10-2s6 2 10 2" />
    <path d="M2 21c4 0 6-1 10-1s6 1 10 1" />
    <path d="M6 13c0-4.5 3-7 7-7s7 2.5 7 7H6z" />
    <path d="M13 6v11" />
    <path d="M9.5 13c.5-2.5 1.5-4 3.5-4" />
    <path d="M16.5 13c-.5-2.5-1.5-4-3.5-4" />
    <circle cx="5" cy="5" r="2" />
  </svg>
);

export const PalmLinedBeachIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 18c3 0 5-1.5 8-1.5s5 1.5 8 1.5 3-1.5 4-1.5" />
    <path d="M2 21c3 0 5-1 8-1s5 1 8 1 3-1 4-1" />
    <path d="M7 16.5C8 12 10 8 13 4" />
    <path d="M13 4c-3-1-5.5 0-6.5 1.5c2 1 4.5 1 5.5-.5z" />
    <path d="M13 4c1-3 3-4.5 4.5-4c0 2.5-1 4.5-2.5 5.5z" />
    <path d="M13 4c3-1 5.5 0 6 1.5c-2 1-4.5 1-5.5-.5z" />
    <path d="M13 4c0 3 1.5 4.5 3 5c.5-2.5 0-4.5-1.5-5z" />
  </svg>
);

export const MountainLakeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 14l5-8l4 5l4-7l5 10" />
    <path d="M6.5 9.5l2.5 1M14 6l2.5 3.5" />
    <path d="M2 18c3 0 4-1.5 7-1.5s4 1.5 7 1.5 4-1.5 6-1.5" />
    <path d="M4 21c3 0 4-1 6-1s3 1 6 1 3-1 4-1" />
  </svg>
);

export const ScenicValleyLakeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 15l6-9l4 4.5" />
    <path d="M22 15l-6-9l-3 3.5" />
    <path d="M2 17c5 0 7 2 10 2s5-2 10-2" />
    <path d="M2 21c5 0 7-1 10-1s5 1 10 1" />
    <path d="M12 10.5v4" />
  </svg>
);

export const DamIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 4h18l-2 12H5L3 4z" />
    <path d="M3 4c5 1.5 13 1.5 18 0" />
    <path d="M5 10c4 1 10 1 14 0" />
    <path d="M8 4v6M12 4v6M16 4v6" />
    <path d="M7 16v5M12 16v5M17 16v5" />
    <path d="M2 21c4 0 6-1 10-1s6 1 10 1" />
  </svg>
);

export const GhatIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4h5v4h5v4h5v4h5" />
    <path d="M2 20c2.5 0 3.5-1 6-1s3.5 1 6 1 3.5-1 6-1" />
    <path d="M2 17c2.5 0 3.5-1 6-1s3.5 1 6 1 3.5-1 6-1" />
  </svg>
);

export const WaterfallIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3h7v4H3zM14 3h7v4h-7z" />
    <path d="M6 7v10M9 7v9M12 7v11M15 7v10M18 7v9" />
    <path d="M2 20c2.5 0 3.5-1 6-1s3.5 1 6 1 3.5-1 6-1" />
  </svg>
);

export const CableCarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4l20 6" />
    <path d="M12 7v4" />
    <rect x="7" y="11" width="10" height="9" rx="2" />
    <path d="M7 15h10M10 11v4M14 11v4" />
  </svg>
);

export const HouseboatIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 17l2 3h16l2-3H2z" />
    <path d="M5 17v-6c0-1.5 1-2.5 2.5-2.5h9c1.5 0 2.5 1 2.5 2.5v6" />
    <path d="M7 8.5C8 6 10 5 12 5s4 1 5 3.5" />
    <path d="M2 21c2.5 0 3.5-1 6-1s3.5 1 6 1 3.5-1 6-1" />
  </svg>
);

export const ShikaraIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 16l3 3h15l2-5H4l-2 2z" />
    <path d="M7 14V9l5-2 5 2v5" />
    <path d="M2 21c2.5 0 3.5-1 6-1s3.5 1 6 1 3.5-1 6-1" />
  </svg>
);

export const StreetFoodIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 13h18M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    <path d="M7 13c0-3 2.2-5 5-5s5 2 5 5" />
    <path d="M9 4c0 1.5 1 2 1 3M12 3c0 1.5 1 2 1 4M15 4c0 1.5 1 2 1 3" />
  </svg>
);

export const ThaliIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="8" cy="8" r="2" />
    <circle cx="12" cy="6.5" r="2" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="12" cy="14" r="3" />
    <path d="M10.5 14h3" />
  </svg>
);

export const TropicalBackwaterLandscapeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 16c4 0 6-2 10-2s6 2 10 2" />
    <path d="M2 20c4 0 6-1.5 10-1.5s6 1.5 10 1.5" />
    <path d="M5 14c1-3 1.5-6 1.5-9" />
    <path d="M6.5 5C4.5 3.5 2.5 4 2 5c2 1.5 3.5 1 4.5 0z" />
    <path d="M6.5 5C8.5 3.5 10.5 4 11 5c-2 1.5-3.5 1-4.5 0z" />
    <path d="M6.5 5c0-2 1-3.5 2.5-3.5C8 3 7 4 6.5 5z" />
    <path d="M16 11.5l2 1h3l1-1h-6z" />
  </svg>
);

export const WhiteWaterRaftingIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 11c0-2.5 3-4.5 7-4.5s7 2 7 4.5s-3 4.5-7 4.5s-7-2-7-4.5z" />
    <path d="M8.5 11c0-1 1.5-2 3.5-2s3.5 1 3.5 2s-1.5 2-3.5 2s-3.5-1-3.5-2z" />
    <path d="M4 4l16 14" />
    <path d="M2.5 2.5l3 3" />
    <path d="M2 18.5c2.5 0 3.5-1.5 6-1.5s3.5 1.5 6 1.5 3.5-1.5 6-1.5" />
    <path d="M4 21.5c2.5 0 3.5-1 5.5-1s3 1 5.5 1" />
  </svg>
);

export const JetskiWatersportIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14l12-3l5 3l-4 2H3l1-2z" />
    <path d="M14 11l-3-4h-2" />
    <circle cx="11" cy="5" r="1.5" />
    <path d="M11 6.5l-2 3" />
    <path d="M2 18c3 0 4-1.5 7-1.5s4 1.5 7 1.5 4-1.5 6-1.5" />
    <path d="M1 15c2 0 3-1 4-1" />
  </svg>
);

export const DiyaFestivalIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14c0 4 3.5 7 8 7s8-3 8-7H4z" />
    <path d="M2 14h20" />
    <path d="M12 4c-2 3-2 6 0 8c2-2 2-5 0-8z" />
    <path d="M12 1.5v1M8.5 4l.8.8M15.5 4l-.8.8" />
  </svg>
);

export const CamelDunesIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 13v-4c0-1.5 1-2.5 2.5-2.5h1.5c1 0 1.8.8 1.8 1.8v.7c1-1.2 2.5-1.5 4-1c1.5.5 2.2 1.8 2.2 3.3v1.7" />
    <path d="M5.5 6.5V3.5c0-.8.7-1.5 1.5-1.5h2" />
    <path d="M4.5 13v5M7.5 13v5M13.5 13v5M16 13v5" />
    <path d="M16 11c1 .5 1.5 1.5 1.5 2.5" />
    <path d="M2 20c4.5 0 6.5-2 10.5-2s6.5 2 9.5 2" />
  </svg>
);

export const DesertSunsetIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 12a6 6 0 0 1 12 0" />
    <path d="M12 3v3M6 6l2 2M18 6l-2 2M3 12h3M18 12h3" />
    <path d="M2 14.5c5-3 10-1 13-2.5s4.5-1 7 0" />
    <path d="M2 18.5c4-2 8.5 0 12.5-1.5s4.5 1 7.5 0" />
    <path d="M2 22h20" />
  </svg>
);

export const WhiteSaltDesertIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="7" r="3.5" />
    <path d="M12 1.5v2M6 7H4M20 7h-2M7.8 2.8l1.4 1.4M16.2 2.8l-1.4 1.4" />
    <path d="M2 14h20" />
    <path d="M4 18h16" />
    <path d="M2 21h20" />
    <path d="M8 14v4M16 14v4M11 18v3" />
  </svg>
);

export const TraditionalDanceIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="4" r="1.8" />
    <path d="M13.8 3.5a1 1 0 0 1 1 1" />
    <path d="M6 8c2-2 4.5-2 6 1M18 6c-2 1-4.5 1-6 3" />
    <path d="M12 9v4" />
    <path d="M12 13L5 20c3.5 1.5 10.5 1.5 14 0L12 13z" />
  </svg>
);

export const ParagliderIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 10C3 5 7 3 12 3s9 2 9 7H3z" />
    <path d="M3 10l9 9M21 10l-9 9" />
    <circle cx="12" cy="20" r="1" />
  </svg>
);

export const RockCutCaveTempleIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21h20M3 21l3-12 5-6 6 4 4 14" />
    <path d="M8 21v-5a4 4 0 0 1 8 0v5" />
    <path d="M10 21v-4M14 21v-4" />
  </svg>
);

export const StupaIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18M5 21v-4h14v4" />
    <path d="M6 17c0-3.5 2.7-6 6-6s6 2.5 6 6H6z" />
    <path d="M10 11V7h4v4" />
    <path d="M12 7V3M10 3h4" />
  </svg>
);

// Map of all 72 Authoritative Concepts to Icons

const SUBCATEGORY_ICON_MAP: Record<string, IconComponent> = {
  // TEMPLES_RELIGIOUS (Four Hindu Temples must use HinduTempleIcon)
  TEMPLES_RELIGIOUS_NORTH: HinduTempleIcon,
  TEMPLES_RELIGIOUS_SOUTH: HinduTempleIcon,
  TEMPLES_RELIGIOUS_EAST: HinduTempleIcon,
  TEMPLES_RELIGIOUS_WEST: HinduTempleIcon,
  MONASTERIES_GOMPAS: StupaIcon,
  BUDDHIST_STUPAS: StupaIcon,
  MOSQUES_DARGAHS: MosqueIcon,
  CHURCHES_CATHEDRALS: Church,
  SIKH_GURUDWARA: GurudwaraIcon,

  // HERITAGE_ARCHITECTURE
  INDO_ISLAMIC_ARCH: IndoIslamicArchIcon,
  COLONIAL_ARCH: Building2,
  ANCIENT_RUINS: AncientRuinsIcon,
  HERITAGE_HAVELI: HaveliIcon,
  MONUMENT_MEMORIAL: Landmark,
  STONE_ARCH_COMPLEX: StoneArchComplexIcon,
  STEPWELL_VAV: StepwellIcon,

  // FORTS_PALACES
  HILL_FORT: Castle,
  STONE_FORT: Castle,
  COASTAL_FORT: Castle,
  PALACE_EXTERIOR: PalaceExteriorIcon,
  PALACE_COURTYARD: PalaceCourtyardIcon,

  // WILDLIFE_SAFARI
  TIGER_SAFARI: TigerPawIcon,
  JUNGLE_RESERVE: TreePine,
  WILDLIFE_LION: WildlifeLionIcon,
  WILDLIFE_ELEPHANT: WildlifeElephantIcon,
  WETLAND_BIRDS: Bird,

  // BEACHES_COASTAL
  TROPICAL_SANDY_BEACH: TropicalSandyBeachIcon,
  PALM_LINED_BEACH: PalmLinedBeachIcon,
  DRAMATIC_COASTAL_CLIFF: Mountain,
  SEASIDE_PROMENADE: Footprints,

  // MUSEUMS_GALLERIES
  MUSEUM_EXTERIOR: MuseumExteriorIcon,
  MUSEUM_INTERIOR: MuseumInteriorIcon,
  ART_GALLERY: Palette,

  // TREKKING_HIKING
  SNOW_HIMALAYAN_MOUNTAINS: MountainSnow,
  HIGH_ALTITUDE_ROCKY_TRAIL: Mountain,
  GREEN_HIMALAYAN_FOREST_TRAIL: Mountain,
  WESTERN_GHATS_TREK: Footprints,
  ROCKY_HILL_HIKE: Mountain,

  // LAKES_RIVERS
  MOUNTAIN_LAKE: MountainLakeIcon,
  SCENIC_VALLEY_LAKE: ScenicValleyLakeIcon,
  RIVER_WITH_BOAT: Ship,
  DAM_RESERVOIR: DamIcon,
  RIVERSIDE_GHAT: GhatIcon,

  // GARDENS_PARKS
  LUSH_CITY_PARK: Trees,
  FORMAL_MUGHAL_GARDEN: Flower2,
  TEA_PLANTATION: Leaf,
  COFFEE_PLANTATION: Coffee,

  // CAVES_ROCK_FORMATIONS
  ROCK_CUT_CAVE_TEMPLE: RockCutCaveTempleIcon,
  NATURAL_CANYON_GORGE: Mountain,
  DRAMATIC_ROCK_FORMATION: Mountain,

  // SCENIC_VIEWPOINTS
  MOUNTAIN_SUNRISE_VIEW: Sunrise,
  VALLEY_PANORAMA_VIEW: Eye,
  CABLE_CAR_ROPEWAY: CableCarIcon,

  // WATERFALLS
  TROPICAL_FOREST_WATERFALL: WaterfallIcon,
  TALL_WATERFALL: WaterfallIcon,
  MOUNTAIN_WATERFALL: WaterfallIcon,

  // FOOD_CULINARY
  STREET_FOOD_SCENE: StreetFoodIcon,
  TRADITIONAL_FOOD_THALI: ThaliIcon,
  RESTAURANT_FINE_DINING: UtensilsCrossed,

  // BACKWATERS_BOATING
  KERALA_HOUSEBOAT: HouseboatIcon,
  TRADITIONAL_SHIKARA_BOAT: ShikaraIcon,
  TROPICAL_BACKWATER_LANDSCAPE: TropicalBackwaterLandscapeIcon,

  // MARKETS_SHOPPING
  HANDICRAFT_TEXTILE_BAZAAR: ShoppingBag,
  VIBRANT_STREET_MARKET: ShoppingCart,

  // ADVENTURE_SPORTS
  WHITE_WATER_RAFTING: WhiteWaterRaftingIcon,
  PARAGLIDING_ADVENTURE: ParagliderIcon,
  COASTAL_WATERSPORT: JetskiWatersportIcon,

  // DESERT_DUNES
  GOLDEN_SAND_DUNES_CAMEL: CamelDunesIcon,
  DESERT_SUNSET_DUNES: DesertSunsetIcon,
  WHITE_SALT_DESERT_RANN: WhiteSaltDesertIcon,

  // CULTURAL_EXPERIENCES
  TRADITIONAL_DANCE_PERFORMANCE: TraditionalDanceIcon,
  CULTURAL_CEREMONY_FESTIVAL: DiyaFestivalIcon,
};

const CATEGORY_ICON_MAP: Record<string, IconComponent> = {
  sightseeing: Landmark,
  attraction: Landmark,
  food: UtensilsCrossed,
  shopping: ShoppingBag,
  culture: Music,
  entertainment: Sparkles,
  pilgrimage: HinduTempleIcon,
  spiritual: HinduTempleIcon,
  relaxation: Trees,
  adventure: Zap,
  nightlife: Moon,
  nature: Mountain,
};

const CATEGORY_COLORS: Record<string, [string, string]> = {
  sightseeing: ['#f0fdf4', '#16a34a'],
  attraction: ['#f0fdf4', '#16a34a'],
  food: ['#fff7ed', '#ea580c'],
  shopping: ['#fdf2f8', '#db2777'],
  culture: ['#faf5ff', '#9333ea'],
  entertainment: ['#fffbeb', '#d97706'],
  pilgrimage: ['#fef2f2', '#dc2626'],
  spiritual: ['#fef2f2', '#dc2626'],
  relaxation: ['#f0fdfa', '#0d9488'],
  adventure: ['#fefce8', '#ca8a04'],
  nightlife: ['#eef2ff', '#4f46e5'],
  nature: ['#ecfdf5', '#059669'],
};

const DEFAULT_COLORS: [string, string] = ['#f1f5f9', '#64748b'];

function getIconForActivity(subcategoryId?: string, category?: string): IconComponent {
  if (subcategoryId && SUBCATEGORY_ICON_MAP[subcategoryId]) {
    return SUBCATEGORY_ICON_MAP[subcategoryId];
  }
  if (category) {
    const key = category.trim().toLowerCase().replace(/[-_\s]/g, '');
    if (CATEGORY_ICON_MAP[key]) {
      return CATEGORY_ICON_MAP[key];
    }
  }
  return MapPin;
}

function getColorsForCategory(category?: string): [string, string] {
  if (category) {
    const key = category.trim().toLowerCase().replace(/[-_\s]/g, '');
    if (CATEGORY_COLORS[key]) {
      return CATEGORY_COLORS[key];
    }
  }
  return DEFAULT_COLORS;
}

interface ActivityIconPlaceholderProps {
  subcategoryId?: string;
  category?: string;
  className?: string;
  iconSize?: number;
}

const ActivityIconPlaceholder: React.FC<ActivityIconPlaceholderProps> = ({
  subcategoryId,
  category,
  className = '',
  iconSize = 24,
}) => {
  const IconComponent = getIconForActivity(subcategoryId, category);
  const [bgColor, iconColor] = getColorsForCategory(category);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        backgroundColor: bgColor,
        borderRadius: 'inherit',
      }}
    >
      <IconComponent size={iconSize} color={iconColor} strokeWidth={1.5} />
    </div>
  );
};

export { ActivityIconPlaceholder, getIconForActivity, getColorsForCategory };
export default ActivityIconPlaceholder;
