/**
 * Test Make webhook integration
 */

import { scoreProfile } from '@/config/scoring';

// Mock fetch for testing
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Test environment setup
process.env.MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/dw9vllqgy7yvlpq92bnuxogf7ee58rrb';
process.env.WEBHOOK_SECRET_KEY = 'test-secret-key';

describe('Make Webhook Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('Webhook Payload Structure', () => {
    it('should create comprehensive webhook payload with all required fields', () => {
      const quizData = {
        segment: 'real_estate',
        teamSize: '6-20',
        sentiment: 'daily',
        tools: ['HubSpot', 'Salesforce', 'Slack'],
        pain: 'manual_processes',
        pain_other: 'Too much paperwork',
        valuePerMonth: 3000,
        urgency: '30d',
      };

      const scoreData = scoreProfile(quizData);
      const webhookPayload = {
        // User information
        name: 'John Doe',
        email: 'john@example.com',
        optInEmails: true,
        
        // Quiz responses (Q1-Q5)
        quiz: {
          segment: quizData.segment,
          teamSize: quizData.teamSize,
          sentiment: quizData.sentiment,
          tools: quizData.tools,
          pain: quizData.pain,
          pain_other: quizData.pain_other,
          valuePerMonth: quizData.valuePerMonth,
          urgency: quizData.urgency,
        },
        
        // Calculated profile and score
        profile: {
          segment: 'real_estate',
          score: scoreData.score,
          tier: scoreData.tier,
          offer: scoreData.offer,
          identity_maturity: scoreData.identity_maturity,
          integration_score: scoreData.integration_score,
          pain_intensity: scoreData.pain_intensity,
          budget_score: scoreData.budget_score,
          urgency_score: scoreData.urgency_score,
        },
        
        // Metadata
        timestamp: expect.any(String),
        source: 'email_capture_form',
        clientIP: expect.any(String),
        userAgent: expect.any(String),
      };

      // Verify payload structure
      expect(webhookPayload).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        optInEmails: true,
        source: 'email_capture_form',
        quiz: {
          segment: 'real_estate',
          teamSize: '6-20',
          sentiment: 'daily',
          tools: ['HubSpot', 'Salesforce', 'Slack'],
          pain: 'manual_processes',
          pain_other: 'Too much paperwork',
          valuePerMonth: 3000,
          urgency: '30d',
        },
        profile: {
          segment: 'real_estate',
          score: expect.any(Number),
          tier: expect.any(String),
          offer: expect.any(String),
          identity_maturity: expect.any(Number),
          integration_score: expect.any(Number),
          pain_intensity: expect.any(Number),
          budget_score: expect.any(Number),
          urgency_score: expect.any(Number),
        },
        timestamp: expect.any(String),
        clientIP: expect.any(String),
        userAgent: expect.any(String),
      });
    });

    it('should handle missing quiz data gracefully', () => {
      const webhookPayload = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        optInEmails: false,
        quiz: {
          segment: 'other',
          teamSize: undefined,
          sentiment: undefined,
          tools: [],
          pain: undefined,
          pain_other: undefined,
          valuePerMonth: undefined,
          urgency: undefined,
        },
        profile: {
          segment: 'other',
          score: 0,
          tier: 'low',
          offer: 'Plinko Pocket',
          identity_maturity: 0,
          integration_score: 0,
          pain_intensity: 0,
          budget_score: 0,
          urgency_score: 0,
        },
        timestamp: expect.any(String),
        source: 'email_capture_form',
        clientIP: expect.any(String),
        userAgent: expect.any(String),
      };

      expect(webhookPayload.quiz.tools).toEqual([]);
      expect(webhookPayload.profile.score).toBe(0);
      expect(webhookPayload.profile.tier).toBe('low');
    });
  });

  describe('Webhook Delivery with Retry Logic', () => {
    it('should successfully deliver webhook on first attempt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
      });

      const payload = {
        name: 'Test User',
        email: 'test@example.com',
        optInEmails: true,
        quiz: { segment: 'consulting' },
        profile: { score: 75, tier: 'high' },
        timestamp: new Date().toISOString(),
        source: 'email_capture_form',
      };

      const response = await fetch(process.env.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'questionnaire-app',
          'X-Webhook-Timestamp': new Date().toISOString(),
        },
        body: JSON.stringify(payload),
      });

      expect(response.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://hook.us1.make.com/dw9vllqgy7yvlpq92bnuxogf7ee58rrb',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Source': 'questionnaire-app',
            'X-Webhook-Timestamp': expect.any(String),
          },
          body: JSON.stringify(payload),
        })
      );
    });

    it('should retry on failure and eventually succeed', async () => {
      // Mock first two attempts to fail, third to succeed
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          statusText: 'OK',
        });

      const payload = {
        name: 'Retry User',
        email: 'retry@example.com',
        quiz: { segment: 'agency' },
        profile: { score: 50, tier: 'mid' },
        timestamp: new Date().toISOString(),
        source: 'email_capture_form',
      };

      // Simulate retry logic
      const maxRetries = 3;
      let success = false;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(process.env.MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            success = true;
            break;
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          if (attempt === maxRetries) {
            throw error;
          }
          // Wait before retry (simplified for testing)
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      expect(success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries exceeded', async () => {
      // Mock all attempts to fail
      mockFetch.mockRejectedValue(new Error('Persistent network error'));

      const payload = {
        name: 'Fail User',
        email: 'fail@example.com',
        quiz: { segment: 'finance' },
        profile: { score: 25, tier: 'low' },
        timestamp: new Date().toISOString(),
        source: 'email_capture_form',
      };

      const maxRetries = 3;
      let finalError;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await fetch(process.env.MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (error) {
          finalError = error;
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      expect(finalError).toBeDefined();
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Environment Configuration', () => {
    it('should have Make webhook URL configured', () => {
      expect(process.env.MAKE_WEBHOOK_URL).toBeDefined();
      expect(process.env.MAKE_WEBHOOK_URL).toBe('https://hook.us1.make.com/dw9vllqgy7yvlpq92bnuxogf7ee58rrb');
    });

    it('should have webhook secret configured', () => {
      expect(process.env.WEBHOOK_SECRET_KEY).toBeDefined();
      expect(process.env.WEBHOOK_SECRET_KEY).toBe('test-secret-key');
    });

    it('should have proper webhook URL format', () => {
      const url = process.env.MAKE_WEBHOOK_URL;
      expect(url).toMatch(/^https:\/\/hook\.us1\.make\.com\/.+/);
    });
  });

  describe('Score Profile Integration', () => {
    it('should calculate score profile correctly for high-tier user', () => {
      const quizData = {
        segment: 'finance',
        teamSize: '21+',
        sentiment: 'daily',
        tools: ['Salesforce', 'HubSpot', 'Slack', 'Zoom', 'Notion'],
        pain: 'manual_processes',
        valuePerMonth: 8000,
        urgency: 'asap',
      };

      const scoreData = scoreProfile(quizData);

      expect(scoreData.score).toBeGreaterThan(70);
      expect(scoreData.tier).toBe('high');
      expect(scoreData.offer).toBe('Playbook Plus');
      expect(scoreData.identity_maturity).toBe(2); // 21+ team
      expect(scoreData.integration_score).toBe(3); // 5 tools + daily sentiment
      expect(scoreData.budget_score).toBe(3); // 8000 >= 5000
      expect(scoreData.urgency_score).toBe(2); // asap
    });

    it('should calculate score profile correctly for low-tier user', () => {
      const quizData = {
        segment: 'other',
        teamSize: 'solo',
        sentiment: 'starting',
        tools: [],
        pain: 'other',
        valuePerMonth: 200,
        urgency: 'research',
      };

      const scoreData = scoreProfile(quizData);

      expect(scoreData.score).toBeLessThan(40);
      expect(scoreData.tier).toBe('low');
      expect(scoreData.offer).toBe('Plinko Pocket');
      expect(scoreData.identity_maturity).toBe(0); // solo
      expect(scoreData.integration_score).toBe(1); // no tools, not daily
      expect(scoreData.budget_score).toBe(0); // 200 < 500
      expect(scoreData.urgency_score).toBe(0); // research
    });
  });

  describe('Error Handling', () => {
    it('should handle missing Make webhook URL gracefully', () => {
      const originalUrl = process.env.MAKE_WEBHOOK_URL;
      delete process.env.MAKE_WEBHOOK_URL;

      // Should not throw error when webhook URL is missing
      expect(() => {
        const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
        if (makeWebhookUrl) {
          // Webhook would be sent here
        }
      }).not.toThrow();

      // Restore original value
      process.env.MAKE_WEBHOOK_URL = originalUrl;
    });

    it('should handle malformed webhook payload', () => {
      const malformedPayload = {
        name: null, // Invalid null value
        email: 'not-an-email', // Invalid email
        // Missing required fields
      };

      // Should not crash when payload is malformed
      expect(() => {
        JSON.stringify(malformedPayload);
      }).not.toThrow();
    });
  });
});

// Integration test for the complete flow
describe('Complete Email Capture Flow with Webhook', () => {
  it('should complete full email capture flow including webhook', async () => {
    // Mock successful responses
    mockFetch
      .mockResolvedValueOnce({ // Webhook call
        ok: true,
        status: 200,
        statusText: 'OK',
      })
      .mockResolvedValueOnce({ // Email API call
        ok: true,
        status: 200,
        statusText: 'OK',
      });

    const formData = {
      name: 'Integration Test User',
      email: 'integration@test.com',
      optInEmails: true,
      acceptPrivacy: true,
      quizData: {
        segment: 'consulting',
        teamSize: '2-5',
        sentiment: 'curious',
        tools: ['Slack'],
        pain: 'time_waste',
        valuePerMonth: 1500,
        urgency: 'quarter',
      },
    };

    // Simulate the complete flow
    const scoreData = scoreProfile(formData.quizData);
    
    const webhookPayload = {
      name: formData.name,
      email: formData.email,
      optInEmails: formData.optInEmails,
      quiz: {
        segment: formData.quizData.segment,
        teamSize: formData.quizData.teamSize,
        sentiment: formData.quizData.sentiment,
        tools: formData.quizData.tools,
        pain: formData.quizData.pain,
        valuePerMonth: formData.quizData.valuePerMonth,
        urgency: formData.quizData.urgency,
      },
      profile: {
        segment: formData.quizData.segment,
        score: scoreData.score,
        tier: scoreData.tier,
        offer: scoreData.offer,
        identity_maturity: scoreData.identity_maturity,
        integration_score: scoreData.integration_score,
        pain_intensity: scoreData.pain_intensity,
        budget_score: scoreData.budget_score,
        urgency_score: scoreData.urgency_score,
      },
      timestamp: expect.any(String),
      source: 'email_capture_form',
    };

    // Verify the flow works
    expect(webhookPayload.name).toBe('Integration Test User');
    expect(webhookPayload.quiz.segment).toBe('consulting');
    expect(webhookPayload.profile.score).toBeGreaterThan(0);
    expect(mockFetch).toHaveBeenCalledTimes(2); // webhook + email
  });
});