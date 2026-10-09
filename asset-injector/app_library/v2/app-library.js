function registerGalleryComponents() {
  
  // Shared Sanitizer & Cache Config
  const API_URL = 'https://script.google.com/macros/s/AKfycbyMKUIPeQHlMEk5gda9q3Phr5AbJkHAf71pmNHRxP_G8E0smZHjRIXf-ntQiyGlrxFJ/exec';
  const CACHE_KEY = 'sdo_gallery_session_cache';

  function sanitizeUrl(url) {
    if (!url) return '#';
    const clean = String(url).trim();
    if (clean.startsWith('https://') || clean.startsWith('http://') || clean.startsWith('/')) {
      return clean;
    }
    return '#';
  }

  // Helper to fetch data into SessionStorage
  async function fetchGalleryData() {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const data = await response.json();

    const sanitized = data.map(item => ({
      ...item,
      url: sanitizeUrl(item.url),
      image_url: sanitizeUrl(item.image_url),
      tagList: item.tags ? String(item.tags).split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
    }));

    sessionStorage.setItem(CACHE_KEY, JSON.stringify(sanitized));
    return sanitized;
  }

  // Component 1: Main Gallery Application
  Alpine.data('sdoGalleryApp', () => ({
    apps: [],
    loading: true,
    searchQuery: '',
    selectedCategory: 'all',
    selectedTags: [],
    availableTags: [],
    showTags: false,

    categories: [
      { id: 'overview', name: 'Overview and Maps', desc: 'High-level statewide summaries, municipal boundary maps, and featured tools.' },
      { id: 'pop-totals', name: 'Population Totals & Demographics', desc: 'Track population totals, age distribution, race/ethnicity estimates, and regional trends.' },
      { id: 'births-deaths', name: 'Births & Deaths (Components of Change)', desc: 'Explore births, deaths, and net migration components of population change.' },
      { id: 'migration', name: 'Migration & Geographic Mobility', desc: 'Visualize migration patterns, working age mobility, and state-to-state movement.' },
      { id: 'housing', name: 'Housing & Households', desc: 'Explore housing stock, residential growth, and localized Housing Needs Assessments (HNA).' },
      { id: 'census', name: 'Census Applications', desc: 'Decennial census results, American Community Survey (ACS) interactive maps, and data overviews.' },
      { id: 'economy', name: 'Economy & Jobs Applications', desc: 'Dashboards and maps tracking employment sectors, base industry dynamics, and local unemployment rates.' },
      { id: 'program', name: 'Program Applications', desc: 'Specialized mapping tools supporting state grant programs, community development, and economic designation zones.' }
    ],

    async init() {
      try {
        this.apps = await fetchGalleryData();
        this.extractTags();
      } catch (err) {
        console.error('SDO Gallery Error:', err);
      } finally {
        this.loading = false;
      }
    },

    refreshCache() {
      sessionStorage.removeItem(CACHE_KEY);
      this.init();
    },

    extractTags() {
      const set = new Set();
      this.apps.forEach(a => {
        if (a.tagList) a.tagList.forEach(t => set.add(t));
      });
      this.availableTags = Array.from(set).sort();
    },

    toggleTag(tag) {
      if (this.selectedTags.includes(tag)) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
      } else {
        this.selectedTags.push(tag);
      }
    },

    get filteredApps() {
      return this.apps.filter(app => {
        const q = this.searchQuery.toLowerCase().trim();
        const matchSearch = !q || 
          (app.title && String(app.title).toLowerCase().includes(q)) ||
          (app.description && String(app.description).toLowerCase().includes(q)) ||
          (app.region && String(app.region).toLowerCase().includes(q)) ||
          (app.tags && String(app.tags).toLowerCase().includes(q));

        const matchTags = this.selectedTags.length === 0 || 
          this.selectedTags.every(tag => app.tagList && app.tagList.includes(tag));

        return matchSearch && matchTags;
      });
    },

    getVisibleAppsForCat(catId) {
      return this.filteredApps.filter(app => app.category_id === catId);
    }
  }));

  // Component 2: Secondary Subpage Application Strip
  Alpine.data('sdoAppStrip', (config = {}) => ({
    apps: [],
    loading: true,

    category: config.category || 'all',
    tags: config.tags || [],
    limit: config.limit || 0,
    galleryUrl: config.galleryUrl || '/visualizations-and-interactive-maps',

    async init() {
      try {
        this.apps = await fetchGalleryData();
      } catch (err) {
        console.error('SDO Strip Error:', err);
      } finally {
        this.loading = false;
      }
    },

    get items() {
      let filtered = this.apps.filter(app => {
        const matchCat = this.category === 'all' || app.category_id === this.category;
        const reqTags = Array.isArray(this.tags) ? this.tags : [this.tags].filter(Boolean);
        const matchTags = reqTags.length === 0 || 
          reqTags.every(t => app.tagList && app.tagList.includes(String(t).toLowerCase()));

        return matchCat && matchTags;
      });

      if (this.limit && this.limit > 0) {
        filtered = filtered.slice(0, this.limit);
      }

      return filtered;
    },

    get targetGalleryUrl() {
      if (this.category && this.category !== 'all') {
        return `${this.galleryUrl}#${this.category}`;
      }
      return this.galleryUrl;
    }
  }));
}

if (window.Alpine) {
  registerGalleryComponents();
} else {
  document.addEventListener('alpine:init', registerGalleryComponents);
}