import { useState, useEffect, useCallback } from 'react';

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface AdminAuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    token: null,
    admin: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_user');
    
    if (token && adminData) {
      try {
        const admin = JSON.parse(adminData);
        setState({
          token,
          admin,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback((token: string, admin: Admin) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
    setState({
      token,
      admin,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    
    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
    
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setState({
      token: null,
      admin: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      throw new Error('No autorizado');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cambiar la contraseña');
    }

    return data;
  }, []);

  return {
    ...state,
    login,
    logout,
    changePassword,
  };
}
