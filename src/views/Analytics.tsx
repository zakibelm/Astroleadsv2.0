import React from 'react';
import { TrendingUp, Users, MousePointerClick, Clock } from 'lucide-react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, Badge } from '@/components/ui';
import { formatPercentage } from '@/utils';
import { CHART_COLORS } from '@/lib/constants';

const campaignData = [
    { name: 'Q3 Enterprise', value: 45 },
    { name: 'Startup Invite', value: 28 },
    { name: 'SaaS Webinar', value: 18 },
    { name: 'Product Launch', value: 9 },
];

const sourceData = [
    { source: 'LinkedIn', leads: 450, color: '#0077B5' },
    { source: 'Email', leads: 320, color: CHART_COLORS.primary },
    { source: 'Google Maps', leads: 280, color: '#34A853' },
    { source: 'Facebook', leads: 150, color: '#1877F2' },
];

const monthlyData = [
    { month: 'Jan', conversions: 32, leads: 120 },
    { month: 'Fév', conversions: 45, leads: 150 },
    { month: 'Mar', conversions: 28, leads: 90 },
    { month: 'Avr', conversions: 65, leads: 200 },
    { month: 'Mai', conversions: 52, leads: 180 },
    { month: 'Jun', conversions: 78, leads: 250 },
];

interface MetricCardProps {
    title: string;
    value: string;
    subvalue: string;
    icon: React.ReactNode;
    trend: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subvalue, icon, trend }) => (
    <Card className="group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-astro-gold/10 border border-astro-gold/20 flex items-center justify-center text-astro-gold group-hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
            <Badge variant={trend >= 0 ? 'success' : 'danger'} size="sm">
                {trend >= 0 ? '+' : ''}{trend}%
            </Badge>
        </div>
        <p className="text-xs text-neutral-500 mt-2">{subvalue}</p>
    </Card>
);

const Analytics: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytique</h1>
                <p className="text-neutral-500">Analysez les performances de vos campagnes</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Taux de Conversion"
                    value={formatPercentage(38.5)}
                    subvalue="vs 32.1% le mois dernier"
                    icon={<TrendingUp size={24} />}
                    trend={19.9}
                />
                <MetricCard
                    title="Nouveaux Prospects"
                    value="1,248"
                    subvalue="Cette semaine"
                    icon={<Users size={24} />}
                    trend={12.3}
                />
                <MetricCard
                    title="Temps de Réponse"
                    value="2.4h"
                    subvalue="Moyenne"
                    icon={<Clock size={24} />}
                    trend={-8.5}
                />
                <MetricCard
                    title="Taux de Clics"
                    value={formatPercentage(24.8)}
                    subvalue="Sur les emails"
                    icon={<MousePointerClick size={24} />}
                    trend={5.2}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Performance */}
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Performance par Campagne
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={campaignData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill={CHART_COLORS.primary}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {campaignData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.warning][index]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e1e1e',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    borderRadius: '12px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* Leads by Source */}
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-6">
                        Leads par Source
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sourceData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <XAxis type="number" stroke="#666" />
                            <YAxis type="category" dataKey="source" stroke="#666" width={80} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e1e1e',
                                    border: '1px solid rgba(255,215,0,0.2)',
                                    borderRadius: '12px',
                                }}
                            />
                            <Bar dataKey="leads" radius={[0, 4, 4, 0]}>
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
                <h3 className="text-lg font-semibold text-white mb-6">
                    Tendances Mensuelles
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e1e1e',
                                border: '1px solid rgba(255,215,0,0.2)',
                                borderRadius: '12px',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="leads" name="Leads" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="conversions" name="Conversions" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default Analytics;
