document.addEventListener("DOMContentLoaded", async function () {
  const magazineContainer = document.getElementById("magazine-container");
  // URL'den id'yi al
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const Id = parseInt(id);

  // Bu, URL'den alınan id'yi konsolda gösterecek

  // API'den verileri çekmek için bir işlev
  async function fetchData() {
    try {
      const response = await fetch(
        `https://cms.absherontm.az/api/admin/ShopRepo/Shops?PrestijId=6&CategoryId=18
        `
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
      // Kullanıcının cihaz türünü kontrol et
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      var targetURL;
      // Eğer Android ise
      if (/Android/i.test(userAgent)) {
        targetURL = `../add/add.html?id=${item.id}`;
      }
      // Eğer iPhone veya iPad ise
      else if (/iPhone|iPad/i.test(userAgent)) {
        targetURL = `../add/test.html?id=${item.id}`;
      }
      // Diğer cihazlar için varsayılan URL
      else {
        targetURL = `../add/add.html?id=${item.id}`;
      }

      kart.href = targetURL;
      const imagePath = item.imgs[item.imgs.length - 1]?.imagePath;
      const imageUrl =
        imagePath && item.status
          ? `https://cms.absherontm.az/uploads/images/${imagePath}`
          : "../../assets/images/magazine/default.jpg";
      // İlk harfi kontrol etmek için
      const firstLetter = imagePath ? imagePath[0].toLowerCase() : "";

      // CSS sınıfını belirle
      const cssClass =
        firstLetter === "i"
          ? "ios_img"
          : firstLetter === "a"
          ? "android_img"
          : "defaul_img";
      kart.innerHTML = `
      <div class='magazine_img_div'>
      <img src=${imageUrl} class="${cssClass}" />
      </div>
     
              <ul class="magazine_text_ul">
                <li>
                  Mağaza adı:<br />
                  <b class="magazine_name_color">${
                    item.shopName ? item.shopName : ""
                  }</b>
                </li>
                <li>Sektor:<br /><b>Tikinti materialları</b></li>
                <li>Korpus:<br /><b>${
                  item.prestij.korpusname ? item.prestij.korpusname : ""
                }</b></li>
              </ul>
              <div class="magazine_text_end">
                <p>Magaza: <b>${item.number ? item.number : ""}</b></p>

                <p>Sıra: <b>${
                  item.shopRow.name ? item.shopRow.name : ""
                }</b></p>

                <div>
                <button class="${
                  item.rentalStatus === "İcarəyaVerilib"
                    ? "sea_color"
                    : item.rentalStatus === "Boşdur"
                    ? "pink_color"
                    : item.rentalStatus === "Tikintidədir"
                    ? "dark_color"
                    : "dark_color"
                }">
                ${item.rentalStatus ? item.rentalStatus : ""}
            </button>
                  <button class="${
                    item.status ? "green_color" : "red_color"
                  }">${item.status ? "Açıqdır" : "Qapalıdır"}</button>
                </div>
              </div>
          `;

      magazineContainer.appendChild(kart);
    });
  }

  // Verileri HTML içinde göster
  displayData();
});
