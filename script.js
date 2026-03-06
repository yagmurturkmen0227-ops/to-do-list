const girisKutusu = document.getElementById("veri-kutusu");
const oncelikSecici = document.getElementById("oncelik-secici");
const kategoriSecici = document.getElementById("kategori-secici");
const sureSecici = document.getElementById("sure-secici");
const listeKutusu = document.getElementById("liste");
const bildirimKutusu = document.getElementById("bildirimKutusu");

// Yarış Pisti Elementleri
const motorObjesi = document.getElementById("motorObjesi");
const yuzdeGosterge = document.getElementById("yuzdeGosterge");
const pistDurumu = document.getElementById("pistDurumu");

// Profil Elementleri
const seviyeRozeti = document.getElementById("seviyeRozeti");
const oyuncuRutbesi = document.getElementById("oyuncuRutbesi");
const guncelXPLabel = document.getElementById("guncelXP");
const hedefXPLabel = document.getElementById("hedefXP");
const xpCubugu = document.getElementById("xpCubugu");
const oyuncuAvatar = document.getElementById("oyuncuAvatar");
const seviyeEkrani = document.getElementById("seviyeEkrani");

// Sesler
const sesBasari = document.getElementById("sesBasari");
const sesLevelUp = document.getElementById("sesLevelUp");
const sesSilme = document.getElementById("sesSilme");

function sesCal(sesElementi) {
    sesElementi.currentTime = 0;
    sesElementi.play().catch(e => console.log("Otomatik ses çalma engellendi."));
}

let oyuncu = JSON.parse(localStorage.getItem("oyuncuVerisi")) || { xp: 0, level: 1 };
const rutbeler = [
    "🛵 Bisikletli Dağıtıcı", "🏍️ Scooter Çaylağı", "🏁 Sokak Yarışçısı", 
    "🏎️ Pist Şampiyonu", "⚡ Adrenalin Bağımlısı", "🔥 Asfalt Ağlatan", "👻 Hayalet Sürücü"
];

// Saat
function saatiGuncelle() { document.getElementById("canliSaat").innerText = new Date().toLocaleTimeString("tr-TR"); }
setInterval(saatiGuncelle, 1000); saatiGuncelle();

// Bildirim
function bildirimGoster(mesaj, renk = "#66fcf1", yaziRengi = "#0b0c10") {
    bildirimKutusu.innerText = mesaj;
    bildirimKutusu.style.background = renk;
    bildirimKutusu.style.color = yaziRengi;
    bildirimKutusu.classList.add("goster");
    setTimeout(() => { bildirimKutusu.classList.remove("goster"); }, 3000);
}

// XP Mantığı
function xpKazan(miktar) { oyuncu.xp += miktar; seviyeKontrol(); oyuncuGuncelle(); }
function xpKaybet(miktar) { oyuncu.xp -= miktar; if(oyuncu.xp < 0) oyuncu.xp = 0; oyuncuGuncelle(); }

function seviyeKontrol() {
    let gerekenXP = oyuncu.level * 100; 
    if (oyuncu.xp >= gerekenXP) {
        oyuncu.xp -= gerekenXP; 
        oyuncu.level++;
        let rutbeIndex = Math.min(oyuncu.level - 1, rutbeler.length - 1);
        
        document.getElementById("yeniSeviyeMetni").innerText = oyuncu.level;
        document.getElementById("yeniRutbeMetni").innerText = "Yeni Rütbe: " + rutbeler[rutbeIndex];
        seviyeEkrani.classList.add("aktif");
        
        oyuncuAvatar.src = `https://api.dicebear.com/7.x/shapes/svg?seed=Racer${oyuncu.level}&backgroundColor=0a192f`;
        sesCal(sesLevelUp);
    }
}

function kutlamaKapat() { seviyeEkrani.classList.remove("aktif"); }

function oyuncuGuncelle() {
    let gerekenXP = oyuncu.level * 100;
    seviyeRozeti.innerText = oyuncu.level;
    guncelXPLabel.innerText = oyuncu.xp;
    hedefXPLabel.innerText = gerekenXP;
    xpCubugu.style.width = ((oyuncu.xp / gerekenXP) * 100) + "%";
    
    let rutbeIndex = Math.min(oyuncu.level - 1, rutbeler.length - 1);
    oyuncuRutbesi.innerText = rutbeler[rutbeIndex];
    localStorage.setItem("oyuncuVerisi", JSON.stringify(oyuncu));
}

// Durum Güncellemesi (Yarış Pisti ve Görev Sayacı)
function durumuGuncelle() {
    let toplamGorev = listeKutusu.children.length;
    let yapilanGorev = document.querySelectorAll("li.yapildi").length;
    
    document.getElementById("sayac").innerText = (toplamGorev - yapilanGorev) + " durak kaldı";
    document.getElementById("altBilgi").style.display = toplamGorev > 0 ? "flex" : "none";

    let yuzde = toplamGorev === 0 ? 0 : Math.round((yapilanGorev / toplamGorev) * 100);
    yuzdeGosterge.innerText = `%${yuzde} Tamamlandı`;

    let konum = Math.max(2, yuzde - 5); 
    motorObjesi.style.left = konum + "%";

    if (toplamGorev === 0) {
        pistDurumu.innerText = "Yarışa başlamak için gaza bas!";
    } else if (yuzde === 100) {
        pistDurumu.innerText = "Bitiş çizgisine ulaştın! 🏆";
    } else {
        pistDurumu.innerText = "Yarış devam ediyor...";
    }
    localStorage.setItem("gorevler", listeKutusu.innerHTML);
}

// Eleman Ekleme
function elemanEkle() {
    if (girisKutusu.value.trim() === '') { 
        bildirimGoster("Hedefsiz yarışılmaz!", "#e74c3c", "white"); return; 
    } 

    let li = document.createElement("li");
    
    let kazanilacakXP = 20; let vitesAdi = "2. Vites"; let sinifRengi = "#f1c40f"; 
    if (oncelikSecici.value === "dusuk") { kazanilacakXP = 10; vitesAdi = "1. Vites"; sinifRengi = "#2ecc71"; } 
    if (oncelikSecici.value === "yuksek") { kazanilacakXP = 30; vitesAdi = "3. Vites"; sinifRengi = "#e74c3c"; } 
    
    li.style.borderLeftColor = sinifRengi;
    li.setAttribute("data-xp", kazanilacakXP);

    let detayAlani = document.createElement("div");
    detayAlani.className = "gorev-detay";
    
    let kategoriIkonu = "📌";
    let katDeger = kategoriSecici.value;
    if(katDeger === "kisisel") kategoriIkonu = "👤 Kişisel";
    if(katDeger === "is") kategoriIkonu = "💼 İş/Okul";
    if(katDeger === "ev") kategoriIkonu = "🏠 Ev";

    let sureMetni = sureSecici.value ? `⏱️ ${sureSecici.value} dk` : "";

    detayAlani.innerHTML = `
        <span class="gorev-metni">${girisKutusu.value}</span>
        <div class="etiketler">
            <span class="etiket">${kategoriIkonu}</span>
            <span class="etiket" style="color:${sinifRengi}; border-color:${sinifRengi}">⚙️ ${vitesAdi}</span>
            ${sureMetni ? `<span class="etiket">${sureMetni}</span>` : ""}
            <span class="xp-odul">(+${kazanilacakXP} AP)</span>
        </div>
    `;

    li.appendChild(detayAlani);
    
    let islemAlani = document.createElement("div");
    islemAlani.className = "islemler";
    islemAlani.innerHTML = `<span class="duzenle" title="Modifiye Et"><i class="fa-solid fa-wrench"></i></span><span class="sil" title="İptal Et"><i class="fa-solid fa-xmark"></i></span>`;
    li.appendChild(islemAlani);

    listeKutusu.appendChild(li);
    girisKutusu.value = ""; sureSecici.value = "";
    
    durumuGuncelle();
    bildirimGoster("Yeni görev: Gaza basıldı!", "#66fcf1");
}

girisKutusu.addEventListener("keydown", function(olay) {
    if (olay.key === "Enter") { olay.preventDefault(); elemanEkle(); }
});

listeKutusu.addEventListener("click", function(olay) {
    let li = olay.target.closest("li");
    if(!li) return;
    
    let gorevXP = parseInt(li.getAttribute("data-xp"));

    if (olay.target.closest(".sil")) {
        if(!li.classList.contains("yapildi")) { bildirimGoster("Fren yaptın! Görev iptal.", "#e74c3c", "white"); }
        li.remove();
        sesCal(sesSilme); 
        durumuGuncelle();
    }
    else if (olay.target.closest(".duzenle")) {
        let metinAlani = li.querySelector(".gorev-metni"); 
        let yeniMetin = prompt("Görevi modifiye et:", metinAlani.textContent.trim());
        if (yeniMetin) {
            metinAlani.textContent = yeniMetin;
            durumuGuncelle();
        }
    }
    else if (!olay.target.closest(".islemler")) {
        li.classList.toggle("yapildi");
        
        if(li.classList.contains("yapildi")) {
            xpKazan(gorevXP);
            bildirimGoster(`Motor kükrüyor! +${gorevXP} AP kazandın!`, "#45a29e", "white");
            sesCal(sesBasari); 
        } else {
            xpKaybet(gorevXP);
            bildirimGoster(`Geri vites. -${gorevXP} AP`, "#e74c3c", "white");
            sesCal(sesSilme); 
        }
        durumuGuncelle();
    }
}, false);

function tamamlananlariSil() {
    let tamamlananlar = document.querySelectorAll("li.yapildi");
    tamamlananlar.forEach(g => g.remove());
    sesCal(sesSilme);
    durumuGuncelle();
}

// Başlangıç Kurulumu
listeKutusu.innerHTML = localStorage.getItem("gorevler") || "";
oyuncuGuncelle();
durumuGuncelle();
oyuncuAvatar.src = `https://api.dicebear.com/7.x/shapes/svg?seed=Racer${oyuncu.level}&backgroundColor=0a192f`;