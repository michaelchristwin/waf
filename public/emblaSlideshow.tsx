import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import Meters from "@/public/nft.png";
import Hardware from "@/public/m3ter.png";
import Payment from "@/public/payment.png";
import useEmblaCarousel from "embla-carousel-react";
import Onchain from "@/public/onchain.jpeg";
import { Card, CardContent } from "./ui/card";
import React, { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SlidesStruct = {
  title: string;
  description: string;

  more: {
    url: string;
    linkText: string;
  };
  image: {
    imageData: StaticImageData;
    alt: string;
  };
};
const slidesData: SlidesStruct[] = [
  {
    title: "What are M3ters?",
    description: `M3ters are NFTs that tokenize real world energy infrastructure such as solar & small hydro power plants on the m3tering protocol. They are the backbone of our decentralised physical infrastructure network (DePIN).`,

    more: {
      url: "https://m3tering.whynotswitch.com/",
      linkText: "Learn more",
    },
    image: {
      imageData: Meters,
      alt: "M3ters NFT",
    },
  },

  {
    title: "Our hardware",
    description: `They are bound onchain to smart energy meters that measure power consumption and facilitate decentralized settlements. Each M3ter has a unique ID, linking it to energy consumption data and payments.`,
    more: {
      url: "https://m3tering.whynotswitch.com/token-economics/m3ter-nfts",
      linkText: "Further reading",
    },
    image: {
      imageData: Hardware,
      alt: "Maxwell v1 in operation",
    },
  },
  {
    title: "What is the M3tering Protocol?",
    description: `Users pay energy providers directly by sending stablecoins to an M3ter ID,
     which is mapped to the provider’s onchain wallet. Smart contracts automate billing and enforce payments based on verified consumption data.`,
    more: {
      url: "https://m3tering.whynotswitch.com/token-economics/m3ter-nfts",
      linkText: "Expore more",
    },
    image: {
      imageData: Onchain,
      alt: "Flywheel effect",
    },
  },
  {
    title: "Billing",
    description: `Each m3ter has a unique ID used to initiate fast, transparent
                  payments with stablecoins. This streamlined process ensures
                  seamless transactions with energy providers.`,
    more: {
      url: "https://m3tering.whynotswitch.com/",
      linkText: "Payment guide",
    },
    image: {
      imageData: Payment,
      alt: "Ecosystem diagram",
    },
  },
];
const EmblaSlideshow: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  return (
    <div className="relative max-w-xl mx-auto p-4 h-full flex flex-col justify-center">
      <div className="embla overflow-hidden w-full" ref={emblaRef}>
        <div className="embla__container flex">
          {slidesData.map((slide, i) => (
            <div className="embla__slide flex-[0_0_100%]" key={i}>
              <Card className="lg:w-[400px] md:w-[400px] w-[300px] lg:h-[380px] md:h-[380px] h-[320px] mx-auto">
                <CardContent className="space-y-2 block">
                  <div className="w-full flex justify-center">
                    <div className="relative w-[350px] aspect-[16/9] overflow-hidden">
                      <Image
                        src={slide.image.imageData}
                        alt={slide.image.alt}
                        fill
                        className="object-contain shadow-lg rounded-lg"
                        priority
                      />
                    </div>
                  </div>
                  <div>
                    <p className="lg:text-[13px] md:text-[13px] text-[11px] mt-[20px]">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.more.url}
                      className="text-blue-600 hover:text-blue-800 lg:text-[13px] md:text-[13px] text-[11px] underline inline-block mx-auto"
                    >
                      {slide.more.linkText}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={scrollPrev}
          className="bg-[#9b6dff] text-white px-4 py-2 rounded hover:bg-[#8559f2] transition"
        >
          <ArrowLeft className={`w-4 h-4`} />
        </button>
        <button
          onClick={scrollNext}
          className="bg-[#9b6dff] text-white px-4 py-2 rounded hover:bg-[#8559f2] transition"
        >
          <ArrowRight className={`w-4 h-4`} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (emblaApi) {
                emblaApi.scrollTo(index);
                setSelectedIndex(index);
              }
            }}
            className={`
              w-3 h-3 rounded-full 
              ${index === selectedIndex ? "bg-[#8559f2]" : "bg-gray-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default EmblaSlideshow;
