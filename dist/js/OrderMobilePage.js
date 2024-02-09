    var intervalSensexNifty;
    var intervalWatchList;
    function BindClick() {
        $('.activeTradeRow').bind('click', function () {
            var ScriptCode = $(this).attr('data-id');
            window.location.href = "/Trade/ActiveTrade?ActiveTradeID=" + ScriptCode;
        });
    }
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
    //#endregion
    $(document).ready(function () {
        intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
        intervalSensexNifty = window.setInterval(function () { FavoriteWatchlist(); }, 1000);
        $('#backbtn').css('color', '#fff');
        $('#backbtn').on('click', function () {
            window.location.href = "/Trade/Index";
        });
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
    });
    function SetTradeDataForRefresh() {
        try {

            var input = { 'tradetype': 0, 'searchedData': $("#searchText").val() };
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
            alert("Error On SetTradeData.")
        }
    }
    function SetResult(data) {
        var results = JSON.parse(data);
        if (results != null) {
            if (results.ActiveTrade != null) {
                //Set data for WatchList trade
                if (results.ActiveTrade.length > 0) {
                    $('#ActiveTradeDiv').html('');
                    for (var i = 0; i < results.ActiveTrade.length; i++) {
                        var result = results.ActiveTrade[i];
                        var Status=result.Status;
                        var checkboxPendingTrades=document.getElementById('CheckBoxForActiveOrPending');
                        if(checkboxPendingTrades.checked==true)
                        {
                        if(Status!="COMPLETE")
                        SetActiveTradeDetails(result);
                        }
                        else
                        {
                        if(Status=="COMPLETE")
                        SetActiveTradeDetails(result);
                        }
                        BindClick();
                    }
                }
                else {
                    $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');

                }
            }
        }
    }
    //#region Set Watch List Data
function SetActiveTradeDetails(item) {
    var Companyinitials = $("#Companyinitials").val();
 if(item.ObjScriptDTO.ScriptExchange == "FOREX" && Companyinitials == "RT")
    {
    item.ObjScriptDTO.Lastprice=(item.ObjScriptDTO.Lastprice).toFixed(5);
    item.OrderPrice=(item.OrderPrice).toFixed(5);
    item.TriggerPrice=(item.TriggerPrice).toFixed(5);
    item.SL=(item.SL).toFixed(5);
    item.TGT2=(item.TGT2).toFixed(5);
    item.TGT3=(item.TGT3).toFixed(5);
    item.TGT4=(item.TGT4).toFixed(5);
    }
        var P_L = "";
        var CP = "";
        if (parseFloat(item.Profitorloss) >= 0) {
            P_L = '<font style="color:rgb(91, 233, 91);font-weight:bold;">' + item.Profitorloss + '</font>';
        }
        else if (parseFloat(item.Profitorloss) < 0){
            P_L = '<font style="color:#ff4a4a;font-weight:bold;">' + item.Profitorloss + '</font>';
        }


    var sQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var css = "watchlist-table-green";
    var GetQtyType = item.TRADING_UNIT;
    var html = '<div class="row p-2 activeTradeRow" data-id=' + item.ActiveTradeID + '>' +
        '<div class="col-12" >' +
        '<div class="watchlist-card c-left-border ' + css + '">' +
        '<div class="card-body" style="padding:5px;">' +
        '   <div class="row">' +
            '<div class="col-7">' +
            ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px;">' + item.TradeSymbol + '</p>' +
            '</div>' +
            '<div class="col-5">' +
            '     <div class="row" style="margin-top:3px;">' +
            '          <div class="col-5">' +
            '               <label class="watchlist-p" style="font-size: 12px">'+ GetQtyType+': ' + sQty + '</label>' +
            '          </div>' +
            '             <div class="col-5" style="margin-left:-7px;">' +
            '                  <span class="watchlist-p" style="font-size: 12px;font-weight:bold"> LTP: ' +
            '               ' + item.ObjScriptDTO.Lastprice + '' +
            '                        </span>' +
            '                 </div>' +
            '              </div>' +
            '           </div>' +
            '<div class="col-5">' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;">AVG : ' + item.OrderPrice + ' </p>' +
            '</div>' +
            '<div class="col-5">' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;"> P&L : ' + P_L + ' </p>' +
            '</div>' +
            '<div class="col-12" >' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> SL : ' + item.SL + ' | TGT : ' + item.TGT2 + ' | TGT2 : ' + item.TGT3 + ' | TGT3 : ' + item.TGT4 + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> TRIGGER : ' + item.TriggerPrice + ' |  Status : ' + item.Status + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;">Date : ' + item.OrderDate + ' ' + item.OrderTime + ' | Live: ' + item.IsLive + ' | CP: ' + item.CurrentPositionNew +' </p>' +
            '</div>' +
            '        </div>' +
            '     </div>' +
            '  </div>' +
            '</div >' +
            '</div >';

        $('#ActiveTradeDiv').append(html);


    }
    //#endregion
    function openUserProfile() {
        document.getElementById("userDropdown").classList.toggle("show");
}
$('#SqrOffAllBtn').on('click', function () {
    var result = confirm("Are You Sure You Want To Sqr-Off All Trades ?");
    if (result) {
        window.location.href = "/Trade/SqrOffAll";
    }
});