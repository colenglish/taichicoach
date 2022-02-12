var player;
var currentVideo;

function onYouTubeIframeAPIReady() {
    // an iframe element on the page already defines the player with which the API will be used.
    // Note that either the player's src URL must set the enablejsapi parameter to 1 (see index.html) or the element's enablejsapi attribute must be set to true.
    player = new YT.Player('form-video-iframe', {
        playerVars: {
            autoplay: 1,            // Auto-play the video on load
            controls: 0,            // Show pause/play buttons in player
            showinfo: 0,            // Hide the video title
            modestbranding: 1,      // Hide the Youtube Logo
            fs: 1,                  // Hide the full screen button
            cc_load_policy: 0,      // Hide closed captions
            iv_load_policy: 3,      // Hide the Video Annotations
            autohide: 0,            // Hide video controls when playing
        },
        events: {
            'onStateChange': event => {
                if (event.data === YT.PlayerState.ENDED) {
                    player.seekTo(typeof currentVideo.start === 'number' && currentVideo.start >= 0 ? currentVideo.start : 0);
                }
            },
            'onReady': e => e.target.mute()
        }
    });
};

var loadFormVideo = () => {
    if (!player) {
        return;
    }
    var videoData = { videoId: currentVideo.videoId }
    if (typeof currentVideo.start === 'number' && currentVideo.start >= 0){
        videoData.startSeconds = currentVideo.start;
    }
    if (typeof currentVideo.end === 'number' && currentVideo.end >= 0){
        videoData.endSeconds = currentVideo.end;
    }
    
    player.loadVideoById(videoData);
};

window.onload = () => {
    const formList = document.querySelector('.forms-list');
    const movementlist = document.querySelector('.movements-list');

    fetch('http://localhost:3000/forms')
        .then(res => res.json())
        .then(forms => {
            forms.forEach(form => {
                let listItem = document.createElement('div');
                listItem.classList.add('forms-item');
                listItem.innerText = form.name;
                formList.appendChild(listItem);
                listItem.addEventListener('click', ev => {
                    if(form.videos && form.videos.length > 0) {
                        currentVideo = form.videos[0]; // First of the list
                        loadFormVideo();
                    }

                    movementlist.innerHTML = '';
                    form.movements.forEach((movement, index) => {
                        let listItem = document.createElement('div');
                        listItem.classList.add('movements-item');
                        listItem.innerText = movement.name;
                        movementlist.appendChild(listItem);
                        listItem.addEventListener('click', ev => {
                            if(movement.videos && movement.videos.length > 0) {
                                currentVideo = movement.videos[0]; // First of the list
                                loadFormVideo();
                            } 
                            
                            ev.preventDefault();
                        });
                    });

                    ev.preventDefault();
                })
            });            
        });
}