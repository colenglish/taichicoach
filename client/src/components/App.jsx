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
      currentVideo: form.videos && form.videos.length > 0 ? form.videos[0] : defaultVideo // First of the list for now
    });
  }

  handleMovementClick(movement) {
    this.setState({
      currentMovement: movement,
      currentVideo: movement.videos && movement.videos.length > 0 ? movement.videos[0] : defaultVideo, // First of the list for now
      showFormSelector: false // also hide the selector at this levely of detail
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
          <VideoPlayer video={this.state.currentVideo} />
        </div>
      </>
    );
  }
}

export default App;
