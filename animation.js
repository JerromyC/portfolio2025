document.addEventListener("DOMContentLoaded", () => {
    const shapeContainer = document.querySelector(".shape-container");
    const colors = ["rgba(255,0,60,0.5)", "rgba(0,170,255,0.5)", "rgba(220,220,220,0.4)"];
    const blobCount = 12;
    const minSize = 30;
    const maxSize = 60;
    const minDuration = 12; // slower
    const maxDuration = 20;

    function createBlob() {
        const size = minSize + Math.random() * (maxSize - minSize);
        const color = colors[Math.floor(Math.random() * colors.length)];

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.style.position = "absolute";
        svg.style.left = `${Math.random() * 100}%`;
        svg.style.top = `${shapeContainer.offsetHeight + size}px`; // start below screen

        // create amorphous blob path (same as before)
        const path = document.createElementNS(svgNS, "path");
        const points = [];
        const numPoints = 5;
        const center = size / 2;
        const radius = size / 2;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const r = radius * (0.7 + Math.random() * 0.6);
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            points.push([x, y]);
        }

        let d = `M ${points[0][0]} ${points[0][1]} `;
        for (let i = 1; i < points.length; i++) {
            const midX = (points[i][0] + points[i - 1][0]) / 2;
            const midY = (points[i][1] + points[i - 1][1]) / 2;
            d += `Q ${points[i - 1][0]} ${points[i - 1][1]} ${midX} ${midY} `;
        }
        const last = points[points.length - 1];
        const midX = (last[0] + points[0][0]) / 2;
        const midY = (last[1] + points[0][1]) / 2;
        d += `Q ${last[0]} ${last[1]} ${midX} ${midY} Z`;

        path.setAttribute("d", d);
        path.setAttribute("fill", color);
        svg.appendChild(path);
        shapeContainer.appendChild(svg);

        // animate upward
        const duration = minDuration + Math.random() * (maxDuration - minDuration);
        gsap.to(svg, {
            y: -shapeContainer.offsetHeight - size - 50,
            rotation: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.3 + Math.random() * 0.5,
            duration: duration,
            ease: "sine.inOut",
            onComplete: () => svg.remove()
        });

        // subtle pulsing
        const pulse = gsap.to(svg, {
            scale: `+=0.2`,
            opacity: `+=0.2`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            duration: 2 + Math.random() * 2
        });

        // --- INTERACTIVITY: pop on hover ---
        svg.addEventListener("mouseenter", () => {
            pulse.kill(); // stop pulsing animation
            gsap.to(svg, {
                scale: 2,         // enlarge like popping
                opacity: 0,
                duration: 0.4,
                ease: "power1.out",
                onComplete: () => svg.remove()
            });
        });
    }



    // spawn blobs gradually
    function spawnBlobs() {
        createBlob();
        setTimeout(spawnBlobs, 1000 + Math.random() * 2000); // stagger spawn
    }

    spawnBlobs();
});
