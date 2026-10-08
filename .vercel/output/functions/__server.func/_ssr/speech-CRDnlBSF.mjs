//#region node_modules/.nitro/vite/services/ssr/assets/speech-CRDnlBSF.js
function speechSupported() {
	return typeof window !== "undefined" && "speechSynthesis" in window;
}
function speak(text, opts = {}) {
	if (!speechSupported()) return;
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.rate = opts.rate ?? 1;
	utterance.pitch = opts.pitch ?? 1;
	if (opts.lang) utterance.lang = opts.lang;
	if (opts.voiceURI) {
		const voice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === opts.voiceURI);
		if (voice) utterance.voice = voice;
	}
	window.speechSynthesis.speak(utterance);
}
//#endregion
export { speak as t };
