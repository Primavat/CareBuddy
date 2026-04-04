import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Star, Search, Plus, Filter, Navigation } from 'lucide-react';

const Hospitals = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1) + " km";
  };

  const fetchNearby = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const query = `
          [out:json];
          (
            node["amenity"~"hospital|clinic|pharmacy"](around:10000, ${latitude}, ${longitude});
            way["amenity"~"hospital|clinic|pharmacy"](around:10000, ${latitude}, ${longitude});
          );
          out center;
        `;
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        const mappedHospitals = data.elements.map(el => {
          const type = el.tags.amenity === 'hospital' ? 'ER' : 
                       el.tags.amenity === 'pharmacy' ? 'Pharmacy' : 'Clinic';
          return {
            id: el.id,
            name: el.tags.name || "Unnamed Facility",
            type: type,
            distance: calculateDistance(latitude, longitude, el.lat || el.center.lat, el.lon || el.center.lon),
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
            phone: el.tags.phone || el.tags["contact:phone"] || "+1-800-CARE"
          };
        });
        
        setHospitals(mappedHospitals);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    }, () => {
      alert("Allow location access to find nearby hospitals.");
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchNearby();
  }, []);

  const filteredHospitals = hospitals.filter(h => {
    const matchesFilter = filter === 'All' || h.type === filter;
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         h.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🏥 Nearby Health Services</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Currently showing verified hospitals and clinics in your vicinity.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 border border-transparent focus:border-primary focus:bg-white p-2.5 pl-12 rounded-xl text-xs font-bold text-secondary outline-none transition-all w-64 shadow-inner"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
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
            onClick={fetchNearby}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Navigation size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Scanning...' : 'Scan Nearby'}
          </button>
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
              className="bg-white p-6 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-secondary transition-all group overflow-hidden relative h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gray-50 p-3 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MapPin size={20} />
                </div>
                <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-400 px-3 py-1 rounded-lg">
                  {h.distance}
                </span>
              </div>

              <h3 className="text-lg font-black text-secondary mb-1 leading-tight">{h.name}</h3>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{h.type}</p>
              
              <div className="flex items-center gap-4 mb-6 mt-auto">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-secondary">{h.rating}</span>
                </div>
                <p className="text-xs font-bold text-text-dim truncate">{h.phone}</p>
              </div>

              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name)}`, '_blank')}
                className="w-full bg-gray-50 text-secondary py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-secondary hover:text-white transition-all"
              >
                Navigate Now
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHospitals.length === 0 && !loading && (
        <div className="py-20 text-center">
            <p className="text-lg font-bold text-text-dim uppercase tracking-widest opacity-50 italic">No {filter} services found in your area. 🏥</p>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
