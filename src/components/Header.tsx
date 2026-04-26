'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, User, Shield, GraduationCap, Search, Eye, Menu, X, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/SessionAuthContext';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import Modal from './Modal';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function Header() {
  const router = useRouter();
  const { user, profile, signOut, loading, changePassword } = useAuth();
  const isAuthenticated = !!user && !!profile;
  const isLoading = loading;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordSaving(false);
  };

  const handleOpenPasswordModal = () => {
    resetPasswordForm();
    setShowPasswordModal(true);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    setPasswordSaving(true);
    const { error } = await changePassword(currentPassword, newPassword);
    setPasswordSaving(false);

    if (error) {
      setPasswordError(error.message || 'No se pudo cambiar la contraseña.');
      return;
    }

    setPasswordSuccess('Contraseña actualizada correctamente.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-theme-bg/80 backdrop-blur-sm transition-colors duration-300">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-6 py-4">
        {/* Mobile Menu Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-theme-text hover:bg-theme-accent/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link href="/" className="flex items-center transition-all hover:scale-105">
            <svg
              className="h-8 w-8 text-neon-pink"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"></path>
            </svg>
          </Link>
        </div>

        <nav className="hidden md:flex md:flex-wrap items-center gap-6">
          <Link className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text whitespace-nowrap" href="/">Inicio</Link>
          <Link className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text whitespace-nowrap" href="/inventory">Inventario</Link>
          <Link className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text whitespace-nowrap" href="/projects">Proyectos</Link>
          <Link className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text whitespace-nowrap" href="/researchers">Investigadores</Link>
          <Link className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text whitespace-nowrap" href="/loans">Préstamos</Link>
          {profile?.role === 'admin' && (
            <Link className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text whitespace-nowrap" href="/admin/devices">Dispositivos</Link>
          )}
          <Link className="font-poppins text-sm font-medium text-theme-secondary transition-colors hover:text-theme-text whitespace-nowrap" href="/contact">Contacto</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isLoading ? (
            <div className="w-8 h-8 border-2 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Indicador de Rol */}
              <div className="flex items-center gap-1">
                {profile?.role === 'admin' && (
                  <div className="flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20">
                    <Shield className="w-3 h-3" />
                    <span className="text-xs font-medium">Admin</span>
                  </div>
                )}
                {profile?.role === 'researcher' && (
                  <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">
                    <GraduationCap className="w-3 h-3" />
                    <span className="text-xs font-medium">Investigador</span>
                  </div>
                )}
                {profile?.role === 'student' && (
                  <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
                    <Search className="w-3 h-3" />
                    <span className="text-xs font-medium">Estudiante</span>
                  </div>
                )}
                {profile?.role === 'visitor' && (
                  <div className="flex items-center gap-1 bg-gray-500/10 text-gray-400 px-2 py-1 rounded-md border border-gray-500/20">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs font-medium">Visitante</span>
                  </div>
                )}
              </div>

              {/* ProfileDropdown reemplaza el avatar+tooltip+botones del original */}
              <ProfileDropdown
                displayName={profile?.full_name || profile?.username || user?.email?.split('@')[0] || ''}
                avatarUrl={profile?.avatar_url || ''}
                email={profile?.email || ''}
                onLogout={handleLogout}
                onChangePassword={handleOpenPasswordModal}
              />
            </div>
          ) : (
            <Link
              className="rounded-md bg-bright-blue px-5 py-2.5 text-sm font-semibold text-dark-bg shadow-lg shadow-bright-blue/30 transition-all hover:bg-white hover:text-dark-bg hover:shadow-bright-blue"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-theme-card border-b border-theme-border">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Link href="/" className="block py-2 text-theme-text hover:text-theme-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
              <Link href="/inventory" className="block py-2 text-theme-text hover:text-theme-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Inventario</Link>
              <Link href="/projects" className="block py-2 text-theme-text hover:text-theme-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Proyectos</Link>
              <Link href="/researchers" className="block py-2 text-theme-text hover:text-theme-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Investigadores</Link>
              <Link href="/loans" className="block py-2 text-theme-text hover:text-theme-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Préstamos</Link>
              {profile?.role === 'admin' && (
                <Link href="/admin/devices" className="block py-2 text-theme-text hover:text-theme-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Dispositivos</Link>
              )}
              <Link href="/contact" className="block py-2 text-theme-text hover:text-theme-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
            </div>
            {isAuthenticated && (
              <div className="pt-2 border-t border-theme-border space-y-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); handleOpenPasswordModal(); }}
                  className="flex items-center gap-2 py-2 text-theme-secondary hover:text-theme-text transition-colors w-full"
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="text-sm">Cambiar contraseña</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 py-2 text-theme-secondary hover:text-theme-text transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>

    {/* Modal Cambiar Contraseña */}
    {showPasswordModal && (
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Cambiar contraseña">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-accent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-accent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-accent"
              required
            />
          </div>
          {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-400">{passwordSuccess}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 rounded-lg border border-theme-border text-theme-secondary hover:text-theme-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-4 py-2 rounded-lg bg-theme-accent text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {passwordSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    )}
    </>
  );
}
