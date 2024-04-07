var intervalSensexNifty;
var intervalWatchList;
var Id_for_Controls;
var sqModal;

document.getElementById("NavbarOrder").classList.add("active");
function BindClick() {
    $('.activeTradeRow').on('click', function (event) {
        if ($(event.target).is(':checkbox')) {
            // If the clicked element is a checkbox, do nothing
            return;
        }

        var ScriptCode = $(this).attr('data-id');
        window.location.href = "/Trade/ActiveTrade?ActiveTradeID=" + ScriptCode;
    });
    $('.activeTradeRow :checkbox').on('change', function () {
        var checkboxId = $(this).attr('id');
        var isChecked = $(this).prop('checked');
        localStorage.setItem(checkboxId, isChecked);
        var checkedCount = $('.activeTradeRow :checkbox:checked').length;
        if (checkedCount > 0) {
            $('.BtnSqrOffSelected').show();
        } else {
            $('.BtnSqrOffSelected').hide();
        }
    });
    $('.activeTradeRow :checkbox').each(function () {
        var checkboxId = $(this).attr('id');
        var isChecked = localStorage.getItem(checkboxId);
        if (isChecked === 'true') {
            $(this).prop('checked', true);
        }
    });
    var checkedCount = $('.activeTradeRow :checkbox:checked').length;
    if (checkedCount > 0) {
        $('.BtnSqrOffSelected').show();
    } else {
        $('.BtnSqrOffSelected').hide();
    }
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
    $('#ActiveTradeDiv').html('');
    $('#PendingTradeDiv').html('');
    $('#RejectedTradeDiv').html('');
    if (results != null) {
        if (results.ActiveTrade != null) {
            //Set data for WatchList trade
            if (results.ActiveTrade.length > 0) {
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
                $('.OrderTotalProfitLoss').html(Total_Profit.toFixed(2));
                if (Total_Profit > 0) {
                    $('.OrderTotalProfitLoss').css('color', 'dodgerblue');
                }
                else {
                    $('.OrderTotalProfitLoss').css('color', 'OrangeRed');
                }
            }
            else {
                $('.OrderTotalProfitLoss').html('0');
            }
        }
        else {
            $('.OrderTotalProfitLoss').html('0');
        }
    }
    else {

        $('.OrderTotalProfitLoss').html('0');
    }
    if ($('#ActiveTradeDiv').html() == '')
        $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
    if ($('#PendingTradeDiv').html() == '')
        $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Pending Trade Available.</p>');
    if ($('#RejectedTradeDiv').html() == '')
        $('#RejectedTradeDiv').html('<p class="text-center" style="color:#fff">No Rejected Trade Available.</p>');
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
    var SqrCheckBox = `<input type="checkbox" class="SqrOffcheckbox" id="${item.ActiveTradeID}" value="${item.UserID}" data-ActiveTradeId="${item.ActiveTradeID}"/>`;

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
                                                                                                                                         ${SqrCheckBox}       ${_CurrentPosition}
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



function SqrOffChecked() {
    var UserIds = "";
    var TradeSymbols = "";

    var checkboxes = document.querySelectorAll('.SqrOffcheckbox');
    checkboxes.forEach(function (checkbox) {
        // Check if the checkbox is checked
        if (checkbox.checked) {
            UserIds += checkbox.value + ",";
            TradeSymbols += checkbox.getAttribute('data-ActiveTradeId') + ",";
        }
    });

    if (UserIds.length > 0 && TradeSymbols.length > 0) {

        UserIds = UserIds.slice(0, UserIds.length - 1);
        TradeSymbols = TradeSymbols.slice(0, TradeSymbols.length - 1);
        var request = $.ajax({
            url: "/Trade/SqrOffTradeCapital",
            type: "Get",
            data: { 'userIds': UserIds, 'TradeSymbols': TradeSymbols },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                if (results.exceptionDTO.id == 1) {
                    SuccessAlert(results.exceptionDTO.Msg);
                }
                else if (results.exceptionDTO.id == 0 || results.exceptionDTO.id == 2) {
                    ErrorAlert(results.exceptionDTO.Msg);
                }
            }
        });
    }
    else {
        toastr.warning('Please select atleast one trade.');
    }
}