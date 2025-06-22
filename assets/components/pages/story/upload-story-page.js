

const UploadStoryView = {
  // === VIEW SECTION ===

  renderToApp() {
    const app = document.querySelector('#app');
    app.innerHTML = this.render();
  },

  render() {
    return `
      <section class="upload-page">
        <h2>Upload Your Style</h2>
        <form id="uploadForm">
          <label for="description">Deskripsi:</label>
          <textarea id="description" name="description" required></textarea>

          <label>Ambil Foto:</label>
          <video id="video" autoplay playsinline width="100%" style="border:1px solid #ccc;"></video>
          <canvas id="canvas" style="display:none;"></canvas>
          <button type="button" id="capture">📸 Ambil Foto</button>

          <input type="hidden" id="latitude" name="lat" />
          <input type="hidden" id="longitude" name="lon" />
          <div id="map" style="height: 300px; margin-top: 15px;"></div>

          <div class="form-buttons">
            <button type="submit">Kirim</button>
            <button type="button" id="cancelUpload">Batal</button>
          </div>
        </form>
      </section>
    `;
  },

  bindEvents({ onCapture, onSubmit, onCancel }) {
    this.getCaptureButton().addEventListener("click", onCapture);
    this.getForm().addEventListener("submit", onSubmit);
    this.getCancelButton().addEventListener("click", onCancel);
  },

  // === DOM Accessors ===
  getVideoElement() {
    return document.getElementById("video");
  },

  getCanvasElement() {
    return document.getElementById("canvas");
  },

  getCaptureButton() {
    return document.getElementById("capture");
  },

  getForm() {
    return document.getElementById("uploadForm");
  },

  getCancelButton() {
    return document.getElementById("cancelUpload");
  },

  getDescription() {
    return document.getElementById("description").value;
  },

  getLatitude() {
    return document.getElementById("latitude").value;
  },

  getLongitude() {
    return document.getElementById("longitude").value;
  },

  getMapContainer() {
    return document.getElementById("map");
  },

  showCanvas() {
    this.getCanvasElement().style.display = "block";
    this.getVideoElement().style.display = "none";
  },

  hideCanvas() {
    this.getCanvasElement().style.display = "none";
    this.getVideoElement().style.display = "block";
  },

  updateLocation(lat, lon) {
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lon;
  },

  clearFields() {
    document.getElementById("description").value = '';
    document.getElementById("latitude").value = '';
    document.getElementById("longitude").value = '';
  },

  // === MODEL SECTION ===

  async getPhotoBlob() {
    const canvas = this.getCanvasElement();
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  },

};

export default UploadStoryView;
