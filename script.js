document.addEventListener('DOMContentLoaded', () => {
    const songItems = document.querySelectorAll('.song-item');

    songItems.forEach(item => {
        const audio = item.querySelector('audio');
        const playPauseBtn = item.querySelector('.play-pause-btn');
        const playIcon = item.querySelector('.play-icon');
        const pauseIcon = item.querySelector('.pause-icon');
        const progressBarContainer = item.querySelector('.progress-bar-container');
        const progressBarFilled = item.querySelector('.progress-bar-filled');
        const currentTimeDisplay = item.querySelector('.current-time');
        const totalTimeDisplay = item.querySelector('.total-time');

        // Format time in MM:SS
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // Update total time when metadata loads
        audio.addEventListener('loadedmetadata', () => {
            if (audio.duration && isFinite(audio.duration)) {
                totalTimeDisplay.textContent = formatTime(audio.duration);
            } else {
                totalTimeDisplay.textContent = "0:00"; // Or some placeholder for streams/errors
            }
        });
        
        // Handle case where duration might still be NaN initially
        audio.addEventListener('durationchange', () => {
            if (audio.duration && isFinite(audio.duration)) {
                totalTimeDisplay.textContent = formatTime(audio.duration);
            }
        });


        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                // Pause all other audios before playing this one
                document.querySelectorAll('audio').forEach(otherAudio => {
                    if (otherAudio !== audio && !otherAudio.paused) {
                        otherAudio.pause();
                        // Reset their play/pause buttons if they exist
                        const otherItem = otherAudio.closest('.song-item');
                        if (otherItem) {
                           const otherPlayIcon = otherItem.querySelector('.play-icon');
                           const otherPauseIcon = otherItem.querySelector('.pause-icon');
                           if (otherPlayIcon && otherPauseIcon) {
                               otherPlayIcon.style.display = 'block';
                               otherPauseIcon.style.display = 'none';
                               otherItem.querySelector('.play-pause-btn').setAttribute('aria-label', 'Play');
                           }
                        }
                    }
                });
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                playPauseBtn.setAttribute('aria-label', 'Pause');
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                playPauseBtn.setAttribute('aria-label', 'Play');
            }
        });

        // Update progress bar and current time
        audio.addEventListener('timeupdate', () => {
            if (audio.duration && isFinite(audio.duration)) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progressBarFilled.style.width = `${progressPercent}%`;
                currentTimeDisplay.textContent = formatTime(audio.currentTime);
            } else {
                 // Reset if duration is not available
                progressBarFilled.style.width = `0%`;
                currentTimeDisplay.textContent = formatTime(audio.currentTime); // still show current time even if duration unknown
            }
        });

        // Seek functionality
        progressBarContainer.addEventListener('click', (e) => {
            if (audio.duration && isFinite(audio.duration)) {
                const progressBarRect = progressBarContainer.getBoundingClientRect();
                const clickPositionX = e.clientX - progressBarRect.left;
                const seekTime = (clickPositionX / progressBarRect.width) * audio.duration;
                audio.currentTime = seekTime;
            }
        });

        // Reset when audio ends
        audio.addEventListener('ended', () => {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playPauseBtn.setAttribute('aria-label', 'Play');
            progressBarFilled.style.width = '0%';
            audio.currentTime = 0; // Reset time
            currentTimeDisplay.textContent = formatTime(0);
        });
    });
});

