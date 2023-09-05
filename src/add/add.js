const cameraFeed = document.getElementById("cameraFeed");
const captureButton = document.getElementById("captureButton");
const canvas = document.getElementById("canvas");
const imageContainer = document.getElementById("imageContainer");
const saveButton = document.getElementById("saveButton");
let selectedImages = [];

let facingMode = "environment"; // Başlangıçta arka kamera

captureButton.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode },
    });

    cameraFeed.style.display = "block"; // Kamera görüntüsünü göster
    captureButton.style.display = "none"; // Butonu gizle

    cameraFeed.srcObject = stream;
    cameraFeed.play();
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
});

let capturedPhotoBlob = null;
let overlayContainer = null; // Değişkeni tanımlayın

// Kameranın boyutlarını pencere boyutlarına uygun olarak güncelle
cameraFeed.width = window.innerWidth;
cameraFeed.height = window.innerHeight;

// KameraFeed boyutlarını güncelle
window.addEventListener("resize", () => {
  cameraFeed.width = window.innerWidth;
  cameraFeed.height = window.innerHeight;
});

cameraFeed.addEventListener("click", async () => {
  canvas.width = cameraFeed.videoWidth;
  canvas.height = cameraFeed.videoHeight;
  canvas
    .getContext("2d")
    .drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

  capturedPhotoBlob = await new Promise((resolve) =>
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg")
  );

  createOverlay();
});

function createOverlay() {
  overlayContainer = document.createElement("div");
  overlayContainer.style.position = "fixed";
  overlayContainer.style.top = "0";
  overlayContainer.style.left = "0";
  overlayContainer.style.width = "100%";
  overlayContainer.style.height = "100%";
  overlayContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlayContainer.style.display = "flex";
  overlayContainer.style.alignItems = "center";
  overlayContainer.style.justifyContent = "center";
  document.body.appendChild(overlayContainer);
  // ______________________________________________________
  const overlayContent = document.createElement("div");
  overlayContent.classList = "overlayContent_div";
  overlayContainer.appendChild(overlayContent);
  // ____________________________________________________
  const overlayImage = document.createElement("img");
  overlayImage.src = URL.createObjectURL(capturedPhotoBlob);
  overlayImage.style.width = "300px";
  overlayImage.style.height = "auto";
  overlayImage.style.borderRadius = "10px";
  overlayContent.appendChild(overlayImage);
  // _______________________________________________________
  const overlayBtn = document.createElement("div");
  overlayBtn.classList = "overlayBtn_div";
  overlayContent.appendChild(overlayBtn);

  // ________________________________________
  const addButton = document.createElement("button");
  addButton.className = "add_btn";
  addButton.textContent = "Yadda saxla";
  addButton.addEventListener("click", () => {
    const currentTime = new Date(); // Şu anki tarih ve saat
    const imageData = {
      blob: capturedPhotoBlob,
      timestamp: currentTime.toISOString(), // Tarih ve saat ISO 8601 formatında
    };
    imageContainer.appendChild(createThumbnail(capturedPhotoBlob));
    selectedImages.push(imageData);
    closeOverlay();
  });
  overlayBtn.appendChild(addButton);
  //   ____________________________________________________________

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel_btn";

  cancelButton.textContent = "İmtina et";
  cancelButton.addEventListener("click", () => {
    closeOverlay();
  });
  overlayBtn.appendChild(cancelButton);
}

function createThumbnail(blob) {
  const thumbnail = document.createElement("img");
  thumbnail.src = URL.createObjectURL(blob);
  thumbnail.style.width = "80px";
  thumbnail.style.height = "80px";
  thumbnail.style.objectFit = "cover";
  thumbnail.style.margin = "5px";
  return thumbnail;
}

function closeOverlay() {
  cameraFeed.style.display = "none";
  captureButton.style.display = "block";
  capturedPhotoBlob = null;
  if (overlayContainer) {
    document.body.removeChild(overlayContainer);
  }
}

saveButton.addEventListener("click", () => {
  if (selectedImages.length > 0) {
    console.log("Selected Images:", selectedImages);
    document.querySelector("#multiple_data").value = selectedImages;
    // Burada seçilen görüntüleri sunucuya gönderme işlemini yapabilirsiniz.
    // Örneğin fetch() veya XMLHttpRequest kullanarak POST isteği göndermek.
  } else {
    console.log("No images selected.");
  }
});

// ______________________Buttons____________________

const buttons = document.querySelectorAll(".status_body_buttons_end button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => {
      btn.classList.remove("status_body_buttons_red");
      btn.classList.add("status_body_buttons_gray");
    });
    button.classList.remove("status_body_buttons_gray");
    button.classList.add("status_body_buttons_red");
  });
});
