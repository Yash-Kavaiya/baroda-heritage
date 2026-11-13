export const COLLECTIONS = [
  { id: "all", label: "All places" },
  { id: "heritage", label: "Royal heritage" },
  { id: "sacred", label: "Sacred spaces" },
  { id: "nature", label: "Outdoors" },
];

const DETAILS = {
  "khanderao-market": {
    name: "Khanderao Market",
    collection: "heritage",
    label: "Civic heritage",
    area: "Old city",
    blurb:
      "A grand civic landmark where domes, arches and the everyday life of Baroda meet.",
  },
  "baroda-museum": {
    name: "Baroda Museum",
    collection: "heritage",
    label: "Art & history",
    area: "Sayaji Baug",
    blurb:
      "A world of art and natural history, tucked into the green heart of the city.",
  },
  "laxmi-vilas-palace": {
    name: "Laxmi Vilas Palace",
    collection: "heritage",
    label: "Royal heritage",
    area: "J. N. Marg",
    blurb:
      "A royal residence. An architectural wonder. A little glimpse into the world of the Gaekwads.",
  },
  "sursagar-lake": {
    name: "Sursagar Lake",
    collection: "nature",
    label: "Lakeside landmark",
    area: "Old city",
    blurb:
      "The old city slows down at the water’s edge, beneath the watchful presence of Sarveshwar Mahadev.",
  },
  "sayaji-baug": {
    name: "Sayaji Baug",
    collection: "nature",
    label: "Gardens & culture",
    area: "Sayajigunj",
    blurb:
      "A green escape in the heart of Baroda. Discover its floral clock, tree-lined paths and playful toy train.",
  },
  "kirti-mandir": {
    name: "Kirti Mandir",
    collection: "sacred",
    label: "Royal memorial",
    area: "Vishwamitri riverbank",
    blurb:
      "A quiet tribute to the Gaekwad dynasty, where a graceful stone spire rises above peaceful courtyards.",
  },
  "nyay-mandir": {
    name: "Nyay Mandir",
    collection: "heritage",
    label: "Civic heritage",
    area: "Mandvi",
    blurb:
      "The Temple of Justice brings grand arches and a distinctive historic silhouette to the old city.",
  },
  "eme-temple": {
    name: "EME Temple",
    collection: "sacred",
    label: "Sacred architecture",
    area: "Fatehgunj",
    blurb:
      "An unexpected silver dome, peaceful gardens and a meeting of architectural traditions.",
  },
  "pavagadh-champaner": {
    name: "Champaner–Pavagadh",
    collection: "sacred",
    label: "Beyond the city",
    area: "Panchmahal · day trip",
    blurb:
      "Beyond Vadodara, a sacred hill and a UNESCO-listed archaeological landscape invite a different kind of discovery.",
  },
};

export function getPlaceDetails(place) {
  return (
    DETAILS[place.id] ?? {
      name: place.name,
      collection: "heritage",
      label: place.category,
      area: "Vadodara",
      blurb: place.tagline,
    }
  );
}

export function filterPlaces(
  places,
  { collection = "all", query = "", savedOnly = false, savedIds = [] } = {},
) {
  const search = query.trim().toLocaleLowerCase();
  return places.filter((place) => {
    const details = getPlaceDetails(place);
    return (
      (collection === "all" || details.collection === collection) &&
      (!savedOnly || savedIds.includes(place.id)) &&
      (!search ||
        [
          place.name,
          place.gujaratiName,
          place.category,
          details.name,
          details.area,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(search))
    );
  });
}

export function parseSavedPlaces(raw, places) {
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const validIds = new Set(places.map((place) => place.id));
    return [
      ...new Set(
        value.filter((id) => typeof id === "string" && validIds.has(id)),
      ),
    ];
  } catch {
    return [];
  }
}
