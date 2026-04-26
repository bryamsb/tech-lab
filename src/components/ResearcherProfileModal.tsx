'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Mail,
  Linkedin,
  ExternalLink,
  GraduationCap,
  Target,
  BookOpen,
  Award,
  Calendar,
  Building2,
  MessageCircle,
  User,
} from 'lucide-react';

// Usa el tipo del repo original, NO SupabaseResearcher
import type { ResearcherRecord } from '@/hooks/useResearchers';

interface ResearcherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  researcher: ResearcherRecord | null;
}

const academicLevelLabels: Record<string, string> = {
  undergraduate: 'Pregrado',
  bachelor: 'Licenciado',
  master: 'Magíster',
  phd: 'Doctor',
  postdoc: 'Postdoc',
  professor: 'Profesor',
};

const statusLabels: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  alumni: 'Alumni',
  visiting: 'Visitante',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  inactive: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  alumni: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  visiting: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
};

export default function ResearcherProfileModal({
  isOpen,
  onClose,
  researcher,
}: ResearcherProfileModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !researcher) return null;

  const phoneDigits = (researcher.phone || '').replace(/\D/g, '');
  const whatsappLink = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
        `Hola ${researcher.name}, te contacto desde Tech Lab.`,
      )}`
    : '';

  const allProjects = [
    ...(researcher.current_projects || []),
    ...(researcher.past_projects || []),
  ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-theme-border modal-no-scrollbar"
        style={{ backgroundColor: 'var(--modal-bg)' }}
      >
        {/* Top gradient */}
        <div className="h-1.5 w-full rounded-t-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400" />

        {/* HEADER */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-theme-secondary hover:bg-theme-secondary/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {researcher.avatar_url ? (
                <Image
                  src={researcher.avatar_url}
                  alt={researcher.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-fuchsia-500/40"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-fuchsia-500/30 bg-fuchsia-500/10">
                  <User className="w-8 h-8 text-fuchsia-500" />
                </div>
              )}
              <span
                className={`absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  statusColors[researcher.status] || statusColors.active
                }`}
              >
                {statusLabels[researcher.status] || researcher.status}
              </span>
            </div>

            {/* Info básica */}
            <div className="flex-1 min-w-0 pr-8">
              <h2 className="text-xl font-bold text-theme-text leading-tight">{researcher.name}</h2>
              <p className="text-sm text-theme-secondary mt-0.5">{researcher.position} · {researcher.department}</p>

              {/* Universidad */}
              {researcher.university && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-theme-secondary">
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{researcher.university}</span>
                  {researcher.academic_level && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-theme-accent/10 text-theme-accent font-medium">
                      {academicLevelLabels[researcher.academic_level] || researcher.academic_level}
                    </span>
                  )}
                </div>
              )}

              {/* Contacto rápido */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {researcher.email && (
                  <a
                    href={`mailto:${researcher.email}`}
                    className="flex items-center gap-1.5 text-xs text-theme-secondary hover:text-theme-accent transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {researcher.email}
                  </a>
                )}
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                )}
                {researcher.linkedin_url && (
                  <a
                    href={researcher.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mx-6 h-px bg-theme-border" />

        {/* BODY */}
        <div className="px-6 py-4 space-y-5">

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--modal-inner-bg)' }}>
              <p className="text-2xl font-bold text-theme-accent">{researcher.projects_completed}</p>
              <p className="text-xs text-theme-secondary mt-0.5">Proyectos</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--modal-inner-bg)' }}>
              <p className="text-2xl font-bold text-theme-accent">{researcher.publications_count}</p>
              <p className="text-xs text-theme-secondary mt-0.5">Publicaciones</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--modal-inner-bg)' }}>
              <p className="text-2xl font-bold text-theme-accent">{researcher.years_experience}</p>
              <p className="text-xs text-theme-secondary mt-0.5">Años exp.</p>
            </div>
          </div>

          {/* Biografía */}
          {researcher.biography && (
            <div>
              <h3 className="text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-2">Sobre mí</h3>
              <p className="text-sm text-theme-text leading-relaxed">{researcher.biography}</p>
            </div>
          )}

          {/* Especializaciones */}
          {researcher.specializations?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Especializaciones
              </h3>
              <div className="flex flex-wrap gap-2">
                {researcher.specializations.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Proyectos */}
          {allProjects.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Proyectos
              </h3>
              <div className="space-y-2">
                {allProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--modal-inner-bg)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-theme-text truncate">{p.title}</p>
                      <p className="text-xs text-theme-secondary">{p.role}</p>
                    </div>
                    <span className={`ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                      p.status === 'active' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-gray-500/15 text-gray-400'
                    }`}>
                      {p.status === 'active' ? 'Activo' : 'Completado'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publicaciones */}
          {researcher.publications?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Publicaciones
              </h3>
              <ul className="space-y-1.5">
                {researcher.publications.map((pub, i) => (
                  <li key={i} className="text-sm text-theme-text flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-theme-accent flex-shrink-0" />
                    {pub}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Logros */}
          {researcher.achievements?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Logros
              </h3>
              <ul className="space-y-1.5">
                {researcher.achievements.map((a, i) => (
                  <li key={i} className="text-sm text-theme-text flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fecha de ingreso */}
          {researcher.join_date && (
            <div className="flex items-center gap-2 text-xs text-theme-secondary">
              <Calendar className="w-3.5 h-3.5" />
              Miembro desde {new Date(researcher.join_date).toLocaleDateString('es-PE', { year: 'numeric', month: 'long' })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <Link
            href={`/researchers/${researcher.id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-theme-accent hover:underline"
            onClick={onClose}
          >
            Ver perfil completo <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-theme-border text-sm text-theme-secondary hover:text-theme-text transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
