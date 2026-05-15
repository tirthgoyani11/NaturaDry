const fs = require('fs');
let cssStr = fs.readFileSync('C:/Users/PCS/Downloads/NaturaDry/styles.css', 'utf8');

// 1. Truncate bad UTF-16 bytes at end
let lastMedia = cssStr.lastIndexOf('@media (max-width: 600px)');
if (lastMedia !== -1) {
    let sub = cssStr.substring(lastMedia);
    let firstBrace = sub.indexOf('}');
    let secondBrace = sub.indexOf('}', firstBrace + 1);
    if (secondBrace !== -1) {
        cssStr = cssStr.substring(0, lastMedia + secondBrace + 1);
    }
}

// 2. Fix the unclosed bracket for particle-dust
cssStr = cssStr.replace(/\.particle-dust\s*\{\s*\/\*\s*Scroll indicator\s*\*\//, '/* Scroll indicator */');

// 3. Update timeline-line accurately
cssStr = cssStr.replace(/\.timeline-line\s*\{\s*position:\s*absolute;\s*top:\s*24px;[^}]+z-index:\s*-1;\s*\}/, `.timeline-line {
    position: absolute;
    top: 24px;
    left: 5%;
    right: 5%;
    height: 1px;
    z-index: -1;
    overflow: hidden;
}

.timeline-line-inner {
    width: 0%;
    height: 100%;
    background-image: linear-gradient(to right, var(--color-accent-primary) 50%, transparent 50%);
    background-size: 15px 100%;
    transition: width 2.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}`);

// 4. Append correctly in UTF-8
cssStr += `\n
/* Scroll Animations & Cursor */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    background-color: var(--color-accent-primary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
    mix-blend-mode: difference;
}

.custom-cursor.cursor-hover {
    width: 32px;
    height: 32px;
    background-color: rgba(212, 144, 10, 0.4);
}`;

fs.writeFileSync('C:/Users/PCS/Downloads/NaturaDry/styles.css', cssStr);
