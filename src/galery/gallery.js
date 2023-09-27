document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const idd = parseInt(id);
  // Bu, URL'den alınan id'yi konsolda gösterecek

  // API'den verileri çekmek için bir işlev
  async function fetchData() {
    try {
      const response = await fetch(
        `https://cms.absherontm.az/api/admin/InfoRepoImage/Index?id=10`
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
      image.src = `https://cms.absherontm.az/uploads/images/${item.imagePath}`;
      image.alt = item.name;
      div.appendChild(image);
      galleryDiv.appendChild(div);

      // Div'e tıklama olayını ekleyin
      div.addEventListener("click", function () {
        modal.style.display = "block";
        modalImage.src = `https://cms.absherontm.az/uploads/images/${item.imagePath}`;

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
