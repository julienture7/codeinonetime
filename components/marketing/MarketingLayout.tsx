
import * as React from 'react';
import { Link, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'; // Changed imports
import MarketingLogo from './MarketingLogo'; 
import MarketingHomePage from './MarketingHomePage';
import MarketingAboutPage from './MarketingAboutPage';
import MarketingFeaturesPage from './MarketingFeaturesPage';
import MarketingForParentsPage from './MarketingForParentsPage';

const MarketingLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { path } = useRouteMatch(); // For nested routes

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Helper to ensure base path for routes (e.g. if layout is not at root "/")
  // For this app, path is likely "/"
  const routePath = (subPath: string) => {
    if (path === '/') return `/${subPath}`.replace('//', '/'); // Avoid double slash if subPath starts with /
    return `${path}/${subPath}`.replace('//', '/');
  }
  const indexPath = path === '/' ? path : `${path}/`;


  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f3f4] bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-10">
          <Link to="/" className="flex items-center gap-3 text-[#111518]">
            <div className="size-8 marketing-text-primary">
              <MarketingLogo />
            </div>
            <h2 className="text-[#111518] text-xl font-bold leading-tight tracking-[-0.015em]">WonderChat</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to="/">Home</Link>
            <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to={routePath("about")}>About Us</Link>
            <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to={routePath("features")}>Features</Link>
            <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to={routePath("for-parents")}>For Parents</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 marketing-btn-secondary text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
              <span className="truncate">Parent Login</span>
            </Link>
            <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 marketing-btn-primary text-sm font-bold leading-normal tracking-[0.015em] transition-opacity">
              <span className="truncate">Sign Up</span>
            </Link>
            <button className="md:hidden text-[#111518] p-2" onClick={toggleMobileMenu} aria-label="Toggle menu">
              <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <line x1="3" x2="21" y1="12" y2="12"></line><line x1="3" x2="21" y1="6" y2="6"></line><line x1="3" x2="21" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>
        
        {isMobileMenuOpen && (
            <nav className="md:hidden flex flex-col items-center gap-4 py-4 bg-white shadow-lg">
                <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to={routePath("about")} onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to={routePath("features")} onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                <Link className="text-[#111518] text-sm font-medium leading-normal hover:marketing-text-primary transition-colors" to={routePath("for-parents")} onClick={() => setIsMobileMenuOpen(false)}>For Parents</Link>
            </nav>
        )}

        <main className="flex flex-1 flex-col">
          <Switch>
            <Route exact path={indexPath} component={MarketingHomePage} />
            <Route path={routePath("about")} component={MarketingAboutPage} />
            <Route path={routePath("features")} component={MarketingFeaturesPage} />
            <Route path={routePath("for-parents")} component={MarketingForParentsPage} />
            <Route path={routePath("privacy")}>
              <div><h1>Privacy Policy</h1><p>Coming soon...</p><Link to="/">Home</Link></div>
            </Route>
            <Route path={routePath("terms")}>
              <div><h1>Terms of Service</h1><p>Coming soon...</p><Link to="/">Home</Link></div>
            </Route>
            {/* If MarketingLayout is at "/", any non-matching subpath here could be a 404 within marketing,
                or redirect to marketing home. App.tsx has the global 404.
                To avoid clashes, this Switch should ideally handle all known marketing sub-paths.
            */}
            <Route render={() => <Redirect to={indexPath} />} /> {/* Fallback for unknown marketing sub-paths */}
          </Switch>
        </main>
        <footer className="bg-[#111518] text-white py-12">
          <div className="px-6 md:px-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">WonderChat</h3>
                <p className="text-sm text-gray-400">AI-powered voice chat for kids. Safe, educational, and fun.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link className="text-sm text-gray-400 hover:marketing-text-primary transition-colors" to={routePath("about")}>About Us</Link></li>
                  <li><Link className="text-sm text-gray-400 hover:marketing-text-primary transition-colors" to={routePath("features")}>Features</Link></li>
                  <li><Link className="text-sm text-gray-400 hover:marketing-text-primary transition-colors" to={routePath("for-parents")}>For Parents</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Link className="text-sm text-gray-400 hover:marketing-text-primary transition-colors" to={routePath("privacy")}>Privacy Policy</Link></li>
                  <li><Link className="text-sm text-gray-400 hover:marketing-text-primary transition-colors" to={routePath("terms")}>Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} WonderChat. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MarketingLayout;
