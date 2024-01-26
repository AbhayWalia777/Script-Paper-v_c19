    var TotalPageNo = 0;
    var isCallf = false;

    $(document).ready(function () {
        $('.classDate').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })
        $('.classDate').datepicker({
            autoclose: true,
            useCurrent: true,
            todayHighlight: true,
            todayBtn: true,
            endDate: "today",
            todayBtn: "linked"
        });
        $('#backbtn').css('color', '#fff');
        $('#backbtn').on('click', function () {
            window.location.href = "/Trade/Index";
        });
        $(document).on('click', '.activeTradeRow', function () {
            TransactionDetails($(this).attr('data-id'));
        });
        var today = new Date();
        var date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        date.setDate(date.getDate() - 30);
        dd = String(date.getDate()).padStart(2, '0');
        mm = String(date.getMonth() + 1).padStart(2, '0');
        yyyy = date.getFullYear();
        var previousDay = mm + '/' + dd + '/' + yyyy;

        //$('#rptStartDate').val(previousDay);
        //$('#rptEndDate').val(today);

        GetData(1);
        
    });

    function GetData(Page_No) {

        var req = {
            PageNo: Page_No, startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), userId: $('#UserIds').val()
        }
        $.ajax({
            type: 'POST',
            datatype: 'json',
            contentType: 'application/json',
            url: '/Admin/GetWalletData',
            data: JSON.stringify(req),
            success: function (response) {
                var responseData = JSON.parse(response);
                $('#CompletedTradeDiv').html('');
                var lstData = responseData;
                if (lstData.length > 0) {
                    for (var i = 0; i < lstData.length; i++) {
                        var result = lstData[i];
                        TotalPageNo = parseInt(result.TOTAL_PAGES);
                        SetWalletTransactionDetails(result);
                    }
                }
                else {
                    TotalPageNo = 0;
                }
                SetPagination();

            },
            error: function (response) {
                console.log(response);
            }
        });

}

    function SetPagination() {
        $('.pagination').twbsPagination({
            totalPages: TotalPageNo,
            visiblePages: 2,
            onPageClick: function (event, page) {
                if (isCallf)
                    GetData(page);
                else
                    isCallf = true;
            }
        });
    }
    function GetDataOnClick() {
        $('.pagination').empty();
        $('.pagination').removeData("twbs-pagination");
        $('.pagination').unbind("page");
        GetData(1);
    }
    function SetWalletTransactionDetails(item) {
        var balance = parseFloat(item.Amount);
        var viewDetail;
        if (item.TransectionId != null && item.TransectionId != "")
            viewDetail = '<i class="fa fa-info-circle" onclick="TransactionDetails(' + item.TransectionId + ')"></i>';
        else
            viewDetail = "";

        //var table = $('#tblList').DataTable().row.add([
        //    item.Id,
        //    item.Description,
        //    item.Date_Time_string,
        //    item.TransectionId,
        //    balance.toFixed(2),
        //    viewDetail
        //]).order([0, 'desc']).draw();

        var html =
            '<div class=" activeTradeRow row-New-Theme p-2 watchlistRow" id=' + item.Id + ' data-id="' + item.TransectionId+'">' +
            '<div class="col-xs-12 col-sm-12" >' +
            '<div class="watchlist-card c-left-border watchlist-table">' +
            '<div class="card-body" style="padding:5px;">' +
            '   <div class="row">' +
            '<div class="col-xs-12 col-sm-12">' +
            '   <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px;">' + item.Description + '</p>' +
            '</div>' +
            '<div class="col-xs-12" >' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;"> | DATE: ' + item.Date_Time_string + ' | AMOUNT: ' + balance.toFixed(2) + '</p>' +
            '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;"> </p>' +
            '</div>' +
            '        </div>' +
            '     </div>' +
            '  </div>' +
            '</div >' +
            '</div >';

        $('#CompletedTradeDiv').append(html);
        //var ctable = document.getElementById("tblList");
        //for (var i = 0; i < ctable.rows.length; i++) {
        //    var Bindded_Amount = parseFloat($(ctable.rows[i].cells[4]).text());
        //    if (Bindded_Amount > 0) {
        //        $(ctable.rows[i].cells[4]).css({ "color": "green", "font-weight": "bold" });
        //    }
        //    if (Bindded_Amount < 0) {
        //        $(ctable.rows[i].cells[4]).css({ "color": "red", "font-weight": "bold" });
        //    }
        //}
    }

    function TransactionDetails(data) {
        $.ajax({
            url: '/Admin/GetWalletTransactionDetails?TransactionId=' + data + '&userId=' + $('#UserIds').val(),
            type: 'Get',
            success: function (item) {
                if (item != null && item != undefined) {
                    var sQty = item.Qty;
                    if(item.ScriptExchange == "FOREX" && companyINitials == "RT")
                    {
                    item.EntryPrice=(item.EntryPrice).toFixed(5);
                    item.ExitPrice=(item.ExitPrice).toFixed(5);
                    }
                    if (item.ScriptLotSize > 1 && item.ScriptExchange != 'NFO')
                        sQty = item.Qty / item.ScriptLotSize;
                    $("#TradeSymbol").html(item.TradeSymbol);
                    $("#CurrentPosition").html(item.CurrentPosition);
                    $("#TradeID").html('(' + item.CompletedTradeID + ')');
                    $("#EntryTime").html(item.EntryTime);
                    $("#Qty").html(item.Qty);
                    $("#EntryPrice").html(item.EntryPrice);
                    $("#ExitTime").html(item.ExitTime);
                    $("#ExitPrice").html(item.ExitPrice);
                    $("#ProfitOrLoss").html(item.ProfitOrLoss);
                    $("#NetProfitOrLoss").html(item.NetProfitOrLoss);
                    $("#Status").html(item.Status);
                    $("#ProductType").html(item.ProductType);
                    $("#isLive").html(item.isLive != true ? "false" : "true");
                    $("#StrategyName").html(item.StrategyName);
                    $("#WatchListName").html(item.WatchListName);
                    $("#PublishName").html(item.PublishName);                
                    $('#MarketDepthModal').modal('show');
                }
            }
        });
}

   
