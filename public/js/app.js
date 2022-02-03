var player;
var videoId;
var videoStart;
var videoEnd;

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
                    loadFormVideo();
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
    var videoData = { videoId: videoId }
    if (typeof videoStart === 'number' && videoStart >= 0){
        videoData.startSeconds = videoStart;
    }
    if (typeof videoEnd === 'number' && videoEnd >= 0){
        videoData.endSeconds = videoEnd;
    }
    
    player.loadVideoById(videoData);
};

window.onload = () => {
    const formList = document.querySelector('.forms-list');
    console.log(formList);
    const movementWrapper = document.querySelector('.movements-wrapper');

    fetch('http://localhost:3000/forms')
        .then(res => res.json())
        .then(forms => {
            forms.forEach(form => {
                let listItem = document.createElement('div');
                listItem.classList.add('forms-item');
                listItem.innerText = form.name;
                formList.appendChild(listItem);
                listItem.addEventListener('click', ev => {
                    let video = form.videos[0]
                    if (video){
                        videoId = video.youtubeVideoId;
                        videoStart = null;
                        videoEnd = null;
                        loadFormVideo();
                    }

                    movementWrapper.childNodes.forEach(child => child.remove());
                    form.movements.forEach((movement, index) => {
                        let listItem = document.createElement('div');
                        listItem.classList.add('movements-item');
                        listItem.innerText = movement.name;
                        movementWrapper.appendChild(listItem);
                        listItem.addEventListener('click', ev => {
                            if(video){
                                let duration = (video.movementDurations && video.movementDurations.length > index+1) ? video.movementDurations[index] : [];
                                videoStart = duration.length > 0 ? duration[0] : null;
                                videoEnd = duration.length > 1 ? duration[1] : null;
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