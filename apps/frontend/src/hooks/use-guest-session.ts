import { useState, useEffect } from 'react';
import { sessionsApi } from '@/lib/api';

interface GuestSessionState {
  token: string | null;
  guestName: string | null;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useGuestSession() {
  const [state, setState] = useState<GuestSessionState>({
    token: null,
    guestName: null,
    isValid: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    validateSession();
  }, []);

  const validateSession = async () => {
    const storedToken = localStorage.getItem('guest_token');

    if (!storedToken) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await sessionsApi.validate(storedToken);

      if (response.data.valid && response.data.guest_name) {
        setState({
          token: storedToken,
          guestName: response.data.guest_name,
          isValid: true,
          isLoading: false,
          error: null,
        });
      } else {
        localStorage.removeItem('guest_token');
        localStorage.removeItem('guest_name');
        setState({
          token: null,
          guestName: null,
          isValid: false,
          isLoading: false,
          error: response.data.message || 'Sesión expirada',
        });
      }
    } catch (error) {
      console.error('Error validating session:', error);
      localStorage.removeItem('guest_token');
      localStorage.removeItem('guest_name');
      setState({
        token: null,
        guestName: null,
        isValid: false,
        isLoading: false,
        error: 'Error al validar sesión',
      });
    }
  };

  const createSession = async (token: string, guestName: string) => {
    try {
      const response = await sessionsApi.create({ master_token: token, guest_name: guestName });

      if (response.data.valid) {
        localStorage.setItem('guest_token', token);
        localStorage.setItem('guest_name', guestName);

        setState({
          token,
          guestName: response.data.guest_name,
          isValid: true,
          isLoading: false,
          error: null,
        });

        return { success: true };
      }

      return { success: false, message: 'Token inválido' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear sesión';
      return { success: false, message };
    }
  };

  const clearSession = () => {
    localStorage.removeItem('guest_token');
    localStorage.removeItem('guest_name');
    setState({
      token: null,
      guestName: null,
      isValid: false,
      isLoading: false,
      error: null,
    });
  };

  const updateGuestName = async (newName: string) => {
    const token = localStorage.getItem('guest_token');
    if (!token) {
      return { success: false, message: 'No hay sesión activa' };
    }

    try {
      const response = await sessionsApi.update(token, newName);
      if (response.data.valid) {
        localStorage.setItem('guest_name', newName);
        setState(prev => ({
          ...prev,
          guestName: newName,
        }));
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar nombre' 
      };
    }
  };

  return {
    ...state,
    createSession,
    clearSession,
    updateGuestName,
    refreshSession: validateSession,
  };
}
