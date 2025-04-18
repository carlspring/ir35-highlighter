(() => {
    const allowedHosts = [
        "adzuna.co.uk",
        "cwjobs.co.uk",
        "hackajob.com",
        "indeed.com",
        "indeed.co.uk",
        "jobserve.com",
        "linkedin.com",
        "mail.google.com",
        "monster.co.uk",
        "reed.co.uk",
        "offpayroll.org.uk",
        "totaljobs.com"
    ];

    const currentHost = window.location.hostname.toLowerCase();
    const isAllowed = allowedHosts.some(allowed =>
        currentHost === allowed || currentHost.endsWith(`.${allowed}`)
    );

    if (!isAllowed) {
        console.debug(`[Keyword Highlighter] Skipping ${currentHost} (not in allowedHosts)`);
        return;
    }

    const highlightTerms = {
        "Inside IR35": "red-highlight",
        "Via umbrella": "red-highlight",
        "Umbrella": "red-highlight",
        "Outside IR35": "green-highlight",
        "Remote work": "green-highlight",
        "100% Remote": "green-highlight",
        "Fully remote": "green-highlight",
        "Remote": "green-highlight",
        "Work Remotely": "green-highlight",
        "Remotely": "green-highlight",
        "Hybrid working": "red-highlight",
        "Hybrid work": "red-highlight",
        "Hybrid": "red-highlight",
        "Via Umbrella": "red-highlight",
        "Umbrella Only": "red-highlight",
        "On site": "red-highlight",
        "on-site": "red-highlight",
        "Permanent position": "red-highlight",
        "Permanent role": "red-highlight",
        "Permanent": "red-highlight",
        "Competitive salary": "red-highlight",
        "BPSS": "security-clearance-highlight",
        "Security Clearance": "security-clearance-highlight",
        "Security Cleared": "security-clearance-highlight",
        "Clearance Required": "security-clearance-highlight",
        "SC Clearance": "security-clearance-highlight",
        "SC Cleared": "security-clearance-highlight",
        "DV Cleared": "security-clearance-highlight"
    };

    const termToClassMap = Object.entries(highlightTerms).reduce((acc, [term, className]) => {
        acc[term.toLowerCase()] = className;
        return acc;
    }, {});

    function highlightTextNode(node) {
        try {
            if (
                !node.nodeValue ||
                node.parentNode.querySelector("mark") ||
                node.parentNode.nodeType !== Node.ELEMENT_NODE
            ) {
                return;
            }

            const text = node.nodeValue;
            const lowerText = text.toLowerCase();
            let newHTML = text;
            let modified = false;

            for (const [termLower, className] of Object.entries(termToClassMap)) {
                const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');

                if (regex.test(lowerText)) {
                    newHTML = newHTML.replace(regex, `<mark class="${className}">$1</mark>`);
                    modified = true;
                }
            }

            if (modified) {
                const span = document.createElement('span');
                span.innerHTML = newHTML;
                node.parentNode.replaceChild(span, node);
            }
        } catch (e) {
            console.warn("[IR35 Highlighter] Error in highlightTextNode:", e);
        }
    }

    function highlightPage(root = document.body) {
        if (!root) return;
        try {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            const nodes = [];

            while (walker.nextNode()) {
                nodes.push(walker.currentNode);
            }

            for (const node of nodes) {
                if (
                    node.parentNode &&
                    !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.nodeName)
                ) {
                    highlightTextNode(node);
                }
            }
        } catch (e) {
            console.warn("[Keyword Highlighter] Error in highlightPage:", e);
        }
    }

    // Throttle logic to avoid infinite loops
    let throttleTimeout = null;

    function throttledHighlight() {
        if (throttleTimeout) return;
        throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
            highlightPage();
        }, 500); // run once every 500ms max
    }

    function observeDOMChanges() {
        try {
            if (!document.body) return;
            const observer = new MutationObserver(throttledHighlight);
            observer.observe(document.body, {childList: true, subtree: true});
        } catch (e) {
            console.warn("[Keyword Highlighter] Error in observeDOMChanges:", e);
        }
    }

    // Init
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            highlightPage();
            observeDOMChanges();
        });
    } else {
        highlightPage();
        observeDOMChanges();
    }
})();
