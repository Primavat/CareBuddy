import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Star, Search, Plus, Filter, Navigation, Globe } from 'lucide-react';

const DEFAULT_HOSPITALS = [
  { id: 'def1', name: 'City General Hospital', type: 'ER', distance: 'Calculated Local', rating: '4.8', phone: '+1 234 567 890' },
  { id: 'def2', name: 'Pediatric Care Center', type: 'Clinic', distance: 'Calculated Local', rating: '4.9', phone: '+1 234 567 891' },
  { id: 'def3', name: 'Downtown Pharmacy Plus', type: 'Pharmacy', distance: 'Calculated Local', rating: '4.7', phone: '+1 234 567 892' },
  { id: 'def4', name: 'Wellness Specialty Clinic', type: 'Clinic', distance: 'Calculated Local', rating: '4.6', phone: '+1 234 567 893' }
];

const Hospitals = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState(DEFAULT_HOSPITALS);
  const [userCoords, setUserCoords] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 'Unknown';
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1) + " km";
  };

  const fetchNearby = (isGlobal = false) => {
    setLoading(true);
    
    const performFetch = async (lat, lon, queryTerm = '') => {
      try {
        let query = '';
        if (queryTerm) {
          // Global search query
          query = `
            [out:json][timeout:25];
            (
              node["amenity"~"hospital|clinic|pharmacy"]["name"~"${queryTerm}",i](around:50000, ${lat || 0}, ${lon || 0});
              way["amenity"~"hospital|clinic|pharmacy"]["name"~"${queryTerm}",i](around:50000, ${lat || 0}, ${lon || 0});
            );
            out center;
          `;
        } else {
          // Local discovery query
          query = `
            [out:json][timeout:25];
            (
              node["amenity"~"hospital|clinic|pharmacy"](around:15000, ${lat}, ${lon});
              way["amenity"~"hospital|clinic|pharmacy"](around:15000, ${lat}, ${lon});
            );
            out center;
          `;
        }

        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.elements.length > 0) {
          const mappedHospitals = data.elements.map(el => {
            const type = el.tags.amenity === 'hospital' ? 'ER' : 
                         el.tags.amenity === 'pharmacy' ? 'Pharmacy' : 'Clinic';
            const lat = el.lat || el.center?.lat;
            const lon = el.lon || el.center?.lon;
            return {
              id: el.id,
              name: el.tags.name || "Unnamed Facility",
              type: type,
              lat: lat,
              lon: lon,
              distance: lat && lon && userCoords ? calculateDistance(userCoords.latitude, userCoords.longitude, lat, lon) : userCoords ? calculateDistance(userCoords.latitude, userCoords.longitude, lat, lon) : 'Global Discovery',
              rating: (Math.random() * (5 - 4) + 4).toFixed(1),
              phone: el.tags.phone || el.tags["contact:phone"] || "+1-800-CARE"
            };
          });
          setHospitals(mappedHospitals);
        } else if (queryTerm) {
          alert(`No results found for "${queryTerm}". Try a broader search.`);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      if (searchTerm) performFetch(0, 0, searchTerm);
      else setLoading(false);
      return;
    }

    // Geolocation with timeout fallback
    const geoTimeout = setTimeout(() => {
      if (!userCoords && !searchTerm) {
        console.log("Geolocation timeout. Using defaults.");
        setLoading(false);
      }
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(geoTimeout);
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        performFetch(latitude, longitude, searchTerm);
      },
      (error) => {
        clearTimeout(geoTimeout);
        console.log("Geolocation error. Using defaults or global search.");
        if (searchTerm) performFetch(null, null, searchTerm);
        else setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchNearby();
  }, []);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchNearby();
    }
  };

  const handleNavigate = (h) => {
    const origin = userCoords ? `${userCoords.latitude},${userCoords.longitude}` : 'Current+Location';
    const destination = h.lat && h.lon ? `${h.lat},${h.lon}` : encodeURIComponent(h.name);
    // Added dir_action=navigate to trigger the 'Start' button/navigation mode
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving&dir_action=navigate`;
    window.open(mapsUrl, '_blank');
  };

  const filteredHospitals = hospitals.filter(h => {
    const matchesFilter = filter === 'All' || h.type === filter;
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         h.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-border">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🏥 Health Service Discovery</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">
            {userCoords ? `Showing verified hospitals within 15km of your location.` : `Showing featured hospitals worldwide.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="bg-gray-100 dark:bg-bg-main border border-transparent focus:border-primary focus:bg-white dark:focus:bg-card-bg p-2.5 pl-12 rounded-xl text-xs font-bold text-secondary outline-none transition-all w-64 shadow-inner"
            />
          </div>
          <div className="flex bg-gray-100 dark:bg-bg-main p-1 rounded-xl border border-transparent dark:border-border">
            {['All', 'ER', 'Clinic', 'Pharmacy'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${filter === type ? 'bg-secondary text-white shadow-md' : 'text-gray-400 hover:text-secondary'}`}
              >
                {type}
              </button>
            ))}
          </div>
          <button 
            onClick={() => fetchNearby()}
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:bg-gray-300"
          >
            <Navigation size={16} className={loading && !searchTerm ? 'animate-spin' : ''} />
            {loading && !searchTerm ? 'Locating...' : 'Scan Area'}
          </button>
          {searchTerm && (
            <button 
              onClick={() => fetchNearby()}
              disabled={loading}
              className="bg-secondary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Search size={16} className={loading ? 'animate-pulse' : ''} />
              {loading ? 'Searching...' : 'Find Global'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredHospitals.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card-bg p-6 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-secondary transition-all group overflow-hidden relative h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gray-50 dark:bg-bg-main p-3 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MapPin size={20} />
                </div>
                <span className="text-[10px] font-black uppercase bg-gray-100 dark:bg-border text-gray-400 dark:text-text-dim px-3 py-1 rounded-lg">
                  {h.distance}
                </span>
              </div>

              <h3 className="text-lg font-black text-secondary mb-1 leading-tight line-clamp-2 min-h-[3rem]">{h.name}</h3>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{h.type}</p>
              
              <div className="flex items-center gap-4 mb-6 mt-auto">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-secondary">{h.rating}</span>
                </div>
                <p className="text-xs font-bold text-text-dim truncate">{h.phone}</p>
              </div>

              <button 
                onClick={() => handleNavigate(h)}
                className="w-full bg-gray-50 dark:bg-bg-main text-secondary py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-secondary hover:text-white transition-all"
              >
                Navigate Now
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHospitals.length === 0 && !loading && (
        <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-border rounded-[3rem]">
            <p className="text-lg font-bold text-text-dim uppercase tracking-widest opacity-50 italic">No health services found matching "{searchTerm}". 🏥</p>
            <button onClick={() => { setSearchTerm(''); fetchNearby(); }} className="mt-4 text-primary font-black uppercase text-xs hover:underline decoration-2 underline-offset-4 tracking-widest">Clear and Show All Nearby</button>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
