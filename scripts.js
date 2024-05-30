const uploadAudio = document.querySelector(".input-container");
const audioElement = document.querySelector("audio");
const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasContext = canvas.getContext("2d");

uploadAudio.addEventListener("click", () => {
  const inputFile = document.createElement("input");
  inputFile.setAttribute("type", "file");
  inputFile.setAttribute("accept", "audio/*");
  inputFile.click();

  inputFile.addEventListener("change", () => {
    let audioFile = inputFile.files[0];
    let audioUrl = URL.createObjectURL(audioFile);

    audioElement.src = audioUrl;
    audioElement.play();

    // Audio Processing

    // 1. Create Audio Context
    // 2. Create Audio Source
    // 3. Create Audio Effects
    // 4. Create Audio Destination

    // Audio context processin graph or simple modular route
    const audioContext = new AudioContext();

    // Source Node
    const audioSource = audioContext.createMediaElementSource(audioElement);

    // Analyzer Node
    const analyzer = audioContext.createAnalyser();

    audioSource.connect(analyzer);

    // Destination Node
    analyzer.connect(audioContext.destination); // Hardware speacker

    analyzer.fftSize = 512; // determinses count of sound bar
    const bufferDataLenth = analyzer.frequencyBinCount;
    const bufferDataArray = new Uint8Array(bufferDataLenth);
    const barWidth = canvas.width / bufferDataLenth;
    let x = 0;

    function drawAndAnimateSoundBars() {
      x = 0;
      canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

      analyzer.getByteFrequencyData(bufferDataArray);
      bufferDataArray.forEach((dataValue) => {
        const barHeight = dataValue;
        const red = (barHeight * 2) % 150;
        const green = (barHeight * 5) % 200;
        const blue = (barHeight * 7) % 120;

        canvasContext.fillStyle = `rgba(${red},${green},${blue})`;
        canvasContext.fillRect(
          x,
          canvas.height - barHeight,
          barWidth,
          barHeight
        );
        x += barWidth;
      });

      if (!audioElement.ended) {
        requestAnimationFrame(drawAndAnimateSoundBars);
      }
    }

    drawAndAnimateSoundBars();
  });
});
