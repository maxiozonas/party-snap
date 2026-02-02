import { Home } from './views/Home';
import { TVMode } from './views/TVMode';
import { Admin } from './views/Admin';

function App() {
  const pathname = window.location.pathname;
  
  // Extract subdirectory if exists
  // Development: '' (empty)
  // Production: '/party-snap'
  const basename = pathname.startsWith('/party-snap') ? '/party-snap' : '';
  
  // Get relative route (without subdirectory)
  const route = basename ? pathname.replace('/party-snap', '') : pathname;

  if (route === '/live') {
    return <TVMode />;
  }

  if (route === '/admin') {
    return <Admin />;
  }

  return <Home />;
}

export default App;
