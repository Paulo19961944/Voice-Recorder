document.addEventListener('DOMContentLoaded', () => {
  const startRecordButton = document.getElementById('startRecord');
  const stopRecordButton = document.getElementById('stopRecord');
  const downloadAudioButton = document.getElementById('downloadAudio');
  const audioPlayer = document.getElementById('audioPlayer');
  let mediaRecorder;
  let audioChunks = [];

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;

        // Atualizado para usar um link temporário apenas quando o botão de download é clicado
        downloadAudioButton.addEventListener('click', () => {
          const tempLink = document.createElement('a');
          tempLink.href = audioUrl;
          tempLink.download = 'gravacao_audio.wav';

          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        });

        downloadAudioButton.disabled = false;
      };
    })
    .catch(error => {
      console.error('Erro ao acessar o microfone:', error);
    });

  startRecordButton.addEventListener('click', () => {
    audioChunks = [];
    mediaRecorder.start();
    startRecordButton.disabled = true;
    stopRecordButton.disabled = false;
    downloadAudioButton.disabled = true;
  });

  stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordButton.disabled = false;
    stopRecordButton.disabled = true;
  });
});
