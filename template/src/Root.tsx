import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { Cover } from "./Cover";
import { DURATION } from "./script";

export const Root: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={DURATION * 30} fps={30} width={1920} height={1080} />
    <Composition id="CoverH" component={Cover} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="CoverH43" component={Cover} durationInFrames={1} fps={30} width={1440} height={1080} />
    <Composition id="CoverV" component={Cover} durationInFrames={1} fps={30} width={1080} height={1440} />
  </>
);
