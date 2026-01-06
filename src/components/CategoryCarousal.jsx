
// // import React, { useState, useRef, useCallback, useEffect } from "react";
// // import { ChevronLeft, ChevronRight } from "lucide-react";
// // import axios from "axios";

// // // Local Images
// // import kurtiImage from "../components/Assets/kurti's.jpg";
// // import wedding_wear from "../components/Assets/weding_wear.jpg";
// // import saree from "../components/Assets/saree.jpg";
// // import formal from "../components/Assets/formal_wear.jpg";
// // import lehenga from "../components/Assets/lehenga.jpg";
// // import ethnic_wear from "../components/Assets/ethnic_wear.jpg";
// // import party_wear from "../components/Assets/party_wear.jpg";
// // // Frame image (place your provided border image here)
// // import frameBorder from "../components/Assets/category_frame.png";

// // // Helper: discount text
// // const calculateDiscountText = (offer) => {
// //   if (!offer) return null;
// //   if (offer.offerType === "percentage") return `UPTO ${offer.value}% OFF`;
// //   if (offer.offerType === "flat") return `FLAT ₹${offer.value} OFF`;
// //   return null;
// // };

// // // Reusable framed image wrapper with text overlay
// // const FramedImage = ({ src, alt, categoryName, aspect = "portrait" }) => {
// //   const aspectClass = aspect === "square" ? "aspect-square" : "aspect-[5/6]"; // Increased height aspect ratio
// //   return (
// //     <div className={`relative w-full ${aspectClass} group`}>
// //       {/* Main container with shadow and hover effects */}
// //       <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">

// //         {/* Product image - positioned to show inside the frame */}
// //         <div className="absolute inset-[8%] z-10 rounded-lg overflow-hidden"> {/* Reduced inset for larger image area */}
// //           <img
// //             src={src}
// //             alt={alt}
// //             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
// //             onError={(e) => {
// //               e.currentTarget.src =
// //                 "https://via.placeholder.com/300x400/cccccc/666666?text=Image+Not+Found";
// //             }}
// //           />
// //           {/* Subtle overlay for better text readability */}
// //           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
// //         </div>

// //         {/* Decorative frame border - acts as actual border with increased height */}
// //         <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
// //           <img
// //             src={frameBorder}
// //             alt="decorative frame"
// //             className="w-full h-full object-cover"
// //             style={{
// //               filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))'
// //             }}
// //             onError={(e) => {
// //               console.log("Frame image failed to load, using CSS border");
// //               e.currentTarget.style.display = "none";
// //               // Fallback: Add CSS border to parent
// //               e.currentTarget.parentElement.style.border = "4px solid #d4af37";
// //               e.currentTarget.parentElement.style.borderRadius = "12px";
// //             }}
// //           />
// //         </div>

// //         {/* Category name overlay with enhanced styling */}
// //         <div className="absolute inset-0 flex items-end justify-center pb-4 z-30"> {/* Increased bottom padding */}
// //           <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/40 mx-3">            <h3 className="text-white font-bold text-xs sm:text-sm text-center tracking-wider uppercase drop-shadow-lg">
// //             {categoryName}
// //           </h3>
// //           </div>
// //         </div>

// //         {/* Subtle shine effect on hover */}
// //       </div>
// //     </div>
// //   );
// // };

// // function CategoryCarousel() {
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [isHovering, setIsHovering] = useState(false);
// //   const [offers, setOffers] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [showSaleModal, setShowSaleModal] = useState(false);
// //   const scrollContainerRef = useRef(null);

// //   // Navbar navigation trigger - FIXED: Accept category name string
// //   const triggerNavbarNavigation = (categoryName) => {
// //     console.log("Triggering navigation to:", categoryName);
// //     const event = new CustomEvent('navigateToCategory', {
// //       detail: { category: categoryName }
// //     });
// //     window.dispatchEvent(event);
// //     setShowSaleModal(false);
// //   }

// //   // Categories with fallback images
// //   const categories = [
// //     { name: "Kurtis", apiCategory: "68d237b7bbab251b0858ae35", image: kurtiImage },
// //     { name: "Wedding Wear", apiCategory: "68d142ba7dad5d4cf276bae8", image: wedding_wear },
// //     { name: "Sarees", apiCategory: "68d1459c7dad5d4cf276bbaf", image: saree },
// //     { name: "Formal Wear", apiCategory: "68d142ba7dad5d4cf276bae8", image: formal },
// //     { name: "Lehengas", apiCategory: "68d231f3bbab251b0858ad38", image: lehenga },
// //     { name: "Ethnic Wear", apiCategory: "68d130ed7dad5d4cf276bad2", image: ethnic_wear },
// //     { name: "Party Wear", apiCategory: "68d1459c7dad5d4cf276bbaf", image: party_wear },
// //   ];

// //   // Fetch offers per category
// //   useEffect(() => {
// //     const fetchOffers = async () => {
// //       try {
// //         setLoading(true);
// //         const offerData = {};

// //         // Fetch offers for each category
// //         for (let cat of categories) {
// //           try {
// //             const res = await axios.get(`https://api.silksew.com/api/offer/get-offer/${cat.apiCategory}`);
// //             console.log(`Offer response for ${cat.name}:`, res.data);

// //             if (res.data.success && res.data.offer?.active) {
// //               offerData[cat.apiCategory] = res.data.offer;
// //             }
// //           } catch (err) {
// //             console.warn(`No offer found for ${cat.name}:`, err.message);
// //           }
// //         }
// //         setOffers(offerData);
// //       } catch (err) {
// //         console.error("Error fetching offers:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchOffers();
// //   }, []);

// //   // Carousel logic
// //   const itemsPerView = 4;
// //   const maxIndex = Math.max(0, categories.length - itemsPerView);

// //   const handlePrevious = useCallback(() => setCurrentIndex((prev) => Math.max(0, prev - 1)), []);
// //   const handleNext = useCallback(() => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1)), [maxIndex]);

// //   const handleMouseMove = useCallback(
// //     (e) => {
// //       if (!isHovering) return;
// //       const container = scrollContainerRef.current;
// //       if (!container) return;
// //       const rect = container.getBoundingClientRect();
// //       const x = e.clientX - rect.left;
// //       const leftZone = rect.width * 0.3;
// //       const rightZone = rect.width * 0.7;
// //       if (x < leftZone && currentIndex > 0) setCurrentIndex((prev) => Math.max(0, prev - 1));
// //       else if (x > rightZone && currentIndex < maxIndex) setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
// //     },
// //     [isHovering, currentIndex, maxIndex]
// //   );

// //   // FIXED: Pass category name string instead of object
// //   const handleCategoryClick = useCallback((categoryName) => {
// //     console.log("Category clicked:", categoryName);
// //     triggerNavbarNavigation(categoryName);
// //   }, []);

// //   // Merge category with offer - REMOVED finalPrice from the object
// //   const categoriesWithOffers = categories.map((cat) => {
// //     const offer = offers[cat.apiCategory];
// //     const hasValidOffer = offer && offer.active;

// //     return {
// //       ...cat,
// //       saleText: hasValidOffer ? "Special Offer" : "Trending",
// //       discount: hasValidOffer ? calculateDiscountText(offer) : "New Arrivals",
// //       hasOffer: hasValidOffer
// //     };
// //   });

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading categories...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
// //       <div className="relative bg-white py-8 sm:py-12">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="text-center mb-8 sm:mb-12">
// //             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
// //               Shop by Category
// //             </h2>
// //             <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
// //               Discover our curated collection of premium fashion categories, each crafted with elegance and style
// //             </p>
// //             <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
// //           </div>

// //           {/* Mobile & Tablet - Enhanced Responsive Grid */}
// //           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:hidden">
// //             {categoriesWithOffers.length > 0 ? (
// //               categoriesWithOffers.map((category, index) => (
// //                 <div
// //                   key={index}
// //                   className="cursor-pointer group"
// //                   onClick={() => handleCategoryClick(category.name)}
// //                 >
// //                   <div className="relative">
// //                     {/* Framed image with category name */}
// //                     <FramedImage
// //                       src={category.image}
// //                       alt={category.name}
// //                       categoryName={category.name}
// //                       aspect="portrait"
// //                     />
// //                     {/* Sale Badge - Responsive positioning */}
// //                     {category.hasOffer && (
// //                       <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40">
// // <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">                          <div className="leading-tight">{category.saleText}</div>
// //                           <div className="mt-0.5 leading-tight">{category.discount}</div>
// //                         </div>
// //                       </div>
// //                     )}
// //                     {/* Trending Badge for non-offer items */}
// //                     {!category.hasOffer && (
// //                       <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40">
// //                         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
// //                           <div className="leading-tight">Trending</div>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <div className="col-span-full text-center py-12">
// //                 <p className="text-gray-500 text-base sm:text-lg">No categories available at the moment.</p>
// //               </div>
// //             )}
// //           </div>

// //           {/* Desktop Carousel */}
// //           <div className="hidden lg:block">
// //             {categoriesWithOffers.length > 0 ? (
// //               <>
// //                 <div
// //                   className="overflow-hidden"
// //                   ref={scrollContainerRef}
// //                   onMouseMove={handleMouseMove}
// //                   onMouseEnter={() => setIsHovering(true)}
// //                   onMouseLeave={() => setIsHovering(false)}
// //                 >
// //                   <div
// //                     className="flex transition-transform duration-500 ease-out gap-6"
// //                     style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
// //                   >
// //                     {categoriesWithOffers.map((category, index) => (
// //                       <div
// //                         key={index}
// //                         className="flex-shrink-0 cursor-pointer group"
// //                         style={{ width: `${100 / itemsPerView}%` }}
// //                         onClick={() => handleCategoryClick(category.name)}
// //                       >
// //                         <div className="relative h-full px-3">
// //                           {/* Framed image with category name */}
// //                           <FramedImage
// //                             src={category.image}
// //                             alt={category.name}
// //                             categoryName={category.name}
// //                             aspect="portrait"
// //                           />
// //                           {/* Sale Badge with enhanced styling */}
// //                           {category.hasOffer && (
// //                             <div className="absolute top-4 right-4 z-40">
// //                               <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl border border-white/30">
// //                                 <div className="leading-tight">{category.saleText}</div>
// //                                 <div className="mt-1 text-xs leading-tight">{category.discount}</div>
// //                               </div>
// //                             </div>
// //                           )}
// //                           {/* Trending Badge for non-offer items */}
// //                           {!category.hasOffer && (
// //                             <div className="absolute top-4 right-4 z-40">
// //                               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl border border-white/30">
// //                                 <div className="leading-tight">Trending</div>
// //                               </div>
// //                             </div>
// //                           )}
// //                           {/* REMOVED: Price display section */}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Navigation Controls */}
// //                 <div className="flex justify-center items-center mt-10">
// //                   <div className="flex gap-6 items-center">
// //                     <button
// //                       onClick={handlePrevious}
// //                       disabled={currentIndex === 0}
// //                       className={`p-4 rounded-full transition-all duration-300 transform ${currentIndex === 0
// //                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
// //                         : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
// //                         }`}
// //                     >
// //                       <ChevronLeft size={28} />
// //                     </button>

// //                     {/* Pagination dots */}
// //                     <div className="flex gap-2">
// //                       {Array.from({ length: maxIndex + 1 }, (_, i) => (
// //                         <button
// //                           key={i}
// //                           onClick={() => setCurrentIndex(i)}
// //                           className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex
// //                             ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-125"
// //                             : "bg-gray-300 hover:bg-gray-400"
// //                             }`}
// //                         />
// //                       ))}
// //                     </div>

// //                     <button
// //                       onClick={handleNext}
// //                       disabled={currentIndex >= maxIndex}
// //                       className={`p-4 rounded-full transition-all duration-300 transform ${currentIndex >= maxIndex
// //                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
// //                         : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
// //                         }`}
// //                     >
// //                       <ChevronRight size={28} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </>
// //             ) : (
// //               <div className="text-center py-12">
// //                 <p className="text-gray-500 text-lg">No categories available at the moment.</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default CategoryCarousel;


// "use client"

// import { useState, useRef, useCallback, useEffect } from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import axios from "axios"

// // Local Images
// import kurtiImage from "../components/Assets/kurti's.jpg"
// import wedding_wear from "../components/Assets/weding_wear.jpg"
// import saree from "../components/Assets/saree.jpg"
// import formal from "../components/Assets/formal_wear.jpg"
// import lehenga from "../components/Assets/lehenga.jpg"
// import ethnic_wear from "../components/Assets/ethnic_wear.jpg"
// import party_wear from "../components/Assets/party_wear.jpg"
// // Frame image (place your provided border image here)
// import frameBorder from "../components/Assets/category_frame.png"

// // Helper: discount text
// const calculateDiscountText = (offer) => {
//   if (!offer) return null
//   if (offer.offerType === "percentage") return `UPTO ${offer.value}% OFF`
//   if (offer.offerType === "flat") return `FLAT ₹${offer.value} OFF`
//   return null
// }

// // Reusable framed image wrapper with text overlay
// const FramedImage = ({ src, alt, categoryName, aspect = "portrait" }) => {
//   const aspectClass = aspect === "square" ? "aspect-square" : "aspect-[5/6]" // Increased height aspect ratio
//   return (
//     <div className={`relative w-full ${aspectClass} group`}>
//       {/* Main container with shadow and hover effects */}
//       <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
//         {/* Product image - positioned to show inside the frame */}
//         <div className="absolute inset-[8%] z-10 rounded-lg overflow-hidden">
//           {" "}
//           {/* Reduced inset for larger image area */}
//           <img
//             src={src || "/placeholder.svg"}
//             alt={alt}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//             onError={(e) => {
//               e.currentTarget.src = "https://via.placeholder.com/300x400/cccccc/666666?text=Image+Not+Found"
//             }}
//           />
//           {/* Subtle overlay for better text readability */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
//         </div>

//         {/* Decorative frame border - acts as actual border with increased height */}
//         <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
//           <img
//             src={frameBorder || "/placeholder.svg"}
//             alt="decorative frame"
//             className="w-full h-full object-cover"
//             style={{
//               filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
//             }}
//             onError={(e) => {
//               console.log("Frame image failed to load, using CSS border")
//               e.currentTarget.style.display = "none"
//               // Fallback: Add CSS border to parent
//               e.currentTarget.parentElement.style.border = "4px solid #d4af37"
//               e.currentTarget.parentElement.style.borderRadius = "12px"
//             }}
//           />
//         </div>

//         {/* Category name overlay with enhanced styling */}
//         <div className="absolute inset-0 flex items-end justify-center pb-4 z-30">
//           {" "}
//           {/* Increased bottom padding */}
//           <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/40 mx-3">
//             <h3 className="text-white font-bold text-xs sm:text-sm text-center tracking-wider uppercase drop-shadow-lg">
//               {categoryName}
//             </h3>
//           </div>
//         </div>

//         {/* Subtle shine effect on hover */}
//       </div>
//     </div>
//   )
// }

// function CategoryCarousel() {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [isHovering, setIsHovering] = useState(false)
//   const [offers, setOffers] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [showSaleModal, setShowSaleModal] = useState(false)
//   const scrollContainerRef = useRef(null)
//   const innerTrackRef = useRef(null)
//   const [translateX, setTranslateX] = useState(0)
//   const [animate, setAnimate] = useState(true)

//   // Navbar navigation trigger - FIXED: Accept category name string
//   const triggerNavbarNavigation = (categoryName) => {
//     console.log("Triggering navigation to:", categoryName)
//     const event = new CustomEvent("navigateToCategory", {
//       detail: { category: categoryName },
//     })
//     window.dispatchEvent(event)
//     setShowSaleModal(false)
//   }

//   // Categories with fallback images
//   const categories = [
//     { name: "Kurtis", apiCategory: "68d237b7bbab251b0858ae35", image: kurtiImage },
//     { name: "Wedding Wear", apiCategory: "68d142ba7dad5d4cf276bae8", image: wedding_wear },
//     { name: "Sarees", apiCategory: "68d1459c7dad5d4cf276bbaf", image: saree },
//     { name: "Formal Wear", apiCategory: "68d142ba7dad5d4cf276bae8", image: formal },
//     { name: "Lehengas", apiCategory: "68d231f3bbab251b0858ad38", image: lehenga },
//     { name: "Ethnic Wear", apiCategory: "68d130ed7dad5d4cf276bad2", image: ethnic_wear },
//     { name: "Party Wear", apiCategory: "68d1459c7dad5d4cf276bbaf", image: party_wear },
//   ]

//   // Fetch offers per category
//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         setLoading(true)
//         const offerData = {}

//         // Fetch offers for each category
//         for (const cat of categories) {
//           try {
//             const res = await axios.get(`https://api.silksew.com/api/offer/get-offer/${cat.apiCategory}`)
//             console.log(`Offer response for ${cat.name}:`, res.data)

//             if (res.data.success && res.data.offer?.active) {
//               offerData[cat.apiCategory] = res.data.offer
//             }
//           } catch (err) {
//             console.warn(`No offer found for ${cat.name}:`, err.message)
//           }
//         }
//         setOffers(offerData)
//       } catch (err) {
//         console.error("Error fetching offers:", err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchOffers()
//   }, [])

//   // Carousel logic
//   const itemsPerView = 4
//   const maxIndex = Math.max(0, categories.length - itemsPerView)

//   const handlePrevious = useCallback(() => {
//     if (currentIndex === 0) {
//       setAnimate(false)
//       setCurrentIndex(maxIndex)
//       // re-enable transition in next frame
//       requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)))
//     } else {
//       setCurrentIndex((prev) => prev - 1)
//     }
//   }, [currentIndex, maxIndex])

//   const handleNext = useCallback(() => {
//     if (currentIndex === maxIndex) {
//       setAnimate(false)
//       setCurrentIndex(0)
//       // re-enable transition in next frame
//       requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)))
//     } else {
//       setCurrentIndex((prev) => prev + 1)
//     }
//   }, [currentIndex, maxIndex])

//   const categoriesWithOffers = categories.map((cat) => {
//     const offer = offers[cat.apiCategory]
//     const hasValidOffer = offer && offer.active

//     return {
//       ...cat,
//       saleText: hasValidOffer ? "Special Offer" : "Trending",
//       discount: hasValidOffer ? calculateDiscountText(offer) : "New Arrivals",
//       hasOffer: hasValidOffer,
//     }
//   })

//   useEffect(() => {
//     const track = innerTrackRef.current
//     if (!track) return
//     const children = track.children || []
//     const target = children[currentIndex]
//     if (target && target instanceof HTMLElement) {
//       setTranslateX(target.offsetLeft)
//     }
//   }, [currentIndex])

//   useEffect(() => {
//     const onResize = () => {
//       const track = innerTrackRef.current
//       if (!track) return
//       const children = track.children || []
//       const target = children[currentIndex]
//       if (target && target instanceof HTMLElement) {
//         setTranslateX(target.offsetLeft)
//       }
//     }
//     window.addEventListener("resize", onResize)
//     return () => window.removeEventListener("resize", onResize)
//   }, [currentIndex])

//   const handleMouseMove = useCallback(
//     (e) => {
//       if (!isHovering) return
//       const container = scrollContainerRef.current
//       if (!container) return
//       const rect = container.getBoundingClientRect()
//       const x = e.clientX - rect.left
//       const leftZone = rect.width * 0.3
//       const rightZone = rect.width * 0.7

//       if (x < leftZone) {
//         setCurrentIndex((prev) => (prev === 0 ? maxIndex : Math.max(0, prev - 1)))
//       } else if (x > rightZone) {
//         setCurrentIndex((prev) => (prev === maxIndex ? 0 : Math.min(maxIndex, prev + 1)))
//       }
//     },
//     [isHovering, maxIndex],
//   )

//   // FIXED: Pass category name string instead of object
//   const handleCategoryClick = useCallback((categoryName) => {
//     console.log("Category clicked:", categoryName)
//     triggerNavbarNavigation(categoryName)
//   }, [])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading categories...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="relative bg-white py-8 sm:py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//               Shop by Category
//             </h2>
//             <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
//               Discover our curated collection of premium fashion categories, each crafted with elegance and style
//             </p>
//             <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
//           </div>

//           {/* Mobile & Tablet - Enhanced Responsive Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:hidden">
//             {categoriesWithOffers.length > 0 ? (
//               categoriesWithOffers.map((category, index) => (
//                 <div key={index} className="cursor-pointer group" onClick={() => handleCategoryClick(category.name)}>
//                   <div className="relative">
//                     {/* Framed image with category name */}
//                     <FramedImage
//                       src={category.image}
//                       alt={category.name}
//                       categoryName={category.name}
//                       aspect="portrait"
//                     />
//                     {/* Sale Badge - Responsive positioning */}
//                     {category.hasOffer && (
//                       <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40">
//                         <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
//                           <div className="leading-tight">{category.saleText}</div>
//                           <div className="mt-0.5 leading-tight">{category.discount}</div>
//                         </div>
//                       </div>
//                     )}
//                     {/* Trending Badge for non-offer items */}
//                     {!category.hasOffer && (
//                       <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40">
//                         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
//                           <div className="leading-tight">Trending</div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-12">
//                 <p className="text-gray-500 text-base sm:text-lg">No categories available at the moment.</p>
//               </div>
//             )}
//           </div>

//           {/* Desktop Carousel */}
//           <div className="hidden lg:block">
//             {categoriesWithOffers.length > 0 ? (
//               <>
//                 <div
//                   className="overflow-hidden"
//                   ref={scrollContainerRef}
//                   onMouseMove={handleMouseMove}
//                   onMouseEnter={() => setIsHovering(true)}
//                   onMouseLeave={() => setIsHovering(false)}
//                 >
//                   <div
//                     ref={innerTrackRef}
//                     className={`flex ${animate ? "transition-transform duration-500 ease-out" : "transition-none"} gap-6`}
//                     style={{ transform: `translateX(-${translateX}px)` }}
//                   >
//                     {categoriesWithOffers.map((category, index) => (
//                       <div
//                         key={index}
//                         className="flex-shrink-0 cursor-pointer group"
//                         style={{ width: `${100 / itemsPerView}%` }}
//                         onClick={() => handleCategoryClick(category.name)}
//                       >
//                         <div className="relative h-full px-3">
//                           {/* Framed image with category name */}
//                           <FramedImage
//                             src={category.image}
//                             alt={category.name}
//                             categoryName={category.name}
//                             aspect="portrait"
//                           />
//                           {/* Sale Badge with enhanced styling */}
//                           {category.hasOffer && (
//                             <div className="absolute top-4 right-4 z-40">
//                               <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl border border-white/30">
//                                 <div className="leading-tight">{category.saleText}</div>
//                                 <div className="mt-1 text-xs leading-tight">{category.discount}</div>
//                               </div>
//                             </div>
//                           )}
//                           {/* Trending Badge for non-offer items */}
//                           {!category.hasOffer && (
//                             <div className="absolute top-4 right-4 z-40">
//                               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl border border-white/30">
//                                 <div className="leading-tight">Trending</div>
//                               </div>
//                             </div>
//                           )}
//                           {/* REMOVED: Price display section */}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Navigation Controls */}
//                 <div className="flex justify-center items-center mt-10">
//                   <div className="flex gap-6 items-center">
//                     <button
//                       onClick={handlePrevious}
//                       className="p-4 rounded-full transition-all duration-300 transform bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
//                     >
//                       <ChevronLeft size={28} />
//                     </button>

//                     {/* Pagination dots */}
//                     <div className="flex gap-2">
//                       {Array.from({ length: maxIndex + 1 }, (_, i) => (
//                         <button
//                           key={i}
//                           onClick={() => setCurrentIndex(i)}
//                           className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                             i === currentIndex
//                               ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-125"
//                               : "bg-gray-300 hover:bg-gray-400"
//                           }`}
//                         />
//                       ))}
//                     </div>

//                     <button
//                       onClick={handleNext}
//                       className="p-4 rounded-full transition-all duration-300 transform bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
//                     >
//                       <ChevronRight size={28} />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">No categories available at the moment.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CategoryCarousel


"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"

// Local Images
import kurtiImage from "../components/Assets/kurti's.jpg"
import wedding_wear from "../components/Assets/weding_wear.jpg"
import saree from "../components/Assets/saree.jpg"
import formal from "../components/Assets/formal_wear.jpg"
import lehenga from "../components/Assets/lehenga.jpg"
import ethnic_wear from "../components/Assets/ethnic_wear.jpg"
import party_wear from "../components/Assets/party_wear.jpg"
// Frame image (place your provided border image here)
import frameBorder from "../components/Assets/category_frame.png"

// Helper: discount text
const calculateDiscountText = (offer) => {
  if (!offer) return null
  if (offer.offerType === "percentage") return `UPTO ${offer.value}% OFF`
  if (offer.offerType === "flat") return `FLAT ₹${offer.value} OFF`
  return null
}

// Reusable framed image wrapper with text overlay
const FramedImage = ({ src, alt, categoryName, aspect = "portrait" }) => {
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-[5/6]" // Increased height aspect ratio
  return (
    <div className={`relative w-full ${aspectClass} group`}>
      {/* Main container with shadow and hover effects */}
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
        {/* Product image - positioned to show inside the frame */}
        <div className="absolute inset-[8%] z-10 rounded-lg overflow-hidden">
          {/* Reduced inset for larger image area */}
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/300x400/cccccc/666666?text=Image+Not+Found"
            }}
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Decorative frame border - acts as actual border with increased height */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
          <img
            src={frameBorder || "/placeholder.svg"}
            alt="decorative frame"
            className="w-full h-full object-cover"
            style={{
              filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
            }}
            onError={(e) => {
              console.log("Frame image failed to load, using CSS border")
              e.currentTarget.style.display = "none"
              // Fallback: Add CSS border to parent
              e.currentTarget.parentElement.style.border = "4px solid #d4af37"
              e.currentTarget.parentElement.style.borderRadius = "12px"
            }}
          />
        </div>

        {/* Category name overlay with enhanced styling */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 z-30">
          {/* Increased bottom padding */}
          <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-white/40 mx-3">
            <h3 className="text-white font-bold text-xs sm:text-sm text-center tracking-wider uppercase drop-shadow-lg">
              {categoryName}
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [offers, setOffers] = useState({})
  const [loading, setLoading] = useState(true)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const scrollContainerRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  // Navbar navigation trigger - FIXED: Accept category name string
  const triggerNavbarNavigation = (categoryName) => {
    console.log("Triggering navigation to:", categoryName)
    const event = new CustomEvent("navigateToCategory", {
      detail: { category: categoryName },
    })
    window.dispatchEvent(event)
    setShowSaleModal(false)
  }

  // Categories with fallback images
  const categories = [
    { name: "Kurtis", apiCategory: "68d237b7bbab251b0858ae35", image: kurtiImage },
    { name: "Wedding Wear", apiCategory: "68d142ba7dad5d4cf276bae8", image: wedding_wear },
    { name: "Sarees", apiCategory: "68d1459c7dad5d4cf276bbaf", image: saree },
    { name: "Formal Wear", apiCategory: "68d142ba7dad5d4cf276bae8", image: formal },
    { name: "Lehengas", apiCategory: "68d231f3bbab251b0858ad38", image: lehenga },
    { name: "Ethnic Wear", apiCategory: "68d130ed7dad5d4cf276bad2", image: ethnic_wear },
    { name: "Party Wear", apiCategory: "68d1459c7dad5d4cf276bbaf", image: party_wear },
  ]

  // Fetch offers per category
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        const offerData = {}

        // Fetch offers for each category
        for (const cat of categories) {
          try {
            const res = await axios.get(`https://api.silksew.com/api/offer/get-offer/${cat.apiCategory}`)
            console.log(`Offer response for ${cat.name}:`, res.data)

            if (res.data.success && res.data.offer?.active) {
              offerData[cat.apiCategory] = res.data.offer
            }
          } catch (err) {
            console.warn(`No offer found for ${cat.name}:`, err.message)
          }
        }
        setOffers(offerData)
      } catch (err) {
        console.error("Error fetching offers:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [])

  // Carousel logic - FIXED: Simple and stable
  const itemsPerView = 4
  const maxIndex = Math.max(0, categories.length - itemsPerView)

  const handlePrevious = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? maxIndex : prev - 1
      return newIndex
    })
    setTimeout(() => setIsAnimating(false), 500)
  }, [maxIndex, isAnimating])

  const handleNext = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      const newIndex = prev === maxIndex ? 0 : prev + 1
      return newIndex
    })
    setTimeout(() => setIsAnimating(false), 500)
  }, [maxIndex, isAnimating])

  // FIXED: Debounced mouse move handler to prevent jumbling
  const handleMouseMove = useCallback((e) => {
    if (!isHovering || isAnimating) return
    
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    
    // Set a new timeout to debounce the hover action
    const timeout = setTimeout(() => {
      const container = scrollContainerRef.current
      if (!container) return
      
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const leftZone = rect.width * 0.3
      const rightZone = rect.width * 0.7
      
      // Only trigger if mouse is consistently in a zone
      if (x < leftZone) {
        handlePrevious()
      } else if (x > rightZone) {
        handleNext()
      }
    }, 500) // 500ms debounce to prevent rapid firing
    
    setHoverTimeout(timeout)
  }, [isHovering, isAnimating, handlePrevious, handleNext, hoverTimeout])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  // Auto-advance carousel (optional - remove if not needed)
  useEffect(() => {
    if (isHovering || isAnimating) return
    
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isHovering, isAnimating, handleNext])

  // FIXED: Pass category name string instead of object
  const handleCategoryClick = useCallback((categoryName) => {
    console.log("Category clicked:", categoryName)
    triggerNavbarNavigation(categoryName)
  }, [])

  // Merge category with offer - REMOVED finalPrice from the object
  const categoriesWithOffers = categories.map((cat) => {
    const offer = offers[cat.apiCategory]
    const hasValidOffer = offer && offer.active

    return {
      ...cat,
      saleText: hasValidOffer ? "Special Offer" : "Trending",
      discount: hasValidOffer ? calculateDiscountText(offer) : "New Arrivals",
      hasOffer: hasValidOffer
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Discover our curated collection of premium fashion categories, each crafted with elegance and style
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Mobile & Tablet - Enhanced Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:hidden">
            {categoriesWithOffers.length > 0 ? (
              categoriesWithOffers.map((category, index) => (
                <div
                  key={index}
                  className="cursor-pointer group"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="relative">
                    {/* Framed image with category name */}
                    <FramedImage
                      src={category.image}
                      alt={category.name}
                      categoryName={category.name}
                      aspect="portrait"
                    />
                    {/* Sale Badge - Responsive positioning */}
                    {category.hasOffer && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40">
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
                          <div className="leading-tight">{category.saleText}</div>
                          <div className="mt-0.5 leading-tight">{category.discount}</div>
                        </div>
                      </div>
                    )}
                    {/* Trending Badge for non-offer items */}
                    {!category.hasOffer && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-40">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg">
                          <div className="leading-tight">Trending</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-base sm:text-lg">No categories available at the moment.</p>
              </div>
            )}
          </div>

          {/* Desktop Carousel */}
          <div className="hidden lg:block">
            {categoriesWithOffers.length > 0 ? (
              <>
                <div
                  className="overflow-hidden"
                  ref={scrollContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => {
                    setIsHovering(false)
                    // Clear timeout when mouse leaves
                    if (hoverTimeout) {
                      clearTimeout(hoverTimeout)
                    }
                  }}
                >
                  <div
                    className="flex transition-transform duration-500 ease-out gap-6"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                  >
                    {categoriesWithOffers.map((category, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 cursor-pointer group"
                        style={{ width: `${100 / itemsPerView}%` }}
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <div className="relative h-full px-3">
                          {/* Framed image with category name */}
                          <FramedImage
                            src={category.image}
                            alt={category.name}
                            categoryName={category.name}
                            aspect="portrait"
                          />
                          {/* Sale Badge with enhanced styling */}
                          {category.hasOffer && (
                            <div className="absolute top-4 right-4 z-40">
                              <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl border border-white/30">
                                <div className="leading-tight">{category.saleText}</div>
                                <div className="mt-1 text-xs leading-tight">{category.discount}</div>
                              </div>
                            </div>
                          )}
                          {/* Trending Badge for non-offer items */}
                          {!category.hasOffer && (
                            <div className="absolute top-4 right-4 z-40">
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl border border-white/30">
                                <div className="leading-tight">Trending</div>
                              </div>
                            </div>
                          )}
                          {/* REMOVED: Price display section */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-center items-center mt-10">
                  <div className="flex gap-6 items-center">
                    <button
                      onClick={handlePrevious}
                      disabled={isAnimating}
                      className={`p-4 rounded-full transition-all duration-300 transform ${isAnimating
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
                        }`}
                    >
                      <ChevronLeft size={28} />
                    </button>

                    {/* Pagination dots */}
                    <div className="flex gap-2">
                      {Array.from({ length: maxIndex + 1 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (!isAnimating) setCurrentIndex(i)
                          }}
                          disabled={isAnimating}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                            } ${isAnimating ? "cursor-not-allowed" : "cursor-pointer"}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={isAnimating}
                      className={`p-4 rounded-full transition-all duration-300 transform ${isAnimating
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
                        }`}
                    >
                      <ChevronRight size={28} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No categories available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryCarousel