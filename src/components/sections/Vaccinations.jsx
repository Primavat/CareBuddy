import React from 'react';
import { motion } from 'framer-motion';
import { Syringe, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { VACCINE_SCHEDULE } from '../../constants/healthData';

const Vaccinations = () => {
  const [filter, setFilter] = useState('all');
  const [vaccines] = useState([
    { id: 1, name: 'BCG', date: 'Oct 2023', status: 'Completed', member: 'Baby Sam' },
    { id: 2, name: 'Polio (OPV)', date: 'Nov 2023', status: 'Overdue', member: 'Baby Sam' },
    { id: 3, name: 'Hepatitis B', date: 'Jan 2024', status: 'Upcoming', member: 'Baby Sam' },
    { id: 4, name: 'MMR', date: 'Feb 2024', status: 'Upcoming', member: 'Rahul' }
  ]);

  const filteredVaccines = filter === 'all' ? vaccines : vaccines.filter(v => v.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary mb-3 uppercase tracking-tight">💉 Vaccination Records</h2>
          <p className="text-sm font-bold text-text-dim italic leading-relaxed">Keep track of immunization schedules for your children and yourself.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {['all', 'overdue', 'upcoming', 'completed'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${filter === f ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-secondary'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-4">
          {filteredVaccines.map((v, i) => (
            <motion.div 
              key={v.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-border flex items-center gap-6 group hover:border-primary transition-all"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                <Syringe size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-secondary mb-1">{v.name}</h4>
                <p className="text-sm font-semibold text-text-dim leading-relaxed">{v.description}</p>
                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs font-black text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                    <Calendar size={12} /> {v.ageMonths === 0 ? 'At Birth' : v.ageMonths < 12 ? `${v.ageMonths} Months` : `${Math.floor(v.ageMonths/12)} Years+`}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    <Clock size={12} /> Recommended
                  </span>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-secondary border border-border rounded-2xl text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">
                Mark Done
              </button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-secondary p-8 rounded-[40px] text-white space-y-8 sticky top-28 shadow-2xl">
            <div>
              <h3 className="text-2xl font-bold mb-2">📊 Progress</h3>
              <p className="text-gray-400 font-bold text-sm">You have completed 4 out of 16 essential vaccines.</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 p-5 rounded-3xl border border-white/10">
                <div className="flex justify-between text-xs font-black uppercase mb-3 text-gray-300">
                  <span>Immunization Rate</span>
                  <span className="text-primary">25%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className="h-full bg-primary" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary"><CheckCircle2 size={16} /></div>
                   <div className="text-sm font-bold text-gray-200">BCG Completed</div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500"><Clock size={16} /></div>
                   <div className="text-sm font-bold text-gray-200">Polio Due (6 weeks)</div>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-lg border border-primary hover:bg-green-700 transition-colors">
              GENERATE FAMILY REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;
