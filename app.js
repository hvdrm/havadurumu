const apiKey = "ae49cf2d391e1c2f24a8cb3910ea3014";
let map, marker;

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("darkToggle");
  btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

async function havaDurumunuGetir(sehir = null, lat = null, lon = null) {
  const s = sehir || document.getElementById("sehir").value;
  const URLS = {
    hava: sehir?`https://api.openweathermap.org/data/2.5/weather?q=${s}&appid=${apiKey}&lang=tr&units=metric`:
      lat?`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=tr&units=metric`:
      `https://api.openweathermap.org/data/2.5/weather?q=${s}&appid=${apiKey}&lang=tr&units=metric`,
    tahmin: sehir?`https://api.openweathermap.org/data/2.5/forecast?q=${s}&appid=${apiKey}&lang=tr&units=metric`:
      lat?`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=tr&units=metric`:
      `https://api.openweathermap.org/data/2.5/forecast?q=${s}&appid=${apiKey}&lang=tr&units=metric`
  };
  try {
    const resH = await fetch(URLS.hava);
    const vH = await resH.json();
    if(vH.cod!==200) throw new Error();
    const icon = `https://openweathermap.org/img/wn/${vH.weather[0].icon}@2x.png`;
    const durum = vH.weather[0].main.toLowerCase();
    const arkaPlanMap = {
      clear:"https://images.unsplash.com/photo-1502082553048-f009c37129b9",
      clouds:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      rain:"https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
      drizzle:"https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
      snow:"https://images.unsplash.com/photo-1608889175823-08b4a3ae774b",
      mist:"https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
      fog:"https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
      thunderstorm:"https://images.unsplash.com/photo-1587191082333-6b8bcd59df38"
    };
    document.body.style.backgroundImage = `url('${arkaPlanMap[durum]||arkaPlanMap.clear}?auto=format&fit=crop&w=1600&q=80')`;
    document.getElementById("sonuc").innerHTML = `
      <h2>${vH.name}, ${vH.sys.country}</h2>
      <img class="icon" src="${icon}" alt="">
      <p>${vH.weather[0].description}</p>
      <p>🌡️ ${vH.main.temp} °C (Hissedilen ${vH.main.feels_like} °C)</p>
      <p>💧 Nem: ${vH.main.humidity}% | 💨 Rüzgar: ${vH.wind.speed} m/s</p>
    `;
    haritaGuncelle(vH.coord.lat, vH.coord.lon, vH.name);
  } catch {
    document.getElementById("sonuc").textContent = "Şehir bulunamadı veya hata.";
  }
  tahminYukle(URLS.tahmin);
}

async function tahminYukle(url) {
  try {
    const res = await fetch(url);
    const js = await res.json();
    const html = js.list.slice(0,6).map(item=>{
      const d=new Date(item.dt_txt);
      return `<div class="tahminKart"><p>${d.toLocaleDateString("tr-TR")}<br>${d.getHours()}:00</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="">
        <p>${item.main.temp} °C</p><p>${item.weather[0].description}</p></div>`;
    }).join("");
    document.getElementById("tahmin").innerHTML=`<h3>📅 Saatlik Tahmin</h3>${html}`;
  } catch {
    document.getElementById("tahmin").textContent = "";
  }
}

function konumlaGetir(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(p=>{
      havaDurumunuGetir(null,p.coords.latitude,p.coords.longitude);
    },()=> document.getElementById("sonuc").textContent="Konum alınamadı.");
  } else {
    document.getElementById("sonuc").textContent="Tarayıcınız desteklemiyor.";
  }
}

function haritaGuncelle(lat,lon,isim){
  if(!map){
    map=L.map('harita').setView([lat,lon],10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'&copy; OpenStreetMap'
    }).addTo(map);
    marker=L.marker([lat,lon]).addTo(map).bindPopup(isim).openPopup();
  } else {
    map.setView([lat,lon],10);
    marker.setLatLng([lat,lon]).setPopupContent(isim).openPopup();
  }
}

function paylas(){
  const content = document.getElementById("sonuc").innerText;
  if(navigator.share){
    navigator.share({title:"Hava Durumu", text:content, url:location.href});
  } else {
    alert("Paylaşım desteklenmiyor.");
  }
}

// Başlangıçta İstanbul yükle
havaDurumunuGetir("İstanbul");
