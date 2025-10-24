import { useState, useEffect } from 'react';
import allParametersService, { AllParameters } from '../services/allParametersService';

// Global cache to prevent multiple API calls
let globalCache: AllParameters | null = null;
let globalLoading = false;
let globalError: string | null = null;

export const useAllParameters = () => {
  const [parameters, setParameters] = useState<AllParameters | null>(globalCache);
  const [loading, setLoading] = useState(globalLoading);
  const [error, setError] = useState<string | null>(globalError);

  useEffect(() => {
    // If we already have cached data, use it
    if (globalCache) {
      setParameters(globalCache);
      setLoading(false);
      setError(null);
      return;
    }

    // If already loading, don't start another request
    if (globalLoading) {
      setLoading(true);
      return;
    }

    const loadParams = async () => {
      try {
        globalLoading = true;
        setLoading(true);
        setError(null);
        globalError = null;
        
        const params = await allParametersService.loadAll();
        globalCache = params;
        setParameters(params);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load parameters';
        globalError = errorMessage;
        setError(errorMessage);
        console.error('Error loading parameters:', err);
      } finally {
        globalLoading = false;
        setLoading(false);
      }
    };
    
    loadParams();
  }, []);

  return { parameters, loading, error };
};
