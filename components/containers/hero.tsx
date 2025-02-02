import Image from "next/image";
import React from "react";
import BGEllipses from "@/public/bg-ellipses-hero.png";
import ModelImg from "@/public/hero-model.png";
import BottomEllipse from "@/public/hero-bottom-ellipse.png";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center">
      <Image src={BGEllipses} alt="img" fill />
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-screen object-cover opacity-[0.4]"
      >
        <source src="/home-page-hero.mp4" type="video/mp4" />
      </video>
      <Image
        src={ModelImg}
        alt="img"
        className="max-lg:hidden absolute right-8 -bottom-4 w-[38%]"
      />
      <Image
        src={BottomEllipse}
        alt="img"
        className="absolute w-full -bottom-5 lg:-bottom-24"
      />
      <div className="relative container z-10">
        <div className="lg:w-1/2 max-lg:text-center flex flex-col items-center lg:items-start gap-6">
          <h6 className="homepage-head">WELCOME TO NEURALBAY</h6>
          <h1 className="homepage-title">
            Build, Deploy, and Scale{" "}
            <span className="lg:flex items-center lg:gap-4">
              <span className="homepage-highlight">AI</span> Solutions on ICP
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="78"
                height="40"
                viewBox="0 0 78 40"
                fill="none"
                className="max-lg:hidden"
              >
                <g clip-path="url(#clip0_4181_7790)">
                  <path
                    d="M59.0435 0C54.6957 0 49.9348 2.42492 44.9131 7.20801C42.5435 9.45495 40.4566 11.9021 38.9348 13.8376C38.9348 13.8376 41.3696 16.7075 44.0435 19.7998C45.5 17.931 47.5652 15.3949 49.9783 13.1034C54.4348 8.83204 57.3479 7.96441 59.0218 7.96441C65.2826 7.96441 70.3696 13.3482 70.3696 20C70.3696 26.5851 65.2826 31.9689 59.0218 32.0356C58.7174 32.0356 58.3696 31.9911 57.9348 31.9021C59.7609 32.7697 61.7392 33.3927 63.587 33.3927C75.0653 33.3927 77.3261 25.2725 77.4566 24.6941C77.7826 23.2036 77.9783 21.6463 77.9783 20.0445C77.9566 8.98776 69.4783 0 59.0435 0Z"
                    fill="url(#paint0_linear_4181_7790)"
                  />
                  <path
                    d="M18.9348 40C23.2826 40 28.0435 37.5751 33.0652 32.792C35.4348 30.5451 37.5217 28.0979 39.0435 26.1624C39.0435 26.1624 36.6087 23.2926 33.9348 20.2002C32.4783 22.069 30.413 24.6051 28 26.8966C23.5435 31.1235 20.6087 32.0356 18.9565 32.0356C12.6957 32.0356 7.6087 26.6518 7.6087 20C7.6087 13.4149 12.6957 8.03115 18.9565 7.96441C19.2609 7.96441 19.6087 8.0089 20.0435 8.09789C18.2174 7.23026 16.2391 6.60735 14.3913 6.60735C2.91304 6.5851 0.652174 14.7052 0.521739 15.3059C0.195652 16.7964 0 18.3537 0 19.9555C0 31.0122 8.47826 40 18.9348 40Z"
                    fill="url(#paint1_linear_4181_7790)"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M27.6739 13.2814C26.413 12.0356 20.2826 6.94105 14.413 6.76307C3.93474 6.49611 0.869523 14.2825 0.586914 15.2836C2.60865 6.56285 10.0869 0.0444939 18.9565 0C26.1956 0 33.5217 7.27475 38.9347 13.8376L38.9565 13.8154C38.9565 13.8154 41.3913 16.6852 44.0652 19.7775C44.0652 19.7775 47.1087 23.4483 50.326 26.6741C51.5869 27.9199 57.6956 32.9477 63.5652 33.1257C74.326 33.4372 77.3043 25.2058 77.4565 24.5829C75.4782 33.3704 67.9782 39.911 59.0652 39.9555C51.826 39.9555 44.5 32.6808 39.0652 26.1179C39.0652 26.1402 39.0434 26.1402 39.0434 26.1624C39.0434 26.1624 36.6087 23.2925 33.9347 20.2002C33.9565 20.2002 30.913 16.5072 27.6739 13.2814Z"
                    fill="#29ABE2"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_4181_7790"
                    x1="48.8664"
                    y1="3.16939"
                    x2="76.2905"
                    y2="30.1881"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.21" stop-color="#F15A24" />
                    <stop offset="0.6841" stop-color="#FBB03B" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_4181_7790"
                    x1="29.1187"
                    y1="36.8351"
                    x2="1.69463"
                    y2="9.81648"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.21" stop-color="#ED1E79" />
                    <stop offset="0.8929" stop-color="#522785" />
                  </linearGradient>
                  <clipPath id="clip0_4181_7790">
                    <rect width="78" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </h1>
          <p className="lg:text-lg text-muted-foreground">
            NeuralBay: The Comprehensive Platform for AI-Focused Decentralized
            Applications
          </p>
          <div className="w-full flex flex-col lg:flex-row gap-4">
            <Button asChild>
              <Link href="/marketplace">Explore Models</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/vendor/dashboard">Vendor Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
