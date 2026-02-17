/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { Search, Loader2, Play } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const router = useRouter();
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split('; ');
      const token = cookies.find(row => row.startsWith('token='));
      const exp = localStorage.getItem('session_exp');
      
      if (!token || !exp || Date.now() >= parseInt(exp) * 1000) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || isAuthorized === false) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await api.content.search(query);
        if (data.success) {
          setResults(data.data || []);
        } else {
          setError(data.message || 'Erro ao buscar conteúdos');
        }
      } catch (err) {
        setError('Ocorreu um erro na busca');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized !== null) {
      fetchResults();
    }
  }, [query, isAuthorized]);

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] text-center max-w-md w-full shadow-2xl"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 italic tracking-tighter">ACESSO RESTRITO</h2>
          <p className="text-white/50 mb-8 font-medium leading-relaxed">
            Faça login para pesquisar e acessar nosso catálogo completo de filmes e séries.
          </p>
          <Link 
            href="/auth/login"
            className="block w-full bg-primary hover:bg-white text-white hover:text-primary py-4 rounded-2xl font-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 text-sm uppercase tracking-widest italic"
          >
            Entrar agora
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">
            {query ? `Busca: ${query}` : 'Resultados da busca'}
          </h1>
          <div className="h-1.5 w-24 bg-primary rounded-full" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Pesquisando no universo...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
            <p className="text-red-400 font-bold italic">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Search className="text-white/10" size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Nenhum resultado encontrado</h3>
            <p className="text-white/40 max-w-sm mx-auto">
              Não encontramos nenhum filme ou série com esse termo. Tente palavras-chave diferentes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((item, index) => (
              <motion.div
                key={item.uuid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/content/${item.uuid}`} className="group block h-full">
                  <div className="relative aspect-[2/3] rounded-2xl md:rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-primary/20">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center mb-3 scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-xl">
                        <Play fill="white" size={18} className="ml-1" />
                      </div>
                      <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-tighter line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    {item.rating && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-primary text-[10px] font-black italic">★ {item.rating}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
