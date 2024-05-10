$(document).ready(function (){

let EntrydateInput=document.getElementById('Entrytime');
EntrydateInput.max= new Date().toISOString().split(".")[0];
let ExitdateInput=document.getElementById('Exittime');
ExitdateInput.max= new Date().toISOString().split(".")[0];
});

$("#WatchList").on('change', function () {
    if ($("#WatchList option:selected").val() != "") {
        $.ajax({
            url: '/Trade/GetScriptByWatchlistForManualTrade',
            type: 'Get',
            data: { 'WID': $("#WatchList option:selected").val() },
            dataType: 'json',
            success: function (Resp) {
                var data = JSON.parse(Resp);
                $('#ScriptCode').html('');
                $('#ScriptCode').append($("<option></option>").val("").html("-Select-"));
                var list = $('#ScriptCode');
                $.each(data, function (i, item) {
                    $('#ScriptCode').append($("<option></option>").val(item.ScriptCode).html(item.ScriptTradingSymbol + "/ " + item.Scriptsegment));
                });
            }
        });
    }
});
$("#ScriptCode").on('change', function () {
    if ($("#ScriptCode option:selected").val() != "" && $("#ProductType option:selected").val() != "" && $("#WatchList option:selected").val() != "") {
        $.ajax({
            url: '/Trade/GetScriptDataByScriptCode?WID=' + $("#WatchList option:selected").val() + '&ScriptCode=' + $("#ScriptCode option:selected").val() + '&ProductType=' + $("#ProductType option:selected").val(),
            type: 'Get',
            success: function (Resp) {
                var data = JSON.parse(Resp);
                $("#Lastprice").val(data.Lastprice);
                $("#ScriptExchange").val(data.ScriptExchange);
                $("#Size").val(100000);
            }
        });
    }
});
$(".refresh").on('click', function () {
    if ($("#ScriptCode option:selected").val() != "" && $("#ProductType option:selected").val() != "" && $("#WatchList option:selected").val() != "") {
        $.ajax({
            url: '/Trade/GetScriptDataByScriptCode?WID=' + $("#WatchList option:selected").val() + '&ScriptCode=' + $("#ScriptCode option:selected").val() + '&ProductType=' + $("#ProductType option:selected").val(),
            type: 'Get',
            success: function (Resp) {
                var data = JSON.parse(Resp);
                $("#Lastprice").val(data.Lastprice);
            }
        });
    }
});
$("#Entryprice").on('keyup', function () {
    if ($("#BuyOrSell").val() != "") {
        var _profitLoss = 0;
        var _Qty = parseFloat($("#Qty").val());
        var _Size = parseFloat($("#Size").val());
        var _ScriptExchange = parseFloat($("#ScriptExchange").val());
        var _EntryPrice = parseFloat($("#Entryprice").val());
        var _ExitPrice = parseFloat($("#Exitprice").val());

        if (_ScriptExchange != "NFO") {
            _Qty = _Size * _Qty;
        }
        if ($("#BuyOrSell").val() == "Buy") {
            _profitLoss = _Qty * (_ExitPrice - _EntryPrice);
        }
        else {
            _profitLoss = _Qty * (_EntryPrice - _ExitPrice);
        }
        $("#Profitorloss").val(_profitLoss.toFixed(4));
    }
    else {
        toastr.error("Please Fill The position");
    }
});
$("#Exitprice").on('keyup', function () {
    if ($("#BuyOrSell").val() != "") {
        var _profitLoss = 0;
        var _Qty = parseFloat($("#Qty").val());
        var _Size = parseFloat($("#Size").val());
        var _ScriptExchange = parseFloat($("#ScriptExchange").val());
        var _EntryPrice = parseFloat($("#Entryprice").val());
        var _ExitPrice = parseFloat($("#Exitprice").val());

        if (_ScriptExchange != "NFO") {
            _Qty = _Size * _Qty;
        }
        if ($("#BuyOrSell").val() == "Buy") {
            _profitLoss = _Qty * (_ExitPrice - _EntryPrice);
        }
        else {
            _profitLoss = _Qty * (_EntryPrice - _ExitPrice);
        }
        $("#Profitorloss").val(_profitLoss.toFixed(4));
    }
    else {
        toastr.error("Please Fill The position");
    }
});
$('.createOrderBtn').on('click', function () {
var DT=new Date();
var entry_date=$("#Entrytime").val();
var exit_date=$("#Exittime").val();
var todaydate='';
if((DT.getMonth()+1)<9)
todaydate= DT.getFullYear()+'-0'+(DT.getMonth()+1)+'-'+DT.getDate()+'T'+DT.getHours()+':'+DT.getMinutes();
else
todaydate= DT.getFullYear()+'-'+(DT.getMonth()+1)+'-'+DT.getDate()+'T'+DT.getHours()+':'+DT.getMinutes();

if(entry_date>todaydate || exit_date>todaydate)
{
toastr.error('Please select correct date.');
}
else
{
    $('.createOrderBtn').text('Creating Order...');
    $('.createOrderBtn').attr("disabled", "disabled");

    if ($('#roleId').val() == "6") {
        if ($("#Watchlist").val() != '' && $("#ProductType").val() != '' && $("#ScriptCode").val() != '' && $("#BuyOrSell").val() != '' && $("#Qty").val() != ''
            && $("#Entrytime").val() != '' && $("#Exittime").val() != '' && $("#Entryprice").val() != '' && $("#Exitprice").val() != ''
            && $("#Profitorloss").val() != '' && $("#Status").val() != '') {

            var request = $.ajax({
                url: "/Trade/InsertManualOrder",
                type: "POST",
                data: {
                    WID: parseInt($("#WatchList option:selected").val()), ScriptCode: $("#ScriptCode").val(),
                    ProductType: $("#ProductType").val(), BuyOrSell: $("#BuyOrSell").val(), Qty: $("#Qty").val(),
                    Entrytime: $("#Entrytime").val(), Exittime: $("#Exittime").val(), Entryprice: $("#Entryprice").val(),
                    Exitprice: $("#Exitprice").val(), Profitorloss: $("#Profitorloss").val(), Status: $("#Status").val()
                },
                success: function (data) {
                    if (data > 0) {
                        $("#Watchlist").val("");
                        $("#ProductType").val("");
                        $("#BuyOrSell").val("");
                        $("#Qty").val("");
                        $("#Entrytime").val("");
                        $("#Exittime").val("");
                        $("#ScriptCode").val("");
                        $("#Entryprice").val("");
                        $("#Exitprice").val("");
                        $("#Status").val("");
                        $("#Profitorloss").val("");
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
    }
    else {
        toastr.error("You Are Not Authorized To Create A Order");
    }
    $('.createOrderBtn').text('Create Order');
    $('.createOrderBtn').removeAttr("disabled");
}
});