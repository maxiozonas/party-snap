import { useEffect, useState } from 'react';
import { Home } from './views/Home';
import { TVMode } from './views/TVMode';
import { Admin } from './views/Admin';
import { AdminLogin } from './views/AdminLogin';
import { GuestNameModal } from './components/GuestNameModal';
import { useGuestSession } from './hooks/use-guest-session';
import { useAdminAuth } from './hooks/use-admin-auth';

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search)
  );
  const { isValid, isLoading: sessionLoading, guestName } = useGuestSession();
  const { isAuthenticated, isLoading: adminLoading, logout } = useAdminAuth();
  const [showNameModal, setShowNameModal] = useState(false);
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token && token.length === 64) {
      if (!isValid && !guestName) {
        setTokenFromUrl(token);
        setShowNameModal(true);
      }
      window.history.replaceState({}, '', pathname);
    }

    const handlePopState = () => {
      setPathname(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams, isValid, guestName, pathname]);

  if (showNameModal && tokenFromUrl) {
    return (
      <GuestNameModal
        token={tokenFromUrl}
        onSuccess={() => {
          setShowNameModal(false);
          setTokenFromUrl(null);
        }}
      />
    );
  }

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-aqua-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-aqua-500 border-t-transparent" />
          <p className="text-lg text-aqua-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  const basename = pathname.startsWith('/party-snap') ? '/party-snap' : '';
  const route = basename ? pathname.replace('/party-snap', '') : pathname;

  if (route === '/live') {
    return <TVMode />;
  }

  if (route === '/admin') {
    if (adminLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-aqua-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-aqua-500 border-t-transparent" />
            <p className="text-lg text-aqua-600">Cargando...</p>
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <AdminLogin onLogin={() => window.location.reload()} />;
    }
    
    return <Admin onLogout={logout} />;
  }

  return <Home />;
}

export default App;
