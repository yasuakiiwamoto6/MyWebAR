// カメラの初期化
const video = document.getElementById('camera');

function startCamera() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { ideal: 'environment' }
        }
    })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing the camera', error);
    });
}

// デバイスの位置情報を取得して位置を特定
function displayStoreName() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // 位置情報を確認して、特定の位置にいる場合に店名を表示
            const storeLat = 35.7503;  // 東京都北区豊島2-25-5の緯度
            const storeLon = 139.7356; // 東京都北区豊島2-25-5の経度
            const distance = getDistanceFromLatLonInKm(latitude, longitude, storeLat, storeLon);

            if (distance < 0.05) { // 50メートル以内の場合
                document.getElementById('store-name').style.display = 'block';
            } else {
                document.getElementById('store-name').style.display = 'none';
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// 緯度経度から距離を計算
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球の半径 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // 距離 (km)
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// アプリの初期化
startCamera();
displayStoreName();
