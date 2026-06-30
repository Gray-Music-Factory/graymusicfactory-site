/**
 * GRAY Music Factory - Website Logic
 * Handles Custom Player, Lyrics Drawer, Toast Notifications, and Band Bios
 */

// Mapping of song titles to their exact MP3 filenames in the audio/ directory
const AUDIO_MAPPING = {
  "Broken Glass": "Broken Glass.mp3",
  "Can't Complain": "Can't Complain.mp3",
  "Cold Dark Road": "Cold Dark Road.mp3",
  "Cute Little Lesbians": "Cute Little Lesbians.mp3",
  "Down On A Number": "Down On A Number.mp3",
  "I Will Not Say I'm Sorry": "I Will Not Say I'm Sorry.mp3",
  "I Will": "I Will.mp3",
  "Living Life": "Living Life.mp3",
  "Loved By You": "Loved By You.mp3",
  "Money's Alright": "Money's Alright.mp3",
  "Reach Back in Time": "Reach Back In Time.mp3",
  "Remember The Ride": "Remember the Ride.mp3",
  "She Wants Your Money": "She Wants Your Money.mp3",
  "Silly Metal Band": "Silly Metal Band.mp3",
  "Sociopath": "Sociopath.mp3",
  "Speed Of Light": "Speed of Light.mp3",
  "Talk To Her": "Talk To Her.mp3",
  "Twenty Dollar Man": "Twenty Dollar Man.mp3",
  "Wall of Love": "Wall Of Love.mp3"
};

let SONGS_LIST = [];
let currentTrackIndex = -1;
let isPlaying = false;

// Band Members Data
const BAND_MEMBERS = [
  {
    id: "steve",
    name: "Steve Mansour",
    role: "Guitar, Vocals",
    birthplace: "Kansas City, MO",
    shadeOfGray: "#444444",
    image: "images/steve3.jpg",
    bio: [
      "Steve was born and raised in Kansas City, MO - the land of ubiquitous stockyards and kick-ass barbeque.",
      "Steve started drums at age 10, played in bands at 13, taught himself to play guitar, bass, and keyboards by 16, had a small recording studio at 17, and was a session musician at local recording studios by 18.",
      "In his professional life, Steve is an electrical engineer (EE) by degree, but worked as a software developer and executive for most of his career at some of the most recognizable companies in Silicon Valley: Netscape, eBay, Paypal, and Apple.",
      "Rumors: It is said that Steve was kidnapped by a band of beatniks when he was 7. They ‘force-read’ him passages from Jack Kerouac writings. Some say this resulted in a condition called P.O.D. (Permanent Observation Disorder). Allegedly, he said of the ordeal, ‘It was harrowing, yes, but I did learn how to play a mean bongo. Plus, I can make menial observations that serve no purpose.’ While being held in the beatnik commune, he was abducted (again) by the dreaded Andrew Sisters. Steve allegedly said, ‘It was equally as harrowing, but the harmonies were great!’"
    ],
    turnOns: "Hi-Boy burgers.",
    turnOffs: "Trying to think of 'turn ons', people who pronounce nuclear as nucyooler, that sweet Chinese red-bean-soup dessert stuff."
  },
  {
    id: "richard",
    name: "Richard Lum",
    role: "Bass",
    birthplace: "San Francisco, CA",
    shadeOfGray: "#838383",
    image: "images/richard.png",
    bio: [
      "Bio coming soon."
    ],
    turnOns: "",
    turnOffs: ""
  },
  {
    id: "ken",
    name: "Ken Bauer",
    role: "Keyboards",
    birthplace: "Long Beach, CA",
    shadeOfGray: "#d7d7d7",
    image: "images/ken.jpg",
    bio: [
      "A true son of SoCal, Ken was born in Long Beach, CA and grew up in the City of Orange. In Jr. High School, Ken and a friend created an animated movie, and in high school, a campus documentary. At 18, Ken built a 'kit car'.",
      "Ken had a few years of traditional piano lessons starting at age 8. At 12, he was playing organ with local bands. When they started to gig, hauling the organ was out. His solution was to buy a cheap guitar, taught himself to play, and voila, he was portable!",
      "In his 20's he studied jazz and improvisation with Paul Zhuel, which led to playing in various SoCal bands in the 80's including 'Matrix'.",
      "After moving to Silicon Valley in 2013, Ken started playing with local musicians, leading to his meeting Steve. After trying out several keyboardists without success, Ken was asked to sit in on a rehearsal and it was magic. Ken was an instant hit. Not only a great keyboardist with great chops, but a total team player who was essential to the formation of Gray.",
      "Ken also composes all kinds of music from religious to rock settings and some of his work can be seen on YouTube."
    ],
    turnOns: "Designing synthesizers and guitars, composing jazz.",
    turnOffs: "Heavy organs that are impossible to haul around."
  },
  {
    id: "kyle",
    name: "Kyle O'Leary",
    role: "Drums",
    birthplace: "Denver, CO",
    shadeOfGray: "#797979",
    image: "images/kyle.jpg",
    bio: [
      "Kyle was born and raised in Denver, Colorado. He doesn’t like to talk about it, but was told he grew up with a colorful cast of characters (including Stan, Butters, Jimmy, Timmy, and school sociopath Eric).",
      "Kyle fell in love with the drums at 10 years of age, and hit the road at 18 playing music full time. He ended up in LA at 21, and Nashville at 25.",
      "A band was formed with Kyle on drums to play and record for Freda Parton (Dolly Parton's little sister). The band was assembled by Richie Owens (Dolly's cousin) and offered its own pre-production deal with Warner Bros. The old story of egos and attitudes led to the wheels falling off, and the disappointment led to Kyle walking away from the music industry. This sabbatical turned into 20 years when he found himself in Silicon Valley and being sucked into the computer revolution.",
      "Almost 20 years to the day, he left music and fell in love with it all over again. He soon joined a classic rock cover band where he met Ken Bauer. Finding the right drummer is extremely difficult. Many drummers auditioned and nothing worked. Ken asked Kyle to sit in with the band. Within two songs, Steve instantly knew they’d found GRAY’s drummer."
    ],
    turnOns: "Aristotle, Plato, Kant, Voltaire.",
    turnOffs: "Carrot Top, Pauly Shore, Charlie Sheen, Cats (the movie)."
  }
];

// Initialise Application
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the unified songs list
  initSongsList();
  
  // Render the tracklist
  renderSongs('all');
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up the audio player element
  setupAudioPlayer();
});

// Build the song database by combining LYRICS_DATA and AUDIO_MAPPING
function initSongsList() {
  const lyricsKeys = Object.keys(LYRICS_DATA);
  const matchedLyrics = new Set();
  
  // Process lyrics data
  lyricsKeys.forEach(key => {
    const song = LYRICS_DATA[key];
    const hasRec = AUDIO_MAPPING.hasOwnProperty(song.title);
    
    SONGS_LIST.push({
      title: song.title,
      author: song.author || "Matt Kramer, Steve Mansour",
      tempo: song.tempo ? `${song.tempo} BPM` : "",
      hasRecording: hasRec,
      hasLyrics: true,
      sections: song.sections
    });
    
    if (hasRec) {
      matchedLyrics.add(song.title.toLowerCase().trim());
    }
  });
  
  // Process any recordings in AUDIO_MAPPING that do NOT have lyrics (e.g. "Speed Of Light")
  Object.keys(AUDIO_MAPPING).forEach(title => {
    const normalizedTitle = title.toLowerCase().trim();
    if (!matchedLyrics.has(normalizedTitle)) {
      SONGS_LIST.push({
        title: title,
        author: "Matt Kramer, Steve Mansour",
        tempo: "",
        hasRecording: true,
        hasLyrics: false,
        sections: []
      });
    }
  });
  
  // Sort songs alphabetically
  SONGS_LIST.sort((a, b) => a.title.localeCompare(b.title));
}

// Generate the local audio path for a song
function getAudioPath(title) {
  const filename = AUDIO_MAPPING[title];
  return filename ? `audio/${filename}` : null;
}

// Render the tracks in a table layout
function renderSongs(filter = 'all') {
  const container = document.getElementById('songs-list-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const filteredSongs = SONGS_LIST.filter(song => {
    if (filter === 'recordings') return song.hasRecording;
    if (filter === 'lyrics') return song.hasLyrics;
    return true;
  });

  if (filteredSongs.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-dim);">No songs found.</div>`;
    return;
  }
  
  const table = document.createElement('table');
  table.className = 'tracklist-table';
  
  // Table Header
  table.innerHTML = `
    <thead>
      <tr>
        <th style="width: 60px; text-align: center;">#</th>
        <th>Title</th>
        <th>Writers</th>
        <th>Tempo</th>
        <th style="text-align: right; width: 150px;">Lyrics</th>
      </tr>
    </thead>
  `;
  
  const tbody = document.createElement('tbody');
  
  filteredSongs.forEach((song, index) => {
    const row = document.createElement('tr');
    
    // Check if this row is currently playing
    const isCurrent = currentTrackIndex !== -1 && SONGS_LIST[currentTrackIndex].title === song.title;
    row.className = `tracklist-row${isCurrent && isPlaying ? ' playing' : ''}`;
    
    // Clicking the row triggers play (or coming soon toast)
    row.addEventListener('click', (e) => {
      // If clicking the lyrics button, do not trigger play
      if (e.target.closest('.track-action-btn')) return;
      
      if (song.hasRecording) {
        playSongByName(song.title);
      } else {
        showToast(`"${song.title}" - Workin' on it!`);
      }
    });
    
    const trackIndexDisplay = index + 1;
    const playIcon = song.hasRecording ? '<i class="fas fa-play"></i>' : '<i class="fas fa-music" style="opacity: 0.3;"></i>';
    const badgeHtml = song.hasRecording 
      ? '' 
      : '<span class="badge badge-coming-soon">Workin\' on it</span>';
      
    const lyricsBtn = song.hasLyrics
      ? `<button class="track-action-btn" onclick="openLyrics('${song.title.replace(/'/g, "\\'")}')" title="View Lyrics">LYRICS</button>`
      : `<button class="track-action-btn" disabled title="No Lyrics Available">N/A</button>`;
         
    row.innerHTML = `
      <td class="tracklist-cell track-index" style="text-align: center;">
        <span class="track-index-number">${trackIndexDisplay}</span>
        <span class="track-index-play">${playIcon}</span>
      </td>
      <td class="tracklist-cell">
        <div class="track-title-wrapper">
          <span class="track-title">${song.title}</span>
          ${badgeHtml}
        </div>
      </td>
      <td class="tracklist-cell track-writers">${song.author}</td>
      <td class="tracklist-cell track-tempo">${song.tempo || '-'}</td>
      <td class="tracklist-cell track-actions" style="text-align: right;">
        ${lyricsBtn}
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
}

// 5. Audio Player Setup & Logic
let audioElement = null;

function setupAudioPlayer() {
  audioElement = document.getElementById('main-audio');
  if (!audioElement) return;
  
  // Audio element events
  audioElement.addEventListener('play', () => {
    isPlaying = true;
    updatePlayerUI();
  });
  
  audioElement.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayerUI();
  });
  
  audioElement.addEventListener('timeupdate', () => {
    if (isNaN(audioElement.duration)) return;
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    const fill = document.getElementById('player-progress-fill');
    if (fill) fill.style.width = `${progress}%`;
    
    // Update time displays
    const currentT = document.getElementById('player-time-current');
    if (currentT) currentT.textContent = formatTime(audioElement.currentTime);
    
    const totalT = document.getElementById('player-time-total');
    if (totalT) totalT.textContent = formatTime(audioElement.duration);
  });
  
  audioElement.addEventListener('ended', () => {
    nextTrack();
  });
  
  audioElement.addEventListener('error', (e) => {
    if (currentTrackIndex !== -1) {
      console.error("Audio playback error:", e);
      showToast(`Error loading recording for "${SONGS_LIST[currentTrackIndex].title}".`);
      isPlaying = false;
      updatePlayerUI();
    }
  });
  
  // Progress bar scrubbing
  const progressWrapper = document.getElementById('player-progress-wrapper');
  if (progressWrapper) {
    progressWrapper.addEventListener('click', (e) => {
      if (currentTrackIndex === -1 || isNaN(audioElement.duration)) return;
      const rect = progressWrapper.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      audioElement.currentTime = percentage * audioElement.duration;
    });
  }
  
  // Volume control
  const volumeWrapper = document.getElementById('player-volume-wrapper');
  if (volumeWrapper) {
    volumeWrapper.addEventListener('click', (e) => {
      const rect = volumeWrapper.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = Math.max(0, Math.min(1, clickX / width));
      
      audioElement.volume = percentage;
      const fill = document.getElementById('player-volume-fill');
      if (fill) fill.style.width = `${percentage * 100}%`;
      
      const icon = document.getElementById('player-volume-icon');
      if (icon) {
        if (percentage === 0) {
          icon.className = 'fas fa-volume-mute';
        } else if (percentage < 0.5) {
          icon.className = 'fas fa-volume-down';
        } else {
          icon.className = 'fas fa-volume-up';
        }
      }
    });
  }
}

// Format seconds into MM:SS
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Play a song by its index in the SONGS_LIST
function playSong(index) {
  if (index < 0 || index >= SONGS_LIST.length) return;
  
  const song = SONGS_LIST[index];
  if (!song.hasRecording) return;
  
  currentTrackIndex = index;
  
  // Update track metadata in player
  const playerTitle = document.getElementById('player-track-title');
  if (playerTitle) playerTitle.textContent = song.title;
  
  const playerArtist = document.getElementById('player-track-artist');
  if (playerArtist) playerArtist.textContent = `Written by ${song.author}`;
  
  // Reset progress bar
  const fill = document.getElementById('player-progress-fill');
  if (fill) fill.style.width = '0%';
  
  // Set audio source
  const src = getAudioPath(song.title);
  if (!src) {
    showToast(`"${song.title}" - Workin' on it!`);
    return;
  }
  
  audioElement.src = src;
  
  // Play audio
  audioElement.play()
    .then(() => {
      isPlaying = true;
      updatePlayerUI();
    })
    .catch(err => {
      console.error("Audio play failed:", err);
      showToast(`Could not play recording for "${song.title}".`);
      isPlaying = false;
      updatePlayerUI();
    });
}

// Play a song by its name
window.playSongByName = function(title) {
  const idx = SONGS_LIST.findIndex(s => s.title === title);
  if (idx !== -1) {
    if (currentTrackIndex === idx) {
      togglePlay();
    } else {
      playSong(idx);
    }
  }
};

// Toggle Play/Pause
window.togglePlay = function() {
  if (currentTrackIndex === -1) {
    // Play first available recording
    const firstRecIdx = SONGS_LIST.findIndex(s => s.hasRecording);
    if (firstRecIdx !== -1) playSong(firstRecIdx);
    return;
  }
  
  if (isPlaying) {
    audioElement.pause();
    isPlaying = false;
  } else {
    audioElement.play().catch(err => {
      console.error("Play failed:", err);
    });
    isPlaying = true;
  }
  updatePlayerUI();
};

// Previous Track (only cycles through available recordings)
window.prevTrack = function() {
  if (currentTrackIndex === -1) return;
  
  let idx = currentTrackIndex;
  let count = 0;
  do {
    idx = (idx - 1 + SONGS_LIST.length) % SONGS_LIST.length;
    count++;
  } while (!SONGS_LIST[idx].hasRecording && count < SONGS_LIST.length);
  
  if (SONGS_LIST[idx].hasRecording) {
    playSong(idx);
  }
};

// Next Track (only cycles through available recordings)
window.nextTrack = function() {
  if (currentTrackIndex === -1) return;
  
  let idx = currentTrackIndex;
  let count = 0;
  do {
    idx = (idx + 1) % SONGS_LIST.length;
    count++;
  } while (!SONGS_LIST[idx].hasRecording && count < SONGS_LIST.length);
  
  if (SONGS_LIST[idx].hasRecording) {
    playSong(idx);
  }
};

// Update Player play/pause button and equalizer visualizer
function updatePlayerUI() {
  const playIcon = document.getElementById('player-play-icon');
  if (playIcon) {
    playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }
  
  const eq = document.getElementById('player-equalizer');
  if (eq) {
    if (isPlaying) {
      eq.classList.add('eq-active');
    } else {
      eq.classList.remove('eq-active');
    }
  }
  
  // Refresh the tracklist to update the playing row styling
  const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
  renderSongs(activeFilter);
}

// 6. Toast Notifications System
window.showToast = function(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3200);
};

// 7. Lyrics Drawer Logic
window.openLyrics = function(title) {
  const song = SONGS_LIST.find(s => s.title === title);
  if (!song || !song.hasLyrics) return;
  
  const drawer = document.getElementById('lyrics-drawer');
  const overlay = document.getElementById('drawer-overlay');
  
  const titleEl = document.getElementById('drawer-title');
  const authorEl = document.getElementById('drawer-author');
  const container = document.getElementById('lyrics-container');
  
  titleEl.textContent = song.title;
  authorEl.textContent = `Written by ${song.author} ${song.tempo ? `• ${song.tempo}` : ''}`;
  
  container.innerHTML = '';
  
  song.sections.forEach(sec => {
    const secDiv = document.createElement('div');
    secDiv.className = 'lyrics-section';
    
    let label = sec.type.toUpperCase();
    let text = sec.text
      .replace(/(?:\r\n|\r|\n)/g, '<br>')
      .replace(/<b>/g, '<strong>')
      .replace(/<\/b>/g, '</strong>')
      .replace(/<div class="bg">/g, '<span class="bg">')
      .replace(/<\/div>/g, '</span>');
      
    let commentHtml = sec.comment 
      ? `<div class="lyrics-section-comment">${sec.comment.replace(/(?:\r\n|\r|\n)/g, '<br>')}</div>` 
      : '';
      
    secDiv.innerHTML = `
      <div class="lyrics-section-type">${label}</div>
      <div class="lyrics-section-text">${text}</div>
      ${commentHtml}
    `;
    
    container.appendChild(secDiv);
  });
  
  drawer.classList.add('open');
  overlay.classList.add('active');
};

window.closeLyrics = function() {
  const drawer = document.getElementById('lyrics-drawer');
  const overlay = document.getElementById('drawer-overlay');
  drawer.classList.remove('open');
  overlay.classList.remove('active');
};

// 8. Band Member Bios Logic
window.openBio = function(id) {
  const member = BAND_MEMBERS.find(m => m.id === id);
  if (!member) return;
  
  const modal = document.getElementById('bio-modal');
  
  document.getElementById('modal-img').src = member.image;
  document.getElementById('modal-img').alt = member.name;
  document.getElementById('modal-name').textContent = member.name;
  document.getElementById('modal-role').textContent = member.role;
  document.getElementById('modal-birthplace').textContent = member.birthplace;
  
  const shadeSpan = document.getElementById('modal-shade');
  shadeSpan.style.backgroundColor = member.shadeOfGray;
  shadeSpan.style.display = 'inline-block';
  shadeSpan.style.width = '24px';
  shadeSpan.style.height = '16px';
  shadeSpan.style.marginLeft = '8px';
  shadeSpan.style.verticalAlign = 'middle';
  shadeSpan.style.borderRadius = '2px';
  shadeSpan.style.border = '1px solid rgba(255,255,255,0.2)';
  
  const body = document.getElementById('modal-body');
  body.innerHTML = '';
  
  member.bio.forEach(pText => {
    const p = document.createElement('p');
    p.textContent = pText;
    body.appendChild(p);
  });
  
  if (member.turnOns) {
    const title = document.createElement('div');
    title.className = 'bio-section-title';
    title.textContent = 'Turn Ons:';
    
    const p = document.createElement('p');
    p.textContent = member.turnOns;
    
    body.appendChild(title);
    body.appendChild(p);
  }
  
  if (member.turnOffs) {
    const title = document.createElement('div');
    title.className = 'bio-section-title';
    title.textContent = 'Turn Offs:';
    
    const p = document.createElement('p');
    p.textContent = member.turnOffs;
    
    body.appendChild(title);
    body.appendChild(p);
  }
  
  modal.classList.add('open');
};

window.closeBio = function() {
  document.getElementById('bio-modal').classList.remove('open');
};

// 9. General Event Listeners Setup
function setupEventListeners() {
  const sections = document.querySelectorAll('section');
  const navLi = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    
    navLi.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  });
  
  // Catalog filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderSongs(filter);
    });
  });
  
  // Close modals on clicking backdrop
  const bioModal = document.getElementById('bio-modal');
  bioModal.addEventListener('click', (e) => {
    if (e.target === bioModal) {
      closeBio();
    }
  });
  
  const overlay = document.getElementById('drawer-overlay');
  overlay.addEventListener('click', () => {
    closeLyrics();
  });
  
  // Contact Form Submission (Mock)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        form.reset();
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
}
