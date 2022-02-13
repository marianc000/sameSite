let records = [];

export function log(req) {
    let { ip, method, url, cookies, body } = req;
    const dt = new Date();
    const referer = req.get('Referer');
    cookies = Object.keys(cookies).join(", ");
    body = Object.entries(body).map(([k, v]) => k + "=" + v).join("&");
    const time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    records = [{ time, referer, ip, method, url, cookies, body }, ...records.slice(0, 20)];
    return getRecordJson();
}

export function getRecordJson() {
    return JSON.stringify(records);
}
