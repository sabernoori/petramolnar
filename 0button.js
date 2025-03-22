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
      flair: el(".button__flair"),
      border: this.block.querySelector(':after') || this.block
    };

    this.xSet = gsap.quickSetter(this.DOM.flair, "xPercent");
    this.ySet = gsap.quickSetter(this.DOM.flair, "yPercent");

    // Initialize border color
    gsap.set(this.DOM.border, {
      borderColor: "#ffffff"
    });
  }

  getXY(e) {
    const { left, top, width, height } = this.DOM.button.getBoundingClientRect();
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

      // Animate flair and border on hover
      gsap.to(this.DOM.flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(this.DOM.border, {
        borderColor: "rgba(255, 255, 255, 0.07)",
        duration: 0.3,
        ease: "power2.out"
      });
    });

    this.DOM.button.addEventListener("mouseleave", (e) => {
      const { x, y } = this.getXY(e);
      gsap.killTweensOf(this.DOM.flair);

      // Reset flair and border color on mouse leave
      gsap.to(this.DOM.flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(this.DOM.border, {
        borderColor: "#ffffff",
        duration: 0.3,
        ease: "power2.out"
      });
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

// Initialize buttons
const buttonElements = document.querySelectorAll('[data-block="button"]');
buttonElements.forEach((buttonElement) => {
  new Button(buttonElement);
});