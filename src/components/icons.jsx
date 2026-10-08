function Svg({ children, className = 'h-5 w-5', filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const SearchIcon = ({ className }) => (
  <Svg className={className}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></Svg>
);
export const CompassIcon = ({ className }) => (
  <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z" fill="currentColor" stroke="none" /></Svg>
);
export const MapPinIcon = ({ className }) => (
  <Svg className={className}><path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>
);
export const MapIcon = ({ className }) => (
  <Svg className={className}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></Svg>
);
export const StarIcon = ({ className = 'h-4 w-4' }) => (
  <Svg className={className} filled><path d="M12 2.5l2.9 6.2 6.8 1-4.9 4.8 1.2 6.8L12 18.1l-6 3.2 1.2-6.8L2.3 9.7l6.8-1z" /></Svg>
);
export const ArrowRightIcon = ({ className }) => (
  <Svg className={className}><line x1="4" y1="12" x2="20" y2="12" /><polyline points="13 5 20 12 13 19" /></Svg>
);
export const SunIcon = ({ className }) => (
  <Svg className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Svg>
);
export const CloudSunIcon = ({ className }) => (
  <Svg className={className}><circle cx="8" cy="8" r="3" /><path d="M8 2v1.5M2.5 8H4M4.2 4.2l1 1M11.8 4.2l-1 1" /><path d="M10 21h8.5a3.5 3.5 0 0 0 .6-6.9A5 5 0 0 0 9.4 15 2.8 2.8 0 0 0 10 21z" /></Svg>
);
export const CloudIcon = ({ className }) => (
  <Svg className={className}><path d="M17.5 18.5h-11a3.8 3.8 0 0 1-.7-7.5A6 6 0 0 1 17.4 9.6a4.2 4.2 0 0 1 .1 8.9z" /></Svg>
);
export const FogIcon = ({ className }) => (
  <Svg className={className}><path d="M5 10a4 4 0 0 1 .8-7.9A6 6 0 0 1 17.2 4 3.8 3.8 0 0 1 18 11.5" /><path d="M4 15h16M6 19h12" /></Svg>
);
export const RainIcon = ({ className }) => (
  <Svg className={className}><path d="M17.5 14.5h-11a3.8 3.8 0 0 1-.7-7.5A6 6 0 0 1 17.4 5.6a4.2 4.2 0 0 1 .1 8.9z" /><path d="M8 18l-1 2M12 18l-1 2M16 18l-1 2" /></Svg>
);
export const SnowIcon = ({ className }) => (
  <Svg className={className}><path d="M12 2v20M4 6l16 12M20 6L4 18" /></Svg>
);
export const StormIcon = ({ className }) => (
  <Svg className={className}><path d="M17.5 13.5h-11a3.8 3.8 0 0 1-.7-7.5A6 6 0 0 1 17.4 4.6a4.2 4.2 0 0 1 .1 8.9z" /><polygon points="12.5 13 9.5 18 12.5 18 11 22 15.5 16.5 12.8 16.5" fill="currentColor" stroke="none" /></Svg>
);
export const WindIcon = ({ className = 'h-4 w-4' }) => (
  <Svg className={className}><path d="M3 8h8.5a2.5 2.5 0 1 0-2.5-2.5M3 12h13.5a2.5 2.5 0 1 1-2.5 2.5M3 16h6a2 2 0 1 1-2 2" /></Svg>
);
export const DropletIcon = ({ className = 'h-4 w-4' }) => (
  <Svg className={className}><path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" /></Svg>
);
export const MountainIcon = ({ className }) => (
  <Svg className={className}><path d="M3 20L10 6l4 7 3-4 4 11H3z" /><path d="M10 6l1.7 3-1.7 1.5L8.3 9z" fill="currentColor" stroke="none" /></Svg>
);
export const ZapIcon = ({ className }) => (
  <Svg className={className}><polygon points="13 2 4.5 13.5 11 13.5 10 22 19.5 9.5 13 9.5" /></Svg>
);
export const SnowflakeIcon = ({ className }) => (
  <Svg className={className}><path d="M12 2v20M4 6l16 12M20 6L4 18M12 2l-2 2M12 2l2 2M12 22l-2-2M12 22l2-2" /></Svg>
);
export const WavesIcon = ({ className }) => (
  <Svg className={className}><path d="M2 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" /><path d="M2 13c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" /><path d="M2 18c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" /></Svg>
);
export const LandmarkIcon = ({ className }) => (
  <Svg className={className}><line x1="3" y1="21" x2="21" y2="21" /><path d="M5 21v-9M9.5 21v-9M14.5 21v-9M19 21v-9" /><polygon points="12 3 3.5 9.5 20.5 9.5" /></Svg>
);
export const SparklesIcon = ({ className }) => (
  <Svg className={className}><path d="M12 3l1.9 5.7 5.7 1.9-5.7 1.9L12 18.2l-1.9-5.7L4.4 10.6l5.7-1.9z" /><path d="M19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z" /></Svg>
);
export const CastleIcon = ({ className }) => (
  <Svg className={className}><path d="M4 21V10l1.5-.8V5.5h2.3v2.2h2V5.5h2.2v2.2h2V5.5h2.3v2.2h2V5.5h2.2v3.7L20 10v11H4z" /><path d="M10 21v-3.5a2 2 0 0 1 4 0V21" /></Svg>
);
export const GemIcon = ({ className }) => (
  <Svg className={className}><polygon points="6.5 3.5 17.5 3.5 22 9 12 20.5 2 9" /><path d="M2 9h20M12 20.5L8.5 9l2-5.5M12 20.5l3.5-11.5-2-5.5" /></Svg>
);
export const TreeIcon = ({ className }) => (
  <Svg className={className}><path d="M12 2.5l5 6.5h-3l4.5 6h-13L10 9H7z" /><line x1="12" y1="15" x2="12" y2="21.5" /></Svg>
);
export const LeafIcon = ({ className }) => (
  <Svg className={className}><path d="M5 19C5 10 12.5 5 20 4c-1 8-5.5 14.5-15 15z" /><path d="M5 19c3-6 7-10 12-12.5" /></Svg>
);
export const HeartIcon = ({ className }) => (
  <Svg className={className}><path d="M12 20s-7.5-4.7-9.3-9.2A5 5 0 0 1 12 6.5 5 5 0 0 1 21.3 10.8C19.5 15.3 12 20 12 20z" /></Svg>
);
export const UmbrellaIcon = ({ className }) => (
  <Svg className={className}><path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z" /><path d="M12 3v2.5M12 12v6.5a2.2 2.2 0 0 0 4.4 0" /></Svg>
);
export const BuildingIcon = ({ className }) => (
  <Svg className={className}><rect x="5" y="3.5" width="14" height="17" rx="1" /><path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M10 20.5v-3h4v3" /></Svg>
);
export const CameraIcon = ({ className }) => (
  <Svg className={className}><path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13.5" r="3.2" /></Svg>
);export const UtensilsIcon = ({ className }) => (
  <Svg className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></Svg>
);
export const FlagIcon = ({ className }) => (
  <Svg className={className}><path d="M5.5 21.5v-17" /><path d="M5.5 5H18l-2.8 3.8L18 12.5H5.5" /></Svg>
);
export const GlobeIcon = ({ className }) => (
  <Svg className={className}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" /></Svg>
);

const VIBE_ICONS = {
  Romantic: HeartIcon, Relaxing: UmbrellaIcon, Urban: BuildingIcon,
  Adventurous: MountainIcon, Cultural: LandmarkIcon, Chill: SnowflakeIcon,
  Busy: ZapIcon, Luxury: GemIcon, Nature: TreeIcon, Coastal: WavesIcon,
  Historic: CastleIcon, Festive: SparklesIcon, Peaceful: LeafIcon,
};

export function VibeIcon({ vibe, className = 'h-6 w-6' }) {
  const C = VIBE_ICONS[vibe] || SparklesIcon;
  return <C className={className} />;
}

export function WeatherIcon({ code, className = 'h-5 w-5' }) {
  if (code === 0 || code === 1) return <SunIcon className={className} />;
  if (code === 2) return <CloudSunIcon className={className} />;
  if (code === 3) return <CloudIcon className={className} />;
  if (code === 45 || code === 48) return <FogIcon className={className} />;
  if ([51, 53, 55].includes(code)) return <RainIcon className={className} />;
  if ([61, 63, 65, 80, 81, 82].includes(code)) return <RainIcon className={className} />;
  if ([71, 73, 75].includes(code)) return <SnowIcon className={className} />;
  if (code >= 95) return <StormIcon className={className} />;
  return <CloudSunIcon className={className} />;
}
