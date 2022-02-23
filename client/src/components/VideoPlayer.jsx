import React, { Component } from 'react';
import YouTube from 'react-youtube';
import Equal from 'fast-deep-equal';

class VideoPlayer extends Component {

    // Can see exceptions from using this, but relates to cross origin ad stuff, and is irrelevant (https://stackoverflow.com/a/63820138)
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

    getClipStart() {
        return this.props.clip && typeof this.props.clip.start === 'number' && this.props.clip.start >= 0
            ? this.props.clip.start
            : null;
    }

    getClipEnd() {
        return this.props.clip && typeof this.props.clip.end === 'number' && this.props.clip.end >= 0
            ? this.props.clip.end
            : null;
    }

    componentDidUpdate(prevProps) {
        const player = this.state.player;
        if (player && (!Equal(prevProps.video, this.props.video) || !Equal(prevProps.clip, this.props.clip))) {
            var videoData = {
                videoId: this.props.video.videoId,
                startSeconds: this.getClipStart(),
                endSeconds: this.getClipEnd()
            };            
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
        const start = this.getClipStart() || 0;
        player.seekTo(start);
    }
}

export default VideoPlayer;