var intervalSensexNifty;
var intervalWatchList;
var Id_for_Controls;
var sqModal;
var allowedTradingUnit;
var marginInterval;
document.getElementById("NavbarOrder").classList.add("active");
function BindClick() {
    $('.activeTradeRow').bind('click', function () {
        $('#btnactionSheetIconedMain').trigger('click');
        var ScriptCode = $(this).attr('data-id');
        $.ajax({
            url: "/Trade/ActiveTrade",
            type: "POST",
            data: { ActiveTradeID: ScriptCode },
            async: !0,
            success: function (e) {
                return $("#POpupActivetradeDiv").html(e), !0;
            },
        });
        //window.location.href = "/Trade/ActiveTrade?ActiveTradeID=" + ScriptCode;
    });
}

$(document).ready(function () {
    SetTradeDataForRefresh();
    intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
});

$('#SqrOffAllBtn').on('click', function () {
    ConfirmModel("Are you Sure?", "Sqr Off All?", function () {
        var confirmationResult = $('.crespp').html();
        //    $('.cresp').remove();
        if ("Yes" == confirmationResult) {
            window.location.href = "/Trade/SqrOffAll";
        }
    });
});
function SquareOff(id, param, st, Qty, isManualStaratgy) {
    sqModal = $("#sqOfModal");
    $(sqModal).find(".sqMsg").text('');
    $(sqModal).find("input[Name=sqQty]").val(Qty);
    $(sqModal).find("input[Name=hdQty]").val(Qty);
    $(sqModal).find("input[Name=sqActiveTradeID]").val(id);
    $(sqModal).find("input[Name=sqStatus]").val(st);
    $(sqModal).find("input[Name=sqParam]").val(param);
    if (isManualStaratgy)
        $(sqModal).modal('show');
    else {
        ConfirmModel("Are you Sure?", "square off?", function () {
            var confirmationResult = $('.crespp').html();
            //    $('.cresp').remove();
            if ("Yes" == confirmationResult) {
                ProceedSqOf();
            }
        });
    }


}
function ProceedSqOf() {
    sqModal = $("#sqOfModal");
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
        data: { ID: id, actionParam: param, Status: st, Qty: intQty, isSupAdmin: 1 },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {
                SuccessAlert(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 0) {
                SuccessAlert(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {
                SuccessAlert(results.exceptionDTO.Msg);
            }


            return false;
        }
    });
    $('#btnProceedSquareOff').removeAttr('disabled');
    $(sqModal).modal('hide');
}
function DeleteActiveTrade(TransactionId, UserID) {
    ConfirmModel("Are you Sure?", "Delete This Record", function () {
        var confirmationResult = $('.crespp').html();
        //    $('.cresp').remove();
        if ("Yes" == confirmationResult) {
            var request = $.ajax({
                url: "/Trade/DeleteActiveTrade?ID=" + TransactionId + "&UserID=" + UserID,
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
        ErrorAlert("Error On SetTradeData.")
    }
}
function SetResult(data) {
    var results = JSON.parse(data);
    if (results != null) {
        if (results.ActiveTrade != null) {
            //Set data for WatchList trade
            if (results.ActiveTrade.length > 0) {
                $('#ActiveTradeDiv').html('');
                $('#PendingTradeDiv').html('');
                $('#RejectedTradeDiv').html('');
                var Table_Name;
                var Total_Active = 0, Total_Pending = 0, Total_Rejected = 0, Total_Profit = 0;
                for (var i = 0; i < results.ActiveTrade.length; i++) {
                    var result = results.ActiveTrade[i];
                    var Status = result.Status;
                    Total_Profit += result.Profitorloss;
                    if (Status.toUpperCase() == "COMPLETE") {
                        Total_Active += 1;
                        Table_Name = 'ActiveTradeDiv';
                        SetActiveTradeDetails(result, Table_Name);
                    }
                    else if (Status.toUpperCase() == "OPEN") {
                        Total_Pending += 1;
                        Table_Name = 'PendingTradeDiv';
                        SetActiveTradeDetails(result, Table_Name);
                    }
                    else {
                        Total_Rejected += 1;
                        Table_Name = 'RejectedTradeDiv';
                        SetActiveTradeDetails(result, Table_Name);
                    }

                    BindClick();
                }
                $('#Total_Pending').html('');
                $('#Total_Active').html('');
                $('#Total_Rejected').html('');
                $('#OverAllProfit').html('');
                if (Total_Profit > 0) {
                    $('#OverAllProfit').css('color', 'dodgerblue');
                }
                else {
                    $('#OverAllProfit').css('color', 'OrangeRed');
                }
            }
            else {
                $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                $('#RejectedTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            }
        }
        else {
            $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            $('#RejectedTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
        }
    }
    else {
        $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
        $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
        $('#RejectedTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
    }
}



//#region Set Watch List Data
function SetActiveTradeDetails(item, TableName) {

    var symbolParam = '\'' + item.TradeSymbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ProductType = '\'' + item.ProductType + '\'';
    var PriceType = '\'' + item.PriceType + '\'';
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';


    var isManualStaratgy = false;
    if (item.Strategyname == "Manual")
        isManualStaratgy = true;

    var Companyinitials = $("#Companyinitials").val();
    if (item.ObjScriptDTO.ScriptExchange == "FOREX" && Companyinitials == "RT") {
        item.ObjScriptDTO.Lastprice = (item.ObjScriptDTO.Lastprice).toFixed(5);
        item.OrderPrice = (item.OrderPrice).toFixed(5);
        item.TriggerPrice = (item.TriggerPrice).toFixed(5);
        item.SL = (item.SL).toFixed(5);
        item.TGT2 = (item.TGT2).toFixed(5);
        item.TGT3 = (item.TGT3).toFixed(5);
        item.TGT4 = (item.TGT4).toFixed(5);
    }
    var P_L = "";
    var CP = "";
    if (parseFloat(item.Profitorloss) >= 0) {
        P_L = '<font style="color:#4987ee !important;font-weight:bold;">' + item.Profitorloss + '</font>';
    }
    else if (parseFloat(item.Profitorloss) < 0) {
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
    var css = "row-New-Theme p-2 watchlistRow";
    var GetQtyType = item.TRADING_UNIT;
    var Div_SL_TGT_STATUS = '';
    var buyButton = '';
    var sellButton = '';
    var CurrentPosition = '';
    buyButton = ' <button class="btn btn-danger btn-sm btn-Sqroff" id="btn-Sqroff' + item.ActiveTradeID + '" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
    sellButton = ' <button class="btn btn-danger btn-sm btn-Sell btn-Sqroff" id="btn-Sqroff' + item.ActiveTradeID + '" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';

    var RejectedOrderDeleteBtn = '';

    if (item.CurrentPositionNew == "Buy") {
        CurrentPosition = sellButton;
        CP = '<font style="color:#4987ee !important;font-weight:bold;">' + item.CurrentPositionNew + '</font>';

    }
    else if (item.CurrentPositionNew == "Sell") {
        CurrentPosition = buyButton;
        CP = '<font style="color:#ff4a4a;font-weight:bold;">' + item.CurrentPositionNew + '</font>';
    }
    if ($('#IsTargetStopLossAbsolute').val() == 'True' && item.CurrentPositionNew == "Sell")
        sQty = "-" + sQty;

    if (item.Status.toUpperCase() == "REJECTED" || item.Status.toUpperCase() == "CANCELED" || item.Status.toUpperCase() == "OPEN") {
        RejectedOrderDeleteBtn = '<button class="btn btn-danger btn-sm btn-DelActive" type="button" id="btn-DelActive' + item.ActiveTradeID + '" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ')" data-bind=' + item.ActiveTradeID + '>Delete</button> ';
        CurrentPosition = RejectedOrderDeleteBtn;
    }


    if (item.SL == 0 && item.TGT2 == 0 && item.TGT3 == 0 && item.TriggerPrice < 0.1 && item.Status == "COMPLETE" || item.Status == "OPEN") {
        Div_SL_TGT_STATUS = '<div class="col-12" >' +
            '   <p class="watchlist-p" style="display:none;font-size: 11px;  margin-bottom: 5px;"> SL : ' + item.SL + ' | TGT : ' + item.TGT2 + ' | TGT2 : ' + item.TGT3 + ' | TGT3 : ' + item.TGT4 + '</p>' +
            '   <p class="watchlist-p" style="display:none;font-size: 11px;  margin-bottom: 5px;"> TRIGGER : ' + item.TriggerPrice + ' |  Status : ' + item.Status + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;">Date : ' + item.OrderDate + ' ' + item.OrderTime + ' | CP: ' + CP + ' </p>' +
            '</div>';
    }
    else {
        Div_SL_TGT_STATUS = '<div class="col-12" >' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> SL : ' + item.SL + ' | TGT : ' + item.TGT2 + ' | TGT2 : ' + item.TGT3 + ' | TGT3 : ' + item.TGT4 + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> TRIGGER : ' + item.TriggerPrice + ' |  Status : ' + item.Status + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;">Date : ' + item.OrderDate + ' ' + item.OrderTime + ' | CP: ' + item.CurrentPositionNew + ' </p>' +
            '</div>';
    }
    // var html = '<div class="row p-2 activeTradeRow" data-id=' + item.ActiveTradeID + '>' +
    //     '<div class="col-12" >' +
    //     '<div class="' + css + '">' +
    //     '<div class="card-body" style="padding:5px;">' +
    //     '   <div class="row">' +
    //     '<div class="col-6">' +
    //     ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 0px;">' + item.TradeSymbol + '</p>' +
    //     '</div>' +
    //     '<div class="col-6">' +
    //     '     <div class="row" style="margin-top:3px;">' +
    //     '          <div class="col-5">' +
    //     '               <label class="watchlist-p" style="font-size: 12px">' + GetQtyType + ': ' + sQty + '</label>' +
    //     '          </div>' +
    //     '             <div class="col-7" style="margin-left:-7px;">' +
    //     '                  <span class="watchlist-p" style="font-size: 12px;font-weight:bold"> LTP: ' +
    //     '               ' + item.ObjScriptDTO.Lastprice + '' +
    //     '                        </span>' +
    //     '                 </div>' +
    //     '              </div>' +
    //     '           </div>' +
    //     '<div class="col-5">' +
    //     '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 0px;margin-top:0px;">AVG : ' + item.OrderPrice + ' </p>' +
    //     '</div>' +
    //     '<div class="col-4">' +
    //     '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 0px;margin-top:0px;"> P&L : ' + P_L + ' </p>' +
    //     '</div>' +
    //     Div_SL_TGT_STATUS +
    //     '        </div>' +
    //     '     </div>' +
    //     '  </div>' +
    //     '</div >' +
    //     '</div >' +
    //     '<div style="    position: relative;min - height: 1px;left: 70vw;top: -40px;">' + CurrentPosition + '</div>';


    var _CurrentPosition = '';
    if (item.CurrentPositionNew == 'Buy') {
        _CurrentPosition = '<input type="button" class="btn btn-primary p-0 m-0 btnBuySell" value="Buy">';
    } else {
        _CurrentPosition = '<input type="button" class="btn btn-danger p-0 m-0 btnBuySell" value="Sell">';
    }
    var ExtraDetails = '';
    if (parseFloat(item.Profitorloss) >= 0) {
        ExtraDetails = `<div class="col-5 p-0" style="display: flex;justify-content: right;">
                                                                                                                                                        <h6 class="card-subtitle PriceSection">
                                                                                                                                                                                            Q:${sQty} | PL:
                                                                                                                                                        </h6>
                                                                                                          <h6 class="card-subtitle PriceSection" style="color:dodgerblue">
                                                                                                                                                                                            ${item.Profitorloss}
                                                                                                                                                        </h6>                                          </div>`;

    } else {
        ExtraDetails = `<div class="col-5 p-0" style="display: flex;justify-content: right;">
                                                                                                                                                                <h6 class="card-subtitle PriceSection">
                                                                                                                                                                                            Q:${sQty} | PL:
                                                                                                                                                                </h6>
                                                                                                                  <h6 class="card-subtitle PriceSection" style="color:orangered">
                                                                                                                                                                                                    ${item.Profitorloss}
                                                                                                                                                                </h6>                                          </div>`;

    }


    var html = `<li style="padding: 17px;">
                                            <a href="#"class="activeTradeRow" data-id='${item.ActiveTradeID}'>
                                    <div class="col-12 p-0" style="display: flex;">
                                    <div class="col-7 p-0">
                                            <h6 class="card-subtitle">${item.TradeSymbol}</h6>
                                            </div>
                                    ${ExtraDetails}
                                    </div>
                                    <div class="col-12  p-0 pt-1" style="display: flex;">
                                                                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;">
                                                                                                                                                ${_CurrentPosition}
                                                                                                                                        <h6 class="card-subtitle ScriptexchangeSection">
                                                                                                                                                            ${item.ObjScriptDTO.ScriptExchange}
                                                                                                                                        </h6>
                                                                                                                                    </div>
                                                                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;position: relative;justify-content: end;">

                                                                                                                                                                                <h6 class="card-subtitle ScriptexchangeSection" style="font-size: 14px!important;">${item.ObjScriptDTO.Lastprice}</h6>
                                                                                                                                    </div>
                                                                                                                                    <div class="col-6 p-0">
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </a>
                                                                                                                        </li>`;


    $('#' + TableName).append(html);


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
function buySellPopUp(ScriptCode, no, ScriptSymbol, WID, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, high = 0, low = 0, TriggerPrice = 0, SL = 0, Target = 0, PriceType = '', ProductType = '', TradeID = 0, sttus = '') {
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

function ConvertMISToCNC() {
    var id = $("#convertMisToCncModal").find("input[Name=convertActiveTradeID]").val();
    var st = $("#convertMisToCncModal").find("input[Name=convertStatus]").val();
    var param = $("#convertMisToCncModal").find("input[Name=convertParam]").val();
    var intQty = $("#convertMisToCncModal").find("input[Name=hdQty]").val();
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
    $("#convertMisToCncModal").modal('hide');
}

function convertButton(id, param, st, Qty, isManualStaratgy) {
    //$("#convertMisToCncModal").find(".convertMsg").text('Are you sure to convert MIS to CNC?');
    $("#convertMisToCncModal").find("input[Name=convertQty]").val(Qty);
    $("#convertMisToCncModal").find("input[Name=hdQty]").val(Qty);
    $("#convertMisToCncModal").find("input[Name=convertActiveTradeID]").val(id);
    $("#convertMisToCncModal").find("input[Name=convertStatus]").val(st);
    $("#convertMisToCncModal").find("input[Name=convertParam]").val(param);
    if (isManualStaratgy)
        $("#convertMisToCncModal").modal('show');
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

