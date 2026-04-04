import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Star, Search, Plus, Filter, Navigation } from 'lucide-react';

const Hospitals = () => {
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [hospitals] = useState([
    { id: 1, name: 'City General Hospital', type: 'ER', distance: '1.2 km', rating: '4.8', phone: '+1 234 567 890' },
    { id: 2, name: 'Children Specialty Clinic', type: 'Clinic', distance: '3.5 km', rating: '4.5', phone: '+1 234 567 891' },
    { id: 3, name: 'Green Valley ER', type: 'ER', distance: '0.8 km', rating: '4.9', phone: '+1 234 567 892' },
    { id: 4, name: 'Downtown Pharmacy', type: 'Pharmacy', distance: '2.1 km', rating: '4.3', phone: '+1 234 567 893' }
  ]);

  const filteredHospitals = filter === 'All' ? hospitals : hospitals.filter(h => h.type === filter);

  const fetchNearby = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">🏥 Nearby Health Services</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Quick access to emergency rooms and specialty clinics in your area.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
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
            <Navigation size={16} className={loading ? 'animate-pulse' : ''} />
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
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-secondary transition-all group overflow-hidden relative"
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
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-secondary">{h.rating}</span>
                </div>
                <p className="text-xs font-bold text-text-dim truncate">{h.phone}</p>
              </div>

              <button className="w-full bg-gray-50 text-secondary py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-secondary hover:text-white transition-all">
                Navigate Now
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHospitals.length === 0 && (
        <div className="py-20 text-center">
            <p className="text-lg font-bold text-text-dim uppercase tracking-widest opacity-50 italic">No {filter} services found in your area. 🏥</p>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
