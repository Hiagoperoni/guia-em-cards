import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { listSubjects } from '@/api/content';
import { useAuthStore } from '@/store/authStore';

export function HomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: listSubjects,
  });

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b-4 border-eightbit-ink bg-eightbit-panel px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <h1 className="text-sm text-eightbit-blue sm:text-base">Guia em Cards</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/glossary" className="text-base text-eightbit-ink hover:text-eightbit-blue">
              Glossário
            </Link>
            <Link to="/progress" className="text-base text-eightbit-ink hover:text-eightbit-blue">
              Progresso
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin/subjects" className="text-base text-eightbit-blue hover:text-eightbit-blue-hover">
                Admin
              </Link>
            )}
            <span className="text-base text-eightbit-blue">{user?.name}</span>
            <button onClick={handleLogout} className="eightbit-btn eightbit-btn--reset eightbit-btn--sm">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="mb-8 text-xl text-eightbit-ink">Matérias</h2>

        {isLoading && (
          <p className="text-base text-eightbit-blue">Carregando matérias...</p>
        )}

        {!isLoading && subjects.length === 0 && (
          <div className="eightbit-box p-10 text-center text-base text-eightbit-green-shadow">
            Nenhuma matéria disponível ainda.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="eightbit-box group flex items-start gap-4 p-6 transition-transform hover:-translate-y-1"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-4 border-eightbit-ink text-2xl"
                style={{ backgroundColor: subject.color + '33' }}
              >
                {subject.icon}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-xs leading-relaxed text-eightbit-blue">
                  {subject.name}
                </h3>
                {subject.description && (
                  <p className="mt-2 line-clamp-2 text-base text-eightbit-blue">
                    {subject.description}
                  </p>
                )}
                {subject.topicCount !== undefined && (
                  <p className="mt-2 text-sm text-eightbit-blue">
                    {subject.topicCount} tópico{subject.topicCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
