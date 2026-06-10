import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface Crumb {
  label: string;
  to?: string;
}

export function AdminHeader({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b-4 border-eightbit-ink bg-eightbit-panel">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <nav className="flex flex-wrap items-center gap-2 text-base">
          <Link to="/admin/subjects" className="text-xs text-eightbit-blue">
            Guia em Cards · Admin
          </Link>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-2 text-eightbit-green-shadow">
              <span>/</span>
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-eightbit-blue">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-eightbit-ink">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="eightbit-btn eightbit-btn--reset eightbit-btn--sm"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
