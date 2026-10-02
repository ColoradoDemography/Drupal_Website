function registerGalleryApp() {
  Alpine.data('sdoGalleryApp', () => ({
    API_URL: 'https://script.google.com/macros/s/AKfycbyMKUIPeQHlMEk5gda9q3Phr5AbJkHAf71pmNHRxP_G8E0smZHjRIXf-ntQiyGlrxFJ/exec',
    CACHE_KEY: 'sdo_gallery_session_cache',

    apps: [],
    loading: true,
    searchQuery: '',
    selectedCategory: 'all',
    selectedTags: [],
    availableTags: [],
    showTags: false, // Collapsible drawer state

    categories: [
      { id: 'overview', name: 'Overview and Maps' },
      { id: 'pop-totals', name: 'Population Totals & Demographics' },
      { id: 'births-deaths', name: 'Births & Deaths (Components)' },
      { id: 'migration', name: 'Migration & Geographic Mobility' },
      { id: 'housing', name: 'Housing & Households' },
      { id: 'census', name: 'Census Applications' },
      { id: 'economy', name: 'Economy & Jobs Applications' },
      { id: 'program', name: 'Program Applications' }
    ],

    async init() {
      const cached = sessionStorage.getItem(this.CACHE_KEY);
      if (cached) {
        try {
          this.apps = JSON.parse(cached);
          if (Array.isArray(this.apps) && this.apps.length > 0) {
            this.extractTags();
            this.loading = false;
            return;
          }
        } catch (e) {
          sessionStorage.removeItem(this.CACHE_KEY);
        }
      }
      await this.fetchApps();
    },

    async fetchApps() {
      this.loading = true;
      try {
        const response = await fetch(this.API_URL);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const data = await response.json();

        this.apps = data.map(item => ({
          ...item,
          tagList: item.tags ? String(item.tags).split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
        }));

        sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(this.apps));
        this.extractTags();
      } catch (err) {
        console.error('SDO Gallery Fetch Error:', err);
      } finally {
        this.loading = false;
      }
    },

    refreshCache() {
      sessionStorage.removeItem(this.CACHE_KEY);
      this.fetchApps();
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
        const matchCat = this.selectedCategory === 'all' || app.category_id === this.selectedCategory;
        const q = this.searchQuery.toLowerCase().trim();
        const matchSearch = !q || 
          (app.title && String(app.title).toLowerCase().includes(q)) ||
          (app.description && String(app.description).toLowerCase().includes(q)) ||
          (app.region && String(app.region).toLowerCase().includes(q)) ||
          (app.tags && String(app.tags).toLowerCase().includes(q));

        const matchTags = this.selectedTags.length === 0 || 
          this.selectedTags.every(tag => app.tagList && app.tagList.includes(tag));

        return matchCat && matchSearch && matchTags;
      });
    }
  }));
}

if (window.Alpine) {
  registerGalleryApp();
} else {
  document.addEventListener('alpine:init', registerGalleryApp);
}