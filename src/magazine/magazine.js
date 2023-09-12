document.addEventListener("DOMContentLoaded", async function () {
  const magazineContainer = document.getElementById("magazine-container");
  // URL'den id'yi al
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Bu, URL'den alınan id'yi konsolda gösterecek

  // API'den verileri çekmek için bir işlev
  async function fetchData() {
    try {
      const response = await fetch(
        `https://cms.absherontm.az/api/admin/ShopRepo/Shops/${id}`
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
      kart.classList.add("magazine_div", "tm_div");
      kart.href = `../add/add.html?id=${item.id}`;
      kart.innerHTML = `
      <img src="../../assets//images/magazine/magaza.png" />
              <ul class="magazine_text_ul">
                <li>
                  Mağaza adı:<br />
                  <b class="magazine_name_color">${item.shopName}</b>
                </li>
                <li>Sektor:<br /><b>Tikinti materialları</b></li>
                <li>Korpus:<br /><b>Prestij B</b></li>
              </ul>
              <div class="magazine_text_end">
                <p>Magaza: <b>125</b></p>

                <p>Sıra: <b>1</b></p>

                <div>
                  <button class="sea_color">İcarəyə verilib</button>
                  <button class="green_color">Açıqdır</button>
                </div>
              </div>
          `;

      magazineContainer.appendChild(kart);
    });
  }

  // Verileri HTML içinde göster
  displayData();
});
