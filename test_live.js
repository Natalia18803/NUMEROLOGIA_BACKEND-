import fs from 'fs';

const url = "https://num-back-actual-6gpvklv94-natalia18803s-projects.vercel.app/api/auth/login";

async function run() {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@admin.com", password: "999999999", rol: "admin" })
        });
        const text = await response.text();
        fs.writeFileSync('vercel_html.html', text);
        console.log("Status:", response.status);
    } catch (e) {
        console.error(e);
    }
}
run();
