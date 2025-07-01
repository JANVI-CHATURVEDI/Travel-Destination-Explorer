// useState is React’s way to remember what the user selected.
import { useState } from 'react';
// go one folder up (..) to src than data/destination
import destinations from '../data/destinations';

import MapView from './MapView';


function DestinationList() {
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState('All');
  const [vibe, setVibe] = useState('All');
  const [budget, setBudget] = useState('All');
  const [rating, setRating] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState(null);


  // What You’re Doing:
  // You need to show filter options like:
  // All | Asia | Europe | etc.
  // So, you:
  // Extract the values from your destination data (like all continents).
  // Use Set() to remove duplicates.
  // Add "All" at the start.

  const getUnique = (arr, key) => ['All', ...new Set(arr.map(item => item[key]))];

  const allContinents = getUnique(destinations, 'continent');
  const allVibes = getUnique(destinations, 'vibe');
  const allBudgets = getUnique(destinations, 'budget');


  const filtered = destinations.filter(place => {
    const matchSearch = place.name.toLowerCase().includes(search.toLowerCase());
    const matchContinent = continent === 'All' || place.continent === continent;
    const matchVibe = vibe === 'All' || place.vibe === vibe;
    const matchBudget = budget === 'All' || place.budget === budget;
    const matchRating = rating === 'All' || place.rating >= parseFloat(rating);
    return matchSearch && matchContinent && matchVibe && matchBudget && matchRating;
  });



  // Reset All Filters
  const resetFilters = () => {
    setSearch('');
    setContinent('All');
    setVibe('All');
    setBudget('All');
    setRating('All');
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">


      {/* 🔍 Search */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2 max-w-md"
        />
      </div>




      {/* 🔽 Filters Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5  gap-2 mb-2">



        {/* 🌍 Continent Filter */}
        <div className="flex flex-col ">

          {/* This dropdown shows all continent options. When a user selects one, it updates the continent state.
You can repeat the same for vibe, budget, and rating by just changing the variable names and data.     */}
          <select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            className="p-2 border rounded cursor-pointer"
          > cursor-pointer
            {/* Dynamically create dropdown from continent list */}
            <option disabled value="All">Select Continent</option>
            {/* Loops through the allContinents array (like ["All", "Asia", "Europe"]).Creates an <option> for each item. */}
            {allContinents.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 💖 Vibe Filter */}
        <div className="flex flex-col ">

          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="p-2 border rounded cursor-pointer"
          >
            {/* Dynamically create dropdown from vibe list */}
            <option disabled value="All">Select Vibe</option>

            {allVibes.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* 💰 Budget Filter */}
        <div className="flex flex-col">

          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="p-2 border rounded cursor-pointer"
          >
            {/* Dynamically create dropdown from budget list */}
            <option disabled value="All">Select Budget</option>
            {allBudgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* ⭐ Rating Filter */}
        <div className="flex flex-col">

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="p-2 border rounded cursor-pointer"
          >
            <option disabled value="All">Select Rating</option>
            {/* Static options for min rating */}
            <option>All</option>
            <option value="4.5">4.5+</option>
            <option value="4.0">4.0+</option>
            <option value="3.5">3.5+</option>
          </select>
        </div>

        {/* 🔁 Reset Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={resetFilters}
            className="bg-red-100 text-red-700 hover:bg-red-200 rounded p-2 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>


      <MapView locations={filtered} selected={selectedDestination}  />


      {/* 📦 Display Cards Based on Filters*/}

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No matching destinations found.</p>
        ) : (
          filtered.map(place => (
            <div
              key={place.id}
              className="bg-white shadow rounded overflow-hidden cursor-pointer hover:scale-105 transition"
              onClick={() => setSelectedDestination(place)}
            >
              <img src={place.image} alt={place.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold">{place.name}</h2>
                <p className="text-sm text-gray-600">{place.description}</p>
                <p className="text-sm mt-2">🌍 {place.continent} | 💸 {place.budget} | 💖 {place.vibe}</p>
                <p className="text-sm">⭐ {place.rating}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DestinationList;                        