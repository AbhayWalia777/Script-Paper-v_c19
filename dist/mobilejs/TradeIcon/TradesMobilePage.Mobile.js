var intervalSensexNifty;
var intervalWatchList;
var Id_for_Controls;
var sqModal;
var interval;


function SetScriptNameData() {
    var Tempscriptname = $('#Drp-Segments option:selected').val();
    var WID = Tempscriptname.split('>')[0];
    var ScriptInstrumentType = Tempscriptname.split('>')[1];
    var input = { 'ScriptExchange': WID, 'ScriptInstrumentType': ScriptInstrumentType };
    var request = $.ajax({
        url: "/Trade/GetScriptNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (data) {
            SetResult(data);
        }
    });
}
function SetResult(results) {
    //var results = JSON.parse(data);
    if (results != null) {
        $('#Drp-Segments-ScriptName').html('');
        if (results != null) {
            //Set data for WatchList trade
            if (results.length > 0) {
                $('#Drp-Segments-ScriptName').append(new Option("ALL", "ALL"));
                $('.TxtScriptName_ID').html('ALL');
                for (var i = 0; i < results.length; i++) {
                    var result = results[i].ScriptName;
                    $('#Drp-Segments-ScriptName').append(new Option(result, result));
                }
            }
            else {
                $('#Drp-Segments-ScriptName').html('');
            }
        }
    }
}
$(document).ready(function () {

    $('.classDate').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' });

    $('.classDate').datepicker({
        autoclose: true,
        useCurrent: true,
        todayHighlight: true,
        todayBtn: "linked",
    });

    var today = new Date();
    var date = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    date.setDate(date.getDate() - 7);
    dd = String(date.getDate()).padStart(2, '0');
    mm = String(date.getMonth() + 1).padStart(2, '0');
    yyyy = date.getFullYear();
    var previousDay = mm + '/' + dd + '/' + yyyy;

    //interval = setInterval(function () { $(".datepicker").css('left', '100'); }, 10);

    $('#rptStartDate').val(today);
    $('#rptEndDate').val(today);
    $('#backbtn').css('color', '#fff');
    $('#backbtn').on('click', function () {
        window.location.href = "/Trade/Index";
    });
    $('#btn-filter-Main').on('click', function () {
        SetScriptNameData();
        $('#searchText').val("");
        $('#searchText-add').val("");
        var $options = $('#Drp-Segments>option').clone();
        $('#Drp-Segments-add').html('');
        $('#Drp-Segments-add').append($options);
        $('#Drp-Segments-add').val($('#Drp-Segments option:selected').val());
        $(".AddDeleteScriptDiv").css('display', 'inherit');
        $("#DivCompletedtrade").css('display', 'none');
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
});
function HidePopUp() {
    $(".AddDeleteScriptDiv").css('display', 'none');
    $("#DivCompletedtrade").css('display', 'inherit');

}
function LoadData() {

    var Tempscriptname = $('#Drp-Segments option:selected').val();
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
function SetCompletedResult(results) {
    //var results = JSON.parse(data);
    if (results != null) {
        $('#DivCompletedtrade').html('');
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                setcompltedresultdata(result);
            }
        }
        else {
            var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style=" padding: 10px; border-bottom: 1px solid lightgray; width: 100vw; position: relative; left: -15px; text-align: center; font-size: 13px;">No Trades Found.</div >';

            $('#DivCompletedtrade').append(html);
        }
    }
    HidePopUp();

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
    var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div" style="">' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.TradeSymbol +
        '</div>' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.ExitDate + '&nbsp;' + item.Exittime +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        CpDiv + '(' + ProductType + ')' +
        '</div>' +
        Qty+
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        '<b style="font-weight:bold;">' + item.Exitprice.toFixed(2) +'</b>' +
        '</div>' +
        '</div>' +
        '</div>';

    $('#DivCompletedtrade').append(html);

}