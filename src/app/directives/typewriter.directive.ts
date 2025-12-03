import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTypewriter]',
  standalone: true
})
export class TypewriterDirective implements OnInit, OnDestroy {
  @Input() appTypewriter: string = '';
  @Input() typewriterSpeed: number = 50; // milliseconds per character
  @Input() typewriterDelay: number = 0; // delay before starting (ms)
  @Input() typewriterCursor: boolean = true; // show blinking cursor
  @Input() typewriterTrigger: 'immediate' | 'scroll' = 'scroll'; // when to start

  private observer?: IntersectionObserver;
  private hasAnimated: boolean = false;
  private originalText: string = '';
  private cursorElement?: HTMLElement;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Get text content, preserving structure for HTML elements
    if (this.appTypewriter) {
      this.originalText = this.appTypewriter;
    } else {
      // Extract text content from element, preserving structure
      this.originalText = this.el.nativeElement.textContent?.trim() || '';
    }
    
    if (this.typewriterTrigger === 'immediate') {
      this.startTypewriter();
    } else {
      this.setupScrollObserver();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.cursorElement) {
      this.cursorElement.remove();
    }
  }

  private setupScrollObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // trigger when 30% of element is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          setTimeout(() => {
            this.startTypewriter();
          }, this.typewriterDelay);
          this.observer?.disconnect();
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private startTypewriter() {
    // Store the original HTML structure if it exists
    const originalHTML = this.el.nativeElement.innerHTML;
    const hasHTMLStructure = originalHTML.includes('<span') || originalHTML.includes('<div');
    
    // If there's HTML structure, we need to preserve it and type into text nodes
    if (hasHTMLStructure) {
      this.typeWithHTMLStructure();
    } else {
      this.typeSimpleText();
    }
  }

  private typeSimpleText() {
    // Clear the element content
    this.el.nativeElement.textContent = '';
    
    // Add cursor if enabled
    if (this.typewriterCursor) {
      this.cursorElement = this.renderer.createElement('span');
      this.renderer.addClass(this.cursorElement, 'typewriter-cursor');
      this.renderer.setStyle(this.cursorElement, 'display', 'inline-block');
      this.renderer.setStyle(this.cursorElement, 'width', '2px');
      this.renderer.setStyle(this.cursorElement, 'height', '1em');
      this.renderer.setStyle(this.cursorElement, 'background-color', 'currentColor');
      this.renderer.setStyle(this.cursorElement, 'margin-left', '2px');
      this.renderer.setStyle(this.cursorElement, 'animation', 'blink 1s infinite');
      if (this.cursorElement) {
        this.el.nativeElement.appendChild(this.cursorElement);
      }
    }

    let index = 0;
    const text = this.originalText;

    const type = () => {
      if (index < text.length) {
        this.el.nativeElement.textContent = text.substring(0, index + 1);
        if (this.cursorElement && !this.el.nativeElement.contains(this.cursorElement)) {
          this.el.nativeElement.appendChild(this.cursorElement);
        }
        index++;
        setTimeout(type, this.typewriterSpeed);
      } else {
        // Animation complete - remove cursor after a delay
        if (this.cursorElement) {
          setTimeout(() => {
            if (this.cursorElement) {
              this.cursorElement.remove();
              this.cursorElement = undefined;
            }
          }, 1000);
        }
      }
    };

    type();
  }

  private typeWithHTMLStructure() {
    // For HTML structures, we'll type the text content while preserving the HTML structure
    // Find all text nodes and type into the first one, or create a text node
    const text = this.originalText;
    
    // Clear existing text but preserve structure
    const spans = this.el.nativeElement.querySelectorAll('span');
    const textNodes: Text[] = [];
    
    // Find or create text nodes
    const walker = document.createTreeWalker(
      this.el.nativeElement,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }
    
    // If no text nodes found, create one
    if (textNodes.length === 0) {
      const textNode = document.createTextNode('');
      this.el.nativeElement.insertBefore(textNode, this.el.nativeElement.firstChild);
      textNodes.push(textNode);
    }
    
    // Add cursor
    if (this.typewriterCursor) {
      this.cursorElement = this.renderer.createElement('span');
      this.renderer.addClass(this.cursorElement, 'typewriter-cursor');
      this.renderer.setStyle(this.cursorElement, 'display', 'inline-block');
      this.renderer.setStyle(this.cursorElement, 'width', '2px');
      this.renderer.setStyle(this.cursorElement, 'height', '1em');
      this.renderer.setStyle(this.cursorElement, 'background-color', 'currentColor');
      this.renderer.setStyle(this.cursorElement, 'margin-left', '2px');
      this.renderer.setStyle(this.cursorElement, 'animation', 'blink 1s infinite');
      if (this.cursorElement) {
        this.el.nativeElement.appendChild(this.cursorElement);
      }
    }
    
    // Clear the first text node
    if (textNodes[0]) {
      textNodes[0].textContent = '';
    }
    
    let index = 0;
    const type = () => {
      if (index < text.length) {
        if (textNodes[0]) {
          textNodes[0].textContent = text.substring(0, index + 1);
        }
        if (this.cursorElement && !this.el.nativeElement.contains(this.cursorElement)) {
          this.el.nativeElement.appendChild(this.cursorElement);
        }
        index++;
        setTimeout(type, this.typewriterSpeed);
      } else {
        // Animation complete - remove cursor after a delay
        if (this.cursorElement) {
          setTimeout(() => {
            if (this.cursorElement) {
              this.cursorElement.remove();
              this.cursorElement = undefined;
            }
          }, 1000);
        }
      }
    };
    
    type();
  }
}

