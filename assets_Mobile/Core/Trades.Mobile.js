var TotalPageNo = 0;
var isCallf = false;
var Page_No = 1;

function SetWalletTransactionDetails(item) {
    var balance = parseFloat(item.amount);
    var _balanceHtml = '';
    if (balance >= 0) {
        _balanceHtml = `<h6 class="card-subtitle" style="color:dodgerblue">
                                                                            ${balance.toFixed(2)}
                                                                </h6>`;
    } else {
        _balanceHtml = `<h6 class="card-subtitle" style="color:orangered">
                                                                                    ${balance.toFixed(2)}
                                                                        </h6>`;
    }
    $('#watchlistDiv').append(`
                                                            <li style="padding: 17px;">
                                                            <a href="#">
                                                                <div class="col-12 p-0" style="display: flex;">
                                                                        <div class="col-5 p-0">
                                                                                    ${_balanceHtml}
                                                                            </div>
                                                                    <div class="col-7 p-0" style="display: flex;justify-content: right;">
                                                                                <h6 class="card-subtitle">${item.Date_Time_String}</h6>
                                                                    </div>

                                                                </div>
                                                                <div class="col-12 p-0 pt-2" style="display: flex;">
                                                                                                <h6 class="card-subtitle">${item.Description}</h6>
                                                                </div>
                                                            </a>
                                                        </li>

                                                    `);
}

function SetScriptNameData() {
    var Tempscriptname = $('#Drp-Segments-add option:selected').val();
    var WID = Tempscriptname.split('>')[0];
    var ScriptInstrumentType = Tempscriptname.split('>')[1];
    var input = { 'ScriptExchange': WID, 'ScriptInstrumentType': ScriptInstrumentType };
    var request = $.ajax({
        url: "/Trade/GetScriptNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (_data) {
            var results = JSON.parse(_data);
            if (results != null) {
                $('#Drp-Segments-ScriptName').html('');
                if (results != null) {
                    //Set data for WatchList trade
                    var _results = results.data;
                    if (_results.length > 0) {
                        $('#Drp-Segments-ScriptName').append(new Option("ALL", "ALL"));
                        $('.TxtScriptName_ID').html('ALL');
                        for (var i = 0; i < _results.length; i++) {
                            var result = _results[i];
                            $('#Drp-Segments-ScriptName').append(new Option(result, result));
                        }
                    }
                    else {
                        $('#Drp-Segments-ScriptName').html('');
                    }
                }
            }
        }
    });
}
$(document).ready(function () {

    var today = new Date();
    var date = new Date();
    date.setDate(date.getDate() - 30);

    var ddToday = String(today.getDate()).padStart(2, '0');
    var mmToday = String(today.getMonth() + 1).padStart(2, '0');
    var yyyyToday = today.getFullYear();
    var todayFormatted = yyyyToday + '-' + mmToday + '-' + ddToday;

    var ddPrevious = String(date.getDate()).padStart(2, '0');
    var mmPrevious = String(date.getMonth() + 1).padStart(2, '0');
    var yyyyPrevious = date.getFullYear();
    var previousDayFormatted = yyyyPrevious + '-' + mmPrevious + '-' + ddPrevious;

    $('#rptStartDate').val(previousDayFormatted);
    $('#rptEndDate').val(todayFormatted);

    $('#btn-filter-Main').on('click', function () {
        SetScriptNameData();
        $('#searchText').val("");
        $('#searchText-add').val("");
        $(".AddDeleteScriptDiv").css('display', 'inherit');
        $("#watchlistDiv").css('display', 'none');
        $('.TxtCurrentPosition_ID').html($('#Drp-Segments-CurrentPosition option:selected').text());
        $('.TxtScriptName_ID').html($('#Drp-Segments-ScriptName option:selected').text());
        $('.TxtReportType_ID').html($('#Drp-Segments-ReportType option:selected').text());
        $('.TxtGroupBy_ID').html($('#Drp-Segments-GroupBy option:selected').text());
    });
    $(document).on('change', '#Drp-Segments-add', function () {
        $('#Drp-Segments').val($('#Drp-Segments-add option:selected').val());
        $('.TxtSegment_ID').html($('#Drp-Segments option:selected').text());
        localStorage.setItem('GetSegments', $('#Drp-Segments option:selected').val());
        SetScriptNameData();
        $('.TxtScriptName_ID').html($('#Drp-Segments-ScriptName option:selected').text());
    });
    $(document).on('change', '#Drp-Segments-ScriptName', function () {
        $('.TxtScriptName_ID').html($('#Drp-Segments-ScriptName option:selected').text());
    });
    $(document).on('change', '#Drp-Segments-CurrentPosition', function () {
        $('.TxtCurrentPosition_ID').html($('#Drp-Segments-CurrentPosition option:selected').text());
    });
    $(document).on('change', '#Drp-Segments-GroupBy', function () {
        $('.TxtGroupBy_ID').html($('#Drp-Segments-GroupBy option:selected').text());
    });
    $(document).on('change', '#Drp-Segments-ReportType', function () {
        $('.TxtReportType_ID').html($('#Drp-Segments-ReportType option:selected').text());
    });
    $('#Btn_CompletedTrade').on('click', function () {
        LoadData();
    });
    LoadData();
    SetScriptNameData();
});
function LoadData() {

    var Tempscriptname = $('#Drp-Segments-add option:selected').val();
    var ScriptExchange = Tempscriptname.split('>')[0];
    var ScriptInstumentType = Tempscriptname.split('>')[1];
    var ScriptTradingSymbol = $('#Drp-Segments-ScriptName option:selected').val();
    var CurrentPosition = $('#Drp-Segments-CurrentPosition option:selected').val();
    var startDate = $('#rptStartDate').val();
    var endDate = $('#rptEndDate').val();
    if (startDate != "" && endDate != "") {

        var input = { 'startDate': startDate, 'endDate': endDate, 'ScriptExchange': ScriptExchange, 'ScriptInstumentType': ScriptInstumentType, 'CurrentPosition': CurrentPosition, 'ScriptTradingSymbol': ScriptTradingSymbol, "IsOrderLog": 1 };
        var request = $.ajax({
            url: "/Trade/GetCompletedTradeForTradesPage",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (data) {
                SetCompletedResult(data);
            }
        });

    }
    else {
        toastr.error("Please Fill all the required Options.");
    }
}
function SetCompletedResult(_data) {
    var _results = JSON.parse(_data);
    var results = _results.data;
    if (results != null) {
        $('#watchlistDiv').html('');
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                setcompltedresultdata(result);
            }
        }
        else {
            var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style=" padding: 10px; border-bottom: 1px solid lightgray; width: 100vw; position: relative; left: -15px; text-align: center; font-size: 13px;">No Trades Found.</div >';

            $('#watchlistDiv').append(html);
        }
    }
}
function setcompltedresultdata(item) {

    if (item.TRADING_UNIT_TYPE == 1) {
        OutputQty = item.Qty / item.ScriptLotSize;
    }
    else {
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || (item.COMPANY_INITIAL == "RVERMA"))) {
            OutputQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            OutputQty = item.Qty;
        }
    }
    var GetQtyType = item.TRADING_UNIT_TYPE == 2 ? 'U' : '';
    var Qty = "";
    if (item.TRADING_UNIT_TYPE == 1) {
        Qty = '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' + item.Qty.toFixed(2) + '(' + OutputQty + ')' + '</div>';
    } else {
        Qty = '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' + item.Qty.toFixed(2) + '</div>';
    }

    var CpDiv = item.CurrentPosition == "Buy" ? '<spam style="color:dodgerblue">' + item.CurrentPosition + '</spam>' : '<spam style="color:orangered">' + item.CurrentPosition + '</spam>';
    var PlDiv = item.Profitorloss > 0 ? '<spam style="color:dodgerblue">' + item.Profitorloss.toFixed(2) + '</spam>' : '<spam style="color:orangered">' + item.Profitorloss.toFixed(2) + '</spam>';
    var ProductType = item.ProductType == "NRML" ? "NRM" : item.ProductType;

    var _CurrentPosition = '';
    if (item.CurrentPosition == 'Buy') {
        _CurrentPosition = '<input type="button" class="btn btn-primary p-0 m-0 btnBuySell" value="Buy">';
    } else {
        _CurrentPosition = '<input type="button" class="btn btn-danger p-0 m-0 btnBuySell" value="Sell">';
    }

    //var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div" style="">' +
    //    '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
    //    item.TradeSymbol +
    //    '</div>' +
    //    '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
    //    item.ExitDate + '&nbsp;' + item.Exittime +
    //    '</div>' +
    //    '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
    //    '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
    //    CpDiv + '(' + ProductType + ')' +
    //    '</div>' +
    //    Qty +
    //    '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
    //    '<b style="font-weight:bold;">' + item.Exitprice.toFixed(2) + '</b>' +
    //    '</div>' +
    //    '</div>' +
    //    '</div>';
    var StatusMessage = item.Status;
    if (item.StatusMessage != '') {
        StatusMessage = item.StatusMessage;
    }



    $('#watchlistDiv').append(`<li style="padding: 17px;">
                                            <a href="#">
                                    <div class="col-12 p-0" style="display: flex;">
                                    <div class="col-7 p-0">
                                    <h6 class="card-subtitle">${item.TradeSymbol}</h6>
                                            </div>
                                    <div class="col-5 p-0" style="display: flex;justify-content: right;">
                                                                                                                                                                <h6 class="card-subtitle PriceSection">
                                                                                                                                                                                            ${item.ExitDate + " " + item.Exittime}
                                                                                                                                                                </h6>
                                                                                                                                                       </div>
                                    </div>
                                    <div class="col-12  p-0 pt-1" style="display: flex;">
                                                                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;">
                                                                                                                                         ${_CurrentPosition}
                                                                                                                                        <h6 class="card-subtitle ScriptexchangeSection">
                                                                                                                                                            ${item.ScriptExchange}
                                                                                                                                        </h6>
                                                                                                                                    </div>
                                                                                                                                    <div class="col-6 p-0 d-flex" style="gap: 9px;position: relative;justify-content: end;">

                                                                                                                                                                                <h6 class="card-subtitle ScriptexchangeSection d-flex" style="font-size: 14px!important;">
                                                                                                                                                                                Q: ${OutputQty.toFixed(2) } P:${item.Exitprice.toFixed(2)}
                                                                                                                                                                                </h6>
                                                                                                                                    </div>
                                                                                                                                    <div class="col-6 p-0">
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                                
                                                                                                                                
                                                                                                                                <div class="col-12  p-0 pt-1" style="display: flex;gap: 9px;">
                                                                                                                                   
                                                                                                                                        <h6 class="card-subtitle ScriptexchangeSection" style="font-size: 14px !important;">
                                                                                                                                                            ${StatusMessage}
                                                                                                                                        </h6>
                                                                                                                                    </div>
                                                                                                                            </a>
                                                                                                                        </li>`);

}