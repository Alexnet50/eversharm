import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Background() {
    const particlesInit = async (main) => {  
        await loadFull(main);
      };    
    
      return (
        <Particles
          id="tsparticles"
          init={particlesInit}       
          options={{
            backgroundMode: {
              enable: true,
              zIndex: 0
            },
            background: {
            //   color: "rgba(72, 38, 255, 1)",
              image: "url(/images/background2.jpg)",
              size: "cover",
              opacity: 0.1
            },
            fpsLimit: 30,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onClick: { enable: true, mode: "repulse" },
                onHover: {
                  enable: true,
                  mode: "bubble",
                  parallax: { enable: false, force: 2, smooth: 10 }
                },
                resize: true
              },
              modes: {
                bubble: {
                  distance: 400,
                  duration: 0.3,
                  opacity: 1,
                  size: 4,
                  speed: 3
                },
                grab: { distance: 400, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 },
                repulse: { distance: 200, duration: 0.4 }
              }
            },
            particles: {
              color: { value: "#fff" },
              links: {
                color: "#ffffff",
                distance: 500,
                enable: false,
                opacity: 0.4,
                width: 2
              },
              move: {
                attract: { enable: false, rotateX: 600, rotateY: 1200 },
                direction: "top",
                enable: true,
                outMode: "out",
                random: false,
                size: true,
                speed: 4,
                straight: false
              },
              number: { density: { enable: true, area: 800 }, value: 50 },
              opacity: {
                random: true,
                value: 0.5
              },
              shape: {
                type: "circle"
              },
              size: {
                random: true,
                value: 10
              }
            },
            detectRetina: true
          }}
        />
      );
    }
    