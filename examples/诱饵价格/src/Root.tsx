import React from "react";
import { Composition } from "remotion";
import { FilmR } from "./FilmR";
import { DURATION } from "./script";

export const Root: React.FC = () => (
  <Composition id="FilmR" component={FilmR} durationInFrames={Math.round(DURATION * 30)} fps={30} width={1080} height={1920} />
);
