import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { SubjectsAdminPage } from './pages/admin/SubjectsAdminPage';
import { TopicsAdminPage } from './pages/admin/TopicsAdminPage';
import { CardsAdminPage } from './pages/admin/CardsAdminPage';
import { HomePage } from './pages/student/HomePage';
import { SubjectPage } from './pages/student/SubjectPage';
import { StudyPage } from './pages/student/StudyPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { GlossaryPage } from './pages/student/GlossaryPage';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-50 text-slate-800">
      <h1 className="text-3xl font-bold text-indigo-600">404</h1>
      <p className="text-slate-500">Página não encontrada</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Aluno + Admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/subjects/:id" element={<SubjectPage />} />
        <Route path="/study/:topicId" element={<StudyPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
      </Route>

      {/* Admin Only */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/subjects" element={<SubjectsAdminPage />} />
        <Route path="/admin/subjects/:subjectId/topics" element={<TopicsAdminPage />} />
        <Route path="/admin/topics/:topicId/cards" element={<CardsAdminPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
