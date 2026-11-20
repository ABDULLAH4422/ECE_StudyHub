/**
 * Web Audio API synthesizer for Focus Room notifications and ambient sound.
 * Zero external audio files or network dependencies.
 */

let ambientAudioCtx: AudioContext | null = null;
let ambientGainNode: GainNode | null = null;
let ambientSourceNode: AudioNode | null = null;

/**
 * Play a soothing three-tone meditation chime when a session finishes.
 */
export function playChimeSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Gentle harmonic chime chords (C5 -> E5 -> G5 -> C6)
    const frequencies = [523.25, 659.25, 783.99, 1046.5];
    const startTime = ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.14);

      // Smooth attack and gentle exponential decay
      gain.gain.setValueAtTime(0.0001, startTime + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.25, startTime + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.14 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.14);
      osc.stop(startTime + idx * 0.14 + 1.9);
    });
  } catch (err) {
    console.warn("Could not play chime notification sound", err);
  }
}

/**
 * Start procedural ambient white/pink noise or rain sound using AudioBuffer.
 */
export function startAmbientSound(
  type: "whitenoise" | "rain" | "waves",
  volume: number = 0.3
) {
  if (typeof window === "undefined") return;
  stopAmbientSound();

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;
    ambientAudioCtx = new AudioContextClass();
    if (ambientAudioCtx.state === "suspended") {
      ambientAudioCtx.resume();
    }

    const bufferSize = ambientAudioCtx.sampleRate * 2; // 2 seconds buffer looped
    const noiseBuffer = ambientAudioCtx.createBuffer(
      1,
      bufferSize,
      ambientAudioCtx.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === "rain") {
        // Pink / filtered noise resembling rain on a window
        const val = (lastOut + 0.02 * white) / 1.02;
        lastOut = val;
        output[i] = val * 3.5;
      } else if (type === "waves") {
        // Brownish soft rumble
        const val = (lastOut + 0.01 * white) / 1.01;
        lastOut = val;
        output[i] = val * 4.0;
      } else {
        // Pure soft white noise
        output[i] = white * 0.5;
      }
    }

    const whiteNoise = ambientAudioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make sound warm and non-harsh
    const filter = ambientAudioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(type === "whitenoise" ? 1800 : 900, ambientAudioCtx.currentTime);

    ambientGainNode = ambientAudioCtx.createGain();
    ambientGainNode.gain.setValueAtTime(volume * 0.25, ambientAudioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(ambientGainNode);
    ambientGainNode.connect(ambientAudioCtx.destination);

    whiteNoise.start();
    ambientSourceNode = whiteNoise;
  } catch (err) {
    console.warn("Could not start ambient sound", err);
  }
}

export function updateAmbientVolume(volume: number) {
  if (ambientGainNode && ambientAudioCtx) {
    ambientGainNode.gain.setValueAtTime(volume * 0.25, ambientAudioCtx.currentTime);
  }
}

export function stopAmbientSound() {
  try {
    if (ambientSourceNode) {
      (ambientSourceNode as AudioBufferSourceNode).stop();
      ambientSourceNode.disconnect();
      ambientSourceNode = null;
    }
    if (ambientAudioCtx) {
      ambientAudioCtx.close();
      ambientAudioCtx = null;
    }
  } catch {
    // Ignore cleanup errors
  }
}
