import React, { Component } from 'react';
import YouTube from 'react-youtube';

class VideoPlayer extends Component {
    opts = {
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,            // Auto-play the video on load
            controls: 1,            // Show pause/play buttons in player
            showinfo: 0,            // Hide the video title
            modestbranding: 1,      // Hide the Youtube Logo
            fs: 1,                  // Hide the full screen button
            cc_load_policy: 0,      // Hide closed captions
            iv_load_policy: 3,      // Hide the Video Annotations
            autohide: 0,            // Hide video controls when playing
        },
    }
        
    constructor(props) {
        super(props);
        this.state = { player: null };
    }

    componentDidUpdate(prevProps) {
        const player = this.state.player;
        if (!player) {
            return;
        }

        if (prevProps.video && this.props.video
            && (prevProps.video.videoId === this.props.video.videoId
                || prevProps.video.start === this.props.video.start
                || prevProps.video.end === this.props.video.end)) {
            var videoData = { videoId: this.props.video.videoId }
            if (typeof this.props.video.start === 'number' && this.props.video.start >= 0){
                videoData.startSeconds = this.props.video.start;
            }
            if (typeof this.props.video.end === 'number' && this.props.video.end >= 0){
                videoData.endSeconds = this.props.video.end;
            }
            
            player.loadVideoById(videoData);
        }        
    }

    render() {
        return(
            <div className="container-center">
                <div className="form-video-wrapper">
                    <YouTube
                        videoId={this.props.video.videoId}
                        opts={this.opts}
                        onReady={(e) => this.onReady(e)} // fat arrow for 'this' scope
                        onEnd={(e) => this.onEnd(e)}
                    />
                </div>
            </div>
        );
    }

    onReady(e) {
        // access to player in all event handlers via event.target
        const player = e.target;
        this.setState({ player });
        player.mute();
    }

    onEnd(e) {
        const player = e.target;
        const start = typeof this.props.video.start === 'number' && this.props.video.start >= 0 ? this.props.video.start : 0
        player.seekTo(start);
    }
}

export default VideoPlayer;