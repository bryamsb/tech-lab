'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useAuth } from '@/contexts/SessionAuthContext';
import { Pencil, LogOut, User, KeyRound } from 'lucide-react';

interface Props {
  displayName: string;
  avatarUrl: string;
  email: string;
  onLogout: () => void;
  onChangePassword?: () => void;
}

interface ProfileFormData {
  full_name: string;
  avatar_url: string;
  phone: string;
  linkedin_url: string;
  bio: string;
}

export default function ProfileDropdown({ displayName, avatarUrl, email, onLogout, onChangePassword }: Props) {
  const { user, profile } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    full_name: '',
    avatar_url: '',
    phone: '',
    linkedin_url: '',
    bio: '',
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const showMenu = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowDropdown(true);
  };

  const hideMenu = () => {
    hideTimeout.current = setTimeout(() => setShowDropdown(false), 150);
  };

  const handleOpenModal = () => {
    setShowDropdown(false);
    setMessage(null);
    // Pre-fill from profile context (ya disponible en SessionAuthContext)
    if (profile) {
      setProfileData({
        full_name: profile.full_name ?? '',
        avatar_url: profile.avatar_url ?? '',
        phone: profile.phone ?? '',
        linkedin_url: profile.linkedin_url ?? '',
        bio: profile.bio ?? '',
      });
    }
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      // Usa la API interna del repo original
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          phone: profileData.phone,
          linkedin_url: profileData.linkedin_url,
          bio: profileData.bio,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al guardar');
      }

      setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Wrapper hover */}
      <div
        ref={wrapperRef}
        className="relative flex items-center gap-2 text-theme-text cursor-pointer"
        onMouseEnter={showMenu}
        onMouseLeave={hideMenu}
      >
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border-2 border-theme-accent/20 hover:border-theme-accent/50 transition-all"
            />
          ) : (
            <div className="w-8 h-8 bg-theme-accent/10 rounded-full flex items-center justify-center border-2 border-theme-accent/20 hover:border-theme-accent/50 transition-all">
              <User className="w-4 h-4 text-theme-accent" />
            </div>
          )}
        </div>

        {/* Nombre visible en desktop */}
        <span className="hidden md:block text-sm font-medium">{displayName}</span>

        {/* Dropdown */}
        {showDropdown && typeof window !== 'undefined' && createPortal(
          <div
            style={{
              position: 'fixed',
              top: (wrapperRef.current?.getBoundingClientRect().bottom ?? 0) + 8,
              right: window.innerWidth - (wrapperRef.current?.getBoundingClientRect().right ?? 0),
              zIndex: 9999,
            }}
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
            className="min-w-[200px] rounded-xl border border-theme-border shadow-xl overflow-hidden"
            style2={{ backgroundColor: 'var(--modal-bg, var(--theme-card))' }}
          >
            <div className="px-4 py-3 border-b border-theme-border" style={{ backgroundColor: 'var(--modal-bg, var(--theme-card))' }}>
              <p className="text-sm font-semibold text-theme-text truncate">{displayName}</p>
              <p className="text-xs text-theme-secondary truncate">{email}</p>
            </div>
            <div style={{ backgroundColor: 'var(--modal-bg, var(--theme-card))' }}>
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-text hover:bg-theme-accent/10 transition-colors"
              >
                <Pencil className="w-4 h-4 text-theme-secondary" />
                Editar perfil
              </button>
              {onChangePassword && (
                <button
                  onClick={() => { setShowDropdown(false); onChangePassword(); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-theme-text hover:bg-theme-accent/10 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-theme-secondary" />
                  Cambiar contraseña
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Modal editar perfil */}
      {showModal && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl shadow-2xl border border-theme-border overflow-hidden"
            style={{ backgroundColor: 'var(--modal-bg, var(--theme-card))' }}
          >
            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
            <div className="px-6 py-5">
              <h2 className="text-lg font-bold text-theme-text mb-4">Editar perfil</h2>
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-theme-secondary mb-1">Nombre completo</label>
                  <input
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text text-sm focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-theme-secondary mb-1">URL de avatar</label>
                  <input
                    name="avatar_url"
                    value={profileData.avatar_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text text-sm focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-theme-secondary mb-1">Teléfono</label>
                  <input
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text text-sm focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-theme-secondary mb-1">LinkedIn</label>
                  <input
                    name="linkedin_url"
                    value={profileData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text text-sm focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-theme-secondary mb-1">Biografía</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text text-sm focus:outline-none focus:border-theme-accent resize-none"
                  />
                </div>

                {message && (
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.text}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-theme-border text-theme-secondary hover:text-theme-text text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-theme-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
