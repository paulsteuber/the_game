import { animated, useTransition } from "react-spring";
import "../assets/IntroOverlay.sass";

export function IntroOverlay() {

  return (
    <div className="intro-overlay">
      <h1>The Game</h1>
      <p>Kurz erklärt</p>
    </div>
  );
}