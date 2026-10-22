/**
 * The launch catalogue. Seeded into the database by `npm run db:seed`; after
 * that the admin panel is the source of truth.
 *
 * Cover art is Steam's public store artwork, addressed by app id.
 * DIGITAL = PC key, download link emailed after payment.
 * PHYSICAL = boxed disc, delivered to the shipping address.
 */

export interface SeedGame {
  steamId: number;
  title: string;
  tagline: string;
  genre: string;
  platform: string;
  edition: "DIGITAL" | "PHYSICAL";
  price: number;
  comparePrice?: number;
  developer: string;
  releaseYear: number;
  rating: number;
  featured?: boolean;
  description: string;
}

export const steamArt = (id: number, kind: "header" | "library_600x900" | "library_hero" = "header") =>
  `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/${kind}.jpg`;

export const games: SeedGame[] = [
  // ---------------------------------------------------------------- racing
  { steamId: 1551360, title: "Forza Horizon 5", tagline: "Own the streets of Mexico.", genre: "Racing", platform: "PC", edition: "DIGITAL", price: 18999, comparePrice: 22999, developer: "Playground Games", releaseYear: 2021, rating: 4.8, featured: true,
    description: "Lead breathtaking expeditions across the vibrant open world of Mexico with hundreds of the world's greatest cars. Race through jungles, deserts and volcanoes in the ultimate Horizon adventure." },
  { steamId: 1846380, title: "Need for Speed Unbound", tagline: "Race to the top. Leave your mark.", genre: "Racing", platform: "PC", edition: "DIGITAL", price: 16499, comparePrice: 19999, developer: "Criterion Games", releaseYear: 2022, rating: 4.4, featured: true,
    description: "Prove you have what it takes to win The Grand, Lakeshore's ultimate street racing challenge. Outrun the cops, customise your ride and hit the streets with a style no one else has." },
  { steamId: 1293830, title: "Forza Horizon 4", tagline: "Seasons change everything.", genre: "Racing", platform: "PC", edition: "DIGITAL", price: 12999, developer: "Playground Games", releaseYear: 2018, rating: 4.7,
    description: "Dynamic seasons change everything at the world's greatest automotive festival. Go it alone or team up with others to explore beautiful, historic Britain in a shared open world." },
  { steamId: 2440510, title: "Forza Motorsport", tagline: "Built from the ground up.", genre: "Racing", platform: "Xbox Series X", edition: "PHYSICAL", price: 21999, comparePrice: 24999, developer: "Turn 10 Studios", releaseYear: 2023, rating: 4.3,
    description: "Win races, level up your cars, and compete with friends. Over 500 cars and 20 world-famous circuits with next-generation physics and ray-traced visuals." },
  { steamId: 2488620, title: "F1 24", tagline: "Be one of the 20.", genre: "Racing", platform: "PS5", edition: "PHYSICAL", price: 23999, developer: "Codemasters", releaseYear: 2024, rating: 4.2,
    description: "Drive like a champion with the official game of the 2024 FIA Formula One World Championship. Career mode, refreshed handling and every circuit on the calendar." },
  { steamId: 2698940, title: "The Crew Motorfest", tagline: "Welcome to the festival.", genre: "Racing", platform: "PS5", edition: "PHYSICAL", price: 19999, developer: "Ubisoft Ivory Tower", releaseYear: 2023, rating: 4.1,
    description: "Hit the roads of O'ahu in the open-world motor festival. Cars, bikes, boats and planes across the most beautiful island in the Pacific." },
  { steamId: 805550, title: "Assetto Corsa Competizione", tagline: "The official GT World Challenge game.", genre: "Racing", platform: "PC", edition: "DIGITAL", price: 9999, developer: "Kunos Simulazioni", releaseYear: 2019, rating: 4.5,
    description: "The ultimate GT racing simulation with laser-scanned tracks, real-world cars and true-to-life physics. Built for serious drivers and sim rigs." },
  { steamId: 1222680, title: "Need for Speed Heat", tagline: "Hustle by day. Risk it all at night.", genre: "Racing", platform: "PC", edition: "DIGITAL", price: 8999, developer: "Ghost Games", releaseYear: 2019, rating: 4.3,
    description: "Compete in sanctioned races by day, then take the risk at night in illicit street races in Palm City. Build your reputation and the ultimate custom ride." },

  // -------------------------------------------------------------- open world
  { steamId: 1091500, title: "Cyberpunk 2077", tagline: "Become a cyberpunk. An urban mercenary.", genre: "RPG", platform: "PC", edition: "DIGITAL", price: 17999, comparePrice: 21999, developer: "CD PROJEKT RED", releaseYear: 2020, rating: 4.7, featured: true,
    description: "An open-world action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamour and ceaseless body modification." },
  { steamId: 2138330, title: "Cyberpunk 2077: Phantom Liberty", tagline: "Spy thriller expansion.", genre: "RPG", platform: "PC", edition: "DIGITAL", price: 9499, developer: "CD PROJEKT RED", releaseYear: 2023, rating: 4.8,
    description: "A spy-thriller expansion for Cyberpunk 2077. Return as V, a cyber-enhanced mercenary, and embark on a high-stakes mission of espionage in Dogtown. Requires the base game." },
  { steamId: 1174180, title: "Red Dead Redemption 2", tagline: "Outlaws for life.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 15999, comparePrice: 18999, developer: "Rockstar Games", releaseYear: 2019, rating: 4.9, featured: true,
    description: "America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. An epic tale of honour and loyalty at the dawn of the modern age." },
  { steamId: 3240220, title: "Grand Theft Auto V Enhanced", tagline: "Los Santos, upgraded.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 11999, developer: "Rockstar North", releaseYear: 2025, rating: 4.7, featured: true,
    description: "Experience Los Santos and Blaine County with ray tracing, faster loading and the full GTA Online experience. Three criminals, one city, endless chaos." },
  { steamId: 2668510, title: "Red Dead Redemption", tagline: "The legend of John Marston.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 13999, developer: "Rockstar Games", releaseYear: 2024, rating: 4.6,
    description: "When federal agents threaten his family, former outlaw John Marston is forced to pick up his guns again and hunt down the gang he once rode with." },
  { steamId: 2208920, title: "Assassin's Creed Valhalla", tagline: "Become a legendary Viking.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 14999, developer: "Ubisoft Montreal", releaseYear: 2020, rating: 4.4,
    description: "Become Eivor, a Viking raider raised to be a fearless warrior, and lead your clan from the icy shores of Norway to a new home amid the kingdoms of England." },
  { steamId: 2369390, title: "Far Cry 6", tagline: "Welcome to Yara.", genre: "Shooter", platform: "Xbox Series X", edition: "PHYSICAL", price: 13999, developer: "Ubisoft Toronto", releaseYear: 2021, rating: 4.2,
    description: "Fight alongside a modern-day guerrilla revolution to liberate Yara, a tropical paradise frozen in time, from the iron grip of dictator Antón Castillo." },
  { steamId: 990080, title: "Hogwarts Legacy", tagline: "Live the unwritten.", genre: "RPG", platform: "PS5", edition: "PHYSICAL", price: 19999, comparePrice: 23999, developer: "Avalanche Software", releaseYear: 2023, rating: 4.6,
    description: "An immersive open-world action RPG set in the 1800s wizarding world. Attend classes, brew potions, master spells and uncover a hidden truth of the past." },

  // -------------------------------------------------------------- playstation
  { steamId: 2322010, title: "God of War Ragnarök", tagline: "Fimbulwinter is upon us.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 24999, comparePrice: 27999, developer: "Santa Monica Studio", releaseYear: 2022, rating: 4.9, featured: true,
    description: "Kratos and Atreus embark on a mythic journey for answers before Ragnarök arrives. Explore the Nine Realms in an epic, heartfelt story." },
  { steamId: 1593500, title: "God of War", tagline: "A new beginning.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 12999, developer: "Santa Monica Studio", releaseYear: 2022, rating: 4.9,
    description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse gods. A father and son on an intimate, harrowing journey." },
  { steamId: 2651280, title: "Marvel's Spider-Man 2", tagline: "Be greater. Together.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 25999, comparePrice: 28999, developer: "Insomniac Games", releaseYear: 2023, rating: 4.8, featured: true,
    description: "Peter Parker and Miles Morales return for an exciting new adventure. Swing, jump and soar through an expanded Marvel's New York and face Venom." },
  { steamId: 1817070, title: "Marvel's Spider-Man Remastered", tagline: "Be Greater.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 13999, developer: "Insomniac Games", releaseYear: 2022, rating: 4.8,
    description: "An experienced Peter Parker fights big crime and iconic villains in Marvel's New York. Swing through vibrant neighbourhoods and catch your breath with stunning views." },
  { steamId: 1817190, title: "Marvel's Spider-Man: Miles Morales", tagline: "Be yourself.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 14999, developer: "Insomniac Games", releaseYear: 2020, rating: 4.7,
    description: "Teenager Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker, as a new Spider-Man." },
  { steamId: 2420110, title: "Horizon Forbidden West Complete Edition", tagline: "Explore distant lands.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 21999, developer: "Guerrilla Games", releaseYear: 2024, rating: 4.7,
    description: "Join Aloy as she braves the Forbidden West — a majestic but dangerous frontier that conceals mysterious new threats. Includes the Burning Shores expansion." },
  { steamId: 1151640, title: "Horizon Zero Dawn Complete Edition", tagline: "Hunt or be hunted.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 8999, developer: "Guerrilla Games", releaseYear: 2020, rating: 4.7,
    description: "In an era where machines roam the land and mankind is no longer the dominant species, a young hunter named Aloy embarks on a journey to discover her destiny." },
  { steamId: 1888930, title: "The Last of Us Part I", tagline: "Endure and survive.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 22999, developer: "Naughty Dog", releaseYear: 2022, rating: 4.8,
    description: "Experience the emotional storytelling and unforgettable characters of Joel and Ellie in The Last of Us, rebuilt from the ground up." },
  { steamId: 2531310, title: "The Last of Us Part II Remastered", tagline: "Every path has a price.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 23999, developer: "Naughty Dog", releaseYear: 2024, rating: 4.8,
    description: "Five years after their dangerous journey across a post-pandemic United States, Ellie and Joel have settled down in Jackson — until a violent event shatters that peace." },
  { steamId: 2215430, title: "Ghost of Tsushima Director's Cut", tagline: "Forge a new path.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 16999, developer: "Sucker Punch Productions", releaseYear: 2024, rating: 4.9,
    description: "A storm is coming. Venture into the complete Ghost of Tsushima Director's Cut, including the Iki Island expansion and the Legends co-op mode." },

  // -------------------------------------------------------------- soulslike / rpg
  { steamId: 1245620, title: "ELDEN RING", tagline: "Rise, Tarnished.", genre: "RPG", platform: "PS5", edition: "PHYSICAL", price: 19999, comparePrice: 22999, developer: "FromSoftware", releaseYear: 2022, rating: 4.9, featured: true,
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between." },
  { steamId: 2358720, title: "Black Myth: Wukong", tagline: "Seek the truth of legend.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 18999, developer: "Game Science", releaseYear: 2024, rating: 4.7, featured: true,
    description: "An action RPG rooted in Chinese mythology. Set out as the Destined One to venture into the challenges and marvels ahead, uncovering the obscured truth beneath a glorious legend." },
  { steamId: 814380, title: "Sekiro: Shadows Die Twice GOTY", tagline: "Take revenge. Restore your honour.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 14999, developer: "FromSoftware", releaseYear: 2019, rating: 4.8,
    description: "Carve your own clever path to vengeance in this award-winning adventure from FromSoftware. Death is not the end." },
  { steamId: 1086940, title: "Baldur's Gate 3", tagline: "Gather your party.", genre: "RPG", platform: "PC", edition: "DIGITAL", price: 17999, developer: "Larian Studios", releaseYear: 2023, rating: 4.9, featured: true,
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power." },
  { steamId: 292030, title: "The Witcher 3: Wild Hunt", tagline: "The story-driven RPG.", genre: "RPG", platform: "PS5", edition: "PHYSICAL", price: 12999, developer: "CD PROJEKT RED", releaseYear: 2015, rating: 4.9,
    description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will." },
  { steamId: 1716740, title: "Starfield", tagline: "Explore the cosmos.", genre: "RPG", platform: "Xbox Series X", edition: "PHYSICAL", price: 22999, developer: "Bethesda Game Studios", releaseYear: 2023, rating: 4.1,
    description: "The first new universe in 25 years from Bethesda. Create any character you want and explore with unparalleled freedom across the Settled Systems." },
  { steamId: 2344520, title: "Diablo IV", tagline: "Welcome to Hell.", genre: "RPG", platform: "PS5", edition: "PHYSICAL", price: 21999, developer: "Blizzard Entertainment", releaseYear: 2023, rating: 4.3,
    description: "Join the fight for Sanctuary in Diablo IV, the ultimate action RPG adventure. Experience the critically acclaimed campaign and new seasonal content." },
  { steamId: 1462040, title: "Final Fantasy VII Remake Intergrade", tagline: "The reunion awaits.", genre: "RPG", platform: "PC", edition: "DIGITAL", price: 15999, developer: "Square Enix", releaseYear: 2021, rating: 4.6,
    description: "Cloud Strife, an ex-SOLDIER operative, descends on the mako-powered city of Midgar. The world of the timeless classic reborn with cutting-edge graphics." },
  { steamId: 1687950, title: "Persona 5 Royal", tagline: "Steal their hearts.", genre: "RPG", platform: "PS5", edition: "PHYSICAL", price: 13999, developer: "ATLUS", releaseYear: 2022, rating: 4.9,
    description: "Don the mask and join the Phantom Thieves of Hearts as they stage grand heists, infiltrate the minds of the corrupt, and make them change their ways." },
  { steamId: 2161700, title: "Persona 3 Reload", tagline: "Face your fears.", genre: "RPG", platform: "PC", edition: "DIGITAL", price: 14999, developer: "ATLUS", releaseYear: 2024, rating: 4.7,
    description: "Dive into the Dark Hour and awaken the depths of your heart. A captivating reimagining of the genre-defining RPG." },
  { steamId: 2054970, title: "Dragon's Dogma 2", tagline: "Your journey awaits.", genre: "RPG", platform: "PS5", edition: "PHYSICAL", price: 19999, developer: "Capcom", releaseYear: 2024, rating: 4.3,
    description: "A story-driven, single-player action RPG that challenges players to choose their own experience — from the appearance of their Arisen to their vocation and party." },
  { steamId: 1328670, title: "Mass Effect Legendary Edition", tagline: "One person is all it takes.", genre: "RPG", platform: "PC", edition: "DIGITAL", price: 9999, developer: "BioWare", releaseYear: 2021, rating: 4.7,
    description: "Relive the legend of Commander Shepard in the highly acclaimed Mass Effect trilogy, remastered and optimised for 4K Ultra HD." },

  // -------------------------------------------------------------- monster hunter / co-op
  { steamId: 2246340, title: "Monster Hunter Wilds", tagline: "The unbridled force of nature.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 23999, comparePrice: 25999, developer: "Capcom", releaseYear: 2025, rating: 4.4, featured: true,
    description: "The unbridled force of nature runs wild and relentless. Hunt with your squad across dynamic environments that shift between harsh and plentiful." },
  { steamId: 582010, title: "Monster Hunter: World", tagline: "The new world awaits.", genre: "Action", platform: "PC", edition: "DIGITAL", price: 7999, developer: "Capcom", releaseYear: 2018, rating: 4.7,
    description: "Welcome to a new world! Take on the role of a hunter and slay ferocious monsters in a living, breathing ecosystem." },
  { steamId: 553850, title: "HELLDIVERS 2", tagline: "Spread managed democracy.", genre: "Shooter", platform: "PS5", edition: "PHYSICAL", price: 14999, developer: "Arrowhead Game Studios", releaseYear: 2024, rating: 4.5,
    description: "The last line of offence for Super Earth. Join the Helldivers to fight for freedom across a hostile galaxy in a fast, frantic and ferocious third-person shooter." },
  { steamId: 1426210, title: "It Takes Two", tagline: "Made for co-op.", genre: "Adventure", platform: "PS5", edition: "PHYSICAL", price: 11999, developer: "Hazelight Studios", releaseYear: 2021, rating: 4.9,
    description: "Embark on the craziest journey of your life in It Takes Two, a genre-bending platform adventure created purely for co-op." },
  { steamId: 1623730, title: "Palworld", tagline: "Fight, farm, build and work.", genre: "Survival", platform: "PC", edition: "DIGITAL", price: 7499, developer: "Pocketpair", releaseYear: 2024, rating: 4.4,
    description: "Fight, farm, build and work alongside mysterious creatures called Pals in this completely new multiplayer, open-world survival and crafting game." },
  { steamId: 2399830, title: "ARK: Survival Ascended", tagline: "Survive. Tame. Thrive.", genre: "Survival", platform: "PC", edition: "DIGITAL", price: 10999, developer: "Studio Wildcard", releaseYear: 2023, rating: 4.0,
    description: "Respawn into the ultimate dinosaur survival experience, rebuilt from the ground up with next-gen graphics and cross-platform modding." },

  // -------------------------------------------------------------- shooters
  { steamId: 2933620, title: "Call of Duty: Black Ops 6", tagline: "The truth lies.", genre: "Shooter", platform: "PS5", edition: "PHYSICAL", price: 26999, comparePrice: 29999, developer: "Treyarch", releaseYear: 2024, rating: 4.3, featured: true,
    description: "Forced to go rogue. Hunted from within. A spy action thriller set in the early 90s with Omnimovement, classic Prestige and the return of Round-Based Zombies." },
  { steamId: 1938090, title: "Call of Duty: Modern Warfare III", tagline: "Makarov is back.", genre: "Shooter", platform: "Xbox Series X", edition: "PHYSICAL", price: 22999, developer: "Sledgehammer Games", releaseYear: 2023, rating: 4.0,
    description: "Captain Price and Task Force 141 face off against the ultimate threat. The ultranationalist war criminal Vladimir Makarov is extending his grasp across the world." },
  { steamId: 1517290, title: "Battlefield 2042", tagline: "All-out warfare.", genre: "Shooter", platform: "PC", edition: "DIGITAL", price: 8999, developer: "DICE", releaseYear: 2021, rating: 3.9,
    description: "A first-person shooter that marks the return to the iconic all-out warfare of the franchise. Adapt and overcome dynamic battlegrounds of 128 players." },
  { steamId: 1238840, title: "Battlefield 1", tagline: "The dawn of all-out war.", genre: "Shooter", platform: "PC", edition: "DIGITAL", price: 5999, developer: "DICE", releaseYear: 2016, rating: 4.6,
    description: "Discover a world at war through an adventure-filled campaign, or join in epic team-based multiplayer battles with up to 64 players." },
  { steamId: 1449560, title: "Metro Exodus", tagline: "Flee the shattered ruins.", genre: "Shooter", platform: "PC", edition: "DIGITAL", price: 6999, developer: "4A Games", releaseYear: 2020, rating: 4.6,
    description: "Flee the shattered ruins of the Moscow Metro and embark on an epic, continent-spanning journey across post-apocalyptic Russia." },
  { steamId: 2183900, title: "Warhammer 40,000: Space Marine 2", tagline: "For the Emperor.", genre: "Shooter", platform: "PS5", edition: "PHYSICAL", price: 19999, developer: "Saber Interactive", releaseYear: 2024, rating: 4.6,
    description: "Embody the superhuman skill and brutality of a Space Marine. Unleash deadly abilities and devastating weaponry to obliterate the Tyranid swarms." },
  { steamId: 1144200, title: "Ready or Not", tagline: "Lead the SWAT team.", genre: "Shooter", platform: "PC", edition: "DIGITAL", price: 11999, developer: "VOID Interactive", releaseYear: 2023, rating: 4.5,
    description: "A tactical first-person shooter where you lead a team of SWAT officers to diffuse hostile situations in a city plagued by crime." },
  { steamId: 1240440, title: "Halo Infinite", tagline: "The legend returns.", genre: "Shooter", platform: "Xbox Series X", edition: "PHYSICAL", price: 13999, developer: "343 Industries", releaseYear: 2021, rating: 4.2,
    description: "When all hope is lost and humanity's fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he's ever faced." },

  // -------------------------------------------------------------- horror / stealth
  { steamId: 2050650, title: "Resident Evil 4", tagline: "Survival is just the beginning.", genre: "Horror", platform: "PS5", edition: "PHYSICAL", price: 16999, developer: "Capcom", releaseYear: 2023, rating: 4.8,
    description: "Six years after the biological disaster in Raccoon City, agent Leon S. Kennedy is sent to rescue the president's kidnapped daughter. A reimagining of the 2005 classic." },
  { steamId: 2124490, title: "SILENT HILL 2", tagline: "In my restless dreams…", genre: "Horror", platform: "PC", edition: "DIGITAL", price: 17999, developer: "Bloober Team", releaseYear: 2024, rating: 4.6,
    description: "Investigating a letter from his late wife, James returns to where they made so many memories — Silent Hill. A masterpiece of psychological horror, remade." },
  { steamId: 1659040, title: "HITMAN World of Assassination", tagline: "Become the world's ultimate assassin.", genre: "Stealth", platform: "PC", edition: "DIGITAL", price: 12999, developer: "IO Interactive", releaseYear: 2023, rating: 4.7,
    description: "Enter the world of the ultimate assassin. The complete Agent 47 trilogy across the most exotic locations in the world." },

  // -------------------------------------------------------------- fighting / sports
  { steamId: 1971870, title: "Mortal Kombat 1", tagline: "A new era begins.", genre: "Fighting", platform: "PS5", edition: "PHYSICAL", price: 17999, developer: "NetherRealm Studios", releaseYear: 2023, rating: 4.2,
    description: "Discover a reborn Mortal Kombat Universe created by the Fire God Liu Kang. Featuring Kameo fighters and the most brutal fatalities ever." },
  { steamId: 1364780, title: "Street Fighter 6", tagline: "Here comes a new challenger.", genre: "Fighting", platform: "PC", edition: "DIGITAL", price: 13999, developer: "Capcom", releaseYear: 2023, rating: 4.6,
    description: "Street Fighter 6 spans three distinct game modes: World Tour, Fighting Ground and Battle Hub. A new street-style era of fighting." },
  { steamId: 2669320, title: "EA SPORTS FC 25", tagline: "Rush to the top.", genre: "Sports", platform: "PS5", edition: "PHYSICAL", price: 22999, comparePrice: 25999, developer: "EA Vancouver", releaseYear: 2024, rating: 4.0, featured: true,
    description: "Win together with Rush, the new 5v5 mode. Over 19,000 fully licensed players, 700 teams and 30 leagues in The World's Game." },
  { steamId: 2878980, title: "NBA 2K25", tagline: "Take the court.", genre: "Sports", platform: "PS5", edition: "PHYSICAL", price: 19999, developer: "Visual Concepts", releaseYear: 2024, rating: 3.9,
    description: "Command the court with authenticity powered by ProPLAY. Build your legacy in MyCAREER, MyTEAM and MyNBA." },

  // -------------------------------------------------------------- indie / other
  { steamId: 1145350, title: "Hades II", tagline: "Battle beyond the Underworld.", genre: "Roguelike", platform: "PC", edition: "DIGITAL", price: 7999, developer: "Supergiant Games", releaseYear: 2025, rating: 4.9,
    description: "Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler." },
  { steamId: 1868140, title: "DAVE THE DIVER", tagline: "Dive by day. Sushi by night.", genre: "Adventure", platform: "PC", edition: "DIGITAL", price: 5999, developer: "MINTROCKET", releaseYear: 2023, rating: 4.9,
    description: "A casual, singleplayer adventure RPG featuring deep-sea exploration and fishing during the day and running a sushi restaurant at night." },
  { steamId: 1774580, title: "STAR WARS Jedi: Survivor", tagline: "The story of Cal Kestis continues.", genre: "Action", platform: "PS5", edition: "PHYSICAL", price: 18999, developer: "Respawn Entertainment", releaseYear: 2023, rating: 4.4,
    description: "The story of Cal Kestis continues in this third-person, galaxy-spanning action-adventure. Five years after Fallen Order, Cal must stay one step ahead of the Empire." },
  { steamId: 1295660, title: "Sid Meier's Civilization VII", tagline: "Build an empire to stand the test of time.", genre: "Strategy", platform: "PC", edition: "DIGITAL", price: 19999, developer: "Firaxis Games", releaseYear: 2025, rating: 4.0,
    description: "Build the greatest empire the world has ever known. Lead your civilization across the ages in the next chapter of the legendary strategy series." },
];
