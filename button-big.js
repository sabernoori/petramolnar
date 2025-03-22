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
        backgroundColor: "var(--_colors---background)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      timeline.to(this.DOM.flair, {
        scale: 1,
        duration: 0.8,
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