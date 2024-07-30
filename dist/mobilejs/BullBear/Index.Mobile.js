var intervalSensexNifty,
    intervalWatchList,
    isShowDepthModal,
    SocketInterval,
    marketDepthInterval,
    websocket,
    mobilebuyBtn,
    mobilesellBtn,
    mobiledeleteBtn,
    Companyinitials,
    allowedTradingUnit,
    LastPriceDictionary = [],
    marginInterval = "",
    allObj = [],
    clicked_Watchlist_InstrumentToken = "",
    clicked_Watchlist_ScriptTradingSymbol = "",
    clicked_Watchlist_ScriptExchange = "";
function FavoriteWatchlist() {
    $.ajax({
        url: "/Trade/SetFavoriteWatchlistData",
        type: "GET",
        dataType: "json",
        success: function (e) {
            if (null != e) {
                var t = JSON.parse(e);
                if (t.objLstWatchList.length > 0)
                    for (var i = 0; i < t.objLstWatchList.length; i++) {
                        var l = parseFloat(t.objLstWatchList[i].Lastprice) - parseFloat(t.objLstWatchList[i].close),
                            r = "",
                            a = "";
                        l < 0
                            ? (r = '<i class="fa fa-angle-down percentage-down">&nbsp' + (a = (parseFloat(l) / parseFloat(t.objLstWatchList[i].close)) * 100).toFixed(2) + "</i>")
                            : l >= 0 && (r = '<i class="fa fa-angle-up percentage-up">&nbsp' + (a = (parseFloat(l) / parseFloat(t.objLstWatchList[i].close)) * 100).toFixed(2) + "</i>"),
                            0 == i &&
                            $(".favorite1").html(
                                '<span class="sensex">' +
                                t.objLstWatchList[0].ScriptTradingSymbol +
                                '&nbsp </span><span class="sensex-price" style=" display: inline-flex;"> ' +
                                t.objLstWatchList[0].Lastprice.toFixed(1) +
                                "&nbsp&nbsp " +
                                r +
                                "</span>"
                            ),
                            1 == i &&
                            $(".favorite2").html(
                                '<span class="nifty">' +
                                t.objLstWatchList[1].ScriptTradingSymbol +
                                '&nbsp</span><span class="nifty-price" style=" display: inline-flex;"> ' +
                                t.objLstWatchList[1].Lastprice.toFixed(1) +
                                "&nbsp&nbsp " +
                                r +
                                "</span>"
                            );
                    }
            }
        },
        error: function (e) { },
    });
}
function initSocket() {
    $.ajax({
        url: "/Home/ConnectWebSocket",
        type: "GET",
        dataType: "json",
        success: function (e) {
            if ("undefined" != e) {
                var t = JSON.parse(e);
                t.hasOwnProperty("Table") && ((allObj = t.Table), wt());
            }
        },
    });
}
function SetTradeDataForRefresh() {
    try {
        var e = $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id");
        $("#cboScriptExchange option:selected").val();
        var t = { WID: 0, scriptExchangeType: "", searchedData: $("#searchText").val(), ScriptExchange: e };
        $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: t,
            dataType: "json",
            async: !0,
            success: function (e) {
                SetResult(e);
            },
        });
    } catch (i) {
        toastr.error("Error While Loading The Watchlist.");
    }
}
function SetResult(e) {
    var t = JSON.parse(e);
    if (null != t) {
        if (($("#watchlistDiv").html(""), null != t.objLstWatchList)) {
            if (t.objLstWatchList.length > 0)
                for (var i = 0; i < t.objLstWatchList.length; i++) {
                    var l = t.objLstWatchList[i];
                    SetWatchTradeDetails(l);
                }
            else $("#watchlistDiv").html("");
        }
        if (null != t.WatchlistDataForAdd) {
            if (t.WatchlistDataForAdd.length > 0)
                for (var i = 0; i < t.WatchlistDataForAdd.length; i++) {
                    var l = t.WatchlistDataForAdd[i];
                    SetWatchTradeDetailsForAdd(l);
                }
            else $("#watchlistDiv").html("");
        }
        if (t.OrderExceptionList.length > 0) {
            for (var r = '<div><div class="col=12" style="text-align:center;"><b style="color:red;">ERROR</b></div><br>', i = 0; i < t.OrderExceptionList.length; i++)
                r +=
                    '<div class=" row  watchlist-card c-left-border watchlist-table" style="border-bottom: 1px solid #ddd;"><div class="col-12" style = "text-align:center;"> ' +
                    t.OrderExceptionList[i].Tradingsymbol +
                    '</div><div class="col-4" style = "text-align:center;"> Qty: ' +
                    t.OrderExceptionList[i].Quantity +
                    '</div><div class="col-4" style = "text-align:center;"> price: ' +
                    t.OrderExceptionList[i].price +
                    '</div><div class="col-2" style = "text-align:center;"> CP: ' +
                    t.OrderExceptionList[i].TransactionType +
                    "</div>Msg:" +
                    t.OrderExceptionList[i].Message +
                    "</div>";
            (r += "</div>"), $("#errorModal .modal-body").html(r), $("#errorModal").modal("show");
        }
    }
}
function wt() {
    var e = allObj;
    if (null != e && "undefined" != e && e.length > 0)
        for (var t = document.getElementById("watchlistDiv"), i = 0; i < t.children.length;) {
            var l = t.children[i].id,
                r = t.children[i].dataset.Scripttype;
            if (void 0 != l && "" != l) {
                var a = e.filter(
                    (e) =>
                        e.InstrumentToken ==
                        $("#" + l)
                            .find("input[Name=hiddenCode]")
                            .val()
                );
                if (a.length > 0) {
                    var s = a[0],
                        n = 0,
                        o = 0,
                        c = 0,
                        d = "",
                        p = "",
                        u = "";
                    for (var b in LastPriceDictionary)
                        if (LastPriceDictionary[b].key == s.InstrumentToken) {
                            (n = parseFloat(LastPriceDictionary[b].value)),
                                (o = parseFloat(LastPriceDictionary[b].Bid)),
                                (c = parseFloat(LastPriceDictionary[b].Ask)),
                                (d = LastPriceDictionary[b].LTPColor),
                                (p = LastPriceDictionary[b].AskColor),
                                (u = LastPriceDictionary[b].BidColor);
                            break;
                        }
                    var v = "";
                    parseFloat(s.Ask) > c && ((v = '<div class="price-up">' + s.Ask.toFixed(2) + "</div>"), (p = "price-up")),
                        parseFloat(s.Ask) < c && ((v = '<div class="price-down">' + s.Ask.toFixed(2) + "</div>"), (p = "price-down")),
                        s.Ask == c && ("" == p && (p = "price-up"), (v = '<div class="' + p + '">' + s.Ask.toFixed(2) + "</div>"));
                    var h = "";
                    parseFloat(s.Bid) > o && ((h = '<div class="price-up">' + s.Bid.toFixed(2) + "</div>"), (u = "price-up")),
                        parseFloat(s.Bid) < o && ((h = '<div class="price-down">' + s.Bid.toFixed(2) + "</div>"), (u = "price-down")),
                        s.Bid == o && ("" == u && (u = "price-up"), (h = '<div class="' + u + '">' + s.Bid.toFixed(2) + "</div>")),
                        null == s.Close && (s.Close = 0);
                    var y = parseFloat(s.Lastprice) - parseFloat(s.Close),
                        S = "",
                        g = "",
                        T = "";
                    y < 0
                        ? ((T = (parseFloat(y) / parseFloat(s.Close)) * 100),
                            "BINANCE" == r && (T = s.Change),
                            "FOREX" == r && (T = 0),
                            (S = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + T.toFixed(2) + "</i>"),
                            (g = '<i class="fa percentage-price-down">&nbsp&nbsp' + y.toFixed(2) + "</i>"))
                        : y >= 0 &&
                        ((T = (parseFloat(y) / parseFloat(s.Close)) * 100),
                            "BINANCE" == r && (T = s.Change),
                            "FOREX" == r && (T = 0),
                            (S = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + T.toFixed(2) + "</i>"),
                            (g = '<i class="fa percentage-price-up">&nbsp&nbsp' + y.toFixed(2) + "</i>"));
                    var m = "";
                    if (
                        (parseFloat(s.Lastprice) > n && ((m = 'LTP : <span class="price-up">' + s.Lastprice.toFixed(2) + "</span>"), (d = "price-up")),
                            parseFloat(s.Lastprice) < n && ((m = 'LTP : <span class="price-down">' + s.Lastprice.toFixed(2) + "</span>"), (d = "price-down")),
                            s.Lastprice == n && ("" == d && (d = "price-up"), (m = 'LTP : <span class="' + d + '">' + s.Lastprice.toFixed(2) + "</span>")),
                            parseFloat(s.Bid) > o && ((h = '<div class="price-up" style="padding-bottom:0px;">' + s.Bid.toFixed(2) + "</div>"), (u = "price-up")),
                            parseFloat(s.Bid) < o && ((h = '<div class="price-down"  style="padding-bottom:0px;">' + s.Bid.toFixed(2) + "</div>"), (u = "price-down")),
                            s.Bid == o && ("" == u && (u = "price-up"), (h = '<div class="' + u + '"  style="padding-bottom:0px;">' + s.Bid.toFixed(2) + "</div>")),
                            $("#" + l)
                                .find(".Percentage_SEGMENT")
                                .html(g + "(" + S + ")"),
                            $("#" + l)
                                .find(".LTP_SEGMENT")
                                .html(m),
                            $("#" + l)
                                .find(".HIGH_LOW")
                                .html("H : " + s.high + " | L : " + s.low),
                            $("#" + l)
                                .find(".Bid_Ask_SEGMENT")
                                .html(
                                    '<div class="col-5" style="margin-left:-15px;display: flex;">                                 <div style="font-size: 20px !important;">' +
                                    h +
                                    '</div >             </div>            <div class="col-7" style="display:flex;margin-left:15px">               <div style="font-size: 20px !important;">' +
                                    v +
                                    "</div >       </div>"
                                ),
                            $("#buySellModel #lblScriptCode").text() == s.ScriptCode)
                    ) {
                        var P = s.Lastprice.toString();
                        $("#buySellModel #lblLastPrice").text(P), $("#buySellModel #lblLastBid").text(s.Bid), $("#buySellModel #lblLastAsk").text(s.Ask), $("#buySellModel #hdnPrice").val(P);
                    }
                    var f = !1;
                    for (var b in LastPriceDictionary)
                        if (LastPriceDictionary[b].key == s.InstrumentToken) {
                            (f = !0),
                                (LastPriceDictionary[b].value = s.Lastprice),
                                (LastPriceDictionary[b].Bid = s.Bid),
                                (LastPriceDictionary[b].Ask = s.Ask),
                                (LastPriceDictionary[b].LTPColor = d),
                                (LastPriceDictionary[b].AskColor = p),
                                (LastPriceDictionary[b].BidColor = u);
                            break;
                        }
                    f || LastPriceDictionary.push({ key: s.InstrumentToken, value: s.Lastprice, Bid: s.Bid, Ask: s.Ask, LTPColor: d, AskColor: p, BidColor: u });
                }
            }
            if ($("#buySellModel").hasClass("in")) {
                var a = e.filter((e) => e.InstrumentToken == $("#buySellModel #lblScriptCode").text());
                a.length > 0 &&
                    ($("#buySellModel #lblLastPrice").text(a[0].Lastprice),
                        $("#buySellModel #lblLastBid").text(a[0].Bid),
                        $("#buySellModel #lblLastAsk").text(a[0].Ask),
                        $("#buySellModel #hdnHigh").text(a[0].high),
                        $("#buySellModel #hdnLow").text(a[0].low),
                        $("#buySellModel #hdnPrice").val(a[0].Lastprice));
            }
            if ("block" == $(".mobile-context-menu").css("display")) {
                var a = e.filter((e) => e.InstrumentToken == clicked_Watchlist_InstrumentToken);
                a.length > 0 && $("#lastPriceMobileContextMenu").html("LTP : " + a[0].Lastprice);
            }
            i++;
        }
}
function SetWatchTradeDetails(e) {
    e.Ask.toFixed(2), e.Bid.toFixed(2);
    var t = ' LTP <span class="price-up" >' + e.Lastprice.toFixed(2) + "</span>",
        i = e.ScriptName.replace(/'/g, "");
    i = "'" + i + "'";
    var l = e.ScriptTradingSymbol.replace(/'/g, "");
    l = "'" + l + "'";
    var r = "'" + e.ScriptInstrumentType + "'",
        a = "'" + e.ScriptExchange.toString() + "'",
        s = parseFloat(e.Lastprice) - parseFloat(e.close),
        n = "",
        o = "",
        c = "";
    s < 0
        ? ((o = (parseFloat(s) / parseFloat(e.close)) * 100),
            "BINANCE" == e.Scripttype && (o = e.PerChange),
            "FOREX" == e.Scripttype && (o = 0),
            (n = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + o.toFixed(2) + "</i>"),
            (c = '<i class="fa percentage-price-down">&nbsp&nbsp' + s.toFixed(2) + "</i>"))
        : s >= 0 &&
        ((o = (parseFloat(s) / parseFloat(e.close)) * 100),
            "BINANCE" == e.Scripttype && (o = e.PerChange),
            "FOREX" == e.Scripttype && (o = 0),
            (n = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + o.toFixed(2) + "</i>"),
            (c = '<i class="fa percentage-price-up">&nbsp&nbsp' + s.toFixed(2) + "</i>"));
    var d = '<input Name="hiddenCode" value="' + e.ScriptCode + '" type="hidden" >',
        p = "btnBuy" + e.ScriptCode,
        u = "btnSell" + e.ScriptCode,
        b = "btnMarketDepth" + e.ScriptCode,
        v = ' <button id="btnDelete' + e.ScriptCode + '" onclick="removeScript(' + e.ScriptCode + "," + e.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ',
        h =
            '<div tabindex="-1" style="display:none;" class="b-btn"><button class="btn-Buy" id="' +
            p +
            '" onclick="buySellPopUp(' +
            e.ScriptCode +
            ",1," +
            i +
            "," +
            e.WID +
            "," +
            e.Lastprice +
            "," +
            r +
            "," +
            a +
            ",1," +
            e.ScriptLotSize +
            "," +
            e.high +
            "," +
            e.low +
            "," +
            e.Lastprice +
            ')" type="button" class="btn btn-success btn-sm btn-Buy">B </button> ',
        y =
            '<button class="btn-Sell" id="' +
            u +
            '" onclick="buySellPopUp(' +
            e.ScriptCode +
            ",2," +
            i +
            "," +
            e.WID +
            "," +
            e.Lastprice +
            "," +
            r +
            "," +
            a +
            ",1," +
            e.ScriptLotSize +
            "," +
            e.high +
            "," +
            e.low +
            "," +
            e.Lastprice +
            ')" type="button" class="btn btn-danger btn-sm btn-Sell"> S </button> ';
    "FOREX" == e.Scripttype && "RT" == Companyinitials && ((e.open = e.open.toFixed(5)), (e.Lastprice = e.Lastprice.toFixed(5)), (e.high = e.high.toFixed(5)), (e.low = e.low.toFixed(5)), (e.close = e.close.toFixed(5)));
    var S = "",
        g = "";
    "" != e.Scriptexpiry && (g = '<span style="color: red;font-size: 13px;">' + e.Scriptexpiry.split(" ")[0] + "</span>");
    var T = "";
    "FUT" == e.ScriptInstrumentType || (("PE" == e.ScriptInstrumentType || "CE" == e.ScriptInstrumentType) && (T = e.ScriptInstrumentType)),
        "" == e.ScriptName && (e.ScriptName = e.ScriptTradingSymbol),
        e.ScriptName.length > 18 && (e.ScriptName = e.ScriptName.substring(0, 18) + "..."),
        (S =
            '<div class="row watchlistRowView" style="border-bottom: 1px solid #ddd;" id="' +
            e.ScriptCode +
            '" data-Scripttype="' +
            e.Scripttype +
            '"  data-ScriptTradingSymbol="' +
            e.ScriptTradingSymbol +
            '" data-ScriptExchange="' +
            e.ScriptExchange +
            '"><div class="col-12" >' +
            (h + y + v) +
            "</div>" +
            d +
            ' <div class="watchlist-card c-left-border watchlist-table"><div class="card-body" id="' +
            b +
            '" style="padding:5px;">   <div class="row"><div class="col-6">  <p class="watchlist-p watchlist-text-BBR Percentage_SEGMENT">  ' +
            c +
            "(" +
            n +
            ')</p></div><div class="col-5">  <p class="watchlist-p watchlist-text-BBR LTP_SEGMENT" style="margin-left:-13px;float:left;padding-left: 4px;">  ' +
            t +
            '</p></div><div class="col-6"> <p class="watchlist-p watchlist-text-BBR">' +
            e.ScriptName +
            T +
            '</p></div><div class="col-5">     <div class="row Bid_Ask_SEGMENT" style="margin-left:2px;">             <div class="col-5" style="margin-left:-15px;display: flex;font-size: 20px !important;">               <div class="price-up" style="padding-bottom:0px;">' +
            e.Bid.toFixed(2) +
            '</div>             </div>            <div class="col-7" style="display:flex;margin-left:15px;font-size: 20px !important;">              <div class="price-up" style="padding-bottom:0px;">' +
            e.Ask.toFixed(2) +
            '</div>       </div>               </div>           </div><div class="col-4">  <p class="watchlist-p watchlist-text-BBR">' +
            g +
            '</p></div><div class="col-7">  <p class="watchlist-p watchlist-text-BBR HIGH_LOW" style="float: left;padding-left: 57px;"> H : ' +
            e.high +
            " |   L : " +
            e.low +
            "</p></div>        </div>     </div>  </div></div ></div >"),
        $("#watchlistDiv").append(S);
}
function SetWatchTradeDetailsForAdd(e) {
    var t = "'" + e.ScriptTradingSymbol.toString() + "'",
        i = "'" + $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id").toString() + "'",
        l = "";
    (l =
        '<div class="row" style="border-bottom: 1px solid #ddd;height:30px;"><div class="col-12"><div class="col-6"> <p class="watchlist-p watchlist-text-BBR">' +
        e.ScriptTradingSymbol +
        '</p></div><div class="col-5" style="float: right;position: relative;padding-right: 30px;top:-16px;"><button class="btn btn-primary btn-sm btn-Sell" onclick="AddNewScript(' +
        t +
        "," +
        e.intWID +
        "," +
        i +
        "," +
        i +
        "," +
        e.UserID +
        "," +
        e.Lot +
        "," +
        e.size +
        ')" type="button"><i class="fa fa-plus"></i></button>           </div></div ></div >'),
        $("#watchlistDiv").append(l);
}
function AddNewScript(e, t, i, l, r, a, s) {
    null != e &&
        "" != e &&
        void 0 != e &&
        null != l &&
        "" != l &&
        $.ajax({
            url: "/Watchlist/SaveWatchListFromIndex",
            type: "POST",
            data: { ScriptTradingSymbol: e, intWID: t, Watchlistname: i, ScriptExchange: l, txtUser: r, Lot: a, Size: s },
            dataType: "json",
            traditional: !0,
            success: function (e) {
                var t = JSON.parse(e);
                t.IsError && "MaxLimit" == t.ErrorMessage
                    ? toastr.error("Max 50 Scripts Allowed")
                    : t.IsExist
                        ? toastr.error("Duplicate Record")
                        : t.IsError
                            ? toastr.error("Something Went Wrong")
                            : t.IsError || "" == t.ScriptCode || null == t.ScriptCode || (toastr.success("Script Added Successfully"), $("#searchText").val(""), SetTradeDataForRefresh());
            },
        });
}
function openUserProfile() {
    document.getElementById("userDropdown").classList.toggle("show");
}
function MarketDepthPop(e, t) {
    $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: e },
        success: function (i) {
            return (
                $("#marketDepthDiv").html(i),
                (marketDepthInterval = setInterval(function () {
                    SetMarketDepthForRefresh(e, t);
                }, 1e3)),
                !0
            );
        },
    });
}
function SetMarketDepthForRefresh(e) {
    $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: e },
        async: !0,
        success: function (e) {
            return $("#marketDepthDiv").html(e), !0;
        },
    });
}
function buySellPopUp(e, t, i, l, r, a, s, n = 1, o = 1, c = 0, d = 0, p = 0, u = 0, b = 0, v = "", h = "", y = 0, S = "") {
    $(".upperClause :input").removeAttr("disabled"),
        $("#btnProceedBuySell").removeAttr("disabled"),
        $("#price").removeClass("has-error"),
        $("#buySellModel .modal-title").css("color", "#fff"),
        $("#buySellModel #Terror").hide(),
        $("#buySellModel #Quantity-error").hide(),
        $("#buySellModel #hdnScriptExchange").val(s),
        $("#buySellModel #hdnScriptLotSize").val(o);
    var g = "";
    if (
        (1 == t
            ? ((g = "Buy"),
                $("#buySellModel .modal-title").css("background-color", "#4987ee"),
                $("#buySellModel #btnProceedBuySell").css("background-color", "#4987ee"),
                $("#buySellModel #btnProceedBuySell").css("color", "#fff"),
                $("#buySellModel #btnProceedBuySell").text("PROCEED"))
            : 2 == t &&
            ((g = "Sell"),
                $("#buySellModel .modal-title").css("background-color", "#ff4a4a"),
                $("#buySellModel #btnProceedBuySell").css("background-color", "#ff4a4a"),
                $("#buySellModel #btnProceedBuySell").css("color", "#fff"),
                $("#buySellModel #btnProceedBuySell").text("PROCEED")),
            $("#dropTradingUnit").html(""),
            null != allowedTradingUnit)
    ) {
        if (allowedTradingUnit.length > 0) {
            var T = allowedTradingUnit.filter((e) => e.ScriptExchange == s),
                m = [];
            "FUT" == a || "CE" == a || "PE" == a
                ? "FUT" == a
                    ? null == T[0].Future_Trading_Unit_Type || "" == T[0].Future_Trading_Unit_Type || void 0 == T[0].Future_Trading_Unit_Type
                        ? m.push(1)
                        : (m = T[0].Future_Trading_Unit_Type.split(","))
                    : null == T[0].Options_Trading_Unit_Type || "" == T[0].Options_Trading_Unit_Type || void 0 == T[0].Options_Trading_Unit_Type
                        ? m.push(1)
                        : (m = T[0].Options_Trading_Unit_Type.split(","))
                : null == T[0].Options_Trading_Unit_Type || "" == T[0].Options_Trading_Unit_Type || void 0 == T[0].Options_Trading_Unit_Type
                    ? m.push(1)
                    : (m = T[0].Equity_Trading_Unit_Type.split(",")),
                $.each(m, function (e, t) {
                    "0" == t && (t = "1"),
                        $("#dropTradingUnit").append(
                            $("<option></option>")
                                .val(parseInt(t))
                                .html("1" == t ? "Lot" : "Qty")
                        );
                });
        } else $("#dropTradingUnit").append($("<option></option>").val(parseInt(1)).html("Lot"));
    } else $("#dropTradingUnit").append($("<option></option>").val(parseInt(1)).html("Lot"));
    if (
        ($("#lblScriptSymbol").text(i.toString()),
            $("#lblScriptCode").text(e.toString()),
            $("#lblCurrentPosition").text(g),
            $("#WID").val(l),
            $("#hdnPrice").val(r),
            $("#hdnTradeID").val(y.toString()),
            $("#price").val("0"),
            $("#TriggerPrice").val(p.toString()),
            $("#txtStopLoss").val(u.toString()),
            $("#txtTarget").val(b.toString()),
            $("#Quantity").val(n.toString()),
            "EQ" != a ? ($("#rbtnNrml").val("NRML"), $("#Itype").text("NRML")) : ($("#rbtnNrml").val("CNC"), $("#Itype").text("CNC")),
            $("#rbtnMarket").prop("checked", !0),
            $("#rbtnNrml").prop("checked", !0),
            "VM" == Companyinitials &&
            ($(".ProductTypeDiv").css("display", "none"), $(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $("#tgtSLDiv").css("display", "none"), $(".tgtSLDivSL").css("display", "none")),
            "EXPO" == Companyinitials && ($(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $(".RememberDiv").css("display", "none")),
            0 == v.length)
    ) {
        var P = localStorage.getItem("RememberTargetStoploss");
        null != P
            ? ((P = JSON.parse(P)),
                $("#cbxRememberTargetStoploss").prop("checked", !0),
                null != P.PRODUCT_TYPE && "" != P.PRODUCT_TYPE && ("MIS" == P.PRODUCT_TYPE ? $("input[Name=ProductType]#rbtnIntraday").trigger("click") : $("input[Name=ProductType]#rbtnNrml").trigger("click")),
                null != P.PRICE_TYPE &&
                "" != P.PRICE_TYPE &&
                ("MARKET" == P.PRICE_TYPE
                    ? $("input[Name=MarketType]#rbtnMarket").trigger("click")
                    : "Limit" == P.PRICE_TYPE
                        ? $("input[Name=MarketType]#rbtnLimit").trigger("click")
                        : "SL" == P.PRICE_TYPE
                            ? $("input[Name=MarketType]#rbtnSL").trigger("click")
                            : "SL-M" == P.PRICE_TYPE && $("input[Name=MarketType]#rbtnSLM").trigger("click")),
                (v = $("input[Name=MarketType]:checked").val()))
            : ($("input[Name=MarketType]#rbtnMarket").trigger("click"), $("input[Name=ProductType]#rbtnNrml").trigger("click"));
    }
    null != v &&
        "" != v &&
        ("MARKET" == v
            ? $("input[Name=MarketType]#rbtnMarket").trigger("click")
            : "Limit" == v
                ? $("input[Name=MarketType]#rbtnLimit").trigger("click")
                : "SL" == v
                    ? $("input[Name=MarketType]#rbtnSL").trigger("click")
                    : "SL-M" == v && $("input[Name=MarketType]#rbtnSLM").trigger("click")),
        null != h && "" != h && ("MIS" == h ? $("#rbtnIntraday").prop("checked", !0) : $("#tgtSLDiv").show()),
        "COMPLETE" == S && $(".upperClause :input").attr("disabled", "disabled"),
        $("#buySellModel").modal({ backdrop: !1, show: !0 }),
        $("body").removeClass("modal-open"),
        $("#hdnSt").val(S),
        (isShowDepthModal = !1),
        "1" == localStorage.getItem("IsOneClickEnabled") && ProceedBuySell(),
        "MCX" != s ? ($("#QuantityWiseBuy").css("display", "none"), $("#marketTypeDiv").addClass("col-md-offset-4")) : ($("#QuantityWiseBuy").css("display", "block"), $("#marketTypeDiv").removeClass("col-md-offset-4")),
        (marginInterval = setInterval(function () {
            GetRequiredMargin();
        }, 1e3));
}
function GetRequiredMargin() {
    var e = 0,
        t = $("#buySellModel #hdnScriptLotSize").val();
    $("#buySellModel #DivGetLotSize").text(t);
    var i = $("#lblScriptCode").text(),
        l = $("#Quantity").val(),
        r = $("#lblLastPrice").text(),
        a = document.getElementById("rbtnIntraday"),
        s = $("#buySellModel #hdnScriptExchange").val();
    if ((!0 == a.checked && (e = 1), "" != (r = "Buy" == $("#lblCurrentPosition").text() ? $("#lblLastBid").text() : $("#lblLastAsk").text()) && null != r)) {
        var n = { ScriptLotSize: t, ScriptCode: i, quantity: l, Totalwalletbalance: 0, MisOrNot: e, Lastprice: r, TRADING_UNIT_TYPE: $("#dropTradingUnit").val(), ScriptExchange: s };
        $.ajax({
            url: "/Trade/GetRequiredMargin",
            type: "GET",
            data: n,
            dataType: "json",
            success: function (e) {
                SetRequiredMargin(e);
            },
        });
    }
}
function SetRequiredMargin(e) {
    if (null != e.length) {
        if (e.length > 0)
            for (var t = 0; t < e.length; t++)
                $("#buySellModel #DivGetRequiredMargin").text(e[t].Requiredmargin),
                    $("#buySellModel #DivGetAvailableMargin").text(e[t].Availablemargin),
                    $("#buySellModel #DivGetUsedMargin").text(e[0].Usedmargin),
                    e[t].Requiredmargin > e[t].Availablemargin ? $("#DivGetAvailableMargin").css("color", "red") : $("#DivGetAvailableMargin").css("color", "green");
        else $("#buySellModel #DivGetRequiredMargin").text(0), $("#buySellModel #DivGetAvailableMargin").text(0), $("#buySellModel #DivGetUsedMargin").text(0);
    } else $("#buySellModel #DivGetRequiredMargin").text(0), $("#buySellModel #DivGetAvailableMargin").text(0), $("#buySellModel #DivGetUsedMargin").text(0);
}
function removeScript(e, t) {
    (isShowDepthModal = !1),
        newconfirmMobile("Delete This Record", function () {
            var i = $("body").find(".cresp").html();
            $("body").find(".cresp").remove(),
                "Yes" == i &&
                e > 0 &&
                t > 0 &&
                $.ajax({
                    url: "/Watchlist/DeleteScript",
                    type: "POST",
                    data: { intWID: t, ScriptCode: e },
                    dataType: "json",
                    traditional: !0,
                    success: function (t) {
                        return JSON.parse(t).IsError ? (toastr.error("Can Not Delete This Record.There Is One Active Trade."), !1) : ($("#tblList").DataTable(), $("#" + e).remove(), toastr.success("Script Deleted Successfully."), !1);
                    },
                });
        });
}
function ProceedBuySell() {
    var e = $("#Quantity").val();
    if (e < 0.01) {
        toastr.error("Invalid Qty");
        return;
    }
    if (!0 == $("#cbxRememberTargetStoploss").prop("checked")) {
        var t = { PRODUCT_TYPE: $("input[Name=ProductType]:checked").val(), PRICE_TYPE: $("input[Name=MarketType]:checked").val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(t));
    } else localStorage.removeItem("RememberTargetStoploss");
    var i = $("#lblScriptCode").text(),
        l = $("#lblCurrentPosition").text();
    intWID = $("#WID").val();
    var r = $("#txtTarget").val(),
        a = $("#txtStopLoss").val();
    $("#buySellModel #hdnScriptExchange").val(), $("#buySellModel #hdnScriptLotSize").val();
    var s = $("#price").val(),
        n = $("#TriggerPrice").val(),
        o = $("#hdnTradeID").val(),
        c = $("input[Name=ProductType]:checked").val(),
        d = $("input[Name=MarketType]:checked").val();
    if (null == i || "" == i || null == l || "" == l) {
        toastr.error("Please enter correct details");
        return;
    }
    if (("" != a && "0" != a) || ("" != r && "0" != r)) {
        var p = parseFloat(r),
            u = parseFloat(a),
            b = parseFloat(s),
            v = $("#buySellModel #hdnPrice").val(),
            h = parseFloat(v);
        if ((b > 0 ? (h = b) : (b = h), "True" == $("#IsTargetStopLossAbsolute").val())) {
            var y = "";
            if (
                ("Buy" == l
                    ? (p > 0 && p < b && (y = "Target should be greater than Order price"), u > 0 && u > b && (y = "StopLoss should be less than Order price"))
                    : (p > 0 && p > b && (y = "Target should be less than Order price"), u > 0 && u < b && (y = "StopLoss  should be greater than Order price")),
                    "" != y)
            ) {
                toastr.error(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    if (0 == $("#HighLowCircuitRequired").val()) {
        if ("SL" == d || "SL-M" == d) {
            var b = parseFloat(s),
                S = parseFloat(n),
                v = $("#buySellModel #hdnPrice").val(),
                g = parseFloat(v),
                T = !1,
                y = "";
            if (
                ("SL" == d && ("Sell" == l && "SL" == d && b > S ? ((T = !0), (y = "Trigger price connot be less than order price")) : "Buy" == l && "SL" == d && b < S && ((T = !0), (y = "Trigger price Cannot be higher than order price"))),
                    "Sell" == l && S > g ? ((T = !0), (y = "Trigger price Cannot be higher than last price")) : "Buy" == l && S < g && ((T = !0), (y = "Trigger price connot be less than last price")),
                    T)
            ) {
                toastr.error(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("Limit" == d) {
            var b = parseFloat(s),
                v = $("#buySellModel #hdnPrice").val(),
                g = parseFloat(v),
                T = !1,
                y = "";
            if (("Sell" == l && b < g ? ((T = !0), (y = "Limit price Cannot be less than last price")) : "Buy" == l && b > g && ((T = !0), (y = "Limit price connot be greater than last price")), T)) {
                $("#price").addClass("has-error"), toastr.error(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    var m = $("#hdnSt").val(),
        P = $("#dropTradingUnit").val();
    i > 0 &&
        intWID > 0 &&
        "" != e &&
        "0" != e &&
        $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: {
                intWID: intWID,
                ScriptCode: i,
                CurrentPosition: l,
                allUsers: !1,
                target: r,
                stopLoss: a,
                Quantity: e,
                price: s,
                TriggerPrice: n,
                ProductType: c,
                MarketType: d,
                TradeID: o,
                Status: m,
                iscbxAutoBinanceSlTrailEnabled: 0,
                TRADING_UNIT: P,
            },
            dataType: "json",
            async: !0,
            success: function (e) {
                var t = JSON.parse(e);
                return t.IsError ? (HidePopUp(), toastr.error(t.TypeName), !1) : ("0" != o ? toastr.success("Order Updated successfully") : toastr.success(t.SuccessMessage), !1);
            },
        }),
        HidePopUp(),
        $("#btnProceedBuySell").removeAttr("disabled");
}
function HidePopUp() {
    $("#buySellModel").modal("hide");
}
$(document).ready(function () {
    (allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val())),
        (Companyinitials = $("#CompanyInitial").val()),
        $(".nav-item").on("click", function () {
            $("#watchlistDiv").html(""),
                $("#watchlistDiv").append(
                    '<photo class="shine-watchlist"></photo><photo class= "shine-watchlist"></photo><photo class= "shine-watchlist"></photo><photo class="shine-watchlist"></photo><photo class="shine-watchlist"></photo><photo class="shine-watchlist"></photo><photo class="shine-watchlist"></photo>'
                ),
                $(".active").removeClass("active"),
                $(this).addClass("active").addClass("active"),
                SetTradeDataForRefresh();
        }),
        SetTradeDataForRefresh(),
        initSocket(),
        (SocketInterval = setInterval(function () {
            initSocket();
        }, 1e3)),
        (intervalSensexNifty = window.setInterval(function () {
            FavoriteWatchlist();
        }, 1e3)),
        $("input[Name=MarketType]").on("click", function (e) {
            var t = $(e.currentTarget).val(),
                i = $("#hdnPrice").val(),
                l = $("#hdnPrice").val();
            $("#txtTarget").removeAttr("disabled"),
                $("#txtTarget").removeAttr("readonly"),
                $("#txtStopLoss").removeAttr("disabled"),
                $("#txtStopLoss").removeAttr("readonly"),
                "Limit" == t
                    ? ($("#buySellModel #price").removeAttr("disabled"),
                        $("#buySellModel #price").removeAttr("readonly"),
                        $("#buySellModel #price").val(i),
                        $("#buySellModel #TriggerPrice").val("0"),
                        $("#buySellModel #TriggerPrice").attr("disabled", "disabled"))
                    : "SL" == t
                        ? ($("#buySellModel #price").removeAttr("disabled"),
                            $("#buySellModel #price").removeAttr("readonly"),
                            $("#buySellModel #price").val(i),
                            $("#buySellModel #TriggerPrice").val(l),
                            $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                            $("#buySellModel #TriggerPrice").removeAttr("readonly"))
                        : "SL-M" == t
                            ? ($("#buySellModel #TriggerPrice").removeAttr("disabled"),
                                $("#buySellModel #TriggerPrice").removeAttr("readonly"),
                                $("#buySellModel #TriggerPrice").val(l),
                                $("#buySellModel #price").val("0"),
                                $("#buySellModel #price").attr("disabled", "disabled"),
                                $("#txtTarget").attr("disabled", "disabled"),
                                $("#txtTarget").attr("readonly", "readonly"),
                                $("#txtStopLoss").attr("disabled", "disabled"),
                                $("#txtStopLoss").attr("readonly", "readonly"))
                            : "MARKET" == t &&
                            ($("#buySellModel #price").val("0"),
                                $("#buySellModel #price").attr("disabled", "disabled"),
                                $("#buySellModel #price").attr("readonly", "readonly"),
                                $("#buySellModel #TriggerPrice").val("0"),
                                $("#buySellModel #TriggerPrice").attr("disabled", "disabled"),
                                $("#buySellModel #TriggerPrice").attr("readonly", "readonly"));
        }),
        $(".searchButton").on("click", function () {
            if (window.hasOwnProperty("webkitSpeechRecognition")) {
                var e = new webkitSpeechRecognition();
                (e.continuous = !1),
                    (e.interimResults = !1),
                    (e.lang = "en-US"),
                    e.start(),
                    $("#microphone").modal("show"),
                    (e.onresult = function (t) {
                        $("#searchText").val(t.results[0][0].transcript), e.stop(), $("#microphone").modal("hide");
                    }),
                    (e.onerror = function (t) {
                        e.stop(), $("#microphone").modal("hide");
                    });
            } else toastr.error("Your Browser Does Not Support's This Feature.");
        }),
        $("#searchText").on("keyup", function () {
            SetTradeDataForRefresh();
        }),
        $(".mobileBuyBtn").on("click", function () {
            $("#" + mobilebuyBtn).trigger("click"), $(".mobile-context-menu").css("display", "none");
        }),
        $(".mobileSellBtn").on("click", function () {
            $("#" + mobilesellBtn).trigger("click"), $(".mobile-context-menu").css("display", "none");
        }),
        $(".mobileDeleteBtn").on("click", function () {
            $("#" + mobiledeleteBtn).trigger("click"), $(".mobile-context-menu").css("display", "none");
        }),
        $("#watchlistDiv").delegate(".watchlistRowView", "click", function () {
            if (screen.width <= 768) {
                window.clearInterval(marketDepthInterval),
                    (clicked_Watchlist_InstrumentToken = $(this).attr("id")),
                    $("#marketDepthDiv").html(""),
                    $("#marketDepthDiv").append('<photo class="shine-watchlist"></photo><photo class= "shine-watchlist"></photo>'),
                    (clicked_Watchlist_ScriptExchange = $(this).attr("data-ScriptExchange")),
                    $("#ScriptTradingSymbolMobileContextMenu").html($(this).attr("data-ScriptTradingSymbol") + ' <span style="font-size:12px;"> (' + clicked_Watchlist_ScriptExchange + ")</span>");
                var e = allObj.filter((e) => e.InstrumentToken == clicked_Watchlist_InstrumentToken);
                e.length > 0 && $("#lastPriceMobileContextMenu").html("LTP : " + e[0].Lastprice),
                    (mobilebuyBtn = $($(this).find(".btn-Buy")).find(".btn-Buy").prevObject[0].id),
                    (mobilesellBtn = $($(this).find(".btn-Sell")).find(".btn-Sell").prevObject[0].id),
                    (mobiledeleteBtn = $($(this).find(".btn-delete")).find(".btn-delete").prevObject[0].id),
                    $(".mobile-context-menu").css("display", "block"),
                    MarketDepthPop(clicked_Watchlist_InstrumentToken, $(this).attr("data-ScriptTradingSymbol"));
            }
        });
}),
    document.body.addEventListener("click", function (e) {
        var t = document.querySelector("ul.mobile-context-menu-list.list-flat"),
            i = document.querySelector("#watchlistDiv");
        "" == t || null == t || t.contains(e.target) || i.contains(e.target) || (window.clearInterval(marketDepthInterval), $(".mobile-context-menu").css("display", "none"));
    });
