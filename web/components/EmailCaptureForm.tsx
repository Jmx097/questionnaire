'use client';
import React, { useState } from 'react';
import { useQuiz } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface EmailCaptureFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    optInEmails: boolean;
    acceptPrivacy: boolean;
  }) => Promise<void>;
}

export function EmailCaptureForm({ onSubmit }: EmailCaptureFormProps) {
  const { a } = useQuiz();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    optInEmails: false,
    acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple profile calculation
  const getScore = () => {
    let total = 0;
    if (a.teamSize === 'solo') total += 0;
    else if (a.teamSize === '2-5') total += 1;
    else if (a.teamSize === '6-20' || a.teamSize === '21+') total += 2;
    
    const budget = a.valuePerMonth ?? 0;
    if (budget >= 5000) total += 3;
    else if (budget >= 2000) total += 2;
    else if (budget >= 500) total += 1;
    
    if (a.urgency === 'asap' || a.urgency === '30d') total += 2;
    else if (a.urgency === 'quarter') total += 1;
    
    return Math.round((total / 13) * 100);
  };

  const getSegmentName = () => {
    const map = {
      real_estate: 'Real Estate',
      consulting: 'Consulting / Coaching',
      personal_brand: 'Personal Brand / Creator',
      agency: 'Creative / Marketing Agency',
      finance: 'Private Equity / Finance',
      construction: 'Home Construction / Contractor',
      other: 'Other'
    };
    return a.segment ? (map[a.segment as keyof typeof map] ?? 'Other') : 'Unknown';
  };

  const getTier = () => {
    const score = getScore();
    return score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low';
  };

  const getOffer = () => {
    const tier = getTier();
    return tier === 'low' ? 'Plinko Pocket' : tier === 'mid' ? 'Playbook Pro' : 'Playbook Plus';
  };

  // Simple validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = 'You must accept the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: boolean | string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting email capture:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const score = getScore();
  const profilePreview = {
    segment: getSegmentName(),
    goal: getOffer(),
    pain: a.pain || 'Not specified',
    score: `${score}/100`,
    band: getTier(),
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Profile Preview */}
        <div className="order-2 lg:order-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Your Profile Preview</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {profilePreview.segment.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Business Segment</p>
                  <p className="text-lg font-medium">{profilePreview.segment}</p>
                </div>
              </div>

              <div>
                <p className="text-white/70 text-sm">AI Goal</p>
                <p className="text-lg font-medium">{profilePreview.goal}</p>
              </div>

              <div>
                <p className="text-white/70 text-sm">Main Pain Point</p>
                <p className="text-lg font-medium">{profilePreview.pain}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Readiness Score</p>
                  <p className="text-2xl font-bold text-green-400">{profilePreview.score}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Band</p>
                  <p className="text-lg font-semibold text-blue-400">{profilePreview.band}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
                <h3 className="font-semibold mb-2">🚀 Next Steps</h3>
                <p className="text-white/80 text-sm">
                  Get your personalized automation plan delivered to your email, plus access to our exclusive AI automation community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Capture Form */}
        <div className="order-1 lg:order-2">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h1 className="text-3xl font-semibold mb-4">Get Your Results</h1>
            <p className="text-white/70 mb-8">
              Enter your details to receive your personalized automation report and join our exclusive community.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="optInEmails"
                  checked={formData.optInEmails}
                  onChange={(e) => handleInputChange('optInEmails', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-500 bg-transparent border-white/30 rounded focus:ring-blue-500"
                />
                <label htmlFor="optInEmails" className="text-sm text-white/70">
                  I'd like to receive helpful automation tips and updates via email
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-500 bg-transparent border-white/30 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="acceptPrivacy" className="text-sm text-white/70">
                  I accept the{' '}
                  <a href="/privacy" className="text-blue-400 underline" target="_blank">
                    Privacy Policy
                  </a>{' '}
                  and consent to processing my data *
                </label>
              </div>
              {errors.acceptPrivacy && (
                <p className="text-red-400 text-sm">{errors.acceptPrivacy}</p>
              )}

              {errors.submit && (
                <p className="text-red-400 text-sm">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Get My Results'}
              </button>
            </form>

            <p className="text-white/50 text-xs mt-6 text-center">
              We'll send you a secure link to access your full results for 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}