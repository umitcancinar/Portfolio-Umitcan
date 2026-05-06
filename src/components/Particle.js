import React, { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function Particle() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
        },
      },
      color: {
        value: ["#8b3fd9", "#f472b6", "#60a5fa", "#22d3ee"],
      },
      links: {
        enable: false,
      },
      move: {
        enable: true,
        direction: "none",
        speed: { min: 0.1, max: 0.3 },
        outModes: {
          default: "bounce",
        },
        random: true,
        attract: {
          enable: true,
          rotate: {
            x: 600,
            y: 600,
          },
        },
      },
      size: {
        value: { min: 1, max: 2 },
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0.5,
          sync: false,
        },
      },
      opacity: {
        value: { min: 0.1, max: 0.8 },
        animation: {
          enable: true,
          speed: 0.8,
          minimumValue: 0.05,
          sync: false,
        },
      },
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 0.5,
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.15,
            color: "#8b3fd9",
          },
        },
        push: {
          quantity: 2,
        },
      },
    },
    detectRetina: true,
    fpsLimit: 60,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

export default Particle;
