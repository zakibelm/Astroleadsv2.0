import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Lazy load views for code splitting
const Dashboard = React.lazy(() => import('@/views/Dashboard'));
const Campaigns = React.lazy(() => import('@/views/Campaigns'));
const CampaignDetail = React.lazy(() => import('@/views/CampaignDetail'));
const Leads = React.lazy(() => import('@/views/LeadsBoard'));
const Analytics = React.lazy(() => import('@/views/Analytics'));
const AiStudio = React.lazy(() => import('@/views/AiStudio'));
const Settings = React.lazy(() => import('@/views/Settings'));
const Agents = React.lazy(() => import('@/views/Agents'));
const Templates = React.lazy(() => import('@/views/Templates'));
const LoginPage = React.lazy(() => import('@/views/LoginPage'));

// Loading fallback
const PageLoader = () => (
    <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-astro-gold border-t-transparent" />
    </div>
);

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <React.Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected Routes with Layout */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/campaigns" element={<Campaigns />} />
                            <Route path="/campaigns/:id" element={<CampaignDetail />} />
                            <Route path="/templates" element={<Templates />} />
                            <Route path="/agents" element={<Agents />} />
                            <Route path="/leads" element={<Leads />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/ai-studio" element={<AiStudio />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </React.Suspense>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default App;
