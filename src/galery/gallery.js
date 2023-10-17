document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("Id");
  const idd = parseInt(id);
  // Bu, URL'den alınan id'yi konsolda gösterecek

  // API'den verileri çekmek için bir işlev
  async function fetchData() {
    try {
      const response = await fetch(
        `https://cms.absherontm.az/api/admin/inforepoimage/index?Id=25`
      );
      if (!response.ok) {
        throw new Error("API isteği başarısız oldu.");
      }
      const data = await response.json();
      console.log(data, "data");
      return data;
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  }

  // Verileri al ve HTML içine yerleştir
  async function displayData() {
    const galleryDiv = document.querySelector(".galery_divs");
    const modal = document.getElementById("myModal");
    const modalImage = document.getElementById("modalImage");
    const modalCreationTime = document.getElementById("modalCreationTime");
    const data = await fetchData();

    data.forEach((item) => {
      const div = document.createElement("div");
      const image = document.createElement("img");

      const firstLetter = item.imagePath ? item.imagePath[0].toLowerCase() : "";

      // CSS sınıfını belirle
      const cssClassG =
        firstLetter === "r"
          ? "ios_gallery_img"
          : firstLetter === "a"
          ? "android_gallery_img"
          : "defaul_gallery_img";

      image.src = `https://cms.absherontm.az/uploads/images/${item.imagePath}`;
      image.className = cssClassG;
      image.alt = item.name;
      div.appendChild(image);
      galleryDiv.appendChild(div);

      const cssClass =
        firstLetter === "i"
          ? "ios_gallery_modal_img"
          : firstLetter === "a"
          ? "android_gallery_modal_img"
          : "defaul_gallery_modal_img";
      // Div'e tıklama olayını ekleyin
      div.addEventListener("click", function () {
        modal.style.display = "block";
        modalImage.src = `https://cms.absherontm.az/uploads/images/${item.imagePath}`;
        modalImage.className = cssClass;
        // Tarih dönüşümü
        const date = new Date(item.createdDate);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        modalCreationTime.innerText = "Date: " + formattedDate;
      });
    });

    // Modal dışına tıklama olayını ekleyin
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }
  // Sayfa yüklendiğinde modalı gizle
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
  // Verileri HTML içinde göster
  displayData();
});
