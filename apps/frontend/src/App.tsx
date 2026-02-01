import { Home } from './views/Home';
import { TVMode } from './views/TVMode';

function App() {
  const isTVMode = window.location.pathname === '/live';

  if (isTVMode) {
    return <TVMode />;
  }

  return <Home />;
}

export default App;
