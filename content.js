const highlightTerms = {
  "Inside IR35": "inside-ir35-highlight",
  "Outside IR35": "outside-ir35-highlight"
};

function highlightText(term, className) {
  const regex = new RegExp(`(${term})`, "gi");

  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];

  while (walk.nextNode()) {
    nodes.push(walk.currentNode);
  }

  for (const node of nodes) {
    const parent = node.parentNode;

    if (!parent || parent.nodeName === "SCRIPT" || parent.nodeName === "STYLE") continue;
    if (!node.nodeValue.match(regex)) continue;

    const span = document.createElement("span");
    span.innerHTML = node.nodeValue.replace(regex, `<mark class="${className}">$1</mark>`);
    parent.replaceChild(span, node);
  }
}

Object.entries(highlightTerms).forEach(([term, className]) => {
  highlightText(term, className);
});
