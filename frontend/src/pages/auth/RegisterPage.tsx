import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/api/axios';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="eightbit-panel max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-lg leading-relaxed text-eightbit-ink">
            Guia em Cards
          </h2>
          <p className="mt-3 text-center text-base text-eightbit-green-shadow">
            &gt; NOVO JOGADOR
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                className="eightbit-input"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                required
                className="eightbit-input"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="eightbit-input"
                placeholder="Senha (min 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-center text-base text-eightbit-red-hover">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="eightbit-btn w-full text-sm">
              {loading ? 'Registrando...' : 'Criar conta'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link to="/login" className="text-base text-eightbit-blue hover:text-eightbit-blue-hover">
            Já tem conta? faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
