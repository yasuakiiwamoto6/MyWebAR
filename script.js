window.onload = () => {
    // 位置情報を監視して更新する
    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const storeLat = 35.7503;  // 東京都北区豊島2-25-5の緯度
            const storeLon = 139.7356; // 東京都北区豊島2-25-5の経度
            const distance = getDistanceFromLatLonInKm(latitude, longitude, storeLat, storeLon);

            if (distance < 0.05) { // 50メートル以内の場合
                document.querySelector('a-text').setAttribute('value', 'お店１');
            } else {
                document.querySelector('a-text').setAttribute('value', '近くにお店はありません');
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    
};

// 緯度経度から距離を計算
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球の半径 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // 距離 (km)
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
