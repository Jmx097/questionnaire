/**
 * Questionnaire Main Logic - Orchestrates the entire questionnaire flow
 * Manages page navigation, form submission, data handling, and UI updates
 */

class Questionnaire {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 6;
        this.dataManager = new DataManager();
        this.validationManager = new ValidationManager();
        this.conditionalLogic = new ConditionalLogic();
        this.resultsGenerator = new ResultsGenerator();
        this.animationManager = new AnimationManager();

        this.elements = {
            questionnaireForm: document.getElementById('questionnaire-form'),
            backBtn: document.getElementById('back-btn'),
            nextBtn: document.getElementById('next-btn'),
            submitBtn: document.getElementById('submit-btn'),
            progressText: document.getElementById('progress-text'),
            saveContinueBtn: document.getElementById('save-continue-btn'),
            emailModal: document.getElementById('email-modal'),
            closeEmailModal: document.getElementById('close-email-modal'),
            cancelSave: document.getElementById('cancel-save'),
            confirmSave: document.getElementById('confirm-save'),
            saveEmailInput: document.getElementById('save-email'),
            downloadResultsBtn: document.getElementById('download-results-btn'),
            sendResultsBtn: document.getElementById('send-results-btn'),
            joinCommunityBtn: document.getElementById('join-community-btn')
        };

        this.init();
    }

    init() {
        this.animationManager.showLoadingOverlay();
        document.addEventListener('DOMContentLoaded', async () => {
            await this.animationManager.delay(500); // Simulate loading
            this.setupEventListeners();
            this.validationManager.setupRealTimeValidation();
            this.loadState();
            this.updateUI();
            this.animationManager.hideLoadingOverlay();
        });
    }

    setupEventListeners() {
        this.elements.nextBtn.addEventListener('click', () => this.navigatePages('next'));
        this.elements.backBtn.addEventListener('click', () => this.navigatePages('back'));
        this.elements.questionnaireForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.elements.saveContinueBtn.addEventListener('click', () => this.showEmailModal());
        this.elements.closeEmailModal.addEventListener('click', () => this.hideEmailModal());
        this.elements.cancelSave.addEventListener('click', () => this.hideEmailModal());
        this.elements.confirmSave.addEventListener('click', () => this.handleSaveEmail());
        
        // Tooltip event listeners
        document.querySelectorAll('.help-tooltip').forEach(tooltip => {
            tooltip.addEventListener('mouseenter', (e) => {
                this.animationManager.showTooltip(e.target, e.target.dataset.tooltip);
            });
            tooltip.addEventListener('mouseleave', () => {
                this.animationManager.hideTooltip();
            });
        });

        // Results page buttons
        if (this.elements.downloadResultsBtn) {
            this.elements.downloadResultsBtn.addEventListener('click', () => this.downloadResults());
        }
        if (this.elements.sendResultsBtn) {
            this.elements.sendResultsBtn.addEventListener('click', () => this.sendResultsByEmail());
        }
        if (this.elements.joinCommunityBtn) {
            this.elements.joinCommunityBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Replace with actual Skool community link
                window.open('https://www.skool.com/your-community-link', '_blank');
            });
        }

        // Listen for changes that might affect conditional logic
        this.elements.questionnaireForm.addEventListener('change', (e) => {
            if (e.target.name === 'industry') {
                this.conditionalLogic.handleIndustryChange(e.target.value);
            }
        });
    }

    loadState() {
        const resumeData = this.dataManager.getResumeData();
        if (resumeData && resumeData.currentPage > 1) {
            this.currentPage = resumeData.currentPage;
            // Populate form fields with saved responses
            Object.keys(resumeData.responses).forEach(name => {
                const value = resumeData.responses[name];
                const element = this.elements.questionnaireForm.elements[name];
                if (element) {
                    if (element.type === 'radio' || element.type === 'checkbox') {
                        if (Array.isArray(value)) {
                            value.forEach(val => {
                                const input = document.querySelector(`[name="${name}"][value="${val}"]`);
                                if (input) input.checked = true;
                            });
                        } else {
                            const input = document.querySelector(`[name="${name}"][value="${value}"]`);
                            if (input) input.checked = true;
                        }
                    } else {
                        element.value = value;
                    }
                }
            });
            // Re-apply conditional logic based on loaded state
            const industry = resumeData.responses.industry;
            if (industry) {
                this.conditionalLogic.handleIndustryChange(industry);
            }
        }
    }

    async navigatePages(direction) {
        const currentPageElement = document.getElementById(`page-${this.currentPage}`);
        
        // Validate current page before moving next
        if (direction === 'next' && this.currentPage !== this.totalPages) {
            const validationSummary = this.validationManager.validatePage(this.currentPage);
            if (!validationSummary.valid) {
                this.validationManager.showValidationSummary(validationSummary.errors);
                return;
            }
        }

        // Save current page responses
        this.dataManager.performAutoSave();

        let newPage = this.currentPage;
        if (direction === 'next') {
            newPage = Math.min(this.currentPage + 1, this.totalPages);
        } else if (direction === 'back') {
            newPage = Math.max(this.currentPage - 1, 1);
        }

        if (newPage !== this.currentPage) {
            const nextPageElement = document.getElementById(`page-${newPage}`);
            await this.animationManager.animatePageTransition(currentPageElement, nextPageElement, direction);
            this.currentPage = newPage;
            this.updateUI();
        }
    }

    updateUI() {
        // Hide all pages first
        document.querySelectorAll('.form-page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        // Show current page
        const currentPageElement = document.getElementById(`page-${this.currentPage}`);
        if (currentPageElement) {
            currentPageElement.style.display = 'block';
            currentPageElement.classList.add('active');
        }

        // Update progress bar
        const completionPercentage = Math.round((this.currentPage / this.totalPages) * 100);
        this.animationManager.animateProgressBar(completionPercentage);
        this.elements.progressText.textContent = `Question ${this.currentPage} of ${this.totalPages}`;
        this.dataManager.updateProgress(this.currentPage, this.totalPages);

        // Button visibility
        this.elements.backBtn.style.display = this.currentPage === 1 ? 'none' : 'block';
        this.elements.nextBtn.style.display = this.currentPage === this.totalPages ? 'none' : 'block';
        this.elements.submitBtn.style.display = this.currentPage === this.totalPages ? 'block' : 'none';
        this.elements.saveContinueBtn.style.display = this.currentPage === this.totalPages ? 'none' : 'block';

        // If on results page, generate and display results
        if (this.currentPage === this.totalPages) {
            this.displayResults();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        // Final validation for the last page
        const validationSummary = this.validationManager.validatePage(this.currentPage);
        if (!validationSummary.valid) {
            this.validationManager.showValidationSummary(validationSummary.errors);
            return;
        }

        this.dataManager.performAutoSave(); // Ensure all latest data is saved
        this.dataManager.markCompleted();
        this.displayResults();
    }

    displayResults() {
        const allResponses = this.dataManager.getAllResponses();
        const results = this.resultsGenerator.generateResults(allResponses);

        // Update results page content
        document.getElementById('results-title').textContent = results.title;
        document.getElementById('results-subtitle').textContent = results.recommendations.description;
        document.getElementById('automation-score').textContent = results.score;
        this.animationManager.animateScoreCircle(results.score);

        // Assessment Summary
        const assessmentSummaryEl = document.getElementById('assessment-summary');
        assessmentSummaryEl.innerHTML = `<p>${results.summary}</p>`;

        // Recommended Next Steps
        const recommendedStepsEl = document.getElementById('recommended-steps');
        recommendedStepsEl.innerHTML = `<ul>${results.recommendations.nextSteps.map(step => `<li>${step}</li>`).join('')}</ul>`;

        // Tailored Solutions
        const tailoredSolutionsEl = document.getElementById('tailored-solutions');
        tailoredSolutionsEl.innerHTML = results.solutions.map(sol => `
            <div class="result-section">
                <h3>${sol.title}</h3>
                <p>${sol.description}</p>
                <ul>
                    ${sol.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <p><strong>Timeframe:</strong> ${sol.timeframe}</p>
                <p><strong>Investment:</strong> ${sol.investment}</p>
            </div>
        `).join('');

        // Update CTA buttons
        this.elements.joinCommunityBtn.textContent = results.ctaMessage.primary;
        // Assuming there's a secondary button or a message for it
        const ctaSection = document.querySelector('.cta-section .cta-content p');
        if (ctaSection) {
            ctaSection.textContent = results.ctaMessage.message;
        }
    }

    showEmailModal() {
        this.elements.emailModal.classList.add('show');
    }

    hideEmailModal() {
        this.elements.emailModal.classList.remove('show');
    }

    handleSaveEmail() {
        const email = this.elements.saveEmailInput.value;
        if (this.validationManager.isValidEmail(email)) {
            this.dataManager.saveEmail(email);
            const saveLink = this.dataManager.generateSaveLink();
            // In a real application, you would send this email and saveLink to a backend service
            console.log('Save link for email:', saveLink);
            this.animationManager.showSuccessMessage('Progress saved! Check your email for the link.');
            this.hideEmailModal();
        } else {
            alert('Please enter a valid email address.');
        }
    }

    downloadResults() {
        const allResponses = this.dataManager.getAllResponses();
        const results = this.resultsGenerator.generateResults(allResponses);
        const pdfContent = this.resultsGenerator.generatePDFContent(results, allResponses);

        // For a real PDF download, you'd typically send this HTML content to a backend
        // service that generates a PDF (e.g., using Puppeteer, wkhtmltopdf, etc.)
        // For this vanilla JS example, we'll simulate a download of an HTML file
        // or instruct the user to print to PDF.

        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `automation_assessment_results_${new Date().toISOString().slice(0,10)}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.animationManager.showSuccessMessage('Results downloaded as HTML. You can print this to PDF.');
    }

    sendResultsByEmail() {
        const email = document.querySelector('.email-capture .email-input').value;
        if (this.validationManager.isValidEmail(email)) {
            this.dataManager.saveEmail(email);
            const allResponses = this.dataManager.getAllResponses();
            const results = this.resultsGenerator.generateResults(allResponses);
            const emailContent = this.resultsGenerator.generatePDFContent(results, allResponses); // Re-using PDF content for email

            // In a real application, this would send the emailContent to a backend service
            // that handles sending emails (e.g., SendGrid, Mailgun, etc.)
            console.log(`Sending results to ${email} with content:`, emailContent);
            this.animationManager.showSuccessMessage('Results sent to your email!');
        } else {
            alert('Please enter a valid email address to send results.');
        }
    }
}

// Initialize the questionnaire when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Questionnaire();
});