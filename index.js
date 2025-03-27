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
    
    // Check if we're on the homepage
    const isHomepage = window.location.pathname === '/' || 
                      window.location.pathname === '/home' || 
                      window.location.pathname.endsWith('/index.html') || 
                      window.location.pathname.endsWith('/');
    
    // Only initialize hero animation and disable scroll if hero elements exist
    const heroElements = document.querySelector('.hero_title') && 
                        document.querySelector('.text-span') && 
                        document.querySelector('.hero_title-little');
    
    if (isHomepage && heroElements) {
      // Disable scroll only if page loads at top and hero elements exist
      if (window.scrollY === 0) {
        document.body.style.overflow = 'hidden';
      }
      initHeroAnimation();
    }
    
    // Initialize other animations for all pages
    
    // Initialize the animations
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
  const heroTitleLittle = document.querySelector('.hero_title-little');
  const heroDescription = document.querySelector('.hero_description');
  const heroButton = document.querySelector('.hero_descriptions .button-big');
  
  if (!heroTitle || !textSpan || !heroTitleLittle) {
    console.error('Required hero elements not found');
    return;
  }
  
  // Create a timeline for the hero animations
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    }
  });
  
  // Set initial states - hide elements and position
  gsap.set([heroTitleLittle], { 
    opacity: 0,
    y: 100 // Start from below
  });
  
  // Set initial state for nav_container
  const navContainer = document.querySelector('.nav_container');
  if (navContainer) {
    gsap.set(navContainer, {
      opacity: 0,
      y: -50, // Start from above
      visibility: 'visible' // Keep in layout flow
    });
  }
  
  // Set initial state for hero description and button - keep in layout flow
  if (heroDescription) {
    gsap.set(heroDescription, {
      opacity: 0,
      y: 50, // Start from below
      visibility: 'visible' // Keep in layout flow
    });
  }
  
  if (heroButton) {
    gsap.set(heroButton, {
      opacity: 0,
      y: 50, // Start from below
      visibility: 'visible' // Keep in layout flow
    });
  }

  // Set initial state for hero logos
  const heroLogos = document.querySelector('.hero_logos');
  if (heroLogos) {
    gsap.set(heroLogos, {
      opacity: 0,
      y: 100, // Start from below
      visibility: 'visible' // Keep in layout flow
    });
  }
  
  // Check if we have the new structure elements
  const usingNewStructure = heroTitleWrapper && titleSpan;
  
  // First animate the "LET'S MAKE IT" text with slower, more dramatic animation
  tl.to(heroTitleLittle, {
    opacity: 1,
    duration: 0.7, // Slower animation
    y: -0, // More dramatic movement
    ease: "power.out" // Smoother easing
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
      scale: 1.04,
      duration: 0.3, // Slowed down animation
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
    scale: 1.1,
    duration: 0.3, // Slowed down animation
    ease: "power2.out",
    yoyo: true,
    repeat: 1
  }, ">-0.15");
  
  // Animate the hero description and button after the title animations complete
  if (heroDescription) {
    tl.to(heroDescription, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, ">0.1") // Start slightly after the previous animation
    .set(heroButton, { display: 'block' }, '<') // Show button at the start of description animation
    .to(heroButton, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "<0.1") // Start slightly after description starts
    .to(heroLogos, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)"
    }, "<0.2") // Start slightly after button animation starts
    .to(navContainer, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)"
    }, "<0"); // Start at the same time as logos
  }
  
  // No glow effect as per user request
  
  // Re-enable scrolling after all animations complete
  tl.eventCallback('onComplete', function() {
    document.body.style.overflow = '';
  });
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
  
  // Keep animation running when in viewport
  ScrollTrigger.create({
    trigger: '.hero_logos',
    start: '-100% bottom', // Start trigger earlier
    end: '200% top', // End trigger later
    markers: false,
    onEnter: () => marqueeAnimation.play(),
    onLeave: () => marqueeAnimation.pause(),
    onEnterBack: () => marqueeAnimation.play(),
    onLeaveBack: () => marqueeAnimation.pause()
  });
  
  // Ensure animation is playing when page loads
  marqueeAnimation.play();
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
  const baseSpeed = 60; // seconds for one complete loop (slightly slower than hero logos)
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
  
  // Keep animation running for clients section when in viewport
  ScrollTrigger.create({
    trigger: '.clients_logo',
    start: '-100% bottom', // Start trigger earlier
    end: '200% top', // End trigger later
    markers: false,
    onEnter: () => clientsMarqueeAnimation.play(),
    onLeave: () => clientsMarqueeAnimation.pause(),
    onEnterBack: () => clientsMarqueeAnimation.play(),
    onLeaveBack: () => clientsMarqueeAnimation.pause()
  });
}



//button GSAP animations on hover
class Button {
  constructor(buttonElement) {
    this.block = buttonElement;
    this.init();
    this.initEvents();
  }

  init() {
    const el = gsap.utils.selector(this.block);

    this.DOM = {
      button: this.block,
      flair: el(".button__flair")
    };

    this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
    this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");
  }

  getXY(e) {
    const {
      left,
      top,
      width,
      height
    } = this.DOM.button.getBoundingClientRect();

    const xTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, width, 0, 100),
      gsap.utils.clamp(0, 100)
    );

    const yTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, height, 0, 100),
      gsap.utils.clamp(0, 100)
    );

    return {
      x: xTransformer(e.clientX - left),
      y: yTransformer(e.clientY - top)
    };
  }

  initEvents() {
    this.DOM.button.addEventListener("mouseenter", (e) => {
      const { x, y } = this.getXY(e);

      this.xSet(x);
      this.ySet(y);

      const timeline = gsap.timeline();
      
      timeline.to(this.DOM.button, {
        borderColor: "rgba(255, 255, 255, 0.07)",
        duration: 0.3,
        ease: "power2.out"
      });
      timeline.to(this.DOM.flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3");
    });

    this.DOM.button.addEventListener("mouseleave", (e) => {
      const { x, y } = this.getXY(e);

      gsap.killTweensOf([this.DOM.flair, this.DOM.button]);

      const timeline = gsap.timeline();
      
      timeline.to(this.DOM.button, {
        borderColor: "#ffffff",
        duration: 0.3,
        ease: "power2.out"
      });
      
      timeline.to(this.DOM.flair, {
          xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
          yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
          scale: 0,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.3");
    });

    this.DOM.button.addEventListener("mousemove", (e) => {
      const { x, y } = this.getXY(e);

      gsap.to(this.DOM.flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2"
      });
    });
  }
}

// Initialize button animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    // Add flair element to each button
    const flair = document.createElement('div');
    flair.className = 'button__flair';
    button.appendChild(flair);
    
    // Initialize button animation
    new Button(button);
  });
});




class ButtonBig extends Button {
  constructor(buttonElement) {
    super(buttonElement);
  }

  init() {
    const el = gsap.utils.selector(this.block);
    this.DOM = {
      button: this.block,
      flair: el(".button-big__flair")
    };

    this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
    this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");

    // Initialize background color for big buttons
    gsap.set(this.DOM.button, {
      backgroundColor: "var(--_colors---brand)"
    });
  }

  initEvents() {
    this.DOM.button.addEventListener("mouseenter", (e) => {
      const { x, y } = this.getXY(e);
      this.xSet(x);
      this.ySet(y);

      const timeline = gsap.timeline();
      
      timeline.to(this.DOM.button, {
        backgroundColor: "var(--_colors---brand)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      timeline.to(this.DOM.flair, {
        scale: 1,
        duration: 0.5,
        ease: "power3.inOut",
        backgroundColor: "#000000"
      }, "-=0.3");
    });

    this.DOM.button.addEventListener("mouseleave", (e) => {
      const { x, y } = this.getXY(e);
      gsap.killTweensOf([this.DOM.flair, this.DOM.button]);

      const timeline = gsap.timeline();
      
      timeline.to(this.DOM.button, {
        backgroundColor: "var(--_colors---brand)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      timeline.to(this.DOM.flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3");
    });

    this.DOM.button.addEventListener("mousemove", (e) => {
      const { x, y } = this.getXY(e);
      gsap.to(this.DOM.flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2"
      });
    });
  }
}

// Initialize button-big animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const bigButtons = document.querySelectorAll('.button-big');
  bigButtons.forEach(button => {
    // Add flair element to each button
    const flair = document.createElement('div');
    flair.className = 'button-big__flair';
    button.appendChild(flair);
    
    // Initialize button animation
    new ButtonBig(button);
  });
});





