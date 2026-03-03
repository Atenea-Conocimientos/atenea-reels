import { Composition } from 'remotion';
import { AteneaReel, ateneaReelSchema, layoutSchema } from './AteneaReel';
import './style.css';

// Default layout — edit these in Remotion Studio, then export the JSON
const defaultLayout = layoutSchema.parse({});  // all schema defaults

const defaultProps = ateneaReelSchema.parse({
  videoFilename: 'sample.mp4', // drop a test video in public/sample.mp4
  title: '¿Cómo pasé mi entrevista?',
  layout: defaultLayout,
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Main Reel — 1080×1920 9:16 (Reels / TikTok / Shorts) ── */}
      <Composition
        id="AteneaReel"
        component={AteneaReel}
        schema={ateneaReelSchema}
        durationInFrames={60 * 30}   // 60 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
