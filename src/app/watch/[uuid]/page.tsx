/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Hls from 'hls.js';
import { 
  Play, Pause, RotateCcw, RotateCw, Maximize, Minimize, Volume2, VolumeX, 
  Settings, ChevronLeft, List, Loader2, Subtitles, SkipForward, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/services/api';

const getLangName = (code: string) => {
    const names: Record<string, string> = {
        'pt-br': 'Português (Brasil)',
        'en-us': 'English (United States)',
        'en-uk': 'English (UK)',
        'en-gb': 'English (UK)',
        'es-es': 'Español (España)',
        'fr-fr': 'Français (France)',
    };
    return names[code.toLowerCase()] || code.toUpperCase();
};

export default function WatchPage() {
    const params = useParams();
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [streamDetails, setStreamDetails] = useState<any>(null);
    const [contentDetails, setContentDetails] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [quality, setQuality] = useState('Auto');
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [showEpisodesMenu, setShowEpisodesMenu] = useState(false);
    const [showAudioMenu, setShowAudioMenu] = useState(false);
    const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(0);
    const [isSeries, setIsSeries] = useState(false);
    const [availableResolutions, setAvailableResolutions] = useState<any[]>([]);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    const fetchData = useCallback(async () => {
        if (!params.uuid) return;
        setIsLoading(true);
        try {
            const details = await api.stream.getDetails(params.uuid as string);
            if (details.error) {
                router.push('/movies');
                return;
            }
            setStreamDetails(details);
            setQuality(details.resolution);

            const contentId = details.content_type === 'episode' ? details.tvshow_uuid : params.uuid;
            const content = await api.content.getDetails(contentId as string);
            setContentDetails(content);
            setIsSeries(details.content_type === 'episode' || content.content === 'Serie');

            if (details.content_type === 'episode' && content.seasons) {
                content.seasons.forEach((season: any, idx: number) => {
                    if (season.season_number === details.content_season) {
                        setSelectedSeasonIdx(idx);
                        const episode = season.episodes.find((ep: any) => ep.episode_number === details.content_episode);
                        if (episode) {
                            setAvailableResolutions(episode.stream_options || []);
                        }
                    }
                });
            } else if (content.content === 'Movie') {
                setAvailableResolutions(content.stream_options || []);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, [params.uuid, router]);

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [fetchData]);

    useEffect(() => {
        if (!streamDetails || !videoRef.current || isLoading) return;

        const video = videoRef.current;
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        const url = api.stream.getPlaylistUrl(streamDetails.uuid);

        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                xhrSetup: (xhr, reqUrl) => {
                    if (token && reqUrl.includes('/segment/')) {
                        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                    }
                }
            });
            hlsRef.current = hls;
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            });
            
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(() => setIsPlaying(false));
                setIsPlaying(true);
            });
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [streamDetails, isLoading]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((current / duration) * 100);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (videoRef.current) {
            const duration = videoRef.current.duration;
            videoRef.current.currentTime = (value / 100) * duration;
            setProgress(value);
        }
    };

    const skip = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = value;
            setVolume(value);
            setIsMuted(value === 0);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch(e.code) {
                case 'Space': e.preventDefault(); togglePlay(); break;
                case 'ArrowLeft': skip(-15); break;
                case 'ArrowRight': skip(15); break;
                case 'KeyF': toggleFullscreen(); break;
                case 'KeyM': toggleMute(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isMuted]);

    return isLoading ? (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-white/50 font-black uppercase tracking-tighter italic">Carregando Estrelas...</p>
            </div>
        </div>
    ) : (
        <div 
            ref={containerRef}
            className={`h-screen bg-black flex flex-col md:flex-row overflow-hidden ${isFullscreen && !showControls ? 'cursor-none' : ''}`}
            onMouseMove={handleMouseMove}
        >
            <div className={`relative flex-grow flex items-center justify-center group h-full ${isSeries && !isFullscreen ? 'md:w-3/4' : 'w-full'} bg-black`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    playsInline
                />

                <AnimatePresence>
                    {showControls && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6 z-10"
                        >
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => router.back()}
                                    className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white transition-all flex items-center gap-2 font-black uppercase italic text-xs tracking-widest"
                                >
                                    <ChevronLeft size={20} /> Voltar
                                </button>
                                <div className="text-center">
                                    <h2 className="text-white font-black uppercase italic tracking-tighter text-xl">
                                        {streamDetails?.content_name}
                                    </h2>
                                    {streamDetails?.content_type === 'episode' && (
                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                            S{streamDetails.content_season} : E{streamDetails.content_episode}
                                        </p>
                                    )}
                                </div>
                                <div className="w-24" />
                            </div>

                            <div className="space-y-6">
                                <div className="relative group/progress">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progress}
                                        onChange={handleProgressChange}
                                        className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary group-hover/progress:h-2 transition-all"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                                            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => skip(-15)} className="text-white/60 hover:text-white transition-colors">
                                                <RotateCcw size={24} />
                                            </button>
                                            <button onClick={() => skip(15)} className="text-white/60 hover:text-white transition-colors">
                                                <RotateCw size={24} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 group/volume">
                                            <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-0 group-hover/volume:w-24 transition-all h-1 appearance-none bg-white/20 rounded-full accent-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <button 
                                                onClick={() => {
                                                    setShowAudioMenu(!showAudioMenu);
                                                    setShowQualityMenu(false);
                                                }} 
                                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-black uppercase italic text-xs tracking-widest"
                                            >
                                                <Languages size={20} /> {getLangName(streamDetails?.language || '')}
                                            </button>
                                            <AnimatePresence>
                                                {showAudioMenu && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute bottom-full right-0 mb-4 bg-black/98 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 w-48 overflow-hidden shadow-2xl"
                                                    >
                                                        {Array.from(new Set(availableResolutions.map(r => r.language))).map((lang: string) => (
                                                            <button 
                                                                key={lang}
                                                                onClick={() => {
                                                                    setShowAudioMenu(false);
                                                                    const opt = availableResolutions.find(r => r.language === lang && r.resolution === (quality === 'Auto' ? '1080p' : quality)) || availableResolutions.find(r => r.language === lang);
                                                                    if (opt && opt.uuid !== streamDetails.uuid) {
                                                                        router.push(`/watch/${opt.uuid}`);
                                                                    }
                                                                }}
                                                                className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase italic tracking-widest hover:bg-white/10 rounded-xl transition-colors ${streamDetails?.language === lang ? 'text-primary' : 'text-white/40'}`}
                                                            >
                                                                {getLangName(lang)}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="relative">
                                            <button 
                                                onClick={() => {
                                                    setShowQualityMenu(!showQualityMenu);
                                                    setShowAudioMenu(false);
                                                }} 
                                                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-black uppercase italic text-xs tracking-widest"
                                            >
                                                <Settings size={20} /> {quality}
                                            </button>
                                            <AnimatePresence>
                                                {showQualityMenu && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute bottom-full right-0 mb-4 bg-black/98 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 w-32 overflow-hidden shadow-2xl"
                                                    >
                                                        {availableResolutions
                                                            .filter(res => res.language === streamDetails?.language)
                                                            .map((res: any) => (
                                                            <button 
                                                                key={res.uuid}
                                                                onClick={() => { 
                                                                    setShowQualityMenu(false);
                                                                    if (res.uuid !== streamDetails.uuid) {
                                                                        router.push(`/watch/${res.uuid}`);
                                                                    }
                                                                }}
                                                                className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase italic tracking-widest hover:bg-white/10 rounded-xl transition-colors ${streamDetails.uuid === res.uuid ? 'text-primary' : 'text-white/40'}`}
                                                            >
                                                                {res.resolution}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <button className="text-white/60 hover:text-white transition-colors">
                                            <Subtitles size={24} />
                                        </button>
                                        <button onClick={toggleFullscreen} className="text-white/60 hover:text-white transition-colors">
                                            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isSeries && !isFullscreen && contentDetails?.seasons && (
                <div className="w-full md:w-1/4 bg-[#0a0a14] border-l border-white/5 flex flex-col h-screen overflow-hidden sticky top-0">
                    <div className="p-6 border-b border-white/5 bg-[#0a0a14]/50 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-black uppercase italic tracking-tighter text-xl flex items-center gap-2">
                                <List className="text-primary" size={20} /> Episódios
                            </h3>
                            <button className="text-white/20 hover:text-white transition-colors">
                                <SkipForward size={20} />
                            </button>
                        </div>
                        <select 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase italic tracking-widest outline-none focus:border-primary/50 transition-colors"
                            value={selectedSeasonIdx}
                            onChange={(e) => setSelectedSeasonIdx(parseInt(e.target.value))}
                        >
                            {contentDetails.seasons.map((s: any, idx: number) => (
                                <option key={s.uuid} value={idx} className="bg-black">{s.season_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {contentDetails.seasons[selectedSeasonIdx]?.episodes.map((ep: any) => {
                            const isCurrentEpisode = streamDetails?.content_type === 'episode' && 
                                streamDetails?.content_uuid === ep.uuid;

                            return (
                                <button
                                    key={ep.uuid}
                                    onClick={() => ep.stream_options?.[0] && router.push(`/watch/${ep.stream_options[0].uuid}`)}
                                    className={`w-full group flex gap-4 p-3 rounded-2xl transition-all border ${
                                        isCurrentEpisode 
                                            ? 'bg-primary/10 border-primary/30' 
                                            : 'hover:bg-white/5 border-transparent'
                                    }`}
                                >
                                    <div className="w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative">
                                        <img src={ep.still_path || contentDetails.backdrop_path} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                        {isCurrentEpisode && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left py-1">
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isCurrentEpisode ? 'text-primary' : 'text-white/20'}`}>
                                            Episódio {ep.episode_number}
                                        </p>
                                        <p className="text-xs font-bold text-white/80 line-clamp-1 group-hover:text-white transition-colors uppercase">
                                            {ep.title}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
