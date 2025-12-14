/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.ts'],

        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'e2e'],

        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'src/tests/',
                'e2e/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/index.ts',
            ],
            thresholds: {
                statements: 80,
                branches: 75,
                functions: 80,
                lines: 80,
            },
        },

        testTimeout: 10000,
        hookTimeout: 10000,
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/stores': path.resolve(__dirname, './src/stores'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/types': path.resolve(__dirname, './src/types'),
            '@/services': path.resolve(__dirname, './src/services'),
            '@/views': path.resolve(__dirname, './src/views'),
            '@/lib': path.resolve(__dirname, './src/lib'),
            '@/context': path.resolve(__dirname, './src/context'),
        },
    },
});
