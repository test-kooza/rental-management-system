import { db } from "./db";
import { PropertyStyle } from "@prisma/client";
import slugify from "slugify"; // Make sure you have this package installed

// Utility functions
// Generate a unique slug based on title with random suffix for uniqueness
function generateUniqueSlug(title: string): string {
  const baseSlug = slugify(title, { lower: true, strict: true });
  const randomSuffix = Math.floor(Math.random() * 10000).toString();
  return `${baseSlug}-${randomSuffix}`;
}

// Function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to get random integer between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get random decimal between min and max with specified precision
function getRandomDecimal(min: number, max: number, precision: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(precision));
}

// Function to get random boolean with weighted probability
function getRandomBoolean(trueProbability: number = 0.5): boolean {
  return Math.random() < trueProbability;
}

// Function to get random property style
function getRandomPropertyStyles(): PropertyStyle[] {
  const styles = ["PEACEFUL", "UNIQUE", "FAMILY_FRIENDLY", "STYLISH", "CENTRAL", "SPACIOUS"];
  const count = getRandomInt(1, 3);
  return getRandomItems(styles, count) as PropertyStyle[];
}

// Function to get random amenities
function getRandomAmenities(): any {
  return {
    hasWifi: getRandomBoolean(0.9),
    hasAC: getRandomBoolean(0.8),
    hasParking: getRandomBoolean(0.7),
    hasKitchen: getRandomBoolean(0.9),
    hasPool: getRandomBoolean(0.3),
    hasGym: getRandomBoolean(0.3),
    hasTv: getRandomBoolean(0.8),
    isBeachfront: getRandomBoolean(0.2),
    isMountainView: getRandomBoolean(0.2),
    isPetFriendly: getRandomBoolean(0.4),
    hasDishwasher: getRandomBoolean(0.6),
    hasWasher: getRandomBoolean(0.7),
    hasDryer: getRandomBoolean(0.6),
    hasHotTub: getRandomBoolean(0.3),
    hasFireplace: getRandomBoolean(0.3),
    hasWorkspace: getRandomBoolean(0.7),
    hasBBQGrill: getRandomBoolean(0.4),
    hasPatio: getRandomBoolean(0.5),
    hasElevator: getRandomBoolean(0.4),
    hasSecurityCamera: getRandomBoolean(0.3)
  };
}

// Property descriptions for variety
const propertyDescriptions = [
  "Beautiful property with stunning views. Perfect for a relaxing getaway. This spacious accommodation offers all the modern amenities while maintaining a cozy, homey feel. Wake up to breathtaking scenery and enjoy your morning coffee on the private balcony.\n\nThe interior features high-quality furnishings and a fully equipped kitchen. The bedroom has a comfortable king-size bed with premium linens. The bathroom includes a rainfall shower and complimentary toiletries.\n\nGuests have access to the entire property, including the outdoor seating area. The neighborhood is quiet and safe, with easy access to local attractions, restaurants, and shops. Public transportation is available within walking distance.",
  
  "Charming retreat in a peaceful location. This stylish property features high-end finishes and thoughtful touches throughout. Ideal for couples or small families looking for a memorable stay in a unique setting.\n\nThe open-concept living area includes a comfortable seating area, dining space, and a well-equipped kitchen. The bedroom features a plush queen-size bed and ample storage. The modern bathroom has a spacious shower and luxury amenities.\n\nThe property is surrounded by beautiful landscaping, offering privacy and tranquility. Nearby attractions include hiking trails, local markets, and cultural sites. Restaurants and cafes are within a short drive.",
  
  "Modern and elegant space with attention to detail. This recently renovated property combines contemporary design with practical comfort. Large windows allow natural light to fill the space, creating a bright and welcoming atmosphere.\n\nThe property features a sleek kitchen with stainless steel appliances, a comfortable living area with smart TV, and a dining space perfect for meals. The bedroom has a luxurious bed with high-quality linens. The bathroom includes a walk-in shower and premium fixtures.\n\nGuests can enjoy the private outdoor space for relaxation. The location offers easy access to public transportation, shopping centers, and entertainment venues. Parking is available on premises.",
  
  "Cozy hideaway perfect for a romantic weekend. This intimate property offers privacy and tranquility, with luxurious touches that make your stay special. The comfortable bed and premium linens ensure a restful night's sleep.\n\nThe property includes a kitchenette with essential appliances, a cozy seating area with a fireplace, and a dining nook. The bathroom features a deep soaking tub and a separate shower. High-quality toiletries are provided for guests.\n\nThe surrounding area is known for its scenic beauty and outdoor activities. Local restaurants offer delicious cuisine, and boutique shops are perfect for souvenir hunting. The property is a short drive from popular attractions.",
  
  "Spacious family-friendly property with all the comforts of home. The open floor plan is perfect for spending quality time together, while separate bedrooms provide privacy when needed. Kids will love the outdoor space to play and explore.\n\nThe fully equipped kitchen makes meal preparation easy, and the dining area can accommodate everyone. The living room has comfortable seating and entertainment options. Bedrooms feature comfortable beds and storage space. Multiple bathrooms ensure convenience for all guests.\n\nThe property is located near family attractions, parks, and recreational facilities. Grocery stores and family-friendly restaurants are within easy reach. The neighborhood is safe and welcoming for families with children of all ages.",
  
  "Luxurious retreat with premium amenities. This high-end property features designer furnishings, top-of-the-line appliances, and sumptuous textiles. Every detail has been carefully considered to provide an exceptional stay.\n\nThe gourmet kitchen is a chef's dream, equipped with high-end appliances and quality cookware. The living area features plush seating and entertainment options. The bedroom is a sanctuary with a premium mattress and luxury bedding. The spa-like bathroom includes a rainfall shower and soaking tub.\n\nGuests can enjoy the exclusive location, offering privacy and stunning views. Fine dining restaurants, upscale shopping, and cultural attractions are nearby. Concierge services can be arranged for additional convenience.",
  
  "Unique architectural gem with character and style. This one-of-a-kind property showcases innovative design and creative use of space. Art lovers and design enthusiasts will appreciate the thoughtful aesthetics throughout.\n\nThe interior features custom-made furniture, artistic elements, and interesting architectural details. The kitchen combines functionality with style, perfect for preparing meals. The bedroom offers a comfortable retreat with unique design elements. The bathroom is a work of art with custom fixtures and finishes.\n\nThe property is located in a creative neighborhood, surrounded by galleries, studios, and artistic venues. Unique cafes and restaurants offer culinary adventures. Cultural events and exhibitions are regularly held in the area.",
  
  "Peaceful sanctuary surrounded by nature. This tranquil property offers a chance to disconnect and recharge. Fall asleep to the sounds of nature and wake up refreshed in this serene environment.\n\nThe property features large windows that frame the natural surroundings. The kitchen is equipped with everything needed for meal preparation. The comfortable bedroom promotes restful sleep. The bathroom includes eco-friendly amenities and fixtures.\n\nOutdoor spaces invite relaxation and contemplation. Nearby nature trails are perfect for hiking and wildlife observation. Local organic markets provide fresh ingredients for meals. The area is known for its natural beauty and conservation efforts.",
  
  "Centrally located property with easy access to attractions. This conveniently situated accommodation puts you within reach of all the local highlights while providing a comfortable base for your adventures.\n\nThe property offers a functional kitchen for meal preparation, a comfortable living area for relaxation, and a dining space for enjoying meals. The bedroom provides a restful retreat after a day of exploration. The clean bathroom has all the necessary amenities.\n\nPublic transportation options are just steps away. Popular attractions, restaurants, and shopping areas are within walking distance. The central location makes it easy to experience everything the area has to offer without spending time on long commutes.",
  
  "Rustic charm meets modern convenience in this delightful property. The natural materials and traditional elements create a warm atmosphere, while updated amenities ensure a comfortable stay.\n\nThe kitchen combines rustic elements with modern appliances, perfect for preparing meals. The living area features comfortable seating around a traditional fireplace. The bedroom offers a cozy retreat with a comfortable bed. The bathroom blends rustic design with modern fixtures.\n\nThe property is surrounded by beautiful countryside, offering scenic views and outdoor activities. Local markets sell regional products and handcrafted items. Traditional restaurants serve authentic cuisine, providing a taste of local culture.",
  
  "Bright and airy property with contemporary style. The thoughtful layout maximizes space and comfort, making this an ideal choice for discerning travelers seeking quality accommodation.\n\nThe well-designed kitchen includes everything needed for meal preparation. The living area offers comfortable seating and entertainment options. The bedroom features a quality mattress and linens for a good night's sleep. The modern bathroom has a spacious shower and quality fixtures.\n\nThe property is located in a vibrant neighborhood with a variety of dining options, from casual cafes to fine restaurants. Shopping opportunities range from local boutiques to larger retail centers. Cultural venues and entertainment options are easily accessible.",
  
  "Secluded retreat offering privacy and relaxation. This hidden gem provides a peaceful escape from the hustle and bustle, allowing guests to truly unwind in a serene setting.\n\nThe property includes a well-equipped kitchen for preparing meals, a comfortable living area for relaxation, and a dining space for enjoying meals. The bedroom is a tranquil haven with a comfortable bed. The bathroom offers quality fixtures and amenities.\n\nThe secluded location provides peace and quiet, perfect for those seeking to escape the noise of everyday life. Despite the private setting, amenities and attractions are still accessible with a short drive. Nature lovers will appreciate the surrounding landscape and wildlife.",
  
  "Elegant property with refined details throughout. The sophisticated design creates an atmosphere of luxury and comfort, perfect for those who appreciate the finer things in life.\n\nThe gourmet kitchen is equipped with high-quality appliances and cookware. The living area features elegant furnishings and tasteful decor. The bedroom offers a luxurious retreat with premium bedding. The bathroom includes high-end fixtures and luxury toiletries.\n\nThe property is located in an upscale neighborhood known for its refined atmosphere. Fine dining establishments offer culinary excellence, and boutique shops provide unique shopping experiences. Cultural venues host quality performances and exhibitions.",
  
  "Charming property full of character and local flavor. Experience authentic living in this thoughtfully appointed accommodation that reflects the unique culture of the region.\n\nThe kitchen includes local elements and all necessary equipment for meal preparation. The living area features traditional furnishings and cultural artifacts. The bedroom offers a comfortable space with regional textiles. The bathroom combines local design with modern functionality.\n\nThe property is located in an area known for its cultural heritage and traditions. Local markets offer authentic products and handicrafts. Traditional festivals and events provide insight into the regional culture. Restaurants serve local specialties prepared with traditional recipes.",
  
  "Contemporary property with clean lines and minimalist design. The uncluttered space creates a sense of calm and order, ideal for those who prefer a modern aesthetic.\n\nThe sleek kitchen features modern appliances and a minimalist design. The living area offers comfortable seating with a clean, contemporary look. The bedroom is a serene space with simple, quality furnishings. The bathroom features modern fixtures and a minimalist aesthetic.\n\nThe property is located in a modern neighborhood with contemporary architecture and design. Trendy restaurants and cafes offer innovative cuisine. Art galleries and design shops showcase current trends and creative works. The area attracts those who appreciate modern aesthetics and forward-thinking concepts.",
  
  "Inviting property that feels like a home away from home. Thoughtful touches and comfortable furnishings make this a place where you can relax and feel instantly at ease.\n\nThe kitchen is well-stocked with everything needed to prepare meals just like at home. The living area features comfortable seating and homey touches. The bedroom offers a comfortable bed with quality linens. The bathroom includes all the amenities you would expect in a well-appointed home.\n\nThe property is located in a friendly neighborhood with a community feel. Local shops and markets provide everything needed for a comfortable stay. Family-owned restaurants serve hearty, home-style meals. The welcoming atmosphere extends throughout the area, making guests feel like part of the community."
];

// Short descriptions for properties
const shortDescriptions = [
  "Peaceful retreat with amazing views",
  "Stylish space in prime location",
  "Cozy hideaway for the perfect getaway",
  "Modern luxury with all amenities",
  "Family-friendly home with spacious rooms",
  "Unique design in a tranquil setting",
  "Central location with easy access to attractions",
  "Rustic charm with modern conveniences",
  "Elegant space with premium features",
  "Bright and airy accommodation",
  "Secluded sanctuary for ultimate relaxation",
  "Contemporary style with comfort in mind",
  "Charming property with local character",
  "Luxurious retreat with high-end finishes",
  "Minimalist design for a calm atmosphere",
  "Home away from home with all conveniences"
];

// Property titles by category
const propertyTitlesByCategoryId = {
  "cm8hoy60l000ag6fs80w9vrlh": [ // Pool
    "Luxurious Pool Villa Retreat",
    "Tropical Poolside Paradise",
    "Modern Pool House with Garden Views",
    "Exclusive Pool Residence with Panoramic Views",
    "Intimate Pool Cottage with Privacy",
    "Family Pool Villa with Entertainment Area",
    "Stylish Pool Bungalow in Peaceful Setting",
    "Contemporary Pool Suite with Sundeck",
    "Secluded Pool Hideaway for Couples",
    "Elegant Pool Mansion with Cabana",
    "Infinity Pool House with Mountain View",
    "Resort-Style Pool Home with Outdoor Kitchen",
    "Tranquil Pool Retreat with Lush Surroundings",
    "Beachfront Property with Private Pool",
    "Urban Oasis with Heated Pool",
    "Luxury Pool Penthouse with City Views"
  ],
  "cm8hp04nw000cg6fsf8zbbl2r": [ // Farm
    "Rustic Farmhouse with Organic Garden",
    "Charming Barn Conversion on Working Farm",
    "Peaceful Country Cottage with Farm Views",
    "Historic Farmstead with Modern Amenities",
    "Cozy Farm Cabin with Animal Encounters",
    "Family-Friendly Farm Stay Experience",
    "Vineyard Cottage with Wine Tasting",
    "Elegant Farmhouse with Equestrian Facilities",
    "Orchard Retreat with Fruit Picking",
    "Traditional Farm Cottage with Fireplace",
    "Luxury Farm Estate with Panoramic Views",
    "Quaint Dairy Farm Guesthouse",
    "Lavender Farm Cottage with Aromatherapy",
    "Ranch House with Horseback Riding",
    "Sustainable Eco-Farm Experience",
    "Heritage Farm Homestead with Farm-to-Table Dining"
  ],
  "cm8hp6sco000eg6fsg8ahb4be": [ // Containers
    "Modern Container Home with Rooftop Terrace",
    "Minimalist Shipping Container Retreat",
    "Industrial Chic Container Loft",
    "Eco-Friendly Container House with Solar Power",
    "Luxurious Container Villa with Floor-to-Ceiling Windows",
    "Compact Container Studio with Clever Design",
    "Artistic Container Home with Gallery Space",
    "Container Beach House with Ocean Views",
    "Urban Container Apartment with City Access",
    "Multi-Container Family Home with Courtyard",
    "Off-Grid Container Cabin in the Woods",
    "Sleek Container Suite with Designer Furnishings",
    "Container Tiny Home with Smart Technology",
    "Upcycled Container Retreat with Sustainable Features",
    "Container Mountain Lodge with Panoramic Windows",
    "Floating Container Home on Private Dock"
  ],
  "cm8hp8sem000gg6fss6gmn0bz": [ // Apartments
    "Luxury Penthouse Apartment with City Views",
    "Modern Urban Apartment in Downtown",
    "Cozy Studio Apartment with Balcony",
    "Stylish Loft Apartment in Historic Building",
    "Family Apartment with Kid-Friendly Amenities",
    "Elegant Apartment in Prestigious Neighborhood",
    "Contemporary Apartment with Designer Furnishings",
    "Riverside Apartment with Water Views",
    "Art Deco Apartment with Period Features",
    "High-Rise Apartment with Skyline Views",
    "Bohemian Apartment in Cultural District",
    "Executive Apartment with Home Office",
    "Garden Apartment with Private Patio",
    "Minimalist Apartment with Smart Home Features",
    "Penthouse Suite with Private Roof Terrace",
    "Classic Apartment with Architectural Details"
  ],
  "cm8hpa87u000ig6fskzr3k106": [ // Top Cities
    "Downtown Luxury Condo with City Views",
    "Urban Sanctuary in Metropolitan Location",
    "City Center Apartment with Cultural Access",
    "Skyline Penthouse in Financial District",
    "Historic Townhouse in City Heritage Area",
    "Boutique Apartment in Fashion District",
    "Modern City Loft with Industrial Elements",
    "Upscale City Residence with Concierge",
    "Artsy City Flat in Creative Neighborhood",
    "Executive Suite in Business District",
    "Chic City Pied-à-Terre with Designer Touches",
    "Waterfront City Apartment with Harbor Views",
    "Cosmopolitan Apartment with Vibrant Location",
    "Urban Townhouse with Private Garden",
    "City View Apartment with Rooftop Access",
    "Central City Studio with Smart Design"
  ],
  "cm8hpcsy1000mg6fs2lol9vrm": [ // National Parks
    "Mountain Cabin Near National Park Entrance",
    "Scenic Lodge with National Park Views",
    "Rustic Retreat at National Park Boundary",
    "Wildlife Viewing Home Near Park Trails",
    "Luxury Chalet with National Park Access",
    "Historic Ranger Cabin Renovated for Comfort",
    "Trailhead House with Hiking Access",
    "Panoramic View Home on Park Perimeter",
    "Adventure Base Camp Near National Park",
    "Stargazing Cottage in Dark Sky Park",
    "Wilderness Cabin with National Park Setting",
    "Park Gateway Home with Nature Access",
    "Eco-Friendly Lodge Near Conservation Area",
    "Mountain View Home with National Park Proximity",
    "Forest Retreat with National Park Trail Access",
    "Scenic Valley House Near Park Entrance"
  ],
  "cm8hpdvbi000og6fsklk2f0zc": [ // Lake
    "Lakefront Cottage with Private Dock",
    "Modern Lake House with Panoramic Views",
    "Charming Cabin on Tranquil Lake",
    "Luxury Lake Villa with Boat Access",
    "Cozy Lake Retreat with Fishing Spot",
    "Family Lake Home with Water Activities",
    "Elegant Lakeside Estate with Garden",
    "Lake View Apartment with Balcony",
    "Rustic Lake Cabin with Firepit",
    "Contemporary Lake House with Floor-to-Ceiling Windows",
    "Secluded Lake Bungalow with Swimming Area",
    "Historic Lake Lodge with Stone Fireplace",
    "Peaceful Lake Cottage with Kayak Launch",
    "Upscale Lake Residence with Entertainment Deck",
    "Traditional Lake House with Screened Porch",
    "Minimalist Lake Retreat with Sunset Views"
  ],
  "cm8hpf19a000qg6fsan8llwy1": [ // Rooms
    "Luxury Master Suite with Private Bathroom",
    "Cozy Guest Room in Charming Home",
    "Elegant Room with Garden View",
    "Modern Room with Work Space",
    "Rustic Room with Antique Furnishings",
    "Bright Room with Natural Light",
    "Peaceful Room in Quiet Neighborhood",
    "Stylish Room with En-Suite Facilities",
    "Compact Room with Efficient Design",
    "Comfortable Room with Reading Nook",
    "Spacious Room with Sitting Area",
    "Character Room in Historic Building",
    "Minimalist Room with Clean Aesthetics",
    "Themed Room with Unique Decor",
    "Accessible Room with Adaptable Features",
    "Deluxe Room with Premium Amenities"
  ],
  "cm8hphwtz000sg6fske277zha": [ // Tiny Homes
    "Modern Tiny House with Smart Design",
    "Rustic Tiny Cabin in Wooded Setting",
    "Coastal Tiny Home with Ocean Access",
    "Minimalist Tiny House on Wheels",
    "Luxury Tiny Home with High-End Finishes",
    "Eco-Friendly Tiny House with Sustainable Features",
    "Urban Tiny Home in City Center",
    "Artistic Tiny House with Creative Space",
    "Off-Grid Tiny Cabin with Solar Power",
    "Tiny Beach House with Water Views",
    "Compact Tiny Home with Efficient Layout",
    "Woodland Tiny Retreat with Nature Access",
    "Designer Tiny House with Custom Features",
    "Tiny Mountain Cabin with Panoramic Views",
    "Tiny Farmhouse with Garden Access",
    "Contemporary Tiny Home with Outdoor Living Space"
  ],
  "cm8hpj31c000ug6fsl377vpmn": [ // Luxe
    "Ultra-Luxury Villa with Infinity Pool",
    "Exclusive Mansion with Private Spa",
    "Designer Penthouse with Panoramic Views",
    "Opulent Estate with Manicured Gardens",
    "Premium Chalet with Personal Concierge",
    "Lavish Beachfront Property with Private Beach",
    "High-End Residence with Cinema Room",
    "Luxury Retreat with Helicopter Pad",
    "Sophisticated Mansion with Wine Cellar",
    "Prestigious Castle with Historic Features",
    "Executive Luxury Home with Business Center",
    "Elite Island Villa with Yacht Access",
    "Grand Chateau with Exclusive Grounds",
    "Sumptuous Urban Residence with Staff Quarters",
    "Deluxe Mountain Lodge with Ski-In Access",
    "Premier Waterfront Estate with Private Dock"
  ],
  "cm8hpkytm000wg6fsm96swuta": [ // Camping
    "Luxury Glamping Tent with Real Bed",
    "Rustic Campsite with Private Fire Pit",
    "Safari Tent with Outdoor Living Space",
    "Elevated Camping Platform with Forest Views",
    "Yurt with Comfortable Furnishings",
    "Bell Tent with Bohemian Decor",
    "Eco Camping Pod with Sustainable Features",
    "Treehouse Camping Experience",
    "Riverside Camping Setup with Fishing Access",
    "Stargazing Dome Tent for Night Sky Views",
    "Bushcraft Camping Site with Wild Setting",
    "Beachfront Camping with Ocean Sounds",
    "Mountain View Campsite with Hiking Access",
    "Family Camping Setup with Kid-Friendly Features",
    "Desert Camping Experience with Sunset Views",
    "Winter Camping Setup with Heating"
  ],
  "cm8hpm2l3000yg6fsy68mat66": [ // Mansions
    "Historic Mansion with Period Features",
    "Contemporary Mansion with Infinity Pool",
    "Grand Estate with Landscaped Gardens",
    "Luxury Mansion with Home Theater",
    "Beachfront Mansion with Private Beach",
    "Elegant Mansion with Ballroom",
    "Country Mansion with Equestrian Facilities",
    "Modern Mansion with Smart Home Technology",
    "Mediterranean-Style Mansion with Courtyard",
    "Waterfront Mansion with Yacht Dock",
    "Mountain Mansion with Panoramic Views",
    "Gated Mansion with Privacy and Security",
    "Colonial Mansion with Historic Charm",
    "Resort-Style Mansion with Indoor Pool",
    "Architectural Masterpiece Mansion",
    "Urban Mansion with Rooftop Garden"
  ],
  "cm8hoc4ka0008g6fsh65wil4g": [ // Single Rooms
    "Luxury Single Room with En-Suite Bathroom",
    "Cozy Single Room in Quiet House",
    "Modern Single Room with Work Desk",
    "Bright Single Room with Garden View",
    "Compact Single Room with Efficient Design",
    "Stylish Single Room in Central Location",
    "Single Room with Shared Kitchen Access",
    "Comfortable Single Room with Reading Corner",
    "Single Room with Private Entrance",
    "Minimalist Single Room with Clean Aesthetics",
    "Single Room in Historic Building",
    "Peaceful Single Room in Residential Area",
    "Single Room with Natural Light",
    "Single Room with City View",
    "Character Single Room with Antique Furniture",
    "Single Room with Modern Amenities"
  ]
};

// Define image arrays
const imageUrls = [
  "https://utfs.io/f/8ws7WzUeIjSFNG2mx6WXlqshx8bo6naJ70mRFg3jWevfyZuL",
  "https://utfs.io/f/8ws7WzUeIjSFVse7Ut4iEFUae7ZRqbSfkCTWB6AGOxznvms3",
  "https://utfs.io/f/8ws7WzUeIjSFvVd9zT0dARB49cgneSjtYXUqJm6sDV1F2wbC",
  "https://utfs.io/f/8ws7WzUeIjSFxwalJB7mN0aqnWKhrPfsYk1bv427wMpJXzjL",
  "https://utfs.io/f/8ws7WzUeIjSFF5TaAM2ZvOyPi5hVp4DGkTRLEtABUrmYj9ac",
  "https://utfs.io/f/8ws7WzUeIjSF6gpNd6eF4AEPycCKtiQTSpOosVvWGYNzrB8M",
  "https://utfs.io/f/8ws7WzUeIjSF89DR5hUeIjSF3BxAm6aofRGLQTUph5gWtuDJ",
  "https://utfs.io/f/8ws7WzUeIjSFL6WFne9xBMCT5a4EoZIhKx6bH10DXQUVOR9G",
  "https://utfs.io/f/8ws7WzUeIjSFjk2WSEN0F2XEUvhtPcTDz34wHVSrjogs89ip",
  "https://utfs.io/f/8ws7WzUeIjSFxkhU537mN0aqnWKhrPfsYk1bv427wMpJXzjL",
  "https://utfs.io/f/8ws7WzUeIjSFleNt5i1FKRt7QA8mwbykPS6D0CvsJ4gVpUo5",
  "https://utfs.io/f/8ws7WzUeIjSFdDaKEkV2UDjnGarxFVpPKw3mbuXTyQcJBN5H",
  "https://utfs.io/f/8ws7WzUeIjSFxH8keM7mN0aqnWKhrPfsYk1bv427wMpJXzjL",
  "https://utfs.io/f/8ws7WzUeIjSFc3tGTeCnKB2psxNta1U0wSHRLrk3AmJcEDZy",
  "https://utfs.io/f/8ws7WzUeIjSFUKxPIDbyRaKgvqiCYGr8xtwS6puHAk3VzJMD",
  "https://utfs.io/f/8ws7WzUeIjSFb7F5MwHL23MEugx9ABGeJ4YT0QcKWtLInv6V",
  "https://utfs.io/f/8ws7WzUeIjSFkV7vxXyt6zAnaXKFJHjqUfx57ZlbiLuhD1TI",
  "https://utfs.io/f/8ws7WzUeIjSFxBt9Ni7mN0aqnWKhrPfsYk1bv427wMpJXzjL",
  "https://utfs.io/f/8ws7WzUeIjSFRWqvqzQOlfjy6JGm9s7XzUcPnZewp25BHthu",
  "https://utfs.io/f/8ws7WzUeIjSFAPgaJX9FsZ3JXFBHxERl0zvdrta9ScNe5Gky",
  "https://utfs.io/f/8ws7WzUeIjSFl6XNNr1FKRt7QA8mwbykPS6D0CvsJ4gVpUo5",
  "https://utfs.io/f/8ws7WzUeIjSFqJL8OQRXB5Gs7CJNhUzwenx4I1b6olptE3ac",
  "https://utfs.io/f/8ws7WzUeIjSF5vG03aJxSpoaXQNdmZ283fst7HqYru1TDjkG",
  "https://utfs.io/f/8ws7WzUeIjSFQOodAbtzM1twcL5G62zJSWa7C84hnNoDFgYZ",
  "https://utfs.io/f/8ws7WzUeIjSFjYtklfN0F2XEUvhtPcTDz34wHVSrjogs89ip",
  "https://utfs.io/f/8ws7WzUeIjSFKDpYnchqObwjApN9P8SkGu75f6ecWyTIrEs3",
  "https://utfs.io/f/8ws7WzUeIjSFVrk9pH4iEFUae7ZRqbSfkCTWB6AGOxznvms3",
  "https://utfs.io/f/8ws7WzUeIjSFUvspXbyRaKgvqiCYGr8xtwS6puHAk3VzJMDc",
  "https://utfs.io/f/8ws7WzUeIjSFfXtZQQjc6SVmuY1px3tBhockj9W78aTdeAP5",
  "https://utfs.io/f/8ws7WzUeIjSFL3YoaUxBMCT5a4EoZIhKx6bH10DXQUVOR9Gl",
  "https://utfs.io/f/8ws7WzUeIjSFbJgQdFL23MEugx9ABGeJ4YT0QcKWtLInv6VD",
  "https://utfs.io/f/8ws7WzUeIjSFBywuFd1MdZ1b9VSMtkznw6f38hgmUqCWTe7r",
  "https://utfs.io/f/8ws7WzUeIjSFBHN9rVMdZ1b9VSMtkznw6f38hgmUqCWTe7r5",
  "https://utfs.io/f/8ws7WzUeIjSF6nl7EGeF4AEPycCKtiQTSpOosVvWGYNzrB8M",
  "https://utfs.io/f/8ws7WzUeIjSFRaih0iQOlfjy6JGm9s7XzUcPnZewp25BHthu",
  "https://utfs.io/f/8ws7WzUeIjSFRL2PfLQOlfjy6JGm9s7XzUcPnZewp25BHthu",
  "https://utfs.io/f/8ws7WzUeIjSFsOPeotS7gLaWY5mISvb1QRrMGeq9DxUXwOEZ",
  "https://utfs.io/f/8ws7WzUeIjSFK3sQaohqObwjApN9P8SkGu75f6ecWyTIrEs3",
  "https://utfs.io/f/8ws7WzUeIjSF8hEdP5UeIjSF3BxAm6aofRGLQTUph5gWtuDJ",
  "https://utfs.io/f/8ws7WzUeIjSFxfsuf47mN0aqnWKhrPfsYk1bv427wMpJXzjL",
  "https://utfs.io/f/8ws7WzUeIjSFMQG7SzkBTHpGM0qUAzeFNS2nLCRxXlfZKudh",
  "https://utfs.io/f/8ws7WzUeIjSFcybM9bCnKB2psxNta1U0wSHRLrk3AmJcEDZy",
  "https://utfs.io/f/8ws7WzUeIjSF2u3LAhsLmqWycGrdX7Yk805tEan69wMZhRz3",
  "https://utfs.io/f/8ws7WzUeIjSFDTHUtI3HBglXL0aiAjVNGJcWvdsowPSkh5u9",
  "https://utfs.io/f/8ws7WzUeIjSF2GEmtQsLmqWycGrdX7Yk805tEan69wMZhRz3",
  "https://utfs.io/f/8ws7WzUeIjSFxqhSyZ7mN0aqnWKhrPfsYk1bv427wMpJXzjL"
];

// Categories data
const categories = [
  { id: "cm8hoy60l000ag6fs80w9vrlh", name: "Pool" },
  { id: "cm8hp04nw000cg6fsf8zbbl2r", name: "Farm" },
  { id: "cm8hp6sco000eg6fsg8ahb4be", name: "Containers" },
  { id: "cm8hp8sem000gg6fss6gmn0bz", name: "Apartments" },
  { id: "cm8hpa87u000ig6fskzr3k106", name: "Top Cities" },
  { id: "cm8hpcsy1000mg6fs2lol9vrm", name: "National Parks" },
  { id: "cm8hpdvbi000og6fsklk2f0zc", name: "Lake" },
  { id: "cm8hpf19a000qg6fsan8llwy1", name: "Rooms" },
  { id: "cm8hphwtz000sg6fske277zha", name: "Tiny Homes" },
  { id: "cm8hpj31c000ug6fsl377vpmn", name: "Luxe" },
  { id: "cm8hpkytm000wg6fsm96swuta", name: "Camping" },
  { id: "cm8hpm2l3000yg6fsy68mat66", name: "Mansions" },
  { id: "cm8hoc4ka0008g6fsh65wil4g", name: "Single Rooms" }
];

// Common address template
const addressTemplate = {
  street: "Dignissimos sed debi",
  city: "Doloribus pariatur ",
  state: "Veritatis voluptatem",
  postalCode: "Proident facilis vo",
  country: "Illo assumenda volup",
  neighborhood: "Animi nostrum et ci",
  isExactLocation: true
};

// Host ID to use for all properties
const hostId = "cm8hk90xg0000g6fsmdrkktw1";

// Function to get random images
function getRandomImages(count = 5) {
  return getRandomItems(imageUrls, count);
}

// Function to generate latitude and longitude with slight variations
function generateCoordinates() {
  // Base coordinates from the template
  const baseLat = 40.72634000673465;
  const baseLng = -73.95481109619142;
  
  // Add small random variations (±0.05 degrees)
  const latVariation = (Math.random() - 0.5) * 0.1;
  const lngVariation = (Math.random() - 0.5) * 0.1;
  
  return {
    latitude: baseLat + latVariation,
    longitude: baseLng + lngVariation
  };
}

// Main seed function
async function seedProperties() {
  console.log("Starting to seed properties...");
  
  try {
    // Process each category separately
    for (const category of categories) {
      console.log(`Creating properties for category: ${category.name}`);
      
      // Get titles for this category
      const titles = (propertyTitlesByCategoryId as Record<string, string[]>)[category.id] || [];
      
      // Create 16 properties for this category
      for (let i = 0; i < 16; i++) {
        try {
          // Get a title or generate a generic one if not enough titles
          const title = titles[i] || `${category.name} Property ${i + 1}`;
          
          // Create the property
          const property = await createProperty(category.id, title, i);
          console.log(`Created property: ${property.title} (${property.id})`);
          
          // Add a small delay between operations to avoid overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error creating property ${i + 1} for category ${category.name}:`, error);
          // Continue with the next property even if one fails
        }
      }
      
      console.log(`Completed seeding for category: ${category.name}`);
    }
    
    console.log("All properties seeded successfully!");
  } catch (error) {
    console.error("Error seeding properties:", error);
    throw error;
  }
}

async function createProperty(categoryId: string, title: string, index: number) {
  // Generate random data for this property
  const bedrooms = getRandomInt(1, 5);
  const beds = getRandomInt(bedrooms, bedrooms + 2);
  const bathrooms = getRandomDecimal(1, 3, 1);
  const maxGuests = getRandomInt(beds, beds * 2);
  const basePrice = getRandomInt(50, 500);
  const cleaningFee = getRandomInt(20, 100);
  const serviceFee = getRandomInt(10, 50);
  const taxRate = getRandomDecimal(5, 15, 1);
  
  // Get random coordinates
  const coordinates = generateCoordinates();
  
  // Create the property
  const property = await db.property.create({
    data: {
      title,
      slug: generateUniqueSlug(title),
      description: propertyDescriptions[Math.floor(Math.random() * propertyDescriptions.length)],
      shortDescription: shortDescriptions[Math.floor(Math.random() * shortDescriptions.length)],
      propertyStyle: getRandomPropertyStyles(),
      categoryId,
      hostId,
      images: getRandomImages(5),
      amenities: getRandomAmenities(),
      maxGuests,
      bedrooms,
      beds,
      bathrooms,
      address: {
        create: {
          ...addressTemplate,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }
      },
      pricing: {
        create: {
          basePrice,
          cleaningFee,
          serviceFee,
          taxRate,
          weeklyDiscount: getRandomInt(0, 15),
          monthlyDiscount: getRandomInt(10, 30),
          currency: "USD"
        }
      },
      bookingSettings: {
        create: {
          instantBooking: getRandomBoolean(0.7),
          minStay: getRandomInt(1, 3),
          maxStay: getRandomInt(14, 90),
          checkInTime: "15:00",
          checkOutTime: "11:00",
          allowChildren: getRandomBoolean(0.9),
          allowInfants: getRandomBoolean(0.95),
          allowPets: getRandomBoolean(0.4),
          allowSmoking: getRandomBoolean(0.1),
          allowParties: getRandomBoolean(0.05),
          cancellationPolicy: ["FLEXIBLE", "MODERATE", "STRICT"][Math.floor(Math.random() * 3)],
          advanceBookingWindow: getRandomInt(180, 365)
        }
      },
      isPublished: true,
      isFeatured: getRandomBoolean(0.2)
    }
  });
  
  return property;
}
seedProperties()
  .catch((e) => {
    console.error("Failed to seed properties:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });