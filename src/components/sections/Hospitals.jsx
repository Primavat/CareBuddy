import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, Phone, Hospital, Loader2 } from 'lucide-react';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchNearby = async () => {
    setLoading(true);
    if (!navigator.geolocation) return alert("Geolocation is not supported by your browser.");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital+near+${latitude},${longitude}&limit=10`;
        const res = await fetch(url, { headers: { 'User-Agent': 'CareBuddy/1.0' } });
        const data = await res.json();
        setHospitals(data.map(h => ({
          id: h.place_id,
          name: h.display_name.split(',')[0],
          address: h.display_name,
          distance: 'Scanning...',
          lat: h.lat,
          lon: h.lon
        })));
      } catch (e) {
        alert("Error fetching hospitals. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  };

  const openMaps = (lat, lon) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">📡 Nearby Hospitals</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Find emergency care and clinics in your immediate vicinity.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchNearby}
             className="bg-primary text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-all scale-105 active:scale-95"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />} 
             {loading ? 'Scanning Vicinity...' : 'Find Near Me'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {hospitals.length === 0 && !loading ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-border text-text-dim font-bold flex flex-col items-center gap-4">
              <Hospital size={48} className="opacity-20" />
              Click "Find Near Me" to start a live medical facility scan. 🌍
            </div>
          ) : (
            hospitals.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[32px] border border-border shadow-sm flex flex-col justify-between hover:border-primary transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Hospital size={120} /></div>
                
                <div className="relative z-10">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                    <Hospital size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-secondary mb-2 line-clamp-1">{h.name}</h4>
                  <p className="text-sm font-semibold text-text-dim leading-relaxed line-clamp-3 mb-6">{h.address}</p>
                </div>

                <div className="flex gap-3 relative z-10 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => openMaps(h.lat, h.lon)}
                    className="flex-1 bg-primary text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation size={14} /> Get Directions
                  </button>
                  <button className="p-3 bg-gray-50 text-secondary border border-border rounded-xl hover:bg-secondary hover:text-white transition-all">
                    <Phone size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hospitals;
