document.addEventListener("DOMContentLoaded", async function () {
  const korpusContainer = document.getElementById("korpus-container");
  // URL'den id'yi al
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Bu, URL'den alınan id'yi konsolda gösterecek

  // API'den verileri çekmek için bir işlev
  async function fetchData() {
    try {
      const response = await fetch(
        `https://cms.absherontm.az/api/admin/ShopRepo/Korpus/${id}`
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
    const data = await fetchData();

    data.forEach((item) => {
      const kart = document.createElement("a");
      kart.classList.add("korpus_div", "tm_div");
      kart.href = `../magazine/magazine.html?id=${item.id}`;
      kart.innerHTML = `
      <ul>
      <li>Korpus: <br /><b>${item.korpusname}</b></li>
      <li>Mağaza sayı: <br /><b>${item.infoRepos.length}</b></li>
      <li>Sahəsi: <br /><b>${item.area}m2</b></li>
    </ul>
          `;

      korpusContainer.appendChild(kart);
    });
  }

  // Verileri HTML içinde göster
  displayData();
});
