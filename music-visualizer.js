const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audioFile = document.getElementById("audioFile");
let audio, audioCtx, analyser, dataArray, source;

audioFile.addEventListener("change", function() {
  const files = this.files;
  if(files.length === 0) return;

  if(audio) audio.pause();

  audio = new Audio(URL.createObjectURL(files[0]));
  audio.play();

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  animate();
});

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  analyser.getByteFrequencyData(dataArray);
  const barWidth = canvas.width / dataArray.length;
  let x = 0;

  for(let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `hsl(${i*4}, 100%, 50%)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
