import UploadStoryView from './upload-story-page.js';
import Api from "../../data/api.js";
import { navigateTo } from '../../app.js';

class UploadStoryPresenter {
  constructor() {
    this.view = UploadStoryView;
  }

  async init() {
    this.view.renderToApp();
    this.view.bindEvents({
      onCapture: () => this.capturePhoto(),
      onSubmit: (event) => this.submitForm(event),
      onCancel: () => this.cancelUpload(),
    });

    await this.initCamera();
    this.initMap();
  }

  async initCamera() {
    const video = this.view.getVideoElement();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error('Gagal mengakses kamera:', error);
    }
  }

  capturePhoto() {
    const video = this.view.getVideoElement();
    const canvas = this.view.getCanvasElement();
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    this.view.showCanvas();
  }

 initMap() {
  this.map = L.map(this.view.getMapContainer());

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.map.setView([latitude, longitude], 13); // ← pakai this.map
      },
      () => {
        this.map.setView([0, 0], 2);
      }
    );
  } else {
    this.map.setView([0, 0], 2);
  }

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(this.map);

  this.map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    this.view.updateLocation(lat, lng);

    if (!this.marker) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    } else {
      this.marker.setLatLng([lat, lng]);
    }
  });
}


   async submitForm(event) {
    event.preventDefault();

    const description = this.view.getDescription();
    const lat = this.view.getLatitude();
    const lon = this.view.getLongitude();

    if (!lat || !lon) {
      alert("Silakan pilih lokasi pada peta terlebih dahulu.");
      return;
    }

    const photoBlob = await this.view.getPhotoBlob();
    if (!photoBlob) {
      alert("Silakan ambil foto terlebih dahulu.");
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      showLoading(); 
      await Api.uploadStory({ photoBlob, description, lat, lon, token }); // ✅ panggil model
      alert("Berhasil diunggah!");

      this.view.clearFields();
      this.view.hideCanvas();
      setTimeout(() => {
        navigateTo("#home");
      }, 100);

    } catch (error) {
      alert("Gagal mengunggah cerita: " + error.message);
      console.error(error);
    } finally {
      hideLoading(); // pakai loading global
    }
  }


 destroy() {
  const video = this.view.getVideoElement();

  if (video && video.srcObject) {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }

  if (this.map) {
    this.map.remove();
    this.map = null;
  }
}



  cancelUpload() {
    this.view.clearFields();
    this.view.hideCanvas();

    navigateTo('#home')
  }
}

export default UploadStoryPresenter;
