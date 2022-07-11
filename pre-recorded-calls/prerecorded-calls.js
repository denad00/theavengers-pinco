const callContainer = document.querySelector('.call-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn= document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const callerName = document.querySelector('.caller-name');

// Call titles
const songs = ['03 - Dive', '3 I Did Something Bad', 'Danika'];

// How to keep track of songs
let callIndex = 2;

// Initially load songs
loadSong(songs[callIndex]);

// Update Song details
function loadSong(songs) {
    callerName.innerText = songs;
    audio.src=`calls/${songs}.mp3`
}

function playCall() {
    callContainer.classList.add('play');
    playBtn.querySelector('i.fa-solid').classList.remove('fa-play')
    playBtn.querySelector('i.fa-solid').classList.add('fa-pause')

    audio.play()
}

function pauseCall() {
    callContainer.classList.remove('play');
    playBtn.querySelector('i.fa-solid').classList.add('fa-play')
    playBtn.querySelector('i.fa-solid').classList.remove('fa-pause')

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