import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lead, LeadStatus } from '@/types';
import { LeadStatus as LeadStatusEnum } from '@/types';

interface LeadState {
    // State
    leads: Lead[];
    isLoading: boolean;
    selectedLead: Lead | null;
    filters: {
        status: LeadStatus | null;
        search: string;
    };

    // Actions
    addLead: (lead: Omit<Lead, 'id'>) => Lead;
    updateLead: (id: string, updates: Partial<Lead>) => void;
    deleteLead: (id: string) => void;
    setLeads: (leads: Lead[]) => void;
    selectLead: (lead: Lead | null) => void;
    updateStatus: (id: string, status: LeadStatus) => void;
    setFilter: (filters: Partial<LeadState['filters']>) => void;
    clearFilters: () => void;

    // Computed
    getFilteredLeads: () => Lead[];
    getLeadsByStatus: (status: LeadStatus) => Lead[];
}

// Initial mock data
const INITIAL_LEADS: Lead[] = [
    {
        id: 'l-1',
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'sarah@skynet.com',
        company: 'Cyberdyne Systems',
        position: 'Directrice Ops',
        status: LeadStatusEnum.INTERESTED,
        score: 88,
        lastContacted: '2023-10-22',
    },
    {
        id: 'l-2',
        firstName: 'James',
        lastName: 'Holden',
        email: 'jim@rocinante.shipping',
        company: 'Rocinante Inc',
        position: 'Capitaine',
        status: LeadStatusEnum.NEW,
        score: 45,
    },
    {
        id: 'l-3',
        firstName: 'Ellen',
        lastName: 'Ripley',
        email: 'ripley@weyland.yutani.com',
        company: 'Weyland-Yutani',
        position: 'Officier',
        status: LeadStatusEnum.CONTACTED,
        score: 62,
        lastContacted: '2023-10-21',
    },
    {
        id: 'l-4',
        firstName: 'Jean-Luc',
        lastName: 'Picard',
        email: 'picard@starfleet.org',
        company: 'Fédération',
        position: 'Capitaine',
        status: LeadStatusEnum.CONVERTED,
        score: 99,
        lastContacted: '2023-10-18',
    },
];

export const useLeadStore = create<LeadState>()(
    persist(
        (set, get) => ({
            // Initial State
            leads: INITIAL_LEADS,
            isLoading: false,
            selectedLead: null,
            filters: {
                status: null,
                search: '',
            },

            // Actions
            addLead: (leadData) => {
                const newLead: Lead = {
                    ...leadData,
                    id: `l-${Date.now()}`,
                };

                set((state) => ({
                    leads: [newLead, ...state.leads],
                }));

                return newLead;
            },

            updateLead: (id, updates) => {
                set((state) => ({
                    leads: state.leads.map((lead) =>
                        lead.id === id ? { ...lead, ...updates } : lead
                    ),
                }));
            },

            deleteLead: (id) => {
                set((state) => ({
                    leads: state.leads.filter((lead) => lead.id !== id),
                    selectedLead: state.selectedLead?.id === id ? null : state.selectedLead,
                }));
            },

            setLeads: (leads) => {
                set({ leads });
            },

            selectLead: (lead) => {
                set({ selectedLead: lead });
            },

            updateStatus: (id, status) => {
                set((state) => ({
                    leads: state.leads.map((lead) =>
                        lead.id === id ? { ...lead, status } : lead
                    ),
                }));
            },

            setFilter: (newFilters) => {
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                }));
            },

            clearFilters: () => {
                set({
                    filters: { status: null, search: '' },
                });
            },

            // Computed
            getFilteredLeads: () => {
                const { leads, filters } = get();

                return leads.filter((lead) => {
                    // Status filter
                    if (filters.status && lead.status !== filters.status) {
                        return false;
                    }

                    // Search filter
                    if (filters.search) {
                        const searchLower = filters.search.toLowerCase();
                        const matchesSearch =
                            lead.firstName.toLowerCase().includes(searchLower) ||
                            lead.lastName.toLowerCase().includes(searchLower) ||
                            lead.email.toLowerCase().includes(searchLower) ||
                            lead.company.toLowerCase().includes(searchLower);

                        if (!matchesSearch) return false;
                    }

                    return true;
                });
            },

            getLeadsByStatus: (status) => {
                return get().leads.filter((lead) => lead.status === status);
            },
        }),
        {
            name: 'astroleads-leads',
        }
    )
);
