'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Film, Music, Heart, Swords, Ghost, Rocket, 
  Search, Smile, Zap, Theater, HelpCircle, Loader2, Star 
} from 'lucide-react';

const GENRES = [
  { name: 'Ação', slug: 'action', icon: Swords, color: 'from-red-500 to-orange-600' },
  { name: 'Aventura', slug: 'adventure', icon: Rocket, color: 'from-blue-500 to-cyan-600' },
  { name: 'Animação', slug: 'animation', icon: Zap, color: 'from-amber-400 to-orange-500' },
  { name: 'Comédia', slug: 'comedy', icon: Smile, color: 'from-yellow-400 to-amber-500' },
  { name: 'Crime', slug: 'crime', icon: Search, color: 'from-slate-600 to-slate-800' },
  { name: 'Documentário', slug: 'documentary', icon: Film, color: 'from-emerald-500 to-teal-600' },
  { name: 'Drama', slug: 'drama', icon: Theater, color: 'from-indigo-500 to-purple-600' },
  { name: 'Fantasia', slug: 'fantasy', icon: Star, color: 'from-purple-500 to-fuchsia-600' },
  { name: 'Terror', slug: 'horror', icon: Ghost, color: 'from-zinc-800 to-black' },
  { name: 'Mistério', slug: 'mystery', icon: HelpCircle, color: 'from-violet-600 to-indigo-800' },
  { name: 'Romance', slug: 'romance', icon: Heart, color: 'from-pink-500 to-rose-600' },
  { name: 'Ficção Científica', slug: 'sci-fi', icon: Rocket, color: 'from-blue-600 to-indigo-900' },
];

export default function GenresPage() {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      const tokenMatch = document.cookie.split('; ').find(row => row.startsWith('token='));
      const exp = localStorage.getItem('session_exp');
      
      if (tokenMatch && exp && Date.now() < parseInt(exp) * 1000) {
        setIsAuthorized(true);
        setIsLoading(false);
      } else {
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[2.5rem] text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Rocket className="text-primary" size={40} />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">Acesso Restrito</h2>
          <p className="text-white/40 mb-10 font-bold uppercase text-xs tracking-widest leading-relaxed">Você precisa de uma conta galáctica para explorar os gêneros.</p>
          <Link href="/auth/login" className="block w-full bg-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-transparent text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-4">
            Gêneros
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] italic">
            Explore o universo do entretenimento por categoria
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {GENRES.map((genre, index) => (
            <motion.div
              key={genre.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
            >
              <Link 
                href={`/genres/${genre.slug}`}
                className="group relative block aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between items-start z-10">
                  <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:bg-primary transition-all duration-300">
                    <genre.icon size={20} className="text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                      {genre.name}
                    </h3>
                  </div>
                </div>
                
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-all duration-700 blur-sm group-hover:blur-none">
                  <genre.icon size={80} className="text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
