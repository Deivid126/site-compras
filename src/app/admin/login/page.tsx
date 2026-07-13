export const dynamic = "force-dynamic";

import Link from "next/link";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return Promise.resolve(searchParams).then((sp) => (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Painel Admin</h1>
        <p className="admin-login-sub">Pista de Presentes do Noah</p>

        {sp.error === "1" && (
          <p className="msg msg-error">Usuario ou senha incorretos.</p>
        )}
        {sp.error === "2" && (
          <p className="msg msg-error">
            ADMIN_SECRET nao configurado no servidor.
          </p>
        )}

        <form action="/api/admin/login" method="POST" className="admin-form">
          <label htmlFor="user" className="field-label">
            Usuario
          </label>
          <input
            id="user"
            name="user"
            type="text"
            className="input"
            required
            autoFocus
            autoComplete="username"
          />

          <label htmlFor="password" className="field-label">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            required
            autoComplete="current-password"
          />

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        <Link href="/" className="admin-back">
          Voltar para o site
        </Link>
      </div>
    </main>
  ));
}
