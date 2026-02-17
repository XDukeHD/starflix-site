/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await api.search(query, currentPage);
        if (response.data) {
          setResults(response.data);
          setMeta(response.meta);
        } else {
          setError(response.error || 'Erro na pesquisa');
        }
      } catch (err) {
        setError('Erro ao conectar com o serviço de busca');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-1 h-primary bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] italic">Resultados da galáxia</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            {query ? `Busca: ${query}` : 'Pesquisar'}
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="animate-spin text-primary" size={64} />
              <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse" />
            </div>
            <p className="text-white/40 font-black uppercase tracking-[0.2em] text-xs italic">Escaneando o setor...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/5 border border-red-500/10 p-12 rounded-[2.5rem] text-center max-w-2xl mx-auto backdrop-blur-xl">
             <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="text-red-500" size={32} />
             </div>
            <h3 className="text-xl font-black text-white uppercase italic mb-2">Sistema Offline</h3>
            <p className="text-red-400/60 font-medium">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
              <Search className="text-white/10" size={56} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight italic">Nenhum sinal detectado</h3>
            <p className="text-white/30 max-w-md mx-auto font-medium leading-relaxed">
              Não encontramos nenhum conteúdo correspondente à sua busca. Tente palavras-chave diferentes ou verifique a ortografia.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
              <AnimatePresence mode='popLayout'>
                {results.map((item, index) => (
                  <motion.div
                    key={item.uuid}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % 12) * 0.05, duration: 0.5 }}
                    className="group"
                  >
                    <Link href={`/content/${item.uuid}`} className="block h-full">
                      <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden bg-[#0a0a14] border border-white/5 transition-all duration-500 group-hover:scale-[1.04] group-hover:border-primary/50 group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.2)]">
                        <img
                          src={item.poster_path}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                           <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-xl shadow-primary/40">
                              <Play fill="white" size={20} className="ml-1" />
                           </div>
                           <span className="text-primary font-black text-[9px] uppercase tracking-widest mb-1 italic">
                              {item.content_type === 'movie' ? 'Filme' : 'Série'}
                           </span>
                           <h3 className="text-white font-black text-sm uppercase tracking-tighter line-clamp-2 leading-none mb-1">
                              {item.title}
                           </h3>
                           <p className="text-white/40 text-[10px] font-bold uppercase tracking-tighter">
                              {item.release_date ? new Date(item.release_date).getFullYear() : ''}
                           </p>
                        </div>
                        
                        <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                           {item.certificate && (
                             <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-2.5 py-1 rounded-lg">
                                <span className="text-white font-black text-[10px] italic">{item.certificate}</span>
                             </div>
                           )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-20 flex items-center justify-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary transition-all flex items-center justify-center group"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(meta.totalPages)].map((_, i) => {
                    const p = i + 1;
                    if (p === 1 || p === meta.totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-14 h-14 rounded-2xl font-black text-sm transition-all border ${
                            currentPage === p 
                              ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-110' 
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                    if (p === currentPage - 2 || p === currentPage + 2) {
                      return <span key={p} className="text-white/20 px-2 font-black italic">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.totalPages}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary transition-all flex items-center justify-center group"
                >
                  <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="relative">
          <Loader2 className="animate-spin text-primary" size={64} />
          <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse" />
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
