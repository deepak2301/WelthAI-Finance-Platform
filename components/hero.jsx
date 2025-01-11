"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      scrollPosition > scrollThreshold
        ? imageElement.classList.add("scrolled")
        : imageElement.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pb-20 px-4 ">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
          Manage Your Finance <br /> with Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track your expenses, optimize your budget, and get personalized
          AI-driven financial reviews every month.Empower your financial journey
          with clarity and confidence.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href={"/dashboard"}>
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link
            href={
              "https://github.com/deepak2301?tab=overview&from=2025-01-01&to=2025-01-10"
            }
          >
            <Button size="lg" className="px-8" variant="outline">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
            <Image
              src={"/banner.jpeg"}
              alt="Dashboard Preview"
              width={960}
              height={540}
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
