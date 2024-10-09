var mobilebuyBtn = 0;
var mobilesellBtn = 0;
var mobiledeleteBtn = 0;
var marketDepthInterval;
var Companyinitials;
var LastPriceDictionary = [];
var SocketInterval;
var allowedTradingUnit;
$(document).ready(function () {
    (allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val())),
        (Companyinitials = $("#CompanyInitial").val()),
        initSocket(),
        (SocketInterval = setInterval(function () {
            initSocket();
        }, 1e3));
    $("input[Name=MarketType]").on("click", function (e) {
        var t = $(e.currentTarget).val(),
            i = $("#hdnPrice").val(),
            l = $("#hdnPrice").val();
        $("#txtTarget").removeAttr("disabled"),
            $("#txtTarget").removeAttr("readonly"),
            $("#txtStopLoss").removeAttr("disabled"),
            $("#txtStopLoss").removeAttr("readonly"),
            "Limit" == t
                ? ($("#buySellModel #price").removeAttr("disabled"),
                    $("#buySellModel #price").removeAttr("readonly"),
                    $("#buySellModel #price").val("0"),
                    $("#buySellModel #TriggerPrice").val("0"),
                    $("#buySellModel #TriggerPrice").attr("disabled", "disabled"))
                : "SL" == t
                    ? ($("#buySellModel #price").removeAttr("disabled"),
                        $("#buySellModel #price").removeAttr("readonly"),
                        $("#buySellModel #price").val(i),
                        $("#buySellModel #TriggerPrice").val(l),
                        $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                        $("#buySellModel #TriggerPrice").removeAttr("readonly"))
                    : "SL-M" == t
                        ? ($("#buySellModel #TriggerPrice").removeAttr("disabled"),
                            $("#buySellModel #TriggerPrice").removeAttr("readonly"),
                            $("#buySellModel #TriggerPrice").val(l),
                            $("#buySellModel #price").val("0"),
                            $("#buySellModel #price").attr("disabled", "disabled"),
                            $("#txtTarget").attr("disabled", "disabled"),
                            $("#txtTarget").attr("readonly", "readonly"),
                            $("#txtStopLoss").attr("disabled", "disabled"),
                            $("#txtStopLoss").attr("readonly", "readonly"))
                        : "MARKET" == t &&
                        ($("#buySellModel #price").val("0"),
                            $("#buySellModel #price").attr("disabled", "disabled"),
                            $("#buySellModel #price").attr("readonly", "readonly"),
                            $("#buySellModel #TriggerPrice").val("0"),
                            $("#buySellModel #TriggerPrice").attr("disabled", "disabled"),
                            $("#buySellModel #TriggerPrice").attr("readonly", "readonly"));
    });
    $('input').on('input change', function () {
        GetRequiredMargin();
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
function removeScript(ScriptCode, WID) {
    DeleteModel("Delete This Record", "Are you sure?", function () {
        var confirmationResult = $('.crespp').html();
        //    $('.cresp').remove();

        if ("Yes" == confirmationResult && ScriptCode > 0 && WID > 0) {
            $.ajax({
                url: "/Watchlist/DeleteScript",
                type: "POST",
                data: { intWID: WID, ScriptCode: ScriptCode },
                dataType: "json",
                traditional: true,
                success: function (response) {
                    var parsedResponse = JSON.parse(response);
                    if (parsedResponse.IsError) {
                        ErrorAlert("Can Not Delete This Record.There Is One Active Trade.");
                        return false;
                    } else {
                        $(".Li" + ScriptCode).remove();
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
        var t = { WID: 0, scriptExchangeType: "", searchedData: $("#searchText").val(), ScriptExchange: e, datalimit: 150 };
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
    var Lastprice = e.Lastprice.toFixed(2);
    var ScriptName = e.ScriptName.replace(/'/g, "");
    var ScriptTradingSymbol = e.ScriptTradingSymbol.replace(/'/g, "");
    var ScriptInstrumentType = "'" + e.ScriptInstrumentType + "'";
    var ScriptExchange = "'" + e.ScriptExchange.toString() + "'";
    var priceDifference = parseFloat(e.Lastprice) - parseFloat(e.close);

    var percentageChange = (priceDifference / parseFloat(e.close)) * 100;
    var _ParArea = '';
    if (priceDifference < 0) {
        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-up"> +${priceDifference.toFixed(2)}(+${percentageChange.toFixed(2)} %) </h6>`;
    }
    else {
        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-down"> -${priceDifference.toFixed(2)}(-${percentageChange.toFixed(2)} %) </h6>`;
    }
    var ScriptInstrumentType = "";
    if ("FUT" == e.ScriptInstrumentType || ("PE" == e.ScriptInstrumentType || "CE" == e.ScriptInstrumentType)) {
        ScriptInstrumentType = e.ScriptInstrumentType;
    }

    //if ("" == e.ScriptName) {
    e.ScriptName = e.ScriptTradingSymbol;
    //}

    //if (e.ScriptName.length > 18) {
    //    e.ScriptName = e.ScriptName.substring(0, 18) + "...";
    //}

    var scriptCodeInput = '<input Name="hiddenCode" value="' + e.ScriptCode + '" type="hidden" >';

    var deleteButton = '<button id="btnDelete' + e.ScriptCode + '" onclick="removeScript(' + e.ScriptCode + "," + e.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button>';

    var buyButton = '<button class="btn-Buy" id="btnBuy' + e.ScriptCode + '" onclick="buySellPopUp(' + e.ScriptCode + ",1," + "'" + e.ScriptName + "'" + "," + e.WID + "," + Lastprice + ",'" + ScriptInstrumentType + "'," + ScriptExchange + ",1," + e.ScriptLotSize + "," + e.high + "," + e.low + "," + Lastprice + ')" type="button" class="btn btn-success btn-sm btn-Buy">B </button>';

    var sellButton = '<button class="btn-Sell" id="btnSell' + e.ScriptCode + '" onclick="buySellPopUp(' + e.ScriptCode + ",2," + "'" + e.ScriptName + "'" + "," + e.WID + "," + Lastprice + ",'" + ScriptInstrumentType + "'," + ScriptExchange + ",1," + e.ScriptLotSize + "," + e.high + "," + e.low + "," + Lastprice + ')" type="button" class="btn btn-danger btn-sm btn-Sell"> S </button>';

    var tradeDetails = '<div tabindex="-1" style="display:none;" class="b-btn">' + buyButton + sellButton + deleteButton + '</div>';

    // var Scriptexpiry = "";
    // var scriptExpiryColor = "";
    // if ("" != e.Scriptexpiry) {
    //     scriptExpiryColor = '<span style="color: red;font-size: 13px;">';
    //     Scriptexpiry = e.Scriptexpiry.split(" ")[0];
    //     scriptExpiryColor += Scriptexpiry + "</span>";
    // }








    $('#watchlistDiv').append(`<li style="padding: 17px;" id="${e.ScriptCode}" data-Scripttype="${e.Scripttype}" class="Li${e.ScriptCode}">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <a href="#" onclick="BuySellPopOver(this)"  id="${e.ScriptCode}" data-ScriptTradingSymbol="${e.ScriptTradingSymbol}">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ${tradeDetails}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <input Name="hiddenCode" value="${e.ScriptCode}" type="hidden">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <div class="col-12 p-0" style="display: flex;">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="col-9 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h6 class="card-subtitle">${e.ScriptName}</h6>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <div class="col-3 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <h6 class="card-subtitle PriceSection" id="_LTPArea">${e.Lastprice}</h6>
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
    var t = "'" + e.ScriptTradingSymbol.toString() + "'",
        i = "'" + $('#ScriptExchange>.nav-item>.active').data('id').toString() + "'",
        l = "";
    var btn = '<span class="iconedbox text-primary" onclick="AddNewScript(' + t + "," + e.intWID + "," + i + "," + i + "," + e.UserID + "," + e.Lot + "," + e.size + ')"  style="border: 1px solid;"><ion-icon Name="add" role="img" class="md hydrated" aria-label="add"></ion-icon></span>';

    var _FinalHTML = "";
    if (e.ScriptTradingSymbol_NEW != "") {
        _FinalHTML = `<div class="col-10 p-0">
<h6 class="card-subtitle">${e.ScriptTradingSymbol_NEW}</h6>
<h5 class="card-subtitle pt-1" style="
    font-size: 12px!important;
    color: orangered;
">${e.Scriptexpiry}</h5>
<h5 class="card-subtitle pt-1" style="
    font-size: 13px!important;
">Lot: ${e.size}</h5>
</div>`;
    } else {
        _FinalHTML = `  <div class="col-10 p-0">
<h6 class="card-subtitle">${e.ScriptTradingSymbol}</h6>
</div>`;
    }

    $('#watchlistDiv').append(`<li style="padding: 17px;">
    <div class="col-12 p-0" style="display: flex;">
    ${_FinalHTML}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div class="col-2 p-0">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <h6 class="card-subtitle PriceSection">${btn}</h6>
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
            data: { ScriptTradingSymbol: e, intWID: t, Watchlistname: i, ScriptExchange: l, txtUser: r, Lot: a, Size: s },
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
//a
function BuySellPopOver(e) {
    $('#_HiddenCode').val($(e).attr('id'));
    var _Symbol = $(e).attr("data-ScriptTradingSymbol");
    window.clearInterval(marketDepthInterval);
    mobilebuyBtn = $(e).find(".btn-Buy").attr('id');
    mobilesellBtn = $(e).find(".btn-Sell").attr('id');
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
//function MarketDepthPop() {
//    $.ajax({
//        url: "/Trade/_MarketDepthMobile",
//        type: "POST",
//        data: { ScriptCode: $('#_HiddenCode').val() },
//        success: function (i) {
//            return (
//                $("#marketDepthDiv").html(i),
//                (marketDepthInterval = setInterval(function () {
//                    if ($('.action-sheet').hasClass('show')) {
//                        SetMarketDepthForRefresh();
//                    } else {
//                        window.clearInterval(marketDepthInterval);
//                    }
//                }, 1000)),
//                true
//            );
//        },
//    });
//}
function MarketDepthPop() {
    $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: $('#_HiddenCode').val() },
        success: function (i) {
            // Update the HTML content
            $("#marketDepthDiv").html(i);

            // Clear any existing interval before setting a new one
            if (marketDepthInterval) {
                clearInterval(marketDepthInterval);
                marketDepthInterval = null; // Reset to prevent multiple intervals
            }

            // Set a new interval
            marketDepthInterval = setInterval(function () {
                if ($('.action-sheet').hasClass('show')) {
                    SetMarketDepthForRefresh();
                } else {
                    clearInterval(marketDepthInterval);
                    marketDepthInterval = null; // Reset the interval variable
                }
            }, 1000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX request failed: " + textStatus, errorThrown);
        }
    });
}
function SetMarketDepthForRefresh() {
    $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: $('#_HiddenCode').val() },
        async: !0,
        success: function (e) {
            if (e != null)
                return $("#marketDepthDiv").html(e), !0;
        },
    });
}


function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, high = 0, low = 0, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '') {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#price").removeClass("has-error");
    $('#buySellModel #Terror').hide();
    $("#marketDepthDiv").html("");

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    //debugger;
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'Buy';
        // $('#buySellModel .modal-title').css("background-color", "#4987ee");
        $('#btnProceedBuySell').css("background-color", "#4987ee");
        $('#btnProceedBuySell').css("color", "#fff");
        $('#btnProceedBuySell').text("Tap to Buy");

    }
    else if (no == 2) {
        CurrentPosition = 'Sell';
        // $('#buySellModel .modal-title').css("background-color", "#ff4a4a");
        $('#btnProceedBuySell').css("background-color", "#ff4a4a");
        $('#btnProceedBuySell').css("color", "#fff");
        $('#btnProceedBuySell').text("Tap to Sell");
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
    $("#lblScriptSymbol").text(ScriptSymbol.toString() + `(Lot:${ScriptLotSize})`);
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
            $('#rbtnIntraday').prop('checked', true);
        }
    }
    if (sttus == 'COMPLETE')
        $('.upperClause :input').attr('disabled', 'disabled');


    $('#btnbuySellModel').trigger('click');

    $("#hdnSt").val(sttus);
    GetRequiredMargin();
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
    if ((!0 == o.checked && (e = 1), "" != (l = "Buy" == n ? $("#lblLastBid").text() : $("#lblLastAsk").text()) && null != l)) {
        var d = "";
        l = parseFloat($('#price').val()) > 0 ? $('#price').val() : l;
        (d = { ScriptLotSize: t, ScriptCode: a, quantity: r, Totalwalletbalance: i, MisOrNot: e, Lastprice: l, TRADING_UNIT_TYPE: $("#dropTradingUnit").val(), ScriptExchange: s, CurrentPosition: $('#lblCurrentPosition').html() }),
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
            ? (e[0].Requiredmargin > e[0].Availablemargin ? $("#DivGetAvailableMargin").css("color", "red") : $("#DivGetAvailableMargin").css("color", "green"),
                $("#buySellModel #DivGetRequiredMargin").text(e[0].Requiredmargin),
                $("#buySellModel #DivGetAvailableMargin").text(e[0].Availablemargin),
                $("#buySellModel #DivGetUsedMargin").text(e[0].Usedmargin))
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
                SCRIPT_TYPE = table.children[i].dataset.Scripttype;
            if (htmlDivId != undefined && htmlDivId != '') {

                var newL = e.filter(opt => opt.InstrumentToken == $("#" + htmlDivId + "").find('input[Name=hiddenCode]').val());
                if (newL.length > 0) {
                    var item = newL[0];

                    var PreviousLastPrice = 0.0;
                    var LTPColor = "";
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
                            LTPColor = (LastPriceDictionary[keys].LTPColor);
                            break;
                        }
                    }
                    if (item.Close == null)
                        item.Close = 0;
                    var perCentageHtml = "";
                    var perChangeInDigit = "";
                    var perCentage = "";
                    var _ParArea = '';
                    var PerChange = parseFloat(item.Lastprice) - parseFloat(item.Close);
                    var percentageChange = (PerChange / parseFloat(item.Close)) * 100;
                    if (PerChange > 0) {
                        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-up"> ${PerChange.toFixed(2)}(${percentageChange.toFixed(2)} %) </h6>`;
                    }
                    else {
                        _ParArea = `<h6 class="card-subtitle PriceSection ScriptexchangeSection price-down"> ${PerChange.toFixed(2)}(${percentageChange.toFixed(2)} %) </h6>`;
                    }
                    var LastPriceHtml = "";
                    if (parseFloat(item.Lastprice) > PreviousLastPrice) {
                        LastPriceHtml = item.Lastprice.toFixed(2);
                        LTPColor = "rgb(0 255 64 / 92%)"//"dodgerblue";
                    }
                    if (parseFloat(item.Lastprice) < PreviousLastPrice) {
                        LastPriceHtml = item.Lastprice.toFixed(2);
                        LTPColor = "orangered";
                    }
                    if (item.Lastprice == PreviousLastPrice) {
                        if (LTPColor == "")
                            LTPColor = "rgb(0 255 64 / 92%)"//"dodgerblue";
                        LastPriceHtml = item.Lastprice.toFixed(2)
                    }

                    $("#" + htmlDivId + "").find('#_ParArea').html(_ParArea);
                    $("#" + htmlDivId + "").find('#_LTPArea').html(LastPriceHtml);
                    $("#" + htmlDivId + "").find('#_LTPArea').css("color", LTPColor);

                    var IsExistsLTP = false;
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            IsExistsLTP = true;
                            LastPriceDictionary[keys].value = item.Lastprice;
                            LastPriceDictionary[keys].LTPColor = LTPColor;
                            break;
                        }
                    }
                    if (!IsExistsLTP) {
                        LastPriceDictionary.push({
                            key: item.InstrumentToken,
                            value: item.Lastprice,
                            LTPColor: LTPColor
                        });
                    }


                }
            }
            // if ("block" == $(".mobile-context-menu").css("display")) {
            //     var a = e.filter((e) => e.InstrumentToken == clicked_Watchlist_InstrumentToken);
            //     a.length > 0 && $("#lastPriceMobileContextMenu").html("LTP : " + a[0].Lastprice);
            // }
            i++;
        }
        if ($("#buySellModel").hasClass("show")) {
            var a = e.filter((e) => e.InstrumentToken == $("#buySellModel #lblScriptCode").text());
            a.length > 0 &&
                ($("#buySellModel #lblLastPrice").text(a[0].Lastprice),
                    $("#buySellModel #lblLastBid").text(a[0].Bid),
                    $("#buySellModel #lblLastAsk").text(a[0].Ask),
                    $("#buySellModel #hdnPrice").val(a[0].Lastprice));
            if ($('#DivGetRequiredMargin').html() == '') {
                GetRequiredMargin();
            }
        }
    }
}
function ProceedBuySell() {
    var e = $("#Quantity").val();
    if (e < 0.01) {
        ErrorAlert("Invalid Qty");
        return;
    }
    if (parseFloat($('#DivGetRequiredMargin').html()) > parseFloat($('#DivGetAvailableMargin').html())) {
        ErrorAlert('Insufficiant balance');
        $('#btnProceedBuySell').removeAttr('disabled');
        return;
    }
    if (!0 == $("#cbxRememberTargetStoploss").prop("checked")) {
        var t = { PRODUCT_TYPE: $("input[Name=ProductType]:checked").val(), PRICE_TYPE: $("input[Name=MarketType]:checked").val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(t));
    } else localStorage.removeItem("RememberTargetStoploss");
    var i = $("#lblScriptCode").text(),
        l = $("#lblCurrentPosition").text();
    intWID = $("#WID").val();
    var r = $("#txtTarget").val(),
        a = $("#txtStopLoss").val();
    $("#buySellModel #hdnScriptExchange").val(), $("#buySellModel #hdnScriptLotSize").val();
    var s = $("#price").val(),
        n = $("#TriggerPrice").val(),
        o = $("#hdnTradeID").val(),
        c = $("input[Name=ProductType]:checked").val(),
        d = $("input[Name=MarketType]:checked").val();
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
                ("Buy" == l
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
                ("SL" == d && ("Sell" == l && "SL" == d && b > S ? ((T = !0), (y = "Trigger price connot be less than order price")) : "Buy" == l && "SL" == d && b < S && ((T = !0), (y = "Trigger price Cannot be higher than order price"))),
                    "Sell" == l && S > g ? ((T = !0), (y = "Trigger price Cannot be higher than last price")) : "Buy" == l && S < g && ((T = !0), (y = "Trigger price connot be less than last price")),
                    T)
            ) {
                ErrorAlert(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("Limit" == d) {
            var b = parseFloat(s),
                v = $("#buySellModel #hdnPrice").val(),
                g = parseFloat(v),
                T = !1,
                y = "";
            if (("Sell" == l && b < g ? ((T = !0), (y = "Limit price Cannot be less than last price")) : "Buy" == l && b > g && ((T = !0), (y = "Limit price connot be greater than last price")), T)) {
                $("#price").addClass("has-error"), ErrorAlert(y), $("#btnProceedBuySell").removeAttr("disabled");
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
                price: s,
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
                return t.IsError ? (HidePopUp(), ErrorAlert(t.TypeName), !1) : ("0" != o ? SuccessAlert("Order Updated successfully") : SuccessAlert(t.SuccessMessage), !1);
            },
        }),
        HidePopUp(),
        $("#btnProceedBuySell").removeAttr("disabled");
}
