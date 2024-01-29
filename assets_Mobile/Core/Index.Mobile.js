var mobilebuyBtn = 0;
var mobilesellBtn = 0;
var mobiledeleteBtn = 0;
var marketDepthInterval;
var companyInitials;
var LastPriceDictionary = [];
var SocketInterval;
var allowedTradingUnit;

$(document).ready(function () {
    (allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val())),
        (companyInitials = $("#CompanyInitial").val()),
        initSocket(),
        (SocketInterval = setInterval(function () {
            initSocket();
        }, 1e3));
    $("input[name=MarketType]").on("click", function (e) {
        var t = $(e.currentTarget).val(),
            i = $("#hdnPrice").val(),
            l = $("#hdnPrice").val();
        $("#txtTarget").removeAttr("disabled"),
            $("#txtTarget").removeAttr("readonly"),
            $("#txtStopLoss").removeAttr("disabled"),
            $("#txtStopLoss").removeAttr("readonly"),
            "LIMIT" == t
                ? ($("#buySellModel #Price").removeAttr("disabled"),
                    $("#buySellModel #Price").removeAttr("readonly"),
                    $("#buySellModel #Price").val(i),
                    $("#buySellModel #TriggerPrice").val("0"),
                    $("#buySellModel #TriggerPrice").attr("disabled", "disabled"))
                : "SL" == t
                    ? ($("#buySellModel #Price").removeAttr("disabled"),
                        $("#buySellModel #Price").removeAttr("readonly"),
                        $("#buySellModel #Price").val(i),
                        $("#buySellModel #TriggerPrice").val(l),
                        $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                        $("#buySellModel #TriggerPrice").removeAttr("readonly"))
                    : "SL-M" == t
                        ? ($("#buySellModel #TriggerPrice").removeAttr("disabled"),
                            $("#buySellModel #TriggerPrice").removeAttr("readonly"),
                            $("#buySellModel #TriggerPrice").val(l),
                            $("#buySellModel #Price").val("0"),
                            $("#buySellModel #Price").attr("disabled", "disabled"),
                            $("#txtTarget").attr("disabled", "disabled"),
                            $("#txtTarget").attr("readonly", "readonly"),
                            $("#txtStopLoss").attr("disabled", "disabled"),
                            $("#txtStopLoss").attr("readonly", "readonly"))
                        : "MARKET" == t &&
                        ($("#buySellModel #Price").val("0"),
                            $("#buySellModel #Price").attr("disabled", "disabled"),
                            $("#buySellModel #Price").attr("readonly", "readonly"),
                            $("#buySellModel #TriggerPrice").val("0"),
                            $("#buySellModel #TriggerPrice").attr("disabled", "disabled"),
                            $("#buySellModel #TriggerPrice").attr("readonly", "readonly"));
    });
});
function HidePopUp() {
    $("#buySellModel").modal("hide");
}



document.addEventListener('DOMContentLoaded', function () {
    var tabContainer = document.getElementById('WatchListSection');
    var hammer = new Hammer(tabContainer);

    var currentTab = 0; // Index of the active tab

    hammer.on('swipeleft swiperight', function (event) {
        if (event.type === 'swiperight' && currentTab > 0) {
            // Swipe right, decrease tab index
            currentTab--;
        } else if (event.type === 'swipeleft' && currentTab < 4) {
            // Swipe left, increase tab index
            currentTab++;
        }

        // Trigger the click event on the corresponding tab
        var tabs = document.getElementById('ScriptExchange').querySelectorAll('.nav-link');
        tabs[currentTab].click();
    });
});

$('#ScriptExchange>li>.nav-link').on('click', function () {
    $('#WatchListSection').css('height', '0');
    SetTradeDataForRefresh();
    setTimeout(function () {
        $('#WatchListSection').css('height', '200%');
    }, 2000);

});
$('#searchText').on('keyup', function () {
    SetTradeDataForRefresh();
});
document.getElementById("NavbarHome").classList.add("active");
SetTradeDataForRefresh();
function removeScript(scriptCode, wid) {
    DeleteModel("Delete This Record", "Are you sure?", function () {
        var confirmationResult = $('.crespp').html();
        //    $('.cresp').remove();

        if ("Yes" == confirmationResult && scriptCode > 0 && wid > 0) {
            $.ajax({
                url: "/Watchlist/DeleteScript",
                type: "POST",
                data: { intWID: wid, ScriptCode: scriptCode },
                dataType: "json",
                traditional: true,
                success: function (response) {
                    var parsedResponse = JSON.parse(response);
                    if (parsedResponse.IsError) {
                        ErrorAlert("Can Not Delete This Record.There Is One Active Trade.");
                        return false;
                    } else {
                        $(".Li" + scriptCode).remove();
                        SuccessAlert("Script Deleted Successfully.");
                        return false;
                    }
                },
            });
        }
    });
}

function SetTradeDataForRefresh() {
    $('#ShinerEffect').show(); $('#watchlistDiv').hide();
    try {
        var e = $('#ScriptExchange>.nav-item>.active').data('id');
        var t = { Wid: 0, scriptExchangeType: "", searchedData: $("#searchText").val(), ScriptExchange: e };
        $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: t,
            dataType: "json",
            async: !0,
            success: function (e) {
                var t = JSON.parse(e);
                if (null != t) {
                    if (($("#watchlistDiv").html(""), null != t.objLstWatchList)) {
                        if (t.objLstWatchList.length > 0) {
                            for (var i = 0; i < t.objLstWatchList.length; i++) {
                                var l = t.objLstWatchList[i];
                                SetWatchTradeDetails(l);
                            }
                        } else $("#watchlistDiv").html("")
                    } else $("#watchlistDiv").html("")
                    if (null != t.WatchlistDataForAdd) {
                        if (t.WatchlistDataForAdd.length > 0)
                            for (var i = 0; i < t.WatchlistDataForAdd.length; i++) {
                                var l = t.WatchlistDataForAdd[i];
                                SetWatchTradeDetailsForAdd(l);
                            }
                        else if (null != t.objLstWatchList) {
                            if (t.objLstWatchList.length == 0) {
                                $("#watchlistDiv").html("");
                            }
                        } else $("#watchlistDiv").html("");
                    }
                }
                $('#ShinerEffect').hide(); $('#watchlistDiv').show();
            },
        });
    } catch (i) {
        ErrorAlert("Error While Loading The Watchlist.");
    }
}
function SetWatchTradeDetails(e) {
    var lastPrice = e.LastPrice.toFixed(2);
    var scriptName = e.ScriptName.replace(/'/g, "");
    var scriptTradingSymbol = e.ScriptTradingSymbol.replace(/'/g, "");
    var scriptInstrumentType = "'" + e.ScriptInstrumentType + "'";
    var scriptExchange = "'" + e.ScriptExchange.toString() + "'";
    var priceDifference = parseFloat(e.LastPrice) - parseFloat(e.close);

    var percentageChange = (priceDifference / parseFloat(e.close)) * 100;
    var _ParArea = '';
    if (priceDifference < 0) {
        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-up"> +${priceDifference.toFixed(2)}(+${percentageChange.toFixed(2)} %) </h6>`;
    }
    else {
        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-down"> -${priceDifference.toFixed(2)}(-${percentageChange.toFixed(2)} %) </h6>`;
    }
    var scriptInstrumentType = "";
    if ("FUT" == e.ScriptInstrumentType || ("PE" == e.ScriptInstrumentType || "CE" == e.ScriptInstrumentType)) {
        scriptInstrumentType = e.ScriptInstrumentType;
    }

    //if ("" == e.ScriptName) {
    e.ScriptName = e.ScriptTradingSymbol;
    //}

    if (e.ScriptName.length > 18) {
        e.ScriptName = e.ScriptName.substring(0, 18) + "...";
    }

    var scriptCodeInput = '<input name="hiddenCode" value="' + e.ScriptCode + '" type="hidden" >';

    var deleteButton = '<button id="btnDelete' + e.ScriptCode + '" onclick="removeScript(' + e.ScriptCode + "," + e.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button>';

    var buyButton = '<button class="btn-buy" id="btnBuy' + e.ScriptCode + '" onclick="buySellPopUp(' + e.ScriptCode + ",1," + "'" + e.ScriptName + "'" + "," + e.WID + "," + lastPrice + ",'" + scriptInstrumentType + "'," + scriptExchange + ",1," + e.ScriptLotSize + "," + e.high + "," + e.low + "," + lastPrice + ')" type="button" class="btn btn-success btn-sm btn-buy">B </button>';

    var sellButton = '<button class="btn-sell" id="btnSell' + e.ScriptCode + '" onclick="buySellPopUp(' + e.ScriptCode + ",2," + "'" + e.ScriptName + "'" + "," + e.WID + "," + lastPrice + ",'" + scriptInstrumentType + "'," + scriptExchange + ",1," + e.ScriptLotSize + "," + e.high + "," + e.low + "," + lastPrice + ')" type="button" class="btn btn-danger btn-sm btn-sell"> S </button>';

    var tradeDetails = '<div tabindex="-1" style="display:none;" class="b-btn">' + buyButton + sellButton + deleteButton + '</div>';

    // var scriptExpiry = "";
    // var scriptExpiryColor = "";
    // if ("" != e.ScriptExpiry) {
    //     scriptExpiryColor = '<span style="color: red;font-size: 13px;">';
    //     scriptExpiry = e.ScriptExpiry.split(" ")[0];
    //     scriptExpiryColor += scriptExpiry + "</span>";
    // }








    $('#watchlistDiv').append(`<li style="padding: 17px;" id="${e.ScriptCode}" data-scriptType="${e.ScriptType}" class="Li${e.ScriptCode}">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <a href="#" onclick="BuySellPopOver(this)"  id="${e.ScriptCode}" data-scripttradingsymbol="${e.ScriptName}">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ${tradeDetails}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input name="hiddenCode" value="${e.ScriptCode}" type="hidden">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-12 p-0" style="display: flex;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="col-8 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h6 class="card-subtitle">${e.ScriptName}</h6>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="col-4 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <h6 class="card-subtitle PriceSection" id="_LtpArea">${e.LastPrice}</h6>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="col-12  p-0 pt-1" style="display: flex;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="col-6 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h6 class="card-subtitle ScriptexchangeSection">${e.ScriptExchange}</h6>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="col-6 p-0" id="_ParArea">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ${_ParArea}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </a>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </li>`);
}
function SetWatchTradeDetailsForAdd(e) {
    var t = "'" + e.scriptTradingSymbol.toString() + "'",
        i = "'" + $('#ScriptExchange>.nav-item>.active').data('id').toString() + "'",
        l = "";
    var btn = '<span class="iconedbox text-primary" onclick="AddNewScript(' + t + "," + e.intWID + "," + i + "," + i + "," + e.UserId + "," + e.lot + "," + e.size + ')"  style="border: 1px solid;"><ion-icon name="add" role="img" class="md hydrated" aria-label="add"></ion-icon></span>';
    $('#watchlistDiv').append(`<li style="padding: 17px;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <div class="col-12 p-0" style="display: flex;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="col-6 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <h6 class="card-subtitle">${e.scriptTradingSymbol}</h6>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="col-6 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h6 class="card-subtitle PriceSection">${btn}</h6>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </li>`);
}
function AddNewScript(e, t, i, l, r, a, s) {
    null != e &&
        "" != e &&
        void 0 != e &&
        null != l &&
        "" != l &&
        $.ajax({
            url: "/Watchlist/SaveWatchListFromIndex",
            type: "POST",
            data: { scriptTradingSymbol: e, intWID: t, watchListName: i, scriptExchange: l, txtUser: r, Lot: a, Size: s },
            dataType: "json",
            traditional: !0,
            success: function (e) {
                var t = JSON.parse(e);
                t.IsError && "MaxLimit" == t.ErrorMessage
                    ? ErrorAlert("Max 50 Scripts Allowed")
                    : t.IsExist
                        ? ErrorAlert("Duplicate Record")
                        : t.IsError
                            ? ErrorAlert("Something Went Wrong")
                            : t.IsError || "" == t.ScriptCode || null == t.ScriptCode || (SuccessAlert("Script Added Successfully"), $('#search').removeClass('show'), $("#searchText").val(""), SetTradeDataForRefresh());
            },
        });
}

function BuySellPopOver(e) {
    $('#_HiddenCode').val($(e).attr('id'));
    var _Symbol = $(e).attr("data-scripttradingsymbol");
    window.clearInterval(marketDepthInterval);
    mobilebuyBtn = $(e).find(".btn-buy").attr('id');
    mobilesellBtn = $(e).find(".btn-sell").attr('id');
    mobiledeleteBtn = $(e).find(".btn-delete").attr('id');
    MarketDepthPop();
    $('#title').html(_Symbol);
    $('#btnactionSheetIconed').trigger('click');
}
$(".mobileBuyBtn").on("click", function () {
    $("#" + mobilebuyBtn).trigger("click"), $(".mobileCloseBtn").trigger("click");
}),
    $(".mobileSellBtn").on("click", function () {
        $("#" + mobilesellBtn).trigger("click"), $(".mobileCloseBtn").trigger("click");
    }),
    $(".mobileDeleteBtn").on("click", function () {
        $("#" + mobiledeleteBtn).trigger("click"), $(".mobileCloseBtn").trigger("click");
    });
function MarketDepthPop() {
    $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: $('#_HiddenCode').val() },
        success: function (i) {
            return (
                $("#marketDepthDiv").html(i),
                (marketDepthInterval = setInterval(function () {
                    if ($('.action-sheet').hasClass('show')) {
                        SetMarketDepthForRefresh();
                    } else {
                        window.clearInterval(marketDepthInterval);
                    }
                }, 1000)),
                true
            );
        },
    });
}
function SetMarketDepthForRefresh() {
    $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: $('#_HiddenCode').val() },
        async: !0,
        success: function (e) {
            return $("#marketDepthDiv").html(e), !0;
        },
    });
}


function buySellPopUp(ScriptCode, no, ScriptSymbol, Wid, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, high = 0, low = 0, Triggerprice = 0, SL = 0, Target = 0, PriceType = '', producttype = '', TradeID = 0, sttus = '') {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#Price").removeClass("has-error");
    $('#buySellModel #Terror').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'BUY';
        // $('#buySellModel .modal-title').css("background-color", "#4987ee");
        $('#btnProceedBuySell').css("background-color", "#4987ee");
        $('#btnProceedBuySell').css("color", "#fff");
        $('#btnProceedBuySell').text("Tap to BUY");

    }
    else if (no == 2) {
        CurrentPosition = 'SELL';
        // $('#buySellModel .modal-title').css("background-color", "#ff4a4a");
        $('#btnProceedBuySell').css("background-color", "#ff4a4a");
        $('#btnProceedBuySell').css("color", "#fff");
        $('#btnProceedBuySell').text("Tap to SELL");
    }

    $('#dropTradingUnit').html('');
    if (allowedTradingUnit != null) {
        if (allowedTradingUnit.length > 0) {
            var data = allowedTradingUnit.filter(opt => opt.ScriptExchange == ScriptExchange);
            var units = [];
            if (instumentType == "FUT" || instumentType == "CE" || instumentType == "PE") {
                if (instumentType == "FUT") {
                    if (data[0].FUTURE_TRADING_UNIT_TYPE == null || data[0].FUTURE_TRADING_UNIT_TYPE == '' || data[0].FUTURE_TRADING_UNIT_TYPE == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].FUTURE_TRADING_UNIT_TYPE.split(",");
                    }
                }
                else {
                    if (data[0].OPTIONS_TRADING_UNIT_TYPE == null || data[0].OPTIONS_TRADING_UNIT_TYPE == '' || data[0].OPTIONS_TRADING_UNIT_TYPE == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].OPTIONS_TRADING_UNIT_TYPE.split(",");
                    }
                }
            } else {
                if (data[0].OPTIONS_TRADING_UNIT_TYPE == null || data[0].OPTIONS_TRADING_UNIT_TYPE == '' || data[0].OPTIONS_TRADING_UNIT_TYPE == undefined) {
                    units.push(1);
                }
                else {
                    units = data[0].EQUITY_TRADING_UNIT_TYPE.split(",");
                }
            }
            $.each(units, function (i, item) {
                if (item == "0")
                    item = "1";
                $('#dropTradingUnit').append($("<option></option>").val(parseInt(item)).html(item == "1" ? "LOT" : "QTY"));
            });

        } else {
            $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("LOT"));
        }
    }
    else {
        $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("LOT"));
    }
    $("#lblScriptSymbol").text(ScriptSymbol.toString());
    $("#lblScriptCode").text(ScriptCode.toString());
    $("#lblCurrentPosition").text(CurrentPosition);
    $("#Wid").val(Wid);
    $("#hdnPrice").val(price);
    $("#hdnTradeID").val(TradeID.toString());
    $("#Price").val('0');
    $("#TriggerPrice").val(Triggerprice.toString());
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
    $("#rbtnMarket").prop('checked', true);
    $('#rbtnNrml').prop('checked', true);

    if (PriceType.length == 0) {

        var RememberData = localStorage.getItem("RememberTargetStoploss");
        if (RememberData != null) {
            RememberData = JSON.parse(RememberData);
            $("#cbxRememberTargetStoploss").prop('checked', true);
            // $("#txtTarget").val(RememberData.TGT);
            // $("#txtStopLoss").val(RememberData.SL);

            if (RememberData.PRODUCT_TYPE != null && RememberData.PRODUCT_TYPE != '') {
                RememberData.PRODUCT_TYPE == 'MIS' ? $('input[name=ProductType]#rbtnIntraday').trigger('click') : $('input[name=ProductType]#rbtnNrml').trigger('click');
            }
            if (RememberData.PRICE_TYPE != null && RememberData.PRICE_TYPE != '') {
                if (RememberData.PRICE_TYPE == 'MARKET') {
                    $('input[name=MarketType]#rbtnMarket').trigger('click');
                } else if (RememberData.PRICE_TYPE == 'LIMIT') {
                    $('input[name=MarketType]#rbtnLimit').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL') {
                    $('input[name=MarketType]#rbtnSL').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL-M') {
                    $('input[name=MarketType]#rbtnSLM').trigger('click');
                }
            }
            PriceType = $('input[name=MarketType]:checked').val();
        }
        else {
            $("input[name=MarketType]#rbtnMarket").trigger('click');
            $('input[name=ProductType]#rbtnNrml').trigger('click');
        }
    }
    if (PriceType != null && PriceType != '') {
        if (PriceType == 'MARKET') {
            $('input[name=MarketType]#rbtnMarket').trigger('click');
        } else if (PriceType == 'LIMIT') {
            $('input[name=MarketType]#rbtnLimit').trigger('click');
        }
        else if (PriceType == 'SL') {
            $('input[name=MarketType]#rbtnSL').trigger('click');
        }
        else if (PriceType == 'SL-M') {
            $('input[name=MarketType]#rbtnSLM').trigger('click');
        }
    }


    if (producttype != null && producttype != '') {
        if (producttype == 'MIS') {
            $('#rbtnIntraday').prop('checked', true);
        }
    }
    if (sttus == 'COMPLETE')
        $('.upperClause :input').attr('disabled', 'disabled');


    $('#btnbuySellModel').trigger('click');

    $("#hdnSt").val(sttus);

    marginInterval = setInterval(function () { GetRequiredMargin(); }, 1000);
}

function GetRequiredMargin() {
    var e = 0,
        t = $("#buySellModel #hdnScriptLotSize").val();
    $("#buySellModel #DivGetLotSize").text(t);
    var a = $("#lblScriptCode").text(),
        r = $("#Quantity").val(),
        i = $("#WalletBalance").text(),
        l = $("#lblLastPrice").text(),
        o = document.getElementById("rbtnIntraday"),
        n = $("#lblCurrentPosition").text(),
        s = $("#buySellModel #hdnScriptExchange").val();
    if ((!0 == o.checked && (e = 1), "" != (l = "BUY" == n ? $("#lblLastBid").text() : $("#lblLastAsk").text()) && null != l)) {
        var d = "";
        (d = { ScriptLotSize: t, ScriptCode: a, quantity: r, Totalwalletbalance: i, MisOrNot: e, LastPrice: l, TRADING_UNIT_TYPE: $("#dropTradingUnit").val(), scriptExchange: s }),
            $.ajax({
                url: "/Trade/GetRequiredMargin",
                type: "GET",
                data: d,
                dataType: "json",
                success: function (e) {
                    var ee = JSON.parse(e);
                    SetRequiredMargin(ee);
                },
            });
    }
}

function SetRequiredMargin(e) {
    null != e.length &&
        (e.length > 0
            ? (e[0].RequiredMargin > e[0].AvailableMargin ? $("#DivGetAvailableMargin").css("color", "red") : $("#DivGetAvailableMargin").css("color", "green"),
                $("#buySellModel #DivGetRequiredMargin").text(e[0].RequiredMargin),
                $("#buySellModel #DivGetAvailableMargin").text(e[0].AvailableMargin),
                $("#buySellModel #DivGetUsedMargin").text(e[0].UsedMargin))
            : ($("#buySellModel #DivGetRequiredMargin").text(0), $("#buySellModel #DivGetAvailableMargin").text(0), $("#buySellModel #DivGetUsedMargin").text(0)));
}



function initSocket() {
    $.ajax({
        url: "/Home/ConnectWebSocket",
        type: "GET",
        dataType: "json",
        success: function (e) {
            if ("undefined" != e) {
                var t = JSON.parse(e);
                t.hasOwnProperty("Table") && ((allObj = t.Table), wt());
            }
        },
    });
}
function wt() {
    var e = allObj;

    if (e != null && e != 'undefined' && e.length > 0) {
        for (var table = document.getElementById("watchlistDiv"), i = 0; i < table.children.length;) {
            var htmlDivId = table.children[i].id,
                SCRIPT_TYPE = table.children[i].dataset.scripttype;
            if (htmlDivId != undefined && htmlDivId != '') {

                var newL = e.filter(opt => opt.InstrumentToken == $("#" + htmlDivId + "").find('input[name=hiddenCode]').val());
                if (newL.length > 0) {
                    var item = newL[0];

                    var PreviousLastPrice = 0.0;
                    var LtpColor = "";
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
                            LtpColor = (LastPriceDictionary[keys].LtpColor);
                            break;
                        }
                    }
                    if (item.Close == null)
                        item.Close = 0;
                    var perCentageHtml = "";
                    var perChangeInDigit = "";
                    var perCentage = "";
                    var _ParArea = '';
                    var PerChange = parseFloat(item.LastPrice) - parseFloat(item.Close);
                    var percentageChange = (PerChange / parseFloat(item.Close)) * 100;
                    if (PerChange < 0) {
                        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-up"> ${PerChange.toFixed(2)}(${percentageChange.toFixed(2)} %) </h6>`;
                    }
                    else {
                        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-down"> ${PerChange.toFixed(2)}(${percentageChange.toFixed(2)} %) </h6>`;
                    }
                    var LastPriceHtml = "";
                    if (parseFloat(item.LastPrice) > PreviousLastPrice) {
                        LastPriceHtml = item.LastPrice.toFixed(2);
                        LtpColor = "dodgerblue";
                    }
                    if (parseFloat(item.LastPrice) < PreviousLastPrice) {
                        LastPriceHtml = item.LastPrice.toFixed(2);
                        LtpColor = "orangered";
                    }
                    if (item.LastPrice == PreviousLastPrice) {
                        if (LtpColor == "")
                            LtpColor = "dodgerblue";
                        LastPriceHtml = item.LastPrice.toFixed(2)
                    }

                    $("#" + htmlDivId + "").find('#_ParArea').html(_ParArea);
                    $("#" + htmlDivId + "").find('#_LtpArea').html(LastPriceHtml);
                    $("#" + htmlDivId + "").find('#_LtpArea').css("color", LtpColor);

                    var IsExistsLTP = false;
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            IsExistsLTP = true;
                            LastPriceDictionary[keys].value = item.LastPrice;
                            LastPriceDictionary[keys].LtpColor = LtpColor;
                            break;
                        }
                    }
                    if (!IsExistsLTP) {
                        LastPriceDictionary.push({
                            key: item.InstrumentToken,
                            value: item.LastPrice,
                            LtpColor: LtpColor
                        });
                    }


                }
            }
            // if ("block" == $(".mobile-context-menu").css("display")) {
            //     var a = e.filter((e) => e.InstrumentToken == clicked_Watchlist_InstrumentToken);
            //     a.length > 0 && $("#lastPriceMobileContextMenu").html("LTP : " + a[0].LastPrice);
            // }
            i++;
        }
        if ($("#buySellModel").hasClass("show")) {
            var a = e.filter((e) => e.InstrumentToken == $("#buySellModel #lblScriptCode").text());
            a.length > 0 &&
                ($("#buySellModel #lblLastPrice").text(a[0].LastPrice),
                    $("#buySellModel #lblLastBid").text(a[0].Bid),
                    $("#buySellModel #lblLastAsk").text(a[0].Ask),
                    $("#buySellModel #hdnPrice").val(a[0].LastPrice));
        }
    }
}
function ProceedBuySell() {
    var e = $("#Quantity").val();
    if (e < 0.01) {
        ErrorAlert("Invalid Qty");
        return;
    }
    if (!0 == $("#cbxRememberTargetStoploss").prop("checked")) {
        var t = { PRODUCT_TYPE: $("input[name=ProductType]:checked").val(), PRICE_TYPE: $("input[name=MarketType]:checked").val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(t));
    } else localStorage.removeItem("RememberTargetStoploss");
    var i = $("#lblScriptCode").text(),
        l = $("#lblCurrentPosition").text();
    intWID = $("#Wid").val();
    var r = $("#txtTarget").val(),
        a = $("#txtStopLoss").val();
    $("#buySellModel #hdnScriptExchange").val(), $("#buySellModel #hdnScriptLotSize").val();
    var s = $("#Price").val(),
        n = $("#TriggerPrice").val(),
        o = $("#hdnTradeID").val(),
        c = $("input[name=ProductType]:checked").val(),
        d = $("input[name=MarketType]:checked").val();
    if (null == i || "" == i || null == l || "" == l) {
        ErrorAlert("Please enter correct details");
        return;
    }
    if (("" != a && "0" != a) || ("" != r && "0" != r)) {
        var p = parseFloat(r),
            u = parseFloat(a),
            b = parseFloat(s),
            v = $("#buySellModel #hdnPrice").val(),
            h = parseFloat(v);
        if ((b > 0 ? (h = b) : (b = h), "True" == $("#IsTargetStopLossAbsolute").val())) {
            var y = "";
            if (
                ("BUY" == l
                    ? (p > 0 && p < b && (y = "Target should be greater than Order price"), u > 0 && u > b && (y = "StopLoss should be less than Order price"))
                    : (p > 0 && p > b && (y = "Target should be less than Order price"), u > 0 && u < b && (y = "StopLoss  should be greater than Order price")),
                    "" != y)
            ) {
                ErrorAlert(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    if (0 == $("#HighLowCircuitRequired").val()) {
        if ("SL" == d || "SL-M" == d) {
            var b = parseFloat(s),
                S = parseFloat(n),
                v = $("#buySellModel #hdnPrice").val(),
                g = parseFloat(v),
                T = !1,
                y = "";
            if (
                ("SL" == d && ("SELL" == l && "SL" == d && b > S ? ((T = !0), (y = "Trigger price connot be less than order price")) : "BUY" == l && "SL" == d && b < S && ((T = !0), (y = "Trigger price Cannot be higher than order price"))),
                    "SELL" == l && S > g ? ((T = !0), (y = "Trigger price Cannot be higher than last price")) : "BUY" == l && S < g && ((T = !0), (y = "Trigger price connot be less than last price")),
                    T)
            ) {
                ErrorAlert(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("LIMIT" == d) {
            var b = parseFloat(s),
                v = $("#buySellModel #hdnPrice").val(),
                g = parseFloat(v),
                T = !1,
                y = "";
            if (("SELL" == l && b < g ? ((T = !0), (y = "Limit price Cannot be less than last price")) : "BUY" == l && b > g && ((T = !0), (y = "Limit price connot be greater than last price")), T)) {
                $("#Price").addClass("has-error"), ErrorAlert(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    var m = $("#hdnSt").val(),
        P = $("#dropTradingUnit").val();
    i > 0 &&
        intWID > 0 &&
        "" != e &&
        "0" != e &&
        $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: {
                intWID: intWID,
                ScriptCode: i,
                CurrentPosition: l,
                allUsers: !1,
                target: r,
                stopLoss: a,
                Quantity: e,
                Price: s,
                TriggerPrice: n,
                ProductType: c,
                MarketType: d,
                TradeID: o,
                Status: m,
                iscbxAutoBinanceSlTrailEnabled: 0,
                TRADING_UNIT: P,
            },
            dataType: "json",
            async: !0,
            success: function (e) {
                var t = JSON.parse(e);
                return t.IsError ? (HidePopUp(), ErrorAlert(t.TypeName), !1) : ("0" != o ? SuccessAlert("Order Updated successfully") : SuccessAlert("Order Placed successfully"), !1);
            },
        }),
        HidePopUp(),
        $("#btnProceedBuySell").removeAttr("disabled");
}