// Import GSAP and ScrollTrigger from CDN in the Webflow page settings
// Add these script tags to your project settings:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>

document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP and ScrollTrigger are available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(TextPlugin);
    
    // Initialize the animations
    initHeroAnimation();
    initMarqueeAnimation();
    initClientsMarqueeAnimation(); // Added clients marquee animation
  } else {
    console.error('GSAP or ScrollTrigger not loaded. Please add the required script tags.');
  }
});

function initHeroAnimation() {
  // Get the hero title and text span elements
  const heroTitle = document.querySelector('.hero_title');
  const textSpan = document.querySelector('.text-span');
  const heroTitleWrapper = document.querySelector('.hero_title_wrapper');
  const titleSpan = document.querySelector('.title_span');
  
  if (!heroTitle || !textSpan) {
    console.error('Hero title or text span not found');
    return;
  }
  
  // Create a timeline for the hero animations
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });
  
  // Set initial states - hide elements
  gsap.set([textSpan, heroTitle], { opacity: 0 });
  
  // Check if we have the new structure elements
  const usingNewStructure = heroTitleWrapper && titleSpan;
  
  // First animate the "LET'S MAKE IT" text - original animation speed
  tl.to(textSpan, {
    opacity: 1,
    duration: 0.8, // Original animation speed
    y: -10,
    ease: "back.out(1.7)"
  });
  
  // Extract the MOVE! text content based on structure
  let moveText = "";
  let targetElement = heroTitle;
  
  if (usingNewStructure) {
    // For new structure, we'll use the second hero_title element
    const heroTitles = document.querySelectorAll('.hero_title');
    if (heroTitles.length > 1) {
      targetElement = heroTitles[1];
    }
  }
  
  // Extract text from the target element
  for (let i = 0; i < targetElement.childNodes.length; i++) {
    if (targetElement.childNodes[i].nodeType === Node.TEXT_NODE) {
      moveText += targetElement.childNodes[i].nodeValue;
    }
  }
  moveText = moveText.trim();
  
  // If no direct text found, use the full text as fallback (minus the text-span content)
  if (!moveText) {
    moveText = targetElement.textContent.replace(textSpan.textContent, "").trim();
  }
  
  // Remove the text content (but keep the span)
  targetElement.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      targetElement.removeChild(node);
    }
  });
  
  // Make heroTitle visible
  tl.set(heroTitle, { opacity: 1 });
  
  // Create a wrapper for the MOVE! text that maintains the original width
  const moveTextWrapper = document.createElement('div');
  moveTextWrapper.style.display = 'inline-block';
  moveTextWrapper.style.width = 'auto';
  moveTextWrapper.style.textAlign = 'left';
  targetElement.appendChild(moveTextWrapper);
  
  // Create spans for each letter
  const letters = [];
  for (let i = 0; i < moveText.length; i++) {
    const letterSpan = document.createElement('span');
    letterSpan.textContent = moveText[i];
    letterSpan.style.display = 'inline-block';
    letterSpan.style.opacity = '0';
    // Minimal letter spacing to maintain original text width
    letterSpan.style.letterSpacing = '0';
    letterSpan.style.padding = '0';
    moveTextWrapper.appendChild(letterSpan);
    letters.push(letterSpan);
  }
  
  // Animate each letter with a staggered, bouncy effect - slower animation
  letters.forEach((letter, index) => {
    tl.to(letter, {
      opacity: 1,
      scale: 1.02,
      duration: 0.4, // Slowed down animation
      ease: "elastic.out(1.2, 0.5)",
      onComplete: () => {
        // Add a small bounce effect - slower animation
        gsap.to(letter, {
          y: -5,
          duration: 0.2, // Slowed down animation
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      }
    }, `>-0.12`); // Slowed down stagger
  });
  
  // Add a final bounce to the entire MOVE! text - slower animation
  tl.to(moveTextWrapper, {
    scale: 1.02,
    duration: 0.3, // Slowed down animation
    ease: "power2.out",
    yoyo: true,
    repeat: 1
  }, ">-0.15");
  
  // No glow effect as per user request
}

function initMarqueeAnimation() {
  // Get the logos container
  const logosContainer = document.querySelector('.hero_logos-container');
  
  if (!logosContainer) {
    console.error('Hero logos container not found');
    return;
  }
  
  // Clone the logos to create a seamless loop
  // We'll duplicate the content to ensure continuous scrolling
  const originalLogos = Array.from(logosContainer.children);
  originalLogos.forEach(logo => {
    const clone = logo.cloneNode(true);
    logosContainer.appendChild(clone);
  });
  
  // Set the initial position
  gsap.set(logosContainer, { x: 0 });
  
  // Calculate the width of a single set of logos
  // This will be the distance we need to move for a complete loop
  const containerWidth = logosContainer.scrollWidth / 2;
  
  // Create the base animation - a continuous loop with faster speed
  const baseSpeed = 100; // seconds for one complete loop (faster than before)
  const marqueeAnimation = gsap.to(logosContainer, {
    x: -containerWidth,
    duration: baseSpeed,
    ease: "none",
    repeat: -1, // infinite repeat
    // When the animation completes one cycle, jump back to start
    onRepeat: () => {
      gsap.set(logosContainer, { x: 0 });
    }
  });
  
  // Optional: Pause animation when not in viewport to save resources
  ScrollTrigger.create({
    trigger: '.hero_logos',
    start: 'top bottom',
    end: 'bottom top',
    markers: false,
    onEnter: () => marqueeAnimation.play(),
    onLeave: () => marqueeAnimation.pause(),
    onEnterBack: () => marqueeAnimation.play(),
    onLeaveBack: () => marqueeAnimation.pause()
  });
}

function initClientsMarqueeAnimation() {
  // Get the clients logos container
  const clientsLogosContainer = document.querySelector('.clients_logos-container');
  
  if (!clientsLogosContainer) {
    console.error('Clients logos container not found');
    return;
  }
  
  // Clone the logos to create a seamless loop
  // We'll duplicate the content to ensure continuous scrolling
  const originalClientLogos = Array.from(clientsLogosContainer.children);
  originalClientLogos.forEach(logo => {
    const clone = logo.cloneNode(true);
    clientsLogosContainer.appendChild(clone);
  });
  
  // Set the initial position
  gsap.set(clientsLogosContainer, { x: 0 });
  
  // Calculate the width of a single set of logos
  // This will be the distance we need to move for a complete loop
  const containerWidth = clientsLogosContainer.scrollWidth / 2;
  
  // Create the base animation - a continuous loop with slightly different speed
  const baseSpeed = 120; // seconds for one complete loop (slightly slower than hero logos)
  const clientsMarqueeAnimation = gsap.to(clientsLogosContainer, {
    x: -containerWidth,
    duration: baseSpeed,
    ease: "none",
    repeat: -1, // infinite repeat
    // When the animation completes one cycle, jump back to start
    onRepeat: () => {
      gsap.set(clientsLogosContainer, { x: 0 });
    }
  });
  
  // Optional: Pause animation when not in viewport to save resources
  ScrollTrigger.create({
    trigger: '.clients_logo',
    start: 'top bottom',
    end: 'bottom top',
    markers: false,
    onEnter: () => clientsMarqueeAnimation.play(),
    onLeave: () => clientsMarqueeAnimation.pause(),
    onEnterBack: () => clientsMarqueeAnimation.play(),
    onLeaveBack: () => clientsMarqueeAnimation.pause()
  });
}