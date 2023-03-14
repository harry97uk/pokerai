var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var audioBufferManager = new AudioBufferManager(audioContext);


audioBufferManager.createBufferFor("lion.mp3");


function playFromBufferNumber(number) {
    var audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBufferManager.buffers[number];
    audioSource.connect(audioContext.destination);
    audioSource.start(number);
}