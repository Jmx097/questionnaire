/**
 * Integration Tests for Email Capture Flow
 * Tests end-to-end email capture functionality including form validation, 
 * API submission, secure link generation, and email delivery
 */

import { validateSecureLink } from '../web/lib/secure-link';
import { sendEmail, generateEmailTemplate } from '../web/lib/email';

// Mock fetch for testing API calls
global.fetch = jest.fn();

describe('Email Capture Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Validation', () => {
    test('should validate required name field', () => {
      const ValidationManager = require('../validation').ValidationManager;
      const validator = new ValidationManager();
      
      const result = validator.validateEmailCaptureForm({
        name: '',
        email: 'test@example.com',
        acceptPrivacy: true
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.name).toContain('required');
    });

    test('should validate email format', () => {
      const ValidationManager = require('../validation').ValidationManager;
      const validator = new ValidationManager();
      
      const result = validator.validateEmailCaptureForm({
        name: 'John Doe',
        email: 'invalid-email',
        acceptPrivacy: true
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.email).toContain('valid email');
    });

    test('should require privacy acceptance', () => {
      const ValidationManager = require('../validation').ValidationManager;
      const validator = new ValidationManager();
      
      const result = validator.validateEmailCaptureForm({
        name: 'John Doe',
        email: 'test@example.com',
        acceptPrivacy: false
      });
      
      expect(result.valid).toBe(false);
      expect(result.errors.acceptPrivacy).toContain('privacy policy');
    });

    test('should pass validation with valid data', () => {
      const ValidationManager = require('../validation').ValidationManager;
      const validator = new ValidationManager();
      
      const result = validator.validateEmailCaptureForm({
        name: 'John Doe',
        email: 'test@example.com',
        optInEmails: true,
        acceptPrivacy: true
      });
      
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });

  describe('Secure Link Generation', () => {
    test('should generate valid secure link', () => {
      const { createSecureLink } = require('../web/lib/secure-link');
      
      const data = {
        email: 'test@example.com',
        segment: 'real_estate',
        timestamp: Date.now()
      };
      
      const link = createSecureLink(data);
      expect(link).toContain('token=');
      expect(link).toContain('expires=');
    });

    test('should validate secure link', () => {
      const { createSecureLink, validateSecureLink } = require('../web/lib/secure-link');
      
      const data = {
        email: 'test@example.com',
        segment: 'real_estate',
        timestamp: Date.now()
      };
      
      const link = createSecureLink(data);
      const validation = validateSecureLink(link);
      
      expect(validation.valid).toBe(true);
      expect(validation.data.email).toBe('test@example.com');
      expect(validation.data.segment).toBe('real_estate');
    });

    test('should reject expired link', () => {
      const { createSecureLink, validateSecureLink } = require('../web/lib/secure-link');
      
      // Create link with past expiry (mocked)
      const data = {
        email: 'test@example.com',
        segment: 'real_estate',
        timestamp: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days ago
      };
      
      const link = createSecureLink(data);
      // Manually set expiry to past for testing
      const modifiedLink = link.replace(/expires=\d+/, 'expires=' + (Date.now() - 1000));
      
      const validation = validateSecureLink(modifiedLink);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('expired');
    });

    test('should reject tampered link', () => {
      const { createSecureLink, validateSecureLink } = require('../web/lib/secure-link');
      
      const data = {
        email: 'test@example.com',
        segment: 'real_estate',
        timestamp: Date.now()
      };
      
      const link = createSecureLink(data);
      // Tamper with the token
      const tamperedLink = link.replace(/token=[^&]+/, 'token=tampered_token_data');
      
      const validation = validateSecureLink(tamperedLink);
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('Invalid token');
    });
  });

  describe('Email Service Integration', () => {
    test('should generate email template', () => {
      const { generateEmailTemplate } = require('../web/lib/email');
      
      const emailOptions = generateEmailTemplate({
        name: 'John Doe',
        secureLink: 'token=abc123&expires=1234567890',
        segment: 'Real Estate'
      });
      
      expect(emailOptions.subject).toContain('Your Personalized AI Automation Report');
      expect(emailOptions.html).toContain('Hi John Doe');
      expect(emailOptions.html).toContain('token=abc123');
      expect(emailOptions.text).toContain('View your complete report');
    });

    test('should handle email service failure gracefully', async () => {
      process.env.EMAIL_SERVICE_API_KEY = '';
      
      const { sendEmail } = require('../web/lib/email');
      
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>'
      });
      
      expect(result.success).toBe(true);
      expect(result.messageId).toBe('console-logged');
    });
  });

  describe('API Endpoints', () => {
    test('should handle POST /api/submit-email', async () => {
      const { POST } = require('../web/app/api/submit-email/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          name: 'John Doe',
          email: 'test@example.com',
          optInEmails: true,
          acceptPrivacy: true,
          segment: 'real_estate'
        }),
        nextUrl: { origin: 'http://localhost:3000' },
        headers: new Map([['x-forwarded-for', '127.0.0.1']])
      };
      
      const response = await POST(mockRequest);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.secureLink).toBeDefined();
    });

    test('should reject invalid email submission', async () => {
      const { POST } = require('../web/app/api/submit-email/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          name: 'John Doe',
          email: 'invalid-email',
          acceptPrivacy: true
        }),
        nextUrl: { origin: 'http://localhost:3000' }
      };
      
      const response = await POST(mockRequest);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid email format');
    });

    test('should handle POST /api/email-report', async () => {
      const { POST } = require('../web/app/api/email-report/route');
      
      const mockRequest = {
        json: () => Promise.resolve({
          to: 'test@example.com',
          name: 'John Doe',
          secureLink: 'token=abc123&expires=1234567890',
          segment: 'Real Estate'
        })
      };
      
      const response = await POST(mockRequest);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('Data Management', () => {
    test('should save email capture data', () => {
      const DataManager = require('../data-manager').DataManager;
      const manager = new DataManager();
      
      const formData = {
        name: 'John Doe',
        email: 'test@example.com',
        optInEmails: true,
        acceptPrivacy: true
      };
      
      manager.saveEmailCapture(formData);
      
      const emailState = manager.getEmailCaptureState();
      expect(emailState.name).toBe('John Doe');
      expect(emailState.email).toBe('test@example.com');
      expect(emailState.submittedAt).toBeDefined();
    });

    test('should check for partial email data', () => {
      const DataManager = require('../data-manager').DataManager;
      const manager = new DataManager();
      
      // Set up partial data
      localStorage.setItem('emailCaptureData', JSON.stringify({
        name: 'John Doe',
        email: ''
      }));
      
      expect(manager.hasPartialEmailData()).toBe(true);
      
      // Clear data
      localStorage.removeItem('emailCaptureData');
      expect(manager.hasPartialEmailData()).toBe(false);
    });

    test('should generate webhook data', () => {
      const DataManager = require('../data-manager').DataManager;
      const manager = new DataManager();
      
      // Set up data
      manager.saveEmailCapture({
        name: 'John Doe',
        email: 'test@example.com',
        optInEmails: true,
        acceptPrivacy: true
      });
      
      manager.updateResponse('segment', 'real_estate');
      manager.updateResponse('teamSize', 'solo');
      
      const webhookData = manager.getWebhookData();
      
      expect(webhookData.name).toBe('John Doe');
      expect(webhookData.email).toBe('test@example.com');
      expect(webhookData.segment).toBe('real_estate');
      expect(webhookData.optInEmails).toBe(true);
    });
  });

  describe('End-to-End Flow', () => {
    test('should complete full email capture flow', async () => {
      // Mock the entire flow
      const mockEmailService = {
        sendEmail: jest.fn().mockResolvedValue({ success: true, messageId: 'msg_123' })
      };
      
      // Step 1: Form validation
      const ValidationManager = require('../validation').ValidationManager;
      const validator = new ValidationManager();
      
      const validFormData = {
        name: 'John Doe',
        email: 'test@example.com',
        optInEmails: true,
        acceptPrivacy: true
      };
      
      const validationResult = validator.validateEmailCaptureForm(validFormData);
      expect(validationResult.valid).toBe(true);
      
      // Step 2: Save data
      const DataManager = require('../data-manager').DataManager;
      const manager = new DataManager();
      manager.saveEmailCapture(validFormData);
      
      // Step 3: Generate secure link
      const { createSecureLink } = require('../web/lib/secure-link');
      const secureLink = createSecureLink({
        email: validFormData.email,
        segment: 'real_estate',
        timestamp: Date.now()
      });
      manager.setReportLink(secureLink);
      
      // Step 4: Simulate API submission
      const { POST } = require('../web/app/api/submit-email/route');
      const mockRequest = {
        json: () => Promise.resolve({
          ...validFormData,
          segment: 'real_estate',
          responses: { segment: 'real_estate' }
        }),
        nextUrl: { origin: 'http://localhost:3000' },
        headers: new Map([['x-forwarded-for', '127.0.0.1']])
      };
      
      const apiResponse = await POST(mockRequest);
      const apiData = await apiResponse.json();
      
      expect(apiResponse.status).toBe(200);
      expect(apiData.success).toBe(true);
      expect(apiData.secureLink).toBeDefined();
      
      // Step 5: Validate the generated link works
      const { validateSecureLink } = require('../web/lib/secure-link');
      const linkValidation = validateSecureLink(apiData.secureLink);
      expect(linkValidation.valid).toBe(true);
    });
  });
});

// Run tests
if (require.main === module) {
  console.log('Running Email Capture Flow Integration Tests...');
  
  // Simple test runner without Jest
  const tests = [
    { name: 'Form validation', fn: () => {
      const ValidationManager = require('../validation').ValidationManager;
      const validator = new ValidationManager();
      const result = validator.validateEmailCaptureForm({
        name: 'John Doe',
        email: 'test@example.com',
        acceptPrivacy: true
      });
      if (!result.valid) throw new Error('Valid form should pass validation');
    }},
    
    { name: 'Secure link generation', fn: () => {
      const { createSecureLink, validateSecureLink } = require('../web/lib/secure-link');
      const link = createSecureLink({
        email: 'test@example.com',
        segment: 'real_estate',
        timestamp: Date.now()
      });
      const validation = validateSecureLink(link);
      if (!validation.valid) throw new Error('Valid link should pass validation');
    }},
    
    { name: 'Email template generation', fn: () => {
      const { generateEmailTemplate } = require('../web/lib/email');
      const template = generateEmailTemplate({
        name: 'John Doe',
        secureLink: 'token=test',
        segment: 'Real Estate'
      });
      if (!template.subject || !template.html) throw new Error('Email template should be generated');
    }},
    
    { name: 'Data management', fn: () => {
      const DataManager = require('../data-manager').DataManager;
      const manager = new DataManager();
      manager.saveEmailCapture({
        name: 'John Doe',
        email: 'test@example.com',
        acceptPrivacy: true
      });
      const emailState = manager.getEmailCaptureState();
      if (emailState.name !== 'John Doe') throw new Error('Email data should be saved');
    }}
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    try {
      test.fn();
      console.log(`✅ ${test.name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}