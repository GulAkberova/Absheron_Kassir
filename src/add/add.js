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

// ___________________________INFO_MODAL_BTN____________________________
// Add these functions to your existing JavaScript code

function openModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function saveModal() {
  const textareaValue = document.getElementById("myTextarea").value;
  console.log("Textarea Value:", textareaValue);
  // You can include additional logic here, such as sending the value to the server

  // Close the modal
  closeModal();
}
// __________________________________________

function openModal(modal) {
  modal.style.display = "block";
}

function closeModal(modal) {
  modal.style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
  const openInfoButton = document.getElementById("open-info-button");
  const openStatusButton = document.getElementById("open-status-button");
  const infoModal = document.getElementById("info_modal");
  const statusModal = document.getElementById("status_modal");
  const closeCalendarButton = document.getElementById("close_calendar");
  const closeStatusButton = document.getElementById("close_status");
  const modalSendButton = document.getElementById("modal_send_btn");
  const modalSendStatusButton = document.getElementById(
    "modal_send_status_btn"
  );

  infoModal.style.display = "none";
  statusModal.style.display = "none";

  openInfoButton.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(infoModal);
  });
  openStatusButton.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(statusModal);
  });

  closeCalendarButton.addEventListener("click", () => {
    closeModal(infoModal);
  });
  closeStatusButton.addEventListener("click", () => {
    closeModal(statusModal);
  });
  modalSendButton.addEventListener("click", () => {
    const textareaValue = document.getElementById("myTextarea").value;
    console.log("Textarea Value:", textareaValue);
    closeModal(infoModal);
  });
  modalSendStatusButton.addEventListener("click", () => {
    const statusRadioButtons = document.getElementsByName("status");
    let selectedStatus = null;

    for (const radioButton of statusRadioButtons) {
      if (radioButton.checked) {
        selectedStatus = radioButton.value;
        break;
      }
    }

    if (selectedStatus) {
      console.log("Selected Status:", selectedStatus);
      closeModal(statusModal);
    } else {
      console.log("Please select a status.");
    }
  });
  window.addEventListener("click", (event) => {
    if (event.target === infoModal) {
      closeModal(infoModal);
    }

    if (event.target === statusModal) {
      closeModal(statusModal);
    }
  });
});

// _________________________________________---

saveButton.addEventListener("click", () => {
  if (selectedImages.length > 0) {
    console.log("Selected Images:", selectedImages);
    const formData = new FormData();
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("photos", selectedImages[i]);
      console.log(selectedImages[i], "seEeeeeee"); // Append the image file to the "photos[]" array
    }
    formData.append("status", statuss);
    console.log(statuss, "formData");

    // ____________________________INFOOOO____________________________
    // Append textarea value to FormData
    formData.append("additionalInfo", textareaValue);
    console.log(textareaValue, "textareaValue");

    // ____________________________STATUSSSS_____________________________

    formData.append("selectedStatus", selectedStatus);
    console.log(selectedStatus, "selectedStatus");

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
