export class VideoPlayer {
  constructor() {
    this.playerElement = null;
    this.lockMouseCheck = null;
    this.videoElement = null;
    this.fullScreenButtonElement = null;

  }

  /**
 * @param {Element} playerElement parent element for create video player
 * @param {HTMLInputElement} lockMouseCheck use checked propety for lock mouse 
 */
  createPlayer(playerElement, lockMouseCheck) {
    this.playerElement = playerElement;
    this.lockMouseCheck = lockMouseCheck;

    this.videoElement = document.createElement('video');
    this.videoElement.id = 'Video';
    this.videoElement.style.touchAction = 'none';
    this.videoElement.playsInline = true;
    this.videoElement.srcObject = new MediaStream();
    this.videoElement.addEventListener('loadedmetadata', this._onLoadedVideo.bind(this), true);
    this.playerElement.appendChild(this.videoElement);

    // add fullscreen button
    this.fullScreenButtonElement = document.createElement('img');
    this.fullScreenButtonElement.id = 'fullscreenButton';
    this.fullScreenButtonElement.src = '../images/FullScreen.png';
    this.fullScreenButtonElement.addEventListener("click", this._onClickFullscreenButton.bind(this));
    this.playerElement.appendChild(this.fullScreenButtonElement);

    document.addEventListener('webkitfullscreenchange', this._onFullscreenChange.bind(this));
    document.addEventListener('fullscreenchange', this._onFullscreenChange.bind(this));
    this.videoElement.addEventListener("click", this._mouseClick.bind(this), false);
  }

  _onLoadedVideo() {
    this.videoElement.play();
  }

  _onClickFullscreenButton() {
    if (!document.fullscreenElement || !document.webkitFullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else {
        if (this.playerElement.style.position === "absolute") {
          this.playerElement.style.position = "relative";
        } else {
          this.playerElement.style.position = "absolute";
        }
      }
    }
  }

  _onFullscreenChange() {
    if (document.webkitFullscreenElement || document.fullscreenElement) {
      this.playerElement.style.position = "absolute";
      this.fullScreenButtonElement.style.display = 'none';

      if (this.lockMouseCheck.checked) {
        if (document.webkitFullscreenElement.requestPointerLock) {
          document.webkitFullscreenElement.requestPointerLock();
        } else if (document.fullscreenElement.requestPointerLock) {
          document.fullscreenElement.requestPointerLock();
        } else if (document.mozFullScreenElement.requestPointerLock) {
          document.mozFullScreenElement.requestPointerLock();
        }

        // Subscribe to events
        document.addEventListener('mousemove', this._mouseMove.bind(this), false);
        document.addEventListener('click', this._mouseClickFullScreen.bind(this), false);
      }
    }
    else {
      this.playerElement.style.position = "relative";
      this.fullScreenButtonElement.style.display = 'block';

      document.removeEventListener('mousemove', this._mouseMove.bind(this), false);
      document.removeEventListener('click', this._mouseClickFullScreen.bind(this), false);
    }
  }

  _mouseMove(event) {
    // Forward mouseMove event of fullscreen player directly to sender
    // This is required, as the regular mousemove event doesn't fire when in fullscreen mode
    this.sender._onMouseEvent(event);
  }

  _mouseClick() {
    // Restores pointer lock when we unfocus the player and click on it again
    if (this.lockMouseCheck.checked) {
      if (this.videoElement.requestPointerLock) {
        this.videoElement.requestPointerLock().catch(function () { });
      }
    }
  }

  _mouseClickFullScreen() {
    // Restores pointer lock when we unfocus the fullscreen player and click on it again
    if (this.lockMouseCheck.checked) {
      if (document.webkitFullscreenElement.requestPointerLock) {
        document.webkitFullscreenElement.requestPointerLock();
      } else if (document.fullscreenElement.requestPointerLock) {
        document.fullscreenElement.requestPointerLock();
      } else if (document.mozFullScreenElement.requestPointerLock) {
        document.mozFullScreenElement.requestPointerLock();
      }
    }
  }

  /**
   * @param {MediaStreamTrack} track 
   */
  addTrack(track) {
    if (!this.videoElement.srcObject) {
      return;
    }

    this.videoElement.srcObject.addTrack(track);
  }



  get videoWidth() {
    return this.videoElement.videoWidth;
  }

  get videoHeight() {
    return this.videoElement.videoHeight;
  }
}