/**
 * Enhanced Validation Manager for Email Capture and Profile Preview
 * Handles validation for questionnaire pages and email capture form
 */

class ValidationManager {
    constructor() {
        this.validationRules = {
            required: (value) => value !== null && value !== undefined && value !== '',
            email: (email) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            },
            name: (name) => {
                // Name must be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes
                const nameRegex = /^[a-zA-Z\s\-']{2,}$/;
                return nameRegex.test(name.trim());
            },
            consent: (accepted) => accepted === true,
            phone: (phone) => {
                // Basic phone validation (optional)
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                return !phone || phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
            }
        };
    }

    /**
     * Validate a single field
     */
    validateField(fieldName, value, rules = []) {
        const errors = [];
        
        for (const rule of rules) {
            if (!this.validationRules[rule](value)) {
                switch (rule) {
                    case 'required':
                        errors.push(`${this.getFieldLabel(fieldName)} is required`);
                        break;
                    case 'email':
                        errors.push('Please enter a valid email address');
                        break;
                    case 'name':
                        errors.push('Please enter a valid name (letters, spaces, hyphens only)');
                        break;
                    case 'consent':
                        errors.push('You must accept to proceed');
                        break;
                    case 'phone':
                        errors.push('Please enter a valid phone number');
                        break;
                    default:
                        errors.push(`Invalid ${this.getFieldLabel(fieldName)}`);
                }
            }
        }
        
        return errors;
    }

    /**
     * Validate entire form
     */
    validateEmailCaptureForm(formData) {
        const errors = {};
        
        // Name validation
        const nameErrors = this.validateField('name', formData.name, ['required', 'name']);
        if (nameErrors.length > 0) {
            errors.name = nameErrors[0];
        }
        
        // Email validation
        const emailErrors = this.validateField('email', formData.email, ['required', 'email']);
        if (emailErrors.length > 0) {
            errors.email = emailErrors[0];
        }
        
        // Privacy consent validation
        const consentErrors = this.validateField('acceptPrivacy', formData.acceptPrivacy, ['consent']);
        if (consentErrors.length > 0) {
            errors.acceptPrivacy = consentErrors[0];
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Real-time validation for form inputs
     */
    setupRealTimeValidation() {
        // This would be called to set up event listeners for real-time validation
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-validate]')) {
                this.validateFieldRealTime(e.target);
            }
        });
        
        document.addEventListener('blur', (e) => {
            if (e.target.matches('[data-validate]')) {
                this.validateFieldRealTime(e.target);
            }
        });
    }

    /**
     * Validate single field in real-time
     */
    validateFieldRealTime(field) {
        const fieldName = field.name || field.id;
        const value = field.type === 'checkbox' ? field.checked : field.value;
        const rules = field.dataset.validate ? field.dataset.validate.split(',') : [];
        
        const errors = this.validateField(fieldName, value, rules);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errors.length > 0) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errors[0];
                errorElement.style.display = 'block';
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }

    /**
     * Show validation summary
     */
    showValidationSummary(errors) {
        // Display errors in a summary format
        const summaryElement = document.getElementById('validation-summary');
        if (summaryElement) {
            const errorList = Object.values(errors).join('\n');
            summaryElement.innerHTML = `
                <div class="validation-summary">
                    <h3>Please fix the following:</h3>
                    <ul>
                        ${Object.values(errors).map(error => `<li>${error}</li>`).join('')}
                    </ul>
                </div>
            `;
            summaryElement.style.display = 'block';
            summaryElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Hide validation summary
     */
    hideValidationSummary() {
        const summaryElement = document.getElementById('validation-summary');
        if (summaryElement) {
            summaryElement.style.display = 'none';
        }
    }

    /**
     * Get user-friendly field labels
     */
    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Full name',
            'email': 'Email address',
            'acceptPrivacy': 'Privacy policy acceptance',
            'phone': 'Phone number',
            'company': 'Company name'
        };
        
        return labels[fieldName] || fieldName;
    }

    /**
     * Check if email is valid (legacy method for compatibility)
     */
    isValidEmail(email) {
        return this.validationRules.email(email);
    }

    /**
     * Validate entire questionnaire page
     */
    validatePage(pageNumber) {
        // This method validates the current page before allowing navigation
        // Implementation depends on the specific form structure
        switch (pageNumber) {
            case 1:
                return this.validatePage1();
            case 2:
                return this.validatePage2();
            case 3:
                return this.validatePage3();
            case 4:
                return this.validatePage4();
            case 5:
                return this.validatePage5();
            case 9: // Email capture page
                return this.validateEmailPage();
            default:
                return { valid: true, errors: [] };
        }
    }

    validateEmailPage() {
        // For email capture page validation
        const emailData = localStorage.getItem('emailCaptureData');
        if (emailData) {
            try {
                const formData = JSON.parse(emailData);
                return this.validateEmailCaptureForm(formData);
            } catch (error) {
                return { valid: false, errors: { general: 'Invalid saved data' } };
            }
        }
        return { valid: false, errors: { general: 'No data found' } };
    }

    // Page-specific validation methods would be implemented here
    validatePage1() { return { valid: true, errors: [] }; }
    validatePage2() { return { valid: true, errors: [] }; }
    validatePage3() { return { valid: true, errors: [] }; }
    validatePage4() { return { valid: true, errors: [] }; }
    validatePage5() { return { valid: true, errors: [] }; }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValidationManager;
} else {
    window.ValidationManager = ValidationManager;
}