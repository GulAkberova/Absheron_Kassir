document.addEventListener("DOMContentLoaded", async function () {
  const sectorContainer = document.getElementById("sector-container");

  // API'den verileri çekmek için bir işlev
  async function fetchData() {
    try {
      const response = await fetch("http://localhost:5137/api/admin/ShopRepo/");
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
      kart.classList.add("sector_div", "tm_div");
      kart.href = `../korpus/korpus.html?id=${item.id}`;
      kart.innerHTML = `
          <h3>${item.name}</h3>
          <img src="../../assets/images/sector/sector1.png" />
        `;

      sectorContainer.appendChild(kart);
    });
  }

  // Verileri HTML içinde göster
  displayData();
});
