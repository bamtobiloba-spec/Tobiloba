const KEYS = {
  POSTS: 'dkw_posts',
  CLIENTS: 'dkw_clients',
  ANALYTICS: 'dkw_analytics',
  MEDIA_KIT: 'dkw_media_kit',
  HASHTAGS: 'dkw_hashtags',
  CAPTIONS: 'dkw_captions',
};

export function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export function loadPosts() { return load(KEYS.POSTS) || []; }
export function savePosts(posts) { save(KEYS.POSTS, posts); }

export function loadClients() { return load(KEYS.CLIENTS) || []; }
export function saveClients(clients) { save(KEYS.CLIENTS, clients); }

export function loadAnalytics() { return load(KEYS.ANALYTICS) || { weeks: [], postEngagement: [] }; }
export function saveAnalytics(data) { save(KEYS.ANALYTICS, data); }

export function loadMediaKit() {
  return load(KEYS.MEDIA_KIT) || {
    stats: { tiktok: '0', instagram: '0', facebook: '0', totalReach: '0', engagementRate: '0' },
    demographics: { age1824: 28, age2534: 42, age3544: 22, age45plus: 8, femalePercent: 62, malePercent: 38 },
    contactName: 'Discover KW',
    contactEmail: 'hello@discoverkw.ca',
    contactPhone: '(519) 000-0000',
    website: 'www.discoverkw.ca',
  };
}
export function saveMediaKit(data) { save(KEYS.MEDIA_KIT, data); }

export function loadHashtags() {
  return load(KEYS.HASHTAGS) || [
    { id: '1', pillar: 'Hidden Gems', name: 'Hidden Gems Set', tags: '#KWHiddenGems #KitchenerWaterloo #ExplorKW #KWLocal #HiddenGemsKW #OntarioLocal #KWOntario #DiscoverKW' },
    { id: '2', pillar: 'New in KW', name: 'New Opening Set', tags: '#NewInKW #KWOpening #KitchenerEats #WaterlooEats #KWFoodie #NewRestaurantKW #KWBusiness #DiscoverKW' },
    { id: '3', pillar: 'KW Life', name: 'Lifestyle Set', tags: '#KWLife #KitchenerLife #WaterlooLife #KWLiving #LocalLiving #KWCommunity #YourKW #DiscoverKW' },
    { id: '4', pillar: 'Business Spotlight', name: 'Business Feature Set', tags: '#KWBusiness #SupportLocal #KWEntrepreneur #LocalBusiness #KWShops #ShopLocalKW #KWMade #DiscoverKW' },
  ];
}
export function saveHashtags(tags) { save(KEYS.HASHTAGS, tags); }

export function loadCaptions() {
  return load(KEYS.CAPTIONS) || [
    { id: '1', pillar: 'Hidden Gems', title: 'Hidden Gem Reveal', template: '✨ You\'ve been sleeping on [PLACE NAME] in [NEIGHBOURHOOD]! This [TYPE OF PLACE] has been a local secret for [TIME PERIOD] — but not anymore. [ONE SENTENCE DESCRIPTION]. Drop this post on a friend who needs to know! 👇\n\n[HASHTAGS]' },
    { id: '2', pillar: 'New in KW', title: 'Grand Opening', template: '🆕 [BUSINESS NAME] just opened in [LOCATION] and KW is HERE for it! 🎉 [WHAT THEY OFFER] — perfect for [TARGET AUDIENCE]. Go show them some love! Tag someone you\'d bring here 👇\n\n[HASHTAGS]' },
    { id: '3', pillar: 'KW Life', title: 'Weekend Activity', template: '🌟 Your KW weekend sorted! [ACTIVITY/EVENT] is happening at [LOCATION] on [DATE/TIME]. [ONE SENTENCE ABOUT WHY IT\'S GREAT]. Who\'s going? Drop a 🙋 below!\n\n[HASHTAGS]' },
    { id: '4', pillar: 'Business Spotlight', title: 'Business Feature', template: '🌟 Meet [BUSINESS NAME] — [OWNER NAME]\'s passion project right here in KW! They offer [PRODUCTS/SERVICES] and what makes them special is [UNIQUE SELLING POINT]. Support local and check them out at [LOCATION/WEBSITE] 💛\n\n[HASHTAGS]' },
    { id: '5', pillar: 'Hidden Gems', title: 'Best Kept Secret', template: '🤫 KW\'s best kept secret? [PLACE/THING]. If you know, you know. If you don\'t — well, you\'re welcome. 😉 [BRIEF DESCRIPTION]. Save this post for your next [OCCASION]!\n\n[HASHTAGS]' },
  ];
}
export function saveCaptions(captions) { save(KEYS.CAPTIONS, captions); }

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
