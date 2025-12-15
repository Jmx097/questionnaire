/**
 * Enhanced Data Manager with Email Capture Support
 * Handles state management, autosave, resume functionality, and email capture data
 */

class DataManager {
    constructor() {
        this.currentData = {
            responses: {},
            currentPage: 1,
            email: null,
            resumeToken: null,
            completedAt: null,
            lastSaved: null,
        };
        
        this.autoSaveTimeout = null;
        this.debounceDelay = 500; // 500ms debounce for autosave
        
        this.init();
    }

    init() {
        // Load existing data on initialization
        this.loadSavedData();
        
        // Set up autosave on every form change
        document.addEventListener('input', () => this.scheduleAutoSave());
        document.addEventListener('change', () => this.scheduleAutoSave());
        
        // Clean up old data periodically
        this.setupDataCleanup();
    }

    /**
     * Load saved data from localStorage
     */
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('questionnaireData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.currentData = { ...this.currentData, ...parsed };
            }
            
            // Load email capture data separately
            const emailData = localStorage.getItem('emailCaptureData');
            if (emailData) {
                try {
                    const parsed = JSON.parse(emailData);
                    this.currentData.email = {
                        ...parsed,
                        webhookSent: false,
                        reportLink: null,
                    };
                } catch (error) {
                    console.error('Error loading email capture data:', error);
                }
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            this.resetData();
        }
    }

    /**
     * Schedule autosave with debounce
     */
    scheduleAutoSave() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        this.autoSaveTimeout = setTimeout(() => {
            this.performAutoSave();
        }, this.debounceDelay);
    }

    /**
     * Perform autosave
     */
    performAutoSave() {
        try {
            // Save main questionnaire data
            const dataToSave = {
                responses: this.currentData.responses,
                currentPage: this.currentData.currentPage,
                resumeToken: this.currentData.resumeToken,
                completedAt: this.currentData.completedAt,
                lastSaved: new Date().toISOString(),
            };
            
            localStorage.setItem('questionnaireData', JSON.stringify(dataToSave));
            
            // Show autosave indicator
            this.showAutoSaveIndicator();
            
        } catch (error) {
            console.error('Autosave failed:', error);
        }
    }

    /**
     * Show autosave indicator
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
     * Update current page
     */
    updateCurrentPage(page) {
        this.currentData.currentPage = page;
        this.performAutoSave();
    }

    /**
     * Update responses
     */
    updateResponse(key, value) {
        this.currentData.responses[key] = value;
        this.performAutoSave();
    }

    /**
     * Get all responses
     */
    getAllResponses() {
        return { ...this.currentData.responses };
    }

    /**
     * Get resume data for token generation
     */
    getResumeData() {
        return {
            responses: this.currentData.responses,
            currentPage: this.currentData.currentPage,
            email: this.currentData.email,
            resumeToken: this.currentData.resumeToken,
            completedAt: this.currentData.completedAt,
        };
    }

    /**
     * Generate resume token
     */
    generateResumeToken() {
        const token = this.generateSecureToken();
        this.currentData.resumeToken = token;
        this.performAutoSave();
        return token;
    }

    /**
     * Generate secure token for data recovery
     */
    generateSecureToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    /**
     * Mark questionnaire as completed
     */
    markCompleted() {
        this.currentData.completedAt = new Date().toISOString();
        this.performAutoSave();
    }

    /**
     * Reset all data
     */
    resetData() {
        this.currentData = {
            responses: {},
            currentPage: 1,
            email: null,
            resumeToken: null,
            completedAt: null,
            lastSaved: null,
        };
        
        localStorage.removeItem('questionnaireData');
        localStorage.removeItem('emailCaptureData');
    }

    /**
     * Update progress
     */
    updateProgress(currentPage, totalPages) {
        const percentage = Math.round((currentPage / totalPages) * 100);
        this.currentData.progress = percentage;
        // Progress is automatically saved by performAutoSave
    }

    /**
     * Email Capture Methods
     */

    /**
     * Save email capture form data
     */
    saveEmailCapture(formData) {
        this.currentData.email = {
            ...formData,
            submittedAt: new Date().toISOString(),
            webhookSent: false,
            reportLink: null,
        };
        
        this.performAutoSave();
        
        // Also save to separate localStorage for immediate access
        localStorage.setItem('emailCaptureData', JSON.stringify(formData));
    }

    /**
     * Get email capture state
     */
    getEmailCaptureState() {
        return this.currentData.email || {};
    }

    /**
     * Check if email has been submitted
     */
    isEmailSubmitted() {
        return this.currentData.email && this.currentData.email.submittedAt;
    }

    /**
     * Mark email as sent to webhook
     */
    markWebhookSent() {
        if (this.currentData.email) {
            this.currentData.email.webhookSent = true;
            this.performAutoSave();
        }
    }

    /**
     * Set report link
     */
    setReportLink(link) {
        if (this.currentData.email) {
            this.currentData.email.reportLink = link;
            this.performAutoSave();
        }
    }

    /**
     * Check if form was partially filled
     */
    hasPartialEmailData() {
        const emailData = localStorage.getItem('emailCaptureData');
        if (!emailData) return false;
        
        try {
            const data = JSON.parse(emailData);
            return !!(data.name || data.email);
        } catch (error) {
            return false;
        }
    }

    /**
     * Clear partial email data after successful submission
     */
    clearEmailData() {
        localStorage.removeItem('emailCaptureData');
    }

    /**
     * Resume from saved state using token
     */
    resumeFromToken(token) {
        // This would typically call a backend to get the data
        // For now, we'll use localStorage
        const resumeData = this.getResumeData();
        if (resumeData.resumeToken === token) {
            return resumeData;
        }
        return null;
    }

    /**
     * Set up periodic data cleanup
     */
    setupDataCleanup() {
        // Clean up old data every 24 hours
        setInterval(() => {
            this.cleanupExpiredData();
        }, 24 * 60 * 60 * 1000);
    }

    /**
     * Clean up expired data (older than 30 days)
     */
    cleanupExpiredData() {
        try {
            const cutoffTime = new Date();
            cutoffTime.setDate(cutoffTime.getDate() - 30);
            
            const savedData = localStorage.getItem('questionnaireData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.lastSaved && new Date(parsed.lastSaved) < cutoffTime) {
                    localStorage.removeItem('questionnaireData');
                }
            }
            
            const emailData = localStorage.getItem('emailCaptureData');
            if (emailData) {
                const parsed = JSON.parse(emailData);
                // Clean up if older than 7 days
                const emailCutoff = new Date();
                emailCutoff.setDate(emailCutoff.getDate() - 7);
                // This is a simplified check - in practice, you'd track submission time
            }
        } catch (error) {
            console.error('Data cleanup failed:', error);
        }
    }

    /**
     * Get data for external webhook
     */
    getWebhookData() {
        if (!this.currentData.email) {
            return null;
        }
        
        return {
            name: this.currentData.email.name,
            email: this.currentData.email.email,
            optInEmails: this.currentData.email.optInEmails,
            segment: this.currentData.responses.segment,
            teamSize: this.currentData.responses.teamSize,
            sentiment: this.currentData.responses.sentiment,
            pain: this.currentData.responses.pain,
            valuePerMonth: this.currentData.responses.valuePerMonth,
            urgency: this.currentData.responses.urgency,
            submittedAt: this.currentData.email.submittedAt,
        };
    }

    /**
     * Save email (legacy method for compatibility)
     */
    saveEmail(email) {
        this.currentData.email = this.currentData.email || {};
        this.currentData.email.email = email;
        this.performAutoSave();
    }

    /**
     * Generate save link (legacy method for compatibility)
     */
    generateSaveLink() {
        const token = this.generateResumeToken();
        const baseUrl = window.location.origin;
        return `${baseUrl}/resume/${token}`;
    }

    /**
     * Get data for export/download
     */
    exportData() {
        return {
            responses: this.currentData.responses,
            email: this.currentData.email,
            completedAt: this.currentData.completedAt,
            exportedAt: new Date().toISOString(),
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
} else {
    window.DataManager = DataManager;
}