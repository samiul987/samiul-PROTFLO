import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight,
  Package,
  CreditCard,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { db, auth, googleProvider } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  subscribeCollection,
  subscribeDocument
} from '../services/dataService';
import { Project, Service, PricingCard, SiteSettings } from '../types';

const ADMIN_EMAIL = 'hamimsamiul7@gmail.com';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'pricing' | 'settings'>('projects');
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center text-white gap-4">
      <Loader2 className="animate-spin text-[#7721B1]" size={40} />
      <span className="font-black tracking-widest uppercase text-xs opacity-50">Initializing Console...</span>
    </div>
  );

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7721B1] blur-[200px] rounded-full opacity-20" />
        <h1 className="hero-heading text-5xl sm:text-7xl font-black uppercase mb-8 relative z-10">Admin Access</h1>
        <p className="text-[#D7E2EA]/40 mb-12 max-w-md relative z-10 leading-relaxed font-medium">This area is restricted to authorized administrative personnel only. Please sign in to continue.</p>
        <button 
          onClick={handleLogin}
          className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-[#D7E2EA] transition-all flex items-center gap-3 relative z-10 scale-110 shadow-2xl"
        >
          Sign in with Google
        </button>
        {user && user.email !== ADMIN_EMAIL && (
           <motion.p 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-8 text-red-500 font-bold uppercase tracking-widest text-[10px] bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20"
           >
             Unauthorized: {user.email}
           </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex font-sans selection:bg-white selection:text-black">
      {/* Sidebar */}
      <aside className="w-20 md:w-80 bg-[#0C0C0C] border-r border-[#D7E2EA]/10 flex flex-col pt-12 pb-6 sticky top-0 h-screen z-50">
        <div className="px-8 mb-16 hidden md:block">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Samiul<span className="text-[#7721B1] ml-1">Console</span></h2>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-3">
          <NavItem icon={LayoutDashboard} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <NavItem icon={Package} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <NavItem icon={CreditCard} label="Pricing" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
          <NavItem icon={SettingsIcon} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="px-4 mt-auto flex flex-col gap-3">
          <Link 
            to="/" 
            className="flex items-center gap-4 px-4 py-4 rounded-xl text-[#D7E2EA]/40 hover:text-[#D7E2EA] hover:bg-[#D7E2EA]/5 transition-all uppercase font-black text-[10px] tracking-widest"
          >
            <ArrowLeft size={18} />
            <span className="hidden md:block">Back to Site</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all uppercase font-black text-[10px] tracking-widest"
          >
            <LogOut size={18} />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-16 lg:p-24 overflow-y-auto max-w-[1600px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-20">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
              {activeTab}<span className="text-[#7721B1]">.</span>
            </h1>
            <p className="text-xs uppercase font-bold tracking-[0.4em] text-[#D7E2EA]/30 ml-1">Administrative Dashboard</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 pr-6 rounded-[24px]">
             <img src={user.photoURL} alt="" className="w-12 h-12 rounded-2xl border-2 border-[#7721B1] shadow-xl" />
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#D7E2EA]/40 uppercase tracking-widest">Operator State</span>
                <span className="text-sm font-black text-white">{user.displayName || 'Admin User'}</span>
             </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'projects' && <ProjectManager key="projects" />}
          {activeTab === 'services' && <ServiceManager key="services" />}
          {activeTab === 'pricing' && <PricingManager key="pricing" />}
          {activeTab === 'settings' && <SettingsManager key="settings" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-500 group ${
        active 
        ? 'bg-white text-black shadow-2xl shadow-white/10 scale-105' 
        : 'text-[#D7E2EA]/30 hover:text-[#D7E2EA] hover:bg-white/5'
      }`}
    >
      <Icon size={20} className={active ? 'text-black' : 'group-hover:scale-110 transition-transform'} />
      <span className="hidden md:block uppercase font-black text-xs tracking-widest">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto hidden md:block" />}
    </button>
  );
}

// --- Specific Managers ---

function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection<Project>('projects', (data) => {
      setProjects(data.sort((a, b) => a.order - b.order));
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    setSaving(true);
    try {
      if (projects.find(p => p.id === isEditing.id)) {
        await updateDocument('projects', isEditing.id, isEditing);
      } else {
        await createDocument('projects', isEditing.id, isEditing);
      }
      setIsEditing(null);
    } catch (err) { alert(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project permanently?')) {
      try {
        await deleteDocument('projects', id);
      } catch (err) { alert(err); }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "circOut" }}
    >
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsEditing({ id: `project-${Date.now()}`, name: '', category: 'Personal', images: { col1_1: '', col1_2: '', col2: '' }, order: projects.length })}
        className="mb-12 px-10 py-5 bg-[#D7E2EA]/5 border border-[#D7E2EA]/10 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all flex items-center gap-3 shadow-xl"
      >
        <Plus size={20} /> Create New Project
      </motion.button>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {projects.map((p, i) => (
          <motion.div 
            key={p.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#141414] border border-white/5 p-8 rounded-[40px] flex gap-8 hover:border-white/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full translate-x-10 -translate-y-10 group-hover:bg-[#7721B1]/20 transition-colors duration-700" />
            
            <div className="w-40 h-40 rounded-[32px] overflow-hidden bg-[#0C0C0C] shrink-0 border border-white/10 group-hover:border-[#7721B1]/50 transition-colors duration-700 shadow-2xl relative z-10">
               <img src={p.images.col1_1} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            
            <div className="flex-1 flex flex-col relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#7721B1]">{p.category}</span>
                <span className="text-sm font-black text-white/10">#{p.order + 1}</span>
              </div>
              <h3 className="text-2xl font-black uppercase text-white mt-2 group-hover:text-[#D7E2EA] transition-colors">{p.name || 'Untitled Project'}</h3>
              
              <div className="mt-8 flex gap-6">
                <button onClick={() => setIsEditing(p)} className="text-[10px] uppercase font-black tracking-[0.2em] text-[#D7E2EA]/40 hover:text-white transition-all flex items-center gap-2">
                   Edit Details
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-[10px] uppercase font-black tracking-[0.2em] text-red-500/40 hover:text-red-500 transition-all flex items-center gap-2">
                   Expunge
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
            <motion.form 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onSubmit={handleSave} 
              className="bg-[#0C0C0C] border border-white/10 p-12 rounded-[50px] w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col gap-10 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)] border-b-[#7721B1]/30"
            >
              <div className="flex justify-between items-center bg-[#141414] -mx-12 -mt-12 p-10 mb-2 border-b border-white/10">
                 <div className="flex flex-col">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Project Configuration</h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#D7E2EA]/30 mt-1">Entity ID: {isEditing.id}</p>
                 </div>
                 <button type="button" onClick={() => setIsEditing(null)} className="p-4 bg-white/5 rounded-2xl text-[#D7E2EA] hover:bg-white hover:text-black transition-all">
                    <X size={24} />
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormGroup label="Slug (Permanent ID)" value={isEditing.id} onChange={v => setIsEditing({...isEditing, id: v})} required disabled={projects.some(p => p.id === isEditing.id)} />
                <FormGroup label="Display Name" value={isEditing.name} onChange={v => setIsEditing({...isEditing, name: v})} required />
                
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#D7E2EA]/20">Categorization</label>
                  <select 
                    value={isEditing.category} 
                    onChange={e => setIsEditing({...isEditing, category: e.target.value as any})}
                    className="bg-[#141414] border border-white/10 p-5 rounded-2xl text-[#D7E2EA] outline-none focus:border-[#7721B1] transition-all appearance-none cursor-pointer font-bold uppercase tracking-widest text-xs"
                  >
                    <option value="Client">Client Project</option>
                    <option value="Personal">Personal Pursuit</option>
                  </select>
                </div>

                <FormGroup label="Relative Priority (0+)" type="number" value={isEditing.order} onChange={v => setIsEditing({...isEditing, order: Math.max(0, parseInt(v) || 0)})} required />
                
                <div className="md:col-span-2">
                  <FormGroup label="Remote Access URL (Optional)" value={isEditing.liveLink || ''} onChange={v => setIsEditing({...isEditing, liveLink: v})} placeholder="https://..." />
                </div>
                
                <div className="md:col-span-2 border-t border-white/5 pt-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D7E2EA]/20 mb-8">Visual Assets Management</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ImageGroup label="Primary (1:1)" value={isEditing.images.col1_1} onChange={v => setIsEditing({...isEditing, images: {...isEditing.images, col1_1: v}})} />
                    <ImageGroup label="Secondary (Portrait)" value={isEditing.images.col1_2} onChange={v => setIsEditing({...isEditing, images: {...isEditing.images, col1_2: v}})} />
                    <ImageGroup label="Feature (Landscape)" value={isEditing.images.col2} onChange={v => setIsEditing({...isEditing, images: {...isEditing.images, col2: v}})} />
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-4">
                <button type="submit" disabled={saving} className="flex-1 py-7 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-[24px] hover:bg-[#7721B1] hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50">
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Synchronize Data
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection<Service>('services', (data) => {
      setServices(data.sort((a, b) => a.order - b.order));
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    setSaving(true);
    try {
      if (services.find(s => s.id === isEditing.id)) {
        await updateDocument('services', isEditing.id, isEditing);
      } else {
        await createDocument('services', isEditing.id, isEditing);
      }
      setIsEditing(null);
    } catch (err) { alert(err); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <button 
        onClick={() => setIsEditing({ id: (services.length + 1).toString().padStart(2, '0'), name: '', description: '', order: services.length })}
        className="mb-12 px-10 py-5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest hover:border-[#7721B1] hover:bg-[#7721B1]/5 transition-all flex items-center gap-3 shadow-xl"
      >
        <Plus size={20} /> Deploy New Service
      </button>

      <div className="flex flex-col gap-6">
        {services.map((s, i) => (
          <motion.div 
            key={s.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#141414] border border-white/5 p-10 rounded-[40px] flex items-center justify-between group hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-10">
              <span className="text-5xl font-black text-white/5 group-hover:text-[#7721B1]/20 transition-colors">{s.id}</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-black uppercase text-white group-hover:text-[#D7E2EA] transition-colors">{s.name}</h3>
                <p className="text-sm font-medium text-[#D7E2EA]/40 line-clamp-1 max-w-xl group-hover:text-[#D7E2EA]/60 transition-colors">{s.description}</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
              <button onClick={() => setIsEditing(s)} className="p-4 bg-white/5 rounded-2xl hover:bg-white hover:text-black transition-all"><SettingsIcon size={20} /></button>
              <button 
                 onClick={async () => { if(confirm('Delete service?')) await deleteDocument('services', s.id) }} 
                 className="p-4 bg-red-500/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >
                 <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
            <motion.form 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSave} 
              className="bg-[#0C0C0C] border border-white/10 p-12 rounded-[50px] w-full max-w-xl flex flex-col gap-10 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Service Profile</h2>
                 <button type="button" onClick={() => setIsEditing(null)} className="text-[#D7E2EA]/40 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-10">
                <FormGroup label="Operational ID (e.g. 01)" value={isEditing.id} onChange={v => setIsEditing({...isEditing, id: v})} required />
                <FormGroup label="Service Offering Title" value={isEditing.name} onChange={v => setIsEditing({...isEditing, name: v})} required />
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#D7E2EA]/20">Functional Description</label>
                  <textarea 
                    value={isEditing.description} 
                    onChange={e => setIsEditing({...isEditing, description: e.target.value})}
                    rows={6}
                    className="bg-[#141414] border border-white/10 p-6 rounded-2xl text-[#D7E2EA] outline-none focus:border-[#7721B1] transition-all resize-none text-sm font-medium leading-relaxed"
                    required
                  />
                </div>
                <FormGroup label="Index Order" type="number" value={isEditing.order} onChange={v => setIsEditing({...isEditing, order: parseInt(v)})} required />
              </div>
              
              <button 
                type="submit" 
                disabled={saving}
                className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-[24px] hover:bg-[#7721B1] hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Commit Deployment
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PricingManager() {
  const [pricing, setPricing] = useState<PricingCard[]>([]);
  const [isEditing, setIsEditing] = useState<PricingCard | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection<PricingCard>('pricing', (data) => {
      setPricing(data.sort((a, b) => a.order - b.order));
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    setSaving(true);
    try {
      if (pricing.find(p => p.id === isEditing.id)) {
        await updateDocument('pricing', isEditing.id, isEditing);
      } else {
        await createDocument('pricing', isEditing.id, isEditing);
      }
      setIsEditing(null);
    } catch (err) { alert(err); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <button 
        onClick={() => setIsEditing({ id: `${Date.now()}`, title: '', price: '', features: [''], ctaText: 'Reserve Now', order: pricing.length, isPopular: false })}
        className="mb-12 px-10 py-5 bg-white text-black border-2 border-white rounded-2xl font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-all flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
      >
        <Plus size={20} /> Initialize Investment Plan
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricing.map((p, i) => (
          <motion.div 
            key={p.id} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-[#141414] border ${p.isPopular ? 'border-[#7721B1]/50 shadow-[0_30px_60px_-10px_rgba(119,33,177,0.2)]' : 'border-white/5'} p-10 rounded-[50px] flex flex-col group transition-all duration-700 relative overflow-hidden`}
          >
            {p.isPopular && <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-[#7721B1] animate-ping" />}
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#D7E2EA]/30 mb-2">{p.title}</h3>
            <span className="text-4xl font-black text-white mb-8 tracking-tighter">{p.price}</span>
            <div className="flex-1 flex flex-col gap-4 mb-12 border-t border-white/5 pt-8">
               {p.features.slice(0,3).map((f, i) => <div key={i} className="text-xs font-medium text-[#D7E2EA]/40 truncate flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#7721B1]/40" /> {f}</div>)}
               {p.features.length > 3 && <div className="text-[10px] text-[#7721B1] uppercase font-black tracking-widest mt-2">{p.features.length - 3} additional privileges</div>}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsEditing(p)} className="flex-1 py-4 bg-white/5 rounded-2xl uppercase font-black text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all">Modify</button>
              <button 
                 onClick={async () => { if(confirm('Erase this plan?')) await deleteDocument('pricing', p.id) }} 
                 className="p-4 bg-red-500/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
              >
                 <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
            <motion.form 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onSubmit={handleSave} 
              className="bg-[#0C0C0C] border border-white/10 p-12 rounded-[50px] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-12 shadow-2xl relative scrollbar-hide"
            >
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Investment Plan Setup</h2>
                 <button type="button" onClick={() => setIsEditing(null)} className="p-4 bg-white/10 rounded-2xl text-white hover:bg-white hover:text-black transition-all shadow-xl">
                    <X size={24} />
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormGroup label="Plan Title" value={isEditing.title} onChange={v => setIsEditing({...isEditing, title: v})} required />
                <FormGroup label="Valuation (e.g. $2,499+)" value={isEditing.price} onChange={v => setIsEditing({...isEditing, price: v})} required />
                <FormGroup label="Call to Action" value={isEditing.ctaText} onChange={v => setIsEditing({...isEditing, ctaText: v})} required />
                <FormGroup label="Order Priority" type="number" value={isEditing.order} onChange={v => setIsEditing({...isEditing, order: parseInt(v)})} required />
                <div className="md:col-span-2">
                   <FormGroup label="Direct Link Override (External or #id)" value={isEditing.ctaLink || ''} onChange={v => setIsEditing({...isEditing, ctaLink: v})} placeholder="#contact" />
                </div>
                <div className="flex items-center gap-6 mt-4 md:col-span-2 bg-white/5 p-6 rounded-[24px] border border-white/5">
                   <input 
                     type="checkbox" 
                     id="isPopular"
                     checked={isEditing.isPopular} 
                     onChange={e => setIsEditing({...isEditing, isPopular: e.target.checked})}
                     className="w-7 h-7 accent-[#7721B1] cursor-pointer"
                   />
                   <label htmlFor="isPopular" className="text-xs uppercase font-black tracking-widest text-white cursor-pointer select-none">Designate as Recommended Plan</label>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <label className="text-[10px] uppercase font-black tracking-[0.5em] text-[#D7E2EA]/20 mb-2">Entitlements & Features</label>
                <div className="flex flex-col gap-4">
                  {isEditing.features.map((f, i) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-[10px] font-black">{i+1}</div>
                      <input 
                        value={f} 
                        onChange={e => {
                          const newFeats = [...isEditing.features];
                          newFeats[i] = e.target.value;
                          setIsEditing({...isEditing, features: newFeats});
                        }}
                        className="flex-1 bg-transparent border-b border-white/10 py-3 text-sm font-medium outline-none focus:border-[#7721B1] transition-all"
                        placeholder="Feature description..."
                      />
                      <button type="button" onClick={() => {
                        const newFeats = isEditing.features.filter((_, idx) => idx !== i);
                        setIsEditing({...isEditing, features: newFeats});
                      }} className="p-3 text-red-500/40 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                    </motion.div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsEditing({...isEditing, features: [...isEditing.features, '']})} 
                  className="w-fit px-8 py-4 bg-white/5 text-[10px] uppercase font-black tracking-[0.3em] text-white hover:bg-white hover:text-black rounded-xl transition-all flex items-center gap-3 mt-4"
                >
                  <Plus size={16} /> Append Feature
                </button>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full py-7 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-[24px] hover:bg-[#7721B1] hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Deploy To Commercial Model
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingsManager() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const unsub = subscribeDocument<SiteSettings>('settings', 'global', (data) => {
       if (data) {
         setSettings(data);
       } else {
         setSettings({
           email: "hamimsamiul7@gmail.com",
           phone1: "+880 1724948188",
           phone2: "+880 1767046073",
           twitter: "https://x.com/weborix5",
           instagram: "https://www.instagram.com/samiul_web_orix/",
           whatsapp: "https://wa.me/message/2WOVEZQU6ARTP1",
           aboutText: "We are a results-driven web development team focused on helping businesses grow through powerful digital experiences. Our approach combines strategic thinking, modern design, and clean development to build websites that don’t just look impressive—but actually perform.",
           heroText: "Hi, i'm samiul"
         });
       }
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) { alert(err); }
    finally { setSaving(false); }
  };

  if (!settings) return (
    <div className="flex items-center gap-4 p-20 text-[#D7E2EA]/20">
      <Loader2 className="animate-spin" />
      <span className="uppercase font-black tracking-widest text-xs">Accessing System Defaults...</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <form onSubmit={handleSave} className="max-w-4xl flex flex-col gap-12 bg-[#141414] border border-white/5 p-12 lg:p-16 rounded-[60px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7721B1]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <SectionTitle>Communication Channels</SectionTitle>
          <FormGroup label="Admin Email Gateway" value={settings.email} onChange={v => setSettings({...settings, email: v})} />
          <FormGroup label="WhatsApp Connector" value={settings.whatsapp} onChange={v => setSettings({...settings, whatsapp: v})} placeholder="https://wa.me/..." />
          <FormGroup label="Primary Line" value={settings.phone1} onChange={v => setSettings({...settings, phone1: v})} />
          <FormGroup label="Secondary Line" value={settings.phone2} onChange={v => setSettings({...settings, phone2: v})} />
          
          <SectionTitle className="mt-8">Social Presence</SectionTitle>
          <FormGroup label="X / Twitter Identity" value={settings.twitter} onChange={v => setSettings({...settings, twitter: v})} />
          <FormGroup label="Instagram Handle" value={settings.instagram} onChange={v => setSettings({...settings, instagram: v})} />
        </div>

        <div className="flex flex-col gap-8 relative z-10 border-t border-white/5 pt-12">
          <SectionTitle>Global Site Content</SectionTitle>
          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase font-black tracking-[0.5em] text-[#D7E2EA]/20">Hero Brand Heading</label>
            <input 
              value={settings.heroText} 
              onChange={e => setSettings({...settings, heroText: e.target.value})}
              className="bg-[#0C0C0C] border border-white/10 p-6 rounded-2xl text-2xl font-black uppercase text-white outline-none focus:border-[#7721B1] transition-all"
              placeholder="Hi, I'm Samiul"
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase font-black tracking-[0.5em] text-[#D7E2EA]/20">Core Narrative (About)</label>
            <textarea 
              value={settings.aboutText} 
              onChange={e => setSettings({...settings, aboutText: e.target.value})}
              rows={8}
              className="bg-[#0C0C0C] border border-white/10 p-8 rounded-3xl text-sm font-medium leading-relaxed text-[#D7E2EA] outline-none focus:border-[#7721B1] transition-all resize-none shadow-inner"
              placeholder="Enter the main brand story..."
            />
          </div>
        </div>

        <motion.button 
          type="submit" 
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative py-8 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-[32px] hover:bg-[#7721B1] hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl shadow-black/80 group overflow-hidden disabled:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={22} />}
          Synchronize Environment
        </motion.button>
      </form>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-[200] bg-white text-black px-10 py-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex items-center gap-4 border-2 border-[#7721B1]/20"
          >
            <div className="w-8 h-8 rounded-full bg-[#7721B1] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            Global Configuration Updated Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Internal UI Components ---

function FormGroup({ label, value, onChange, required, type = "text", disabled = false, placeholder = "" }: { label: string, value: any, onChange: (v: string) => void, required?: boolean, type?: string, disabled?: boolean, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-3 group">
      <label className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#D7E2EA]/20 group-focus-within:text-[#7721B1] transition-colors">{label}</label>
      <input 
        type={type}
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#141414] border-b-2 border-white/5 py-4 text-white placeholder:text-white/10 focus:border-[#7721B1] outline-none transition-all font-bold text-sm tracking-tight disabled:opacity-20 translate-y-0 focus:-translate-y-1"
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

function ImageGroup({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D7E2EA]/30">{label}</label>
      <div className="aspect-square rounded-3xl bg-[#141414] border-2 border-dashed border-white/10 relative group overflow-hidden transition-all hover:border-[#7721B1]/50">
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-2">
             <Plus size={24} />
             <span className="text-[9px] font-black uppercase">No Media</span>
          </div>
        )}
        <input 
          type="text" 
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL..."
          className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md p-3 text-[10px] text-white outline-none focus:bg-black transition-all opacity-0 group-hover:opacity-100 placeholder:text-white/20"
        />
      </div>
    </div>
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`col-span-full border-l-4 border-[#7721B1] pl-6 ${className}`}>
       <h3 className="text-xl font-black uppercase tracking-tighter text-white">{children}</h3>
    </div>
  );
}
