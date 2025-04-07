function updateList(hosts) {
    const list = document.getElementById("hostList");
    list.innerHTML = "";
    hosts.forEach((host, index) => {
        const li = document.createElement("li");
        li.textContent = host;
        const del = document.createElement("button");
        del.textContent = "Remove";
        del.onclick = () => {
            hosts.splice(index, 1);
            chrome.storage.local.set({ allowedHosts: hosts });
            updateList(hosts);
        };
        li.appendChild(del);
        list.appendChild(li);
    });
}

document.getElementById("addHost").addEventListener("click", () => {
    const input = document.getElementById("hostInput");
    const newHost = input.value.trim().toLowerCase();
    if (!newHost) return;

    chrome.storage.local.get({ allowedHosts: [] }, (data) => {
        if (!data.allowedHosts.includes(newHost)) {
            data.allowedHosts.push(newHost);
            chrome.storage.local.set({ allowedHosts: data.allowedHosts });
            updateList(data.allowedHosts);
            input.value = "";
        }
    });
});

chrome.storage.local.get({ allowedHosts: [] }, (data) => {
    updateList(data.allowedHosts);
});
