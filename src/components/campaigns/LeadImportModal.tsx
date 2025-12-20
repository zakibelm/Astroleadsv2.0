/**
 * Lead Import Modal - Multi-step wizard for importing leads from CSV
 */

import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, AlertCircle, Download, X } from 'lucide-react';
import { Card, Button, Modal, useToast } from '@/components/ui';
import {
    parseCSV,
    validateCSVData,
    mapRowToLead,
    downloadSampleCSV,
    type ParsedCSV,
    type ColumnMapping,
    type CSVRow,
} from '@/services/csvService';
import { enrichLeadsBatch, type EnrichmentResult } from '@/services/enrichmentService';
import { useLeadStore } from '@/stores/leadStore';

interface LeadImportModalProps {
    campaignId: string;
    onClose: () => void;
    onSuccess: (imported: number) => void;
}

type Step = 'upload' | 'mapping' | 'options' | 'preview' | 'importing' | 'complete';

export const LeadImportModal: React.FC<LeadImportModalProps> = ({
    campaignId,
    onClose,
    onSuccess,
}) => {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { bulkImportLeads } = useLeadStore();

    // State
    const [step, setStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedCSV | null>(null);
    const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
    const [options, setOptions] = useState({
        validateEmails: false,
        findMissingEmails: false,
        skipDuplicates: true,
    });
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
    const [importResults, setImportResults] = useState({
        inserted: 0,
        skipped: 0,
        errors: 0,
    });

    // Handle file upload
    const handleFileSelect = async (selectedFile: File) => {
        if (!selectedFile.name.endsWith('.csv')) {
            toast.error('Format invalide', 'Veuillez importer un fichier CSV');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error('Fichier trop volumineux', 'Maximum 10 MB');
            return;
        }

        try {
            setFile(selectedFile);
            const parsed = await parseCSV(selectedFile);

            if (parsed.errors.length > 0) {
                console.warn('CSV parsing warnings:', parsed.errors);
            }

            setParsedData(parsed);
            setColumnMapping(parsed.detectedColumns);
            setStep('mapping');
        } catch (error) {
            toast.error('Erreur', error instanceof Error ? error.message : 'Impossible de lire le fichier');
        }
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    // Handle import
    const handleImport = async () => {
        if (!parsedData) return;

        setStep('importing');

        try {
            // Map CSV rows to leads
            let leads = parsedData.rows.map(row => mapRowToLead(row, columnMapping));

            // Enrich if requested
            if (options.validateEmails || options.findMissingEmails) {
                const enrichmentResults = await enrichLeadsBatch(leads, {
                    validateEmail: options.validateEmails,
                    findEmail: options.findMissingEmails,
                    onProgress: (current, total) => {
                        setImportProgress({ current, total });
                    },
                });

                // Apply enrichment results
                leads = leads.map((lead, index) => {
                    const enrichment = enrichmentResults[index];
                    if (enrichment && enrichment.success) {
                        return {
                            ...lead,
                            email: enrichment.foundEmail || enrichment.validatedEmail || lead.email,
                        };
                    }
                    return lead;
                });
            }

            // Import to database
            const result = await bulkImportLeads(campaignId, leads, {
                skipDuplicates: options.skipDuplicates,
            });

            setImportResults(result);
            setStep('complete');
            onSuccess(result.inserted);
        } catch (error) {
            toast.error('Erreur d\'importation', error instanceof Error ? error.message : 'Une erreur est survenue');
            setStep('preview');
        }
    };

    // Render steps
    const renderStep = () => {
        switch (step) {
            case 'upload':
                return (
                    <div className="space-y-6">
                        <div
                            className="border-2 border-dashed border-astro-700 rounded-xl p-12 text-center cursor-pointer hover:border-astro-gold/50 transition-colors"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-16 h-16 mx-auto text-astro-gold mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Déposez votre fichier CSV ici
                            </h3>
                            <p className="text-neutral-400 mb-4">
                                ou cliquez pour sélectionner un fichier
                            </p>
                            <p className="text-xs text-neutral-500">
                                Maximum 10 MB • Format CSV uniquement
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                className="hidden"
                            />
                        </div>

                        {/* Sample templates */}
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-3">
                                Télécharger un modèle :
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Download size={14} />}
                                    onClick={() => downloadSampleCSV('linkedin')}
                                >
                                    LinkedIn
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Download size={14} />}
                                    onClick={() => downloadSampleCSV('google-maps')}
                                >
                                    Google Maps
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Download size={14} />}
                                    onClick={() => downloadSampleCSV('social-media')}
                                >
                                    Social Media
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case 'mapping':
                const validation = parsedData ? validateCSVData(parsedData.rows, columnMapping) : null;

                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Mappage des colonnes
                            </h3>
                            <p className="text-sm text-neutral-400">
                                {parsedData?.rows.length} lignes détectées
                            </p>
                        </div>

                        {/* Column mappings */}
                        <div className="space-y-3">
                            {Object.entries({
                                firstName: 'Prénom',
                                lastName: 'Nom',
                                email: 'Email',
                                company: 'Entreprise',
                                position: 'Poste',
                                phone: 'Téléphone',
                                linkedin_url: 'LinkedIn',
                                website: 'Site web',
                            }).map(([field, label]) => (
                                <div key={field} className="flex items-center gap-3">
                                    <label className="w-32 text-sm text-neutral-400">{label}</label>
                                    <select
                                        value={columnMapping[field as keyof ColumnMapping] || ''}
                                        onChange={(e) => {
                                            setColumnMapping({
                                                ...columnMapping,
                                                [field]: e.target.value || undefined,
                                            });
                                        }}
                                        className="flex-1 neon-input text-sm"
                                    >
                                        <option value="">-- Non mappé --</option>
                                        {parsedData?.headers.map(header => (
                                            <option key={header} value={header}>
                                                {header}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Validation warnings */}
                        {validation && validation.warnings.length > 0 && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                                            Avertissements
                                        </h4>
                                        <ul className="text-xs text-yellow-300 space-y-1">
                                            {validation.warnings.slice(0, 5).map((warning, i) => (
                                                <li key={i}>• {warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('upload')}>
                                Retour
                            </Button>
                            <Button
                                onClick={() => setStep('options')}
                                disabled={!validation?.valid}
                                className="flex-1"
                            >
                                Continuer
                            </Button>
                        </div>
                    </div>
                );

            case 'options':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white">
                            Options d'enrichissement
                        </h3>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.validateEmails}
                                    onChange={(e) => setOptions({ ...options, validateEmails: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Valider les emails avec Hunter.io
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Vérifie que les emails sont valides (1 crédit/email)
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.findMissingEmails}
                                    onChange={(e) => setOptions({ ...options, findMissingEmails: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Trouver les emails manquants
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Recherche automatique avec prénom + nom + entreprise (1 crédit/email)
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={options.skipDuplicates}
                                    onChange={(e) => setOptions({ ...options, skipDuplicates: e.target.checked })}
                                    className="w-5 h-5"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Ignorer les doublons
                                    </p>
                                    <p className="text-xs text-neutral-400">
                                        Ne pas importer les emails déjà présents
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('mapping')}>
                                Retour
                            </Button>
                            <Button onClick={() => setStep('preview')} className="flex-1">
                                Continuer
                            </Button>
                        </div>
                    </div>
                );

            case 'preview':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-white">
                            Prêt à importer
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            <Card className="text-center">
                                <p className="text-3xl font-bold text-astro-gold">
                                    {parsedData?.rows.length || 0}
                                </p>
                                <p className="text-xs text-neutral-500">Leads à importer</p>
                            </Card>
                            <Card className="text-center">
                                <p className="text-3xl font-bold text-blue-400">
                                    {options.validateEmails || options.findMissingEmails ? '✓' : '✗'}
                                </p>
                                <p className="text-xs text-neutral-500">Enrichissement</p>
                            </Card>
                            <Card className="text-center">
                                <p className="text-3xl font-bold text-green-400">
                                    {options.skipDuplicates ? '✓' : '✗'}
                                </p>
                                <p className="text-xs text-neutral-500">Anti-doublons</p>
                            </Card>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setStep('options')}>
                                Retour
                            </Button>
                            <Button onClick={handleImport} className="flex-1">
                                Lancer l'importation
                            </Button>
                        </div>
                    </div>
                );

            case 'importing':
                return (
                    <div className="space-y-6 text-center">
                        <div className="w-16 h-16 mx-auto border-4 border-astro-gold border-t-transparent rounded-full animate-spin" />
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Importation en cours...
                            </h3>
                            {importProgress.total > 0 && (
                                <p className="text-sm text-neutral-400">
                                    {importProgress.current} / {importProgress.total} traités
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'complete':
                return (
                    <div className="space-y-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                            <Check className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Importation terminée !
                            </h3>
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div>
                                    <p className="text-2xl font-bold text-green-400">
                                        {importResults.inserted}
                                    </p>
                                    <p className="text-xs text-neutral-500">Importés</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {importResults.skipped}
                                    </p>
                                    <p className="text-xs text-neutral-500">Ignorés</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-400">
                                        {importResults.errors}
                                    </p>
                                    <p className="text-xs text-neutral-500">Erreurs</p>
                                </div>
                            </div>
                        </div>
                        <Button onClick={onClose} className="w-full">
                            Fermer
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-astro-gold" />
                    <h2 className="text-xl font-bold text-white">Importer des leads</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-astro-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-neutral-400" />
                </button>
            </div>

            {renderStep()}
        </Modal>
    );
};
