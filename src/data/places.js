export const VADODARA_PLACES = [
  {
    id: "laxmi-vilas-palace",
    filterCategories: ["landmarks", "art-culture"],
    name: "Laxmi Vilas Palace",
    gujaratiName: "લક્ષ્મી વિલાસ પેલેસ",
    category: "Royal Heritage",
    builtYear: "1890",
    patron: "Maharaja Sayajirao Gaekwad III",
    architect: "Major Charles Mant & Robert Fellowes Chisholm",
    style: "Indo-Saracenic Revival",
    tagline: "Four times the size of Buckingham Palace, the grandest residence in Gujarat",
    overview:
      "Commissioned by Maharaja Sayajirao Gaekwad III in 1890, Laxmi Vilas Palace remains one of the world's largest private residences—nearly four times the size of London's Buckingham Palace. Spread over 500 sprawling acres, it blends Indian Mughal, Rajput, and Gujarati traditions with European Gothic, Byzantine, and Venetian architecture.",
    highlights: [
      "Darbar Hall features an exquisite Venetian mosaic floor, Belgian stained glass windows, and Italian marble statues.",
      "A towering 300-foot clock tower with a working clock whose red light signaled the Maharaja's presence.",
      "Houses the private collection of master painter Raja Ravi Varma, who served as court artist to the Gaekwads.",
      "Boasts early 1890s passenger elevators installed by Otis, central European cooling channels, and royal golf courses."
    ],
    hotspots: [
      { id: "clock-tower", name: "Grand Clock Tower", desc: "Soaring multi-tiered tower with British mechanism and royal beacon spire", position: [0, 8.5, 0] },
      { id: "darbar-dome", name: "Central Indo-Saracenic Dome", desc: "Magnificent ribbed cupola with Rajasthani jharokhas and arched clerestories", position: [-3, 6, 0] },
      { id: "royal-fountain", name: "Italian Marble Fountain", desc: "Carved tiered fountain with sculpted water jets on the palace forecourt", position: [0, 0.8, 6] },
      { id: "palace-arcade", name: "Red Sandstone Colonnade", desc: "Pointed cusped arches crafted from Agra sandstone and local Songadh stone", position: [4, 2.5, 2] }
    ],
    cameraPresets: {
      overview: { pos: [0, 11, 28], target: [0, 5, 0] },
      dramatic: { pos: [-16, 6, 18], target: [0, 5, 0] },
      aerial: { pos: [0, 28, 22], target: [0, 2, 0] },
      closeup: { pos: [0, 3.2, 12], target: [0, 4, 0] }
    },
    specs: {
      area: "500+ Acres",
      height: "300 ft Clock Tower",
      rooms: "170+ Royal Chambers",
      currentResident: "HRH Samarjitsinh Gaekwad & Royal Family"
    },
    timings: "10:00 AM – 5:00 PM (Closed Mondays)",
    location: "Gate No. 2, J.N. Marg, Vadodara",
    distanceFromStation: "3.2 km (10 mins drive)",
    colorTheme: "#d4af37"
  },
  {
    id: "sursagar-lake",
    filterCategories: ["landmarks", "spiritual"],
    name: "Sursagar Lake & Golden Shiva",
    gujaratiName: "સુરસાગર તળાવ અને સર્વેશ્વર મહાદેવ",
    category: "Spiritual & Civic Landmark",
    builtYear: "18th Century / 2002 (Statue)",
    patron: "Gaekwad Dynasty & Vadodara Mahanagar Seva Sadan",
    architect: "Traditional Stepped Ghats & Modern Sculptors",
    style: "Sacred Water Architecture & Modern Iconography",
    tagline: "The heart of the old walled city, guarded by the 111-foot gilded Sarveshwar Mahadev",
    overview:
      "Formerly known as Chand Talao, Sursagar Lake sits in the vibrant geographic heart of Vadodara. In 2002, a colossal 111-foot-tall Lord Shiva statue (Sarveshwar Mahadev) was consecrated in the center of the waters, later electroplated with dazzling pure gold. Surrounded by stone ghats, temples, and bustling city streets, it is the focal point of Vadodara's legendary Maha Shivratri and Ganesh Visarjan celebrations.",
    highlights: [
      "The 111-foot gilded idol stands gracefully above the water surface with Trishul, Damru, and flowing Ganga locks.",
      "Water level is maintained year-round by an ancient masonry overflow sluice draining into the Vishwamitri River.",
      "Night illumination features underwater spotlights and perimeter LED floodlights that turn the water into liquid gold.",
      "Surrounded by historic landmarks like Nyay Mandir, Lehripura Gate, and traditional Gujarati street food havelis."
    ],
    hotspots: [
      { id: "shiva-statue", name: "111-ft Sarveshwar Mahadev", desc: "Golden statue holding the sacred Trishul with blessing Abhaya Mudra", position: [0, 6.5, 0] },
      { id: "pedestal", name: "Lotus Plinth & Central Island", desc: "Stepped stone foundation anchored securely in the lake bedrock", position: [0, 1.2, 0] },
      { id: "ghat-steps", name: "Historical Embankment Ghats", desc: "Carved stone stairs and wrought iron balustrades for evening strolls", position: [0, 0.4, 9] },
      { id: "night-lanterns", name: "Illumination Sconces", desc: "Heritage street lanterns that cast vibrant reflections on the ripples", position: [8, 1, 0] }
    ],
    cameraPresets: {
      overview: { pos: [0, 10, 20], target: [0, 5, 0] },
      dramatic: { pos: [12, 4, 12], target: [0, 6, 0] },
      aerial: { pos: [0, 22, 14], target: [0, 2, 0] },
      closeup: { pos: [0, 7.5, 7], target: [0, 7, 0] }
    },
    specs: {
      depth: "Over 25 feet",
      circumference: "1.2 km Perimeter",
      statueHeight: "111 Feet (Gold Plated)",
      significance: "Maha Shivratri Maha Aarti Hub"
    },
    timings: "Open 24/7 (Golden light show at dusk)",
    location: "City Center, Mandvi Gate Road, Vadodara",
    distanceFromStation: "2.1 km (7 mins drive)",
    colorTheme: "#f59e0b"
  },
  {
    id: "sayaji-baug",
    filterCategories: ["parks-gardens", "landmarks"],
    name: "Sayaji Baug & Floral Clock",
    gujaratiName: "સયાજી બાગ અને ફ્લોરલ ક્લોક",
    category: "Botanical Heritage & Science",
    builtYear: "1879",
    patron: "Maharaja Sayajirao Gaekwad III",
    architect: "William Goldring (Kew Gardens Botanist)",
    style: "Victorian Landscape & Public Park",
    tagline: "A 113-acre green paradise featuring India's most famous mechanical floral clock",
    overview:
      "Dedicated to the citizens of Vadodara in 1879 by Maharaja Sayajirao Gaekwad III, Sayaji Baug (popularly known as Kamati Baug) spans 113 acres along the Vishwamitri River. Its crown jewel is the 20-foot wide functioning Floral Clock, whose machinery runs underground while flowering bushes form the clock face and numerals. The park also hosts a zoo, the Sardar Patel Planetarium, and a vintage heritage toy train.",
    highlights: [
      "The working 20-foot Floral Clock features an underground Swiss mechanism with flowers pruned to form dial numerals.",
      "Sayaji Baug Toy Train runs on a 3.5 km narrow-gauge track, gifted to children of Baroda by the Maharaja.",
      "Houses the Baroda Museum and Picture Gallery (1894) with a 22-meter blue whale skeleton and Egyptian mummy.",
      "Botanical collection features over 98 species of trees, royal marble statues, and lush rose gardens."
    ],
    hotspots: [
      { id: "floral-clock", name: "Mechanical Floral Clock", desc: "Underground geared clockwork driving giant floral minute and hour hands", position: [0, 1.2, 0] },
      { id: "toy-train", name: "Sayaji Toy Train", desc: "Iconic vintage narrow-gauge engine chugging along the garden loop", position: [6, 0.6, 2] },
      { id: "planetarium", name: "Sardar Patel Planetarium", desc: "Geodesic celestial dome offering shows on cosmic wonders", position: [-5, 2.2, -4] },
      { id: "canopy-trees", name: "Centennial Banyan & Jacarandas", desc: "Ancient leafy canopy providing shade to morning joggers and visitors", position: [-4, 3, 4] }
    ],
    cameraPresets: {
      overview: { pos: [0, 11, 18], target: [0, 1.5, 0] },
      dramatic: { pos: [10, 4, 10], target: [0, 1, 0] },
      aerial: { pos: [0, 20, 12], target: [0, 0, 0] },
      closeup: { pos: [0, 2.5, 5], target: [0, 1, 0] }
    },
    specs: {
      area: "113 Acres (Largest in Western India)",
      floraSpecies: "98+ Botanical Varieties",
      clockDiameter: "20 Feet (Functioning)",
      trainTrack: "3.5 km Loop"
    },
    timings: "5:00 AM – 11:00 PM Daily",
    location: "Kala Ghoda Circle, Sayajiganj, Vadodara",
    distanceFromStation: "1.0 km (Walking distance)",
    colorTheme: "#10b981"
  },
  {
    id: "kirti-mandir",
    filterCategories: ["art-culture", "spiritual"],
    name: "Kirti Mandir (Temple of Fame)",
    gujaratiName: "કીર્તિ મંદિર (ટેમ્પલ ઓફ ફેમ)",
    category: "Gaekwad Cenotaph & Art",
    builtYear: "1936",
    patron: "Maharaja Sayajirao Gaekwad III",
    architect: "V.R. Talwalkar",
    style: "Hindu-Nagara Temple & Maratha Memorial",
    tagline: "The golden sun-crested memorial celebrating 60 glorious years of Gaekwad rule",
    overview:
      "Constructed in 1936 to commemorate the Diamond Jubilee of Maharaja Sayajirao Gaekwad III, Kirti Mandir ('Temple of Fame') is an 'E'-shaped stone cenotaph standing on the western bank of the Vishwamitri River. Its 35-meter central shikhara is adorned with bronze motifs of the sun, the crescent moon, and the globe, while inside lie stunning frescoes painted by legendary artist Nandalal Bose depicting Mahabharata and Indian epics.",
    highlights: [
      "The 35-meter stone shikhara is crowned by a golden globe and sun emblem symbolizing eternal fame.",
      "Interior walls house magnificent murals by Bengal School master Nandalal Bose, including Gangavataran.",
      "Contains statues, marble busts, and photographic archives of the Gaekwad rulers from Pilajirao to Sayajirao III.",
      "E-shaped architectural layout creates serene open courtyards facing the Vishwamitri River breeze."
    ],
    hotspots: [
      { id: "central-shikhara", name: "Sun-Crested Shikhara", desc: "35m Nagara-style stone tower crowned with bronze sun and earth finial", position: [0, 7.8, 0] },
      { id: "fresco-hall", name: "Nandalal Bose Murals Hall", desc: "Vaulted galleries preserving timeless tempera paintings of Indian mythology", position: [-3, 2.5, 1] },
      { id: "cenotaph-arch", name: "Memorial Colonnade", desc: "Intricately carved stone pillars, chhatris, and traditional jali screens", position: [3, 2, 2] },
      { id: "river-plinth", name: "Vishwamitri Riverbank Plinth", desc: "Elevated stone terrace protecting the heritage site from monsoon tides", position: [0, 0.5, 6] }
    ],
    cameraPresets: {
      overview: { pos: [0, 9, 19], target: [0, 4, 0] },
      dramatic: { pos: [-11, 4.5, 11], target: [0, 4, 0] },
      aerial: { pos: [0, 21, 15], target: [0, 2, 0] },
      closeup: { pos: [0, 3, 7], target: [0, 4, 0] }
    },
    specs: {
      towerHeight: "35 Metres (115 Feet)",
      shape: "E-Shaped Memorial Layout",
      keyArt: "Nandalal Bose Frescoes",
      dedication: "Sayajirao III Diamond Jubilee"
    },
    timings: "9:00 AM – 6:00 PM (Free Entry)",
    location: "Kirti Mandir Road, Babajipura, Vadodara",
    distanceFromStation: "1.8 km (6 mins drive)",
    colorTheme: "#e11d48"
  },
  {
    id: "nyay-mandir",
    filterCategories: ["landmarks"],
    name: "Nyay Mandir (Temple of Justice)",
    gujaratiName: "ન્યાય મંદિર (જસ્ટિસ પેલેસ)",
    category: "Heritage Judicial Architecture",
    builtYear: "1896",
    patron: "Maharaja Sayajirao Gaekwad III",
    architect: "Robert Fellowes Chisholm",
    style: "Indo-Saracenic & Byzantine Gothic",
    tagline: "Vadodara's historic High Court with breathtaking rose windows and clock tower",
    overview:
      "Nyay Mandir, or the 'Temple of Justice', was built in 1896 by Sayajirao III in memory of his beloved first wife, Maharani Chimnabai I. Designed by royal architect Robert Fellowes Chisholm, this Indo-Saracenic marvel served as the District & Sessions Court of Baroda for over a century. Overlooking Sursagar Lake, its facade features exquisite pointed Gothic arches, Italian mosaic floors, and a regal marble statue of Maharani Chimnabai.",
    highlights: [
      "Designed by Robert Fellowes Chisholm, pioneer of Indo-Saracenic fusion architecture in India.",
      "Central clock tower with intricate stone balustrades and Byzantine rose-window motifs.",
      "The grand central courtroom hall served as the supreme legislative and judicial venue of Baroda State.",
      "Flanked by historic spice markets, Mandvi gate, and the iconic Sursagar lakefront promenade."
    ],
    hotspots: [
      { id: "clock-pediment", name: "Judicial Clock Gable", desc: "Gothic gable flanked by carved turrets and Roman-numeral mechanical clock", position: [0, 7.5, 0] },
      { id: "rose-window", name: "Byzantine Rose Window", desc: "Detailed stone traceries capturing natural sunlight into the high court chamber", position: [0, 4.5, 1.2] },
      { id: "court-colonnade", name: "Two-Tier Pointed Arches", desc: "Sturdy sandstone arcades combining Islamic cusps with Gothic rib vaults", position: [4, 2.5, 0] },
      { id: "chimnabai-statue", name: "Maharani Chimnabai I Plinth", desc: "Memorial marble plinth honoring the benevolent queen of Baroda", position: [0, 0.8, 5] }
    ],
    cameraPresets: {
      overview: { pos: [0, 9, 19], target: [0, 3.5, 0] },
      dramatic: { pos: [12, 4, 11], target: [0, 4, 0] },
      aerial: { pos: [0, 20, 14], target: [0, 2, 0] },
      closeup: { pos: [0, 3, 7], target: [0, 3.5, 0] }
    },
    specs: {
      completed: "1896 (Inaugurated by Lord Elgin)",
      floors: "3 Palatial Judicial Floors",
      facadeMaterial: "Songadh Sandstone & Brick",
      legacy: "Baroda State High Court"
    },
    timings: "Exterior views 24/7; Heritage tours on selected days",
    location: "Opposite Sursagar Lake, Mandvi, Vadodara",
    distanceFromStation: "2.4 km (8 mins drive)",
    colorTheme: "#0284c7"
  },
  {
    id: "eme-temple",
    filterCategories: ["spiritual"],
    name: "EME Temple (Dakshinamurti)",
    gujaratiName: "ઇ.એમ.ઇ. મંદિર (દક્ષિણામૂર્તિ)",
    category: "Modernist Sacred Architecture",
    builtYear: "1966",
    patron: "Indian Army (Corps of EME)",
    architect: "EME Military Engineers",
    style: "Geodesic Aluminum Dome & Secular Synthesis",
    tagline: "The world's only aluminum-clad geodesic temple representing unity of all faiths",
    overview:
      "Built by the Electrical and Mechanical Engineers (EME) Corps of the Indian Army in 1966, this temple dedicated to Lord Shiva as Dakshinamurti is architecturally unique on the planet. Its dome is constructed entirely of aluminum sheets arranged in a geodesic lattice. The temple incorporates architectural symbols of five major world religions—Kalash (Hinduism), Geodesic Dome (Islam), Tower Spire (Christianity), Golden Finial (Buddhism), and Entrance Arch (Jainism)—representing harmony and service.",
    highlights: [
      "Geodesic dome built entirely with lightweight aircraft-grade aluminum alloy sheets.",
      "Symbolic architecture harmonizing elements of Hinduism, Islam, Christianity, Jainism, and Buddhism.",
      "Houses an ancient 7th-century basalt stone idol of Lord Shiva facing south (Dakshinamurti).",
      "Surrounded by an outdoor sculpture museum with 106 heritage stone statues from 6th to 16th century Gujarat."
    ],
    hotspots: [
      { id: "geodesic-dome", name: "Aluminum Geodesic Dome", desc: "Futuristic faceted metallic lattice structure shimmering under the Gujarat sun", position: [0, 4.5, 0] },
      { id: "golden-kalash", name: "Unified Golden Finial", desc: "Crown spire blending Hindu kalash, Buddhist stupa, and Christian cross symbolism", position: [0, 7.5, 0] },
      { id: "statue-garden", name: "Ancient Sculpture Park", desc: "Open-air sanctuary preserving priceless archaeological stone sculptures", position: [4.5, 0.8, 3] },
      { id: "cantonment-gardens", name: "Manicured Military Lawns", desc: "Pristine green grounds maintained impeccably by Indian Army personnel", position: [-4, 0.4, 4] }
    ],
    cameraPresets: {
      overview: { pos: [0, 8, 18], target: [0, 3, 0] },
      dramatic: { pos: [-11, 4, 11], target: [0, 3.5, 0] },
      aerial: { pos: [0, 19, 14], target: [0, 1, 0] },
      closeup: { pos: [0, 3, 6], target: [0, 3.5, 0] }
    },
    specs: {
      materials: "Aviation-Grade Aluminum & Granite",
      domeType: "Geodesic Polyhedral Dome",
      uniqueTrait: "Incorporates 5 World Religions",
      surroundingPark: "106 Ancient Sculptures"
    },
    timings: "6:30 AM – 8:30 PM (Army ID/Valid Gov ID requested at gate)",
    location: "EME Military Cantonment, Fatehgunj, Vadodara",
    distanceFromStation: "4.5 km (12 mins drive)",
    colorTheme: "#8b5cf6"
  },
  {
    id: "pavagadh-champaner",
    filterCategories: ["forts-ruins", "spiritual"],
    name: "Champaner-Pavagadh UNESCO Hill",
    gujaratiName: "ચાંપાનેર-પાવાગઢ યુનેસ્કો હેરિટેજ",
    category: "UNESCO World Heritage & Sacred Peak",
    builtYear: "8th – 16th Century",
    patron: "Chauhan Rajputs & Sultan Mahmud Begada",
    architect: "Pre-Mughal Indo-Islamic Masters",
    style: "Fortified Hill Architecture & Stepwells",
    tagline: "Towering 800m volcanic peak, Kalika Mata temple & world-famous cable car ropeway",
    overview:
      "Located just 45 minutes from Vadodara city, Champaner-Pavagadh is Gujarat's premier UNESCO World Heritage Site. Rising dramatically 800 meters from the plains, the extinct volcanic hill of Pavagadh is crowned by the sacred Mahakali temple. Modern visitors ascend via the thrilling 'Maa Mahakalika Udankhatola' ropeway cable car, soaring above medieval bastions, stone gates, and ancient monsoon water tanks.",
    highlights: [
      "Gujarat's only completely unexcavated medieval Hindu-Muslim historic city from the 16th century.",
      "The Pavagadh Ropeway (Udankhatola) carries thousands daily to Machi and the upper cliffs in panoramic cabins.",
      "Kalika Mata Temple atop the summit pinnacle has been a pilgrimage site for over a thousand years.",
      "Features spectacular monuments like the Jama Masjid with 172 carved pillars, Atak Gate, and helical stepwells."
    ],
    hotspots: [
      { id: "temple-summit", name: "Kalika Mata Summit Shrine", desc: "Red-and-gold flag fluttering atop the highest rocky pinnacle of Gujarat", position: [0, 8.5, -2] },
      { id: "cable-car", name: "Pavagadh Ropeway (Udankhatola)", desc: "Cable car cabins carrying travelers high across sheer vertical cliffs", position: [3, 4.5, 2] },
      { id: "ancient-fortress", name: "Machi Plateau Bastions", desc: "Medieval fortified walls built from local volcanic breccia stone", position: [-3, 2.5, 1] },
      { id: "volcanic-crags", name: "Pavagadh Volcanic Ridge", desc: "Geological formation dating back over 500 million years", position: [0, 1.5, 4] }
    ],
    cameraPresets: {
      overview: { pos: [0, 10, 22], target: [0, 4, 0] },
      dramatic: { pos: [14, 5, 12], target: [0, 5, 0] },
      aerial: { pos: [0, 24, 16], target: [0, 3, 0] },
      closeup: { pos: [0, 5, 8], target: [0, 6, 0] }
    },
    specs: {
      elevation: "800 Metres (2,600 Feet)",
      unescoStatus: "Inscribed in 2004",
      cableCarSpan: "763 Metres Length",
      distanceFromBaroda: "45 km (45 mins drive)"
    },
    timings: "Ropeway: 6:00 AM – 7:00 PM; Temple open till night",
    location: "Pavagadh Hill, Panchmahal (Vadodara Metropolitan Gateway)",
    distanceFromStation: "45 km via Halol Highway",
    colorTheme: "#ea580c"
  },
  {
    id: "khanderao-market",
    filterCategories: ["markets-heritage"],
    name: "Khanderao Market",
    gujaratiName: "ખંડેરાવ માર્કેટ",
    category: "Civic & Commercial Heritage",
    builtYear: "1906",
    patron: "Maharaja Sayajirao Gaekwad III",
    architect: "Robert Fellowes Chisholm",
    style: "Indo-Saracenic & Municipal Gothic",
    tagline: "A palatial civic gift housing Vadodara's grandest clock tower and historic bazaar",
    overview:
      "Gifted to the citizens of Vadodara in 1906 by Maharaja Sayajirao Gaekwad III to mark his Silver Jubilee, Khanderao Market was named after Maharaja Khanderao Gaekwad. Built in the lavish Indo-Saracenic style with local Songadh sandstone and red brick, the palatial structure houses the head offices of the Vadodara Municipal Corporation (VMC) and a vibrant, bustling daily market filled with seasonal flowers, spices, and fresh produce.",
    highlights: [
      "Majestic central clock tower inspired by European town halls, featuring an authentic English pendulum mechanism.",
      "Grand entrance archway decorated with royal Gaekwad emblems and intricately carved stone jali balconies.",
      "The expansive inner courtyard hosts Baroda's most vibrant traditional flower and spice bazaar since 1906.",
      "Headquarters of the Vadodara Municipal Corporation (VMC), blending administration with civic heritage."
    ],
    hotspots: [
      { id: "clock-tower", name: "Municipal Clock Tower", desc: "Monumental red-brick tower with 4-faced Roman clock dial and ornate cupola", position: [0, 8.5, 0] },
      { id: "main-arcade", name: "Triple-Arch Portal", desc: "Soaring entrance arcade combining Islamic pointed cusps with Gothic rib vaults", position: [0, 2.5, 3.5] },
      { id: "flower-market", name: "Historic Flower Courtyard", desc: "Bustling bazaar scented with fresh marigolds, roses, and Gujarati spices", position: [0, 0.8, -4] },
      { id: "corner-turrets", name: "Octagonal Chhatris", desc: "Ornate domed corner pavilions topped with brass kalash finials", position: [-8, 5.2, 0] }
    ],
    cameraPresets: {
      overview: { pos: [0, 11, 26], target: [0, 4.5, 0] },
      dramatic: { pos: [-14, 5, 16], target: [0, 5, 0] },
      aerial: { pos: [0, 26, 18], target: [0, 2, 0] },
      closeup: { pos: [0, 3.5, 10], target: [0, 4, 0] }
    },
    specs: {
      inaugurated: "1906 (Silver Jubilee Gift)",
      occupant: "Vadodara Municipal Corporation (VMC)",
      facade: "Songadh Sandstone & Terracotta",
      bazaar: "Active Daily Wholesale Bazaar"
    },
    timings: "Market: 6:00 AM – 9:00 PM; Offices: 10:30 AM – 6:00 PM",
    location: "Palace Road, Kevdabaug, Vadodara",
    distanceFromStation: "2.6 km (8 mins drive)",
    colorTheme: "#c2410c"
  },
  {
    id: "baroda-museum",
    filterCategories: ["art-culture"],
    name: "Baroda Museum & Picture Gallery",
    gujaratiName: "વડોદરા મ્યુઝિયમ અને પિક્ચર ગેલેરી",
    category: "Art & Scientific Heritage",
    builtYear: "1894",
    patron: "Maharaja Sayajirao Gaekwad III",
    architect: "Major R.N. Mant & R.F. Chisholm",
    style: "Indo-Saracenic & Victorian Brick",
    tagline: "Modeled on London's V&A Museum, housing a 22-meter blue whale skeleton and Raja Ravi Varma masterpieces",
    overview:
      "Founded in 1894 by Maharaja Sayajirao Gaekwad III, the Baroda Museum and Picture Gallery stands proudly within Sayaji Baug. Modeled after London's Victoria & Albert Museum and the Science Museum, it houses one of South Asia's greatest encyclopedic collections—including an authentic 22-meter blue whale skeleton, an Egyptian mummy from 250 BC, Mughal miniatures, and rare original European and Indian masterworks by court artist Raja Ravi Varma.",
    highlights: [
      "The awe-inspiring 22-meter skeleton of a blue whale washed ashore in Gujarat in 1972.",
      "A 2,500-year-old genuine Egyptian mummy acquired personally by the Maharaja.",
      "The Picture Gallery preserves original oil masterpieces by Raja Ravi Varma and European Renaissance masters.",
      "Two majestic Indo-Saracenic red-brick buildings connected by a covered ornamental bridge over lush gardens."
    ],
    hotspots: [
      { id: "whale-gallery", name: "22m Blue Whale Skeleton Hall", desc: "Colossal marine mammal skeleton suspended gracefully in the central natural history gallery", position: [0, 2.2, 0] },
      { id: "museum-facade", name: "Victorian Brick Pediment", desc: "Elaborate red-brick facade with stone quoins and English sash arched windows", position: [0, 5.5, 2.5] },
      { id: "picture-bridge", name: "Connecting Gallery Bridge", desc: "Ornamental covered passage connecting the science museum to the fine arts gallery", position: [5.5, 3.2, 0] },
      { id: "ravi-varma-wing", name: "Raja Ravi Varma Art Wing", desc: "Dedicated hall displaying original Gaekwad royal court portraits and mythological canvasses", position: [-5, 2.5, 0] }
    ],
    cameraPresets: {
      overview: { pos: [0, 10, 24], target: [0, 3.5, 0] },
      dramatic: { pos: [14, 5, 14], target: [0, 4, 0] },
      aerial: { pos: [0, 24, 16], target: [0, 2, 0] },
      closeup: { pos: [0, 3.2, 8], target: [0, 3, 0] }
    },
    specs: {
      founded: "1894 by Sayajirao Gaekwad III",
      keyRelic: "22-meter Blue Whale Skeleton",
      artCollection: "Raja Ravi Varma Original Oils",
      mummy: "Egyptian Mummy (c. 250 BC)"
    },
    timings: "10:30 AM – 5:00 PM (Closed Government Holidays)",
    location: "Inside Sayaji Baug, Kala Ghoda, Vadodara",
    distanceFromStation: "1.2 km (5 mins drive)",
    colorTheme: "#0d9488"
  }
];

export const VADODARA_QUIZ = [
  {
    question: "How large is Vadodara's Laxmi Vilas Palace compared to London's Buckingham Palace?",
    options: [
      "About the same size",
      "Nearly four times the size",
      "Two times smaller",
      "Ten times larger"
    ],
    answerIndex: 1,
    explanation: "Laxmi Vilas Palace is widely celebrated as one of the world's largest private residences, sprawling over 500 acres and roughly 4 times larger than Buckingham Palace!"
  },
  {
    question: "What is the height of the magnificent golden Lord Shiva statue standing inside Sursagar Lake?",
    options: [
      "51 feet",
      "84 feet",
      "111 feet",
      "182 feet"
    ],
    answerIndex: 2,
    explanation: "Sarveshwar Mahadev at Sursagar stands at an imposing 111 feet and is electroplated with pure gold, sparkling over the lake waters."
  },
  {
    question: "Who was the legendary visionary ruler who modernized Baroda and built Laxmi Vilas Palace, Sayaji Baug & Nyay Mandir?",
    options: [
      "Maharaja Sayajirao Gaekwad III",
      "Maharaja Pratapsinhrao Gaekwad",
      "Pilajirao Gaekwad",
      "Damajirao Gaekwad"
    ],
    answerIndex: 0,
    explanation: "Maharaja Sayajirao Gaekwad III (1863–1939) was the transformative ruler who introduced free compulsory education, libraries, museums, and commissioned Baroda's iconic architectural gems."
  },
  {
    question: "What is the unique architectural feature of the EME Temple (Dakshinamurti) in Vadodara?",
    options: [
      "Built entirely from carved teakwood",
      "An aircraft-grade aluminum geodesic dome uniting symbols of 5 religions",
      "Carved out of a single monolithic marble rock",
      "Made entirely of stained glass from Belgium"
    ],
    answerIndex: 1,
    explanation: "Built by the Indian Army's EME Corps, it features an aluminum geodesic dome and incorporates sacred architectural motifs from Hinduism, Islam, Christianity, Jainism, and Buddhism."
  },
  {
    question: "Why is Sayaji Baug's Floral Clock so celebrated across India?",
    options: [
      "It is digital with LED screens",
      "It is a 20-foot working mechanical clock with flowerbeds forming the dial",
      "It chimes every 10 seconds",
      "It is carved from gold"
    ],
    answerIndex: 1,
    explanation: "Sayaji Baug's Floral Clock has an underground mechanical clockwork driving heavy hands over a 20-foot mound of blooming seasonal flowers!"
  }
];

export const DEVFEST_INFO = {
  event: "GDG DevFest Baroda 2026",
  city: "Vadodara (Baroda), Gujarat",
  tagline: "Where Royal Heritage Meets Cutting-Edge Technology",
  techStack: ["WebGL", "Three.js", "React 19", "Vite", "GSAP", "Web Audio API", "Lucide Icons"]
};
