var intervalSensexNifty;
var intervalWatchList;
var isShowDepthModal;
var LastPriceDictionary = [];
var marginInterval = "";
var allowedTradingUnit;
//#region Get Sensex And Nifty Data
function FavoriteWatchlist() {
    $.ajax({
        url: '/Trade/SetFavoriteWatchlistData',
        type: 'GET',
        success: function (data) {
            if (data != null) {
                var result = JSON.parse(data);
                if (result.objLstWatchList.length > 0) {
                    for (var i = 0; i < result.objLstWatchList.length; i++) {
                        var PerChange = parseFloat(result.objLstWatchList[i].Lastprice) - parseFloat(result.objLstWatchList[i].close);
                        var perCentageHtml = "";
                        var perCentage = "";
                        if (PerChange < 0) {
                            perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                            perCentageHtml = '<i class="fa fa-angle-down percentage-down">&nbsp' + perCentage.toFixed(2) + '</i>';
                        }
                        else if (PerChange >= 0) {
                            perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                            perCentageHtml = '<i class="fa fa-angle-up percentage-up">&nbsp' + perCentage.toFixed(2) + '</i>';
                        }
                        if (i == 0) {
                            $('.favorite1').html('<span class="sensex">' + result.objLstWatchList[0].ScriptTradingSymbol + ' </span><span class="sensex-price"> ' + result.objLstWatchList[0].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</span>');
                        }
                        if (i == 1) {
                            $('.favorite2').html('<span class="nifty">' + result.objLstWatchList[1].ScriptTradingSymbol + '</span><span class="nifty-price"> ' + result.objLstWatchList[1].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</span>');
                        }
                    }
                }
            }
        },
        error: function (error) {
        }
    });
}
$('#btnHideModalDepth').on('click', function () {
    window.clearInterval(marketDepthInterval);
    $("#MarketDepthModal").modal('hide');
});
//#endregion

//#region Get Sensex And Nifty Data
function FavoriteWatchlist2() {
    $.ajax({
        url: '/Trade/SetFavoriteWatchlistData2',
        type: 'GET',
        success: function (data) {
            if (data != null) {
                var result = JSON.parse(data);
                if (result.objLstWatchList.length > 0) {
                    for (var i = 0; i < result.objLstWatchList.length; i++) {
                        var PerChange = parseFloat(result.objLstWatchList[i].Lastprice) - parseFloat(result.objLstWatchList[i].close);
                        var perCentageHtml = "";
                        var perCentage = "";
                        if (PerChange < 0) {
                            perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                            perCentageHtml = '<i class="fa fa-angle-down percentage-down">&nbsp' + perCentage.toFixed(2) + '</i>';
                        }
                        else if (PerChange >= 0) {
                            perCentage = (parseFloat(PerChange) / parseFloat(result.objLstWatchList[i].close)) * 100;
                            perCentageHtml = '<i class="fa fa-angle-up percentage-up">&nbsp' + perCentage.toFixed(2) + '</i>';
                        }
                        if (i == 0) {
                            $('.favorite1').html('<span class="sensex">' + result.objLstWatchList[0].ScriptTradingSymbol + ' </span><span class="sensex-price"> ' + result.objLstWatchList[0].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</span>');
                        }
                        if (i == 1) {
                            $('.favorite2').html('<span class="nifty">' + result.objLstWatchList[1].ScriptTradingSymbol + '</span><span class="nifty-price"> ' + result.objLstWatchList[1].Lastprice + '&nbsp&nbsp ' + perCentageHtml + '</span>');
                        }
                    }
                }
            }
        },
        error: function (error) {
        }
    });
}
$('#btnHideModalDepth').on('click', function () {
    window.clearInterval(marketDepthInterval);
    $("#MarketDepthModal").modal('hide');
});
//#endregion
$(document).ready(function () {
    allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val());
    var Companyinitials = $("#CompanyInitial").val();
    intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
    if (Companyinitials == "ME" || Companyinitials == "ASR") {
        intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist2(); }, 1000);
    } else {
        intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist(); }, 1000);
    }
    var IsOneClickEnabled = localStorage.getItem("IsOneClickEnabled");
    if (IsOneClickEnabled == "1") {
        $('#cbxOneClick').prop('checked', true);
    }
    else {
        $('#cbxOneClick').prop('checked', false);
    }

    if (Companyinitials == "BOB") {
        $("#autoBinanceSLTrailDv").show();
    }
    $(document).on('click', '.card-body', function () {
        $("#" + $(this).attr('id') + "").trigger('click');
    });
    $("#cbxOneClick").click(function () {
        if ($("#cbxOneClick").prop('checked') == true) {
            localStorage.setItem("IsOneClickEnabled", "1");
        }
        else {
            localStorage.setItem("IsOneClickEnabled", "0");
        }
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
            };
            recognition.onerror = function (e) {
                recognition.stop();
                $("#microphone").modal('hide');
            };
        }
        else {
            toastr.error("Your Browser Does Not Support's This Feature.");
        }
    });
    //#endregion Voice Recognition
});
function SetTradeDataForRefresh() {
    try {
        var WID = $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id");
        var selectedScriptExchange = $("#cboScriptExchange option:selected").val();
        var input = { 'WID': WID, 'scriptExchangeType': "", 'searchedData': $("#searchText").val() };
        var request = $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (data) {
                SetResult(data);
            }
        });

    } catch (e) {
        alert("Error On SetTradeData.");
    }
}
function SetResult(data) {
    var results = JSON.parse(data);
    if (results != null) {
        if (results.objLstWatchList != null) {
            //Set data for WatchList trade
            if (results.objLstWatchList.length > 0) {
                $('#watchlistDiv').html('');

                for (var i = 0; i < results.objLstWatchList.length; i++) {
                    var result = results.objLstWatchList[i];
                    SetWatchTradeDetails(result);
                }
            }
            else {
                $('#watchlistDiv').html('');

            }
        }
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
}
//#region Set Watch List Data
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
    var LastAskHtml = "";
    if (parseFloat(item.Ask) > PreviousAskPrice) {
        LastAskHtml = '<div class="green" style="background: #264bfd;padding: 5px;color: #fff;width:68px;">' + item.Ask + '</div>';
    }
    if (parseFloat(item.Ask) < PreviousAskPrice) {
        LastAskHtml = '<div class="red" style="background: #ff4a4a;padding: 5px;color: #fff;width:68px;">' + item.Ask + '</div>';
    }
    if (item.Ask == PreviousAskPrice) {
        LastAskHtml = '<div class="green" style="background: #264bfd;padding: 5px;color: #fff;width:68px;">' + item.Ask + '</div>';
    }
    var LastBidHtml = "";
    if (parseFloat(item.Bid) > PreviousBidPrice) {
        LastBidHtml = '<div class="green" style="background: #264bfd;padding: 5px;color: #fff;width:68px;">' + item.Bid + '</div>';
    }
    if (parseFloat(item.Bid) < PreviousBidPrice) {
        LastBidHtml = '<div class="red" style="background: #ff4a4a;padding: 5px;color: #fff;width:68px;">' + item.Bid + '</div>';
    }
    if (item.Bid == PreviousBidPrice) {
        LastBidHtml = '<div class="green" style="background: #264bfd;padding: 5px;color: #fff;width:68px;">' + item.Bid + '</div>';
    }
    var LastPriceHtml = "";
    if (parseFloat(item.Lastprice) > PreviousLastPrice) {
        LastPriceHtml = '<span class="lp" style="color:#264bfd" >' + item.Lastprice + '</span>';
        LastColor = 'green';
    }
    if (parseFloat(item.Lastprice) < PreviousLastPrice) {
        LastPriceHtml = '<span class="lp" style="color:#ff4a4a;" >' + item.Lastprice + '</span>';
        LastColor = 'red';
    }
    if (item.Lastprice == PreviousLastPrice) {
        LastPriceHtml = '<span class="lp" style="color:#264bfd">' + item.Lastprice + '</span>';
    }
    var btnName = 'btn';
    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = parseFloat(item.Lastprice) - parseFloat(item.close);
    var perCentageHtml = "";
    var perCentage = "";
    if (PerChange < 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        perCentageHtml = '<i style="color:#ff4a4a;font-weight:bold;font-size: 15px;" class="fa fa-angle-down">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
    }
    else if (PerChange >= 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.Scripttype == "BINANCE") {
            perCentage = item.PerChange;
        }
        perCentageHtml = '<i style="color:#264bfd;font-weight:bold;font-size: 15px;" class="fa fa-angle-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
    }
    var Qty = 1;
    //if (item.ScriptExchange == "NFO")
    //Qty = item.ScriptLotSize;
    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var btnMarketDepth = "btnMarketDepth" + item.ScriptCode;
    var btnDeleteid = "btnDelete" + item.ScriptCode;
    var deleteButton = ' <button id="' + btnDeleteid + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ';
    var buyButton = '<div tabindex="-1" style="display:none;" class="b-btn"><button id="' + btnBuyid + '" onclick="buySellPopUp(' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.Lastprice  + ')" type="button" class="btn btn-success btn-sm btn-Buy">B </button> ';
    var sellButton = '<button id="' + btnSellid + '" onclick="buySellPopUp(' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.Lastprice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + Qty + ',' + item.ScriptLotSize + ',' + item.Lastprice  + ')" type="button" class="btn btn-danger btn-sm btn-Sell"> S </button> ';
    var marketDepthButton = ' <button id="' + btnMarketDepth + '" class="btn btn-primary btn-sm btn-depth" onclick="MarketDepthPop(' + item.ScriptCode + ',' + script_Trading_Symbol + ',' + item.Lastprice + ')" type="button" style="background-color:mediumvioletred;border:1px solid mediumvioletred;"><i class="fa fa-bars"></i></button> </div>';
    var actionButton = buyButton + sellButton + deleteButton + marketDepthButton;
    var Scriptexpiry = "";
    if (item.Scriptexpiry != "") {
        var date = item.Scriptexpiry.split(" ");
        Scriptexpiry = '<div><span class="expiry">(' + item.ScriptExchange + ') Expiry :' + date[0] + '</span></div>';
    }
    else {
        Scriptexpiry = '<div><span class="expiry">(' + item.ScriptExchange + ')</span></div>';
    }
    var btnMarketDepthForClick = "'#" + btnMarketDepth + "'";

    if (item.Scripttype == "FOREX" && CompanyINitial == "RT") {
        item.open = (item.open).toFixed(5);
        item.Lastprice = (item.Lastprice).toFixed(5);
        item.high = (item.high).toFixed(5);
        item.low = (item.low).toFixed(5);
        item.close = (item.close).toFixed(5);
    }
    var calendar = "";
    if (item.Scriptexpiry != null && item.Scriptexpiry != '') {
        calendar = '<i class="fa fa-calendar"></i>   ' + item.Scriptexpiry + '';
    }
    var html = '<div class="row p-2 watchlistRow" id="' + item.ScriptCode + '">' +
        '<div class="col-12" >' + actionButton + ' ' +
        '<div class="watchlist-card c-left-border watchlist-table">' +
        '<div class="card-body" id="' + btnMarketDepth + '" style="padding:5px;">' +
        '   <div class="row">' +
        '<div class="col-6">' +
        ' <p class="watchlist-p" style="font-size: 13px; margin-bottom: 5px;margin-top:6px;">' + item.ScriptTradingSymbol + '</p>' +
        '</div>' +
        '<div class="col-5">' +
        '     <div class="row" style="margin-left:2px;">' +
        '             <div class="col-5" style="margin-left:-15px;display: flex;">' +
        '                  <div style="font-size: 14px;margin-top: 5px;font-weight:bold;color:white;" >B:</div><span class="watchlist-p" style="font-size: 14px;font-weight:bold;width:30px">' +
        '               ' + LastBidHtml + '' +
        '                        </span>' +
        '             </div>' +
        '            <div class="col-7" style="display:flex;margin-left:15px">' +
        '              <div style="font-size: 14px;margin-top: 5px;font-weight:bold;color:white;">A:</div><label class="watchlist-p" style="font-size: 14px;font-weight:bold;width:30px">' + LastAskHtml + '</label>' +
        '            </div>' +

        '              </div>' +
        '           </div>' +
        '<div class="col-12">' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 5px;"> H : ' + item.high + ' |   L : ' + item.low + ' | LTP : ' + LastPriceHtml + ' | ' + perCentageHtml + ' | </p>' +
        '</div>' +
        '        </div>' +
        '     </div>' +
        '  </div>' +
        '</div >' +
        '</div >';

    $('#watchlistDiv').append(html);

    if ($('#buySellModel #lblScriptCode').text() == item.ScriptCode.toString()) {
        var LTP = item.Lastprice.toString();
        $('#buySellModel #lblLastPrice').text(LTP);
        $('#buySellModel #lblLastBid').text(item.Bid);
        $('#buySellModel #lblLastAsk').text(item.Ask);
        $('#buySellModel #hdnPrice').val(LTP);
    }
    var IsExistsLTP = false;
    for (var keys in LastPriceDictionary) {
        if (LastPriceDictionary[keys].key == item.ScriptCode) {
            IsExistsLTP = true;
            LastPriceDictionary[keys].value = item.Lastprice;
            LastPriceDictionary[keys].Bid = item.Bid;
            LastPriceDictionary[keys].Ask = item.Ask;
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

}
//#endregion
function openUserProfile() {
    document.getElementById("userDropdown").classList.toggle("show");
}

function MarketDepthPop(ScriptCode, symbolParam, Lastprice) {
    //var htmlString = '<button type="button" class="btn btn-success" onclick="HideDepthModal();$(\'#btnBuy' + ScriptCode + '\').click()">Buy</button>';
    var htmlString = '<div class="col-xs-4 col-sm-4">' +
        '<button type = "button" class="btn btn-primary" style = "width: 100%" onclick="HideDepthModal();$(\'#btnBuy' + ScriptCode + '\').click()">' +
        ' Buy          </button >' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4">' +
        '<button type="button" class="btn btn-danger" style="width: 100%" onclick="HideDepthModal();$(\'#btnSell' + ScriptCode + '\').click()">' +
        'Sell            </button>' +
        '</div>' +
        '<div class="col-xs-4 col-sm-4">' +
        '<button type="button" class="btn btn-warning" style="width: 100%" onclick="HideDepthModal();$(\'#btnDelete' + ScriptCode + '\').click()">' +
        'Delete            </button>' +
        '</div>' +
        '<div class="col-xs-12 col-sm-12" style="float:right;margin-top:10px;"> ' +
        '<button type="button" class="btn btn-primary" style="width: 27%" onclick="HideDepthModal();">' +
        'Close            </button>' +
        '</div>';
    $("#MarketDepthModal #buySellButtonDiv").html(htmlString);
    $("#MarketDepthModal #lblDepthScriptSymbol").text(symbolParam);
    $("#MarketDepthModal #hdnDepthScriptCode").val(ScriptCode);
    $("#MarketDepthModal #lblDepthLTP").text('(' + Lastprice + ')');
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: ScriptCode },

        success: function (data) {
            $("#MarketDepthModal .modal-body").html(data);
            $('#MarketDepthModal').modal({
                backdrop: false,
                show: true
            });
            $("body").removeClass('modal-open');
            marketDepthInterval = setInterval(function () { SetMarketDepthForRefresh(); }, 1000);
            return false;
        }
    });

}
function SetMarketDepthForRefresh() {
    var ScriptCode = $("#MarketDepthModal #hdnDepthScriptCode").val();
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: ScriptCode },
        async: true,
        success: function (data) {
            $('#MarketDepthModal #lblDepthLTP').text("(" + $("#hdnDepthLTP").val() + ")");
            $("#MarketDepthModal .modal-body").html(data);
            return false;
        }
    });
}
function HideDepthModal() {
    window.clearInterval(marketDepthInterval);
    $("#MarketDepthModal").modal('hide');
}

function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '') {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#price").removeClass("has-error");
    $('#buySellModel .modal-title').css("color", "#fff");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'Buy';
        $('#buySellModel .modal-title').css("background-color", "#31af38 ");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#31af38 ");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Buy");

    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
        $('#buySellModel .modal-title').css("background-color", "#dd4b39");
        $('#buySellModel #btnProceedBuySell').css("background-color", "rgb(221, 75, 57)");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("Sell");
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
        $('#Itype').text('NRML');
    }
    else {
        $('#rbtnNrml').val('CNC');
        $('#Itype').text('CNC');
    }
    $("#rbtnMarket").prop('checked', true);
    $('#rbtnNrml').prop('checked', true);

    var Companyinitials = $("#CompanyInitial").val();
    if (Companyinitials == "VM") {
        $(".ProductTypeDiv").css("display", "none");
        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $("#tgtSLDiv").css("display", "none");
        $(".tgtSLDivSL").css("display", "none");
    }
    if (Companyinitials == "EXPO") {
        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $(".RememberDiv").css("display", "none");
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
   
    $('#buySellModel').modal({
        backdrop: false,
        show: true
    });


    $("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);


    
    isShowDepthModal = false;

    //var Companyinitials = $("#CompanyInitial").val();
    //if (Companyinitials == "EXPO") {
    //    ProceedBuySell();
    //}
    var IsOneClickEnabled = localStorage.getItem("IsOneClickEnabled");
    if (IsOneClickEnabled == "1") {
        ProceedBuySell();
    }
    if (ScriptExchange != "MCX") {
        $('#QuantityWiseBuy').css('display', 'none');
        $('#marketTypeDiv').addClass('col-md-offset-4');
    }
    else {
        $('#QuantityWiseBuy').css('display', 'block');
        $('#marketTypeDiv').removeClass('col-md-offset-4');
    }
    marginInterval = setInterval(function () { GetRequiredMargin(); }, 1000);
}

function GetRequiredMargin() {
    //debugger
    var MisOrNot = 0;
    var ScriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    $('#buySellModel #DivGetLotSize').text(ScriptLotSize);
    var ScriptCode = $("#lblScriptCode").text();
    var quantity = $("#Quantity").val();
    var Totalwalletbalance = 0;
    var Lastprice = $('#lblLastPrice').text();
    var intradayradiobutton = document.getElementById('rbtnIntraday');
    if (intradayradiobutton.checked == true) {
        MisOrNot = 1;
    }
    var BuyQtyWiseOrLotWise = $('#dropTradingUnit option:selected').text().toLowerCase() == "Qty" ? 1 : 0;
    var CurrentPosition = $("#lblCurrentPosition").text();
    if (CurrentPosition == 'Buy')
        Lastprice = $('#lblLastBid').text();
    else
        Lastprice = $('#lblLastAsk').text();

    if (Lastprice != '' && Lastprice != null) {
        var input = { 'ScriptLotSize': ScriptLotSize, 'ScriptCode': ScriptCode, 'quantity': quantity, 'Totalwalletbalance': Totalwalletbalance, 'MisOrNot': MisOrNot, 'Lastprice': Lastprice, 'TRADING_UNIT_TYPE': $("#dropTradingUnit").val(), 'ScriptExchange': ScriptExchange };

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
    //debugger
    if (item.length != null) {
        if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {
                $('#buySellModel #DivGetRequiredMargin').text(item[i].Requiredmargin);
                $('#buySellModel #DivGetAvailableMargin').text(item[i].Availablemargin);
                $('#buySellModel #DivGetUsedMargin').text(item[0].Usedmargin);

                if (item[i].Requiredmargin > item[i].Availablemargin)
                    $('#DivGetAvailableMargin').css('color', 'red');
                else
                    $('#DivGetAvailableMargin').css('color', 'green');
            }
        }
        else {
            $('#buySellModel #DivGetRequiredMargin').text(0);
            $('#buySellModel #DivGetAvailableMargin').text(0);
            $('#buySellModel #DivGetUsedMargin').text(0);
        }
    }
    else {
        $('#buySellModel #DivGetRequiredMargin').text(0);
        $('#buySellModel #DivGetAvailableMargin').text(0);
        $('#buySellModel #DivGetUsedMargin').text(0);
    }
}
function removeScript(ScriptCode, intWID) {
    //debugger
    HideDepthModal();
    isShowDepthModal = false;
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
                    var table = $('#tblList').DataTable();
                    $("#" + ScriptCode).remove();
                    toastr.success('Script Deleted Successfully.');
                    return false;
                }

            }

        });

    }
}
function ProceedBuySell() {

    if ($("#cbxRememberTargetStoploss").prop('checked') == true) {
        var data = {
            PRODUCT_TYPE: $('input[Name=ProductType]:checked').val(),
            PRICE_TYPE: $('input[Name=MarketType]:checked').val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(data));
    }
    else {
        localStorage.removeItem("RememberTargetStoploss");
    }
    var Companyinitials = $("#CompanyInitial").val();

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
        alert("Please enter correct details");
        return;
    }

    var iscbxAutoBinanceSlTrailEnabled = 0;
    if (Companyinitials != "EXPO") {
        if ($("#cbxAutoBinanceSlTrail").prop('checked') == true) {
            iscbxAutoBinanceSlTrailEnabled = 1;
        }
        else {
            iscbxAutoBinanceSlTrailEnabled = 0;
        }
    }
    var HighLowCircuitRequired = $("#HighLowCircuitRequired").val();
    if (HighLowCircuitRequired == 0) {
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
    }
    var st = $("#hdnSt").val();
    var TRADING_UNIT = $("#dropTradingUnit").val();

    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, price: price, TriggerPrice: TriggerPrice, ProductType: ProductType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: iscbxAutoBinanceSlTrailEnabled, TRADING_UNIT: TRADING_UNIT },
            dataType: 'json',
            async: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {

                    HidePopUp();
                    toastr.error(results.TypeName);
                    return false;
                }
                else {
                    if (tradeID != '0') {
                        toastr.success('Order Updated successfully');
                    }
                    else {
                        toastr.success('Order Placed successfully');
                    }
                    return false;
                }

            }
        });
    }
    HidePopUp();
    $('#btnProceedBuySell').removeAttr('disabled');
}

function HidePopUp() {
    $("#buySellModel").modal('hide');
}
