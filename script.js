const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const welcomeScreen = $('#welcomeScreen');
const mainContent = $('#mainContent');
const toast = $('#toast');
window.scrollTo(0, 0);

$('#openSurprise').addEventListener('click', () => {
  welcomeScreen.classList.add('is-hidden');
  mainContent.classList.add('is-visible');
  mainContent.setAttribute('aria-hidden', 'false');
  document.activeElement?.blur();
  window.scrollTo({ top: 0, behavior: 'auto' });
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 100);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-revealed');
  });
}, { threshold: .12 });
$$('.reveal').forEach((element) => observer.observe(element));

const envelope = $('#envelope');
const letterPaper = $('#letterPaper');
envelope.addEventListener('click', () => {
  envelope.classList.toggle('is-open');
  const opened = envelope.classList.contains('is-open');
  if (opened) {
    setTimeout(() => {
      letterPaper.classList.add('is-visible');
      letterPaper.setAttribute('aria-hidden', 'false');
      $('#letterMusic').classList.add('is-visible');
      $('#letterMusic').setAttribute('aria-hidden', 'false');
    }, 600);
  } else {
    letterPaper.classList.remove('is-visible');
    letterPaper.setAttribute('aria-hidden', 'true');
    $('#letterMusic').classList.remove('is-visible');
    $('#letterMusic').setAttribute('aria-hidden', 'true');
  }
});

const galleryItems = $$('.moment-card, .polaroid').filter((item) => $('img', item).getAttribute('src'));
const galleryData = galleryItems.map((item) => ({
  src: $('img', item).getAttribute('src'),
  alt: $('img', item).alt
}));
let currentPhoto = 0;
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxCaption = $('#lightboxCaption');
function renderPhoto(index) {
  currentPhoto = (index + galleryData.length) % galleryData.length;
  const photo = galleryData[currentPhoto];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = '';
  lightboxImage.onerror = () => {
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = 'Photo placeholder';
  };
}
function openModal(modal) { modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeModal(modal) { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
galleryItems.forEach((item) => item.addEventListener('click', () => { renderPhoto(Number(item.dataset.index)); openModal(lightbox); }));
$('#prevPhoto').addEventListener('click', () => renderPhoto(currentPhoto - 1));
$('#nextPhoto').addEventListener('click', () => renderPhoto(currentPhoto + 1));
$$('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal($('#' + button.dataset.close))));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeModal(lightbox); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal(lightbox);
  if (lightbox.classList.contains('is-open') && event.key === 'ArrowRight') renderPhoto(currentPhoto + 1);
  if (lightbox.classList.contains('is-open') && event.key === 'ArrowLeft') renderPhoto(currentPhoto - 1);
});

$('#showVideo').addEventListener('click', () => {
  const videoCard = $('#videoCard');
  const birthdayVideo = $('#birthdayVideo');
  videoCard.classList.add('is-visible');
  setTimeout(() => {
    videoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    birthdayVideo.play().catch(() => {});
  }, 50);
});
$('#birthdayVideo').addEventListener('ended', () => $('#videoFinished').classList.add('is-visible'));
$('#birthdayVideo').addEventListener('error', () => {
  $('#videoError').classList.add('is-visible');
  console.error('Birthday video could not load from assets/videos/birthday-video.mp4');
});

const music = $('#birthdayMusic');
const musicToggle = $('#musicToggle');
const letterMusicToggle = $('#letterMusicToggle');
const musicMute = $('#musicMute');
function syncMusicButtons() {
  const playing = !music.paused;
  musicToggle.classList.toggle('is-playing', playing);
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Pause birthday music' : 'Play birthday music');
  letterMusicToggle.textContent = playing ? 'pause ' : 'play ';
  letterMusicToggle.insertAdjacentHTML('beforeend', `<span>${playing ? 'Ⅱ' : '▶'}</span>`);
  letterMusicToggle.setAttribute('aria-label', playing ? 'Pause birthday music' : 'Play birthday music');
}
async function toggleMusic() {
  if (music.paused) {
    try { await music.play(); syncMusicButtons(); }
    catch { showToast('Add birthday-song.mp3 to assets/music to hear this one.'); console.error('Birthday music could not load from assets/music/birthday-song.mp3'); }
  } else {
    music.pause(); syncMusicButtons();
  }
}
musicToggle.addEventListener('click', toggleMusic);
letterMusicToggle.addEventListener('click', toggleMusic);
musicMute.addEventListener('click', () => {
  music.muted = !music.muted;
  musicMute.textContent = music.muted ? '🔇' : '🔊';
  musicMute.setAttribute('aria-pressed', String(music.muted));
});

const heroPhoto = $('#heroPhoto');
const heroPhotos = ['assets/photos/5.jpeg', 'assets/photos/6.jpeg', 'assets/photos/7.jpeg', 'assets/photos/8.jpeg'];
let heroPhotoIndex = 0;
function showHeroPhoto(index) {
  const nextIndex = index % heroPhotos.length;
  const nextPhoto = new Image();
  nextPhoto.onload = () => {
    heroPhotoIndex = nextIndex;
    heroPhoto.classList.add('is-changing');
    setTimeout(() => {
      heroPhoto.src = nextPhoto.src;
      heroPhoto.classList.remove('is-changing');
      heroPhoto.classList.remove('is-missing');
    }, 320);
  };
  nextPhoto.onerror = () => {
    if (nextIndex !== heroPhotoIndex) setTimeout(() => showHeroPhoto((nextIndex + 1) % heroPhotos.length), 120);
  };
  nextPhoto.src = heroPhotos[nextIndex];
}
setInterval(() => showHeroPhoto((heroPhotoIndex + 1) % heroPhotos.length), 4200);

const reasonsSection = $('#reasons');
const floatingDecorations = $('#floatingDecorations');
const decorationSymbols = ['🌸', '🌹', '♡', '✦', '🎈'];
let decorationTimer;
function addFloatingDecoration() {
  const decoration = document.createElement('span');
  decoration.className = 'floating-decoration';
  decoration.textContent = decorationSymbols[Math.floor(Math.random() * decorationSymbols.length)];
  decoration.style.left = `${Math.random() * 94 + 3}%`;
  decoration.style.setProperty('--drift', `${(Math.random() * 70 - 35).toFixed(0)}px`);
  decoration.style.setProperty('--duration', `${(6 + Math.random() * 5).toFixed(2)}s`);
  decoration.style.setProperty('--delay', `${(Math.random() * .8).toFixed(2)}s`);
  decoration.style.fontSize = `${.85 + Math.random() * .7}rem`;
  floatingDecorations.appendChild(decoration);
  setTimeout(() => decoration.remove(), 12000);
}
const decorationObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    if (!decorationTimer) decorationTimer = setInterval(addFloatingDecoration, 950);
  } else if (decorationTimer) {
    clearInterval(decorationTimer);
    decorationTimer = undefined;
  }
}, { threshold: .2 });
decorationObserver.observe(reasonsSection);

const candles = $$('.candle');
function celebrate() {
  candles.forEach((candle) => candle.classList.add('is-out'));
  $('#blowLabel').textContent = 'wish released! Again? 😭💨';
  const celebration = $('#celebration');
  celebration.classList.remove('is-visible');
  void celebration.offsetWidth;
  celebration.classList.add('is-visible');
  celebration.setAttribute('aria-hidden', 'false');
  $('#cake').classList.add('cake-celebrated');
  clearTimeout(celebrate.resetTimer);
  celebrate.resetTimer = setTimeout(() => {
    candles.forEach((candle) => candle.classList.remove('is-out'));
    celebration.classList.remove('is-visible');
    celebration.setAttribute('aria-hidden', 'true');
    $('#blowLabel').textContent = 'ready for another wish! 💨';
  }, 5000);
}
candles.forEach((candle) => candle.addEventListener('click', celebrate));
$('#blowButton').addEventListener('click', celebrate);

$('#giftBox').addEventListener('click', (event) => {
  const box = event.currentTarget;
  box.classList.toggle('is-open');
  if (box.classList.contains('is-open')) showToast('Lifetime friendship unlocked. No exchanges.');
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

document.addEventListener('click', (event) => {
  if (event.target.closest('button, a, video, input')) return;
  const heart = document.createElement('span');
  heart.className = 'click-heart';
  heart.textContent = Math.random() > .5 ? '♡' : '✦';
  heart.style.left = `${event.clientX}px`;
  heart.style.top = `${event.clientY}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
});
