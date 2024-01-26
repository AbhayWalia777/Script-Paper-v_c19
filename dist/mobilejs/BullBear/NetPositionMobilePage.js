    var intervalWatchList;
    $(document).ready(function () {
        intervalWatchList = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
        $("#backbtn").show();
        $('#backbtn').css('color', '#fff');
        $('#backbtn').on('click', function () {
            window.location.href = "/Admin/Account";
        });
    });

    function SetTradeDataForRefresh() {
        try {
            var request = $.ajax({
                url: "/Trade/SetNetPosition",
                type: "GET",
                dataType: 'json',
                async: true,
                success: function (data) {
                    SetResult(data);
                }
            });

        } catch (e) {
            toastr.error("Error On SetTradeData.")
        }
    }
    function SetResult(data) {
        var results = JSON.parse(data);
        if (results != null) {
            if (parseFloat(results.TotalActiveTradeProfitOrLoss) > 0) {
                $('.TotalActiveTradeProfitOrLoss > h3').text('+' + results.TotalActiveTradeProfitOrLoss);
            }
            else if (parseFloat(results.TotalActiveTradeProfitOrLoss)==0) {
                $('.TotalActiveTradeProfitOrLoss > h3').text(results.TotalActiveTradeProfitOrLoss);
            }
            else if (parseFloat(results.TotalActiveTradeProfitOrLoss) < 0) {
                $('.TotalActiveTradeProfitOrLoss > h3').text(results.TotalActiveTradeProfitOrLoss);
            }

            $('.TotalActiveTrade > h3').text(results.TotalActiveTradeCount);
            $('.TotalCompletedTrade > h3').text(results.TotalCompletedTradeCount);

            if (parseFloat(results.TotalCompletedTradeProfitOrLoss) > 0) {
                $('.TotalCompletedTradeProfitOrLoss > h3').text('+' + results.TotalCompletedTradeProfitOrLoss);
            }
            else if (parseFloat(results.TotalCompletedTradeProfitOrLoss) == 0) {
                $('.TotalCompletedTradeProfitOrLoss > h3').text(results.TotalCompletedTradeProfitOrLoss);
            }
            else if (parseFloat(results.TotalCompletedTradeProfitOrLoss) < 0) {
                $('.TotalCompletedTradeProfitOrLoss > h3').text(results.TotalCompletedTradeProfitOrLoss);
            }

            
            $('.TotalInvestMent > h3').text(results.TotalInvestMent.toFixed(2));
            $('.TotalCurrentValue > h3').text(results.TotalCurrentValue.toFixed(2));
            $('.TotalWalletBalance > h3').text(results.UserWalletBalane.toFixed(2));
        }
    }