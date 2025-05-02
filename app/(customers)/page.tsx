import React from "react";
import { Metadata } from "next";
import Hero from "@/components/landing/HeroSection";
import BaseIcon from "@/components/landing/Base-content";
import HotDealsSection from "@/components/landing/HotDealsSection";
import FeaturedDeals from "@/components/landing/FeaturedDeals";

export const metadata: Metadata = {  // Changed from 'meta' to 'metadata'
  title: "Customers",
  description: "Customers",
};

export default function HomePage() {  // Changed to function declaration
  return (
    <main className="mx-auto"> 
      <Hero />
      <BaseIcon />
      <HotDealsSection />
      <FeaturedDeals />
    </main>
  );
}