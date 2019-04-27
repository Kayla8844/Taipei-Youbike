// 台北市 Youbike
// 連結：https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz

// sno：站點代號
// *sna：場站名稱(中文)
// *tot：場站總停車格
// *sbi：場站目前車輛數量
// *sarea：場站區域(中文)
// mday：資料更新時間
// lat：緯度
// lng：經度
// *ar：地(中文)
// sareaen：場站區域(英文)
// snaen：場站名稱(英文)
// aren：地址(英文)
// bemp：空位數量
// act：全站禁用狀態

let callbackDataGB = [];
let filterDataList = []; // 篩選出同區的資料
let favList = JSON.parse(localStorage.getItem('favItem')) || [];

// 刪除我的最愛裡重複的資料
favList.filter(function (el, i, arr) {
    arr.indexOf(el) === i;
});

// console.log(favList)
// ====================================================
// 和遠端連線
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz', true);
xhr.setRequestHeader('Content-type', 'application/json');

// ====================================================
// 01. 取得後端總資料


xhr.onload = function () {
    var callbackData = JSON.parse(xhr.responseText);
    console.log(callbackData);

    // ====================================
    // 02. 把取得的資料印在頁面上

    var retVal = callbackData.retVal;
    // console.log(Object.keys(retVal))

    // 把 retVal 物件裝進新的陣列裡
    for (let i in retVal) {
        // console.log(retVal[i])
        callbackDataGB.push(retVal[i])
    }
    // console.log(callbackDataGB)

    var len = callbackDataGB.length;  // 400
    var listAll = document.querySelector('#station_list');
    var select = document.getElementById('selectId');
    var numTxt = document.getElementById('num_txt');
    let storage = document.querySelectorAll('.storage')

    // 選擇行政區域後，執行 updateList 方法
    select.addEventListener('change', printList, false);

    // 印出資料 (此時傳入事件 'change')
    function printList(e) {
        var value = e.target.value;
        var str = '';

        for (var i = 0; i < len; i++) {
            if (callbackDataGB[i].sarea == value) {
                filterDataList.push(callbackDataGB[i])
                numTxt.innerHTML = `${filterDataList.length}`

                var content = `
                    <div class="list_data_all col-lg-4 col-md-6 col-sm-12">
                        <li class="list_data">
                            <div class="list_head">
                                <div class="hour">24hr</div>
                                <img class="bike_img" src="image/white_bike.png" alt="bike">
                                
                                <i class="storage fas fa-heart" data-toggle="modal" data-target="#alertModal"></i>
                            </div>
                            
                            <div class="list_title_all">
                                <h2 class="list_title">${callbackDataGB[i].sna}</h2>
                                <p class="borrow_all">
                                    <span class="borrow">可借 ${callbackDataGB[i].sbi}</span> / 
                                    <span class="return_txt">空位 ${callbackDataGB[i].bemp}</span>
                                </p>
                            </div>
                            

                            <div class="address_all">
                                <i class="fas fa-map-marker-alt"></i>
                                <a id="address" class="address" data-target="#mapModal" data-toggle="modal" href="#mapModal">${callbackDataGB[i].ar}</a>
                            </div>
                        </li>
                    </div>
                `

                str += content;
            }
        }

        if (str == '') {
            str += `
                <h3 class="empty">查無資料!</h3>`
        }

        listAll.innerHTML = str;

        getHeart();
        // console.log(filterDataList)
    }

    // 一進去就把搜尋清單有在我的最裡的資料的愛心顯示橘色
    function getHeart() {
        for (let i = 0; i < filterDataList.length; i++) {
            // console.log(filterDataList[i])
            for (let j = 0; j < favList.length; j++) {
                // console.log(favList[0])
                if (filterDataList[i].sna == favList[j].sna) {
                    // console.log(filterDataList[i])
                    let listTitle = document.querySelectorAll('.list_title');

                    // console.log(listTitle)

                    listTitle.forEach(el => {
                        // console.log(el.textContent)
                        if (el.textContent == filterDataList[i].sna) {
                            // console.log(el)
                            let heartList = [];

                            let heart = el.parentElement.previousElementSibling.querySelectorAll('.fa-heart');

                            // console.log(heart)

                            heart.forEach(el => {
                                // console.log(el)
                                el.classList.add('recorded')
                            });
                        }
                    });
                }
            }
        }
        // saveFav()
    }
}

// 因地圖一定要放在全域裡，所以要把抓回來的資料放在全域變數裡


// 連線完成
xhr.send(null);

// ====================================================
// 03. 彈出 map 視窗

var stationList = document.getElementById('station_list')
var mapTitle = document.querySelector('#mapModal .modal-title')

stationList.addEventListener('click', popUpMap)

function popUpMap(e) {
    if (!e.target.classList.contains('address')) {
        return
    } else {
        // console.log(callbackDataGB)
        let targetTxt = e.target.textContent;
        // console.log(targetTxt)
        // console.log(callbackDataGB[0].ar)
        // console.log(targetTxt === callbackDataGB[0].ar)
        let mapItem = {};
        callbackDataGB.forEach(el => {
            // console.log(el.ar == targetTxt)
            if (el.ar == targetTxt) {
                // console.log(el)
                mapItem = el
            }
        });
        mapTitle.textContent = mapItem.sna;
        // console.log(mapItem)
        initMap(mapItem);
    }

}

// 載入 map
function initMap(mapItem) {
    console.log(mapItem)
    let myLatLng = {
        lat: Number(mapItem.lat),
        lng: Number(mapItem.lng),
    };
    console.log(mapItem.lat, mapItem.lng)

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myLatLng
    });

    let marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });

    let infoWindow = new google.maps.InfoWindow({
        content: `<a href="https://www.google.com.tw/maps/dir//${mapItem.lat},${mapItem.lng}" target="_blank">地址： ${mapItem.ar}</a>`
    });
    // https://www.google.com.tw/maps/dir//25.046916,121.531428
    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

}


// ====================================================
// 04. 加入我的最愛

let collection = document.querySelector('.collection_list');
let dialog = document.querySelector('.dialog');
let alertTxt = document.querySelector('.alert_txt');
let closeBtn = document.querySelector('.close_btn');
// let alertContent = document.querySelector('#alertModal .modal-title');

stationList.addEventListener('click', saveFav);
closeBtn.addEventListener('click', function () {
    dialog.classList.add('disable')
})

function saveFav(e) {
    if (!e.target.classList.contains('fa-heart')) {
        return
    }

    dialog.classList.remove('disable');
    setTimeout(() => {
        dialog.classList.add('disable');
    }, 2000);

    let targetItemTitle = e.target.parentElement.nextElementSibling.querySelector('.list_title').textContent;

    // console.log(targetItemTitle)
    // console.log(filterDataList)

    // 如果愛心顯示橘色，按下的時候就取消橘色，並從我的最愛裡刪除當下那筆資料
    if (e.target.classList.contains('recorded')) {
        e.target.classList.remove('recorded');

        // console.log(targetItemTitle)

        alertTxt.textContent = '已從我的最愛裡刪除'

        favList.forEach((el, i, arr) => {
            if (el.sna == targetItemTitle) {
                // console.log(i)
                arr.splice(i, 1)
            }
        });

        localStorage.setItem('favItem', JSON.stringify(favList))
        console.log(favList)

        printCollection();

    } else {
        alertTxt.textContent = '已加入我的最愛';
        setTimeout(() => {
            alert.modal('hide')

        }, 1500);

        let favItem = {};
        callbackDataGB.forEach(el => {
            // console.log(el.snaen == targetTxt)
            if (el.sna == targetItemTitle) {
                // console.log(el)
                favItem = el;
            }
        });
        // console.log(favItem)
        favList.unshift(favItem);

        localStorage.setItem('favItem', JSON.stringify(favList));
        // console.log(favList);

        e.target.classList.add('recorded')

        printCollection();
    }
}

// 印出我的最愛
function printCollection() {
    let str = '';
    let len = favList.length;

    for (let i = 0; i < len; i++) {
        let content = `
                    <div class="list_data_all col-lg-4 col-md-6 col-sm-12" data-index="${i}">
                        <li class="list_data">
                            <div class="list_head">
                                <div class="hour">24hr</div>
                                <img class="bike_img" src="image/white_bike.png" alt="bike">
                                <i class="storage fas fa-trash-alt"></i>
                            </div>
                            
                            <div class="list_title_all">
                                <h2 class="list_title">${favList[i].sna}</h2>
                                <p class="borrow_all">
                                    <span class="borrow">可借 ${favList[i].sbi}</span> / 
                                    <span class="return_txt">可還 ${favList[i].bemp}</span>
                                </p>
                            </div>
                            

                            <div class="address_all">
                                <i class="fas fa-map-marker-alt"></i>
                                <a id="address" class="address" data-target="#mapModal" data-toggle="modal" href="#mapModal">${favList[i].ar}</a>
                            </div>
                        </li>
                    </div>
                    
                `

        str += content;

    }

    if (len == 0) {
        str += `<h3 class="empty">無任何資料</h3>`
    }

    collection.innerHTML = str;
}

printCollection();

// ==============================
// 刪除我的最愛

let trashBtn = document.querySelector('.fa-trash-alt');
collection.addEventListener('click', deleteCollection);

function deleteCollection(e) {
    if (!e.target.classList.contains('storage')) {
        return
    }

    let thisIndex = e.target.parentElement.parentElement.parentElement.dataset.index;
    // console.log(thisIndex)

    favList.splice(thisIndex, 1)

    localStorage.setItem('favItem', JSON.stringify(favList))
    console.log(favList)

    printCollection();

    // ======================
    // 搜尋列表
    let targetItemTitle = e.target.parentElement.nextElementSibling.querySelector('.list_title').textContent;

    let findItemTitle = stationList.querySelectorAll('.list_title');

    findItemTitle.forEach(el => {
        let findItemHeart = el.parentElement.previousElementSibling.querySelector('.storage');

        if (el.textContent == targetItemTitle) {
            findItemHeart.classList.remove('recorded')
        }
    });
}

// ====================================================
// 05. menu切換

let menuAll = document.querySelector('.menu_all');
let menuBtn = document.querySelectorAll('.menu_btn');
let menuContent = document.querySelectorAll('.menu_content');
menuAll.addEventListener('click', function (e) {
    if (!e.target.classList.contains('menu_btn')) {
        return
    }

    let targetMenubtn = e.target.dataset.menubtn;
    menuBtn.forEach((el, i) => {
        // console.log(el.dataset.menubtn)
        // console.log(menuContent[i].dataset.menu)
        if (targetMenubtn === menuContent[i].dataset.menu) {
            // console.log(menuContent[i])
            e.target.classList.add('active')
        } else {
            el.classList.remove('active')
        }
    });

    menuContent.forEach(el => {
        // console.log(el)
        if (el.dataset.menu === targetMenubtn) {
            el.classList.add('show')
        } else {
            el.classList.remove('show')
        }
        // el.classList.remove('show')
    });
})


