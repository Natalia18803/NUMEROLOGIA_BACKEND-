import fs from 'fs';

const url = "https://num-back-actual.vercel.app/api/auth/login";

async function run() {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@admin.com", password: "999999999", rol: "admin" })
        });
        const text = await response.text();
        fs.writeFileSync('vercel_prod_html.html', text);
        console.log("Status:", response.status);
    } catch (e) {
        console.error(e);
    }
}
run();
