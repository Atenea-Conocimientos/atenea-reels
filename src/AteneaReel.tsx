import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

interface SubtitleCue {
  start: number; // in seconds
  end: number;
  text: string;
}

interface AteneaReelProps {
  videoFilename: string; // filename in public/ folder (e.g., "cm_abc123.mp4")
  title: string;
  subtitles?: SubtitleCue[];
}

// Atenea brand colors
const COLORS = {
  purple: '#8B5CF6',
  darkPurple: '#0f0a1f',
  cyan: '#06B6D4',
  pink: '#EC4899',
  white: '#FFFFFF',
};

// Font stack that guarantees emoji rendering in Chromium (Windows + cross-platform)
const EMOJI_FONT = "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";

export const AteneaReel: React.FC<AteneaReelProps> = ({
  videoFilename,
  title,
  subtitles = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;
  
  // Load video from public/ folder using dynamic filename
  const videoSrc = staticFile(videoFilename);

  // Find current subtitle
  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  return (
    <AbsoluteFill className="bg-gradient-to-b from-[#1a0a2e] to-[#0f0a1f]">
      {/* Blurred background video */}
      <AbsoluteFill style={{ filter: 'blur(30px)', transform: 'scale(1.3)' }}>
        <Video
          src={videoSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* Dark overlay for better contrast */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(15, 10, 31, 0.5)',
        }}
      />

      {/* Content container */}
      <AbsoluteFill className="flex flex-col items-center justify-between py-16 px-8">
        {/* Title section */}
        <div
          className="text-center px-4 py-6 rounded-2xl max-w-[90%]"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h1
            className="text-4xl font-bold leading-tight"
            style={{
              color: COLORS.white,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              fontFamily: EMOJI_FONT,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Main video */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: '95%',
            maxHeight: '60%',
            boxShadow: `0 0 40px ${COLORS.purple}40`,
          }}
        >
          <Video
            src={videoSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
          
          {/* Neon border effect */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              border: `2px solid ${COLORS.purple}`,
              boxShadow: `inset 0 0 20px ${COLORS.purple}30`,
            }}
          />
        </div>

        {/* Subtitles section */}
        <div className="h-24 flex items-center justify-center w-full">
          {currentSubtitle && (
            <div
              className="text-center px-6 py-3 rounded-xl max-w-[95%]"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(5px)',
              }}
            >
              <p
                className="text-2xl font-semibold"
                style={{
                  color: COLORS.white,
                  textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
                  fontFamily: EMOJI_FONT,
                }}
              >
                {currentSubtitle.text}
              </p>
            </div>
          )}
        </div>

        {/* Branding */}
        <div className="flex items-center gap-3">
          {/* Logo placeholder - replace with actual logo */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`,
            }}
          >
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span
            className="text-xl font-medium"
            style={{
              color: COLORS.cyan,
              textShadow: `0 0 10px ${COLORS.cyan}50`,
            }}
          >
            ateneaconocimientos.com
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
