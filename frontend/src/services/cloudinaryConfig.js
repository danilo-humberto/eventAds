import * as ImagePicker from "expo-image-picker";

const CLOUD_NAME = "dtjie5qfj";
const UPLOAD_PRESET = "eventAds";

const BACKEND_URL = "http://192.168.1.24:3001";

export async function pickImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permission.status !== "granted") {
    Alert.alert("Permissão necessária", "Permita acesso à galeria.");

    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
}

export async function uploadImage(photo) {
  const data = new FormData();

  if (photo.file) {
    data.append("file", photo.file);
  } else {
    data.append("file", {
      uri: photo.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
  }

  data.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: data,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Erro ao enviar imagem");
  }

  return result;
}

export async function uploadCompleto(photo) {
  const cloudinaryImage = await uploadImage(photo);

  return cloudinaryImage;
}
