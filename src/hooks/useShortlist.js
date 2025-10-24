import { useState, useEffect, useCallback } from 'react';
import shortlistService from '../services/shortlistService';
import { useAuth } from '../contexts/AuthContext';

export const useShortlist = () => {
  const { currentUser } = useAuth();
  const [shortlistedPrograms, setShortlistedPrograms] = useState(new Set());
  const [shortlistedEstablishments, setShortlistedEstablishments] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Check if a program is shortlisted
  const isProgramShortlisted = useCallback((programId) => {
    return shortlistedPrograms.has(programId);
  }, [shortlistedPrograms]);

  // Check if an establishment is shortlisted
  const isEstablishmentShortlisted = useCallback((establishmentId) => {
    return shortlistedEstablishments.has(establishmentId);
  }, [shortlistedEstablishments]);

  // Toggle program shortlist status
  const toggleProgram = useCallback(async (programId) => {
    if (!currentUser) {
      throw new Error('User must be logged in to shortlist programs');
    }
    
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    setLoading(true);
    try {
      const result = await shortlistService.toggleProgram(programId);
      
      setShortlistedPrograms(prev => {
        const newSet = new Set(prev);
        if (result.action === 'added') {
          newSet.add(programId);
        } else {
          newSet.delete(programId);
        }
        return newSet;
      });

      return result;
    } catch (error) {
      console.error('Error toggling program shortlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Toggle establishment shortlist status
  const toggleEstablishment = useCallback(async (establishmentId) => {
    if (!currentUser) {
      throw new Error('User must be logged in to shortlist establishments');
    }
    
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    setLoading(true);
    try {
      const result = await shortlistService.toggleEstablishment(establishmentId);
      
      setShortlistedEstablishments(prev => {
        const newSet = new Set(prev);
        if (result.action === 'added') {
          newSet.add(establishmentId);
        } else {
          newSet.delete(establishmentId);
        }
        return newSet;
      });

      return result;
    } catch (error) {
      console.error('Error toggling establishment shortlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load shortlist status for multiple programs
  const loadProgramsStatus = useCallback(async (programIds) => {
    if (!currentUser || !programIds.length) return;

    try {
      const promises = programIds.map(id => shortlistService.checkProgram(id));
      const results = await Promise.all(promises);
      
      const shortlistedIds = new Set();
      results.forEach((result, index) => {
        if (result.isShortlisted) {
          shortlistedIds.add(programIds[index]);
        }
      });
      
      setShortlistedPrograms(shortlistedIds);
    } catch (error) {
      console.error('Error loading programs shortlist status:', error);
    }
  }, [currentUser]);

  // Load shortlist status for multiple establishments
  const loadEstablishmentsStatus = useCallback(async (establishmentIds) => {
    if (!currentUser || !establishmentIds.length) return;

    try {
      const promises = establishmentIds.map(id => shortlistService.checkEstablishment(id));
      const results = await Promise.all(promises);
      
      const shortlistedIds = new Set();
      results.forEach((result, index) => {
        if (result.isShortlisted) {
          shortlistedIds.add(establishmentIds[index]);
        }
      });
      
      setShortlistedEstablishments(shortlistedIds);
    } catch (error) {
      console.error('Error loading establishments shortlist status:', error);
    }
  }, [currentUser]);


  // Clear shortlist data when user logs out
  useEffect(() => {
    if (!currentUser) {
      setShortlistedPrograms(new Set());
      setShortlistedEstablishments(new Set());
    }
  }, [currentUser]);

  return {
    isProgramShortlisted,
    isEstablishmentShortlisted,
    toggleProgram,
    toggleEstablishment,
    loadProgramsStatus,
    loadEstablishmentsStatus,
    loading,
    shortlistedPrograms,
    shortlistedEstablishments
  };
};
