import { Composition } from 'remotion';
import { AteneaReel } from './AteneaReel';
import './style.css';

// Example subtitles for testing
const exampleSubtitles = [
  { start: 0, end: 3, text: 'Bienvenidos a Atenea Conocimientos' },
  { start: 3, end: 6, text: 'Hoy vamos a hablar de testing' },
  { start: 6, end: 10, text: 'y cómo automatizar tus pruebas' },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main Reel composition - 9:16 vertical (Instagram/TikTok) */}
      <Composition
        id="AteneaReel"
        component={AteneaReel}
        durationInFrames={60 * 30} // 60 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoFilename: 'sample.mp4', // Put a sample video in public/sample.mp4 for testing
          title: '¿Por qué tus tests siempre fallan? 🔥',
          subtitles: exampleSubtitles,
        }}
      />

      {/* YouTube Shorts variant */}
      <Composition
        id="AteneaShort"
        component={AteneaReel}
        durationInFrames={60 * 30} // 60 seconds max for Shorts
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoFilename: 'sample.mp4', // Put a sample video in public/sample.mp4 for testing
          title: 'Testing automatizado 101 💡',
          subtitles: exampleSubtitles,
        }}
      />
    </>
  );
};
