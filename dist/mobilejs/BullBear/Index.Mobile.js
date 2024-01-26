var intervalSensexNifty,
    intervalWatchList,
    isShowDepthModal,
    SocketInterval,
    marketDepthInterval,
    websocket,
    mobilebuyBtn,
    mobilesellBtn,
    mobiledeleteBtn,
    companyInitials,
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
                        var l = parseFloat(t.objLstWatchList[i].LastPrice) - parseFloat(t.objLstWatchList[i].close),
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
                                t.objLstWatchList[0].LastPrice.toFixed(1) +
                                "&nbsp&nbsp " +
                                r +
                                "</span>"
                            ),
                            1 == i &&
                            $(".favorite2").html(
                                '<span class="nifty">' +
                                t.objLstWatchList[1].ScriptTradingSymbol +
                                '&nbsp</span><span class="nifty-price" style=" display: inline-flex;"> ' +
                                t.objLstWatchList[1].LastPrice.toFixed(1) +
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
        var t = { Wid: 0, scriptExchangeType: "", searchedData: $("#searchText").val(), ScriptExchange: e };
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
                    '</div><div class="col-4" style = "text-align:center;"> Price: ' +
                    t.OrderExceptionList[i].Price +
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
                r = t.children[i].dataset.scripttype;
            if (void 0 != l && "" != l) {
                var a = e.filter(
                    (e) =>
                        e.InstrumentToken ==
                        $("#" + l)
                            .find("input[name=hiddenCode]")
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
                                (d = LastPriceDictionary[b].LtpColor),
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
                    var y = parseFloat(s.LastPrice) - parseFloat(s.Close),
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
                        (parseFloat(s.LastPrice) > n && ((m = 'LTP : <span class="price-up">' + s.LastPrice.toFixed(2) + "</span>"), (d = "price-up")),
                            parseFloat(s.LastPrice) < n && ((m = 'LTP : <span class="price-down">' + s.LastPrice.toFixed(2) + "</span>"), (d = "price-down")),
                            s.LastPrice == n && ("" == d && (d = "price-up"), (m = 'LTP : <span class="' + d + '">' + s.LastPrice.toFixed(2) + "</span>")),
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
                                .html("H : " + s.High + " | L : " + s.Low),
                            $("#" + l)
                                .find(".BID_ASK_SEGMENT")
                                .html(
                                    '<div class="col-5" style="margin-left:-15px;display: flex;">                                 <div style="font-size: 20px !important;">' +
                                    h +
                                    '</div >             </div>            <div class="col-7" style="display:flex;margin-left:15px">               <div style="font-size: 20px !important;">' +
                                    v +
                                    "</div >       </div>"
                                ),
                            $("#buySellModel #lblScriptCode").text() == s.ScriptCode)
                    ) {
                        var P = s.LastPrice.toString();
                        $("#buySellModel #lblLastPrice").text(P), $("#buySellModel #lblLastBid").text(s.Bid), $("#buySellModel #lblLastAsk").text(s.Ask), $("#buySellModel #hdnPrice").val(P);
                    }
                    var f = !1;
                    for (var b in LastPriceDictionary)
                        if (LastPriceDictionary[b].key == s.InstrumentToken) {
                            (f = !0),
                                (LastPriceDictionary[b].value = s.LastPrice),
                                (LastPriceDictionary[b].Bid = s.Bid),
                                (LastPriceDictionary[b].Ask = s.Ask),
                                (LastPriceDictionary[b].LtpColor = d),
                                (LastPriceDictionary[b].AskColor = p),
                                (LastPriceDictionary[b].BidColor = u);
                            break;
                        }
                    f || LastPriceDictionary.push({ key: s.InstrumentToken, value: s.LastPrice, Bid: s.Bid, Ask: s.Ask, LtpColor: d, AskColor: p, BidColor: u });
                }
            }
            if ($("#buySellModel").hasClass("in")) {
                var a = e.filter((e) => e.InstrumentToken == $("#buySellModel #lblScriptCode").text());
                a.length > 0 &&
                    ($("#buySellModel #lblLastPrice").text(a[0].LastPrice),
                        $("#buySellModel #lblLastBid").text(a[0].Bid),
                        $("#buySellModel #lblLastAsk").text(a[0].Ask),
                        $("#buySellModel #hdnHigh").text(a[0].High),
                        $("#buySellModel #hdnLow").text(a[0].Low),
                        $("#buySellModel #hdnPrice").val(a[0].LastPrice));
            }
            if ("block" == $(".mobile-context-menu").css("display")) {
                var a = e.filter((e) => e.InstrumentToken == clicked_Watchlist_InstrumentToken);
                a.length > 0 && $("#lastPriceMobileContextMenu").html("LTP : " + a[0].LastPrice);
            }
            i++;
        }
}
function SetWatchTradeDetails(e) {
    e.Ask.toFixed(2), e.Bid.toFixed(2);
    var t = ' LTP <span class="price-up" >' + e.LastPrice.toFixed(2) + "</span>",
        i = e.ScriptName.replace(/'/g, "");
    i = "'" + i + "'";
    var l = e.ScriptTradingSymbol.replace(/'/g, "");
    l = "'" + l + "'";
    var r = "'" + e.ScriptInstrumentType + "'",
        a = "'" + e.ScriptExchange.toString() + "'",
        s = parseFloat(e.LastPrice) - parseFloat(e.close),
        n = "",
        o = "",
        c = "";
    s < 0
        ? ((o = (parseFloat(s) / parseFloat(e.close)) * 100),
            "BINANCE" == e.ScriptType && (o = e.PerChange),
            "FOREX" == e.ScriptType && (o = 0),
            (n = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + o.toFixed(2) + "</i>"),
            (c = '<i class="fa percentage-price-down">&nbsp&nbsp' + s.toFixed(2) + "</i>"))
        : s >= 0 &&
        ((o = (parseFloat(s) / parseFloat(e.close)) * 100),
            "BINANCE" == e.ScriptType && (o = e.PerChange),
            "FOREX" == e.ScriptType && (o = 0),
            (n = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + o.toFixed(2) + "</i>"),
            (c = '<i class="fa percentage-price-up">&nbsp&nbsp' + s.toFixed(2) + "</i>"));
    var d = '<input name="hiddenCode" value="' + e.ScriptCode + '" type="hidden" >',
        p = "btnBuy" + e.ScriptCode,
        u = "btnSell" + e.ScriptCode,
        b = "btnMarketDepth" + e.ScriptCode,
        v = ' <button id="btnDelete' + e.ScriptCode + '" onclick="removeScript(' + e.ScriptCode + "," + e.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ',
        h =
            '<div tabindex="-1" style="display:none;" class="b-btn"><button class="btn-buy" id="' +
            p +
            '" onclick="buySellPopUp(' +
            e.ScriptCode +
            ",1," +
            i +
            "," +
            e.WID +
            "," +
            e.LastPrice +
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
            e.LastPrice +
            ')" type="button" class="btn btn-success btn-sm btn-buy">B </button> ',
        y =
            '<button class="btn-sell" id="' +
            u +
            '" onclick="buySellPopUp(' +
            e.ScriptCode +
            ",2," +
            i +
            "," +
            e.WID +
            "," +
            e.LastPrice +
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
            e.LastPrice +
            ')" type="button" class="btn btn-danger btn-sm btn-sell"> S </button> ';
    "FOREX" == e.ScriptType && "RT" == companyInitials && ((e.open = e.open.toFixed(5)), (e.LastPrice = e.LastPrice.toFixed(5)), (e.high = e.high.toFixed(5)), (e.low = e.low.toFixed(5)), (e.close = e.close.toFixed(5)));
    var S = "",
        g = "";
    "" != e.ScriptExpiry && (g = '<span style="color: red;font-size: 13px;">' + e.ScriptExpiry.split(" ")[0] + "</span>");
    var T = "";
    "FUT" == e.ScriptInstrumentType || (("PE" == e.ScriptInstrumentType || "CE" == e.ScriptInstrumentType) && (T = e.ScriptInstrumentType)),
        "" == e.ScriptName && (e.ScriptName = e.ScriptTradingSymbol),
        e.ScriptName.length > 18 && (e.ScriptName = e.ScriptName.substring(0, 18) + "..."),
        (S =
            '<div class="row watchlistRowView" style="border-bottom: 1px solid #ddd;" id="' +
            e.ScriptCode +
            '" data-scriptType="' +
            e.ScriptType +
            '"  data-scripttradingsymbol="' +
            e.ScriptTradingSymbol +
            '" data-scriptexchange="' +
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
            '</p></div><div class="col-5">     <div class="row BID_ASK_SEGMENT" style="margin-left:2px;">             <div class="col-5" style="margin-left:-15px;display: flex;font-size: 20px !important;">               <div class="price-up" style="padding-bottom:0px;">' +
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
    var t = "'" + e.scriptTradingSymbol.toString() + "'",
        i = "'" + $("#custom-tabs-one-tab > li.nav-item.active a").attr("data-id").toString() + "'",
        l = "";
    (l =
        '<div class="row" style="border-bottom: 1px solid #ddd;height:30px;"><div class="col-12"><div class="col-6"> <p class="watchlist-p watchlist-text-BBR">' +
        e.scriptTradingSymbol +
        '</p></div><div class="col-5" style="float: right;position: relative;padding-right: 30px;top:-16px;"><button class="btn btn-primary btn-sm btn-sell" onclick="AddNewScript(' +
        t +
        "," +
        e.intWID +
        "," +
        i +
        "," +
        i +
        "," +
        e.UserId +
        "," +
        e.lot +
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
            data: { scriptTradingSymbol: e, intWID: t, watchListName: i, scriptExchange: l, txtUser: r, Lot: a, Size: s },
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
        $("#Price").removeClass("has-error"),
        $("#buySellModel .modal-title").css("color", "#fff"),
        $("#buySellModel #Terror").hide(),
        $("#buySellModel #Quantity-error").hide(),
        $("#buySellModel #hdnScriptExchange").val(s),
        $("#buySellModel #hdnScriptLotSize").val(o);
    var g = "";
    if (
        (1 == t
            ? ((g = "BUY"),
                $("#buySellModel .modal-title").css("background-color", "#4987ee"),
                $("#buySellModel #btnProceedBuySell").css("background-color", "#4987ee"),
                $("#buySellModel #btnProceedBuySell").css("color", "#fff"),
                $("#buySellModel #btnProceedBuySell").text("PROCEED"))
            : 2 == t &&
            ((g = "SELL"),
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
                    ? null == T[0].FUTURE_TRADING_UNIT_TYPE || "" == T[0].FUTURE_TRADING_UNIT_TYPE || void 0 == T[0].FUTURE_TRADING_UNIT_TYPE
                        ? m.push(1)
                        : (m = T[0].FUTURE_TRADING_UNIT_TYPE.split(","))
                    : null == T[0].OPTIONS_TRADING_UNIT_TYPE || "" == T[0].OPTIONS_TRADING_UNIT_TYPE || void 0 == T[0].OPTIONS_TRADING_UNIT_TYPE
                        ? m.push(1)
                        : (m = T[0].OPTIONS_TRADING_UNIT_TYPE.split(","))
                : null == T[0].OPTIONS_TRADING_UNIT_TYPE || "" == T[0].OPTIONS_TRADING_UNIT_TYPE || void 0 == T[0].OPTIONS_TRADING_UNIT_TYPE
                    ? m.push(1)
                    : (m = T[0].EQUITY_TRADING_UNIT_TYPE.split(",")),
                $.each(m, function (e, t) {
                    "0" == t && (t = "1"),
                        $("#dropTradingUnit").append(
                            $("<option></option>")
                                .val(parseInt(t))
                                .html("1" == t ? "LOT" : "QTY")
                        );
                });
        } else $("#dropTradingUnit").append($("<option></option>").val(parseInt(1)).html("LOT"));
    } else $("#dropTradingUnit").append($("<option></option>").val(parseInt(1)).html("LOT"));
    if (
        ($("#lblScriptSymbol").text(i.toString()),
            $("#lblScriptCode").text(e.toString()),
            $("#lblCurrentPosition").text(g),
            $("#Wid").val(l),
            $("#hdnPrice").val(r),
            $("#hdnTradeID").val(y.toString()),
            $("#Price").val("0"),
            $("#TriggerPrice").val(p.toString()),
            $("#txtStopLoss").val(u.toString()),
            $("#txtTarget").val(b.toString()),
            $("#Quantity").val(n.toString()),
            "EQ" != a ? ($("#rbtnNrml").val("NRML"), $("#Itype").text("NRML")) : ($("#rbtnNrml").val("CNC"), $("#Itype").text("CNC")),
            $("#rbtnMarket").prop("checked", !0),
            $("#rbtnNrml").prop("checked", !0),
            "VM" == companyInitials &&
            ($(".ProductTypeDiv").css("display", "none"), $(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $("#tgtSLDiv").css("display", "none"), $(".tgtSLDivSL").css("display", "none")),
            "EXPO" == companyInitials && ($(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $(".RememberDiv").css("display", "none")),
            0 == v.length)
    ) {
        var P = localStorage.getItem("RememberTargetStoploss");
        null != P
            ? ((P = JSON.parse(P)),
                $("#cbxRememberTargetStoploss").prop("checked", !0),
                null != P.PRODUCT_TYPE && "" != P.PRODUCT_TYPE && ("MIS" == P.PRODUCT_TYPE ? $("input[name=ProductType]#rbtnIntraday").trigger("click") : $("input[name=ProductType]#rbtnNrml").trigger("click")),
                null != P.PRICE_TYPE &&
                "" != P.PRICE_TYPE &&
                ("MARKET" == P.PRICE_TYPE
                    ? $("input[name=MarketType]#rbtnMarket").trigger("click")
                    : "LIMIT" == P.PRICE_TYPE
                        ? $("input[name=MarketType]#rbtnLimit").trigger("click")
                        : "SL" == P.PRICE_TYPE
                            ? $("input[name=MarketType]#rbtnSL").trigger("click")
                            : "SL-M" == P.PRICE_TYPE && $("input[name=MarketType]#rbtnSLM").trigger("click")),
                (v = $("input[name=MarketType]:checked").val()))
            : ($("input[name=MarketType]#rbtnMarket").trigger("click"), $("input[name=ProductType]#rbtnNrml").trigger("click"));
    }
    null != v &&
        "" != v &&
        ("MARKET" == v
            ? $("input[name=MarketType]#rbtnMarket").trigger("click")
            : "LIMIT" == v
                ? $("input[name=MarketType]#rbtnLimit").trigger("click")
                : "SL" == v
                    ? $("input[name=MarketType]#rbtnSL").trigger("click")
                    : "SL-M" == v && $("input[name=MarketType]#rbtnSLM").trigger("click")),
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
    if ((!0 == a.checked && (e = 1), "" != (r = "BUY" == $("#lblCurrentPosition").text() ? $("#lblLastBid").text() : $("#lblLastAsk").text()) && null != r)) {
        var n = { ScriptLotSize: t, ScriptCode: i, quantity: l, Totalwalletbalance: 0, MisOrNot: e, LastPrice: r, TRADING_UNIT_TYPE: $("#dropTradingUnit").val(), scriptExchange: s };
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
                $("#buySellModel #DivGetRequiredMargin").text(e[t].RequiredMargin),
                    $("#buySellModel #DivGetAvailableMargin").text(e[t].AvailableMargin),
                    $("#buySellModel #DivGetUsedMargin").text(e[0].UsedMargin),
                    e[t].RequiredMargin > e[t].AvailableMargin ? $("#DivGetAvailableMargin").css("color", "red") : $("#DivGetAvailableMargin").css("color", "green");
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
        var t = { PRODUCT_TYPE: $("input[name=ProductType]:checked").val(), PRICE_TYPE: $("input[name=MarketType]:checked").val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(t));
    } else localStorage.removeItem("RememberTargetStoploss");
    var i = $("#lblScriptCode").text(),
        l = $("#lblCurrentPosition").text();
    intWID = $("#Wid").val();
    var r = $("#txtTarget").val(),
        a = $("#txtStopLoss").val();
    $("#buySellModel #hdnScriptExchange").val(), $("#buySellModel #hdnScriptLotSize").val();
    var s = $("#Price").val(),
        n = $("#TriggerPrice").val(),
        o = $("#hdnTradeID").val(),
        c = $("input[name=ProductType]:checked").val(),
        d = $("input[name=MarketType]:checked").val();
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
                ("BUY" == l
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
                ("SL" == d && ("SELL" == l && "SL" == d && b > S ? ((T = !0), (y = "Trigger price connot be less than order price")) : "BUY" == l && "SL" == d && b < S && ((T = !0), (y = "Trigger price Cannot be higher than order price"))),
                    "SELL" == l && S > g ? ((T = !0), (y = "Trigger price Cannot be higher than last price")) : "BUY" == l && S < g && ((T = !0), (y = "Trigger price connot be less than last price")),
                    T)
            ) {
                toastr.error(y), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("LIMIT" == d) {
            var b = parseFloat(s),
                v = $("#buySellModel #hdnPrice").val(),
                g = parseFloat(v),
                T = !1,
                y = "";
            if (("SELL" == l && b < g ? ((T = !0), (y = "Limit price Cannot be less than last price")) : "BUY" == l && b > g && ((T = !0), (y = "Limit price connot be greater than last price")), T)) {
                $("#Price").addClass("has-error"), toastr.error(y), $("#btnProceedBuySell").removeAttr("disabled");
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
                Price: s,
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
                return t.IsError ? (HidePopUp(), toastr.error(t.TypeName), !1) : ("0" != o ? toastr.success("Order Updated successfully") : toastr.success("Order Placed successfully"), !1);
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
        (companyInitials = $("#CompanyInitial").val()),
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
        $("input[name=MarketType]").on("click", function (e) {
            var t = $(e.currentTarget).val(),
                i = $("#hdnPrice").val(),
                l = $("#hdnPrice").val();
            $("#txtTarget").removeAttr("disabled"),
                $("#txtTarget").removeAttr("readonly"),
                $("#txtStopLoss").removeAttr("disabled"),
                $("#txtStopLoss").removeAttr("readonly"),
                "LIMIT" == t
                    ? ($("#buySellModel #Price").removeAttr("disabled"),
                        $("#buySellModel #Price").removeAttr("readonly"),
                        $("#buySellModel #Price").val(i),
                        $("#buySellModel #TriggerPrice").val("0"),
                        $("#buySellModel #TriggerPrice").attr("disabled", "disabled"))
                    : "SL" == t
                        ? ($("#buySellModel #Price").removeAttr("disabled"),
                            $("#buySellModel #Price").removeAttr("readonly"),
                            $("#buySellModel #Price").val(i),
                            $("#buySellModel #TriggerPrice").val(l),
                            $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                            $("#buySellModel #TriggerPrice").removeAttr("readonly"))
                        : "SL-M" == t
                            ? ($("#buySellModel #TriggerPrice").removeAttr("disabled"),
                                $("#buySellModel #TriggerPrice").removeAttr("readonly"),
                                $("#buySellModel #TriggerPrice").val(l),
                                $("#buySellModel #Price").val("0"),
                                $("#buySellModel #Price").attr("disabled", "disabled"),
                                $("#txtTarget").attr("disabled", "disabled"),
                                $("#txtTarget").attr("readonly", "readonly"),
                                $("#txtStopLoss").attr("disabled", "disabled"),
                                $("#txtStopLoss").attr("readonly", "readonly"))
                            : "MARKET" == t &&
                            ($("#buySellModel #Price").val("0"),
                                $("#buySellModel #Price").attr("disabled", "disabled"),
                                $("#buySellModel #Price").attr("readonly", "readonly"),
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
                    (clicked_Watchlist_ScriptExchange = $(this).attr("data-scriptexchange")),
                    $("#scriptTradingSymbolMobileContextMenu").html($(this).attr("data-scripttradingsymbol") + ' <span style="font-size:12px;"> (' + clicked_Watchlist_ScriptExchange + ")</span>");
                var e = allObj.filter((e) => e.InstrumentToken == clicked_Watchlist_InstrumentToken);
                e.length > 0 && $("#lastPriceMobileContextMenu").html("LTP : " + e[0].LastPrice),
                    (mobilebuyBtn = $($(this).find(".btn-buy")).find(".btn-buy").prevObject[0].id),
                    (mobilesellBtn = $($(this).find(".btn-sell")).find(".btn-sell").prevObject[0].id),
                    (mobiledeleteBtn = $($(this).find(".btn-delete")).find(".btn-delete").prevObject[0].id),
                    $(".mobile-context-menu").css("display", "block"),
                    MarketDepthPop(clicked_Watchlist_InstrumentToken, $(this).attr("data-scripttradingsymbol"));
            }
        });
}),
    document.body.addEventListener("click", function (e) {
        var t = document.querySelector("ul.mobile-context-menu-list.list-flat"),
            i = document.querySelector("#watchlistDiv");
        "" == t || null == t || t.contains(e.target) || i.contains(e.target) || (window.clearInterval(marketDepthInterval), $(".mobile-context-menu").css("display", "none"));
    });
