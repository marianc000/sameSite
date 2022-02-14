const BASE_URL = document.baseURI;
const FETCH_URL = BASE_URL + 'fetch';

getBtn.addEventListener("click", () => fetch(FETCH_URL, { credentials: 'include' }).then(onLoaded));
postBtn.addEventListener("click", () => fetch(FETCH_URL, {
    method: 'post',
    credentials: 'include'
}).then(onLoaded));
iframeBtn.addEventListener("click", () => iframeDiv.innerHTML = `<iframe src="${BASE_URL}"></iframe>`);

function onLoaded(res) {
    res.json().then(data => console.log(data));
}
 
// const path = new URL(BASE_URL).pathname;
// console.log("BASE_URL", BASE_URL);
// console.log("path", path);

// const url = BASE_URL.replace('http', 'ws').replace(path, '') + 'log';
// console.log("url", url);
 
const path = new URL(BASE_URL).pathname.replace('/','');

let url = BASE_URL.replace('http', 'ws').replace(path, '') + 'log';

console.log("url",BASE_URL, path,url); 

const socket = new WebSocket(url);

socket.onopen = () => {
    console.log("connected");
}

socket.onmessage = e => {
    console.log('received:');
    const data = JSON.parse(e.data);
    logDiv.innerHTML = logTable(data);
}

function td(val) {
    val = val ?? '';
    if (typeof val === 'object')
        if (Object.keys(val).length)
            val = JSON.stringify(val);
        else val = '';

    return `<td>${val}</td>`;
}

function logTable(data) {
    // console.log(data);
    const cols = ['time', 'referer', 'method', 'url', 'cookies', 'body'];
    if (!data.length) return '';
    return '<table>' + cols.reduce((t, col) => t + `<th>${col}</th>`, '<tr>') + '</tr>'
        + data.reduce((t, o) => t
            + cols.reduce((row, col) => row + td(o[col]), '<tr>') + '</tr>', '')
        + '</table>';
}
