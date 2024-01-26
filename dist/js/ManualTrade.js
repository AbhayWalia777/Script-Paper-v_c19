$(document).ready(function (){

let EntrydateInput=document.getElementById('EntryTime');
EntrydateInput.max= new Date().toISOString().split(".")[0];
let ExitdateInput=document.getElementById('ExitTime');
ExitdateInput.max= new Date().toISOString().split(".")[0];
});

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
                $("#Size").val(100000);
            }
        });
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
$('.createOrderBtn').on('click', function () {
var DT=new Date();
var entry_date=$("#EntryTime").val();
var exit_date=$("#ExitTime").val();
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
            && $("#EntryTime").val() != '' && $("#ExitTime").val() != '' && $("#EntryPrice").val() != '' && $("#ExitPrice").val() != ''
            && $("#ProfitOrLoss").val() != '' && $("#Status").val() != '') {

            var request = $.ajax({
                url: "/Trade/InsertManualOrder",
                type: "POST",
                data: {
                    Wid: parseInt($("#WatchList option:selected").val()), ScriptCode: $("#ScriptCode").val(),
                    ProductType: $("#ProductType").val(), BuyOrSell: $("#BuyOrSell").val(), Qty: $("#Qty").val(),
                    EntryTime: $("#EntryTime").val(), ExitTime: $("#ExitTime").val(), EntryPrice: $("#EntryPrice").val(),
                    ExitPrice: $("#ExitPrice").val(), ProfitOrLoss: $("#ProfitOrLoss").val(), Status: $("#Status").val()
                },
                success: function (data) {
                    if (data > 0) {
                        $("#Watchlist").val("");
                        $("#ProductType").val("");
                        $("#BuyOrSell").val("");
                        $("#Qty").val("");
                        $("#EntryTime").val("");
                        $("#ExitTime").val("");
                        $("#ScriptCode").val("");
                        $("#EntryPrice").val("");
                        $("#ExitPrice").val("");
                        $("#Status").val("");
                        $("#ProfitOrLoss").val("");
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
function SwitchDataTheme() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
                          }
    else {
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('li').css('color','white');
        $('.box-header').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('#EntryTime').css({'color':'black','background-color':'lightgray'});
        $('#ExitTime').css({'color':'black','background-color':'lightgray'});
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.sorting_1').css('border','0px solid black');

var NewUI='';
        if (MySkin.SkinName != '')
        {
        NewUI = MySkin.SkinName;
        }
        else
        {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin');
        }
        }
         if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
                $('input[disabled],input[readonly]').css({'background-color':'gray','color':'black'});
                $('input[readonly]').css('cursor','not-allowed');
                $('input[readonly] .form-control').css('cursor','not-allowed');
                }
                else
                {
                    $('input[disabled]').css('background-color','var(--main-color-on-layoutchange)');
                    $('input[readonly]').css('background-color','var(--main-color-on-layoutchange)');
                    $('input[readonly]').css('cursor','not-allowed');
                    $('input[readonly] .form-control').css('cursor','not-allowed');
                }
    }
}