(() => {
    const allowedHosts = [
        "adzuna.co.uk",
        "jobserve.com",
        "linkedin.com",
        "indeed.com",
        "indeed.co.uk",
        "mail.google.com",
        "offpayroll.org.uk",
        "totaljobs.com"
    ];

    const currentHost = window.location.hostname.toLowerCase();
    const isAllowed = allowedHosts.some(allowed =>
                                                 currentHost === allowed || currentHost.endsWith(`.${allowed}`)
    );

    if (!isAllowed)
    {
        console.debug(`[IR35 Highlighter] Skipping ${currentHost} (not in allowedHosts)`);
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
        "Clearance Required": "security-clearance-highlight",
        "SC Clearance": "security-clearance-highlight",
        "SC Cleared": "security-clearance-highlight",
        "DV Cleared": "security-clearance-highlight"
    };

    const termToClassMap = Object.entries(highlightTerms).reduce((acc, [term, className]) => {
        acc[term.toLowerCase()] = className;
        return acc;
    }, {});

    function highlightTextNode(node)
    {
        if (!node.nodeValue || node.parentNode.querySelector("mark")) return;

        const text = node.nodeValue;
        const lowerText = text.toLowerCase();
        let newHTML = text;
        let modified = false;

        for (const [termLower, className] of Object.entries(termToClassMap))
        {
            const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');

            if (regex.test(lowerText))
            {
                newHTML = newHTML.replace(regex, `<mark class="${className}">$1</mark>`);
                modified = true;
            }
        }

        if (modified)
        {
            const span = document.createElement('span');
            span.innerHTML = newHTML;
            node.parentNode.replaceChild(span, node);
        }
    }

    function highlightPage(root = document.body)
    {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];

        while (walker.nextNode())
        {
            nodes.push(walker.currentNode);
        }

        for (const node of nodes)
        {
            if (
                    node.parentNode &&
                    !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.nodeName)
            )
            {
                highlightTextNode(node);
            }
        }
    }

    // Throttle logic to avoid infinite loops
    let throttleTimeout = null;

    function throttledHighlight()
    {
        if (throttleTimeout) return;
        throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
            highlightPage();
        }, 500); // run once every 500ms max
    }

    function observeDOMChanges()
    {
        const observer = new MutationObserver(throttledHighlight);
        observer.observe(document.body, {childList: true, subtree: true});
    }

    // Init
    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", () => {
            highlightPage();
            observeDOMChanges();
        });
    }
    else
    {
        highlightPage();
        observeDOMChanges();
    }
})();
