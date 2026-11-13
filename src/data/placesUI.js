// UI-only data for the Explore Vadodara places page
// Maps to VADODARA_PLACES ids in src/data/places.js

export const PLACE_IMAGES = {
  "sursagar-lake": "/previews/sursagar-lake.webp",
  "eme-temple": "/previews/eme-temple.webp",
  "laxmi-vilas-palace": "/previews/laxmi-vilas-palace.webp",
  "sayaji-baug": "/previews/sayaji-baug.webp",
  "khanderao-market": "/previews/khanderao-market.webp",
  "pavagadh-champaner": "/previews/pavagadh-champaner.webp",
  "kirti-mandir": "/previews/kirti-mandir.webp",
  "baroda-museum": "/previews/baroda-museum.webp",
  "nyay-mandir": "/previews/nyay-mandir.webp",
};

export const PLACE_RATINGS = {
  "sursagar-lake": 4.4,
  "eme-temple": 4.5,
  "laxmi-vilas-palace": 4.6,
  "sayaji-baug": 4.3,
  "khanderao-market": 4.2,
  "pavagadh-champaner": 4.5,
  "kirti-mandir": 4.4,
  "baroda-museum": 4.3,
  "nyay-mandir": 4.3,
};

export const PLACE_FILTER_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "landmarks", label: "Landmarks & Architecture" },
  { id: "spiritual", label: "Spiritual & Religious" },
  { id: "parks-gardens", label: "Parks & Gardens" },
  { id: "art-culture", label: "Art, Museums & Culture" },
  { id: "markets-heritage", label: "Markets & Heritage" },
  { id: "forts-ruins", label: "Forts & Ruins" },
];

// Map each place id to the filter category ids it belongs to
export const PLACE_CATEGORIES = {
  "laxmi-vilas-palace": ["landmarks", "art-culture"],
  "sursagar-lake": ["landmarks", "spiritual"],
  "eme-temple": ["spiritual"],
  "sayaji-baug": ["parks-gardens", "landmarks"],
  "khanderao-market": ["markets-heritage", "landmarks"],
  "pavagadh-champaner": ["forts-ruins", "spiritual"],
  "kirti-mandir": ["art-culture", "spiritual"],
  "nyay-mandir": ["landmarks"],
  "baroda-museum": ["art-culture"],
};
