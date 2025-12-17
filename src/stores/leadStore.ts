import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lead, LeadStatus } from '@/types';
import { LeadStatus as LeadStatusEnum } from '@/types';
import { fetchLeadsFromDB, addLeadToDB, updateLeadInDB, deleteLeadFromDB } from '@/services/leadService';

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
    fetchLeads: () => Promise<void>;
    addLead: (lead: Omit<Lead, 'id'>) => Promise<Lead>;
    updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
    deleteLead: (id: string) => Promise<void>;
    setLeads: (leads: Lead[]) => void;
    selectLead: (lead: Lead | null) => void;
    updateStatus: (id: string, status: LeadStatus) => Promise<void>;
    setFilter: (filters: Partial<LeadState['filters']>) => void;
    clearFilters: () => void;

    // Computed
    getFilteredLeads: () => Lead[];
    getLeadsByStatus: (status: LeadStatus) => Lead[];
}

// Initial mock data
// Initial data (Empty for Production)
const INITIAL_LEADS: Lead[] = [];

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
            fetchLeads: async () => {
                set({ isLoading: true });
                try {
                    const leads = await fetchLeadsFromDB();
                    set({ leads, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch leads:', error);
                    set({ isLoading: false });
                }
            },

            addLead: async (leadData) => {
                set({ isLoading: true });
                try {
                    const newLead = await addLeadToDB(leadData);
                    set((state) => ({
                        leads: [newLead, ...state.leads],
                        isLoading: false,
                    }));
                    return newLead;
                } catch (error) {
                    console.error('Failed to add lead:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            updateLead: async (id, updates) => {
                set({ isLoading: true });
                try {
                    await updateLeadInDB(id, updates);
                    set((state) => ({
                        leads: state.leads.map((lead) =>
                            lead.id === id ? { ...lead, ...updates } : lead
                        ),
                        isLoading: false,
                    }));
                } catch (error) {
                    console.error('Failed to update lead:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            deleteLead: async (id) => {
                set({ isLoading: true });
                try {
                    await deleteLeadFromDB(id);
                    set((state) => ({
                        leads: state.leads.filter((lead) => lead.id !== id),
                        selectedLead: state.selectedLead?.id === id ? null : state.selectedLead,
                        isLoading: false,
                    }));
                } catch (error) {
                    console.error('Failed to delete lead:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            setLeads: (leads) => {
                set({ leads });
            },

            selectLead: (lead) => {
                set({ selectedLead: lead });
            },

            updateStatus: async (id, status) => {
                set({ isLoading: true });
                try {
                    await updateLeadInDB(id, { status });
                    set((state) => ({
                        leads: state.leads.map((lead) =>
                            lead.id === id ? { ...lead, status } : lead
                        ),
                        isLoading: false,
                    }));
                } catch (error) {
                    console.error('Failed to update status:', error);
                    set({ isLoading: false });
                    throw error;
                }
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
                const searchLower = filters.search ? filters.search.toLowerCase() : '';

                return leads.filter((lead) => {
                    // Status filter
                    if (filters.status && lead.status !== filters.status) {
                        return false;
                    }

                    // Search filter
                    if (searchLower) {
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
