const url = "https://num-back-actual.vercel.app/api";

async function run() {
    try {
        const response = await fetch(url);
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Body:", text);
    } catch (e) {
        console.error(e);
    }
}
run();
