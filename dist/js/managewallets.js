var TotalPageNo = 0;
var isCallf = false;

$(document).ready(function () {
    $('.select2').select2();

    //var today = new Date();
    //var date = new Date();
    //var dd = String(today.getDate()).padStart(2, '0');
    //var mm = String(today.getMonth() + 1).padStart(2, '0');
    //var yyyy = today.getFullYear();
    //today = mm + '/' + dd + '/' + yyyy;
    //date.setDate(date.getDate() - 30);
    //dd = String(date.getDate()).padStart(2, '0');
    //mm = String(date.getMonth() + 1).padStart(2, '0');
    //yyyy = date.getFullYear();
    //var previousDay = mm + '/' + dd + '/' + yyyy;

    ////$('#rptStartDate').val(previousDay);
    ////$('#rptEndDate').val(today);
    $('#tblList').DataTable({
        "paging": false,
        "lengthChange": false,
        "order": [[0, 0, "desc"]],
        "responsive": true,
        "processing": true,
        dom: '<"top"lfB>rt<"bottom"pi><"clear">',
        buttons: [
            {
                extend: "excel",
                title: "Wallet Transaction History",
                className: "btn-info btn-sm"
            },
            {
                extend: "pdfHtml5",
                title: "Wallet Transaction History",
                className: "btn-info btn-sm"
            },
            {
                extend: "print",
                title: "Wallet Transaction History",
                className: "btn-info btn-sm"
            },
        ],
    });
    GetDataOnClick();
});

function GetData(Page_No) {

    var req = {
        PageNo: Page_No,
        startDate: $('#rptStartDate').val(),
        endDate: $('#rptEndDate').val(),
        UserID: $('#UserIds').val(),
        PayinPayout: $('#PayInPayOut').prop('checked')
    };
    $.ajax({
        type: 'POST',
        datatype: 'json',
        url: '/Admin/GetWalletData',
        data: req,
        success: function (response) {
            var responseData = JSON.parse(response);
            var tblTransaction = $('#tblList').DataTable(
            );
            tblTransaction.clear().draw();
            tblTransaction.innerHTML = "";
            var lstData = responseData;
            if (lstData.length > 0) {
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    TotalPageNo = parseInt(result.Total_Pages);
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
    var balance = parseFloat(item.amount);
    var viewDetail;
    if (item.Transectionid != null && item.Transectionid != "")
        viewDetail = '<button class="btn btn-warning btn-sm btn-Sell" onclick="TransactionDetails(' + item.Transectionid + ')" type="button">Details</button>';
    else
        viewDetail = "";

    var table = $('#tblList').DataTable().row.add([
        item.Id,
        item.Description,
        item.Date_Time_String,
        item.Transectionid,
        balance.toFixed(2),
        viewDetail
    ]).order([0, 'desc']).draw();

    var ctable = document.getElementById("tblList");
    for (var i = 0; i < ctable.rows.length; i++) {
        var Bindded_Amount = parseFloat($(ctable.rows[i].cells[4]).text());
        if (Bindded_Amount > 0) {
            $(ctable.rows[i].cells[4]).css({ "color": "green", "font-weight": "bold" });
        }
        if (Bindded_Amount < 0) {
            $(ctable.rows[i].cells[4]).css({ "color": "red", "font-weight": "bold" });
        }
    }
}

function TransactionDetails(data) {
    $.ajax({
        url: '/Admin/GetWalletTransactionDetails?TransactionId=' + data + '&UserID=' + $('#UserIds').val(),
        type: 'Get',
        success: function (response) {
            var item = JSON.parse(response);
            if (item != null && item != undefined) {
                $("#transactionalDetails").show();
                if ($("#companyINitial").val() == "RT" && item.ScriptExchange == "FOREX") {
                    item.Entryprice = (item.Entryprice).toFixed(5);
                    item.Exitprice = (item.Exitprice).toFixed(5);
                }
                $('html, body').animate({
                    scrollTop: $('#transactionalDetails').offset().top
                }, 2000);
                var sQty = item.Qty;
                if (item.ScriptLotSize > 1 && item.ScriptExchange != 'NFO')
                    sQty = item.Qty / item.ScriptLotSize;
                $("#TradeSymbol").html(item.TradeSymbol);
                $("#CurrentPosition").html(item.CurrentPosition);
                $("#TradeID").html('(' + item.Completedtradeid + ')');
                $("#Entrytime").html(item.Entrytime);
                $("#Qty").html(item.Qty);
                $("#Entryprice").html(item.Entryprice);
                $("#Exittime").html(item.Exittime);
                $("#Exitprice").html(item.Exitprice);
                $("#Profitorloss").html(item.Profitorloss);
                $("#Netprofitorloss").html(item.Netprofitorloss);
                $("#Status").html(item.Status);
                $("#ProductType").html(item.ProductType);
                $("#IsLive").html(item.IsLive != true ? "false" : "true");
                $("#Strategyname").html(item.Strategyname);
                $("#Watchlistname").html(item.Watchlistname);
                $("#Publishname").html(item.Publishname);
                $("#ScriptName").html(item.ScriptName);
            }
        }
    });
}
$('#BalanceTransferToErp').on('click', function () {
    if (confirm("Are You Sure To Transfer All Balance From Each User ?")) {
        window.location.href = "/Admin/BalanceTransferToErpAsync"
    }

});