var websocket;
var WatchListDataJson = [];
var favouriteWatchlistData = [];
var BindClickButton = "";

function BindClick() {
    $('.watchlistRowView').bind('click', function () {
        var BtnID = $(this).attr('data-Scripttype');
        $('.BuySellButton').css('display', 'none');
        $('#' + BtnID).css('display', 'initial');
        if (BindClickButton == BtnID) {
            $('.BuySellButton').css('display', 'none');
            BindClickButton = 0;
        }
        else
            BindClickButton = BtnID;
    });
}
$(document).ready(function () {
    allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
    Companyinitials = $("#CompanyInitial").val();
    //#region Add Shimmer Effect While Changing Watchlist
    $('.nav-item').on('click', function () {
        $('#watchlistDiv').html('');
        $('#watchlistDiv').append('<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>' +
            '<photo class="shine-watchlist"></photo>');
        $('.active').removeClass('active');
        var div = $(this).addClass('active');
        div.addClass('active');
        SetTradeDataForRefresh();
    });
    SetTradeDataForRefresh();
    FavoriteWatchlist(); initSocket();
    SocketInterval = setInterval(function () { initSocket(); }, 60000);

});
function initSocket(recordType) {
    var uri = $("#Websocketurl").val();
    if (websocket != null && websocket != undefined)
        websocket.close();

    websocket = new WebSocket(uri);

    websocket.onopen = function () {
        websocket.send(recordType);
    };

    websocket.onerror = function (event) { };
    websocket.onclose = function (event) { };

    websocket.onmessage = function (event) {
        if (event.data != 'undefined') {
            var allActiveAndWatchObj = JSON.parse(event.data);
            if (allActiveAndWatchObj.hasOwnProperty("Table")) {
                allObj = allActiveAndWatchObj.Table;
                WebSocketCall(allObj);
            }
        }
    };
}
function WebSocketCall(nData) {
    if (nData != null && nData != 'undefined' && nData.length > 0) {
        if (favouriteWatchlistData != null && favouriteWatchlistData.length > 0) {
            $.map(favouriteWatchlistData, function (kObj, e) {
                var newL = nData.filter(opt => opt.InstrumentToken == kObj.ScriptCode);
                if (newL.length > 0 && newL != null && newL != 'undefined') {
                    var item = newL[0];
                    kObj.close = item.Close;
                    kObj.Lastprice = item.Lastprice;
                }
            });
            SetFavoriteWatchlist(favouriteWatchlistData);
        }
        if (WatchListDataJson.objLstWatchList != null && WatchListDataJson.objLstWatchList.length > 0) {
            $.map(WatchListDataJson.objLstWatchList, function (kObj, e) {
                var newL = nData.filter(opt => opt.InstrumentToken == kObj.ScriptCode);
                if (newL.length > 0 && newL != null && newL != 'undefined') {
                    var item = newL[0];
                    kObj.close = item.Close;
                    kObj.Lastprice = item.Lastprice;
                    kObj.PerChange = item.PerChange;
                    kObj.Ask = item.Ask;
                    kObj.Bid = item.Bid;
                }
            });
        }
        if (WatchListDataJson.objMostUsedWatchList != null && WatchListDataJson.objMostUsedWatchList.length > 0) {
            $.map(WatchListDataJson.objMostUsedWatchList, function (kObj, e) {
                var newL = nData.filter(opt => opt.InstrumentToken == kObj.ScriptCode);
                if (newL.length > 0 && newL != null && newL != 'undefined') {
                    var item = newL[0];
                    kObj.close = item.Close;
                    kObj.Lastprice = item.Lastprice;
                    kObj.PerChange = item.PerChange;
                    kObj.Ask = item.Ask;
                    kObj.Bid = item.Bid;
                }
            });
            SetResult(WatchListDataJson);
        }
    }
}

function FavoriteWatchlist() {
    $.ajax({
        url: '/Trade/SetFavoriteWatchListSanaita',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                favouriteWatchlistData = JSON.parse(data);
                SetFavoriteWatchlist(favouriteWatchlistData);
            }
        },
        error: function (error) {
        }
    });
}
function SetFavoriteWatchlist(result) {
    if (result.length > 0) {
        $('#FavWatchList').html('');
        for (var i = 0; i < result.length; i++) {
            var PerChange = parseFloat(result[i].Lastprice) - parseFloat(result[i].close);
            var perCentageHtml = "";
            var perCentage = "";
            if (PerChange < 0) {
                perCentage = (parseFloat(PerChange) / parseFloat(result[i].close)) * 100;
                perCentageHtml = '<div style="Color:orangered;">' + perCentage.toFixed(2) + '</div>';
            }
            else if (PerChange >= 0) {
                perCentage = (parseFloat(PerChange) / parseFloat(result[i].close)) * 100;
                perCentageHtml = '<div style="Color:lime;">' + perCentage.toFixed(2) + '</div>';
            }

            var Data = '<div class="col-xs-4 item">' +
                '<div style="display:inline-flex;">' +
                '<span class="script">' + result[i].ScriptTradingSymbol + '</span>' +
                ' <span class="rate">' + perCentageHtml + '</span>' +
                '</div>' +
                '<span class="prise">' + result[i].Lastprice.toFixed(1) + '</span>';
            '</div>';
            $('#FavWatchList').append(Data);

        }
    }
}
$("#searchText").on('keyup', function () {
    SetTradeDataForRefresh();
});
function SetTradeDataForRefresh() {
    try {
        var WID = $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id");
        var input = { 'WID': 0, 'scriptExchangeType': "", 'searchedData': $("#searchText").val(), 'ScriptExchange': WID };
        $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (data) {
                WatchListDataJson = JSON.parse(data);
                SetResult(WatchListDataJson);
            }
        });

    } catch (e) {
        toastr.error("Error While Loading The Watchlist.");
    }
}
function SetResult(results) {
    if (results != null) {
        $('#watchlistDiv').html('');
        if (results.objLstWatchList != null) {
            //Set data for WatchList trade
            if (results.objLstWatchList.length > 0) {

                for (var i = 0; i < results.objLstWatchList.length; i++) {
                    var result = results.objLstWatchList[i];
                    SetWatchTradeDetails(result);
                }
            }
            else {
                $('#watchlistDiv').html('');

            }
            BindClick();
            if (BindClickButton != '' || BindClickButton!=0)
            $('#' + BindClickButton).css('display', 'initial');
        }
        $('.Gembox').html('');
        $('.Gembox').append('<label style="color: lime;margin-bottom:15px"> GemBox</label>');
        if (results.objMostUsedWatchList.length > 0) {
            for (var i = 0; i < results.objMostUsedWatchList.length; i++) {
                var value = results.objMostUsedWatchList[i];
                SetMostUsedWatchList(value);
            }
        }
        if (results.WatchlistDataForAdd != null) {
            //Set data for WatchList trade
            if (results.WatchlistDataForAdd.length > 0) {

                for (var i = 0; i < results.WatchlistDataForAdd.length; i++) {
                    var result = results.WatchlistDataForAdd[i];
                    SetWatchTradeDetailsForAdd(result);
                }
            }
            else {
                $('#watchlistDiv').html('');

            }
        }
    }
}
function SetMostUsedWatchList(item) {
    var PerChange = parseFloat(item.Lastprice) - parseFloat(item.close);
    var perCentageHtmlColor = "";
    var perCentage = "";
    if (PerChange < 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.Scripttype == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtmlColor = "RED";
    }
    else if (PerChange >= 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.Scripttype == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtmlColor = "lime";
    }

    var html ='<label style="color:white">' + item.ScriptName +
        ' <span style="color:' + perCentageHtmlColor + '">' + perCentage.toFixed(1)+'%</span></label>' +
        '<br />' +
        '<label style="color:#ccc">' + item.Lastprice.toFixed(1)+'</label>' +
        '<br />';
    $('.Gembox').append(html);

}
function SetWatchTradeDetails(item) {
    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = parseFloat(item.Lastprice) - parseFloat(item.close);
    var perCentageHtml = "";
    var perCentage = "";
    var perChangeInDigit = "";
    if (PerChange < 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.Scripttype == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-down">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    else if (PerChange > 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.Scripttype == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    else if (PerChange == 0) {
        perCentage = 0;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.Scripttype == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    var Qty = 1;
    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var btnMarketDepth = "btnMarketDepth" + item.ScriptCode;
    var btnDeleteid = "btnDelete" + item.ScriptCode;
    var deleteButton = ' <button id="' + btnDeleteid + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-success btn-sm btn-Buy tradeDeleteButton">DELETE</button> ';
    var buyButton = '<div tabindex="-1" class="b-btn" style="float:right;"><button id="' + btnBuyid + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ')" type="button" class="btn btn-success btn-sm btn-Buy tradebuyButton">Buy</button> ';
    var sellButton = '<button id="' + btnSellid + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ')" type="button" class="btn btn-danger btn-sm btn-Sell tradeSellButton">Sell</button> ';
    var actionButton = buyButton + sellButton + deleteButton + '</div>';
    var html = "";
    var Scriptexpiry = "";
    if (item.Scriptexpiry != "") {
        var date = item.Scriptexpiry.split(" ");
        Scriptexpiry = '<span style="color: red;" class="watchlist-p watchlist-text-BBR">' + date[0] + '</span>';
    }
    var scriptInstumentType = '';
    if (item.ScriptInstrumentType == "FUT") {
    }
    else if (item.ScriptInstrumentType == "PE" || item.ScriptInstrumentType == "CE") {
        scriptInstumentType = item.ScriptInstrumentType;
    }
    if (item.ScriptName == "")
        item.ScriptName = item.ScriptTradingSymbol;
    if (item.ScriptName.length > 18) {
        item.ScriptName = item.ScriptName.substring(0, 18) + "...";
    }
    html = '<div class="rowSanaita " style="border-bottom: 1px solid #ddd;" id="' + item.ScriptCode + '" data-Scripttype="' +
        item.Scripttype + '"  data-scripttradingsymbol="' + item.ScriptTradingSymbol + '" data-ScriptExchange="' + item.ScriptExchange + '">' +
        '<div class="col-12 watchlistRowView" data-Scripttype="Btn' + item.ScriptCode + '"  data-scripttradingsymbol="' + item.ScriptTradingSymbol + '" data-ScriptExchange="' + item.ScriptExchange + '">' +
        '<div class="watchlist-card c-left-border watchlist-table">' +
        '<div class="card-body" id="' + btnMarketDepth + '" style="padding:5px;">' +
        '   <div class="rowSanaita">' +
        '<div style="background: #333;display: inline-flex;width: 100%;height: 22px;" class="col-12">' +
        '<div class="col-6" style="display:inline-flex;">' +
        ' <p class="watchlist-p watchlist-text-BBR">' + item.ScriptName + scriptInstumentType + '</p>' +
        '&nbsp' + Scriptexpiry +
        '</div>' +
        '<div class="col-5" style="display:flex;justify-content: right;padding-right: 12px;">' +
        '  <p class="watchlist-p watchlist-text-BBR Percentage_SEGMENT"  style="margin-left: 0;">  ' + perChangeInDigit + '(' + perCentageHtml + '%)</p>' +
        '</div>' +
        '</div>' +
        '<div style="width:100vw;display:inline-flex;" >' +
        '<div style="padding:0; width:66.6666666%;">' +
        '     <div class="rowSanaita Bid_Ask_SEGMENT" style="margin-left:2px;">' +
        '<div class="Item_Bid" style="margin-left: 8px;display: flex;font-size:20px!important;width:50%;">       ' +
        '               ' + '<div class="price-up" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: white;">B :</b> ' + item.Bid.toFixed(2) + '</div>' +
        '             </div>' +
        '            <div class="Item_Ask" style="display:flex;font-size: 20px !important; width:46.3333333%;">' +
        '              ' + '<div class="price-up" style="padding-bottom:0px;display:inline-flex;width:100%;"><b style="color: white;">A :</b>' + item.Ask.toFixed(2) + '</div>' +
        '       </div> ' +
        '              </div>' +
        '           </div>' +
        '<div style="padding-left: 27px;width:33.3333333%;">' +
        ' <p class="watchlist-p watchlist-text-BBR LTP_SEGMENT"style="padding:2px;">(' + item.Lastprice.toFixed(2) + ')</p>' +
        '</div>' +
        '</div>' +
        '<div style="width:100vw;display:inline-flex;" >' +
        '<div style="padding:0; width:66.6666666%;">' +
        '     <div class="rowSanaita" style="margin-left:2px;">' +
        '<div style="margin-left: 8px;display: flex;width:50%;">       ' +
        '               ' + '<div class="watchlist-p highlow-Mobile Item_Low" style="padding-left: 6px;">L: ' + item.low.toFixed(2) + '</div>' +
        '             </div>' +
        '            <div style="display:flex;width:46.3333333%;">' +
        '              ' + '<div class="watchlist-p highlow-Mobile Item_High">H: ' + item.high.toFixed(2) + '</div>' +
        '       </div> ' +
        '              </div>' +
        '           </div>' +
        '<div style="padding-left: 27px;width:33.3333333%;">' +
        '              ' + '<div class="watchlist-p highlow-Mobile Item_Open">O: ' + item.open.toFixed(2) + '</div>' +
        '</div>' +
        '</div>' +
        '        </div>' +
        '     </div>' +
        '  </div>' +
        '</div >' +
        '<div class="col-12 BuySellButton" style="float:right;padding: 8px 18px 6px 0px;display:none;" Id="Btn' + item.ScriptCode + '">' + actionButton +
        '        </div>' +
        '</div >';
    $('#watchlistDiv').append(html);


}
function SetWatchTradeDetailsForAdd(item) {

    var Symbol = '\'' + item.scriptTradingSymbol.toString() + '\'';

    var WID = $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id");
    var WID = '\'' + WID.toString() + '\'';

    var BuyButton = '<button class="btn btn-primary btn-sm btn-Sell" onclick="AddNewScript(' + Symbol + ',' + item.intWID + ',' + WID + ',' + WID + ',' + item.UserID + ',' + item.Lot + ',' + item.size + ')" type="button"><i class="fa fa-plus"></i></button>';
    var html = '<tr>' +
        '<td>' + item.scriptTradingSymbol + '</td>' +
        '<td>' + "" + '<br />' +
        '<span style="color:#ccc">' + "" + '</span></td>' +
        '<td>' + BuyButton + '</td>' +
        '</tr>';
    $('#watchlistDiv').append(html);

}
function AddNewScript(scriptTradingSymbol, intWID, Watchlistname, _ScriptExchange, txtUser, Lot, size) {
    if (scriptTradingSymbol != null && scriptTradingSymbol != '' && scriptTradingSymbol != undefined &&
        _ScriptExchange != null && _ScriptExchange != '') {
        var request = $.ajax({
            url: "/Watchlist/SaveWatchListFromIndex",
            type: "POST",
            data: { scriptTradingSymbol: scriptTradingSymbol, intWID: intWID, Watchlistname: Watchlistname, ScriptExchange: _ScriptExchange, txtUser: txtUser, Lot: Lot, Size: size },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                if (results.IsError && results.ErrorMessage == "MaxLimit") {
                    toastr.error("Max 50 Scripts Allowed");
                }
                else if (results.IsExist) {
                    toastr.error("Duplicate Record");
                }
                else if (results.IsError) {
                    toastr.error("Something Went Wrong");
                }
                else if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                    toastr.success("Script Added Successfully");
                    $('#searchText').val("");
                    SetTradeDataForRefresh();
                }
            }
        });
    }

}
function removeScript(ScriptCode, intWID) {
    if (ScriptCode > 0 && intWID > 0) {
        var request = $.ajax({
            url: "/Watchlist/DeleteScript",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {
                    toastr.error('Can Not Delete This Record.There Is One Active Trade.');
                    return false;
                }
                else {
                    SetTradeDataForRefresh();
                    toastr.success('Script Deleted Successfully.');
                    return false;
                }

            }

        });

    }

}