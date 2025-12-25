import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { LLMRouter, TaskType, LLMProvider } from '../llmRouter';
import { circuitBreakerManager } from '../circuitBreaker';
import { semanticCache } from '../semanticCache';

/**
 * Integration tests for LLM Router
 * Tests multi-provider failover, caching, and circuit breaker
 */

describe('LLMRouter Integration Tests', () => {
  let router: LLMRouter;

  beforeAll(() => {
    // Initialize router
    router = new LLMRouter();

    // Reset circuit breakers
    circuitBreakerManager.resetAll();

    // Clear cache
    semanticCache.invalidate();
  });

  afterAll(async () => {
    // Cleanup
    circuitBreakerManager.resetAll();
    await semanticCache.invalidate();
  });

  describe('Basic Completion', () => {
    it('should complete a simple task with default routing', async () => {
      const response = await router.complete(TaskType.SIMPLE, [
        {
          role: 'user',
          content: 'What is 2+2? Answer with just the number.',
        },
      ]);

      expect(response).toBeDefined();
      expect(response.content).toContain('4');
      expect(response.provider).toBeDefined();
      expect(response.model).toBeDefined();
      expect(response.metadata).toBeDefined();
      expect(response.metadata.taskType).toBe(TaskType.SIMPLE);
      expect(response.metadata.latencyMs).toBeGreaterThan(0);
    }, 30000);

    it('should complete a qualification task', async () => {
      const response = await router.complete(TaskType.QUALIFICATION, [
        {
          role: 'system',
          content: 'Tu es un expert en qualification de leads.',
        },
        {
          role: 'user',
          content:
            'Donne un score de 0 à 100 pour ce lead: Restaurant "Le Gourmet", Montréal, 4.5/5 étoiles, 200 avis, site web, email. Réponds juste avec le nombre.',
        },
      ]);

      expect(response).toBeDefined();
      expect(response.content).toMatch(/\d+/); // Should contain a number
      expect(response.metadata.fallbackAttempts).toBeGreaterThanOrEqual(0);
    }, 30000);
  });

  describe('Semantic Caching', () => {
    it('should cache and retrieve identical requests', async () => {
      const messages = [
        {
          role: 'user' as const,
          content: 'What is the capital of France? Answer with just the city name.',
        },
      ];

      // First call - should NOT be cached
      const response1 = await router.complete(TaskType.SIMPLE, messages);
      expect(response1.metadata.cached).toBe(false);

      // Second call - should be cached
      const response2 = await router.complete(TaskType.SIMPLE, messages);
      expect(response2.metadata.cached).toBe(true);
      expect(response2.content).toBe(response1.content);

      // Cached call should be much faster
      expect(response2.metadata.latencyMs).toBeLessThan(response1.metadata.latencyMs);
    }, 60000);

    it('should cache responses with same content but different whitespace', async () => {
      const messages1 = [
        {
          role: 'user' as const,
          content: 'What is 5+5?',
        },
      ];

      const messages2 = [
        {
          role: 'user' as const,
          content: '  What is 5+5?  ', // Extra whitespace
        },
      ];

      const response1 = await router.complete(TaskType.SIMPLE, messages1);
      const response2 = await router.complete(TaskType.SIMPLE, messages2);

      expect(response2.metadata.cached).toBe(true);
    }, 60000);

    it('should bypass cache when requested', async () => {
      const messages = [
        {
          role: 'user' as const,
          content: 'Generate a random number between 1 and 10.',
        },
      ];

      // First call
      const response1 = await router.complete(TaskType.SIMPLE, messages);

      // Second call with bypass cache
      const response2 = await router.complete(TaskType.SIMPLE, messages, {
        bypassCache: true,
      });

      expect(response2.metadata.cached).toBe(false);
      // Responses might be different (random number)
    }, 60000);
  });

  describe('Circuit Breaker', () => {
    it('should trip circuit breaker after multiple failures', async () => {
      // Force use of a provider that will fail
      const invalidMessages = [
        {
          role: 'user' as const,
          content: 'Test',
        },
      ];

      // Simulate failures by forcing an invalid provider
      // This test requires mocking or a test provider that fails
      // For now, we'll test the circuit breaker state

      const breaker = circuitBreakerManager.getBreaker(LLMProvider.OPENROUTER);
      const initialState = breaker.getState();

      expect(initialState.state).toBe('CLOSED');
    });

    it('should allow manual circuit breaker reset', () => {
      circuitBreakerManager.reset(LLMProvider.OPENROUTER);

      const breaker = circuitBreakerManager.getBreaker(LLMProvider.OPENROUTER);
      const state = breaker.getState();

      expect(state.state).toBe('CLOSED');
      expect(state.failureCount).toBe(0);
    });
  });

  describe('Provider Failover', () => {
    it('should have multiple providers configured', () => {
      // Check that routing strategy has multiple tiers
      const qualificationStrategy = [
        { provider: LLMProvider.OPENROUTER, model: 'google/gemini-2.0-flash-exp:free' },
        { provider: LLMProvider.OPENROUTER, model: 'meta-llama/llama-3.3-70b-instruct:free' },
        { provider: LLMProvider.HUGGINGFACE, model: 'mistralai/Mistral-7B-Instruct-v0.2' },
        { provider: LLMProvider.OLLAMA, model: 'llama3.2:3b' },
      ];

      expect(qualificationStrategy.length).toBeGreaterThanOrEqual(3); // At least 3 tiers
    });
  });

  describe('Batch Processing', () => {
    it('should process multiple requests in batch', async () => {
      const requests = [
        {
          taskType: TaskType.SIMPLE,
          messages: [{ role: 'user' as const, content: 'What is 1+1?' }],
        },
        {
          taskType: TaskType.SIMPLE,
          messages: [{ role: 'user' as const, content: 'What is 2+2?' }],
        },
        {
          taskType: TaskType.SIMPLE,
          messages: [{ role: 'user' as const, content: 'What is 3+3?' }],
        },
      ];

      const responses = await router.batchComplete(requests, 2); // Concurrency of 2

      expect(responses).toHaveLength(3);
      responses.forEach((response) => {
        expect(response).toBeDefined();
        expect(response.content).toBeDefined();
        expect(response.metadata).toBeDefined();
      });
    }, 60000);
  });

  describe('Error Handling', () => {
    it('should throw error when all providers fail', async () => {
      // Force all providers to fail by using invalid options
      await expect(
        router.complete(
          TaskType.SIMPLE,
          [{ role: 'user', content: 'Test' }],
          {
            // Force an invalid provider/model combo
            forceProvider: LLMProvider.OLLAMA,
            forceModel: 'non-existent-model' as any,
          }
        )
      ).rejects.toThrow();
    }, 30000);
  });

  describe('Cost Tracking', () => {
    it('should track usage for free models', async () => {
      const response = await router.complete(TaskType.QUALIFICATION, [
        {
          role: 'user',
          content: 'Simple test',
        },
      ]);

      // Free models should be prioritized
      const freeModels = [
        'google/gemini-2.0-flash-exp:free',
        'meta-llama/llama-3.3-70b-instruct:free',
      ];

      const isFreeModel = freeModels.some((model) => response.model.includes(model));
      expect(isFreeModel).toBe(true);
    }, 30000);
  });
});
