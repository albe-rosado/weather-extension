




// Displays weather status on the popup
function renderStatus(main, desc) {
    document.getElementById('header').textContent = main;
    document.getElementById('status').textContent = desc;
}


chrome.storage.sync.get(["main" ,"data"], function (params) {
        renderStatus(params.main, params.data);
    });








