import { useCallback, useEffect, useState } from 'react';
import { sessionsApi } from '@/lib/api';

interface GuestSessionState {
  token: string | null;
  guestName: string | null;
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
}

const readStoredToken = () => localStorage.getItem('guest_token') || localStorage.getItem('guesttoken');
const readStoredGuestName = () => localStorage.getItem('guest_name') || localStorage.getItem('guestname');

const clearStoredSession = () => {
  localStorage.removeItem('guest_token');
  localStorage.removeItem('guest_name');
  localStorage.removeItem('guesttoken');
  localStorage.removeItem('guestname');
};

export function useGuestSession() {
  const storedToken = readStoredToken();
  const storedGuestName = readStoredGuestName();

  const [state, setState] = useState<GuestSessionState>({
    token: storedToken,
    guestName: storedGuestName,
    isValid: Boolean(storedToken && storedGuestName),
    isLoading: true,
    error: null,
  });

  const validateSession = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const currentToken = readStoredToken();
    const currentGuestName = readStoredGuestName();

    if (!currentToken) {
      setState(prev => ({
        ...prev,
        token: null,
        guestName: null,
        isValid: false,
        isLoading: false,
      }));

      return false;
    }

    try {
      const response = await sessionsApi.validate(currentToken);

      if (response.data.valid && response.data.guest_name) {
        localStorage.setItem('guest_token', currentToken);
        localStorage.setItem('guest_name', response.data.guest_name);

        setState({
          token: currentToken,
          guestName: response.data.guest_name,
          isValid: true,
          isLoading: false,
          error: null,
        });

        return true;
      } else {
        clearStoredSession();

        setState({
          token: null,
          guestName: null,
          isValid: false,
          isLoading: false,
          error: response.data.message || 'Sesión expirada',
        });

        return false;
      }
    } catch (error) {
      console.error('Error validating session:', error);

      if (currentToken && currentGuestName) {
        setState({
          token: currentToken,
          guestName: currentGuestName,
          isValid: true,
          isLoading: false,
          error: null,
        });

        return true;
      }

      clearStoredSession();

      setState({
        token: null,
        guestName: null,
        isValid: false,
        isLoading: false,
        error: 'Error al validar sesión',
      });

      return false;
    }
  }, []);

  useEffect(() => {
    void validateSession();
  }, [validateSession]);

  const createSession = async (token: string, guestName: string) => {
    try {
      const response = await sessionsApi.create({ master_token: token, guest_name: guestName });

      if (response.data.valid) {
        const sessionToken = response.data.session_token || token;

        localStorage.setItem('guest_token', sessionToken);
        localStorage.setItem('guest_name', guestName);

        setState({
          token: sessionToken,
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
    clearStoredSession();

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
