// 參考網址 http://demoweb.byethost10.com/kao_travel/?i=1#


var content = document.querySelector('.placeList');
var more = document.querySelector('.btnMore');
more.addEventListener('click', addItems);

var areaData = [];
var str, hide, len, btnList = '';

var xhr = new XMLHttpRequest();

var row = 1; //列數
var items = 6; //每一列各數
var total = 0;
var i = 0;

//Zone List
var areaBtn = document.getElementById('hotAreaList'); //從父元素來監聽子元素內容
areaBtn.addEventListener('click', areaFilter);
var filter = document.getElementById('filter');
var filterList = '<option selected="selected">請選擇區域</option>';
filter.addEventListener('change', areaFilter);

//取得資料
function getData() {
    xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status == 200) {
            listemItems();

        } else {
            content.innerHTML = '<h2>取得資料時發生錯誤!</h2>';
        }
    }
}

//列出資料
function listemItems() {
    str = '';

    total = row * items;

    areaData = JSON.parse(xhr.responseText);
    areaData = areaData.result.records; //JSON結構:result:{recorsd:[....]}
    len = areaData.length;

    //Place list
    if (len <= items || len < total) //當data數少於5個，或data數少於 列數*各數，隱藏MORE按鈕
        more.style.display = 'none';

    for (i = 0; i < total; i++) {
        Items();
    }
    content.innerHTML = str;

    //Zone List
    // 過濾成乾淨的區域陣列到 areaList
    var zoneList = [];

    for (i = 0; i < len; i++) {
        var zoneName = areaData[i].Zone;
        zoneList.push(zoneName);
    }
    // 再用 foreach 去判斷陣列裡面所有值是否有吻合
    var zone = [];
    zoneList.forEach(function (value) {
        if (zone.indexOf(value) == -1) {
            zone.push(value);
        }
    });

    btnList = '';
    for (i = 0; i < zone.length; i++) {
        btnList += '<li><input type="button" class="btn" value="' + zone[i] + '"></li>';
        filterList += '<option>' + zone[i] + '</option>';
    }
    areaBtn.innerHTML = btnList;
    filter.innerHTML = filterList;
}

//組景點字串內容
function Items() {
    hide = ''; //是否顯示tag
    if (areaData[i].Ticketinfo == "")
        hide = 'hidden'; //Ticketinf為空，則tag加上".hidden"來隱藏tag

    str += '<div class="col-md-4 col-sm-6 block"><a href="#"><div class="cover"><img src="' + areaData[i].Picture1 + '"/><div class="tag' + '\t' + hide + '">' + areaData[i].Ticketinfo + '</div></div><div class="description"><h3>' + areaData[i].Name + '<span class="zone">[' + areaData[i].Zone + ']</span></h3><p class="detail">' + areaData[i].Toldescribe + '</p><div class="info"><p class="address"><i class="pin"></i>' + areaData[i].Add + '</p><p class="time"><i class="clock"></i>' + areaData[i].Opentime + '</p></div></div</a></div></div>';
}

//點擊More BTN，加載內容
function addItems() {
    row += 1;
    listemItems();
}


//Area filter
function areaFilter(e) {
    str = '';
    areaName = e.target.value; //取值

    for (i = 0; i < len; i++) {
        if (areaName == areaData[i].Zone)
            Items();
    }
    content.innerHTML = str;
    if (str == '')
        content.innerHTML = '<center><h2>找不到符合的內容!!</center></h2>';
}

getData();