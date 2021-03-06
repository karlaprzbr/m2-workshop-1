const musicContainer = document.getElementById('music-container');
const musicContainerId = document.getElementById('music-container-id');
const playBtn = document.getElementById('play');
const playBtnIndiv = document.getElementsByClassName('btn-play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const players = document.getElementById('player-list');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title= document.getElementById('title');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

const tags = document.getElementsByClassName('tag')
const array = Object.values(tags)

const songs = ["agroalimentari", "anxova", "blau acer", "blau de París"/*, "fuet", "mantega", "nata", "orxata", "sobrassada", "te", "tòfona", "tomàquet"*/];

var tagsList = []

let songIndex = 0;
loadSong(songs[songIndex]);

function loadSong(song) {
    title.innerText = song;
    audio.src = `../assets/audios/Q203-cat-Catalan/Millars/${song}.ogg`;
    array.forEach(tag => {
        tag.id = song
    });
}

function loadSongIndiv(song) {
    array.forEach(tag => {
        tag.id = song
    });
}

for (let i = 0; i < songs.length; i++) {
    // console.log(songs[i] + i);
    createPlayers(songs[i], i);
}

function createPlayers(song, songIndex) {
    if (tagsList.length > 0) {
        let test = tagsList.find(tag => tag.audio == song);
        console.log(test);
    }
    const newPlayer = document.createElement('audio');
    const title_container = document.createElement("p");
    title_container.innerText = song;
    newPlayer.id = 'audio' + songIndex;
    newPlayer.key = song;
    newPlayer.src = `../assets/audios/Q203-cat-Catalan/Millars/${song}.ogg`;
    loadSongIndiv(song);
    const player_item = document.createElement("li");
    player_item.className = song;
    players.appendChild(player_item);
    player_item.appendChild(title_container);
    player_item.appendChild(newPlayer);
    newPlayer.insertAdjacentHTML('afterend',
        '<div class="navigation"><button id="play' + songIndex + '" class="action-btn action-btn-big btn-play"><i class="fas fa-play"></i></button></div>');
}

//event listener for individual player

for (let i = 0; i < playBtnIndiv.length; i++) {
    const audioId = document.getElementById('audio' + i);
    // console.log(audioId)
    playBtnIndiv[i].addEventListener('click', () => {
        const isPlaying = musicContainerId.classList.contains('play');
        if (isPlaying) {
            musicContainerId.classList.remove('play');
            playBtnIndiv[i].querySelector('i.fas').classList.add('fa-play');
            playBtnIndiv[i].querySelector('i.fas').classList.remove('fa-pause');

            audioId.pause();
        } else {
            musicContainerId.classList.add('play');
            playBtnIndiv[i].querySelector('i.fas').classList.remove('fa-play');
            playBtnIndiv[i].querySelector('i.fas').classList.add('fa-pause');

            audioId.play();
        }
    })
    audioId.addEventListener('ended', () => {
        musicContainerId.classList.remove('play');
        playBtnIndiv[i].querySelector('i.fas').classList.add('fa-play');
        playBtnIndiv[i].querySelector('i.fas').classList.remove('fa-pause');
    })

    playBtnIndiv[i].addEventListener('dblclick', () =>{
        
    })
}


//Event listener for big player
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
    let test = tagsList.find(tag => tag.audio == songs[songIndex])
    if(test == undefined) {
        createTagXml(songs[songIndex],'no-tag');
    }

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


/**
 * XML
 * Gestion des tags et création du fichier xml
 */


array.forEach(tag => {
    tag.addEventListener('click', function (event) {
        createTagXml(tag.id, tag.className)
    })
});
document.getElementById('export').addEventListener('click', function () {
    const url = this.href
    exporter(url)
})
const createTagXml = (audioName, tagName) => {
    tagsList.forEach(tag => {
        if(tag.audio === audioName && tag.type === 'no-tag') {
            const tagId = tagsList.indexOf(tag)
            tagsList.splice(tagId,1)
        }
    });
    var tag = {
        'audio': audioName,
        'type': tagName.replace('tag ', ''),
        'date': new Date().toString()
    }
    tagsList.push(tag)
    jsonToXml(tagsList);
    if(tagName != 'no-tag') {
        const playerLi = document.getElementsByClassName(audioName)[0]/*.appendChild('span').innerHTML(tagName)*/
        const playerSpan = document.createElement('span')
        playerSpan.innerHTML = tagName.replace('tag ','')
        playerLi.appendChild(playerSpan)
        console.log(playerLi)
    }
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