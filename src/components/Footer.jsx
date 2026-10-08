export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-semibold text-stone-800">Travel Destination Explorer</span> · live photos via Wikipedia, weather via Open-Meteo, country facts via CountriesNow + FlagCDN.
        </p>
        <p className="text-xs">Built with React · Tailwind · Leaflet · React Router</p>
      </div>
    </footer>
  );
}
