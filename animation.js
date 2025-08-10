/**
 * Animation Module - Handles all UI animations and transitions
 * Provides smooth page transitions, progress bar animations, and micro-interactions
 */

class AnimationManager {
    constructor() {
        this.transitionDuration = 350; // Matches CSS --transition-slow
        this.easing = 'ease-in-out';
    }

    /**
     * Animate page transition
     */
    async animatePageTransition(currentPageElement, nextPageElement, direction = 'next') {
        if (currentPageElement) {
            currentPageElement.style.transition = `opacity ${this.transitionDuration}ms ${this.easing}, transform ${this.transitionDuration}ms ${this.easing}`;
            currentPageElement.style.opacity = '0';
            currentPageElement.style.transform = `translateX(${direction === 'next' ? '-50px' : '50px'})`;
            currentPageElement.classList.remove('active');
            await this.delay(this.transitionDuration);
            currentPageElement.style.display = 'none';
        }

        if (nextPageElement) {
            nextPageElement.style.transition = `opacity ${this.transitionDuration}ms ${this.easing}, transform ${this.transitionDuration}ms ${this.easing}`;
            nextPageElement.style.display = 'block';
            nextPageElement.style.opacity = '0';
            nextPageElement.style.transform = `translateX(${direction === 'next' ? '50px' : '-50px'})`;
            
            // Force reflow to ensure animation starts from initial state
            void nextPageElement.offsetWidth; 

            nextPageElement.style.opacity = '1';
            nextPageElement.style.transform = 'translateX(0)';
            nextPageElement.classList.add('active');
            await this.delay(this.transitionDuration);
            nextPageElement.style.transition = ''; // Clear transition after animation
            nextPageElement.style.transform = ''; // Clear transform after animation
        }
    }

    /**
     * Animate progress bar
     */
    animateProgressBar(percentage) {
        const progressBarFill = document.getElementById('progress-fill');
        const progressPercentageText = document.getElementById('progress-percentage');
        
        if (progressBarFill) {
            progressBarFill.style.width = `${percentage}%`;
        }
        if (progressPercentageText) {
            progressPercentageText.textContent = `${percentage}%`;
        }
    }

    /**
     * Show loading overlay
     */
    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.style.opacity = '1';
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.addEventListener('transitionend', () => {
                overlay.classList.add('hidden');
            }, { once: true });
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        const successMessage = document.getElementById('success-message');
        const successText = successMessage ? successMessage.querySelector('.success-text') : null;
        
        if (successMessage && successText) {
            successText.textContent = message;
            successMessage.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        }
    }

    /**
     * Show auto-save indicator
     */
    showAutoSaveIndicator() {
        const indicator = document.getElementById('auto-save-indicator');
        if (indicator) {
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }
    }

    /**
     * Animate results score circle
     */
    animateScoreCircle(score) {
        const scoreNumber = document.getElementById('automation-score');
        if (scoreNumber) {
            let currentScore = 0;
            const interval = setInterval(() => {
                if (currentScore >= score) {
                    clearInterval(interval);
                    return;
                }
                currentScore++;
                scoreNumber.textContent = currentScore;
            }, 20); // Adjust speed as needed
        }
    }

    /**
     * Show tooltip
     */
    showTooltip(element, text) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.textContent = text;
            tooltip.classList.add('show');
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.transform = 'translateX(-50%)';
        }
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
        }
    }

    /**
     * Utility for delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
} else {
    window.AnimationManager = AnimationManager;
}