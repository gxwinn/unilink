// Router for SPA navigation

const PUBLIC_ROUTES = ['/login', '/register'];

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        // Use hash navigation when running from file:// or when the app is served from a subpath
        // (e.g., GitHub Pages serves the site under https://username.github.io/repo/).
        const isFileProtocol = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
        const isSubpath = (typeof window !== 'undefined' && window.location && window.location.pathname && window.location.pathname !== '/' && !window.location.pathname.endsWith('/index.html'));
        this.useHash = isFileProtocol || isSubpath;
        this.init();
    }

    init() {
        // Handle initial load
        window.addEventListener('load', () => {
            this.handleRoute();
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    if (this.useHash) {
                        // Use hash navigation for file:// or unsupported pushState
                        window.location.hash = href;
                    } else {
                        this.navigate(href);
                    }
                }
            }
        });

        // Hash change fallback (for file://)
        window.addEventListener('hashchange', () => {
            if (this.useHash) this.handleRoute();
        });
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        if (path === this.currentRoute) return;

        if (this.useHash) {
            window.location.hash = path;
            return;
        }

        try {
            window.history.pushState({}, '', path);
            this.handleRoute();
        } catch (err) {
            // Fallback to hash-based navigation when pushState is not available (e.g., file://)
            window.location.hash = path;
        }
    }

    handleRoute() {
        const path = this.useHash ? (window.location.hash ? window.location.hash.slice(1) : '/') : (window.location.pathname || '/');
        this.currentRoute = path;

        const isPublic = PUBLIC_ROUTES.some(route => this.matchRoute(path, route));
        const authed = typeof isUserAuthenticated === 'function' ? isUserAuthenticated() : true;

        if (!isPublic && !authed) {
            if (path !== '/login') {
                this.navigate('/login');
                return;
            }
        }

        if (isPublic && authed) {
            if (path !== '/' && path !== '/home') {
                this.navigate('/home');
                return;
            }
        }

        // Find matching route
        let matched = false;
        for (const route in this.routes) {
            if (this.matchRoute(path, route)) {
                const handler = this.routes[route];
                const params = this.extractParams(path, route);
                handler(params);
                matched = true;
                break;
            }
        }

        if (!matched) {
            const fallback = authed ? '/home' : '/login';
            this.navigate(fallback);
        }
    }

    matchRoute(path, route) {
        // Exact match
        if (path === route) {
            return true;
        }

        // Pattern match (e.g., /post/:id)
        const routePattern = route.replace(/:[^/]+/g, '([^/]+)');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(path);
    }

    extractParams(path, route) {
        const params = {};
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.slice(1);
                params[paramName] = pathParts[index];
            }
        });

        return params;
    }
}

const router = new Router();

// Make router globally available
window.router = router;

