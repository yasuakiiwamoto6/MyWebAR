document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('camera');
    const label = document.getElementById('label');
    const permissionMenu = document.getElementById('permission-menu');
    const arContainer = document.getElementById('ar-container');
    const requestPermissionsButton = document.getElementById('request-permissions');

    requestPermissionsButton.addEventListener('click', () => {
        requestPermissions();
    });

    function requestPermissions() {
        requestCameraAccess()
            .then(() => requestGeolocationAccess())
            .then(() => {
                permissionMenu.style.display = 'none';
                arContainer.style.display = 'block';
            })
            .catch(err => {
                alert(err);
                permissionMenu.style.display = 'flex';
                arContainer.style.display = 'none';
            });
    }

    function requestCameraAccess() {
        return new Promise((resolve, reject) => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        video.srcObject = stream;
                        video.play();
                        resolve();
                    })
                    .catch(err => {
                        reject('カメラへのアクセスが拒否されました。カメラのアクセスを許可してください。');
                    });
            } else {
                reject('このブラウザはカメラのアクセスをサポートしていません。');
            }
        });
    }

    function requestGeolocationAccess() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    updatePosition(position);
                    resolve();
                }, error => {
                    showError(error);
                    reject('位置情報へのアクセスが拒否されました。位置情報のアクセスを許可してください。');
                }, {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                });
            } else {
                reject('このブラウザは位置情報をサポートしていません。');
            }
        });
    }

    function updatePosition(position) {
        const { latitude, longitude } = position.coords;
        const storeLat = 35.754687;
        const storeLng = 139.726354;

        const distance = getDistanceFromLatLonInKm(latitude, longitude, storeLat, storeLng);
        if (distance < 0.05) { // 50 meters
            label.style.display = 'block';
        } else {
            label.style.display = 'none';
        }
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('位置情報へのアクセスが拒否されました。位置情報のアクセスを許可してください。');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('位置情報が利用できません。');
                break;
            case error.TIMEOUT:
                alert('位置情報の取得がタイムアウトしました。');
                break;
            case error.UNKNOWN_ERROR:
                alert('未知のエラーが発生しました。');
                break;
        }
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lat2 - lon1);
        var a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
});
