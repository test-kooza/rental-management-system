"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Share, Heart } from 'lucide-react';

interface GalleryProps {
  title: string;
  subtitle: string;
  images: {
    id: number;
    url: string;
    alt: string;
  }[];
}

const PropertyGallery = ({ title, subtitle, images }: GalleryProps) => {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Function to scroll to a specific image in the mobile view
  const scrollToImage = (index: number) => {
    setCurrentIndex(index);
    if (mobileScrollContainerRef.current) {
      const scrollContainer = mobileScrollContainerRef.current;
      const imageElements = scrollContainer.querySelectorAll('.mobile-image');
      if (imageElements[index]) {
        scrollContainer.scrollTo({
          left: imageElements[index].getBoundingClientRect().left + scrollContainer.scrollLeft - scrollContainer.getBoundingClientRect().left,
          behavior: 'smooth'
        });
      }
    }
  };
  
  // Auto-scroll functionality
  useEffect(() => {
    if (mobileScrollContainerRef.current) {
      // Start auto-scrolling
      autoScrollInterval.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        scrollToImage(nextIndex);
      }, 5000); // Auto-scroll every 5 seconds
    }
    
    // Clean up interval on unmount
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentIndex, images.length]);
  
  // Handle scroll event to update current index
  useEffect(() => {
    const handleScroll = () => {
      if (mobileScrollContainerRef.current) {
        const scrollContainer = mobileScrollContainerRef.current;
        const scrollLeft = scrollContainer.scrollLeft;
        const containerWidth = scrollContainer.clientWidth;
        
        // Calculate which image is most visible
        const imageIndex = Math.round(scrollLeft / containerWidth);
        if (imageIndex >= 0 && imageIndex < images.length && imageIndex !== currentIndex) {
          setCurrentIndex(imageIndex);
        }
      }
    };
    
    const scrollContainer = mobileScrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentIndex, images.length]);
  
  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    
    // Pause auto-scroll when user touches
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      const nextIndex = (currentIndex + 1) % images.length;
      scrollToImage(nextIndex);
    }
    
    if (touchStart - touchEnd < -50) {
      // Swipe right
      const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      scrollToImage(prevIndex);
    }
    
    // Restart auto-scroll after touch
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    
    autoScrollInterval.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollToImage(nextIndex);
    }, 5000);
  };

  const openCarousel = (index: number) => {
    setCurrentIndex(index);
    setIsCarouselOpen(true);
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    scrollToImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToImage(prevIndex);
  };

  // Determine main image and thumbnails
  const mainImage = images[0];
  const thumbnails = images.slice(1, 5);

  return (
    <div className="w-full">
      {/* Title Section */}
      <div className="md:flex hidden justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex space-x-2">
          <button className="flex items-center p-2 rounded-full hover:bg-gray-100 underline text-xs">
            <Share size={20} />
            <span className="ml-1">Share</span>
          </button>
          <button 
            className="flex items-center p-2 rounded-full hover:bg-gray-100 underline text-xs"
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart size={20} fill={isSaved ? "black" : "none"} />
            <span className="ml-1">Save</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid (Desktop View) */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-2 md:p-4">
        <div className="col-span-2 row-span-2 relative h-80">
          <Image 
            src={mainImage.url} 
            alt={mainImage.alt}
            className="w-full h-full object-cover rounded-lg cursor-pointer"
            onClick={() => openCarousel(0)}
            width={600} 
            height={400}
          />
        </div>
        {thumbnails.map((image, index) => (
          <div key={image.id} className="relative h-40">
            <Image 
              src={image.url} 
              alt={image.alt}
              className={`w-full h-full object-cover cursor-pointer rounded-xl ${
                index === 1 || index === 3 ? 'rounded-r-lg' : ''
              }`}
              onClick={() => openCarousel(index + 1)}
              width={300} 
              height={200}
            />
            {index === 3 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-br-lg cursor-pointer"
                onClick={() => openCarousel(0)}
              >
                <p className="text-black font-semibold bg-white p-2 rounded text-xs ">Show all photos</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scrollable Gallery (Mobile View) */}
      <div className="md:hidden relative">
        <div 
          ref={mobileScrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="flex-shrink-0 w-full h-52 snap-center mobile-image"
            >
              <Image 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover"
                onClick={() => openCarousel(index)}
                width={400} 
                height={300}
              />
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium flex items-center">
          <span>{currentIndex + 1}/{images.length}</span>
        </div>
        
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
          onClick={prevImage}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
          onClick={nextImage}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Full Screen Carousel */}
      {isCarouselOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <button onClick={closeCarousel} className="p-2">
              Close
            </button>
            <div className="text-sm">
              {currentIndex + 1} / {images.length}
            </div>
            <div className="flex space-x-4">
              <button className="p-2 underline">
                <Share size={20} />
              </button>
              <button 
                className="p-2 underline"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart size={20} fill={isSaved ? "white" : "none"} />
              </button>
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center relative">
            <div className="relative h-full w-full flex items-center justify-center">
              <Image 
                src={images[currentIndex].url} 
                alt={images[currentIndex].alt}
                className="max-h-full max-w-full object-contain"
                width={1200} 
                height={800}
              />
              <div className="absolute bottom-4 w-full text-center text-white">
                <p className="text-lg">{images[currentIndex].alt}</p>
              </div>
            </div>
            <button 
              className="absolute left-4 bg-white rounded-full p-2"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="absolute right-4 bg-white rounded-full p-2"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Property Details (Mobile View) */}
      <div className="md:hidden p-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      
      {/* Additional CSS for hiding scrollbars but keeping functionality */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default PropertyGallery;