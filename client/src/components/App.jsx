import React, { Component } from 'react';
import Header from './Header';
import FormSelector from './FormSelector';
import VideoPlayer from './VideoPlayer';

const defaultVideo = {
  videoId: 'c3kAq_Bmomc'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Colin",
      error: null,
      forms: [],
      currentForm: null,
      currentMovement: null,
      currentVideo: defaultVideo,
      showFormSelector: false
    }
  }

  componentDidMount() {
    fetch('/forms')
      .then(res => res.json())
      .then(
        result => this.setState({ forms: result }),
        error => this.setState({ error })
      )
  }

  handleFormClick(form) {
    this.setState({
      currentForm: form,
      currentMovement: null,
      currentVideo: form.videos && form.videos.length > 0 ? form.videos[0] : defaultVideo, // First of the list for now
      currentClip: null
    });
  }

  handleMovementClick(movement) {
    this.setState({
      currentMovement: movement,
      currentClip: this.state.currentVideo.clips && this.state.currentVideo.clips.find(clip => clip.ref === movement._id),
      showFormSelector: false // also hide the selector at this level of detail
    });
  }

  handleFormSelectorClose() {
    this.setState({ showFormSelector: false });
  }

  handleFormSelectorShow() {
    this.setState({ showFormSelector: true });
  }

  render() {
    const { error, forms } = this.state;
    if (error) {
      return <div>Error loading forms: {error.message}</div>;
    }

    return (
      <>
        <div>
          <Header name={this.state.name} onShowFormSelector={() => this.handleFormSelectorShow()} />
        </div>        
        <div className='container'>
          <FormSelector
            forms={this.state.forms}
            currentForm={this.state.currentForm}
            currentMovement={this.state.currentMovement}
            show={this.state.showFormSelector}
            onFormClick={form => this.handleFormClick(form)}
            onMovementClick={movement => this.handleMovementClick(movement)}
            onClose={() => this.handleFormSelectorClose()} />
          <VideoPlayer video={this.state.currentVideo} clip={this.state.currentClip} />
        </div>
      </>
    );
  }
}

export default App;
