import { useState } from "react";
import { animated, Transition, useTransition, easings, useSpring } from "react-spring";
import "../assets/IntroOverlay.sass";
import { TutorialOne } from "./tutorial/TutorialOne";

export function IntroOverlay() {
  const [overlayHide, setOverlayHide] = useState(false);
  const [overlayTwoVisible, setOverlayTwoVisible] = useState(false);
  
  const transitionOverlayOne = useTransition(true, {
    from: {opacity: 1, y: 0},
    enter: {opacity: 1, y: window.innerHeight * -1.5},
    config: {duration: 1500, easing: easings.easeInOutExpo},
    delay: 1500,
    onRest: ()=> setOverlayTwoVisible(true)
  });
  const transitionBigTitle = useTransition(true, {
    from: {opacity: 1, scale: 1, y: 0},
    enter: {opacity: 0, scale: 3, y: window.innerHeight * 0.5},
    config: {duration: 1500},
    delay: 1500
  });
  const styleOverlay = useSpring({
    opacity: overlayHide ? 0: 1,
    y: overlayHide ? window.innerHeight * -1.5: 0,
    config: {duration: 1500, easing: easings.easeInOutExpo},
    delay: 200
  });

  const overlayTwoSlideIn = useSpring({
    opacity: overlayTwoVisible ? 1: 0,
    y: overlayTwoVisible ? 0 : -100,
    config: {duration: 1000, easing: easings.easeInOutExpo},
  });

  const tutorialSlides = [<TutorialOne />]
  return (
        <animated.div style={styleOverlay} className="intro-overlay">
          
          {transitionOverlayOne((style)=> <animated.div style={style} className="inner-overlay overlay-one d-flex justify-content-center align-items-center">
            {transitionBigTitle((styleBT) =><animated.p style={styleBT} className="bigtitle h1 fw-bolder">The Game</animated.p>)}
          </animated.div>)}

          {overlayTwoVisible ? 
          <div className="inner-overlay overlay-two d-flex flex-column">
            <div className="overlay-header container-fluid d-flex flex-column justify-between p-4">
              <animated.p style={overlayTwoSlideIn} className="h1 fw-bolder">How does it works?</animated.p>
              <animated.p style={overlayTwoSlideIn} className="h3">A short tutorial</animated.p>
            </div>
            <div className="overlay-main p-4 container">
              <div className="tutorial">
               {tutorialSlides.map(slide => <div className="tutorial-slide">{slide}</div>)}
              </div>

            </div>
            <div className="overlay-footer container-fluid d-flex justify-content-end mt-auto p-4">
              <button className="btn btn-primary" onClick={()=>setOverlayHide(true)}>
                Skip tutorial
              </button>
            </div>
          </div>
          :"" }
        </animated.div>
    );
}