const cameraFeed = document.getElementById("cameraFeed");
const captureButton = document.getElementById("captureButton");
const canvas = document.getElementById("canvas");
const imageContainer = document.getElementById("imageContainer");
const saveButton = document.getElementById("saveButton");
let selectedImages = [];

let facingMode = "environment"; // Başlangıçta arka kamera
// URL'den id'yi al
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

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
// ______________________Buttons____________________
let statuss = false;
// Buttons olay dinleyicilerini ekle
const buttons = document.querySelectorAll(".status_body_buttons_end button");

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    // Tüm düğmeleri gri yap
    buttons.forEach((btn) => {
      btn.classList.remove("status_body_buttons_red");
      btn.classList.add("status_body_buttons_gray");
    });

    // Seçilen düğmeyi kırmızı yap ve status'u güncelle
    button.classList.remove("status_body_buttons_gray");
    button.classList.add("status_body_buttons_red");

    // Status'u güncelle (true veya false)
    statuss = index === 0; // İlk düğme tıklanırsa status true, ikinci düğme tıklanırsa status false
    console.log("Status:", statuss);
  });
});

saveButton.addEventListener("click", () => {
  if (selectedImages.length > 0) {
    console.log("Selected Images:", selectedImages);

    // Önce seçilen görüntüleri bir FormData nesnesine ekleyelim
    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append(`image_${index}`, image.blob, `image_${index}.png`);
    });

    // JSON verileri oluştur
    const jsonData = {
      photos: selectedImages, // Buraya seçilen görüntüleri ekleyin
      status: statuss, // Seçilen status'u ekleyin
    };
    console.log(jsonData);

    // Fetch ile POST isteği gönderme
    fetch(`https://cms.absherontm.az/api/admin/ShopRepo/Shops/Edit/${id}`, {
      method: "PUT", // PUT isteği kullanabilirsiniz
      body: JSON.stringify(jsonData), // JSON verileri gönderin
      headers: {
        "Content-Type": "application/json", // JSON verisi gönderiyoruz
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Gönderme başarılı.", response);
          // Burada başarılı bir şekilde gönderildiğini belirten işlemleri yapabilirsiniz.
        } else {
          console.error("Gönderme başarısız.");
          // Gönderme başarısızsa uygun işlemleri yapabilirsiniz.
        }
      })
      .catch((error) => {
        console.error("Bir hata oluştu:", error);
      });
  } else {
    console.log("No images selected.");
  }
});
