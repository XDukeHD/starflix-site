/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Star, Calendar, Clock, Film } from 'lucide-react';
import { api } from '@/services/api';
import Link from 'next/link';

export default function GenreDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const genreName = params.genrename as string;

    useEffect(() => {
        const checkAuth = () => {
            const tokenMatch = document.cookie.split('; ').find(row => row.startsWith('token='));
            const exp = localStorage.getItem('session_exp');
            
            if (tokenMatch && exp && Date.now() < parseInt(exp) * 1000) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const fetchGenreData = async () => {
            if (!isAuthorized) return;
            setIsLoading(true);
            try {
                const response = await api.genres.list(genreName, page);
                setItems(response.data || []);
                setTotalPages(response.pagination?.totalPages || 1);
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };

        if (genreName) fetchGenreData();
    }, [genreName, page, isAuthorized]);

    if (isLoading && isAuthorized === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isAuthorized === false) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
                <div className="max-w-md w-full bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[2.5rem] text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <Star className="text-primary" size={40} />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">Acesso Restrito</h2>
                    <p className="text-white/40 mb-10 font-bold uppercase text-[10px] tracking-widest leading-relaxed">Você precisa de uma conta galáctica para acessar esses títulos.</p>
                    <Link href="/auth/login" className="block w-full bg-primary text-white py-5 rounded-2xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                        Fazer Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-4">
                            {genreName}
                        </h1>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] italic">
                            Resultados encontrados na categoria
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-white/20 font-black uppercase italic tracking-widest text-xs">Acessando Arquivos...</p>
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.uuid}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (index % 10) * 0.05 }}
                                >
                                    <Link href={`/content/${item.uuid}`} className="group block">
                                        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all group-hover:border-primary/50 group-hover:scale-[1.02]">
                                            <img 
                                                src={item.poster_path} 
                                                alt={item.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                            
                                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-2xl">
                                                    <Star size={10} className="text-primary fill-primary" />
                                                    <span className="text-[10px] text-white font-black italic tracking-tighter">{item.popularity}</span>
                                                </div>
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-primary px-2 py-0.5 rounded text-[8px] font-black uppercase italic tracking-tighter">
                                                        {item.content_type === 'movie' ? 'Filme' : 'Série'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-sm font-black uppercase italic tracking-tighter text-white group-hover:text-primary transition-colors line-clamp-1">
                                                {item.title}
                                            </h3>
                                            <p className="flex items-center gap-3 mt-1 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                                <span>{new Date(item.release_date).getFullYear()}</span> <span className="w-1 h-1 bg-white/20 rounded-full" /> <span>{item.certificate}</span>
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-20 flex items-center justify-center gap-4">
                                <button 
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
                                >
                                    Anterior
                                </button>
                                <span className="text-white/40 font-black italic text-xs px-6">
                                    Página <span className="text-primary">{page}</span> de {totalPages}
                                </span>
                                <button 
                                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={page === totalPages}
                                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
                        <Film className="w-16 h-16 text-white/5" />
                        <p className="text-white/20 font-black uppercase italic tracking-tighter">Nenhum título encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}
