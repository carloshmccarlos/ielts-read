export async function cronCreateArticle() {
	const api = process.env.GEMINI_API_KEY;

	console.log(api);
	return null;
}

cronCreateArticle().then(() => {});
