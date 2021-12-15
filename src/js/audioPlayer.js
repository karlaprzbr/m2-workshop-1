const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

const tags = document.getElementsByClassName('tag')
const array = Object.values(tags)

const songs = ["agroalimentari", "anxova", "blau acer", "blau de París", "fuet", "mantega", "nata", "orxata", "sobrassada", "te", "tòfona", "tomàquet"];

let songIndex = 0;
loadSong(songs[songIndex]);

function loadSong(song) {
    title.innerText = song;
    audio.src = `../assets/audios/Q203-cat-Catalan/Millars/${song}.ogg`;
    array.forEach(tag => {
        tag.id = song
    });
}

playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    audio.play();
}

function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');

    audio.pause();
}

function prevSong() {
    songIndex--;

    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);

    playSong();
}

function nextSong() {
    songIndex++;

    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }

    loadSong(songs[songIndex]);

    playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);

// xml
var tagsList = []
// const tags = document.getElementsByClassName('tag')
// const array = Object.values(tags)
array.forEach(tag => {
    tag.addEventListener('click', function(event) {
        createTagXml(tag.id, tag.className)
    })
});
document.getElementById('export').addEventListener('click', function() {
    const url = this.href
    exporter(url)
})
const createTagXml = (audioName, tagName) => {
    var tag = {
        'audio':audioName,
        'type':tagName.replace('tag ',''),
        'date':new Date().toString()
    }
    tagsList.push(tag)
    jsonToXml(tagsList);
  }
  
  const jsonToXml = (list) => {
    var xmlString = '<root></root>';
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, "text/xml");
    var root = xmlDoc.getElementsByTagName('root')[0];
    list.forEach(tag => {
      var xmlTag = xmlDoc.createElement('tag')
      var xmlType = xmlDoc.createElement('type')
      var xmlAudio = xmlDoc.createElement('audio')
      var xmlDate = xmlDoc.createElement('date')
      xmlType.textContent = tag.type
      xmlAudio.textContent = tag.audio
      xmlDate.textContent = tag.date
      root.appendChild(xmlTag)
      xmlTag.appendChild(xmlType)
      xmlTag.appendChild(xmlAudio)
      xmlTag.appendChild(xmlDate)
    });
    var xml = new XMLSerializer().serializeToString(xmlDoc);
    var blob = new Blob([xml], {
      type: "text/xml"
    });
    var url = window.URL.createObjectURL(blob);
    document.getElementById('export').href = url;
  }
  
  const exporter = (url) => {
    window.open(url);
  }