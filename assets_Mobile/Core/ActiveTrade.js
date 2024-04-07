var allowedTradingUnit;
var marginInterval;

$(document).ready(function () {
    (allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val())),
        intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
});
function SetTradeDataForRefresh() {
    $.ajax({
        url: "/Trade/SetActiveTradeDataForNewUI",
        type: "POST",
        data: { ActiveTradeID: $('#ActiveTradeID').val() },
        success: function (data) {
            if (data != null) {
                data = JSON.parse(data);
                if (data.ActiveTrade.length > 0) {
                    var item = data.ActiveTrade[0];
                    $('#LTP').text(item.ObjScriptDTO.Lastprice);
                    $("#buySellModel #lblLastPrice").text(item.ObjScriptDTO.Lastprice),
                        $("#buySellModel #lblLastBid").text(item.ObjScriptDTO.Bid),
                        $("#buySellModel #lblLastAsk").text(item.ObjScriptDTO.Ask);
                    $('#AVG').text(item.OrderPrice);
                    $('#CurrentPositionNew').text(item.CurrentPositionNew);
                    $('#TriggerPrice').text(item.TriggerPrice);
                    $('#Profitorloss').text(item.Profitorloss);
                    if (parseFloat(item.Profitorloss) > 0) {
                        $('#Profitorloss').css('color', 'dodgerblue');
                    }
                    else {
                        $('#Profitorloss').css('color', 'OrangeRed');
                    }
                    $('#SL').text(item.SL);
                    $('#TGT2').text(item.TGT2);
                    $('#TGT3').text(item.TGT3);
                    $('#TGT4').text(item.TGT4);
                    $('#TIME').text(item.OrderDate + ' ' + item.OrderTime);
                    $('#ProductType').text(item.ProductType);
                    $('#IsLive').text(item.IsLive);
                    $('#Strategyname').text(item.Strategyname);
                    $('#Watchlistname').text(item.Watchlistname);


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
                    var RoleId = $("#Role_Id").val();
                    var isManualStaratgy = false;
                    if (item.Strategyname == "Manual")
                        isManualStaratgy = true;

                    var CurrentPosition = item.CurrentPosition;
                    var BuyOrSell = 2;
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
                    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "Qty" ? 'U' : '';
                    $('#sQty').text(sQty + GetQtyType);

                    var editButton = "";
                    var syncButton = "";
                    var RejectedOrderDeleteBtn = "";

                    if (item.Status.toUpperCase() != "REJECTED") {
                        if (item.CurrentPositionNew == "Buy")
                            BuyOrSell = 1;
                        editButton = ' <button class="btn btn-primary btn-sm" onclick="buySellPopUp(' + item.ScriptCode + ',' + BuyOrSell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + sQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + PriceType + ',' + ProductType + ',' + item.ActiveTradeID + ',' + st + ')" type="button"><ion-icon Name="create-outline"></ion-icon></button> ';
                        buyButton = ' <button class="btn btn-primary btn-sm" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
                        sellButton = ' <button class="btn btn-danger btn-sm btn-Sell" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
                        if (item.ProductType == "MIS")
                            convertButton = ' <button style="height:30px;" title="Convert MIS to CNC" class="btn btn-primary btn-sm" onclick="convertButton(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button"><ion-icon Name="construct-outline"></ion-icon></button> ';

                    }
                    if (item.Status.toUpperCase() == "REJECTED" || item.Status.toUpperCase() == "OPEN") {
                        RejectedOrderDeleteBtn = '<button onclick = "DeleteRejectedTrade(' + item.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-delete" > <ion-icon Name="trash-bin-outline"></ion-icon></button >';
                    }
                    if (item.CurrentPositionNew == "Buy") {
                        CurrentPosition = sellButton;
                    }
                    else if (item.CurrentPositionNew == "Sell") {
                        CurrentPosition = buyButton;
                    }
                    var actionButton = editButton + syncButton + RejectedOrderDeleteBtn + convertButton;

                    if (parseInt(RoleId) == 2 && item.IsCopyTradeFlag == true) {
                        actionButton = "-";
                        CurrentPosition = "-";
                    }
                    $(".actionbtns").html(CurrentPosition + ' ' + actionButton);

                }
            }
        }
    });
}

function DeleteRejectedTrade(data) {
    DeleteModel("Delete This Record", "Are you sure?", function () {
        var confirmationResult = $('.crespp').html();
        if ("Yes" == confirmationResult) {
            var request = $.ajax({
                url: "/Trade/DeleteRejectedTrade?ID=" + data,
                type: "GET",
                async: true,
                success: function (data) {
                    if (data != null) {
                        SuccessAlert(data);
                    }
                }
            });
        }
    });
}
var sqModal = $("#sqOfModal");
function SquareOff(id, param, st, Qty, isManualStaratgy) {
    var Companyinitials = $("#CompanyInitial").val();
    if (Companyinitials == "EXPO") {
        $(sqModal).find(".sqMsg").text('');
        $(sqModal).find("input[Name=sqQty]").val(Qty);
        $(sqModal).find("input[Name=hdQty]").val(Qty);
        $(sqModal).find("input[Name=sqActiveTradeID]").val(id);
        $(sqModal).find("input[Name=sqStatus]").val(st);
        $(sqModal).find("input[Name=sqParam]").val(param);
        ProceedSqOf();
    }
    else {
        $(sqModal).find(".sqMsg").text('');
        $(sqModal).find("input[Name=sqQty]").val(Qty);
        $(sqModal).find("input[Name=hdQty]").val(Qty);
        $(sqModal).find("input[Name=sqActiveTradeID]").val(id);
        $(sqModal).find("input[Name=sqStatus]").val(st);
        $(sqModal).find("input[Name=sqParam]").val(param);
        if (isManualStaratgy)
            $(sqModal).modal('show');
        else {
            ConfirmModel("square off?", "Are you sure?", function () {
                var confirmationResult = $('.crespp').html();
                //    $('.cresp').remove();

                if ("Yes" == confirmationResult) {
                    ProceedSqOf();
                }
            });
        }
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
                SuccessAlert(results.exceptionDTO.Msg);
                window.location.href = "/Trade/Order";
            }
            else if (results.exceptionDTO.id == 0) {
                ErrorAlert(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {
                ErrorAlert(results.exceptionDTO.Msg);
            }


            return false;
        }
    });
    $('#btnProceedSquareOff').removeAttr('disabled');
    $(sqModal).modal('hide');
}


function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '') {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#price").removeClass("has-error");
    $('#buySellModel #Terror').hide();

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
    marginInterval = setInterval(function () { GetRequiredMargin(); }, 1000);
}

function ProceedBuySell() {
    var e = $("#Quantity").val();
    if (e < 0.01) {
        ErrorAlert("Invalid Qty");
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
                return t.IsError ? (HidePopUp(), ErrorAlert(t.TypeName), !1) : ("0" != o ? SuccessAlert("Order Updated successfully") : SuccessAlert("Order Placed successfully"), !1);
            },
        }),
        HidePopUp(),
        $("#btnProceedBuySell").removeAttr("disabled");
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
        (d = { ScriptLotSize: t, ScriptCode: a, quantity: r, Totalwalletbalance: i, MisOrNot: e, Lastprice: l, TRADING_UNIT_TYPE: $("#dropTradingUnit").val(), ScriptExchange: s }),
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
function HidePopUp() {
    $("#buySellModel").modal('hide');
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
            SuccessAlert(results.exceptionDTO.Msg);
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
    else {
        ConfirmModel("square off?", "Are you sure?", function () {
            var confirmationResult = $('.crespp').html();
            //    $('.cresp').remove();

            if ("Yes" == confirmationResult) {
                ConvertMISToCNC();
            }
        });
    }
}