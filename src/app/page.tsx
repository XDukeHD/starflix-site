'use client';

import Hero from "@/components/sections/Hero";
import TrendingCarousel from "@/components/sections/TrendingCarousel";
import TopTenCarousel from "@/components/sections/TopTenCarousel";
import { TOP_MOVIES, TOP_SERIES } from "@/data/constants";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      <Hero />
      <TrendingCarousel />
      <TopTenCarousel title="Top 10 Filmes no Brasil" items={TOP_MOVIES} />
      <TopTenCarousel title="Top 10 Séries no Brasil" items={TOP_SERIES} />
    </div>
  );
}
