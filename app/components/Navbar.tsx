export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 flex items-center justify-between shadow">
     
      <div className="flex items-center gap-2 min-w-max">
        <img src="/window.svg" alt="Logo" className="h-8" />
        <span className="text-lg font-semibold tracking-wide">SecureSight</span>
      </div>

      <div className="flex-1 flex justify-center gap-4 text-sm">
        <button className="hover:text-yellow-300">Dashboard</button>
        <button className="hover:text-yellow-300">Cameras</button>
        <button className="hover:text-yellow-300">Scenes</button>
        <button className="hover:text-yellow-300">Incidents</button>
        <button className="hover:text-yellow-300">Users</button>
      </div>

      <div className="flex flex-col text-xs text-right min-w-max">
        <span>Mohammed Ajhas</span>
        <span className="text-gray-400">ajhas@mandlac.com</span>
      </div>
    </nav>
  );
}
