/**
 * Colorit - Navbar Customization (Search Bar Background Preserved)
 * This version explicitly preserves the default white search bar background
 */

(function() {
    'use strict';

    let colorit_settings_cache = null;
    let colorit_styles_applied = false;

    /**
     * Fetch settings from server
     */
    function fetchColoritSettings() {
        return new Promise((resolve) => {
            if (colorit_settings_cache) {
                resolve(colorit_settings_cache);
                return;
            }

            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Colorit Settings',
                    name: 'Colorit Settings'
                },
                callback: function(r) {
                    if (r.message) {
                        colorit_settings_cache = r.message;
                        resolve(r.message);
                    } else {
                        resolve({});
                    }
                },
                error: function() {
                    resolve({});
                }
            });
        });
    }

    /**
     * Create and inject custom CSS styles
     */
    function injectCustomStyles(settings) {
        // Remove existing colorit styles if any
        const existingStyle = document.getElementById('colorit-custom-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        let cssRules = [];

        // CSS Variables
        let cssVars = ':root {\n';
        let hasVars = false;

        if (settings.navbar_background_color) {
            cssVars += `    --colorit-navbar-bg: ${settings.navbar_background_color};\n`;
            hasVars = true;
        }
        
        if (settings.navbar_text_color) {
            cssVars += `    --colorit-navbar-text: ${settings.navbar_text_color};\n`;
            hasVars = true;
        }
        
        if (settings.search_menu_text_color) {
            cssVars += `    --colorit-search-text: ${settings.search_menu_text_color};\n`;
            hasVars = true;
        }
        
        cssVars += '}\n';
        
        if (hasVars) {
            cssRules.push(cssVars);
        }

        // 1. Navbar Background Color - EXCLUDE search bar completely
        if (settings.navbar_background_color) {
            cssRules.push(`
                /* ================================
                   NAVBAR BACKGROUND - NOT SEARCH BAR
                ================================ */
                
                /* Apply background to navbar */
                .navbar,
                .navbar.navbar-default,
                .navbar.navbar-expand-lg,
                nav.navbar,
                header.navbar {
                    background-color: var(--colorit-navbar-bg) !important;
                }
                
                /* ================================
                   PRESERVE SEARCH BAR BACKGROUND
                   Force search bar to keep WHITE background
                ================================ */
                
                /* Search input - white background like default Frappe */
                .navbar .navbar-search input[type="text"],
                .navbar .search-bar input[type="text"],
                .navbar input#navbar-search,
                header.navbar input.form-control[type="text"],
                header.navbar .navbar-search input,
                .navbar input.form-control,
                .navbar .form-control[type="text"],
                #navbar-search,
                .search-bar input {
                    background-color: #ffffff !important;
                    background: #ffffff !important;
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                }
                
                /* Search input focus state - slightly brighter */
                .navbar .navbar-search input[type="text"]:focus,
                .navbar input#navbar-search:focus,
                header.navbar input.form-control[type="text"]:focus,
                .search-bar input:focus {
                    background-color: #ffffff !important;
                    background: #ffffff !important;
                    border-color: rgba(0, 0, 0, 0.2) !important;
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1) !important;
                }
                
                /* Search container background preservation */
                .navbar .navbar-search,
                .navbar .search-bar,
                header.navbar .navbar-search,
                header.navbar .search-bar {
                    background: transparent !important;
                }
            `);
        }

        // 2. Navbar Text Color - Links and icons only
        if (settings.navbar_text_color) {
            cssRules.push(`
                /* ================================
                   NAVBAR TEXT COLOR
                   All navbar text EXCEPT search input
                ================================ */
                
                /* Navbar links */
                .navbar a:not([class*="search"]):not(.dropdown-item):not(.awesomplete *),
                .navbar .navbar-nav > li > a,
                .navbar .nav > li > a,
                .navbar-nav > li > a,
                header.navbar .navbar-nav > li > a,
                header.navbar a.navbar-brand {
                    color: var(--colorit-navbar-text) !important;
                }
                
                /* Navbar text elements */
                .navbar span:not([class*="search"]):not(.awesomplete *),
                .navbar .navbar-text,
                header.navbar .navbar-text {
                    color: var(--colorit-navbar-text) !important;
                }
                
                /* Breadcrumbs */
                .navbar .breadcrumb-item,
                .navbar .breadcrumb-item a,
                .navbar .breadcrumb-item::before {
                    color: var(--colorit-navbar-text) !important;
                }
                
                /* Brand */
                .navbar .navbar-brand,
                .navbar .navbar-brand span,
                .navbar .navbar-brand a {
                    color: var(--colorit-navbar-text) !important;
                }
                
                /* Icons */
                .navbar .navbar-nav > li > a .icon,
                .navbar .nav > li > a .icon,
                header.navbar .navbar-nav > li > a svg,
                .navbar svg:not(.awesomplete svg) {
                    color: var(--colorit-navbar-text) !important;
                    fill: var(--colorit-navbar-text) !important;
                }
                
                /* Dropdowns */
                .navbar .dropdown-toggle,
                header.navbar .dropdown-toggle {
                    color: var(--colorit-navbar-text) !important;
                }
                
                /* Hover states */
                .navbar .navbar-nav > li > a:hover,
                .navbar .navbar-nav > li > a:focus,
                header.navbar .navbar-nav > li > a:hover {
                    color: var(--colorit-navbar-text) !important;
                }
            `);
        }

        // 3. Search Text Color - Only the text inside search, not background
        if (settings.search_menu_text_color) {
            cssRules.push(`
                /* ================================
                   SEARCH TEXT COLOR ONLY
                   Background stays white, only text color changes
                ================================ */
                
                /* Search input text color */
                .navbar .navbar-search input[type="text"],
                .navbar .search-bar input[type="text"],
                .navbar input#navbar-search,
                header.navbar input.form-control[type="text"],
                header.navbar .navbar-search input,
                .search-bar input {
                    color: var(--colorit-search-text) !important;
                }
                
                /* Search placeholder */
                .navbar .navbar-search input[type="text"]::placeholder,
                .navbar .search-bar input[type="text"]::placeholder,
                .navbar input#navbar-search::placeholder,
                header.navbar input.form-control[type="text"]::placeholder,
                .search-bar input::placeholder {
                    color: var(--colorit-search-text) !important;
                    opacity: 0.5;
                }
                
                /* Search dropdown text */
                .navbar .awesomplete ul li,
                .awesomplete > ul > li,
                .search-results .result,
                .search-results .search-result-item {
                    color: var(--colorit-search-text) !important;
                }
                
                /* Search result titles */
                .search-results .result-title,
                .search-results .result-description,
                .awesomplete > ul > li .result-title {
                    color: var(--colorit-search-text) !important;
                }
                
                /* Highlighted text */
                .awesomplete > ul > li mark,
                .awesomplete > ul > li[aria-selected="true"] {
                    color: var(--colorit-search-text) !important;
                }
                
                /* Hover state */
                .navbar .awesomplete ul li:hover {
                    color: var(--colorit-search-text) !important;
                }
            `);
        }

        // 4. Hide Help Menu
        if (settings.hide_help_menu) {
            cssRules.push(`
                /* ================================
                   HIDE HELP MENU
                ================================ */
                [data-label="Help"],
                .help-dropdown,
                .dropdown-help,
                .navbar .dropdown-help,
                .navbar-nav .dropdown-help,
                li.dropdown.dropdown-help,
                header.navbar li.dropdown-help {
                    display: none !important;
                    visibility: hidden !important;
                }
            `);
        }

        // Inject styles
        if (cssRules.length > 0) {
            const styleElement = document.createElement('style');
            styleElement.id = 'colorit-custom-styles';
            styleElement.type = 'text/css';
            styleElement.textContent = cssRules.join('\n');
            document.head.appendChild(styleElement);
            colorit_styles_applied = true;
            
            console.log('[Colorit] Styles applied successfully');
        }
    }

    /**
     * Apply colorit
     */
    function applyColorit() {
        fetchColoritSettings().then(settings => {
            if (settings && Object.keys(settings).length > 0) {
                injectCustomStyles(settings);
            }
        });
    }

    /**
     * Initialize
     */
    function initColorit() {
        let attempts = 0;
        const maxAttempts = 40;
        
        const checkNavbar = setInterval(() => {
            attempts++;
            const navbar = document.querySelector('.navbar, header.navbar');
            
            if (navbar) {
                clearInterval(checkNavbar);
                setTimeout(applyColorit, 100);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkNavbar);
                applyColorit();
            }
        }, 50);
    }

    /**
     * Re-apply
     */
    function reapplyColorit() {
        colorit_settings_cache = null;
        colorit_styles_applied = false;
        applyColorit();
    }

    /**
     * Form handlers
     */
    if (typeof frappe !== 'undefined' && frappe.ui && frappe.ui.form) {
        frappe.ui.form.on('Colorit Settings', {
            refresh: function(frm) {
                frm.add_custom_button(__('Preview Changes'), function() {
                    colorit_settings_cache = frm.doc;
                    colorit_styles_applied = false;
                    applyColorit();
                    frappe.show_alert({
                        message: __('Preview applied. Save to make permanent.'),
                        indicator: 'blue'
                    }, 5);
                });
            },
            after_save: function(frm) {
                reapplyColorit();
                frappe.show_alert({
                    message: __('Navbar customization applied! Reloading...'),
                    indicator: 'green'
                }, 2);
                
                setTimeout(function() {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initColorit);
    } else {
        initColorit();
    }

    if (typeof frappe !== 'undefined') {
        frappe.ready(initColorit);
        $(document).on('page-change', function() {
            setTimeout(initColorit, 100);
        });
    }

})();