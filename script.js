// [All your existing JavaScript remains exactly the same until the ADMIN_DISCORD_IDS]

// Update this array with 7 admin IDs
const ADMIN_DISCORD_IDS = [
    "1336300127815598153",
    "1336472828379140159",
    "ADMIN_ID_3",
    "ADMIN_ID_4",
    "ADMIN_ID_5",
    "ADMIN_ID_6",
    "ADMIN_ID_7"
];

// [Keep all existing code until the end, then add these new functions]

// Enhanced Video Player Controls
function setupVideoControls() {
    const video = document.getElementById('modalVideoPlayer');
    const playPause = document.getElementById('playPause');
    const rewind5s = document.getElementById('rewind5s');
    const forward5s = document.getElementById('forward5s');
    const forward10s = document.getElementById('forward10s');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');

    // Double tap to skip (mobile)
    video.addEventListener('dblclick', (e) => {
        const rect = video.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width/2) {
            video.currentTime -= 10;
        } else {
            video.currentTime += 10;
        }
    });

    // Control buttons
    playPause.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPause.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPause.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    rewind5s.addEventListener('click', () => video.currentTime -= 5);
    forward5s.addEventListener('click', () => video.currentTime += 5);
    forward10s.addEventListener('click', () => video.currentTime += 10);

    // Time updates
    video.addEventListener('timeupdate', () => {
        currentTime.textContent = formatTime(video.currentTime);
    });

    video.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(video.duration);
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Persistent Storage
function setupPersistentStorage() {
    // Migrate old data if needed
    if (localStorage.getItem('tutorialVideos') && !localStorage.getItem('videos')) {
        localStorage.setItem('videos', localStorage.getItem('tutorialVideos'));
    }
    
    // Load videos
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
        videos = JSON.parse(savedVideos);
        renderVideoGrid();
    }
    
    // Preserve profile data on logout
    const originalLogout = setupLogout;
    setupLogout = function() {
        const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        originalLogout();
        localStorage.setItem('profileData', JSON.stringify(profileData));
    };
}

// Update uploadVideo function
function uploadVideo() {
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;
    const videoFile = document.getElementById('videoFile').files[0];
    
    if (!title || !description || !videoFile) {
        showSuccessMessage('Please fill in all required fields');
        return;
    }
    
    // In production, this would upload to your server
    const newVideo = {
        id: Date.now().toString(),
        title,
        description,
        videoUrl: URL.createObjectURL(videoFile),
        thumbnailUrl: 'https://via.placeholder.com/400x225/1a1a2e/ff3366?text=' + encodeURIComponent(title),
        uploadDate: new Date().toLocaleDateString(),
        duration: '0:00'
    };
    
    videos.unshift(newVideo);
    localStorage.setItem('videos', JSON.stringify(videos));
    renderVideoGrid();
    videoUploadForm.reset();
    showSuccessMessage('Video uploaded successfully!');
}

// Update init function
function init() {
    createStars();
    checkExistingSession();
    checkAuthResponse();
    initDiscordLogin();
    initSidebarToggle();
    initMobileMenu();
    initContentNavigation();
    initProfile();
    initVideoSystem();
    setupNotifications();
    setupAdminNotificationControls();
    setupLogout();
    setupVideoControls();
    setupPersistentStorage();
}
