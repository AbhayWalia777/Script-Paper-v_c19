var myInterval;
var myInterval2;
var myInterval3;
var isLiveOrder;
var _WatchlistCurrentTabIndex = 0;
var ActiveTradeShow="";
var Completedpageno = 0;
var LastPriceDictionary = [];
var BtnIds = [];
var _WatchlistTotalPageNo = 0;
var _WatchlistCurrentPageNo = 1;
var _WatchlistPreviousTotalPageNo = 0;
var _isWatchlistCallBack = false;

var _CompletedTotalPageNo = 0;
var _CompletedPreviousTotalPageNo = 0;
var _CompletedCurrentPageNo = 1;
var _CompletedCallBack = false;

var _ActiveTotalPageNo = 0;
var _ActivePreviousTotalPageNo = 0;
var _ActiveCurrentPageNo = 1;
var _ActiveCallBack = false;

var Current_Loop_Valueof_Watchlist = 0;

var intervalSensexNifty;
var intervalWatchList;
var intervalActiveTrade;

var mobilebuyBtn;
var mobilesellBtn;
var mobiledeleteBtn;
var mobiledepthBtn;


var WatchListIndex = 0;
var WatchListLength = 0;
var curNumber = 0;
var i = 0;
var OldWIDForWatchlist;
var NewWIDForWatchlist;
var GLOBAL_USER_ID = '';
var GLOBAL_WATCHLIST_ID = '';
var GLOBAL_WATCHLIST_LIMIT = 10;
var allObj = [];
var objFavoriteWatchList = [];
var objSelfActiveTradeList = [];
var PreviousLastPrice;
var PreviousBidPrice;
var PreviousAskPrice;
var LastColor;
var LastPriceHtml;
var LastScriptName;
var dataDarkTheme;
var allowedTradingUnit;
var SocketInterval;

//#region KeyBoard Shortuts
$(document).keydown(function (event) {
    if (event.keyCode == 40) { // down Arrow
        //debugger;
        if (document.querySelector('.modal.fade.in') == null) {
          event.preventDefault();
            var ctable = document.getElementById("tblWatchListTradeListBody");

           if (WatchListIndex == 0 && WatchListLength > 0) {
               $('tr').removeClass('tabbedrow');
              
               $(ctable.rows[WatchListIndex]).addClass("tabbedrow");
               WatchListIndex = WatchListIndex + 1;
            }
           else if (WatchListIndex < WatchListLength - 1) {
                $('tr').removeClass('tabbedrow');
                WatchListIndex = WatchListIndex + 1;
               $(ctable.rows[WatchListIndex]).addClass("tabbedrow");
            }
            else {
               $('tr').removeClass('tabbedrow');
             
               WatchListIndex = WatchListIndex + 1;
               $(ctable.rows[WatchListIndex]).addClass("tabbedrow");
             

            }

        }
    }
    else if (event.keyCode == 38) { // up Arrow


        if (document.querySelector('.modal.fade.in') == null) {
            event.preventDefault();
            var ctable = document.getElementById("tblWatchListTradeListBody");

            if (WatchListIndex == 0 && WatchListLength > 0) {
                $('tr').removeClass('tabbedrow');

                $(ctable.rows[WatchListIndex]).addClass("tabbedrow");
                WatchListIndex = WatchListIndex - 1;
            }
            else if (WatchListIndex < WatchListLength - 1) {
                $('tr').removeClass('tabbedrow');
                WatchListIndex = WatchListIndex - 1;
                $(ctable.rows[WatchListIndex]).addClass("tabbedrow");
            }
            else {
                $('tr').removeClass('tabbedrow');
              
               WatchListIndex = WatchListIndex - 1;
                $(ctable.rows[WatchListIndex]).addClass("tabbedrow");
             


            }

        }
      
    }
    else if (event.altKey && event.keyCode == 75) { // Keyboard Shortcut alt+K
        $("#buySellModel").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#MarketDepthModal").modal('hide');
        $('#keyBoardHelpModal').modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        $('#keyBoardHelpModal').modal('show');
    }
    else if ((event.altKey && event.keyCode === 66) && !$("#addScriptModal").hasClass('in')) { // Alt+B button
        event.preventDefault();
        var html = $('.tabbedrow').clone();
       var pcbuyBtn = html[0].children[0].children[2].children[0].id;
        
        $("#MarketDepthModal").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        $('#keyBoardHelpModal').modal('hide');
        $("#" + pcbuyBtn + "").trigger('click');
           
       
    }
    else if ((event.altKey && event.keyCode === 83) && !$("#addScriptModal").hasClass('in')) { // Alt+S button
        event.preventDefault();
        var html = $('.tabbedrow').clone();
        var pcsellBtn = html[0].children[0].children[2].children[1].id;
      
        $("#MarketDepthModal").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        $("#" + pcsellBtn + "").trigger('click');
    }
    else if (event.keyCode == 46) { // Delete Button
        event.preventDefault();
        var html = $('.tabbedrow').clone();
        var pcdeleteBtn = html[0].children[0].children[2].children[2].id;
        $("#MarketDepthModal").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        $('#keyBoardHelpModal').modal('hide');
        $("#" + pcdeleteBtn + "").trigger('click');
      
    }
    else if (event.altKey && event.keyCode === 77) { // Market Depth Alt+M button
        var html = $('.tabbedrow').clone();
        var pcdepthBtn = html[0].children[0].children[2].children[3].id;
        $("#MarketDepthModal").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        $('#keyBoardHelpModal').modal('hide');
        $("#" + pcdepthBtn + "").trigger('click');
       
    }
    else if (event.altKey && event.keyCode === 65) { // Active Trade Alt+A button
        var html = $('.tabbedrow').clone();
        $("#MarketDepthModal").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        $('#keyBoardHelpModal').modal('hide');
        $("#ActiveTradeonfunction").trigger('click');
    }
    else if (event.altKey && event.keyCode === 67) { // completed trade Alt+C button
        var html = $('.tabbedrow').clone();
        $("#MarketDepthModal").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        $('#keyBoardHelpModal').modal('hide');
        $("#btnMoreInfoCompletedTrade2").trigger('click');
    }
    else if (event.keyCode == 27) { // ESC button
        event.preventDefault();
        $("#buySellModel").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#MarketDepthModal").modal('hide');
        $('#keyBoardHelpModal').modal('hide');
        $("#ActiveTradeOnClick").modal('hide');
        window.clearInterval(marketDepthInterval);
    }
});
//#endregion

//#region Window On Load Function

//#endregion

//#region Document Ready Function
$(document).ready(function () {
    GLOBAL_WATCHLIST_ID = $("ul #custom-tabs-one-tab li.nav-item.active a").attr("data-id");
    GLOBAL_USER_ID = $("#UserID").val();
    SetTradeData();
    SocketInterval = setInterval(function () { initSocket(); }, 1000);

    var changetype = localStorage.getItem("changetype");
    if (changetype == null) {
        $("#rdPercentage").prop('checked', true);
    }
    else {
        $('#' + changetype).prop('checked', true);
    }
    $('#tblWatchListTradeList').DataTable({
        "paging": true,
        "lengthChange": true,
        "processing": false,
        "info": false,
        "ordering": false,
        "searching": false
    });
    $("#tblWatchListTradeList_processing").fadeIn(500);
    if (screen.width <= 768) {
        $('.wathlist-tab').attr('colspan', 3);
    }
    else {
        $('.wathlist-tab').attr('colspan', 11);
    }

    LastPriceDictionary = new Array();
    intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist(); }, 5000);
    intervalActiveTrade = setInterval(function () { SetActiveTradeStatus(); }, 1000);
    myInterval2 = setInterval(function () { SetWalletBalance(); }, 1000);


});
//#endregion
var allObj = [];
var websocket;
//#region Calling Web Socket
function initSocket() {
    $.ajax({
        url: '/Home/ConnectWebSocket',
        type: 'GET',
        dataType: 'json',
        success: function (event) {
            if (event != 'undefined') {
                var allActiveAndWatchObj = JSON.parse(event);
                if (allActiveAndWatchObj.hasOwnProperty("Table")) {
                    allObj = allActiveAndWatchObj.Table;
                }
                Watchlist();
            }
        }
    });
}
//#endregion
function User_Id(value) {
    return value == GLOBAL_USER_ID;
}
//#region Set Watch List Data
function Watchlist() {
    var nData = allObj;

    if (nData != null && nData != 'undefined' && nData.length > 0) {
        var table = document.getElementById("tblWatchListTradeListBody");
        var i = 0;

        while (i < table.rows.length) {
            //  var newL = nData.filter(opt => opt.InstrumentToken == $(table.rows[i].cells[0]).find('$("#searchText")').val());
            var newL = nData.filter(opt => opt.InstrumentToken == $(table.rows[i].cells[0]).find('input[Name=hiddenCode]').val());
            if (newL.length > 0) {
                var item = newL[0];


                var PreviousLastPrice = 0.0;
                var PreviousBidPrice = 0.0;
                var PreviousAskPrice = 0.0;
                var LastColor = "";
                for (var keys in LastPriceDictionary) {
                    if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                        PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
                        PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
                        PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
                        LastColor = LastPriceDictionary[keys].color;
                        break;
                    }
                }

                var LastPriceHtml = "";
                if (parseFloat(item.Lastprice) > PreviousLastPrice) {
                    LastPriceHtml = '<span class="lp" >' + item.Lastprice + '</span>';
                    LastColor = 'green';
                }
                if (parseFloat(item.Lastprice) < PreviousLastPrice) {
                    LastPriceHtml = '<span class="lp" >' + item.Lastprice + '</span>';
                    LastColor = 'red';
                }
                if (item.Lastprice == PreviousLastPrice) {
                    LastPriceHtml = '<span class="lp">' + item.Lastprice + '</span>';
                }
                $(table.rows[i].cells[1]).css('color', LastColor.length > 2 ? LastColor : 'red');
                $(table.rows[i].cells[1]).html(LastPriceHtml);
                $(table.rows[i].cells[3]).html(item.BidQty);
                var LastBidHtml = "";
                if (parseFloat(item.Bid) > PreviousBidPrice) {
                    LastBidHtml = '<span class="green">' + item.Bid + '</span>';
                }
                if (parseFloat(item.Bid) < PreviousBidPrice) {
                    LastBidHtml = '<span class="red">' + item.Bid + '</span>';
                }
                if (item.Bid == PreviousBidPrice) {
                    LastBidHtml = '<span class="green">' + item.Bid + '</span>';
                }


                $(table.rows[i].cells[4]).html(LastBidHtml);

                var LastAskHtml = "";
                if (parseFloat(item.Ask) > PreviousAskPrice) {
                    LastAskHtml = '<span class="green">' + item.Ask + '</span>';
                }
                if (parseFloat(item.Ask) < PreviousAskPrice) {
                    LastAskHtml = '<span class="red">' + item.Ask + '</span>';
                }
                if (item.Ask == PreviousAskPrice) {
                    LastAskHtml = '<span class="green">' + item.Ask + '</span>';
                }
                $(table.rows[i].cells[5]).html(LastAskHtml);
                $(table.rows[i].cells[6]).html(item.AskQty);
                $(table.rows[i].cells[7]).html(item.Open);
                $(table.rows[i].cells[8]).html(item.high);
                $(table.rows[i].cells[9]).html(item.low);
                $(table.rows[i].cells[10]).html(item.Close);



                var IsExistsLTP = false;
                for (var keys in LastPriceDictionary) {
                    if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                        IsExistsLTP = true;
                        LastPriceDictionary[keys].value = item.Lastprice;
                        LastPriceDictionary[keys].color = LastColor;
                        LastPriceDictionary[keys].Bid = item.Bid;
                        LastPriceDictionary[keys].Ask = item.Ask;
                    }
                }
                if (!IsExistsLTP) {
                    LastPriceDictionary.push({
                        key: item.InstrumentToken,
                        value: item.Lastprice,
                        color: LastColor,
                        Bid: item.Bid,
                        Ask: item.Ask

                    });
                }
                var SCRIPT_TYPE = $(table.rows[i].cells[0]).find('input[Name=Scripttype]').val();
                if (item.Close == null)
                    item.Close = 0;

                var PerChange = 0;
                var perCentage = 0;
                var perCentageHtml = '';
                if ($("#rdPercentage").prop('checked') == true) {
                    PerChange = parseFloat(item.Lastprice) - parseFloat(item.Close);
                    if (PerChange < 0) {
                        perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                        if (SCRIPT_TYPE == "BINANCE") {
                            perCentage = item.Change;
                        }
                        if (SCRIPT_TYPE == "FOREX") {
                            perCentage = 0.00000;
                        }
                        perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
                    }
                    else if (PerChange >= 0) {
                        perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                        if (SCRIPT_TYPE == "BINANCE") {
                            perCentage = item.Change;
                        }
                        if (SCRIPT_TYPE == "FOREX") {
                            perCentage = 0.00000;
                        }
                        perCentageHtml = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
                    }
                }
                else if ($("#rdAbsolute").prop('checked') == true) {
                    PerChange = parseFloat(item.Lastprice) - parseFloat(item.Close);
                    if (PerChange < 0) {
                        perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + PerChange.toFixed(5) + '</i>';
                    }
                    else if (PerChange >= 0) {
                        perCentageHtml = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + PerChange.toFixed(5) + '</i>';
                    }
                }
                $(table.rows[i].cells[2]).html(perCentageHtml);

            }
            i++;
        }
        if ($('#buySellModel').hasClass('in')) {
            var newL = nData.filter(opt => opt.InstrumentToken == $('#buySellModel #lblScriptCode').text());
            if (newL.length > 0) {
                $('#buySellModel #lblLastPrice').text(newL[0].Lastprice);
                $('#buySellModel #lblLastBid').text(newL[0].Bid);
                $('#buySellModel #lblLastAsk').text(newL[0].Ask);
                $('#buySellModel #hdnHigh').text(newL[0].high);
                $('#buySellModel #hdnLow').text(newL[0].low);
                $('#buySellModel #hdnPrice').val(newL[0].Lastprice);
            }
        }


        //if (objLstWatchList.length > 0) {
        //    _WatchlistTotalPageNo = Math.ceil(objLstWatchList.length / GLOBAL_WATCHLIST_LIMIT);
        //    if (_WatchlistTotalPageNo > 1)
        //        $(".Manualpagination").css({ display: "block" });
        //    else
        //        $(".Manualpagination").css({ display: "none" });

        //    if (_WatchlistCurrentPageNo == 1)
        //        PrevPageDisable();

        //    var tblWatchTradeList = $('#tblWatchListTradeList').DataTable();
        //    tblWatchTradeList.clear().draw();
        //    objLstWatchList = objLstWatchList.slice(GLOBAL_WATCHLIST_LIMIT * (_WatchlistCurrentPageNo - 1), _WatchlistCurrentPageNo * GLOBAL_WATCHLIST_LIMIT);
        //    tblWatchTradeList.innerHTML = "";
        //    WatchListLength = objLstWatchList.length;
        //    for (var i = 0; i < objLstWatchList.length; i++) {
        //        var result = objLstWatchList[i];
        //        SetWatchTradeDetails(result);
        //        var ctable = document.getElementById("tblWatchListTradeListBody");
        //        if (objLstWatchList.length > 0)
        //            $(ctable.rows[WatchListIndex]).addClass("tabbedrow");

        //        $("#tblWatchListTradeListBody tr").on('hover', function () {
        //            console.log(this);
        //        });
        //    }
        //}
        //else {
        //    var tblWatchTradeList = $('#tblWatchListTradeList').DataTable();
        //    tblWatchTradeList.clear().draw();
        //    tblWatchTradeList.innerHTML = "";
        //}
    }

}


function SetWatchTradeDetails(item) {
    var PreviousLastPrice = 0.0;
    var PreviousBidPrice = 0.0;
    var PreviousAskPrice = 0.0;
    var LastColor = "";
    for (var keys in LastPriceDictionary) {
        if (LastPriceDictionary[keys].key == item.ScriptCode) {
            PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
            PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
            PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
            LastColor = LastPriceDictionary[keys].color;
            break;
        }
    }

    var LastPriceHtml = "";
    var LastScriptName = "";
    if (parseFloat(item.Lastprice) > PreviousLastPrice) {
        LastPriceHtml = '<i class="fa Green-Wachlist">' + item.Lastprice + '</i>';
        LastScriptName = '<i class="fa Green-Wachlist">' + item.ScriptTradingSymbol + '</i>';
        LastColor = 'green';
    }
    if (parseFloat(item.Lastprice) < PreviousLastPrice) {
        LastPriceHtml = '<span class="red">' + item.Lastprice + '</span>';
        LastScriptName = '<i class="fa red">' + item.ScriptTradingSymbol + '</i>';
        LastColor = 'red';
    }
    if (item.Lastprice == PreviousLastPrice) {
        LastPriceHtml = '<i class="fa Green-Wachlist">' + item.Lastprice + '</i>';
        LastScriptName = '<i class="fa Green-Wachlist">' + item.ScriptTradingSymbol + '</i>';
    }

    var LastBidHtml = "";
    if (parseFloat(item.Bid) > PreviousBidPrice) {
        LastBidHtml = '<i class="fa Green-Wachlist">' + item.Bid + '</i>';
    }
    if (parseFloat(item.Bid) < PreviousBidPrice) {
        LastBidHtml = '<span class="red">' + item.Bid + '</span>';
    }
    if (item.Bid == PreviousBidPrice) {
        LastBidHtml = '<i class="fa Green-Wachlist">' + item.Bid + '</i>';
    }

    var LastAskHtml = "";
    if (parseFloat(item.Ask) > PreviousAskPrice) {
        LastAskHtml = '<i class="fa Green-Wachlist">' + item.Ask + '</i>';
    }
    if (parseFloat(item.Ask) < PreviousAskPrice) {
        LastAskHtml = '<span class="red">' + item.Ask + '</span>';
    }
    if (item.Ask == PreviousAskPrice) {
        LastAskHtml = '<i class="fa Green-Wachlist">' + item.Ask + '</i>';
    }


    var btnName = 'btn';
    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = "";
    var perCentageHtml = "";
    var perCentage = "";
    if (item.Scripttype != "BINANCE") {
        if ($("#rdPercentage").prop('checked') == true) {
            PerChange = parseFloat(item.Lastprice) - parseFloat(item.close);
            if (PerChange < 0) {
                perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + perCentage.toFixed(2) + '&nbsp%</i>';
            }
            else if (PerChange >= 0) {
                perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
                perCentageHtml = '<i class="fa fa-angle-up">&nbsp&nbsp&nbsp' + perCentage.toFixed(2) + '&nbsp%</i>';
            }
        }
        else if ($("#rdAbsolute").prop('checked') == true) {
            PerChange = parseFloat(item.Lastprice) - parseFloat(item.close);
            if (PerChange < 0) {
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
            }
            else if (PerChange >= 0) {
                perCentageHtml = '<i class="fa fa-angle-up">&nbsp&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
            }
        }
    }
    else {
        if ($("#rdPercentage").prop('checked') == true) {

            if (item.PerChange < 0) {
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + item.PerChange.toFixed(2) + '&nbsp%</i>';
            }
            else if (item.PerChange >= 0) {
                perCentageHtml = '<i class="fa fa-angle-up">&nbsp&nbsp&nbsp' + item.PerChange.toFixed(2) + '&nbsp%</i>';
            }
        }
        else if ($("#rdAbsolute").prop('checked') == true) {
            if (item.ChangeInRupee < 0) {
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';
            }
            else if (item.ChangeInRupee >= 0) {
                perCentageHtml = '<i class="fa fa-angle-up">&nbsp&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';
            }
        }
    }
    var Qty = 1;
    //if (item.ScriptExchange == "NFO")
    //  Qty = item.ScriptLotSize;
    var hiddenCode = '<input Name="hiddenCode" value="' + item.ScriptCode + '" type="hidden" >';
    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var btnMarketDepth = "btnMarketDepth" + item.ScriptCode;
    var btnDeleteid = "btnDelete" + item.ScriptCode;
    var deleteButton = ' <button id="' + btnDeleteid + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ';
    var buyButton = '<div tabindex="-1" class="b-btn"><button id="' + btnBuyid + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.high + ',' + item.low + ',' + item.Lastprice + ')" type="button" class="btn btn-success btn-sm btn-Buy">B </button> ';
    var sellButton = '<button id="' + btnSellid + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.high + ',' + item.low + ',' + item.Lastprice + ')" type="button" class="btn btn-danger btn-sm btn-Sell"> S </button> ';
    var marketDepthButton = ' <button id=' + btnMarketDepth + ' class="btn btn-primary btn-sm btn-depth" onclick="MarketDepthPop(' + item.ScriptCode + ',' + script_Trading_Symbol + ',' + item.Lastprice + ')" type="button" ><i class="fa fa-bars"></i></button> </div>';
    var actionButton = hiddenCode + buyButton + sellButton + deleteButton + marketDepthButton;
    var Scriptexpiry = "";
    if (item.Scriptexpiry != "") {
        var date = item.Scriptexpiry.split(" ");
        Scriptexpiry = '<div><span class="expiry">(' + item.ScriptExchange + ') Expiry :' + date[0] + '</span></div>';
    }
    else {
        Scriptexpiry = '<div><span class="expiry">(' + item.ScriptExchange + ')</span></div>';
    }

    if ($('#buySellModel #lblScriptCode').text() == item.ScriptCode.toString()) {
        var LTP = item.Lastprice.toString();
        $('#buySellModel #lblLastPrice').text(LTP);
        $('#buySellModel #lblLastBid').text(item.Bid);
        $('#buySellModel #lblLastAsk').text(item.Ask);
        $('#buySellModel #hdnPrice').val(LTP);
    }
    var wtable = $('#tblWatchListTradeList').DataTable().row.add([
        LastScriptName + actionButton + Scriptexpiry,
        LastPriceHtml,
        perCentageHtml,
        LastBidHtml,
        item.BidQty,
        LastAskHtml,
        item.AskQty,
        item.open,
        item.high,
        item.low,
        item.close,
    ]).draw();


    var IsExistsLTP = false;
    for (var keys in LastPriceDictionary) {
        if (LastPriceDictionary[keys].key == item.ScriptCode) {
            IsExistsLTP = true;
            LastPriceDictionary[keys].value = item.Lastprice;
            LastPriceDictionary[keys].color = LastColor;

        }
    }
    if (!IsExistsLTP) {
        LastPriceDictionary.push({
            key: item.ScriptCode,
            value: item.Lastprice,
            color: LastColor,
            Bid: item.Bid,
            Ask: item.Ask

        });
    }

    var IsExists = false;
    for (var keys in BtnIds) {
        if (BtnIds[keys].BuyBtnId == btnBuyid) {
            IsExists = true;
        }
    }
    $("#tblWatchListTradeList_processing").fadeOut(300);
}
//#endregion

//#region Set Favorite Watchlist Data On The Top
function FavoriteWatchlist() {
    $.ajax({
        url: '/Trade/SetFavoriteWatchlistData',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                var results = JSON.parse(data);
                if (results.objLstWatchList.length > 0) {
                    var PerChange = "";
                    var perCentageHtml = "";
                    var perCentage = "";
                    for (var i = 0; i < results.objLstWatchList.length; i++) {
                        if ($("#rdPercentage").prop('checked') == true) {
                            PerChange = parseFloat(results.objLstWatchList[i].Lastprice) - parseFloat(results.objLstWatchList[i].close);
                            if (PerChange < 0) {
                                perCentage = (parseFloat(PerChange) / parseFloat(results.objLstWatchList[i].close)) * 100;
                                perCentageHtml = '<i class="fa fa-angle-down percentage-down">&nbsp' + perCentage.toFixed(2) + '%</i>';
                            }
                            else if (PerChange >= 0) {
                                perCentage = (parseFloat(PerChange) / parseFloat(results.objLstWatchList[i].close)) * 100;
                                perCentageHtml = '<i class="fa fa-angle-up percentage-up">&nbsp' + perCentage.toFixed(2) + '%</i>';
                            }
                        }
                        else {
                            PerChange = parseFloat(results.objLstWatchList[i].Lastprice) - parseFloat(results.objLstWatchList[i].close);
                            if (PerChange < 0) {
                                perCentageHtml = '<i class="fa fa-angle-down percentage-down">&nbsp' + PerChange.toFixed(2) + '</i>';
                            }
                            else if (PerChange >= 0) {
                                perCentageHtml = '<i class="fa fa-angle-up percentage-up">&nbsp' + PerChange.toFixed(2) + '</i>';
                            }
                        }
                        if (i == 0) {
                            $('.favorite1').html('<a class="sensex color-White-Link">' + results.objLstWatchList[0].ScriptTradingSymbol + ' </a><a class="sensex-price color-White-Link"> ' + results.objLstWatchList[0].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</a>');
                        }
                        if (i == 1) {
                            $('.favorite2').html('<a class="nifty color-White-Link">' + results.objLstWatchList[1].ScriptTradingSymbol + '</a><a class="nifty-price color-White-Link"> ' + results.objLstWatchList[1].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</a>');
                        }
                    }
                }
            }
        },
        error: function (error) {
        }
    });
}
//#endregion

//#region Pagination 
$('#WatchListPrevPageShow').on('click', function () {
    $("#tblWatchListTradeList_processing").fadeIn(100);
    if (_WatchlistCurrentPageNo != 1) {
        _WatchlistCurrentPageNo = _WatchlistCurrentPageNo - 1;
        NextPageEnable();
        PrevPageEnable();
    }
    if (_WatchlistCurrentPageNo == 1) {
        NextPageEnable();
        PrevPageDisable();
    }
    LastPriceDictionary = new Array();
});
$('#WatchListNextPageShow').on('click', function () {
    $("#tblWatchListTradeList_processing").fadeIn(100);
    if (_WatchlistCurrentPageNo < _WatchlistTotalPageNo) {
        _WatchlistCurrentPageNo = _WatchlistCurrentPageNo + 1;
        NextPageEnable();
        PrevPageEnable();
    }
    if (_WatchlistCurrentPageNo == _WatchlistTotalPageNo) {
        NextPageDisable();
        PrevPageEnable();
    }
    LastPriceDictionary = new Array();
});
//#endregion

//#region Watchlist On Change Function 
$('ul #custom-tabs-one-tab li.nav-item:not(.watchlist-setting) a').on('click', function () {
    $("#tblWatchListTradeList_processing").fadeIn(0);
    _WatchlistCurrentPageNo = 1;
    WatchListIndex = 0;
        GLOBAL_WATCHLIST_ID = $(this).attr("data-id");
    SetTradeData();
});
//#endregion

//#region Percentage Type Change
$("#rdPercentage").on('change', function () {
    localStorage.setItem("changetype", "rdPercentage");
});
$("#rdAbsolute").on('change', function () {
    localStorage.setItem("changetype", "rdAbsolute");
});
//#endregion

//#region Voice Recognition
$(".searchButton").on('click', function () {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.start();
        $("#microphone").modal('show');
        recognition.onresult = function (e) {
            $("#searchText").val(e.results[0][0].transcript);
            recognition.stop();
            $("#microphone").modal('hide');
        }
        recognition.onerror = function (e) {
            recognition.stop();
            $("#microphone").modal('hide');
        }
    }
    else {
        toastr.error("Your Browser Does Not Support's This Feature.");
    }
});
//#endregion Voice Recognition
$.expr[":"].containsNoCase = function (el, i, m) {
    var search = m[3];
    if (!search) return false;
    return eval("/" + search + "/i").test($(el).text());
};
$("#searchText").on('keyup', function () {
    SetTradeData();
});
/*$(document).ready(function () {
    $("#searchText").on('keyup', function () {
        SetTradeData();
        if ($('#searchText').val().length > 1) {
            $('#tblWatchListTradeList tr').hide();
            $('#tblWatchListTradeList tr:first').show();
            $('#tblWatchListTradeList tr td:containsNoCase(\'' + $('#searchText').val() + '\')').parent().show();
        }
        else if ($('#searchText').val().length == 0) {
            resetSearchValue();
        }
        if ($('#tblWatchListTradeList tr:visible').length == 1) {
            $('.norecords').remove();
            $('#tblWatchListTradeList').append('<tr class="norecords">< td colspan="6" class= "Normal" style = "text-align:center" > No records were found</td > </tr > ');
        }

    });

    $('#searchText').keyup(function (event) {
        if (event.keyCode == 27) {
            resetSearchValue();
        }
    });
});  */

function resetSearchValue() {
    $('#searchText').val('');
    $('#tblWatchListTradeList tr').show();
    $('.norecords').remove();
    $('#searchText').focus();
}
//#region Set Active Trade Data
function SetResultActive(data) {
    var results = JSON.parse(data);
    if (results != null) {
        var Totalprofitloss = 0;
        $('.TotalActiveTradeProfitOrLoss > h3').text(Totalprofitloss);
        $('.TotalActiveTrade > h3').text(objSelfActiveTradeList.length);
        var _CheckActiveCurrentPage;
        $('#tblActiveTradeList').html('');
        if (results.ActiveTrade.length > 0) {
            for (var i = 0; i < results.ActiveTrade.length; i++) {
                var result = results.ActiveTrade[i];
                _ActiveTotalPageNo = results.ActiveTrade[i].Total_Page;
                _CheckActiveCurrentPage = results.ActiveTrade[i].Total_Page;
                SetActiveTradeDetails(result);
            }
        }
        curNumber = 0;
    }
    else {
        _ActiveTotalPageNo = 1;
        _CheckActiveCurrentPage = 0;
        if (results.ActiveTrade.length == 0) {
            var html = '<div style="text-Align:centre">No More Data Here</div>';
            $('#tblActiveTradeList').append(html);
        }
    }


    if (_ActivePreviousTotalPageNo != _CheckActiveCurrentPage) {
        ActiveTradePaginationDestroy();
    }

    if (results.ActiveTrade.length > 0) {
        _ActivePreviousTotalPageNo = 1;
    }
    else {
        _ActivePreviousTotalPageNo = 1;
    }
    SetActiveTradePagination();

    $('.TotalActiveTradeProfitOrLoss > h3').text(results.TotalActiveTradeProfitOrLoss);
    $('.TotalActiveTrade > h3').text(results.TotalActiveTradeCount);
    $('.TotalCompletedTrade > h3').text(results.TotalCompletedTradeCount);
    $('.TotalCompletedTradeProfitOrLoss > h3').text(results.TotalCompletedTradeProfitOrLoss);
    if (results.TotalActiveTradeProfitOrLoss >= 0) {
        $('.TotalActiveTradeProfitOrLoss').css('color', '');
    }
    else {
        $('.TotalActiveTradeProfitOrLoss').css('color', 'red');
    }
    if (results.TotalCompletedTradeProfitOrLoss >= 0) {
        $('.TotalCompletedTradeProfitOrLoss').css('color', '');
    }
    else {
        $('.TotalCompletedTradeProfitOrLoss').css('color', 'red');
    }
}

function SetActiveTradeDetails(item) {
    //debugger;
    var Companyinitials = $("#CompanyInitial").val();
    var btnName = 'btn';

    var symbolParam = '\'' + item.TradeSymbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ProductType = '\'' + item.ProductType + '\'';
    var PriceType = '\'' + item.PriceType + '\'';
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var buyButton = "";
    var sellButton = "";
    var convertButton = "";

    var isManualStaratgy = false;
    if (item.Strategyname == "Manual")
        isManualStaratgy = true;
    var RoleId = $("#Role_Id").val();

    var CurrentPosition = item.CurrentPosition;
    var BuyOrSell = 2;
    var sQty = item.Qty;
    if (item.ObjScriptDTO.ScriptLotSize > 1)
        sQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;

    var editButton = "";
    var syncButton = "";
    var addbutton = "";
    var RejectedOrderDeleteBtn = "";

    if (item.Status.toUpperCase() != "REJECTED") {
        if (item.CurrentPositionNew == "Buy")
            BuyOrSell = 1;
        editButton = ' <button class="btn btn-primary btn-sm" onclick="buySellPopUp(' + item.ScriptCode + ',' + BuyOrSell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + sQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.high + ',' + item.low + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + PriceType + ',' + ProductType + ',' + item.ActiveTradeID + ',' + st + ',' + item.TRADING_UNIT_TYPE + ')" type="button"><i class="fa fa-pencil"></i></button> ';
        //if (item.OrderID > 0 && item.OrderSync == 0 && item.Status.toUpperCase() != "COMPLETE")
        //    syncButton = ' &nbsp <button class="btn btn-primary btn-sm" type="button" onclick="CallSync(' + item.ActiveTradeID + ')"><i class="fa fa-refresh"></i></button>';
        buyButton = ' <button class="btn btn-primary btn-sm" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
        sellButton = ' <button class="btn btn-danger btn-sm btn-Sell" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
        if (item.ProductType == "MIS")
            convertButton = ' <button title="Convert MIS to CNC" class="btn btn-primary btn-sm" onclick="convertButton(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ');" type="button"><i class="fa fa-exchange"></i></button> ';
        if (item.Status.toUpperCase() != "OPEN" && isManualStaratgy)
            addbutton = '<button class="btn btn-primary btn-sm btn-Sell" onclick="AddQty(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + BuyOrSell + ')" type="button"><i class="fa fa-plus"></i></button>';

    }
    if (item.Status.toUpperCase() == "REJECTED") {
        RejectedOrderDeleteBtn = '<button onclick = "DeleteRejectedTrade(' + item.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-delete" > <i class="fa fa-trash-o"></i></button >';
    }
    if (item.CurrentPositionNew == "Buy") {
        //CurrentPosition = CurrentPosition + " " + sellButton;
        CurrentPosition = sellButton;


    }
    else if (item.CurrentPositionNew == "Sell") {
        //CurrentPosition = CurrentPosition + " " + buyButton;
        CurrentPosition = buyButton;
    }

    if (Companyinitials == "PB") {
        addbutton = "";
    }

    var deleteButton = ' <a href="javascript:void(0)" id="' + item.ActiveTradeID + '" data-tradeId="' + item.ActiveTradeID + '" class="delete-prompt"><button type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button></a> ';
    var actionButton = editButton + syncButton + addbutton + RejectedOrderDeleteBtn + convertButton; //+ deleteButton

    if (parseInt(RoleId) == 2 && item.IsCopyTradeFlag == true) {
        actionButton = "-";
        CurrentPosition = "-";
    }

    var finalTradingSymbol = "";
    if (item.ObjScriptDTO.Scripttype == "FOREX") {
        finalTradingSymbol = item.TradeSymbol + " / " + item.ObjScriptDTO.Scriptsegment;
    }
    else {
        finalTradingSymbol = item.TradeSymbol;
    }

    var TriggerPrice = parseFloat(item.TriggerPrice);
    if (item.TriggerPrice == null || item.TriggerPrice == "") {
        item.TriggerPrice = 0;
    }
    /*    if (Companyinitials == "SC") {
            $('#tblActiveTradeList').DataTable().row.add([
                CurrentPosition,
                actionButton,
                finalTradingSymbol,
                sQty,
                item.CurrentPositionNew,
    
                item.OrderPrice,
                TriggerPrice,
                item.ObjScriptDTO.Lastprice,
    
                item.Profitorloss,
                item.Status,
                item.SL,
                item.TGT2,
                item.OrderDate,
                item.OrderTime,
                item.ProductType,
                item.Watchlistname,
                item.Fundmanagername,
    
            ]).draw();
        }
        else {*/
    if (curNumber == 0) {
        curNumber = 2;
    }
    curNumber++;
    if (curNumber > 2) {
        curNumber = 1;
    }

    i++;
    if (i > 180) {
        i = 0;
    }
    var ProfitId = 'ActiveLblProfitLoss' + i;
    var ProfitId1 = 'ActiveLblProfitLoss1' + i;
    var OrderPriceId = 'ActiveLblOrderPrice' + i;
    var CurrentPositionId = 'ActivelblCurrentPosition' + i;
    var tgtId = 'ActiveLblTGT' + i;
    var tgt2Id = 'ActiveLblTGT2' + i;
    var ActiveLblBTNId = 'ActiveLblBTN' + i;
    var idText = 'id=';
    var html = '<div class="div-button-hover" style="overflow:hidden" id="ChangeColorWhiteGray">' +
        '<ul class="table-responsive fittable" style="padding-inline-start: 0px;overflow:hidden;">' +
        '<div>' +
        '<div class="Hide-Label-On-Hover  Hover' + item.ActiveTradeID + '" ' + idText + ActiveLblBTNId + ' style="width:180px">' + finalTradingSymbol +
        '</div>' +
        '<div class="Show-Button-On-Hover Hover' + item.ActiveTradeID + '" data-ActiveId="Hover' + item.ActiveTradeID + '">' +
        '<li style="width:65px" class="ActiveLblBTNCP" tabindex="-1" >' + CurrentPosition + '</li>' +
        '<li style="width:80px; display:flex;padding-left: 26px;" class="" tabindex="-1" >' + actionButton + '</li>' +
        '</div>' +
        '</div>' +
        '<div class= "Hidden-on-400px" style="width: 60px;"><li class="width-60px-Active"><div class="Display-on-991px">Qty:</div>' + sQty + '</li></div>' +
        '<li style="width:100px; display: flex; align-items: baseline;font-weight: bold;"><div class="Display-on-991px">P/L:</div><div ' + idText + ProfitId + '>' + item.Profitorloss + '</div></li>' +
        '<div class="Hidden-on-600px">' +
        '<li style="width:100px" ' + idText + OrderPriceId + '><div class="Display-on-991px">Op:</div>' + item.OrderPrice + '</li>' +
        '<li style="width:100px" ' + idText + CurrentPositionId + '><div class="Display-on-991px">CP:</div>' + item.CurrentPositionNew + '</li>' +
        '</div>' +
        '<div class="Hidden-on-991px">' +
        '<li style="width:100px"><div class="Display-on-991px">Lp:</div>' + item.ObjScriptDTO.Lastprice + '</li>' +
        '<li style="width:100px"><div class="Display-on-991px">Status:</div>' + item.Status + '</li>' +
        '<li style="width:110px"><div class="Display-on-991px">TriggerPrice:</div>' + item.TriggerPrice + '</li>' +
        '</div>' +
        '</ul>' +

        '<div class="Show-Additional-Information Hover' + item.ActiveTradeID + '">' +
        /*'<div style="width:100%;text-align: center;"><c style="color:red;text-align: center;">- - - - - - - - - - - - - - - - - - - - - - -'+ ' - - - - - Additional Information - - - - - - - - - - - - - - - - - - - - - - - - - - - -</c></div>'+*/

        '<div class="col-lg-12-Manual Font-12px" style="padding-inline-start:0px;border-bottom:1px solid;padding-bottom:4px">' +
        '<div class="Show-on-991px col-lg-12-Manual" style="padding-inline-start:0px;">' +
        '<div style="" class="Padding-right-width"><b>Lp:</b>' + item.ObjScriptDTO.Lastprice + '</div>' +
        '<div style="" class="Padding-right-width"><b>Status:</b>' + item.Status + '</div>' +
        '<div class="Display-on-991px"><b>TP:</b>' + item.TriggerPrice + '</div>' +
        '</div>' +
        '<div style="display: flex;" class="col-lg-7-Manual">' +
        '<div><b>SL:</b> ' + item.SL + '&nbsp;|&nbsp;</div>' +
        '<div ><b>TGT:</b> <TGT ' + idText + tgtId + '>' + item.TGT2 + '</TGT>&nbsp;|&nbsp;</div>' +
        '<div ' + idText + tgt2Id + '"><b>TGT2:</b> ' + item.TGT3 + '&nbsp;|&nbsp;</div>' +
        '<div><b>TGT3:</b> ' + item.TGT4 + '</div>' +
        '</div>' +
        '<div class="col-lg-5-Manual DateTime-Active-Trade" style="">' +
        '<div><b>Date:</b> ' + item.OrderDate + ' ' + item.OrderTime + '</div>' +
        '</div>' +
        /*'<div style="width:100px">Order Time: '+item.OrderTime+'</div>'+
        '<div style="width:100px">'+item.ProductType+'</div>'+
        '<div style="width:100px">'+item.IsLive+'</div>'+
        '<div style="width:100px">'+item.Strategyname+'</div>'+*/
        '<div class="col-lg-6-Manual Fit-on-600px Fit-on-400px" style="padding-inline-start:0px;">' +
        '<div class="Fit-Symbol-on-660px">' + finalTradingSymbol + '</div>' +
        '<br />' +
        '<div style="width:33%" class="Display-on-600px"><b>Op:</b>' + item.OrderPrice + '</div>' +
        '<div class="Display-on-600px"><b>CP:</b>' + item.CurrentPositionNew + '</div>' +
        '<div class="Display-on-400px"><b>Qty:</b>' + sQty + '</div>' +

        '<div class="col-lg-6-Manual Watchlist-Active-Trade">' +
        '<div class="Hidden-on-400px"><b>WatchList:</b>' + item.Watchlistname + '&nbsp;|&nbsp;</div>' +
        /*'<div style="width:100px">'+item.Publishname+'</div>'+*/
        '<div class="Hidden-on-400px"><b class="Hidden-on-600px">Fund Manager:</b><b class="Display-on-600px">FM:</b> ' + item.Fundmanagername + '</div>' +
        '</div>' +
        '<div class="col-lg-6-Manual" style="">' +
        '<div class="show-on-400px"><b>WatchList:</b>' + item.Watchlistname + '&nbsp;|&nbsp;</div>' +
        '<div class="show-on-400px" style="left: 89px;"><b>FM:</b>' + item.Fundmanagername + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#tblActiveTradeList').append(html);



    var ProfitIdColor = $('#ActiveLblProfitLoss' + i).text();
    var ProfitIdColor1 = $('#ActiveLblProfitLoss1' + i).text();
    var OrderPriceIdColor = $('#ActiveLblOrderPrice' + i).text();
    var CurrentPositionIdColor = $('#ActivelblCurrentPosition' + i).text();
    var tgtIdColor = $('#ActiveLblTGT' + i).text();
    var tgt2IdColor = $('#ActiveLblTGT2' + i).text();
    var ActiveLblBTNIdColor = $('#ActiveLblBTN' + i);
    var ActiveLblProfitLossLblColor = $('#ActiveLblProfitLoss' + i);
    var ActiveLblProfitLossLblColor1 = $('#ActiveLblProfitLoss1' + i);
    var ActiveLblTGTColor = $('#ActiveLblTGT' + i);


    var OrderPrice = parseFloat(OrderPriceIdColor);
    var CurrentPosition = CurrentPositionIdColor;
    var tgt = parseFloat(tgtIdColor);
    var TGT2 = parseFloat(tgt2IdColor);
    var P_L = parseFloat(ProfitIdColor);
    var ActiveLblBTN = ActiveLblBTNIdColor;
    var ActiveLblProfitLossLbl = ActiveLblProfitLossLblColor;
    var ActiveLblProfitLossLbl1 = ActiveLblProfitLossLblColor1;
    var ActiveLblTGT = ActiveLblTGTColor;

    if (ActiveLblBTN.val() == item.TradeSymbol) {

        if (item.ExpireDays == 0) {
            $(ActiveLblBTN).append('<br /><span style="font-size:10px;color:red;"><b>(Expired)</b></span>')
        }
        else if (item.ExpireDays != 4) {
            $(ActiveLblBTN).append('<br /><span style="font-size:10px;color:red;"><b>(Expires ' + item.ExpireDays + ' days)</b></span>');
        }
    }
    if ((OrderPrice >= tgt && tgt > 0 && CurrentPosition == "Buy") || (OrderPrice <= tgt && tgt > 0 && CurrentPosition == "Sell")) {
        $(ActiveLblProfitLossLbl).css("color", "#14a964");
        $(ActiveLblProfitLossLbl1).css("color", "#14a964");
    }
    if ((OrderPrice >= tgt && tgt > 0 && CurrentPosition == "Buy") || (OrderPrice <= tgt && tgt > 0 && CurrentPosition == "Sell")) {
        $(ActiveLblTGT).css("color", "#14a964");
    }
    if (P_L > 0) {
        $(ActiveLblProfitLossLbl).css("color", "#14a964");
        $(ActiveLblProfitLossLbl1).css("color", "#14a964");
    }
    else {
        $(ActiveLblProfitLossLbl).css("color", "#d83824");
        $(ActiveLblProfitLossLbl1).css("color", "#d83824");
    }

}

//#endregion

$('#btnAddScript').on('click', function () {
    $('#addWatchListName').val("");
    $.ajax({
        url: '/Watchlist/GetWatchlistForTradeIndexPage',
        type: 'Get',
        success: function (data) {
            $('#modalWatchList').html('');
            $('#modalWatchList').append($("<option></option>").val("").html("-Select-"));
            $.each(data, function (i, item) {
                $('#modalWatchList').append($("<option></option>").val(item.WID).html(item.Watchlistname));
            });
        }
    });
    $("#addScriptModal").modal('show');
});


//#region Delete Watchlist
function removeScript(ScriptCode, intWID) {
    var result = confirm("Are you sure you want to delete?");
    if (result && ScriptCode > 0 && intWID > 0) {
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
                   // var table = $('#tblList').DataTable();
                    //table.row($("#btnName" + ScriptCode).parents('tr')).remove().draw(false);
                    toastr.success('Script Deleted Successfully.');
                    GLOBAL_WATCHLIST_ID = $("ul #custom-tabs-one-tab li.nav-item.active a").attr("data-id");
                    GLOBAL_USER_ID = $("#UserID").val();
                    SetTradeData();
                    
                     return false;
                }

            }
        });
    }
}
//#endregion

function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, high = 0, low = 0, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '', TRADING_UNIT_TYPE='') {
    $('.upperClause :input').removeAttr('disabled');
    $('#ActiveTradeOnClick').modal('hide');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#price").removeClass("has-error");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    $("#buySellModel #hdnHigh").val(high);
    $("#buySellModel #hdnLow").val(low);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'Buy';
        if (dataDarkTheme != "NO") {
            $('#buySellModel .modal-title').css("background-color", "var(--main-color-on-layoutchange)");
        }
        else {
            $('#buySellModel .modal-title').css("background-color", "rgb(0, 166, 90)");
        }
        $('#btnProceedBuySell').css({ 'background-color': 'rgb(0, 166, 90)', 'border-color': 'rgb(0, 166, 90)' });
        $('#btnProceedBuySell:hover').css({ 'background-color': 'rgb(0, 166, 90)', 'border-color': 'rgb(0, 166, 90)' });
        $('#btnProceedBuySell').text('Buy');
    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
        if (dataDarkTheme != "NO") {
            $('#buySellModel .modal-title').css("background-color", "var(--main-color-on-layoutchange)");
        }
        else {
            $('#buySellModel .modal-title').css("background-color", "rgb(221, 75, 57)");
        }
        $('#btnProceedBuySell').css({ 'background-color': 'rgb(221, 75, 57)', 'border-color': 'rgb(221, 75, 57)' });
        $('#btnProceedBuySell:hover').css({ 'background-color': 'rgb(221, 75, 57)', 'border-color': 'rgb(221, 75, 57)' });
        $('#btnProceedBuySell').text('Sell');
    }
    $('#dropTradingUnit').html('');
    if (allowedTradingUnit != null) {
        if (allowedTradingUnit.length > 0) {
            var data = allowedTradingUnit.filter(opt => opt.ScriptExchange == ScriptExchange);
            var units = [];
            if (instumentType == "FUT" || instumentType == "CE" || instumentType == "PE") {
                if (instumentType == "FUT") {
                    if (data[0].Future_Trading_Unit_Type == null || data[0].Future_Trading_Unit_Type == '' || data[0].Future_Trading_Unit_Type == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].Future_Trading_Unit_Type.split(",");
                    }
                }
                else {
                    if (data[0].Options_Trading_Unit_Type == null || data[0].Options_Trading_Unit_Type == '' || data[0].Options_Trading_Unit_Type == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].Options_Trading_Unit_Type.split(",");
                    }
                }
            } else {
                if (data[0].Options_Trading_Unit_Type == null || data[0].Options_Trading_Unit_Type == '' || data[0].Options_Trading_Unit_Type == undefined) {
                    units.push(1);
                }
                else {
                    units = data[0].Equity_Trading_Unit_Type.split(",");
                }
            }
            $.each(units, function (i, item) {
                if (item == "0")
                    item = "1";
                $('#dropTradingUnit').append($("<option></option>").val(parseInt(item)).html(item == "1" ? "Lot" : "Qty"));
            });

        } else {
            $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("Lot"));
        }
    }
    else {
        $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("Lot"));
    }
    $("#lblScriptSymbol").text(ScriptSymbol.toString());
    $("#lblScriptCode").text(ScriptCode.toString());
    $("#lblCurrentPosition").text(CurrentPosition);
    $("#WID").val(WID);
    $("#hdnPrice").val(price);
    $("#hdnTradeID").val(TradeID.toString());
    $("#price").val('0');
    $("#TriggerPrice").val(TriggerPrice.toString());
    $("#txtStopLoss").val(SL.toString());
    $("#txtTarget").val(Target.toString());
    $("#Quantity").val(Quantity.toString());
    if (instumentType != 'EQ') {
        $('#rbtnNrml').val('NRML');
        $('#Itype').text('NRML')
    }
    else {
        $('#rbtnNrml').val('CNC');
        $('#Itype').text('CNC')
    }
    if (PriceType.length == 0) {

        var RememberData = localStorage.getItem("RememberTargetStoploss");
        if (RememberData != null) {
            RememberData = JSON.parse(RememberData);
            $("#cbxRememberTargetStoploss").prop('checked', true);
            // $("#txtTarget").val(RememberData.TGT);
            // $("#txtStopLoss").val(RememberData.SL);

            if (RememberData.PRODUCT_TYPE != null && RememberData.PRODUCT_TYPE != '') {
                RememberData.PRODUCT_TYPE == 'MIS' ? $('input[Name=ProductType]#rbtnIntraday').trigger('click') : $('input[Name=ProductType]#rbtnNrml').trigger('click');
            }
            if (RememberData.PRICE_TYPE != null && RememberData.PRICE_TYPE != '') {
                if (RememberData.PRICE_TYPE == 'MARKET') {
                    $('input[Name=MarketType]#rbtnMarket').trigger('click');
                } else if (RememberData.PRICE_TYPE == 'Limit') {
                    $('input[Name=MarketType]#rbtnLimit').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL') {
                    $('input[Name=MarketType]#rbtnSL').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL-M') {
                    $('input[Name=MarketType]#rbtnSLM').trigger('click');
                }
            }
            PriceType = $('input[Name=MarketType]:checked').val();
        }
        else {
            $("input[Name=MarketType]#rbtnMarket").trigger('click');
            $('input[Name=ProductType]#rbtnNrml').trigger('click');
        }
    }
    if (PriceType != null && PriceType != '') {
        if (PriceType == 'MARKET') {
            $('input[Name=MarketType]#rbtnMarket').trigger('click');
        } else if (PriceType == 'Limit') {
            $('input[Name=MarketType]#rbtnLimit').trigger('click');
        }
        else if (PriceType == 'SL') {
            $('input[Name=MarketType]#rbtnSL').trigger('click');
        }
        else if (PriceType == 'SL-M') {
            $('input[Name=MarketType]#rbtnSLM').trigger('click');
        }
    }


    if (ProductType != null && ProductType != '') {
        if (ProductType == 'MIS') {
            //$('#tgtSLDiv').hide();
            //$('#txtTarget').val('0');
            //$('#txtStopLoss').val('0');
            $('#rbtnIntraday').prop('checked', true);
        }
        else {
            $('#tgtSLDiv').show();
        }
    }
    if (sttus == 'COMPLETE')
        $('.upperClause :input').attr('disabled', 'disabled');
    if (TRADING_UNIT_TYPE != '')
        $('#dropTradingUnit option[value=' + TRADING_UNIT_TYPE + ']').attr('selected', 'selected');
    $('#dropTradingUnit').removeAttr('disabled');
    if (sttus == 'Open')
        $('#dropTradingUnit').attr('disabled', 'disabled');

    $('.modal-dialog').draggable({
        handle: ".modal-header"
    });

    $("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);



    

    $('#buySellModel').modal({
        backdrop: false,
        show: true
    });
    marginInterval = setInterval(function () { GetRequiredMargin(); }, 1000);
}


function GetRequiredMargin() {

    var MisOrNot = 0;
    var Size = $("#buySellModel #hdnScriptLotSize").val();
    $('#buySellModel #DivGetLotSize').text(Size);
    var SCode = $("#lblScriptCode").text();
    var Qty = $("#Quantity").val();
    var WalletBalance = $("#WalletBalance");
    var balance = WalletBalance.text();
    var Lp = $('#lblLastPrice').text();
    var intradayradiobutton = document.getElementById('rbtnIntraday');
    var CurrentPosition = $("#lblCurrentPosition").text();
    var ScriptExchange = $("#buySellModel #hdnScriptExchange").val();
    if (intradayradiobutton.checked == true) {
        MisOrNot = 1;
    }

    if (CurrentPosition == 'Buy')
        Lp = $('#lblLastBid').text();
    else
        Lp = $('#lblLastAsk').text();

    if (Lp != '' && Lp != null) {
        var input = "";
        input = { 'ScriptLotSize': Size, 'ScriptCode': SCode, 'quantity': Qty, 'Totalwalletbalance': balance, 'MisOrNot': MisOrNot, 'Lastprice': Lp, 'TRADING_UNIT_TYPE': $("#dropTradingUnit").val(), 'ScriptExchange': ScriptExchange };

        var request = $.ajax({
            url: "/Trade/GetRequiredMargin",
            type: "GET",
            data: input,
            dataType: 'json',
            success: function (data) {
                SetRequiredMargin(data);
            }
        });
    }
}

function SetRequiredMargin(item) {
    if (item.length != null) {
        if (item.length > 0) {
            if (item[0].Requiredmargin > item[0].Availablemargin)
                $('#DivGetAvailableMargin').css('color', 'red');
            else
                $('#DivGetAvailableMargin').css('color', 'green');

            $('#buySellModel #DivGetRequiredMargin').text(item[0].Requiredmargin);
            $('#buySellModel #DivGetAvailableMargin').text(item[0].Availablemargin);
            $('#buySellModel #DivGetUsedMargin').text(item[0].Usedmargin);
        }
        else {
            $('#buySellModel #DivGetRequiredMargin').text(0);
            $('#buySellModel #DivGetAvailableMargin').text(0);
            $('#buySellModel #DivGetUsedMargin').text(0);
        }
    }
}


function ProceedBuySell() {

    if ($("#cbxRememberTargetStoploss").prop('checked') == true) {
        var data = {
            PRODUCT_TYPE: $('input[Name=ProductType]:checked').val(),
            PRICE_TYPE: $('input[Name=MarketType]:checked').val() }
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(data));
    }
    else {
        localStorage.removeItem("RememberTargetStoploss");
    }

    var ScriptCode = $("#lblScriptCode").text();
    var CurrentPosition = $("#lblCurrentPosition").text();
    intWID = $("#WID").val();
    var target = $("#txtTarget").val();
    var stopLoss = $("#txtStopLoss").val();
    var quantity = $("#Quantity").val();
    var ScriptExchange = $("#buySellModel #hdnScriptExchange").val();
    var ScriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    var price = $("#price").val();
    var TriggerPrice = $("#TriggerPrice").val();
    var tradeID = $("#hdnTradeID").val();
    var ProductType = $('input[Name=ProductType]:checked').val();
    var marketType = $('input[Name=MarketType]:checked').val();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        toastr.info("Please enter correct details");
        return;
    }

    // if (ScriptExchange == "NFO") {
    //   var fQty = parseFloat(quantity);

    // var fLotSize = parseFloat(ScriptLotSize);
    //var remainder = fQty % fLotSize;
    //if (remainder > 0) {
    //  $('#Quantity-error').text('Invalid Quantity');
    //$('#Quantity-error').show();
    //$('#btnProceedBuySell').removeAttr('disabled');
    //return;
    //}


    //}
    if (marketType == "SL" || marketType == "SL-M") {
        var oprice = parseFloat(price);
        var tprice = parseFloat(TriggerPrice);
        var hdprice = $('#buySellModel #hdnPrice').val();
        var hdnPrice = parseFloat(hdprice);
        var showError = false;
        var msg = "";

        if (marketType == "SL") {
            if (CurrentPosition == "Sell" && marketType == "SL" && oprice > tprice) {
                showError = true;
                msg = "Trigger price connot be less than order price";
            }
            else if (CurrentPosition == "Buy" && marketType == "SL" && oprice < tprice) {
                showError = true;
                msg = "Trigger price Cannot be higher than order price";
            }
        }
        if (CurrentPosition == "Sell" && tprice > hdnPrice) {
            showError = true;
            msg = "Trigger price Cannot be higher than last price";
        }
        else if (CurrentPosition == "Buy" && tprice < hdnPrice) {
            showError = true;
            msg = "Trigger price connot be less than last price";
        }
        if (showError) {
            toastr.error(msg);
            $('#btnProceedBuySell').removeAttr('disabled');
            return;
        }

    }
    if (marketType == "Limit") {
        var oprice = parseFloat(price);
        var hdprice = $('#buySellModel #hdnPrice').val();
        var hdnPrice = parseFloat(hdprice);
        var showError = false;
        var msg = "";

        if (CurrentPosition == "Sell" && oprice < hdnPrice) {
            showError = true;
            msg = "Limit price Cannot be less than last price";
        }
        else if (CurrentPosition == "Buy" && oprice > hdnPrice) {
            showError = true;
            msg = "Limit price connot be greater than last price";
        }
        if (showError) {
            $("#price").addClass("has-error");
            toastr.error(msg);
            $('#btnProceedBuySell').removeAttr('disabled');
            return;
        }

    }
    var st = $("#hdnSt").val();
    var TRADING_UNIT = $("#dropTradingUnit").val();


    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, price: price, TriggerPrice: TriggerPrice, ProductType: ProductType, MarketType: marketType, TradeID: tradeID, Status: st, TRADING_UNIT: TRADING_UNIT },
            dataType: 'json',
            async: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {

                    HidePopUp();

                    toastr.error(results.TypeName);
                    //  $("#errorModal .modal-body").html('<p class="text-danger">' + results.TypeName + '</p>')
                    //  $("#errorModal").modal('show');
                    return false;
                }
                else {
                    if (tradeID != '0') {
                        toastr.success("Order Updated successfully");
                    }
                    else {
                        toastr.success("Order Placed successfully");
                    }
                    return false;
                }

            }
        });
    }
    SetTradeDataForRefresh();
    HidePopUp();
    $('#btnProceedBuySell').removeAttr('disabled');
}

function HidePopUp() {
    $("#buySellModel").modal('hide');
}
var marketDepthInterval;
function MarketDepthPop(ScriptCode, symbolParam, Lastprice) {
    var htmlString = '<button type="button" class="btn btn-success" onclick="HideDepthModal();$(\'#btnBuy' + ScriptCode + '\').click()">Buy</button>';
    htmlString += '<button type="button" class="btn btn-danger" onclick="HideDepthModal();$(\'#btnSell' + ScriptCode + '\').click()">Sell</button>';
    $("#MarketDepthModal #buySellButtonDiv").html(htmlString);
    $("#MarketDepthModal #lblDepthScriptSymbol").text(symbolParam);
    $("#MarketDepthModal #hdnDepthScriptCode").val(ScriptCode);
    $("#MarketDepthModal #lblDepthLTP").text('(' + Lastprice + ')');
    var request = $.ajax({
        url: "/Trade/_MarketDepth",
        type: "POST",
        data: { ScriptCode: ScriptCode },

        success: function (data) {
            //var results = JSON.parse(data);

            $("#MarketDepthModal .modal-body").html(data)
            //$("#MarketDepthModal").modal('show');
            $('#MarketDepthModal').modal({
                backdrop: false,
                show: true
            });
            $("body").removeClass('modal-open');
            if (dataDarkTheme != "NO") {
                $('#Change-On-Dark-Theme').removeClass('table-striped');
            }
            else {
                $('#Change-On-Dark-Theme').addClass('table-striped');
            }
            marketDepthInterval = setInterval(function () { SetMarketDepthForRefresh(); }, 1000);
            return false;
        }
    });
}
function SetMarketDepthForRefresh() {
    var ScriptCode = $("#MarketDepthModal #hdnDepthScriptCode").val();
    var request = $.ajax({
        url: "/Trade/_MarketDepth",
        type: "POST",
        data: { ScriptCode: ScriptCode },
        async: true,
        success: function (data) {
            //var results = JSON.parse(data);
            $('#MarketDepthModal #lblDepthLTP').text("(" + $("#hdnDepthLTP").val() + ")");
            $("#MarketDepthModal .modal-body").html(data)
            if (dataDarkTheme != "NO") {
                $('#Change-On-Dark-Theme').removeClass('table-striped');
            }
            else {
                $('#Change-On-Dark-Theme').addClass('table-striped');
            }
            return false;
        }
    });
}
function HideDepthModal() {
    window.clearInterval(marketDepthInterval);
    $("#MarketDepthModal").modal('hide');
    $("#MarketDepthModal").empty();
}
var element = document.querySelector('ul.mobile-context-menu-list.list-flat');
var element2 = document.querySelector('#tblWatchListTradeList');
document.body.addEventListener('click', function (event) {
    if (!element.contains(event.target) && !element2.contains(event.target)) {
        $('.mobile-context-menu').css('display', 'none');
    }
});
var element3 = document.querySelector('ul.indecators-ul');
var element4 = document.querySelector('.tachometer');
document.body.addEventListener('click', function (event) {
    if (!element3.contains(event.target) && !element4.contains(event.target)) {
        $('.indecators').css('display', 'none');
    }
});
$("#tblWatchListTradeListBody").delegate('tr', 'click', function () {
    if (screen.width <= 768) {
        mobilebuyBtn = this.cells[0].children[2].children[0].id;
        mobilesellBtn = this.cells[0].children[2].children[1].id;
        mobiledeleteBtn = this.cells[0].children[2].children[2].id;
        mobiledepthBtn = this.cells[0].children[2].children[3].id;
        $('.mobile-context-menu').css('display', 'block');
    }
});

$('.mobileBuyBtn').on('click', function () {
    $("#" + mobilebuyBtn + "").trigger('click');
    $('.mobile-context-menu').css('display', 'none');
});
$('.mobileSellBtn').on('click', function () {
    $("#" + mobilesellBtn + "").trigger('click');
    $('.mobile-context-menu').css('display', 'none');
});
$('.mobileDeleteBtn').on('click', function () {
    $("#" + mobiledeleteBtn + "").trigger('click');
    $('.mobile-context-menu').css('display', 'none');
});
$('.mobileDepthBtn').on('click', function () {
    $("#" + mobiledepthBtn + "").trigger('click');
    $('.mobile-context-menu').css('display', 'none');
});



//#region Market Change Code 
$('input[Name=MarketType]').on('click', function (ele) {
    var value = $(ele.currentTarget).val();
    var priceval = $('#hdnPrice').val();
    var Triggerval = $('#hdnPrice').val();;
    $('#txtTarget').removeAttr('disabled');
    $('#txtTarget').removeAttr('readonly');
    $('#txtStopLoss').removeAttr('disabled');
    $('#txtStopLoss').removeAttr('readonly');
    if (value == 'Limit') {
        $('#buySellModel #price').removeAttr('disabled');
        $('#buySellModel #price').removeAttr('readonly');
        $('#buySellModel #price').val(priceval);
        $('#buySellModel #TriggerPrice').val('0');
        $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
    }
    else if (value == 'SL') {
        $('#buySellModel #price').removeAttr('disabled');
        $('#buySellModel #price').removeAttr('readonly');
        $('#buySellModel #price').val(priceval);
        $('#buySellModel #TriggerPrice').val(Triggerval);
        $('#buySellModel #TriggerPrice').removeAttr('disabled');
        $('#buySellModel #TriggerPrice').removeAttr('readonly');
    }
    else if (value == 'SL-M') {
        $('#buySellModel #TriggerPrice').removeAttr('disabled');
        $('#buySellModel #TriggerPrice').removeAttr('readonly');
        $('#buySellModel #TriggerPrice').val(Triggerval);
        $('#buySellModel #price').val('0');
        $('#buySellModel #price').attr('disabled', 'disabled');
        $('#txtTarget').attr('disabled', 'disabled');
        $('#txtTarget').attr('readonly', 'readonly');
        $('#txtStopLoss').attr('disabled', 'disabled');
        $('#txtStopLoss').attr('readonly', 'readonly');
    }
    else if (value == 'MARKET') {
        $('#buySellModel #price').val('0');
        $('#buySellModel #price').attr('disabled', 'disabled');
        $('#buySellModel #price').attr('readonly', 'readonly');
        $('#buySellModel #TriggerPrice').val('0');
        $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
        $('#buySellModel #TriggerPrice').attr('readonly', 'readonly');
    }
});
//#endregion

$('#saveScript').on('click', function () {
    var selectedWatchlist = $("#modalWatchList").val();
    if (selectedWatchlist != null && selectedWatchlist != "") {
        var Watchlistname = $("#modalWatchList option:selected").text();
        var txtUser = null; //it will fetch logged in user
        var Lot = $("#LotSizeDiv #txtLot").val();
        var size = $("#LotSizeDiv #txtSize").val();
        var ScriptTradingSymbol = $("#txtScript").val();
        var _ScriptExchange = $('#ScriptExchange').val();
        if (ScriptTradingSymbol != null && ScriptTradingSymbol != '' && ScriptTradingSymbol != undefined &&
            _ScriptExchange != null && _ScriptExchange != '') {
            var request = $.ajax({
                url: "/Watchlist/SaveWatchList",
                type: "POST",
                data: { ScriptTradingSymbol: ScriptTradingSymbol, intWID: $("#modalWatchList").val(), Watchlistname: Watchlistname, ScriptExchange: _ScriptExchange, txtUser: txtUser, Lot: Lot, Size: size },
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
                        results.ErrorMessage != "" ? toastr.error(results.ErrorMessage):toastr.error("Something Went Wrong");
                    }
                    else if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                        toastr.success("Script Added Successfully");
                    }
                    $("#addScriptModal").modal('hide');
                    $("#txtScript").val("");
                }
            });
        }

    }
    else {
        toastr.error("Please Select Watchlist");
        $('#modalWatchList').focus();
    }
});
$("#txtScript").autocomplete({
    source: function (request, response) {
        var _ScriptExchange = $('#ScriptExchange').val();
        var _ScriptSegment = "";
        var _ScriptExpiry = "";
        var _ScriptStrike = "";
        $.ajax({
            url: "/Watchlist/GetScriptListWithSegment",
            type: "GET",
            dataType: "json",
            data: { Search: request.term, ScriptExchange: _ScriptExchange, Scriptsegment: _ScriptSegment, Scriptexpiry: _ScriptExpiry, ScriptStrike: _ScriptStrike },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.ScriptTradingSymbol, value: item.ScriptTradingSymbol };
                }));
            }
        });
    },
    messages: {
        noResults: "", results: ""
    },
    minLength: 2,
    select: function (event, ui) {
        $(this).val(ui.item.value);
        var script_Trading_Symbol = $("#txtScript").val();
        var SelectedscriptExchange = $('#ScriptExchange').val();
        var lotsize = 0;
        if (SelectedscriptExchange != "NSE" && SelectedscriptExchange != "BSE" && SelectedscriptExchange != "") {
            $.ajax({
                url: "/Watchlist/GetScriptLotSize",
                type: "GET",
                dataType: "json",
                data: { ScriptTradingSymbol: script_Trading_Symbol, ScriptExchange: SelectedscriptExchange },
                success: function (data) {
                    $("#txtSize").val(data.Lot);
                    lotsize = data.Lot;
                    $("#txtLot").prop('readonly', true);
                    $("#txtSize").prop('readonly', true);
                }
            });
            $("#LotSizeDiv").show();
        }
        else {
            $("#LotSizeDiv").hide();
        }
    }
});
$('.keyboard').on('click', function () {
    $('#keyBoardHelpModal').modal('show');
});
$('.tachometer').on('click', function () {
    $('.indecators').css('display', 'block');
});

$('.ActiveTradeClick1').on('click', function () {
    $('.ActiveTradeClick').click();
});
$('.ActiveTradeClick').on('click', function () {
    $('.modal-dialog').draggable({
        handle: ".modal-header"
    });
    setScreenHover();
    $('#ActiveTradeOnClick').modal('show');
});



function ActiveTradePaginationDestroy() {
    $('#ActiveTradePagination').empty();
    $('#ActiveTradePagination').removeData("twbs-pagination");
    $('#ActiveTradePagination').unbind("page");
}
function SetActiveTradePagination() {
    $('#ActiveTradePagination').twbsPagination({
        totalPages: _ActiveTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_ActiveCallBack)
                _ActiveCurrentPageNo = page;

            else
                _ActiveCallBack = true;

           
        }
    });
}

$("#btnMoreInfoCompletedTrade").on('click', function () {
    SetCompletedTradeModalData();
    $("#CompletedTradeModal").modal('show');
});
$("#btnMoreInfoCompletedTrade2").on('click', function () {
    SetCompletedTradeModalData();
    $("#CompletedTradeModal").modal('show');
});


function SetCompletedTradeModalData() {

    try {
        var WID = $("#watchlistHiddenId").val();


        var selectedScriptExchange = $("#cboScriptExchange option:selected").val();

        var input = "";
        if ($('#rdAll').prop('checked') == true) {
            input = { 'tradetype': 0, 'WID': WID, 'scriptExchangeType': selectedScriptExchange, 'CompletedListPage': _CompletedCurrentPageNo };
        }
        else if ($('#rdLive').prop('checked') == true) {
            input = { 'tradetype': 1, 'WID': WID, 'scriptExchangeType': selectedScriptExchange, 'CompletedListPage': _CompletedCurrentPageNo };
        }
        else {
            input = { 'tradetype': 2, 'WID': WID, 'scriptExchangeType': selectedScriptExchange, 'CompletedListPage': _CompletedCurrentPageNo };
        }
        var request = $.ajax({
            url: "/Trade/SetCompletedTradeData",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,

            success: function (data) {
                var results = JSON.parse(data);
                if (results != null) {
                    var tblCompletedTradeList = $('#tblCompletedTradeList').DataTable();
                    tblCompletedTradeList.clear().draw();
                    tblCompletedTradeList.innerHTML = "";
                    if (results.CompletedTrade != null && results.CompletedTrade.length > 0) {
                        var _CheckCurrentPage;

                        for (var i = 0; i < results.CompletedTrade.length; i++) {
                            _CompletedTotalPageNo = results.CompletedTrade[1].Total_Page;
                            _CheckCurrentPage = results.CompletedTrade[i].Total_Page;
                            var result = results.CompletedTrade[i];
                            SetCompletedTradeTableDetails(result);
                            $('#CompletedTradeModal td:first-child').addClass('CompletedTradeModal_First_Td');
                            //    BindClick();
                            //    bindHideClick();
                        }
                        if (_CompletedPreviousTotalPageNo != _CheckCurrentPage) {
                            CompletedPaginationDestroy();
                        }
                        if (results.CompletedTrade.length > 0) {
                            _CompletedPreviousTotalPageNo = results.CompletedTrade[0].Total_Page;
                        }
                        else {
                            _CompletedPreviousTotalPageNo = 1;
                        }
                        SetCompletedPagination();
                        $('#CompletedPagination').removeData("tblCompletedTradeList_paginate");
                    }
                }
                var data = localStorage.getItem('IsDark');
                if (data == 'NO' || data == null || data == '') {
                    $('.input-sm').removeClass('textBox-color-change');
                }
                else
                    if (data == 'YES') {
                        $('.input-sm').addClass('textBox-color-change');
                    }

            }
        });

    } catch (e) {
        alert("Error On SetTradeData.");
    }

}
function SetCompletedPagination() {
    $('#CompletedPagination').twbsPagination({
        totalPages: _CompletedTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_CompletedCallBack) {
                _CompletedCurrentPageNo = page;
                SetCompletedTradeModalData();
            }
            else
                _CompletedCallBack = true;

            
        }
    });
}
function CompletedPaginationDestroy() {
    $('#CompletedPagination').empty();
    $('#CompletedPagination').removeData("twbs-pagination");
    $('#CompletedPagination').unbind("page");
}
function SetCompletedTradeTableDetails(item) {
    var Completedtradeid = '\'' + item.Completedtradeid + '\'';

    if (item.Status == "TGT2")
        item.Status = "TARGET";
    else if (item.Status == "TGT3")
        item.Status = "TARGET2";
    else if (item.Status == "TGT4")
        item.Status = "TARGET3";
    else if (item.Status == "SL")
        item.Status = "STOPLOSS";
    var BtnClick = '<a href="javascript:void(0)" id="GetCompletedTradeDetail" onclick="ShowDetails(this)" data-bind=' + item.Completedtradeid + ' ><i class="fa fa-info-circle"></i> </a> ' +
        ' <a href="javascript:void(0)" class="hideTranDetailRow" onclick="HideDetails(this)"  style = "margin-left: 15px;font-size:15px;display:none;" ><i class="fa fa-arrow-circle-up"></i></a> <p style="margin-left: 10px;">  ' + item.Completedtradeid + '</p> ';

    var finalTradingSymbol = "";
    if (item.Scripttype == "FOREX") {
        finalTradingSymbol = item.TradeSymbol + " / " + item.Scriptsegment;
    }
    else {
        finalTradingSymbol = item.TradeSymbol;
    }
    var Companyinitials = $("#CompanyInitial").val();

    var sQty = item.Qty;
    if (item.ScriptLotSize > 1 && item.ScriptExchange != 'NFO' && isLiveOrder != "False")
        sQty = item.Qty / item.ScriptLotSize;

    buttons: [
        'copy', 'excel', 'pdf'
    ]

    var comptable = $('#tblCompletedTradeList').DataTable().row.add([
        BtnClick,
        finalTradingSymbol,
        sQty,
        item.Profitorloss,
        item.Entrytime,
        item.CurrentPosition,
        item.Status
    ]).order([0, 'desc']).draw();
    var ctable = document.getElementById("tblCompletedTradeList");
    for (var i = 0; i < ctable.rows.length; i++) {
        var Status = $(ctable.rows[i].cells[6]).text();
        if (Status == "TARGET" || Status == "TARGET2" || Status == "TARGET3") {
            $(ctable.rows[i].cells[6]).css("background-color", "#14a964");
            $(ctable.rows[i].cells[6]).css("color", "white");
        }
        if (Status == "STOPLOSS") {
            $(ctable.rows[i].cells[6]).css("background-color", "#d83824");
            $(ctable.rows[i].cells[6]).css("color", "white");
        }
        var profitLoss = $(ctable.rows[i].cells[3]).text();
        if (parseFloat(profitLoss) >= 0) {
            $(ctable.rows[i].cells[3]).css("background-color", "#14a964");
            $(ctable.rows[i].cells[3]).css({ "color": "white", "font-weight": "bold" });
        }
        else if (parseFloat(profitLoss) < 0) {
            $(ctable.rows[i].cells[3]).css("background-color", "#d83824");
            $(ctable.rows[i].cells[3]).css({ "color": "white", "font-weight": "bold" });
        }
    }
}
function ShowDetails(data) {
    $(".hideTranDetailRow").hide();
    var tr = $(data).closest('tr');
    var upButton = $(tr).find('.hideTranDetailRow');
    $(upButton).show();
    var data = $(data).data('bind');
    var request = $.ajax({
        url: "/Trade/SetCompletedTradeDetailData?Completedtradeid=" + data,
        type: "GET",
        async: true,
        success: function (data) {
            if (data != null) {
                $("#TranDetail").remove();
                $(data).insertAfter(tr);
            }
        }
    });

}
function BindClick() {
    $('#GetCompletedTradeDetail').bind('click', function () {

        $(".hideTranDetailRow").hide();
        var tr = $(this).closest('tr');
        var upButton = $(tr).find('.hideTranDetailRow');
        $(upButton).show();
        var TransactionId = $(this).data('bind');
        var request = $.ajax({
            url: "/Trade/SetCompletedTradeDetailData?Completedtradeid=" + TransactionId,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    $("#TranDetail").remove();
                    $(data).insertAfter(tr);
                }
            }
        });
    });
}
$('.SqrOffAllBtn').on('click', function () {
    var result = confirm("Are You Sure You Want To Sqr-Off All Trades ?");
    if (result) {
        window.location.href = "/Trade/SqrOffAll";
    }
});
function bindHideClick() {
    $(".hideTranDetailRow").bind('click', function () {
        $(this).css("display", "none");
        $("#TranDetail").remove();
    });
}
function HideDetails(data) {
    $(data).css("display", "none");
    $("#TranDetail").remove();
}
var sqModal = $("#sqOfModal");
function SquareOff(id, param, st, Qty, isManualStaratgy) {

    $(sqModal).find(".sqMsg").text('');
    $(sqModal).find("input[Name=sqQty]").val(Qty);
    $(sqModal).find("input[Name=hdQty]").val(Qty);
    $(sqModal).find("input[Name=sqActiveTradeID]").val(id);
    $(sqModal).find("input[Name=sqStatus]").val(st);
    $(sqModal).find("input[Name=sqParam]").val(param);
    $('#ActiveTradeOnClick').modal('hide');
    if (isManualStaratgy) {
        $(sqModal).modal('show');
    }
    else if (confirm("Are you sure to square off?")) {
        ProceedSqOf();
    }
}

function ProceedSqOf() {
    $(sqModal).find(".sqMsg").text('');
    var sqQty = $(sqModal).find("input[Name=sqQty]").val();
    var initQty = $(sqModal).find("input[Name=hdQty]").val();
    var intQty = 0;
    if (sqQty != '' && sqQty != '0') {
        intQty = parseInt(sqQty, 10);
        if (intQty > parseInt(initQty, 10)) {
            $('#btnProceedSquareOff').removeAttr('disabled');
            $(sqModal).find(".sqMsg").text('Invalid Qty');
            return false;
        }
    }
    else {
        $('#btnProceedSquareOff').removeAttr('disabled');
        $(sqModal).find(".sqMsg").text('Invalid Qty');
        return false;
    }
    var id = $(sqModal).find("input[Name=sqActiveTradeID]").val();
    var st = $(sqModal).find("input[Name=sqStatus]").val();
    var param = $(sqModal).find("input[Name=sqParam]").val();
    var request = $.ajax({
        url: "/Trade/ManageTradeSquareOff",
        type: "POST",
        data: { ID: id, actionParam: param, Status: st, Qty: intQty },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 0) {
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {
                toastr.success(results.exceptionDTO.Msg);
            }
            SetTradeData();

            return false;
        }
    });
    $('#btnProceedSquareOff').removeAttr('disabled');
    $(sqModal).modal('hide');
}
function DeleteRejectedTrade(data) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/DeleteRejectedTrade?ID=" + data,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                }
                SetTradeDataForRefresh();
            }
        });
    }
}

var convertMisToCncModal = $("#convertMisToCncModal");

function ConvertMISToCNC() {
    var id = $(convertMisToCncModal).find("input[Name=convertActiveTradeID]").val();
    var st = $(convertMisToCncModal).find("input[Name=convertStatus]").val();
    var param = $(convertMisToCncModal).find("input[Name=convertParam]").val();
    var intQty = $(convertMisToCncModal).find("input[Name=hdQty]").val();
    var request = $.ajax({
        url: "/Trade/ConvertMisToCnc",
        type: "POST",
        data: { ID: id, actionParam: param, Status: st, Qty: intQty },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            toastr.success(results.exceptionDTO.Msg);
            //  $("#errorModal .modal-body").html('<p class="text-success">' + results.exceptionDTO.Msg + '</p>');
            //  $("#errorModal").modal('show');
            return false;
        }
    });
    $('#btnconvertMisToCnc').removeAttr('disabled');
    $(convertMisToCncModal).modal('hide');
}

function convertButton(id, param, st, Qty, isManualStaratgy) {
    //$(convertMisToCncModal).find(".convertMsg").text('Are you sure to convert MIS to CNC?');
    $(convertMisToCncModal).find("input[Name=convertQty]").val(Qty);
    $(convertMisToCncModal).find("input[Name=hdQty]").val(Qty);
    $(convertMisToCncModal).find("input[Name=convertActiveTradeID]").val(id);
    $(convertMisToCncModal).find("input[Name=convertStatus]").val(st);
    $(convertMisToCncModal).find("input[Name=convertParam]").val(param);
    if (isManualStaratgy)
        $(convertMisToCncModal).modal('show');
    else if (confirm("Are you sure to square off?"))
        ConvertMISToCNC();
}



//ActiveTradeMouseMove
function setScreenHover() {
    if (window.innerWidth > 768) {
        setScreenHoverwidth768();
        //$('setScreenHoverwidth767();').prop('disabled',true);
    }
    else {
        setScreenHoverwidth767();
        //$('setScreenHoverwidth768();').prop('disabled',true);
    }
}
function setScreenHoverwidth768() {
    $(document).ready(function () {
        $(document).on('mouseenter', '.div-button-hover',
            function () {
                $(this).find(".Show-Button-On-Hover").css('display', 'flex');
            }).on('mouseleave', '.div-button-hover', function () {
                $(this).find(".Show-Button-On-Hover").hide();
            });
    });
    $(document).ready(function () {
        $(document).on('mouseenter', '.div-button-hover',
            function () {
                $(this).find(".Hide-Label-On-Hover").hide();
            }).on('mouseleave', '.div-button-hover', function () {
                $(this).find(".Hide-Label-On-Hover").show();
            });
    });
    $(document).ready(function () {
        $(document).on('mouseenter', '.div-button-hover',
            function () {
                $(this).find(".Show-Additional-Information").show();
            }).on('mouseleave', '.div-button-hover', function () {
                $(this).find(".Show-Additional-Information").hide();
            });
    });
}
function activeonclick(data) {
    $(data).find(".Show-Button-On-Hover").css('display', 'flex');
    ActiveTradeShow = $(data).find('.Show-Button-On-Hover').attr('data-ActiveId');
    $(data).find(".Hide-Label-On-Hover").hide();
    $(data).find(".Show-Additional-Information").show();
}
function setScreenHoverwidth767() {

    $(document).ready(function () {
        $(document).on('click', '.div-button-hover',
            function () {
                activeonclick(this);
            });
    });
}

$('.list-unstyled >li >a').on('click', function () {
    SwitchData();
});

function NextPageDisable() {
    $('#WatchListNextPageShow').css({ cursor: 'no-drop' });
}
function PrevPageDisable() {
    $('#WatchListPrevPageShow').css({ cursor: 'no-drop' });
}
function NextPageEnable() {
    $('#WatchListNextPageShow').css({ cursor: 'pointer' });
}
function PrevPageEnable() {
    
    $('#WatchListPrevPageShow').css({ cursor: 'pointer' });
}


function SetTradeData() {
    try {
        var input = "";
        var WidWatchlist = GLOBAL_WATCHLIST_ID;
        if ($('#rdAll').prop('checked') == true) {
            input = { 'tradetype': 0, 'WID': WidWatchlist, 'searchedData': $('#searchText').val() };
        }
        else if ($('#rdLive').prop('checked') == true) {
            input = { 'tradetype': 1, 'WID': WidWatchlist, 'searchedData': $('#searchText').val() };
        }
        else {
            input = { 'tradetype': 2, 'WID': WidWatchlist, 'searchedData': $('#searchText').val() };
        }
        var request = $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: input,
            dataType: 'json',
            traditional: true,
            success: function (data) {
                setWatchlistData(data);
            }
        });

    } catch (e) {
        alert("Error On SetTradeData. 1")
    }
}
function setWatchlistData(d) {
    var results = JSON.parse(d);
    var tblWatchTradeList = $('#tblWatchListTradeList').DataTable(
    );
    tblWatchTradeList.clear().draw();
    tblWatchTradeList.innerHTML = "";
    if (results.objLstWatchList != null) {
        if (results.objLstWatchList.length > 0) {
            var _CheckPage;
            for (var i = 0; i < results.objLstWatchList.length; i++) {
                _WatchlistTotalPageNo = results.objLstWatchList[i].Total_Page;
                _WatchListLength = results.objLstWatchList.length;
                _CheckPage = results.objLstWatchList[i].Total_Page;
                var result = results.objLstWatchList[i];
                Current_Loop_Valueof_Watchlist = i;
                SetWatchTradeDetails(result);
            }
            if (_WatchlistCurrentTabIndex > 0) {
                $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
            }
        }
    }
}
//#region Get Active Trade Status For Every Second
function SetActiveTradeStatus() {
    //debugger
    try {
        var request = $.ajax({
            url: "/Trade/GetOrderExceptionListAndActiveTradeForRefresh",
            type: "GET",
            dataType: 'json',
            async: true,
            success: function (data) {
                SetActiveTradeStatusDetail(data);
            }
        });
    } catch (e) {
        alert(e)
    }
}
function SetActiveTradeStatusDetail(data) {
    var results = JSON.parse(data);
    if (results != null) {
        if (results > 0) {
            if (results.OrderExceptionList.length > 0) {
                var html = '<table class="table table-bordered table-striped" id="exceptionsTable"><thead><tr><th>TradingSymbol</th><th>Quantity</th><th>price</th><th>BuyOrSell</th><th>Message</th></tr></thead><tbody>';
                for (var i = 0; i < results.OrderExceptionList.length; i++) {
                    html += '<tr><td>' + results.OrderExceptionList[i].Tradingsymbol + '</td><td>' + results.OrderExceptionList[i].Quantity + '</td><td>' + results.OrderExceptionList[i].price + '</td><td>' + results.OrderExceptionList[i].TransactionType + '</td><td>' + results.OrderExceptionList[i].Message + '</td></tr>';
                }
                html += '</tbody></table>';
                $("#errorModal .modal-body").html(html);
                $("#errorModal").modal('show');
            }
        }
        if (results.ActiveTradeStatus != null) {
            if (results.ActiveTradeStatus.length > 0) {
                RefreshActiveTrade(results.ActiveTradeStatus);
            }
        }
    }
}
function RefreshActiveTrade(Data) {
    SetTradeDataForRefresh();
}

function SetTradeDataForRefresh() {
    try {
        var WID = $("#watchlistHiddenId").val();
        var selectedScriptExchange = $("#cboScriptExchange option:selected").val();

        var input = "";
        if ($('#rdAll').prop('checked') == true) {
            input = { 'tradetype': 0, 'WID': WID, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo };
        }
        else if ($('#rdLive').prop('checked') == true) {
            input = { 'tradetype': 1, 'WID': WID, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo };
        }
        else {
            input = { 'tradetype': 2, 'WID': WID, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo };
        }

        var request = $.ajax({
            url: "/Trade/SetTradeData",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (data) {
                SetResult(data);
            }
        });

    } catch (e) {
        alert("Error On SetTradeData.2")
    }
}

function SetWalletBalance() {
    var request = $.ajax({
        url: "/Admin/GetBalance",
        type: "GET",
        dataType: 'json',
        async: true,
        success: function (data) {
            $(".TotalWalletBalance>h3").text(data.amount);
        }
    });
}
function SetResult(data) {
    //debugger;
    var results = JSON.parse(data);

    if (results != null) {
        $('#tblActiveTradeList').html('');
        //Set data for active trade
        var _CheckActiveCurrentPage;
        if (results.ActiveTrade.length > 0) {
            for (var i = 0; i < results.ActiveTrade.length; i++) {
                var result = results.ActiveTrade[i];
                _ActiveTotalPageNo = results.ActiveTrade[i].Total_Page;
                _CheckActiveCurrentPage = results.ActiveTrade[i].Total_Page;
                SetActiveTradeDetails(result);
            }
        }

        else {
            _ActiveTotalPageNo = 1;
            _CheckActiveCurrentPage = 0;

        }
        if (_ActivePreviousTotalPageNo != _CheckActiveCurrentPage) {
            ActiveTradePaginationDestroy();
        }

        if (results.ActiveTrade.length > 0) {
            _ActivePreviousTotalPageNo = results.ActiveTrade[0].Total_Page;
        }
        else {
            _ActivePreviousTotalPageNo = 1;
        }
        SetActiveTradePagination();

        $('.TotalActiveTradeProfitOrLoss > h3').text(results.TotalActiveTradeProfitOrLoss);
        $('.TotalActiveTrade > h3').text(results.TotalActiveTradeCount);
        $('.TotalCompletedTrade > h3').text(results.TotalCompletedTradeCount);
        $('.TotalCompletedTradeProfitOrLoss > h3').text(results.TotalCompletedTradeProfitOrLoss);
        if (results.TotalActiveTradeProfitOrLoss >= 0) {
            $('.dvTotalActiveTradeProfitOrLoss').addClass("bg-green");
            $('.dvTotalActiveTradeProfitOrLoss').removeClass("bg-red");
        }
        else {
            $('.dvTotalActiveTradeProfitOrLoss').addClass("bg-red");
            $('.dvTotalActiveTradeProfitOrLoss').removeClass("bg-green");
        }

        if (results.TotalCompletedTradeProfitOrLoss >= 0) {
            $('.dvTotalCompletedTradeProfitOrLoss').addClass("bg-green");
            $('.dvTotalCompletedTradeProfitOrLoss').removeClass("bg-red");
        }
        else {
            $('.dvTotalCompletedTradeProfitOrLoss').addClass("bg-red");
            $('.dvTotalCompletedTradeProfitOrLoss').removeClass("bg-green");
        }
        if (results.OrderExceptionList != null) {
            if (results.OrderExceptionList.length > 0) {
                var html = '<table class="table table-bordered table-striped" id="exceptionsTable"><thead><tr><th>TradingSymbol</th><th>Quantity</th><th>price</th><th>BuyOrSell</th><th>Message</th></tr></thead><tbody>';
                for (var i = 0; i < results.OrderExceptionList.length; i++) {
                    html += '<tr><td>' + results.OrderExceptionList[i].Tradingsymbol + '</td><td>' + results.OrderExceptionList[i].Quantity + '</td><td>' + results.OrderExceptionList[i].price + '</td><td>' + results.OrderExceptionList[i].TransactionType + '</td><td>' + results.OrderExceptionList[i].Message + '</td></tr>';
                }
                html += '</tbody></table>';
                $("#errorModal .modal-body").html(html);
                $("#errorModal").modal('show');
            }
        }
        if (ActiveTradeShow != null && ActiveTradeShow != '' && ActiveTradeShow.length > 0) {
            $(".Show-Button-On-Hover." + ActiveTradeShow).css('display', 'flex');
            $(".Hide-Label-On-Hover." + ActiveTradeShow).hide();
            $(".Show-Additional-Information." + ActiveTradeShow).show();
        }
    }

}
var addQtyModal = $("#addQtyModal");
function AddQty(id, param, st, BuyOrSell) {
    $(addQtyModal).find(".sqMsg").text('');
    $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
    $(addQtyModal).find("input[Name=sqActiveTradeID]").val(id);
    $(addQtyModal).find("input[Name=sqStatus]").val(st);
    $(addQtyModal).find("input[Name=BuyOrSell]").val(BuyOrSell);
    $(addQtyModal).find("input[Name=sqParam]").val(param);
    $(addQtyModal).find("input[Name=sqQty]").val('1');
    $(addQtyModal).modal('show');
}
function ProceedAddQty() {
    $(addQtyModal).find(".sqMsg").text('');
    var sqQty = $(addQtyModal).find("input[Name=sqQty]").val();

    var intQty = 0;
    if (sqQty != '' && sqQty != '0') {
        intQty = parseInt(sqQty, 10);

    }
    else {
        $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
        $(addQtyModal).find(".sqMsg").text('Invalid Qty');
        return false;
    }
    var id = $(addQtyModal).find("input[Name=sqActiveTradeID]").val();
    var st = $(addQtyModal).find("input[Name=sqStatus]").val();
    var param = $(addQtyModal).find("input[Name=sqParam]").val();
    var buy_sell = $(addQtyModal).find("input[Name=BuyOrSell]").val();
    var request = $.ajax({
        url: "/Trade/AddQtyToActiveTrade",
        type: "POST",
        data: { ID: id, actionParam: param, Status: st, Qty: intQty, BuyOrSell: buy_sell },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 0) {
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {
                toastr.success(results.exceptionDTO.Msg);

            }


            return false;
        }
    });
    $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
    $(addQtyModal).modal('hide');
}