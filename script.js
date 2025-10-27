/**
 * Seasonal Recipe Planner JavaScript
 * Enhanced functionality for Chrome compatibility and mobile experience
 */

(function() {
    'use strict';

    // DOM Ready function - Cross-browser compatible
    function domReady(fn) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(fn, 1);
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // Smooth scrolling for navigation links (Chrome optimized)
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Use native smooth scroll if supported (Chrome has excellent support)
                    if ('scrollBehavior' in document.documentElement.style) {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                    } else {
                        // Fallback for older browsers
                        const targetPosition = targetElement.offsetTop - 20;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Update URL without triggering scroll
                    if (history.pushState) {
                        history.pushState(null, null, `#${targetId}`);
                    }
                    
                    // Focus management for accessibility
                    targetElement.focus({ preventScroll: true });
                }
            });
        });
    }

    // Image lazy loading and error handling
    function initImageOptimization() {
        const images = document.querySelectorAll('.img-wrap img');
        
        // Native lazy loading for Chrome
        if ('loading' in HTMLImageElement.prototype) {
            images.forEach(img => {
                img.loading = 'lazy';
            });
        } else {
            // Intersection Observer fallback
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px'
                });

                images.forEach(img => imageObserver.observe(img));
            }
        }

        // Error handling for broken images
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                
                // Create fallback element
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback';
                fallback.innerHTML = '📸 Image unavailable';
                fallback.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    background: #f5f5f5;
                    color: #666;
                    font-size: 14px;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                `;
                
                this.parentNode.appendChild(fallback);
            });
            
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        });
    }

    // Mobile navigation enhancements
    function initMobileNavigation() {
        const nav = document.querySelector('nav');
        const navLinks = nav.querySelectorAll('a');
        
        // Add touch feedback
        navLinks.forEach(link => {
            link.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            link.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, { passive: true });
        });

        // Handle orientation changes
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                // Recalculate layout after orientation change
                window.scrollTo(0, window.scrollY);
            }, 100);
        });
    }

    // Enhanced accessibility features
    function initAccessibility() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
            font-size: 14px;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const container = document.querySelector('.container');
        if (container && !container.id) {
            container.id = 'main-content';
            container.setAttribute('tabindex', '-1');
        }

        // Improve heading structure for screen readers
        const sections = document.querySelectorAll('section.season');
        sections.forEach((section, index) => {
            section.setAttribute('aria-label', `Season ${index + 1}`);
        });

        // Add ARIA labels to recipe cards
        const recipes = document.querySelectorAll('.card');
        recipes.forEach(card => {
            const recipeTitle = card.querySelector('h3.recipe');
            if (recipeTitle) {
                card.setAttribute('aria-labelledby', recipeTitle.textContent.toLowerCase().replace(/\s+/g, '-'));
                recipeTitle.id = recipeTitle.textContent.toLowerCase().replace(/\s+/g, '-');
            }
        });
    }

    // Print optimization
    function initPrintOptimization() {
        // Optimize images for printing
        window.addEventListener('beforeprint', function() {
            const images = document.querySelectorAll('.img-wrap img');
            images.forEach(img => {
                img.style.maxHeight = '300px';
                img.style.pageBreakInside = 'avoid';
            });
        });

        // Add print button (optional)
        const printButton = document.createElement('button');
        printButton.textContent = '🖨️ Print Recipe Collection';
        printButton.className = 'print-button';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--accent);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            display: none;
        `;
        
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        // Show print button on larger screens
        function togglePrintButton() {
            if (window.innerWidth > 768) {
                printButton.style.display = 'block';
            } else {
                printButton.style.display = 'none';
            }
        }
        
        togglePrintButton();
        window.addEventListener('resize', togglePrintButton);
        
        document.body.appendChild(printButton);
    }

    // Search functionality (simple client-side search)
    function initSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="search" 
                   id="recipe-search" 
                   placeholder="Search recipes..." 
                   aria-label="Search recipes"
                   style="
                       width: 100%;
                       max-width: 300px;
                       padding: 10px 15px;
                       border: 2px solid var(--border-light);
                       border-radius: 25px;
                       font-size: 14px;
                       margin: 10px 0;
                       transition: border-color 0.2s ease;
                   ">
        `;
        
        const nav = document.querySelector('nav');
        nav.parentNode.insertBefore(searchContainer, nav.nextSibling);
        
        const searchInput = document.getElementById('recipe-search');
        const allCards = document.querySelectorAll('.card');
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--accent)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'var(--border-light)';
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            allCards.forEach(card => {
                const recipeTitle = card.querySelector('h3.recipe')?.textContent.toLowerCase() || '';
                const ingredients = Array.from(card.querySelectorAll('.ing-list li'))
                    .map(li => li.textContent.toLowerCase()).join(' ');
                const instructions = Array.from(card.querySelectorAll('.instructions li'))
                    .map(li => li.textContent.toLowerCase()).join(' ');
                
                const matchesSearch = searchTerm === '' || 
                    recipeTitle.includes(searchTerm) ||
                    ingredients.includes(searchTerm) ||
                    instructions.includes(searchTerm);
                
                if (matchesSearch) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
            
            // Show/hide season sections based on visible cards
            const sections = document.querySelectorAll('section.season');
            sections.forEach(section => {
                const visibleCards = section.querySelectorAll('.card[style*="display: block"], .card:not([style*="display: none"])');
                section.style.display = visibleCards.length > 0 ? 'block' : 'none';
            });
        });
    }

    // =============================
    // Weekly Planner & Grocery List
    // =============================
    function slugify(str) {
        return (str || '')
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    function normalizeIngredient(text) {
        if (!text) return '';
        const t = text
            .replace(/\s+/g, ' ')
            .replace(/^[\-•\s]+/, '')
            .trim();
        return t.toLowerCase();
    }

    function getSelectedRecipeIds() {
        try { return JSON.parse(localStorage.getItem('rp:selectedRecipes') || '[]'); } catch { return []; }
    }
    function setSelectedRecipeIds(ids) {
        localStorage.setItem('rp:selectedRecipes', JSON.stringify(Array.from(new Set(ids))));
    }
    function getPurchasedKeys() {
        try { return new Set(JSON.parse(localStorage.getItem('rp:purchasedGroceries') || '[]')); } catch { return new Set(); }
    }
    function setPurchasedKeys(keysSet) {
        localStorage.setItem('rp:purchasedGroceries', JSON.stringify(Array.from(keysSet)));
    }

    function injectSelectionToggles() {
        const selected = new Set(getSelectedRecipeIds());
        const cards = document.querySelectorAll('article.card');
        cards.forEach(card => {
            const titleEl = card.querySelector('h3.recipe');
            if (!titleEl) return;
            const id = slugify(titleEl.textContent);
            card.dataset.recipeId = id;

            // Place the toggle near meta line or at top of card
            let meta = card.querySelector('.meta');
            if (!meta) {
                meta = document.createElement('div');
                meta.className = 'meta';
                card.insertBefore(meta, card.firstChild);
            }

            const wrap = document.createElement('span');
            wrap.className = 'select-recipe-wrap';
            const cbId = `select-${id}`;
            wrap.innerHTML = `
                <input type="checkbox" id="${cbId}" class="select-recipe" aria-label="Select recipe ${titleEl.textContent}">
                <label for="${cbId}">Select for week</label>
            `;
            const input = wrap.querySelector('input');
            input.checked = selected.has(id);
            input.addEventListener('change', () => {
                const ids = new Set(getSelectedRecipeIds());
                if (input.checked) ids.add(id); else ids.delete(id);
                setSelectedRecipeIds(Array.from(ids));
                updateGroceryState();
            });
            meta.appendChild(wrap);
        });
    }

    function collectGroceryItems() {
        const ids = new Set(getSelectedRecipeIds());
        const map = new Map(); // key: normalized, value: {display, count}
        const titles = [];

        document.querySelectorAll('article.card').forEach(card => {
            const id = card.dataset.recipeId;
            if (!id || !ids.has(id)) return;
            const title = card.querySelector('h3.recipe')?.textContent?.trim();
            if (title) titles.push(title);
            card.querySelectorAll('.ing-list li').forEach(li => {
                const display = li.textContent.trim();
                const key = normalizeIngredient(display);
                if (!key) return;
                if (map.has(key)) {
                    map.get(key).count += 1;
                } else {
                    map.set(key, { display, count: 1 });
                }
            });
        });

        return { items: map, titles };
    }

    function renderGroceryDrawer() {
        const overlay = document.getElementById('grocery-overlay');
        const drawer = document.getElementById('grocery-drawer');
        const itemsUl = document.getElementById('grocery-items');
        const empty = document.getElementById('grocery-empty');
        const tags = document.getElementById('selected-recipes-tags');
        const countEl = document.getElementById('selected-recipes-count');

        const purchased = getPurchasedKeys();
        const { items, titles } = collectGroceryItems();
        const entries = Array.from(items.entries());

        // Update recipe tags and count
        countEl.textContent = `${titles.length} recipe${titles.length === 1 ? '' : 's'} selected`;
        tags.innerHTML = titles.map(t => `<span class="tag">${t}</span>`).join('');

        // Render list
        itemsUl.innerHTML = '';
        if (entries.length === 0) {
            empty.style.display = 'block';
        } else {
            empty.style.display = 'none';
            entries.sort((a,b) => a[0].localeCompare(b[0]));
            entries.forEach(([key, val]) => {
                const li = document.createElement('li');
                li.dataset.key = key;
                const checked = purchased.has(key);
                if (checked) li.classList.add('purchased');
                const label = val.count > 1 ? `${val.display} (x${val.count})` : val.display;
                li.innerHTML = `
                    <input type="checkbox" ${checked ? 'checked' : ''} aria-label="Mark purchased: ${label}">
                    <span class="text">${label}</span>
                `;
                const input = li.querySelector('input');
                input.addEventListener('change', () => {
                    if (input.checked) purchased.add(key); else purchased.delete(key);
                    setPurchasedKeys(purchased);
                    li.classList.toggle('purchased', input.checked);
                    updateFabBadge();
                });
                itemsUl.appendChild(li);
            });
        }

        // Ensure visibility state reflects open/closed
        if (!drawer.hasAttribute('hidden')) {
            drawer.classList.add('open');
            overlay.classList.add('open');
        }
    }

    function buildListText() {
        const { items, titles } = collectGroceryItems();
        const entries = Array.from(items.values())
            .map(v => v.count > 1 ? `${v.display} (x${v.count})` : v.display);
        const header = `Groceries for ${titles.length} recipe${titles.length===1?'':'s'}`;
        const recipesLine = titles.length ? `Recipes: ${titles.join(', ')}` : '';
        return [header, recipesLine, '', ...entries.map(e => `• ${e}`)].filter(Boolean).join('\n');
    }

    function updateFabBadge() {
        const fab = document.getElementById('grocery-fab');
        if (!fab) return;
        const { items } = collectGroceryItems();
        const purchased = getPurchasedKeys();
        const total = items.size;
        const bought = Array.from(items.keys()).filter(k => purchased.has(k)).length;
        const remaining = Math.max(0, total - bought);
        fab.textContent = remaining > 0 ? `🛒 Grocery List (${remaining})` : '🛒 Grocery List';
    }

    function initGroceryActions() {
        const feedback = document.getElementById('grocery-feedback');
        const setMsg = msg => { feedback.textContent = msg; setTimeout(() => feedback.textContent = '', 2000); };

        document.getElementById('grocery-copy')?.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(buildListText()); setMsg('Copied to clipboard'); } catch { setMsg('Copy failed'); }
        });

        document.getElementById('grocery-share')?.addEventListener('click', async () => {
            const text = buildListText();
            if (navigator.share) {
                try { await navigator.share({ title: 'Grocery List', text }); setMsg('Shared'); } catch { /* user canceled */ }
            } else {
                try { await navigator.clipboard.writeText(text); setMsg('Copied (share unavailable)'); } catch { setMsg('Share unavailable'); }
            }
        });

        document.getElementById('grocery-sms')?.addEventListener('click', () => {
            const text = encodeURIComponent(buildListText());
            const ua = navigator.userAgent || '';
            const isIOS = /iPad|iPhone|iPod/.test(ua);
            const href = isIOS ? `sms:&body=${text}` : `sms:?body=${text}`;
            // Open SMS composer if available
            window.location.href = href;
        });

        document.getElementById('grocery-download')?.addEventListener('click', () => {
            const blob = new Blob([buildListText()], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'grocery-list.txt';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 0);
        });
    }

    function initGroceryUI() {
        const fab = document.getElementById('grocery-fab');
        const overlay = document.getElementById('grocery-overlay');
        const drawer = document.getElementById('grocery-drawer');
        const closeBtn = drawer?.querySelector('.drawer-close');

        function openDrawer() {
            drawer.removeAttribute('hidden');
            overlay.removeAttribute('hidden');
            drawer.classList.add('open');
            overlay.classList.add('open');
            renderGroceryDrawer();
            setTimeout(() => drawer.querySelector('#grocery-copy')?.focus(), 50);
        }
        function closeDrawer() {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            setTimeout(() => {
                drawer.setAttribute('hidden', '');
                overlay.setAttribute('hidden', '');
                fab?.focus();
            }, 200);
        }

        fab?.addEventListener('click', openDrawer);
        overlay?.addEventListener('click', closeDrawer);
        closeBtn?.addEventListener('click', closeDrawer);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !drawer.hasAttribute('hidden')) closeDrawer();
        });
    }

    function updateGroceryState() {
        // When selection changes, re-render drawer (if open) and update badge
        const drawer = document.getElementById('grocery-drawer');
        if (drawer && !drawer.hasAttribute('hidden')) renderGroceryDrawer();
        // Reset purchased set to only those that still exist (optional: clear all)
        const purchased = getPurchasedKeys();
        const { items } = collectGroceryItems();
        const validKeys = new Set(items.keys());
        const cleaned = new Set(Array.from(purchased).filter(k => validKeys.has(k)));
        setPurchasedKeys(cleaned);
        updateFabBadge();
    }

    // Performance monitoring (Chrome DevTools integration)
    function initPerformanceMonitoring() {
        if ('performance' in window && 'mark' in performance && 'measure' in performance) {
            performance.mark('recipe-app-start');
            
            window.addEventListener('load', function() {
                performance.mark('recipe-app-loaded');
                performance.measure('recipe-app-load-time', 'recipe-app-start', 'recipe-app-loaded');
                
                // Optional: Log performance metrics to console (for development)
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    const measure = performance.getEntriesByName('recipe-app-load-time')[0];
                    console.log(`Recipe app loaded in ${Math.round(measure.duration)}ms`);
                }
            });
        }
    }

    // Progressive Web App features
    function initPWAFeatures() {
        // Service Worker registration (basic caching)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Note: You would need to create a service-worker.js file for this to work
                // navigator.serviceWorker.register('/service-worker.js')
                //     .then(registration => console.log('SW registered'))
                //     .catch(error => console.log('SW registration failed'));
            });
        }

        // Add to home screen prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show custom install button
            const installButton = document.createElement('button');
            installButton.textContent = '📱 Add to Home Screen';
            installButton.className = 'install-button';
            installButton.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: var(--accent);
                color: white;
                border: none;
                padding: 10px 14px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
            `;
            
            installButton.addEventListener('click', async function() {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    deferredPrompt = null;
                    this.remove();
                }
            });
            
            document.body.appendChild(installButton);
        });
    }

    // Initialize all features when DOM is ready
    domReady(function() {
        initSmoothScrolling();
        initImageOptimization();
        initMobileNavigation();
        initAccessibility();
        initPrintOptimization();
        initSearch();
        // Weekly planner
        injectSelectionToggles();
        initGroceryUI();
        initGroceryActions();
        updateGroceryState();
        initPerformanceMonitoring();
        initPWAFeatures();
        
        // Add loaded class for CSS transitions
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        
        console.log('🍳 Seasonal Recipe Planner loaded successfully!');
    });

    // Export for potential external use
    window.RecipePlanner = {
        version: '1.1.0',
        init: domReady
    };

})();