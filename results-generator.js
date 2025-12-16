/**
 * Results Generator - Calculates scores and generates personalized recommendations
 * Creates tailored results based on user responses and industry-specific logic
 */

class ResultsGenerator {
    constructor() {
        this.scoringWeights = this.initializeScoringWeights();
        this.recommendationTemplates = this.initializeRecommendationTemplates();
        this.industryInsights = this.initializeIndustryInsights();
    }

    /**
     * Initialize scoring weights for different factors
     */
    initializeScoringWeights() {
        return {
            industry: {
                'real-estate': 1.2,        // High automation potential
                'consulting-coaching': 1.1, // Good automation potential
                'personal-brand': 1.3,     // Very high potential
                'creative-agency': 1.1,    // Good potential
                'finance': 1.0,            // Moderate potential
                'construction': 0.9,       // Lower but still valuable
                'other': 1.0              // Baseline
            },
            teamSize: {
                'solo': 0.8,              // Lower complexity needs
                'small': 1.0,             // Baseline
                'medium': 1.2,            // Higher potential impact
                'large': 1.4              // Maximum potential
            },
            technicalLevel: {
                'beginner': 0.8,          // Need simpler solutions
                'intermediate': 1.0,      // Baseline
                'advanced': 1.2           // Can handle complex automation
            },
            currentTools: {
                0: 0.6,                   // No current tools
                1: 0.7,                   // Minimal tools
                2: 0.8,                   // Some tools
                3: 1.0,                   // Moderate tool usage
                4: 1.1,                   // Good tool adoption
                5: 1.2                    // High tool adoption
            },
            aiSentiment: {
                'excited': 1.3,           // High readiness for AI
                'cautious': 1.0,          // Moderate readiness
                'neutral': 0.9,           // Neutral readiness
                'skeptical': 0.7          // Lower readiness
            },
            budget: {
                '500': 0.7,               // Budget constraints
                '1500': 1.0,              // Moderate budget
                '3000': 1.2,              // Good budget
                '5000': 1.4               // High budget
            },
            timeline: {
                'immediate': 1.4,         // High urgency
                'month': 1.2,             // Good urgency
                'quarter': 1.0,           // Moderate urgency
                'exploring': 0.8          // Low urgency
            }
        };
    }

    /**
     * Initialize recommendation templates
     */
    initializeRecommendationTemplates() {
        return {
            highScore: {
                title: 'You\'re Ready for Advanced Automation! 🚀',
                description: 'Based on your responses, you have excellent potential for automation success. Your combination of technical readiness, clear pain points, and available resources positions you perfectly for transformative automation implementation.',
                nextSteps: [
                    'Start with high-impact, quick-win automations in your biggest pain point area',
                    'Implement a comprehensive automation strategy across multiple business processes',
                    'Consider advanced AI-powered solutions for maximum efficiency gains',
                    'Plan for scalable automation that grows with your business'
                ]
            },
            mediumScore: {
                title: 'Great Automation Potential! 💡',
                description: 'You\'re well-positioned to benefit from business automation. With some strategic planning and the right approach, you can significantly improve your operational efficiency and reduce manual work.',
                nextSteps: [
                    'Begin with simple, no-code automation tools in your primary pain point area',
                    'Focus on automating repetitive tasks that consume the most time',
                    'Build your automation skills gradually with user-friendly platforms',
                    'Create a roadmap for expanding automation as you gain confidence'
                ]
            },
            lowScore: {
                title: 'Automation Can Still Help! 🌱',
                description: 'While you may be in the early stages of your automation journey, there are still valuable opportunities to improve your business processes. Starting small and building gradually is a proven approach.',
                nextSteps: [
                    'Start with one simple automation to solve your most pressing pain point',
                    'Focus on learning basic automation concepts and tools',
                    'Consider consulting with automation experts for guidance',
                    'Build internal capabilities before expanding to complex solutions'
                ]
            }
        };
    }

    /**
     * Initialize industry-specific insights
     */
    initializeIndustryInsights() {
        return {
            'real-estate': {
                commonAutomations: [
                    'Automated lead nurturing sequences',
                    'Property listing syndication',
                    'Client communication workflows',
                    'Document generation and e-signatures'
                ],
                averageROI: '300-500%',
                timeToValue: '2-4 weeks',
                successStories: 'Real estate agents typically see 40% reduction in admin time and 60% improvement in lead conversion rates.'
            },
            'consulting-coaching': {
                commonAutomations: [
                    'Discovery call booking automation',
                    'Client onboarding sequences',
                    'Invoice and payment processing',
                    'Content distribution workflows'
                ],
                averageROI: '250-400%',
                timeToValue: '1-3 weeks',
                successStories: 'Consultants often achieve 50% reduction in administrative tasks and 3x faster client onboarding.'
            },
            'personal-brand': {
                commonAutomations: [
                    'Social media content scheduling',
                    'Email marketing sequences',
                    'Lead capture and segmentation',
                    'Course delivery automation'
                ],
                averageROI: '400-600%',
                timeToValue: '1-2 weeks',
                successStories: 'Creators typically see 70% time savings on content distribution and 5x growth in email subscribers.'
            },
            'creative-agency': {
                commonAutomations: [
                    'Project management workflows',
                    'Client communication automation',
                    'Time tracking and invoicing',
                    'Asset management systems'
                ],
                averageROI: '200-350%',
                timeToValue: '3-6 weeks',
                successStories: 'Agencies often achieve 35% improvement in project delivery time and 50% better resource utilization.'
            },
            'finance': {
                commonAutomations: [
                    'Deal pipeline and opportunity tracking',
                    'Due diligence document processing',
                    'Investor reporting and communication',
                    'Compliance and regulatory reporting'
                ],
                averageROI: '150-300%',
                timeToValue: '4-8 weeks',
                successStories: 'Finance firms typically see 60% reduction in reporting time and 90% improvement in compliance accuracy.'
            },
            'construction': {
                commonAutomations: [
                    'Project scheduling and timeline management',
                    'Subcontractor coordination and communication',
                    'Material ordering and inventory tracking',
                    'Permit applications and approvals'
                ],
                averageROI: '200-400%',
                timeToValue: '4-8 weeks',
                successStories: 'Construction companies often achieve 25% faster project completion and 40% reduction in administrative overhead.'
            },
            'other': {
                commonAutomations: [
                    'Customer communication and follow-up',
                    'Manual data entry and processing',
                    'Appointment and meeting scheduling',
                    'Reporting and analytics generation'
                ],
                averageROI: '200-400%',
                timeToValue: '2-6 weeks',
                successStories: 'Businesses across various sectors report significant time savings and increased productivity through automation.'
            }
        };
    }

    /**
     * Calculate automation readiness score
     */
    calculateAutomationScore(responses) {
        const baseScore = 50; // Starting baseline
        let multiplier = 1.0;

        // Industry factor
        if (responses.industry && this.scoringWeights.industry[responses.industry]) {
            multiplier *= this.scoringWeights.industry[responses.industry];
        }

        // Team size factor
        if (responses.team_size && this.scoringWeights.teamSize[responses.team_size]) {
            multiplier *= this.scoringWeights.teamSize[responses.team_size];
        }

        // Technical level factor
        if (responses.technical_level && this.scoringWeights.technicalLevel[responses.technical_level]) {
            multiplier *= this.scoringWeights.technicalLevel[responses.technical_level];
        }

        // Current tools factor
        const toolCount = Array.isArray(responses.current_tools) ? responses.current_tools.length : 0;
        const toolsMultiplier = this.scoringWeights.currentTools[Math.min(toolCount, 5)] || 1.0;
        multiplier *= toolsMultiplier;

        // AI sentiment factor
        if (responses.ai_sentiment && this.scoringWeights.aiSentiment[responses.ai_sentiment]) {
            multiplier *= this.scoringWeights.aiSentiment[responses.ai_sentiment];
        }

        // Budget factor
        if (responses.budget && this.scoringWeights.budget[responses.budget]) {
            multiplier *= this.scoringWeights.budget[responses.budget];
        }

        // Timeline urgency factor
        if (responses.timeline && this.scoringWeights.timeline[responses.timeline]) {
            multiplier *= this.scoringWeights.timeline[responses.timeline];
        }

        // Calculate final score
        const finalScore = Math.round(baseScore * multiplier);
        return Math.min(Math.max(finalScore, 10), 100); // Cap between 10-100
    }

    /**
     * Generate personalized results
     */
    generateResults(responses) {
        const score = this.calculateAutomationScore(responses);
        const industry = responses.industry || 'other';
        const painPoints = Array.isArray(responses.pain_points) ? responses.pain_points : [];
        
        const results = {
            score: score,
            industry: industry,
            painPoints: painPoints,
            title: this.generatePersonalizedTitle(responses, score),
            summary: this.generateAssessmentSummary(responses, score),
            recommendations: this.generateRecommendations(responses, score),
            solutions: this.generateTailoredSolutions(responses, score),
            industryInsight: this.industryInsights[industry] || this.industryInsights['other'],
            nextSteps: this.generateNextSteps(responses, score),
            ctaMessage: this.generateCTAMessage(responses, score)
        };

        return results;
    }

    /**
     * Generate personalized title based on industry and score
     */
    generatePersonalizedTitle(responses, score) {
        const industry = responses.industry || 'other';
        const industryNames = {
            'real-estate': 'Real Estate',
            'consulting-coaching': 'Consulting & Coaching',
            'personal-brand': 'Personal Brand & Creator',
            'creative-agency': 'Creative & Marketing Agency',
            'finance': 'Finance & Private Equity',
            'construction': 'Construction',
            'other': 'Business'
        };

        const industryName = industryNames[industry] || 'Business';
        
        if (score >= 80) {
            return `🚀 Your ${industryName} Business is Ready for Advanced Automation!`;
        } else if (score >= 60) {
            return `💡 Great Automation Potential for Your ${industryName} Business!`;
        } else {
            return `🌱 Automation Opportunities for Your ${industryName} Business`;
        }
    }

    /**
     * Generate assessment summary
     */
    generateAssessmentSummary(responses, score) {
        const industry = responses.industry || 'other';
        const teamSize = responses.team_size || 'unknown';
        const _technicalLevel = responses.technical_level || 'unknown';
        const painPoints = Array.isArray(responses.pain_points) ? responses.pain_points : [];
        
        const teamSizeText = {
            'solo': 'solo entrepreneur',
            'small': 'small team (2-5 people)',
            'medium': 'medium team (6-20 people)',
            'large': 'large organization (21+ people)'
        };

        const industryText = {
            'real-estate': 'real estate',
            'consulting-coaching': 'consulting/coaching',
            'personal-brand': 'personal brand/creator',
            'creative-agency': 'creative/marketing agency',
            'finance': 'finance/private equity',
            'construction': 'construction',
            'other': 'business'
        };

        let summary = `As a ${teamSizeText[teamSize] || 'business'} in the ${industryText[industry] || 'business'} industry, `;

        if (score >= 80) {
            summary += `you have exceptional automation potential. Your technical readiness, clear pain points, and available resources create the perfect foundation for transformative automation implementation.`;
        } else if (score >= 60) {
            summary += `you're well-positioned for automation success. With strategic planning and the right tools, you can achieve significant efficiency improvements.`;
        } else {
            summary += `you have solid opportunities for automation improvement. Starting with targeted solutions will help build momentum for broader automation adoption.`;
        }

        if (painPoints.length > 0) {
            // Assuming conditionalLogic is available globally or passed
            const conditionalLogic = new ConditionalLogic();
            const industryPainPointData = conditionalLogic.getPainPointsForIndustry(industry);
            summary += ` Your primary focus areas include ${this.formatPainPointsList(painPoints, industryPainPointData)}.`;
        }

        return summary;
    }

    /**
     * Format pain points list for display
     */
    formatPainPointsList(painPoints, industryPainPointData) {
        const painPointLabels = painPoints.map(point => {
            const option = industryPainPointData.options.find(opt => opt.value === point);
            return option ? option.label.toLowerCase() : point;
        });

        if (painPointLabels.length === 1) {
            return painPointLabels;
        } else if (painPointLabels.length === 2) {
            return `${painPointLabels[0]} and ${painPointLabels[1]}`;
        } else {
            return `${painPointLabels.slice(0, -1).join(', ')}, and ${painPointLabels[painPointLabels.length - 1]}`;
        }
    }

    /**
     * Generate recommendations based on score and responses
     */
    generateRecommendations(responses, score) {
        const template = this.getRecommendationTemplate(score);
        
        const recommendations = {
            ...template,
            specific: this.generateSpecificRecommendations(responses, score)
        };

        return recommendations;
    }

    /**
     * Get recommendation template based on score
     */
    getRecommendationTemplate(score) {
        if (score >= 80) {
            return this.recommendationTemplates.highScore;
        } else if (score >= 60) {
            return this.recommendationTemplates.mediumScore;
        } else {
            return this.recommendationTemplates.lowScore;
        }
    }

    /**
     * Generate specific recommendations
     */
    generateSpecificRecommendations(responses, _score) {
        const recommendations = [];
        const _industry = responses.industry || 'other';
        const technicalLevel = responses.technical_level || 'beginner';
        const budget = parseInt(responses.budget) || 1500;
        const _timeline = responses.timeline || 'quarter';

        // Budget-based recommendations
        if (budget >= 3000) {
            recommendations.push({
                category: 'Enterprise Solutions',
                items: [
                    'Custom workflow automation development',
                    'AI-powered business intelligence tools',
                    'Advanced integration platforms',
                    'Dedicated automation consulting'
                ]
            });
        } else if (budget >= 1500) {
            recommendations.push({
                category: 'Professional Tools',
                items: [
                    'Premium automation platforms (Zapier, Make.com)',
                    'Industry-specific software integrations',
                    'Professional consulting sessions',
                    'Team training and onboarding'
                ]
            });
        } else {
            recommendations.push({
                category: 'Starter Solutions',
                items: [
                    'Entry-level automation tools',
                    'Template-based workflows',
                    'Self-paced learning resources',
                    'Community support access'
                ]
            });
        }

        // Technical level recommendations
        if (technicalLevel === 'advanced') {
            recommendations.push({
                category: 'Advanced Implementation',
                items: [
                    'Custom API integrations',
                    'Advanced workflow logic',
                    'Database automation',
                    'Custom dashboard development'
                ]
            });
        } else if (technicalLevel === 'intermediate') {
            recommendations.push({
                category: 'Intermediate Solutions',
                items: [
                    'Multi-step workflow automation',
                    'Conditional logic implementation',
                    'Integration with existing tools',
                    'Performance monitoring setup'
                ]
            });
        } else {
            recommendations.push({
                category: 'Beginner-Friendly Options',
                items: [
                    'No-code automation platforms',
                    'Pre-built workflow templates',
                    'Guided setup assistance',
                    'Simple integration tools'
                ]
            });
        }

        return recommendations;
    }

    /**
     * Generate tailored solutions
     */
    generateTailoredSolutions(responses, _score) {
        const solutions = [];
        const industry = responses.industry || 'other';
        const _painPoints = Array.isArray(responses.pain_points) ? responses.pain_points : [];
        const budget = parseInt(responses.budget) || 1500;
        const timeline = responses.timeline || 'quarter';

        // High-urgency, high-budget solutions
        if (timeline === 'immediate' && budget >= 3000) {
            solutions.push({
                title: '🚀 Rapid Implementation Package',
                description: 'Get started with automation within 1-2 weeks with our expedited implementation service.',
                features: [
                    'Priority consultation and setup',
                    'Custom workflow development',
                    'Dedicated implementation manager',
                    '24/7 support during launch'
                ],
                timeframe: '1-2 weeks',
                investment: '$3,000 - $5,000+'
            });
        }

        // Standard professional solution
        if (budget >= 1500) {
            solutions.push({
                title: '💼 Professional Automation Solution',
                description: 'Comprehensive automation implementation tailored to your specific business needs.',
                features: [
                    'Custom workflow design',
                    'Tool integration and setup',
                    'Team training sessions',
                    'Ongoing optimization support'
                ],
                timeframe: '2-6 weeks',
                investment: '$1,500 - $3,000'
            });
        }

        // Starter solution for smaller budgets
        solutions.push({
            title: '🌱 Automation Starter Package',
            description: 'Perfect entry point for businesses ready to dip their toes into automation.',
            features: [
                'Pre-built workflow templates',
                'Setup guidance and support',
                'Basic training resources',
                'Community access'
            ],
            timeframe: '1-3 weeks',
            investment: '$500 - $1,500'
        });

        // Industry-specific solutions
        if (industry && this.industryInsights[industry]) {
            const insight = this.industryInsights[industry];
            solutions.push({
                title: `🎯 ${this.getIndustryDisplayName(industry)} Specialist Package`,
                description: `Automation solutions specifically designed for ${this.getIndustryDisplayName(industry).toLowerCase()} businesses.`,
                features: [
                    ...insight.commonAutomations.slice(0, 3),
                    'Industry-specific templates and workflows'
                ],
                timeframe: insight.timeToValue,
                roi: insight.averageROI
            });
        }

        return solutions;
    }

    /**
     * Generate next steps based on responses
     */
    generateNextSteps(responses, _score) {
        const steps = [];
        const timeline = responses.timeline || 'quarter';
        const technicalLevel = responses.technical_level || 'beginner';
        
        if (timeline === 'immediate') {
            steps.push({
                title: 'Schedule Your Strategy Call',
                description: 'Book a consultation to fast-track your automation implementation',
                priority: 'high',
                timeframe: 'This week'
            });
        } else {
            steps.push({
                title: 'Join Our Automation Community',
                description: 'Connect with other business owners and access exclusive resources',
                priority: 'medium',
                timeframe: 'This week'
            });
        }

        if (technicalLevel === 'beginner') {
            steps.push({
                title: 'Start with Our Free Training',
                description: 'Learn automation fundamentals through our beginner-friendly course',
                priority: 'medium',
                timeframe: '1-2 weeks'
            });
        }

        steps.push({
            title: 'Identify Your First Automation',
            description: 'Focus on your biggest pain point for maximum initial impact',
            priority: 'high',
            timeframe: '1 week'
        });

        steps.push({
            title: 'Plan Your Implementation',
            description: 'Create a roadmap for gradually expanding your automation',
            priority: 'medium',
            timeframe: '2-3 weeks'
        });

        return steps;
    }

    /**
     * Generate CTA message based on responses
     */
    generateCTAMessage(responses, score) {
        const timeline = responses.timeline || 'quarter';
        const budget = parseInt(responses.budget) || 1500;
        
        if (timeline === 'immediate' && budget >= 3000) {
            return {
                primary: 'Book Your Rapid Implementation Call',
                secondary: 'Join Our Premium Community',
                message: 'Ready to transform your business operations? Let\'s get started immediately with our expedited service.'
            };
        } else if (score >= 80) {
            return {
                primary: 'Join Our Automation Community',
                secondary: 'Schedule a Strategy Session',
                message: 'You\'re perfectly positioned for automation success. Join hundreds of business owners already transforming their operations.'
            };
        } else if (score >= 60) {
            return {
                primary: 'Get Your Free Automation Plan',
                secondary: 'Join Our Community',
                message: 'Let\'s create a customized automation roadmap for your business growth.'
            };
        } else {
            return {
                primary: 'Start with Free Resources',
                secondary: 'Join Our Beginner Community',
                message: 'Begin your automation journey with our comprehensive free training and supportive community.'
            };
        }
    }

    /**
     * Get display name for industry
     */
    getIndustryDisplayName(industry) {
        const displayNames = {
            'real-estate': 'Real Estate',
            'consulting-coaching': 'Consulting & Coaching',
            'personal-brand': 'Personal Brand & Creator',
            'creative-agency': 'Creative & Marketing Agency',
            'finance': 'Finance & Private Equity',
            'construction': 'Construction',
            'other': 'Business'
        };
        
        return displayNames[industry] || 'Business';
    }

    /**
     * Generate downloadable PDF content
     */
    generatePDFContent(results, responses) {
        const pdfData = {
            title: results.title,
            score: results.score,
            generatedDate: new Date().toLocaleDateString(),
            businessInfo: {
                industry: this.getIndustryDisplayName(responses.industry || 'other'),
                teamSize: responses.team_size || 'Unknown',
                role: responses.role || 'Unknown',
                automationGoal: responses.automation_goal || 'Not specified'
            },
            currentAutomation: {
                currentTools: Array.isArray(responses.current_tools) && responses.current_tools.length > 0 ? responses.current_tools.join(', ') : 'None',
                technicalLevel: responses.technical_level || 'Unknown',
                aiSentiment: responses.ai_sentiment || 'Unknown'
            },
            painPoints: {
                selectedPainPoints: results.painPoints.length > 0 ? this.formatPainPointsList(results.painPoints, new ConditionalLogic().getPainPointsForIndustry(responses.industry || 'other')) : 'None selected',
                painPointDetail: responses.pain_point_detail || 'Not specified'
            },
            valueInvestment: {
                monthlyValue: responses.monthly_value || 'Unknown',
                timeline: responses.timeline || 'Unknown',
                budget: responses.budget || 'Unknown'
            },
            summary: results.summary,
            recommendations: results.recommendations.nextSteps,
            tailoredSolutions: results.solutions.map(sol => ({
                title: sol.title,
                description: sol.description,
                features: sol.features.join('; '),
                timeframe: sol.timeframe,
                investment: sol.investment || sol.roi
            })),
            industryInsight: results.industryInsight
        };

        const htmlContent = `
            <h1>${pdfData.title}</h1>
            <p><strong>Generated On:</strong> ${pdfData.generatedDate}</p>
            <hr>
            <h2>Automation Readiness Score: ${pdfData.score}/100</h2>
            <p>${pdfData.summary}</p>
            <hr>
            <h3>Your Business Information</h3>
            <ul>
                <li><strong>Industry:</strong> ${pdfData.businessInfo.industry}</li>
                <li><strong>Team Size:</strong> ${pdfData.businessInfo.teamSize}</li>
                <li><strong>Role:</strong> ${pdfData.businessInfo.role}</li>
                <li><strong>Primary Automation Goal:</strong> ${pdfData.businessInfo.automationGoal}</li>
            </ul>
            <hr>
            <h3>Current Automation Landscape</h3>
            <ul>
                <li><strong>Current Tools:</strong> ${pdfData.currentAutomation.currentTools}</li>
                <li><strong>Technical Comfort Level:</strong> ${pdfData.currentAutomation.technicalLevel}</li>
                <li><strong>AI Sentiment:</strong> ${pdfData.currentAutomation.aiSentiment}</li>
            </ul>
            <hr>
            <h3>Your Biggest Challenges</h3>
            <ul>
                <li><strong>Selected Pain Points:</strong> ${pdfData.painPoints.selectedPainPoints}</li>
                <li><strong>Detailed Challenge:</strong> ${pdfData.painPoints.painPointDetail}</li>
            </ul>
            <hr>
            <h3>Value & Investment Assessment</h3>
            <ul>
                <li><strong>Potential Monthly Value:</strong> $${pdfData.valueInvestment.monthlyValue}/month</li>
                <li><strong>Implementation Timeline:</strong> ${pdfData.valueInvestment.timeline}</li>
                <li><strong>Monthly Budget:</strong> $${pdfData.valueInvestment.budget}</li>
            </ul>
            <hr>
            <h3>Recommended Next Steps</h3>
            <ul>
                ${pdfData.recommendations.map(step => `<li>${step}</li>`).join('')}
            </ul>
            <hr>
            <h3>Tailored Solutions</h3>
            ${pdfData.tailoredSolutions.map(sol => `
                <h4>${sol.title}</h4>
                <p>${sol.description}</p>
                <ul>
                    <li><strong>Features:</strong> ${sol.features}</li>
                    <li><strong>Timeframe:</strong> ${sol.timeframe}</li>
                    <li><strong>Investment:</strong> ${sol.investment}</li>
                </ul>
            `).join('')}
            <hr>
            <h3>Industry Insights for ${pdfData.businessInfo.industry}</h3>
            <ul>
                <li><strong>Common Automations:</strong> ${pdfData.industryInsight.commonAutomations.join('; ')}</li>
                <li><strong>Average ROI:</strong> ${pdfData.industryInsight.averageROI}</li>
                <li><strong>Time to Value:</strong> ${pdfData.industryInsight.timeToValue}</li>
                <li><strong>Success Stories:</strong> ${pdfData.industryInsight.successStories}</li>
            </ul>
        `;

        return htmlContent;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultsGenerator;
} else {
    window.ResultsGenerator = ResultsGenerator;
}