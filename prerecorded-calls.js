const callContainer = document.querySelector('.call-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn= document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');


// Call titles
const songs = ['Clara', 'Danika', 'Giancarlo', 'Harshit', 'Iris', 'Joanne', "YuenKi"];

// How to keep track of songs
let callIndex = 1;

// Initially load songs
loadSong(songs[callIndex]);

// Update Song details
function loadSong(songs) {
    const callerName = document.querySelector('.caller-name');
    callerName.innerText = songs;
    audio.src=`calls/${songs}.mp3`
}

function playCall() {
    callContainer.classList.add('play');
    playBtn.querySelector('svg.play').classList.remove('svg.play')
    playBtn.querySelector('svg.play').classList.add('svg.pause')

    audio.play()
}

function pauseCall() {
    callContainer.classList.remove('play');
    playBtn.querySelector('svg.play').classList.add('svg.play')
    playBtn.querySelector('svg.play').classList.remove('svg.pause')

    audio.pause()
}

function prevCall() {
    callIndex--

    if (callIndex < 0) {
        callIndex = songs.length - 1
    }

    loadSong(songs[callIndex])

    playCall();
}

function nextCall() {
    callIndex++

    if (callIndex > songs.length - 1) {
        callIndex = 0
    }

    loadSong(songs[callIndex])

    playCall();

}

function updateProgress(e) {
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`
}

// Event Listeners
playBtn.addEventListener('click', () => {
    const isPlaying = callContainer.classList.contains('play');

    if(isPlaying) {
        pauseCall()
    } else {
        playCall()
    }
})

// Change call events
prevBtn.addEventListener('click', prevCall)
nextBtn.addEventListener('click', nextCall)

audio.addEventListener('timeupdate', updateProgress)