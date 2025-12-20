/**
 * Beta Program Landing Page
 * Early adopter program to collect reviews and validate positioning
 */

import React, { useState } from 'react';
import { CheckCircle, Zap, Code, Lock, ArrowRight } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { supabase } from '@/lib/supabase';

const BetaPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        company: '',
        role: '',
        useCase: '',
        techStack: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Save to Supabase
            const { error } = await supabase
                .from('beta_signups')
                .insert({
                    email: formData.email,
                    company: formData.company,
                    role: formData.role,
                    use_case: formData.useCase,
                    tech_stack: formData.techStack,
                    status: 'pending'
                });

            if (error) throw error;

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting beta signup:', error);
            alert('Erreur lors de la soumission. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-astro-900 via-astro-950 to-black flex items-center justify-center p-8">
                <div className="max-w-2xl text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Application Received! 🎉
                    </h1>
                    <p className="text-xl text-neutral-300 mb-8">
                        We'll review your application within 24h and send you access credentials.
                    </p>
                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <p className="text-neutral-400 mb-4">
                            Check your inbox for:
                        </p>
                        <ul className="text-left text-neutral-300 space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                Welcome email with setup guide
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                API credentials (3 months free)
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-400" />
                                Beta Discord invite
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-astro-900 via-astro-950 to-black">
            {/* Hero */}
            <div className="max-w-6xl mx-auto px-8 pt-20 pb-12">
                <div className="text-center mb-16">
                    <div className="inline-block bg-astro-gold/20 border border-astro-gold/30 rounded-full px-4 py-2 mb-6">
                        <p className="text-astro-gold font-semibold text-sm">
                            ⚡ Limited Spots - Early Adopter Program
                        </p>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Build Your Lead Gen Stack<br />
                        <span className="bg-gradient-to-r from-astro-gold to-yellow-400 bg-clip-text text-transparent">
                            The Composable Way
                        </span>
                    </h1>

                    <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
                        Join 50 technical teams testing the API-first alternative to ZoomInfo.
                        Get <strong className="text-white">3 months free</strong> + priority support.
                    </p>

                    <div className="flex gap-4 justify-center items-center flex-wrap">
                        <div className="flex items-center gap-2 text-neutral-400">
                            <CheckCircle size={20} className="text-green-400" />
                            <span>No credit card</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <CheckCircle size={20} className="text-green-400" />
                            <span>Full API access</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <CheckCircle size={20} className="text-green-400" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <Zap className="w-12 h-12 text-astro-gold mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">3 Months Free</h3>
                        <p className="text-neutral-400">
                            Full Pro access ($149/mo value). No strings attached.
                        </p>
                    </div>

                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <Code className="w-12 h-12 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">n8n/Make Ready</h3>
                        <p className="text-neutral-400">
                            Pre-built templates to get started in minutes.
                        </p>
                    </div>

                    <div className="bg-astro-800/50 border border-astro-700 rounded-xl p-6">
                        <Lock className="w-12 h-12 text-green-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Priority Support</h3>
                        <p className="text-neutral-400">
                            Direct access to founders + Beta Discord.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto bg-astro-800/50 border border-astro-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Apply for Beta Access</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Work Email *"
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Company Name *"
                            placeholder="Acme Inc"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                        />

                        <Input
                            label="Your Role *"
                            placeholder="e.g., Growth Engineer, Technical Founder, CTO"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        />

                        <Textarea
                            label="Primary Use Case *"
                            placeholder="e.g., Lead gen for SaaS sales team, prospecting for agency clients, building custom lead scoring pipeline..."
                            value={formData.useCase}
                            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                            rows={4}
                            required
                        />

                        <Textarea
                            label="Current Tech Stack (optional)"
                            placeholder="e.g., n8n, HubSpot, Slack, Python scripts..."
                            value={formData.techStack}
                            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                            rows={2}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight size={18} />}
                        >
                            Apply for Beta Access
                        </Button>

                        <p className="text-xs text-neutral-500 text-center">
                            By applying, you agree to test the platform and provide feedback.
                            We'll invite you to leave a review after your first qualified lead.
                        </p>
                    </form>
                </div>

                {/* Social Proof */}
                <div className="mt-16 text-center">
                    <p className="text-neutral-500 mb-4">Trusted by technical teams at</p>
                    <div className="flex gap-8 justify-center items-center flex-wrap opacity-50">
                        <span className="text-white font-semibold">YC Startups</span>
                        <span className="text-white font-semibold">SaaS Scale-ups</span>
                        <span className="text-white font-semibold">Growth Agencies</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BetaPage;
