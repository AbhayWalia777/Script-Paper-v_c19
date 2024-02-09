var _CompletedTotalPageNo = 0;
var _CompletedPreviousTotalPageNo = 0;
var _CompletedCurrentPageNo = 1;
var _CompletedCallBack = false;
$(document).ready(function () {
    $('#TblTimeFrameList').DataTable({
        "paging": false,
        "lengthChange": true,
        "order": [[0, 0, "desc"]],
        "processing": true,
        "responsive": true
    });
    $('.classDate').inputmAsk('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' });

    $('.classDate').datepicker({
        autoclose: true,
        useCurrent: true,
        todayHighlight: true,
        todayBtn: "linked",
    });

    $('.select2').select2({
        'placeholder': 'Client',
        'allowClear': true
    });
    $('.select2').val(null).trigger('change');
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

    $('#rptStartDate').val(previousDay);
    $('#rptEndDate').val(today);
    $('#btnGetPosition').on('click', function () {
        GetReportData();
    });
});
function GetReportData() {
    var UserID = $('#UserIds option:selected').text() != "" ? $('#UserIds').val() : 0;
    var req = {
        UserID: UserID, startDate: $('#rptStartDate').val(), endDate: $('#rptEndDate').val(), PageNo: _CompletedCurrentPageNo, TimeSpan: $('#TimeSpan').val()
    };
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: '/Trade/GetTimeFrameTrades',
        data: req,
        success: function (response) {
            var responseData = response;
            var tblTransaction = $('#TblTimeFrameList').DataTable(
            );
            tblTransaction.clear().draw();
            tblTransaction.innerHTML = "";
            var lstData = responseData;

            var _CheckCurrentPage;
            if (lstData.length > 0) {
                _OpeningBalance = lstData[0].Openingwalletbalance;
                for (var i = 0; i < lstData.length; i++) {
                    var result = lstData[i];
                    _CompletedTotalPageNo = result.Total_Page;
                    _CheckCurrentPage = result.Total_Page;
                    SetCompletedTradeDetails(result);
                }

                if (_CompletedPreviousTotalPageNo != _CheckCurrentPage) {
                    CompletedPaginationDestroy();
                }

                if (lstData.length > 0) {
                    _CompletedPreviousTotalPageNo = lstData[0].Total_Page;
                }
                else {
                    _CompletedPreviousTotalPageNo = 1;
                }
                SetCompletedPagination();
            }
        },
        error: function (response) {
            console.log(response.d);
        }

    });


}
function SetCompletedTradeDetails(item) {
    var sQty;
    var tradingUnit;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ScriptLotSize;
        tradingUnit = item.TRADING_UNIT;
    }
    else {
        tradingUnit = item.TRADING_UNIT;
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var deleteTradeBtn = '<a href="javascript:void(0)" onclick="DeleteCompletedTrade(' + item.Completedtradeid + ')" data-bind=' + item.Completedtradeid + ' style="margin-right:10px;" ><i class="fa fa-trash-o"></i> </a> ';
    $('#TblTimeFrameList').DataTable().row.add([
        deleteTradeBtn,
        item.ScriptExchange,
        item.Username,
        item.TradeSymbol,
        sQty,
        item.Entryprice,
        item.Exitprice,
        item.Profitorloss,
        item.Entrydate + " " + item.Entrytime,
        item.ExitDate + " " + item.Exittime
    ]).draw();
}
function SetCompletedPagination() {
    $('#TransactionPagination').twbsPagination({
        totalPages: _CompletedTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_CompletedCallBack) {
                _CompletedCurrentPageNo = page;
                GetReportData();
            }
            else
                _CompletedCallBack = true;
        }
    });
}
function CompletedPaginationDestroy() {
    $('#TransactionPagination').empty();
    $('#TransactionPagination').removeData("twbs-pagination");
    $('#TransactionPagination').unbind("page");
}
function DeleteCompletedTrade(TransactionId) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/SoftDeleteCompletedTrade?ID=" + TransactionId,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                    GetReportData();
                }
            }
        });
    }
}