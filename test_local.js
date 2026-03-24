const url = "http://127.0.0.1:3000/api/auth/login";

async function run() {
    try {
        console.log("Testing testuser...");
        const r1 = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "testuser@example.com", password: "123456", rol: "usuario" })
        });
        console.log("Testuser:", r1.status, await r1.text());

        console.log("Testing admin...");
        const r2 = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@admin.com", password: "999999999", rol: "admin" })
        });
        console.log("Admin:", r2.status, await r2.text());
        
        console.log("Testing Carlos...");
        const r3 = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "carlos.ruiz@example.com", password: "12345678", rol: "usuario" })
        });
        console.log("Carlos:", r3.status, await r3.text());
    } catch (e) {
        console.error(e);
    }
}

run();
