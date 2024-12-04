import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { RoadmapCard } from './components/RoadmapCard';
import { Sparkles, List } from 'lucide-react';
import { ManualRoadmap } from './pages/ManualRoadmap';
import { AutomaticRoadmap } from './pages/AutomaticRoadmap';
import { RoadmapView } from './pages/RoadmapView';
import { RoadmapList } from './pages/RoadmapList';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { toast } from 'react-hot-toast';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return <>{children}</>;
}

function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handlePathSelect = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: path } });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Create Your Learning Journey
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose how you want to build your personalized learning roadmap
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <RoadmapCard
          title="Manual Selection"
          description="Choose from our curated list of skills and create a customized learning path that fits your goals."
          icon={<List className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
          onClick={() => handlePathSelect('/manual')}
        />
        
        <RoadmapCard
          title="AI-Powered Generation"
          description="Let our AI create a personalized roadmap based on your learning goals and preferences."
          icon={<Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
          onClick={() => handlePathSelect('/automatic')}
        />
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by advanced AI to help you achieve your learning goals effectively
        </p>
      </div>
    </main>
  );
}

function App() {
  const theme = useThemeStore((state) => state.theme);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  React.useEffect(() => {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('502')) {
        toast.error(
          'The server is taking too long to respond. Please try again with a simpler request or try again later.',
          { duration: 5000 }
        );
      }
    });

    return () => {
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
          <Route path="/roadmaps" element={<RequireAuth><RoadmapList /></RequireAuth>} />
          <Route path="/manual" element={<RequireAuth><ManualRoadmap /></RequireAuth>} />
          <Route path="/automatic" element={<RequireAuth><AutomaticRoadmap /></RequireAuth>} />
          <Route path="/roadmap/:id" element={<RequireAuth><RoadmapView /></RequireAuth>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;