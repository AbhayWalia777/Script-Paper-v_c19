$(document).ready(function () {
    $('.select2').select2();
    let EntrydateInput = document.getElementById('EntryTime');
    EntrydateInput.max = new Date().toISOString().split(".")[0];
    let ExitdateInput = document.getElementById('ExitTime');
    ExitdateInput.max = new Date().toISOString().split(".")[0];

    if ($("#companyInitial").val() == "ASR") {
        $("#TimingDiv").show();
    } else {
        $("#TimingDiv").hide();
    }
});

$('.addScriptBtn').on('click', function () {
    if ($("#WatchList option:selected").val() != "") {
        $("#addScriptModal").modal('show');
    }
    else {
        toastr.error("Please Select Watchlist");
    }
});

$("#txtScript").autocomplete({
    source: function (request, response) {
        var _ScriptExchange = $('#ScriptExchange').val();
        var _ScriptSegment = "";
        var _ScriptExpiry = "";
        var _ScriptStrike = "";
        $.ajax({
            url: "/Watchlist/GetScriptWithioutFilter",
            type: "GET",
            dataType: "json",
            data: { Search: request.term},
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
            $.ajax({
                url: "/Watchlist/GetScriptLotSize",
                type: "GET",
                dataType: "json",
                data: { scriptTradingSymbol: script_Trading_Symbol, scriptExchange: "" },
                success: function (data) {
                    $("#txtSize").val(data.Lot);
                    $("#scriptExchange").val(data.ScriptExchange);
                }
            });
        
    }
});
$('#saveScript').on('click', function () {
    var selectedWatchlist = $("#WatchList").val();
    if (selectedWatchlist != null && selectedWatchlist != "") {
        var WatchlistName = $("#WatchList option:selected").text();
        var txtUser = null; //it will fetch logged in user
        var lot = $("#LotSizeDiv #txtLot").val();
        var size = $("#LotSizeDiv #txtSize").val();
        var scriptTradingSymbol = $("#txtScript").val();
        var _ScriptExchange = $('#scriptExchange').val();
        if (scriptTradingSymbol != null && scriptTradingSymbol != '' && scriptTradingSymbol != undefined &&
            _ScriptExchange != null && _ScriptExchange != '') {
            var request = $.ajax({
                url: "/Watchlist/SaveWatchList",
                type: "POST",
                data: { scriptTradingSymbol: scriptTradingSymbol, intWID: selectedWatchlist, watchListName: WatchlistName, scriptExchange: _ScriptExchange, txtUser: txtUser, Lot: lot, Size: size },
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
                        toastr.error("Something Went Wrong");
                    }
                    else if (!results.IsError && results.ScriptCode != '' && results.ScriptCode != null) {
                        toastr.success("Script Added Successfully");
                        bindScript();
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

function bindScript() {
    if ($("#WatchList option:selected").val() != "") {
        $.ajax({
            url: '/Trade/GetScriptByWatchlistForManualTrade?Wid=' + $("#WatchList option:selected").val(),
            type: 'Get',
            success: function (data) {

                $('#ScriptCode').html('');
                $('#ScriptCode').append($("<option></option>").val("").html("-Select-"));
                var list = $('#ScriptCode');
                $.each(data, function (i, item) {
                    $('#ScriptCode').append($("<option></option>").val(item.ScriptCode).html(item.ScriptTradingSymbol + "/ " + item.ScriptSegment));
                });
            }
        });
    }
}
$("#WatchList").on('change', function () {
    if ($("#WatchList option:selected").val() != "") {
        $.ajax({
            url: '/Trade/GetScriptByWatchlistForManualTrade?Wid=' + $("#WatchList option:selected").val(),
            type: 'Get',
            success: function (data) {

                $('#ScriptCode').html('');
                $('#ScriptCode').append($("<option></option>").val("").html("-Select-"));
                var list = $('#ScriptCode');
                $.each(data, function (i, item) {
                    $('#ScriptCode').append($("<option></option>").val(item.ScriptCode).html(item.ScriptTradingSymbol + "/ " + item.ScriptSegment));
                });
            }
        });
    }
});
$("#ScriptCode").on('change', function () {
    if ($("#ScriptCode option:selected").val() != "" && $("#ProductType option:selected").val() != "" && $("#WatchList option:selected").val() != "") {
        $.ajax({
            url: '/Trade/GetScriptDataByScriptCode?Wid=' + $("#WatchList option:selected").val() + '&ScriptCode=' + $("#ScriptCode option:selected").val() + '&ProductType=' + $("#ProductType option:selected").val(),
            type: 'Get',
            success: function (data) {
                $("#LastPrice").val(data.LastPrice);
                $("#ScriptExchange").val(data.ScriptExchange);
                $("#Size").val(data.Size);
            }
        });
    } else {
        toastr.error('Mandatory fields missing!!');
    }
});
$(".refresh").on('click', function () {
    if ($("#ScriptCode option:selected").val() != "" && $("#ProductType option:selected").val() != "" && $("#WatchList option:selected").val() != "") {
        $.ajax({
            url: '/Trade/GetScriptDataByScriptCode?Wid=' + $("#WatchList option:selected").val() + '&ScriptCode=' + $("#ScriptCode option:selected").val() + '&ProductType=' + $("#ProductType option:selected").val(),
            type: 'Get',
            success: function (data) {
                $("#LastPrice").val(data.LastPrice);
            }
        });
    }
    else {
        toastr.error('Mandatory fields missing!!');
    }
});
$("#EntryPrice").on('keyup', function () {
    if ($("#BuyOrSell").val() != "") {
        var _profitLoss = 0;
        var _Qty = parseFloat($("#Qty").val());
        var _Size = parseFloat($("#Size").val());
        var _ScriptExchange = parseFloat($("#ScriptExchange").val());
        var _EntryPrice = parseFloat($("#EntryPrice").val());
        var _ExitPrice = parseFloat($("#ExitPrice").val());

        if (_ScriptExchange != "NFO") {
            _Qty = _Size * _Qty;
        }
        if ($("#BuyOrSell").val() == "BUY") {
            _profitLoss = _Qty * (_ExitPrice - _EntryPrice);
        }
        else {
            _profitLoss = _Qty * (_EntryPrice - _ExitPrice);
        }
        $("#ProfitOrLoss").val(_profitLoss.toFixed(4));
    }
    else {
        toastr.error("Please Fill The Position");
    }
});
$("#ExitPrice").on('keyup', function () {
    if ($("#BuyOrSell").val() != "") {
        var _profitLoss = 0;
        var _Qty = parseFloat($("#Qty").val());
        var _Size = parseFloat($("#Size").val());
        var _ScriptExchange = $("#ScriptExchange").val();
        var _EntryPrice = parseFloat($("#EntryPrice").val());
        var _ExitPrice = parseFloat($("#ExitPrice").val());

        if (_ScriptExchange != "NFO") {
            _Qty = _Size * _Qty;
        }
        if ($("#BuyOrSell").val() == "BUY") {
            _profitLoss = _Qty * (_ExitPrice - _EntryPrice);
        }
        else {
            _profitLoss = _Qty * (_EntryPrice - _ExitPrice);
        }
        $("#ProfitOrLoss").val(_profitLoss.toFixed(4));
    }
    else {
        toastr.error("Please Fill The Position");
    }
});
$('.createOrderBtn').on('click', function () {
    $('.createOrderBtn').text('Creating Order...');
    $('.createOrderBtn').attr("disabled", "disabled");


    if ($("#Watchlist").val() != '' && $("#ProductType").val() != '' && $("#ScriptCode").val() != '' && $("#BuyOrSell").val() != '' && $("#Qty").val() != ''
        && $("#EntryPrice").val() != '' && $("#ProfitOrLoss").val() != '' && $("#Status").val() != '' && $("#UserIds").val() != '') {

        var userIds = "";
        userIds = $('#UserIds').val().join(",");


        var request = $.ajax({
            url: "/Trade/InsertManualActiveOrder",
            type: "POST",
            data: {
                Wid: parseInt($("#WatchList option:selected").val()), ScriptCode: $("#ScriptCode").val(),
                ProductType: $("#ProductType").val(), BuyOrSell: $("#BuyOrSell").val(), Qty: $("#Qty").val(),
                EntryPrice: $("#EntryPrice").val(),
                ExitPrice: $("#ExitPrice").val(), ProfitOrLoss: $("#ProfitOrLoss").val(), Status: $("#Status").val(),
                Users: userIds, EntryTime: $("#EntryTime").val(), ExitTime: $("#ExitTime").val()
            },
            success: function (data) {
                if (data > 0) {
                    $("#Watchlist").val("");
                    $("#ProductType").val("");
                    $("#BuyOrSell").val("");
                    $("#Qty").val("");
                    $("#ScriptCode").val("");
                    $("#EntryPrice").val("");
                    $("#ExitPrice").val("");
                    $("#Status").val("");
                    $("#ProfitOrLoss").val("");
                    $("#EntryTime").val("");
                    $("#ExitTime").val("");
                    toastr.success('Order Placed Successfully');

                }
                else {
                    toastr.error('Something Went Wrong With The Order');
                }
            }
        });

    }
    else {
        toastr.error("Fill All The Details.");
    }

    $('.createOrderBtn').text('Create Order');
    $('.createOrderBtn').removeAttr("disabled");
});
function SwitchDataTheme() {
    var data = localStorage.getItem('IsDark');
    if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({ 'background-color': 'black', 'color': 'white' });
        $('li').css('color', 'white');
        $('.box-header').css('color', 'white');
        $('.content-header>.breadcrumb>li>a').css('color', 'white');
        $('#mainWindow').css('background-color', 'black');
        $('.box-title').css('color', 'white');
        $('input').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('.form-control').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('#EntryTime').css({ 'color': 'black', 'background-color': 'lightgray' });
        $('#ExitTime').css({ 'color': 'black', 'background-color': 'lightgray' });
        $('li.disabled > a').css({ 'background-color': 'black', 'color': 'white' });
        $('.main-footer').css({ 'background-color': 'black', 'color': 'white' });
        $('.sorting_1').css('border', '0px solid black');

        var NewUI = '';
        if (MySkin.SkinName != '') {
            NewUI = MySkin.SkinName;
        }
        else {
            if (typeof (Storage) !== 'undefined') {
                NewUI = localStorage.getItem('skin');
            }
        }
        if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
            $('input[disabled],input[readonly]').css({ 'background-color': 'gray', 'color': 'black' });
            $('input[readonly]').css('cursor', 'not-allowed');
            $('input[readonly] .form-control').css('cursor', 'not-allowed');
        }
        else {
            $('input[disabled]').css('background-color', 'var(--main-color-on-layoutchange)');
            $('input[readonly]').css('background-color', 'var(--main-color-on-layoutchange)');
            $('input[readonly]').css('cursor', 'not-allowed');
            $('input[readonly] .form-control').css('cursor', 'not-allowed');
        }
    }
}