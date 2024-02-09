    $(document).ready(function () {
        getLiveFeed();
    });
    function getLiveFeed() {
        $.ajax({
            url: '/Home/SaveFeed',
            type: 'GET',
            success: function (data) {
                if (data.error) {
                    Kitelogin();
                }
                $("#kiteList tbody").html('');
                var kiteList = data.data;
                for (var i = 0; i < kiteList.length; i++) {
                    var strRow = "<tr><td>" + kiteList[i].InstrumentToken + " </td><td>" + kiteList[i].Lastprice + "</td><td>" + kiteList[i].Open + "</td><td>" + kiteList[i].high + "</td><td>" + kiteList[i].low + "</td><td>" + kiteList[i].Close + "</td></tr>"
                    $("#kiteList tbody").append(strRow);
                }
                console.log(data);
                //popitup(html, "My Kite Login")
            },
            error: function (error) {
                console.error(error);
            },
            complete: function (data) {
                console.info(data);
                setTimeout(function () {
                    getLiveFeed();
                }, 1000 * .7);
            }
        });
    }

    function Kitelogin() {
        $.ajax({
            url: '/Home/KiteLogin',
            type: 'GET',
            success: function (html) {
                //popitup(html, "My Kite Login")
                location.href = html;
            },
            error: function (error) {
                $(that).remove();
                DisplayError(error.statusText);
            }
        });
    }