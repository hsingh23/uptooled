class PureDashboardLayout {
    static defaultOptions = {
        branding: {
            logoUrl: '',
            logoAltText: 'Logo',
            title: 'Dashboard',
            homeUrl: '/'
        },
        navigation: [],
        initialState: {
            sidebarCollapsed: false
        },
        features: {
            disableCollapsibleSidebar: false,
            hideNavigation: false,
            themeSwitcher: true
        },
        router: {
            navigate: (path) => {
                console.log(`Navigating to: ${path}`);
                window.location.hash = path;
            },
            getCurrentPath: () => window.location.hash || '#'
        },
        callbacks: {},
        theme: {
            defaultMode: 'light',
            availableThemes: [{ name: 'light' }, { name: 'dark' }]
        },
        sidebarWidth: 240,
        collapsedSidebarWidth: 0,
        mobileBottomTabs: false
    };

    constructor(containerElement, options = {}) {
        this.container = typeof containerElement === 'string' ? document.querySelector(containerElement) : containerElement;
        if (!this.container) throw new Error('Container element not found');
        this.options = this._mergeOptions(PureDashboardLayout.defaultOptions, options);
        this.elements = {};
        this.currentTheme = this.options.theme.defaultMode;
        this.isSidebarCollapsed = this.options.initialState.sidebarCollapsed;
        this.isMobile = window.innerWidth <= 768;
        this.sidebarOpen = false;
        this._bindMethods();
    }

    _bindMethods() {
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleTheme = this.toggleTheme.bind(this);
        this._handleResize = this._handleResize.bind(this);
        this._handleNavigation = this._handleNavigation.bind(this);
        this._updateActiveNavigation = this._updateActiveNavigation.bind(this);
    }

    _mergeOptions(defaults, userOptions) {
        const options = { ...defaults };
        for (const key in userOptions) {
            if (Object.prototype.hasOwnProperty.call(userOptions, key)) {
                const userValue = userOptions[key];
                if (options[key] && typeof options[key] === 'object' && !Array.isArray(options[key]) &&
                    userValue && typeof userValue === 'object' && !Array.isArray(userValue)) {
                    options[key] = { ...options[key], ...userValue };
                } else {
                    options[key] = userValue;
                }
            }
        }
        return options;
    }

    render() {
        this.container.innerHTML = '';
        this.container.classList.add('pure-dashboard-layout');
        this.container.setAttribute('data-theme', this.currentTheme);
        this.elements.header = this._createHeader();
        this.elements.main = this._createMain();
        this.elements.sidebar = this._createSidebar();
        this.elements.content = this._createContent();
        this.container.appendChild(this.elements.header);
        this.container.appendChild(this.elements.main);
        this.elements.main.appendChild(this.elements.sidebar);
        this.elements.main.appendChild(this.elements.content);
        if (this.options.mobileBottomTabs && this.isMobile) {
            this.elements.bottomTabs = this._createBottomTabs();
            this.container.appendChild(this.elements.bottomTabs);
        }
        this._attachEventListeners();
        this._updateActiveNavigation();
        this._handleResize();
    }

    _createHeader() {
        const header = document.createElement('header');
        header.className = 'pure-dashboard-header';
        const branding = document.createElement('div');
        branding.className = 'header-branding';
        if (!this.options.features.hideNavigation) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'sidebar-toggle-button';
            toggleButton.innerHTML = '☰';
            toggleButton.addEventListener('click', this.toggleSidebar);
            branding.appendChild(toggleButton);
        }
        if (this.options.branding.homeUrl) {
            const brandingLink = document.createElement('a');
            brandingLink.href = this.options.branding.homeUrl;
            if (this.options.branding.logoUrl) {
                const logo = document.createElement('img');
                logo.className = 'branding-logo';
                logo.src = this.options.branding.logoUrl;
                logo.alt = this.options.branding.logoAltText;
                brandingLink.appendChild(logo);
            }
            if (this.options.branding.title) {
                const title = document.createElement('span');
                title.className = 'branding-title';
                title.textContent = this.options.branding.title;
                brandingLink.appendChild(title);
            }
            branding.appendChild(brandingLink);
        }
        const actions = document.createElement('div');
        actions.className = 'header-actions';
        if (this.options.features.themeSwitcher) {
            const themeButton = document.createElement('button');
            themeButton.className = 'theme-switcher-button';
            themeButton.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
            themeButton.addEventListener('click', this.toggleTheme);
            actions.appendChild(themeButton);
        }
        if (this.options.callbacks.renderToolbarActions) {
            this.options.callbacks.renderToolbarActions(actions);
        }
        header.appendChild(branding);
        header.appendChild(actions);
        return header;
    }

    _createMain() {
        const main = document.createElement('div');
        main.className = 'dashboard-main';
        return main;
    }

    _createSidebar() {
        if (this.options.features.hideNavigation) {
            return document.createElement('div');
        }
        const sidebar = document.createElement('aside');
        sidebar.className = 'pure-dashboard-sidebar';
        if (this.isSidebarCollapsed && !this.isMobile) {
            sidebar.classList.add('sidebar-collapsed');
        }
        const nav = document.createElement('nav');
        nav.className = 'sidebar-navigation';
        const navList = document.createElement('ul');
        this._renderNavigationItems(this.options.navigation, navList);
        nav.appendChild(navList);
        sidebar.appendChild(nav);
        if (this.options.callbacks.renderSidebarFooter) {
            const footer = document.createElement('div');
            footer.className = 'sidebar-footer';
            this.options.callbacks.renderSidebarFooter(footer);
            sidebar.appendChild(footer);
        }
        return sidebar;
    }

    _createContent() {
        const content = document.createElement('main');
        content.className = 'pure-dashboard-content';
        const wrapper = document.createElement('div');
        wrapper.className = 'content-wrapper';
        content.appendChild(wrapper);
        return content;
    }

    _createBottomTabs() {
        if (!this.options.mobileBottomTabs) return null;
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'mobile-bottom-tabs';
        const tabsList = document.createElement('ul');
        tabsList.className = 'mobile-tab-list';
        const linkItems = this.options.navigation.filter(item => item.type === 'link');
        linkItems.slice(0,5).forEach(item => {
            const tabItem = document.createElement('li');
            tabItem.className = 'mobile-tab-item';
            const tabLink = document.createElement('a');
            tabLink.className = 'mobile-tab-link';
            tabLink.href = `#${item.segment}`;
            tabLink.dataset.segment = item.segment;
            const icon = document.createElement('div');
            icon.className = 'mobile-tab-icon';
            icon.innerHTML = this._getIconForItem(item);
            const text = document.createElement('span');
            text.textContent = item.title;
            tabLink.appendChild(icon);
            tabLink.appendChild(text);
            tabItem.appendChild(tabLink);
            tabsList.appendChild(tabItem);
            tabLink.addEventListener('click', (e) => {
                e.preventDefault();
                this._handleNavigation(item.segment);
            });
        });
        tabsContainer.appendChild(tabsList);
        return tabsContainer;
    }

    _renderNavigationItems(items, container) {
        container.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            switch(item.type) {
                case 'link':
                    const link = document.createElement('a');
                    link.className = 'nav-item-link';
                    link.href = `#${item.segment || ''}`;
                    link.dataset.segment = item.segment;
                    if (item.icon) {
                        const icon = document.createElement('div');
                        icon.className = 'nav-item-icon';
                        icon.innerHTML = item.icon;
                        link.appendChild(icon);
                    }
                    const text = document.createElement('span');
                    text.className = 'nav-item-text';
                    text.textContent = item.title;
                    link.appendChild(text);
                    link.addEventListener('click',(e)=>{
                        e.preventDefault();
                        this._handleNavigation(item.segment);
                    });
                    li.appendChild(link);
                    break;
                case 'header':
                    li.className = 'nav-item-header';
                    li.textContent = item.title;
                    break;
                case 'divider':
                    li.className = 'nav-item-divider';
                    break;
            }
            container.appendChild(li);
        });
    }

    _getIconForItem(item) {
        return item.icon || '•';
    }

    _attachEventListeners() {
        window.addEventListener('resize', this._debounce(this._handleResize, 200));
        window.addEventListener('hashchange', this._updateActiveNavigation);
    }

    _handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        if (wasMobile !== this.isMobile) {
            this.render();
        }
    }

    _handleNavigation(path) {
        if (this.options.router.navigate) {
            this.options.router.navigate(path);
        }
        if (this.isMobile && this.sidebarOpen) {
            this.toggleSidebar();
        }
        this.updateContent(path);
    }

    _updateActiveNavigation() {
        const currentPath = this.options.router.getCurrentPath().substring(1);
        this.elements.sidebar.querySelectorAll('.nav-item-link').forEach(link => {
            link.classList.toggle('nav-item-active', link.dataset.segment === currentPath);
        });
        if (this.elements.bottomTabs) {
            this.elements.bottomTabs.querySelectorAll('.mobile-tab-link').forEach(link => {
                link.classList.toggle('active', link.dataset.segment === currentPath);
            });
        }
        const hasActive = this.elements.sidebar.querySelector('.nav-item-active');
        if (!hasActive) {
            const firstLink = this.elements.sidebar.querySelector('.nav-item-link');
            if (firstLink) {
                firstLink.classList.add('nav-item-active');
                this.updateContent(firstLink.dataset.segment);
            }
        }
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.sidebarOpen = !this.sidebarOpen;
            this.elements.sidebar.classList.toggle('sidebar-open', this.sidebarOpen);
        } else {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
            this.elements.sidebar.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.container.setAttribute('data-theme', this.currentTheme);
        const themeButton = this.elements.header.querySelector('.theme-switcher-button');
        if (themeButton) {
            themeButton.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }

    getContentArea() {
        return this.elements.content.querySelector('.content-wrapper');
    }

    updateContent(page) {
        const contentArea = this.getContentArea();
        contentArea.innerHTML = `<h1>${page.charAt(0).toUpperCase() + page.slice(1)}</h1><p>This is the content for the ${page} page. You can populate this area with any HTML content, such as charts, tables, forms, or other components.</p>`;
    }

    destroy() {
        window.removeEventListener('resize', this._handleResize);
        window.removeEventListener('hashchange', this._updateActiveNavigation);
        this.container.innerHTML = '';
    }

    _debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
