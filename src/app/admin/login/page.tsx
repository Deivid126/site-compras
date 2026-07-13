export const dynamic = "force-dynamic";

import Link from "next/link";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <main className="adm-login-shell">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <span className="adm-login-mark">🏁</span>
        </div>
        <h1 className="adm-login-title">Painel Administrativo</h1>
        <p className="adm-login-sub">Pista de Presentes do Noah</p>

        {sp.error === "1" && (
          <div className="adm-alert adm-alert-error">
            Usuário ou senha incorretos.
          </div>
        )}
        {sp.error === "2" && (
          <div className="adm-alert adm-alert-error">
            ADMIN_SECRET não configurado no servidor.
          </div>
        )}

        <form action="/api/admin/login" method="POST" className="adm-form">
          <label htmlFor="user" className="adm-field-label">
            Usuário
          </label>
          <input
            id="user"
            name="user"
            type="text"
            className="adm-input"
            required
            autoFocus
            autoComplete="username"
            placeholder="admin"
          />

          <label htmlFor="password" className="adm-field-label">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="adm-input"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />

          <button type="submit" className="adm-btn adm-btn-primary adm-btn-block">
            Entrar
          </button>
        </form>

        <Link href="/" className="adm-login-back">
          ← Voltar ao site
        </Link>
      </div>
    </main>
  );
}