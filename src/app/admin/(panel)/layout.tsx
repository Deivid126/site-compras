import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-shell">
      <header className="adm-topbar">
        <div className="adm-topbar-inner">
          <Link href="/admin" className="adm-brand">
            <span className="adm-brand-mark">🏁</span>
            <span className="adm-brand-text">
              <strong>Pista Admin</strong>
              <small>Presentes do Noah</small>
            </span>
          </Link>

          <nav className="adm-topnav">
            <Link href="/admin" className="adm-navlink">
              Itens
            </Link>
            <Link href="/admin/items/new" className="adm-navlink">
              Novo
            </Link>
            <Link href="/" className="adm-navlink adm-navlink-muted">
              Ver site ↗
            </Link>
          </nav>

          <form action="/api/admin/logout" method="POST" className="adm-logout-form">
            <button type="submit" className="adm-btn adm-btn-ghost">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="adm-main">{children}</main>
    </div>
  );
}