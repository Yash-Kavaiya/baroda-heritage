// Browser Web Speech API Audio Tour Narrator for Vadodara 3D

class VadodaraNarrator {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.isNarrating = false;
    this.currentUtterance = null;
    this.onStateChange = null;
  }

  speak(text, onEndCallback) {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Clear regal cadence
    utterance.pitch = 1.0;

    // Pick a natural English or Indian English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.includes("en-IN") || v.name.includes("India")) ||
      voices.find((v) => v.lang.startsWith("en") && v.name.includes("Natural")) ||
      voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isNarrating = true;
      if (this.onStateChange) this.onStateChange(true);
    };

    utterance.onend = () => {
      this.isNarrating = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.isNarrating = false;
      if (this.onStateChange) this.onStateChange(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  narratePlace(place) {
    if (!place) return;
    const narrationText = `Welcome to ${place.name}, ${place.gujaratiName}. Built in ${place.builtYear} under the patronage of ${place.patron}, this architectural landmark represents the finest ${place.style}. ${place.tagline}. ${place.overview} Key architectural highlights include: ${place.highlights.slice(0, 2).join(". ")}`;
    this.speak(narrationText);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isNarrating = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }

  toggle(place) {
    if (this.isNarrating) {
      this.stop();
    } else {
      this.narratePlace(place);
    }
  }
}

export const narrator = new VadodaraNarrator();
