import { Home } from './views/Home';
import { TVMode } from './views/TVMode';
import { Admin } from './views/Admin';

function App() {
  const pathname = window.location.pathname;

  if (pathname === '/live') {
    return <TVMode />;
  }

  if (pathname === '/admin') {
    return <Admin />;
  }

  return <Home />;
}

export default App;
