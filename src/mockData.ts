export interface Movie {
  id: number;
  title: string;
  original_language: string;
  release_date: string;
  vote_average: number;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  popularity: number;
}

export interface Review {
  author: string;
  content: string;
}

export const MOCK_REVIEWS: Record<number, Review[]> = {
  101: [
    { author: "CinematicDan", content: "Absolutely hysterical! Ryan Reynolds and Hugh Jackman have unbelievable chemistry. The jokes fly at a mile a minute. Easily the most fun I've had in a theater in years!" },
    { author: "MovieBuff99", content: "A triumph of fanservice done right. The action sequences are gloriously choreographed, and the meta-commentary is sharp as tack." },
    { author: "Elena_R", content: "A bit bloated in the middle, but the humor and callbacks completely save it. Highly recommended for any Marvel fan." }
  ],
  102: [
    { author: "NolanFanatic", content: "A monumental achievement in sci-fi cinema. The realism, the organ-pounding Hans Zimmer score, and Matthew McConaughey's performance are masterclass." },
    { author: "Sara_K", content: "Beautiful, emotional, and mind-bending. It made me cry and think at the same time. The visual design of Gargantua is spectacular." },
    { author: "TechGeek", content: "Physically and scientifically fascinating. TARS is the best robot costar of all time." }
  ],
  103: [
    { author: "ReviewerSupreme", content: "Heath Ledger's Joker is legendary, but Bale's Batman and Zimmer's score hold this flawless masterpiece together. Best superhero film ever made." },
    { author: "CinephileX", content: "Tense, gritty, and incredibly written. It feels more like a heavy crime drama than a comic book movie." }
  ],
  104: [
    { author: "RomanceReader", content: "An absolutely heartbreaking but gorgeous film. Gosling and McAdams have unmatched spark. I cry every single time." },
    { author: "ClassicLover", content: "A timeless romance story about growing old together. The dual timeline structure is extremely effective." }
  ],
  105: [
    { author: "SpookyGamer", content: "Scariest movie of the 2010s. The tension build-up and the lack of cheap jumpscares make this a horror masterclass." },
    { author: "ConjuringCollector", content: "Patrick Wilson and Vera Farmiga are superb. You genuinely care about the family, which makes the haunting even more terrifying." }
  ],
  106: [
    { author: "BollywoodBlogger", content: "An absolute riot! 3 Idiots is both extremely funny and deeply critical of the high-stress education system. A must-watch for everyone." },
    { author: "AamirFan", content: "The acting is superb, and the message 'Pursue excellence, and success will follow' is timeless. 'All izz well' indeed!" },
    { author: "GlobalCine", content: "A perfect blend of comedy, deep emotions, and catchy songs. Indian cinema at its absolute finest!" }
  ],
  107: [
    { author: "MassReview", content: "Unbelievable action! The scale of this film is staggering. Ram Charan and NTR Jr. perform with legendary energy. The Naatu Naatu song is iconic!" },
    { author: "ActionJunkie", content: "This makes Hollywood action movies look tame and uninspired. Pure, unadulterated cinematic adrenaline and brotherhood!" }
  ],
  108: [
    { author: "ClassicHindi", content: "The definitive Bollywood romance. Shah Rukh Khan and Kajol are the ultimate on-screen couple. The music still sounds incredibly fresh." },
    { author: "YashRajFan", content: "A beautiful celebration of love, family values, and NRI culture. Cult classic!" }
  ],
  109: [
    { author: "ThrillerSeeker", content: "One of the smartest suspense thrillers in Indian cinema. Tabu and Ayushmann are fantastic. The twists keep you guessing right up to the final frame." },
    { author: "ScriptMaster", content: "Pristine screenplay. The blind pianist concept is used beautifully as a metaphor and a thriller mechanism." }
  ],
  110: [
    { author: "IndieLover", content: "A quiet, gentle, and profoundly touching film. Irrfan Khan gives an incredibly nuanced performance through simple letters." },
    { author: "FoodieCine", content: "It captures the raw beauty of Mumbai, the warmth of home-cooked meals, and the lingering ache of loneliness. Absolute masterpiece." }
  ],
  111: [
    { author: "SciFiGuy", content: "A sequel that actually rivals the original. The visuals, the sound design, and the philosophical depth are outstanding. Denis Villeneuve is a wizard!" },
    { author: "PixelPerfect", content: "Every frame of this film is a painting. Roger Deakins deserves all the awards." }
  ],
  112: [
    { author: "FearlessReviewer", content: "A brilliantly crafted, dread-inducing horror experience. Florence Pugh's Performance is devastatingly good." },
    { author: "A24Fan", content: "Unlike any other horror movie. Golden daylight, floral crowns, and absolute nightmares. Pure folk horror brilliance." }
  ],
  113: [
    { author: "ClassicGuy", content: "The pinnacle of crime cinema. Pacino and Brando are untouchable. The screenplay is a masterclass in pacing and dialogue." },
    { author: "OldSchool70", content: "An offer you can't refuse. A timeless depiction of family loyalty, corruption, and the American dream." }
  ],
  114: [
    { author: "FamilyFirst", content: "Pixar's crowning achievement. It is incredibly clever, emotionally mature, and Hilarious for both kids and adults." },
    { author: "JoyAndSadness", content: "The way this movie handles psychological concepts and emotional intelligence is profound. I cried over a pink elephant!" }
  ],
  115: [
    { author: "TrueCrimer", content: "David Fincher at his best. Visually moody, brilliantly acted, and a chilling look into the obsession of unsolved cases." }
  ],
  116: [
    { author: "BollywoodBuff", content: "A landmark dynamic action/drama. Ranbir Kapoor is phenomenal. The music by A.R. Rahman is legendary." }
  ],
  117: [
    { author: "NostalgicUser", content: "Hrithik Roshan's dance, the beautiful friendship, and the outstanding sci-fi twist! A generation's favorite." }
  ],
  118: [
    { author: "DramaFan", content: "Stunning depiction of the visual effects industry and the life of a visual artist. Very emotional and ground-breaking." }
  ],
  119: [
    { author: "IndieSpot", content: "A wonderful dark-comedy mystery. Brilliantly cast and deeply atmospheric. Traditional folklore meets modern thriller." }
  ],
  120: [
    { author: "RetroViewer", content: "Amitabh Bachchan in his prime! Outstanding action, high family drama, and memorable songs." }
  ]
};

export const MOCK_MOVIES: Movie[] = [
  {
    id: 101,
    title: "Deadpool & Wolverine",
    original_language: "en",
    release_date: "2024-07-24",
    vote_average: 8.1,
    overview: "A listless Wade Wilson toils in civilian life. His days as the morally flexible mercenary, Deadpool, behind him. When his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant... wolverine?",
    poster_path: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=500",
    genre_ids: [35, 28], // Comedy, Action
    popularity: 980
  },
  {
    id: 102,
    title: "Interstellar",
    original_language: "en",
    release_date: "2014-11-05",
    vote_average: 8.4,
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 878], // Drama, Sci-Fi
    popularity: 850
  },
  {
    id: 103,
    title: "The Dark Knight",
    original_language: "en",
    release_date: "2008-07-18",
    vote_average: 8.6,
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster_path: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=500",
    genre_ids: [28, 53], // Action, Thriller
    popularity: 920
  },
  {
    id: 104,
    title: "The Notebook",
    original_language: "en",
    release_date: "2004-06-25",
    vote_average: 7.9,
    overview: "An epic love story centered around an older man who reads aloud to a woman with Alzheimer's disease. From a faded notebook, the old man's words bring to life the story of a couple who is separated by World War II, and is then passionately reunited, seven years later.",
    poster_path: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=500",
    genre_ids: [10749, 18], // Romance, Drama
    popularity: 640
  },
  {
    id: 105,
    title: "The Conjuring",
    original_language: "en",
    release_date: "2013-07-19",
    vote_average: 7.5,
    overview: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse. Forced to confront a powerful entity, the Warrens find themselves caught in the most terrifying case of their lives.",
    poster_path: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&q=80&w=500",
    genre_ids: [27, 9648], // Horror, Mystery
    popularity: 580
  },
  {
    id: 106,
    title: "3 Idiots",
    original_language: "hi",
    release_date: "2009-12-23",
    vote_average: 8.0,
    overview: "Two friends are searching for their long-lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them idiots.",
    poster_path: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=500",
    genre_ids: [35, 18], // Comedy, Drama
    popularity: 760
  },
  {
    id: 107,
    title: "RRR",
    original_language: "hi", // Available in dubbed Hindi on TMDB
    release_date: "2022-03-24",
    vote_average: 7.8,
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500",
    genre_ids: [28, 18], // Action, Drama
    popularity: 810
  },
  {
    id: 108,
    title: "Dilwale Dulhania Le Jayenge",
    original_language: "hi",
    release_date: "1995-10-20",
    vote_average: 8.5,
    overview: "Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values. Simran has never met her fiancé, but Raj and Simran fall in love during an eventful trip around Europe.",
    poster_path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=500",
    genre_ids: [10749, 35], // Romance, Comedy
    popularity: 790
  },
  {
    id: 109,
    title: "Andhadhun",
    original_language: "hi",
    release_date: "2018-10-05",
    vote_average: 8.2,
    overview: "A series of mysterious events change the life of a blind pianist who now must report a crime that he should not technically know about.",
    poster_path: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500",
    genre_ids: [53, 9648, 35], // Thriller, Mystery, Comedy
    popularity: 690
  },
  {
    id: 110,
    title: "The Lunchbox",
    original_language: "hi",
    release_date: "2013-09-20",
    vote_average: 7.7,
    overview: "A mistaken delivery in Mumbai's famously efficient lunchbox delivery system connects a young housewife to an older man in the dusk of his life as they build a fantasy world together through notes in the lunchbox.",
    poster_path: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 10749], // Drama, Romance
    popularity: 620
  },
  {
    id: 111,
    title: "Blade Runner 2049",
    original_language: "en",
    release_date: "2017-10-04",
    vote_average: 7.9,
    overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    poster_path: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=500",
    genre_ids: [878, 53], // Sci-Fi, Thriller
    popularity: 740
  },
  {
    id: 112,
    title: "Midsommar",
    original_language: "en",
    release_date: "2019-07-03",
    vote_average: 7.2,
    overview: "A couple travels to Sweden to visit their friend's rural hometown for its fabled midsummer festival, but what begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition at the hands of a pagan cult.",
    poster_path: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500",
    genre_ids: [27, 18, 9648], // Horror, Drama, Mystery
    popularity: 610
  },
  {
    id: 113,
    title: "The Godfather",
    original_language: "en",
    release_date: "1972-03-14",
    vote_average: 8.7,
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone, barely survives an attempt on his life, his youngest son, Michael, steps in to take care of the would-be killers.",
    poster_path: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 53], // Drama, Thriller (representing deep crime drama state)
    popularity: 900
  },
  {
    id: 114,
    title: "Inside Out",
    original_language: "en",
    release_date: "2015-06-17",
    vote_average: 7.9,
    overview: "Growing up can be a bumpy road, and it's no exception for Riley, who is uprooted from her Midwest life when her father starts a new job in San Francisco. Riley's guided by her emotions - Joy, Fear, Anger, Disgust and Sadness.",
    poster_path: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=500",
    genre_ids: [10751, 35], // Family, Comedy
    popularity: 670
  },
  {
    id: 115,
    title: "Zodiac",
    original_language: "en",
    release_date: "2007-03-02",
    vote_average: 7.5,
    overview: "Between 1968 and 1983, a San Francisco cartoonist becomes an amateur detective obsessed with tracking down the Zodiac Killer, an unidentified individual who terrorizes Northern California with a killing spree.",
    poster_path: "https://images.unsplash.com/photo-1510972527409-cca19de31749?auto=format&fit=crop&q=80&w=500",
    genre_ids: [9648, 53, 18], // Mystery, Thriller, Drama
    popularity: 540
  },
  {
    id: 116,
    title: "Rockstar",
    original_language: "hi",
    release_date: "2011-11-11",
    vote_average: 7.9,
    overview: "Janardhan Jakhar chases his dreams of becoming a rock star, during which he falls in love with Heer. However, grief and trauma shape his artistic voice into the rebellious singer Jordan.",
    poster_path: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 10749], // Drama, Romance
    popularity: 590
  },
  {
    id: 117,
    title: "Koi... Mil Gaya",
    original_language: "hi",
    release_date: "2003-08-08",
    vote_average: 7.1,
    overview: "A developmentally disabled young man contacts an alien spacecraft with his late father's computer computer, leading to a profound friendship with a friendly blue extraterrestrial named Jadoo.",
    poster_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=500",
    genre_ids: [878, 10751, 35], // Sci-Fi, Family, Comedy
    popularity: 530
  },
  {
    id: 118,
    title: "Taare Zameen Par",
    original_language: "hi",
    release_date: "2007-12-21",
    vote_average: 8.0,
    overview: "Ishaan is an 8-year-old boy whose world is filled with wonders that no one else seems to appreciate. When he is sent to boarding school, an unconventional art teacher helps him discover his true potential.",
    poster_path: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=500",
    genre_ids: [18, 10751], // Drama, Family
    popularity: 720
  },
  {
    id: 119,
    title: "Stree",
    original_language: "hi",
    release_date: "2018-08-31",
    vote_average: 7.4,
    overview: "In the small town of Chanderi, the menfolk live under the fear of an eerie spirit named 'Stree' who abducts men at night during festivals. A local tailor falls in love with a mysterious girl and seeks to solve the legend.",
    poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=500",
    genre_ids: [35, 27, 9648], // Comedy, Horror, Mystery
    popularity: 680
  },
  {
    id: 120,
    title: "Sholay",
    original_language: "hi",
    release_date: "1975-08-15",
    vote_average: 8.3,
    overview: "After his family is murdered by a notorious dacoit, a retired police officer recruits two small-time convicts to capture the outlaw dead or alive.",
    poster_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=500",
    genre_ids: [28, 18], // Action, Drama
    popularity: 770
  }
];
