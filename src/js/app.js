// import * as flsFunctions from './modules/functions.js';

// flsFunctions.isWebp();

// accordeon

const artist = document.querySelector(".artist");
const track = document.querySelector(".track");
const timeRange = document.querySelector(".time__range");
const startTime = document.querySelector(".start__time");
const endTime = document.querySelector(".end__time");
const body = document.querySelector("body");
const songs = document.querySelector(".playlist");
const bodyBg = document.querySelectorAll(".bg");
const playlist = document.querySelector(".open");

class AudioPlayer {
  constructor(selector) {
    this.player = document.querySelector(selector);
    this.audio = document.querySelector(".audio");
    this.light = document.getElementById("light");

    playlist.onchange = function (e) {
      songs.innerHTML = "";
      count = 0;
      player.audio.src = "";
      document.querySelector(".player__open").style.display = "none";
      player.playlistShow();
      for (let index = 0; index < playlist.files.length; index++) {
        songs.innerHTML += `<li class="playlist-item"><p class="song__label">${playlist.files[index].name}</p></li>`;
      }
      const songLabel = document.querySelectorAll(".playlist-item");
      for (let index = 0; index < songLabel.length; index++) {
        songLabel[index].addEventListener("click", (e) => {
          player.isPlay = false;
          player.audio.src = "";
          count = index;
          console.log(count);
          player.play();
        });
      }
    };

    this.listeners();
  }

  listeners() {
    this.audio.addEventListener("click", this.play.bind(this));
    this.audio.addEventListener("loadedmetadata", this.setTime.bind(this));
    this.light.addEventListener("click", this.lightToggle.bind(this));

    this.player
      .querySelector(".play")
      .addEventListener("click", this.play.bind(this));
    this.player
      .querySelector(".volume__range")
      .addEventListener("input", this.volume.bind(this));
    this.player
      .querySelector(".time__range")
      .addEventListener("input", this.time.bind(this));
    this.player
      .querySelector(".next")
      .addEventListener("click", this.next.bind(this));
    this.player
      .querySelector(".prev")
      .addEventListener("click", this.prev.bind(this));
    this.player
      .querySelector(".repeat")
      .addEventListener("click", this.repeat.bind(this));
    this.player
      .querySelector(".shuffle")
      .addEventListener("click", this.shuffle.bind(this));
    this.player
      .querySelector(".playlist__show")
      .addEventListener("click", this.playlistShow.bind(this));
    document
      .getElementById("min")
      .addEventListener("click", this.mute.bind(this));
  }

  mute() {
    this.isMute = !this.isMute;
    this.audio.muted = this.isMute;
    document.getElementById("min").className = this.isMute
      ? "fas fa-volume-mute"
      : "fal fa-volume-down";
    const volRange = this.player.querySelector(".volume__range");
    if (this.isMute) {
      volRange.setAttribute("volume", volRange.value);
      volRange.value = 0;
    } else {
      volRange.value = volRange.getAttribute("volume");
    }
  }

  lightToggle() {
    this.lightOn = !this.lightOn;
    this.lightOn
      ? document.querySelector(".player").classList.add("player-shadow")
      : document.querySelector(".player").classList.remove("player-shadow");
    player.light.className = this.lightOn
      ? "fas fa-lightbulb"
      : "fad fa-lightbulb";
    this.lightOn
      ? player.light.setAttribute("id", "light-on")
      : player.light.setAttribute("id", "light");
  }

  play() {
    const songLabel = document.querySelectorAll(".playlist-item");

    if (this.audio.currentTime <= 0 && playlist.files.length > 0) {
      this.audio.src = URL.createObjectURL(playlist.files[count]);
    }
    this.isPlay = !this.isPlay;
    if (this.isPlay && playlist.files.length > 0) {
      songLabel.forEach((item) => {
        item.classList.remove("song-active");
      });
      track.classList.add("track-run");
      this.audio.play();
      this.volume();
      this.setTime();
      songLabel[count].classList.add("song-active");
      track.innerHTML = playlist.files[count].name;
    } else {
      this.audio.pause();
      track.classList.remove("track-run");
    }
    this.player.querySelector(".play .fal").className = this.isPlay
      ? "fal fa-pause"
      : "fal fa-play";
    this.audio.addEventListener("timeupdate", this.currentTime.bind(this));
  }

  volume() {
    const volRange = document.querySelector(".volume__range");
    this.audio.volume = volRange.value / 100;
    this.audio.muted = false;
    player.isMute = false;
    const icon = this.player.querySelector(".mute .fas");
    document.getElementById("min").className =
      volRange.value <= 0 ? "fas fa-volume-mute" : "fal fa-volume-down";
  }

  time() {
    timeRange.max = this.audio.duration;
    this.audio.currentTime = timeRange.value;
  }

  next() {
    track.classList.remove("track-run");
    player.isPlay = false;
    this.audio.pause();
    this.audio.currentTime = 0;
    if (player.shufflePlaylist && playlist.files.length > 2) {
      count = getRandom(0, playlist.files.length, count);
    } else {
      count < playlist.files.length - 1 ? count++ : (count = 0);
    }
    this.play();
    bgChange();
  }

  prev() {
    track.classList.remove("track-run");
    if (this.audio.currentTime > this.audio.duration / 10) {
      this.audio.currentTime = 0;
      player.audio.play();
      this.player.querySelector(".play .fal").className = "fal fa-pause";
    } else {
      player.isPlay = false;
      this.audio.pause();
      this.audio.currentTime = 0;
      count > 0 ? count-- : (count = playlist.files.length - 1);
      console.log(playlist.files.length);
      this.play();
      bgChange();
    }
  }

  setTime() {
    const duration = Math.floor(this.audio.duration);
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    endTime.innerHTML = `${minutes}:${seconds}`;
  }
  currentTime() {
    const current = Math.floor(this.audio.currentTime);
    const duration = Math.floor(this.audio.duration);
    timeRange.max = duration;
    timeRange.value = current;
    let minutes = Math.floor(current / 60);
    let seconds = Math.floor(current % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    startTime.innerHTML = `${minutes}:${seconds}`;
    if (current >= duration && count < playlist.files.length - 1) {
      player.repeat1Song ? player.prev() : player.next();
    } else if (current >= duration && count >= playlist.files.length - 1) {
      player.repeat1Song
        ? player.prev()
        : (this.player.querySelector(".play .fal").className = "fal fa-play");
      player.repeatPlaylist ? player.next() : "";
    }
  }

  repeat() {
    this.repeatPlaylist = !this.repeatPlaylist;
    player.repeat1Song
      ? (this.repeatPlaylist = false && player.repeat1())
      : this.player.repeatPlaylist;
    const repeat = document.querySelector(".repeat .far");
    this.repeatPlaylist
      ? (repeat.style =
          "color: #fff; text-shadow:0 0 2px #fff;filter:drop-shadow(0 0 2px #fff)")
      : player.repeat1();
    console.log(this.repeatPlaylist, player.repeat1Song);
  }
  repeat1() {
    this.repeat1Song = !this.repeat1Song;
    const repeat = document.querySelector(".repeat .far");
    if (this.repeat1Song) {
      repeat.className = "far fa-repeat-1-alt";
      repeat.style =
        "color: #fff; text-shadow:0 0 2px #fff;filter:drop-shadow(0 0 2px #fff)";
    } else {
      repeat.className = "far fa-repeat";
      repeat.style = "text-shadow:none";
    }
  }
  shuffle() {
    this.shufflePlaylist = !this.shufflePlaylist;
    const shuffle = document.querySelector(".shuffle .far");
    this.shufflePlaylist
      ? (shuffle.style =
          "color: #fff; text-shadow:0 0 2px #fff;filter:drop-shadow(0 0 2px #fff)")
      : (shuffle.style = "text-shadow:none");
  }
  playlistShow() {
    this.playlistOn = !this.playlistOn;
    if (this.playlistOn) {
      document.querySelector(".album").style.height = "0px";
      songs.style = "height: 300px;border:1px solid #fff";
    } else {
      document.querySelector(".album").style.height = "300px";
      songs.style = "height: 0; border:none";
    }
  }
}

function bgChange() {
  body.style = `background: url("${
    bodyBg[getRandom(0, bodyBg.length)].src
  }") no-repeat; background-size: cover`;
}
function getRandom(min, max, e) {
  let num = Math.floor(Math.random() * (max - min)) + min;
  return num === e ? getRandom(min, max, e) : num;
}

let count = 0;

const player = new AudioPlayer(".player");
