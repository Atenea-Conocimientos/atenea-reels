import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { z } from 'zod';

// ─── Subtitle cue (passed from worker, not editable in Studio) ──────────────
interface SubtitleCue {
  start: number; // seconds
  end: number;
  text: string;
}

// ─── Layout config schema (editable in Remotion Studio) ─────────────────────
export const layoutSchema = z.object({
  // ── Title ──────────────────────────────────────────────────────────────────
  titleFontSize:        z.number().min(20).max(120).default(56),
  titleColor:           z.string().default('#FFFFFF'),
  titleBgColor:         z.string().default('rgba(0,0,0,0.70)'),
  titlePaddingX:        z.number().min(0).max(100).default(16),   // px
  titlePaddingY:        z.number().min(0).max(100).default(24),   // px
  titleBorderRadius:    z.number().min(0).max(60).default(16),    // px

  // ── Subtitles ──────────────────────────────────────────────────────────────
  subtitleFontSize:     z.number().min(16).max(80).default(36),
  subtitleColor:        z.string().default('#FFFFFF'),
  subtitleBgColor:      z.string().default('rgba(0,0,0,0.80)'),
  subtitleBorderRadius: z.number().min(0).max(40).default(12),

  // ── Main video frame ───────────────────────────────────────────────────────
  videoWidthPct:        z.number().min(50).max(100).default(95),  // % of container width
  videoMaxHeightPct:    z.number().min(30).max(80).default(60),   // % of container height
  videoBorderColor:     z.string().default('#8B5CF6'),
  videoBorderWidth:     z.number().min(0).max(10).default(2),
  videoBorderRadius:    z.number().min(0).max(40).default(16),
  videoGlowColor:       z.string().default('#8B5CF640'),

  // ── Background blur ────────────────────────────────────────────────────────
  bgBlurPx:             z.number().min(0).max(80).default(30),
  bgScaleX:             z.number().min(1).max(2).default(1.3),
  bgOverlayOpacity:     z.number().min(0).max(1).default(0.5),
  bgOverlayColor:       z.string().default('#0F0A1F'),

  // ── Branding ───────────────────────────────────────────────────────────────
  brandText:            z.string().default('ateneaconocimientos.com'),
  brandColor:           z.string().default('#06B6D4'),
  brandGlowOpacity:     z.number().min(0).max(1).default(0.5),
  brandLogoColor1:      z.string().default('#8B5CF6'),
  brandLogoColor2:      z.string().default('#06B6D4'),
  brandFontSize:        z.number().min(12).max(72).default(22),
  brandLogoSize:        z.number().min(20).max(120).default(40),  // px — width & height of the "A" circle

  // ── Vertical spacing ───────────────────────────────────────────────────────
  paddingTopPx:         z.number().min(0).max(200).default(64),
  paddingBottomPx:      z.number().min(0).max(200).default(64),
  paddingHorizPx:       z.number().min(0).max(120).default(32),
  subtitleAreaHeightPx: z.number().min(40).max(200).default(96),
});

export type LayoutConfig = z.infer<typeof layoutSchema>;

// ─── Full props schema (Studio renders these as controls) ────────────────────
export const ateneaReelSchema = z.object({
  videoFilename: z.string().default('sample.mp4'),
  title:         z.string().default('¿Cómo pasé mi entrevista?'),
  subtitles:     z.array(z.object({
    start: z.number(),
    end:   z.number(),
    text:  z.string(),
  })).default([
    { start: 0, end: 3, text: 'Este es un subtítulo de ejemplo' },
    { start: 3, end: 6, text: 'Aquí va otra línea de subtítulos' },
  ]),
  layout: layoutSchema,
});

export type AteneaReelProps = z.infer<typeof ateneaReelSchema>;

// ─── Component ───────────────────────────────────────────────────────────────
export const AteneaReel: React.FC<AteneaReelProps> = ({
  videoFilename,
  title,
  subtitles = [],
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;
  const l = layout; // shorthand

  const videoSrc = staticFile(videoFilename);

  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, #1a0a2e, ${l.bgOverlayColor})` }}>

      {/* ── Blurred background ── */}
      <AbsoluteFill style={{
        filter: `blur(${l.bgBlurPx}px)`,
        transform: `scale(${l.bgScaleX})`,
      }}>
        <Video src={videoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* ── Dark overlay ── */}
      <AbsoluteFill style={{ backgroundColor: `${l.bgOverlayColor}${Math.round(l.bgOverlayOpacity * 255).toString(16).padStart(2,'0')}` }} />

      {/* ── Main layout ── */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop:    l.paddingTopPx,
        paddingBottom: l.paddingBottomPx,
        paddingLeft:   l.paddingHorizPx,
        paddingRight:  l.paddingHorizPx,
      }}>

        {/* ── Title ── */}
        <div style={{
          textAlign: 'center',
          paddingLeft:  l.titlePaddingX,
          paddingRight: l.titlePaddingX,
          paddingTop:   l.titlePaddingY,
          paddingBottom:l.titlePaddingY,
          borderRadius: l.titleBorderRadius,
          maxWidth: '90%',
          backgroundColor: l.titleBgColor,
          backdropFilter: 'blur(10px)',
        }}>
          <h1 style={{
            color:      l.titleColor,
            fontSize:   l.titleFontSize,
            fontWeight: 700,
            lineHeight: 1.2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            margin: 0,
          }}>
            {title}
          </h1>
        </div>

        {/* ── Main video frame ── */}
        <div style={{
          position: 'relative',
          width:     `${l.videoWidthPct}%`,
          maxHeight: `${l.videoMaxHeightPct}%`,
          borderRadius: l.videoBorderRadius,
          overflow: 'hidden',
          boxShadow: `0 0 40px ${l.videoGlowColor}`,
        }}>
          <Video src={videoSrc} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          {/* Neon border */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            borderRadius: l.videoBorderRadius,
            border: `${l.videoBorderWidth}px solid ${l.videoBorderColor}`,
            boxShadow: `inset 0 0 20px ${l.videoGlowColor}`,
          }} />
        </div>

        {/* ── Subtitles ── */}
        <div style={{ height: l.subtitleAreaHeightPx, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {currentSubtitle && (
            <div style={{
              textAlign: 'center',
              paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12,
              borderRadius: l.subtitleBorderRadius,
              maxWidth: '95%',
              backgroundColor: l.subtitleBgColor,
              backdropFilter: 'blur(5px)',
            }}>
              <p style={{
                color: l.subtitleColor,
                fontSize: l.subtitleFontSize,
                fontWeight: 600,
                textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                margin: 0,
              }}>
                {currentSubtitle.text}
              </p>
            </div>
          )}
        </div>

        {/* ── Branding ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: l.brandLogoSize, height: l.brandLogoSize, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${l.brandLogoColor1}, ${l.brandLogoColor2})`,
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: Math.round(l.brandLogoSize * 0.45) }}>A</span>
          </div>
          <span style={{
            color: l.brandColor,
            fontSize: l.brandFontSize,
            fontWeight: 500,
            textShadow: `0 0 10px ${l.brandColor}${Math.round(l.brandGlowOpacity * 255).toString(16).padStart(2,'0')}`,
          }}>
            {l.brandText}
          </span>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
