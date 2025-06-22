// models/api.js
const Api = {
  async fetchStories(token) {
    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result.listStory;
  },

  async fetchStoriesWithMap(token) {
    const response = await fetch("https://story-api.dicoding.dev/v1/stories?location=1", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result.listStory;
  },

  async login(email, password) {
  try {
    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  } catch (err) {
    throw new Error("Gagal menghubungi server. Pastikan Anda terhubung ke internet.");
  }
},

  async register(name, email, password) {
    const response = await fetch("https://story-api.dicoding.dev/v1/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },

  async uploadStory({ photoBlob, description, lat, lon, token }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("lat", lat);
    formData.append("lon", lon);
    formData.append("photo", photoBlob, "photo.jpg");

    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },
};

export default Api;
