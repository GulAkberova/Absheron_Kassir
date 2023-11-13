const cameraFeed = document.getElementById("cameraFeed");
const cameraFeed_Bigdiv = document.getElementById("cameraFeed_Bigdiv");
const captureButton = document.getElementById("captureButton");
const canvas = document.getElementById("canvas");
const imageContainer = document.getElementById("imageContainer");
const saveButton = document.getElementById("saveButton");
let selectedImages = [];

let facingMode = "environment"; // Başlangıçta arka kamera
// URL'den id'yi al
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const idd = parseInt(id);

captureButton.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode },
    });

    cameraFeed_Bigdiv.style.display = "block"; // Kamera görüntüsünü göster
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
// cameraFeed.width = window.innerWidth;
// cameraFeed.height = window.innerHeight;

// KameraFeed boyutlarını güncelle
window.addEventListener("resize", () => {
  // cameraFeed.width = window.innerWidth;
  // cameraFeed.height = window.innerHeight;
});
const cameraFeedBtn = document.getElementById("cameraFeedBtn");
cameraFeedBtn.addEventListener("click", async () => {
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
    // _______________________________________________________________

    // const canvasDataUrl = canvas.toDataURL("image/jpeg"); // Get the canvas data as a data URL
    // const base64Image = canvasDataUrl.split(",")[1]; // Extract the base64-encoded image data
    // console.log(canvasDataUrl, "url");
    // console.log(base64Image, "base64Image");

    // // Convert the base64 data to a Blob object
    // const byteCharacters = atob(base64Image);
    // const byteNumbers = new Array(byteCharacters.length);
    // console.log(byteCharacters, "byteCharacters");
    // console.log(byteNumbers, "byteNumbers");

    // for (let i = 0; i < byteCharacters.length; i++) {
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }

    // const byteArray = new Uint8Array(byteNumbers);
    // const imageBlob = new Blob([byteArray], { type: "image/jpeg" });
    // console.log(byteArray, "byteArray");
    // console.log(imageBlob, "imageBlob");

    // ___________________________________________________________________________--

    const blob = capturedPhotoBlob;

    const fileName = currentTime.toISOString() + ".jpg"; // Generate a unique filename using the timestamp
    const imageFile = new File([blob], fileName, { type: "image/jpeg" }); // Create a File object
    console.log(imageFile, "imageFile");
    imageContainer.appendChild(createThumbnail(blob)); // Display the thumbnail using the original Blob
    selectedImages.push(imageFile); // Add the image data with the File object to the array
    closeOverlay();
  });
  console.log(selectedImages, "selectedImages");
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
function createThumbnail2(blob) {
  const thumbnail = document.createElement("img");
  thumbnail.src = URL.createObjectURL(blob);
  thumbnail.style.width = "800px";
  thumbnail.style.height = "6000px";
  thumbnail.style.objectFit = "cover";
  thumbnail.style.margin = "5px";
  return thumbnail;
}

function closeOverlay() {
  cameraFeed_Bigdiv.style.display = "none";
  captureButton.style.display = "block";
  capturedPhotoBlob = null;
  if (overlayContainer) {
    document.body.removeChild(overlayContainer);
  }
}
// ______________________Buttons____________________
let statuss = false;
console.log(statuss, "statuss");
// Buttons olay dinleyicilerini ekle
const buttons = document.querySelectorAll(".status_body_buttons_end button");

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    // Tüm düğmeleri gri yap
    buttons.forEach((btn) => {
      btn.classList.remove("status_body_buttons_red");
      btn.classList.add("status_body_buttons_gray");
      console.log(btn);
    });

    // Seçilen düğmeyi kırmızı yap ve status'u güncelle
    button.classList.remove("status_body_buttons_gray");
    button.classList.add("status_body_buttons_red");

    // Status'u güncelle (true veya false)
    statuss = index === 0; // İlk düğme tıklanırsa status true, ikinci düğme tıklanırsa status false
    console.log("Status:", statuss);
  });
});
const arr = [];

saveButton.addEventListener("click", () => {
  if (selectedImages.length > 0) {
    console.log("Selected Images:", selectedImages);
    const formData = new FormData();
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("photos", selectedImages[i]);
      console.log(selectedImages[i], "seEeeeeee"); // Append the image file to the "photos[]" array
    }
    // formData.append("id", Id);
    formData.append("status", statuss);
    // console.log(formData, "formData");
    console.log(statuss, "formData");

    $.ajax({
      url: `https://cms.absherontm.az/api/admin/shoprepo/shops/update?Id=26&PrestijId=6&SektorId=8`,
      method: "POST",
      dataType: false,
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        // Update the HTML element with the retrieved data
        console.log(data, "request");
      },
      error: function (xhr, status, error) {
        // Handle errors here
        console.error("AJAX error:", error);
      },
    });
  }
});
