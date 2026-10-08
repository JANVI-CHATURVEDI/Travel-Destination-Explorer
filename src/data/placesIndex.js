const placesIndex = [
  { id: 'paris', name: 'Paris', wikiTitle: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522, continent: 'Europe', vibe: 'Romantic', budget: 'High', rating: 4.8 },
  { id: 'bali', name: 'Bali', wikiTitle: 'Bali', country: 'Indonesia', countryCode: 'ID', lat: -8.3405, lng: 115.092, continent: 'Asia', vibe: 'Relaxing', budget: 'Medium', rating: 4.7 },
  { id: 'new-york', name: 'New York City', wikiTitle: 'New York City', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.006, continent: 'North America', vibe: 'Urban', budget: 'High', rating: 4.6 },
  { id: 'cape-town', name: 'Cape Town', wikiTitle: 'Cape Town', country: 'South Africa', countryCode: 'ZA', lat: -33.9249, lng: 18.4241, continent: 'Africa', vibe: 'Adventurous', budget: 'Medium', rating: 4.5 },
  { id: 'kyoto', name: 'Kyoto', wikiTitle: 'Kyoto', country: 'Japan', countryCode: 'JP', lat: 35.0116, lng: 135.7681, continent: 'Asia', vibe: 'Cultural', budget: 'Medium', rating: 4.9 },
  { id: 'santorini', name: 'Santorini', wikiTitle: 'Santorini', country: 'Greece', countryCode: 'GR', lat: 36.3932, lng: 25.4615, continent: 'Europe', vibe: 'Romantic', budget: 'High', rating: 4.8 },
  { id: 'reykjavik', name: 'Reykjavik', wikiTitle: 'Reykjavík', country: 'Iceland', countryCode: 'IS', lat: 64.1466, lng: -21.9426, continent: 'Europe', vibe: 'Chill', budget: 'High', rating: 4.4 },
  { id: 'bangkok', name: 'Bangkok', wikiTitle: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: 13.7563, lng: 100.5018, continent: 'Asia', vibe: 'Busy', budget: 'Low', rating: 4.3 },
  { id: 'machu-picchu', name: 'Machu Picchu', wikiTitle: 'Machu Picchu', country: 'Peru', countryCode: 'PE', lat: -13.1631, lng: -72.545, continent: 'South America', vibe: 'Adventurous', budget: 'Medium', rating: 4.9 },
  { id: 'venice', name: 'Venice', wikiTitle: 'Venice', country: 'Italy', countryCode: 'IT', lat: 45.4408, lng: 12.3155, continent: 'Europe', vibe: 'Romantic', budget: 'High', rating: 4.6 },
  { id: 'dubai', name: 'Dubai', wikiTitle: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2769, lng: 55.2962, continent: 'Asia', vibe: 'Luxury', budget: 'High', rating: 4.7 },
  { id: 'vancouver', name: 'Vancouver', wikiTitle: 'Vancouver', country: 'Canada', countryCode: 'CA', lat: 49.2827, lng: -123.1207, continent: 'North America', vibe: 'Nature', budget: 'High', rating: 4.5 },
  { id: 'sydney', name: 'Sydney', wikiTitle: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093, continent: 'Australia', vibe: 'Coastal', budget: 'High', rating: 4.6 },
  { id: 'prague', name: 'Prague', wikiTitle: 'Prague', country: 'Czech Republic', countryCode: 'CZ', lat: 50.0755, lng: 14.4378, continent: 'Europe', vibe: 'Historic', budget: 'Medium', rating: 4.4 },
  { id: 'jaipur', name: 'Jaipur', wikiTitle: 'Jaipur', country: 'India', countryCode: 'IN', lat: 26.9124, lng: 75.7873, continent: 'Asia', vibe: 'Cultural', budget: 'Low', rating: 4.5 },
  { id: 'queenstown', name: 'Queenstown, New Zealand', wikiTitle: 'Queenstown, New Zealand', country: 'New Zealand', countryCode: 'NZ', lat: -45.0312, lng: 168.6626, continent: 'Australia', vibe: 'Adventurous', budget: 'Medium', rating: 4.8 },
  { id: 'cairo', name: 'Cairo', wikiTitle: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357, continent: 'Africa', vibe: 'Historic', budget: 'Low', rating: 4.3 },
  { id: 'hanoi', name: 'Hanoi', wikiTitle: 'Hanoi', country: 'Vietnam', countryCode: 'VN', lat: 21.0278, lng: 105.8342, continent: 'Asia', vibe: 'Cultural', budget: 'Low', rating: 4.4 },
  { id: 'rio', name: 'Rio de Janeiro', wikiTitle: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', lat: -22.9068, lng: -43.1729, continent: 'South America', vibe: 'Festive', budget: 'Medium', rating: 4.6 },
  { id: 'zurich', name: 'Zurich', wikiTitle: 'Zürich', country: 'Switzerland', countryCode: 'CH', lat: 47.3769, lng: 8.5417, continent: 'Europe', vibe: 'Peaceful', budget: 'High', rating: 4.7 },
  { id: 'marrakech', name: 'Marrakech', wikiTitle: 'Marrakesh', country: 'Morocco', countryCode: 'MA', lat: 31.6295, lng: -7.9811, continent: 'Africa', vibe: 'Cultural', budget: 'Low', rating: 4.5 },
  { id: 'amalfi', name: 'Amalfi Coast', wikiTitle: 'Amalfi Coast', country: 'Italy', countryCode: 'IT', lat: 40.6281, lng: 14.485, continent: 'Europe', vibe: 'Coastal', budget: 'High', rating: 4.8 },
  { id: 'petra', name: 'Petra', wikiTitle: 'Petra', country: 'Jordan', countryCode: 'JO', lat: 30.3285, lng: 35.4444, continent: 'Asia', vibe: 'Historic', budget: 'Medium', rating: 4.9 },
  { id: 'banff', name: 'Banff', wikiTitle: 'Banff, Alberta', country: 'Canada', countryCode: 'CA', lat: 51.1784, lng: -115.5708, continent: 'North America', vibe: 'Nature', budget: 'Medium', rating: 4.8 },
];

export default placesIndex;

export function haversineKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
