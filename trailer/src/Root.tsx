import { Composition } from 'remotion';
import { Trailer } from './Trailer';
import { FPS, TOTAL } from './shots';

export const Root = () => <Composition id="Trailer" component={Trailer} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{ bgm: true }} />;
