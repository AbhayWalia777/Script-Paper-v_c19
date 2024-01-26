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
                userId: $('#UserIds').val()
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
                viewDetail = '<button class="btn btn-warning btn-sm btn-sell" onclick="TransactionDetails(' + item.TransectionId + ')" type="button">Details</button>';
            else
                viewDetail = "";

            var table = $('#tblList').DataTable().row.add([
                item.Id,
                item.Description,
                item.Date_Time_string,
                item.TransectionId,
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
                url: '/Admin/GetWalletTransactionDetails?TransactionId=' + data + '&userId=' + $('#UserIds').val(),
                type: 'Get',
                success: function (response) {
                    var item = JSON.parse(response);
                    if (item != null && item != undefined) {
                        $("#transactionalDetails").show();
                    if($("#companyINitial").val() == "RT" && item.ScriptExchange == "FOREX")
                        {
                        item.EntryPrice=(item.EntryPrice).toFixed(5);
                        item.ExitPrice=(item.ExitPrice).toFixed(5);
                       }
                        $('html, body').animate({
                            scrollTop: $('#transactionalDetails').offset().top
                        }, 2000);
                        var sQty = item.Qty;
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
                        $("#ScriptName").html(item.ScriptName);
                    }
                }
            });
        }
        $('#BalanceTransferToErp').on('click', function () {
            if (confirm("Are You Sure To Transfer All Balance From Each User ?")) {
                window.location.href ="/Admin/BalanceTransferToErpAsync"
            }

        });