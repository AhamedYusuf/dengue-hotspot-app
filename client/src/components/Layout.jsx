import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
        <p>
          DengueWatch &copy; {new Date().getFullYear()} &mdash; Community-driven dengue hotspot reporting
        </p>
      </footer>
    </div>
  );
}
