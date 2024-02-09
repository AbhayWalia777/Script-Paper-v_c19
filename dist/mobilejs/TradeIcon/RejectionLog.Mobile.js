    var intervalSensexNifty;
var intervalWatchList;
var Id_for_Controls;
var sqModal;


$(document).ready(function () {

        $(document).on('change', '#Drp-Segments-add', function () {
            $('#Drp-Segments').val($('#Drp-Segments-add option:selected').val());
            $('.TxtSegment_ID').html($('#Drp-Segments option:selected').text());
            localStorage.setItem('GetSegments', $('#Drp-Segments option:selected').val());
            LoadData();
        });
    LoadData();
    });
function HidePopUp() {
    $(".AddDeleteScriptDiv").css('display', 'none');
}
function LoadData() {

    var Tempscriptname = $('#Drp-Segments option:selected').val();
    var ScriptExchange = Tempscriptname.split('>')[0];
    var ScriptInstumentType = Tempscriptname.split('>')[1];

    var input = { 'ScriptExchange': ScriptExchange, 'ScriptInstumentType': ScriptInstumentType, 'rejectedtrade': "rejectedtrade","IsOrderLog":1};
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
    $(".AddDeleteScriptDiv").css('display', 'none');
    
}
function setcompltedresultdata(item) {

    var OutputQty = item.Qty / item.ScriptLotSize;

    var CpDiv = item.CurrentPosition == "Buy"  ? '<spam style="color:dodgerblue">'+item.CurrentPosition+'</spam>' : '<spam style="color:orangered">'+item.CurrentPosition+'</spam>';
    var PlDiv = item.Profitorloss > 0 ? '<spam style="color:dodgerblue">' + item.Profitorloss.toFixed(2) + '</spam>' : '<spam style="color:orangered">' + item.Profitorloss.toFixed(2) + '</spam>';

    var html = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 completed-Div" style="">' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.TradeSymbol +
        '</div>' +
        '<div class="col-lg-6 col-sm-6 col-xs-6 col-md-6">' +
        item.ExitDate + '&nbsp;' + item.Exittime +
        '</div>' +
        '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        CpDiv + '(' + item.ProductType + ')' +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        item.ScriptLotSize + '(' + OutputQty + ')' +
        '</div>' +
        '<div class="col-lg-4 col-sm-4 col-xs-4 col-md-4">' +
        PlDiv +
        '</div>' +
        '</div>' +
        '</div>';

    $('#DivCompletedtrade').append(html);

}