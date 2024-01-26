var myInterval,
    myInterval2,
    myInterval3,
    myInterval4,
    myInterval5,
    marginInterval,
    SocketInterval,
    ActiveSocketInterval,
    isLiveOrder,
    ActiveTradeAllData,
    companyInitials,
    allowedTradingUnit,
    websocket,
    marketDepthInterval,
    favouriteWatchlistData = [],
    _WatchlistCurrentTabIndex = 0,
    _WatchListLength = 0,
    Completedpageno = 0,
    LastPriceDictionary = [],
    BtnIds = [],
    _WatchlistTotalPageNo = 0,
    _WatchlistCurrentPageNo = 1,
    _WatchlistPreviousTotalPageNo = 0,
    _isWatchlistCallBack = !1,
    _CompletedTotalPageNo = 0,
    _CompletedPreviousTotalPageNo = 0,
    _CompletedCurrentPageNo = 1,
    _CompletedCallBack = !1,
    _ActiveTotalPageNo = 0,
    _ActivePreviousTotalPageNo = 0,
    _ActiveCurrentPageNo = 1,
    _ActiveCallBack = !1,
    Current_Loop_Valueof_Watchlist = 0;
function FavoriteWatchlist() {
    var e = favouriteWatchlistData;
    e.length > 0 &&
        $.map(e, function (e, t) {
            var a = parseFloat(e.LastPrice) - parseFloat(e.close),
                r = "",
                i = "";
            a < 0
                ? ((i = (parseFloat(a) / parseFloat(e.close)) * 100),
                    "BINANCE" == e.ScriptType && (i = e.high),
                    "FOREX" == e.ScriptType && (i = 0),
                    (r = '  <i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp' + i.toFixed(2) + "</i>"))
                : a >= 0 &&
                ((i = (parseFloat(a) / parseFloat(e.close)) * 100),
                    "BINANCE" == e.ScriptType && (i = e.high),
                    "FOREX" == e.ScriptType && (i = 0),
                    (r = '  <i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp' + i.toFixed(2) + "</i>"));
            var l = $(".favorite1");
            1 == t && (l = $(".favorite2")),
                $(l).html('<a style="font-size:15px;color:black;font-weight:bold" class="color-White-Link">' + e.ScriptTradingSymbol + '</a><a style="font-size:14px;font-weight:bold">  ' + e.LastPrice + "&nbsp&nbsp " + r + "</a>");
        });
}
$("#rdPercentage").on("change", function () {
    localStorage.setItem("changetype", "rdPercentage");
}),
    $("#ActiveTradeOnClick").modal("hide"),
    $("#rdAbsolute").on("change", function () {
        localStorage.setItem("changetype", "rdAbsolute");
    });
var allObj = [],
    allActiveAndWatchObj = [];
function initSocket() {
    $.ajax({
        url: "/Home/ConnectWebSocket",
        type: "GET",
        dataType: "json",
        success: function (e) {
            "undefined" != e &&
                (allActiveAndWatchObj = JSON.parse(e)).hasOwnProperty("Table") &&
                ((allObj = allActiveAndWatchObj.Table), allActiveAndWatchObj.hasOwnProperty("Table1") && (allActiveObj = allActiveAndWatchObj.Table1), wt(), setActiveSocketData());
        },
    });
}
var allActiveObj = [];
function wt() {
    var e = allObj;
    if (null != e && "undefined" != e && e.length > 0) {
        for (var t = document.getElementById("tblWatchListTradeListBody"), a = 0; a < t.rows.length;) {
            var r = e.filter((e) => e.InstrumentToken == $(t.rows[a].cells[1]).find("input[name=hiddenCode]").val());
            if (r.length > 0 && null != r && "undefined" != r) {
                var i = r[0],
                    l = 0,
                    o = 0,
                    n = 0,
                    s = "",
                    d = "",
                    c = "";
                for (var p in LastPriceDictionary)
                    if (LastPriceDictionary[p].key == i.InstrumentToken) {
                        (l = parseFloat(LastPriceDictionary[p].value)),
                            (o = parseFloat(LastPriceDictionary[p].Bid)),
                            (n = parseFloat(LastPriceDictionary[p].Ask)),
                            (s = LastPriceDictionary[p].color),
                            (d = LastPriceDictionary[p].LastBidColor),
                            (c = LastPriceDictionary[p].LastAskColor);
                        break;
                    }
                var T = "";
                parseFloat(i.LastPrice) > l && ((T = '<span class="lp" >' + i.LastPrice + "</span>"), (s = "green")),
                    parseFloat(i.LastPrice) < l && ((T = '<span class="lp" >' + i.LastPrice + "</span>"), (s = "red")),
                    i.LastPrice == l && (T = '<span class="lp">' + i.LastPrice + "</span>"),
                    $(t.rows[a].cells[2]).css("background-color", s),
                    $(t.rows[a].cells[2]).html(T),
                    $(t.rows[a].cells[4]).html(i.BidQty);
                var u = "";
                parseFloat(i.Bid) > o && ((u = '<span class="lp">' + i.Bid + "</span>"), (d = "green")),
                    parseFloat(i.Bid) < o && ((u = '<span class="lp">' + i.Bid + "</span>"), (d = "red")),
                    i.Bid == o && (u = '<span class="lp">' + i.Bid + "</span>"),
                    $(t.rows[a].cells[5]).html(u),
                    $(t.rows[a].cells[5]).css("background-color", d);
                var b = "";
                parseFloat(i.Ask) > n && ((b = '<span class="lp">' + i.Ask + "</span>"), (c = "green")),
                    parseFloat(i.Ask) < n && ((b = '<span class="lp">' + i.Ask + "</span>"), (c = "red")),
                    i.Ask == n && (b = '<span class="lp">' + i.Ask + "</span>"),
                    $(t.rows[a].cells[6]).html(b),
                    $(t.rows[a].cells[6]).css("background-color", c),
                    $(t.rows[a].cells[7]).html(i.AskQty),
                    $(t.rows[a].cells[8]).html(i.Open),
                    $(t.rows[a].cells[9]).html(i.High),
                    $(t.rows[a].cells[10]).html(i.Low),
                    $(t.rows[a].cells[11]).html(i.Close);
                var v = !1;
                for (var p in LastPriceDictionary)
                    LastPriceDictionary[p].key == i.InstrumentToken &&
                        ((v = !0),
                            (LastPriceDictionary[p].value = i.LastPrice),
                            (LastPriceDictionary[p].color = s),
                            (LastPriceDictionary[p].Bid = i.Bid),
                            (LastPriceDictionary[p].Ask = i.Ask),
                            (LastPriceDictionary[p].LastAskColor = i.LastAskColor),
                            (LastPriceDictionary[p].LastBidColor = i.LastBidColor));
                v || LastPriceDictionary.push({ key: i.InstrumentToken, value: i.LastPrice, color: s, Bid: i.Bid, Ask: i.Ask, LastBidColor: d, LastAskColor: c });
                var g = $(t.rows[a].cells[0]).find("input[name=scriptType]").val();
                null == i.Close && (i.Close = 0);
                var y = 0,
                    h = 0,
                    S = "";
                !0 == $("#rdPercentage").prop("checked")
                    ? (y = parseFloat(i.LastPrice) - parseFloat(i.Close)) < 0
                        ? (S = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + (h = "BINANCE" == g ? i.Change : "FOREX" == g ? 0 : (parseFloat(y) / parseFloat(i.Close)) * 100).toFixed(2) + "&nbsp%</i>")
                        : y >= 0 &&
                        (S = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + (h = "BINANCE" == g ? i.Change : "FOREX" == g ? 0 : (parseFloat(y) / parseFloat(i.Close)) * 100).toFixed(2) + "&nbsp%</i>")
                    : !0 == $("#rdAbsolute").prop("checked") &&
                    ((y = parseFloat(i.LastPrice) - parseFloat(i.Close)) < 0
                        ? (S = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + y.toFixed(2) + "</i>")
                        : y >= 0 && (S = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + y.toFixed(2) + "</i>")),
                    $(t.rows[a].cells[3]).html(S);
            }
            a++;
        }
        if ($("#buySellModel").hasClass("show")) {
            var r = e.filter((e) => e.InstrumentToken == $("#buySellModel #lblScriptCode").text());
            r.length > 0 &&
                null != r &&
                "undefined" != r &&
                ($("#buySellModel #lblLastPrice").text(r[0].LastPrice),
                    $("#buySellModel #lblLastBid").text(r[0].Bid),
                    $("#buySellModel #lblLastAsk").text(r[0].Ask),
                    $("#buySellModel #hdnHigh").text(r[0].High),
                    $("#buySellModel #hdnLow").text(r[0].Low),
                    $("#buySellModel #hdnPrice").val(r[0].LastPrice));
        }
        null != favouriteWatchlistData &&
            favouriteWatchlistData.length > 0 &&
            $.map(favouriteWatchlistData, function (t, a) {
                var r = e.filter((e) => e.InstrumentToken == t.ScriptCode);
                if (r.length > 0 && null != r && "undefined" != r) {
                    var i = r[0];
                    (t.close = i.Close), (t.LastPrice = i.LastPrice), (t.high = i.Change);
                    var l = parseFloat(t.LastPrice) - parseFloat(t.close),
                        o = "",
                        n = "";
                    l < 0
                        ? (o =
                            '  <i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp' +
                            (n = "BINANCE" == t.ScriptType ? t.high : "FOREX" == t.ScriptType ? 0 : (parseFloat(l) / parseFloat(t.close)) * 100).toFixed(2) +
                            "</i>")
                        : l >= 0 &&
                        (o =
                            '  <i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp' +
                            (n = "BINANCE" == t.ScriptType ? t.high : "FOREX" == t.ScriptType ? 0 : (parseFloat(l) / parseFloat(t.close)) * 100).toFixed(2) +
                            "</i>");
                    var s = $(".favorite1");
                    1 == a && (s = $(".favorite2")),
                        $(s).html('<a style="font-size:15px;color:black;font-weight:bold" class="color-White-Link">' + t.ScriptTradingSymbol + '<a><astyle="fontsize:14px;fontweight:bold">  ' + t.LastPrice + "&nbsp&nbsp " + o + "</a>");
                }
            });
    }
}
function setActiveSocketData() {
    var e = allActiveObj,
        t = allObj,
        a = $("input[name=hdnActiveUserID]").val(),
        r = ActiveTradeAllData,
        i = 0,
        l = e.filter((e) => e.UserID == parseInt(a)),
        o = !1;
    if (null != r && void 0 != r && r.ActiveTrade.length > 0) {
        if (l.length > 0 && null != r && l.length != r.ActiveTrade.length) SetTradeDataForWatch();
        else if (null != l && void 0 != l && l.length > 0)
            $.map(r.ActiveTrade, function (e, a) {
                var r = l.filter((t) => t.ActiveTradeID == e.ActiveTradeID);
                if (r.length > 0) {
                    var n = r[0],
                        s = t.filter((e) => e.InstrumentToken == n.ScriptCode);
                    (e.ObjScriptDTO.LastPrice = s[0].LastPrice),
                        (e.ObjScriptDTO.Ask = s[0].Ask),
                        (e.ObjScriptDTO.Bid = s[0].Bid),
                        (e.Qty = n.Qty),
                        e.Status != n.Status && (o = !0),
                        (e.Status = n.Status),
                        e.OrderPrice != n.OrderPrice && (o = !0),
                        (e.OrderPrice = n.OrderPrice),
                        e.PriceType != n.PriceType && (o = !0),
                        (e.PriceType = n.PriceType),
                        e.SL > 0 && (e.SLNew = e.OrderPrice - e.SL),
                        e.TGT2 > 0 && (e.TGNew = e.TGT2 - e.OrderPrice),
                        (e.CurrentPositionNew = e.CurrentPosition),
                        "sell" == e.CurrentPositionNew.toLowerCase() && (e.SL > 0 && (e.SLNew = e.SL - e.OrderPrice), e.TGT2 > 0 && (e.TGNew = e.OrderPrice - e.TGT2)),
                        "COMPLETE" != e.Status.toUpperCase()
                            ? (e.ProfitOrLoss = 0)
                            : "BUY" == e.CurrentPositionNew
                                ? e.IsLive
                                    ? ((e.ProfitOrLoss = e.Qty * (e.ObjScriptDTO.LastPrice - e.OrderPrice)), (e.FinalProfitLoss = e.Qty * (e.ObjScriptDTO.LastPrice - e.OrderPrice)))
                                    : 0 == e.LAST_PRICE_TYPE && 0 != e.ObjScriptDTO.Bid
                                        ? ((e.ProfitOrLoss = e.Qty * (e.ObjScriptDTO.Bid - e.OrderPrice)), (e.FinalProfitLoss = e.Qty * (e.ObjScriptDTO.Bid - e.CLOSING_PRICE)))
                                        : ((e.ProfitOrLoss = e.Qty * (e.ObjScriptDTO.LastPrice - e.OrderPrice)), (e.FinalProfitLoss = e.Qty * (e.ObjScriptDTO.LastPrice - e.CLOSING_PRICE)))
                                : "SELL" == e.CurrentPositionNew &&
                                (e.IsLive
                                    ? ((e.ProfitOrLoss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.LastPrice)), (e.FinalProfitLoss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.LastPrice)))
                                    : 0 == e.LAST_PRICE_TYPE && 0 != e.ObjScriptDTO.Ask
                                        ? ((e.ProfitOrLoss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.Ask)), (e.FinalProfitLoss = e.Qty * (e.CLOSING_PRICE - e.ObjScriptDTO.Ask)))
                                        : ((e.ProfitOrLoss = e.Qty * (e.OrderPrice - e.ObjScriptDTO.LastPrice)), (e.FinalProfitLoss = e.Qty * (e.CLOSING_PRICE - e.ObjScriptDTO.LastPrice)))),
                        (i += e.ProfitOrLoss);
                } else SetTradeDataForWatch();
            }),
                (ActiveTradeAllData = r),
                (r.TotalActiveTradeProfitOrLoss = i),
                !0 == o && SetTradeDataForWatch(),
                SetResult(JSON.stringify(r), o);
        else {
            var n = $("#tblActiveTradeList").DataTable();
            n.clear().draw(), (n.innerHTML = "");
        }
    } else l.length > 0 && SetTradeDataForWatch();
}
function SetActiveTradeDetails(e, t) {
    var a,
        r,
        i = $("#CompanyInitial").val(),
        l = "'" + e.TradeSymbol + "'",
        o = "'" + e.ScriptInstrumentType + "'",
        n = "'" + e.ProductType + "'",
        s = "'" + e.PriceType + "'",
        d = "'" + e.CurrentPosition.toString() + "'",
        c = "'" + e.Status.toString() + "'",
        p = "'" + e.ObjScriptDTO.ScriptExchange.toString() + "'",
        T = "",
        u = "",
        b = "",
        v = !1;
    "Manual" == e.StrategyName && (v = !0);
    var g = $("#Role_Id").val(),
        y = e.CurrentPosition,
        h = 2,
        S = 0,
        P = "",
        L = "",
        f = "";
    1 == e.TRADING_UNIT_TYPE
        ? ((a = e.Qty / e.ObjScriptDTO.ScriptLotSize), (r = e.TRADING_UNIT))
        : ((r = e.TRADING_UNIT),
            e.ObjScriptDTO.ScriptLotSize > 10 && "MCX" == e.ObjScriptDTO.ScriptExchange && (("EXPO" == e.COMPANY_INITIAL && 51 == e.TENANT_ID) || ("ASR" == e.COMPANY_INITIAL && 57 == e.TENANT_ID) || "RVERMA" == e.COMPANY_INITIAL)
                ? ((a = e.Qty / (e.ObjScriptDTO.ScriptLotSize / 10)), (S = "(" + e.Qty + ")"))
                : (a = e.Qty)),
        "REJECTED" != e.Status.toUpperCase() &&
        ("BUY" == e.CurrentPositionNew && (h = 1),
            (P =
                ' <button class="btn btn-primary btn-sm" onclick="buySellPopUp(' +
                e.BuyQtyWiseOrLot +
                "," +
                e.ScriptCode +
                "," +
                h +
                "," +
                l +
                "," +
                e.WID +
                "," +
                e.OrderPrice +
                "," +
                o +
                "," +
                p +
                "," +
                a +
                "," +
                e.ObjScriptDTO.ScriptLotSize +
                "," +
                e.high +
                "," +
                e.low +
                "," +
                e.TriggerPrice +
                "," +
                e.SLNew +
                "," +
                e.TGNew +
                "," +
                s +
                "," +
                n +
                "," +
                e.ActiveTradeID +
                "," +
                c +
                "," +
                e.isLive +
                ",'EDIT'," +
                e.TRADING_UNIT_TYPE +
                ')" type="button"><i class="fa fa-pencil"></i></button> '),
            (T = ' <button class="btn btn-primary btn-sm" onclick="SquareOff(' + e.ActiveTradeID + "," + d + "," + c + "," + a + "," + v + "," + e.BuyQtyWiseOrLot + "," + e.ObjScriptDTO.ScriptLotSize + ')" type="button">Sqr Off</button> '),
            (u =
                ' <button class="btn btn-danger btn-sm btn-sell" onclick="SquareOff(' +
                e.ActiveTradeID +
                "," +
                d +
                "," +
                c +
                "," +
                a +
                "," +
                v +
                "," +
                e.BuyQtyWiseOrLot +
                "," +
                e.ObjScriptDTO.ScriptLotSize +
                ')" type="button">Sqr Off</button> '),
            "MIS" == e.ProductType &&
            (b = ' <button title="Convert MIS to CNC" class="btn btn-primary btn-sm" onclick="convertButton(' + e.ActiveTradeID + "," + d + "," + c + "," + a + "," + v + ')" type="button"><i class="fa fa-exchange"></i></button> '),
            "OPEN" != e.Status.toUpperCase() && v && (L = '<button class="btn btn-primary btn-sm btn-sell" onclick="AddQty(' + e.ActiveTradeID + "," + d + "," + c + "," + h + ')" type="button"><i class="fa fa-plus"></i></button>')),
        ("REJECTED" == e.Status.toUpperCase() || "OPEN" == e.Status.toUpperCase()) &&
        (f = '<button onclick = "DeleteRejectedTrade(' + e.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-delete" > <i class="fa fa-trash-o"></i></button >');
    var m = 0;
    "BUY" == e.CurrentPositionNew
        ? ((y = u), (m = 0 == e.LAST_PRICE_TYPE ? e.ObjScriptDTO.Bid : e.ObjScriptDTO.LastPrice))
        : "SELL" == e.CurrentPositionNew && ((y = T), (m = 0 == e.LAST_PRICE_TYPE ? e.ObjScriptDTO.Ask : e.ObjScriptDTO.LastPrice)),
        ("PB" == i || "KT" == i) && (L = ""),
        e.ActiveTradeID,
        e.ActiveTradeID;
    var C = P + "" + L + f + b;
    2 == parseInt(g) && !0 == e.IsCopyTradeFlag && ((C = "-"), (y = "-"));
    var D = "";
    D = "FOREX" == e.ObjScriptDTO.ScriptType ? e.TradeSymbol + " / " + e.ObjScriptDTO.ScriptSegment : e.TradeSymbol;
    var A = '<input name="hiddenActiveTradeCode" value="' + e.ActiveTradeID + '" type="hidden" >',
        O = '<input name="hiddenScriptCode" value="' + e.ScriptCode + '" type="hidden" > <input name="hiddenScriptExchange" value="' + e.ObjScriptDTO.ScriptExchange.toString() + '" type="hidden" >',
        M = parseFloat(e.TriggerPrice);
    "FOREX" == e.ObjScriptDTO.ScriptType && "RT" == i
        ? ((e.OrderPrice = e.OrderPrice.toFixed(5)),
            (e.ObjScriptDTO.LastPrice = e.ObjScriptDTO.LastPrice.toFixed(5)),
            (e.ProfitOrLoss = e.ProfitOrLoss.toFixed(5)),
            (e.SL = e.SL.toFixed(5)),
            (e.TGT2 = e.TGT2.toFixed(5)),
            (M = parseFloat(e.TriggerPrice).toFixed(5)))
        : (e.ProfitOrLoss = e.ProfitOrLoss.toFixed(4)),
        e.Status;
    var I = "";
    (I = "#tblActiveTradeList"),
        t &&
        ("SC" == i
            ? $(I)
                .DataTable()
                .row.add([y + A + O, C, D, a + S, r, e.CurrentPositionNew, e.OrderPrice, M, m, e.ProfitOrLoss, e.Status, e.SL, e.TGT2, e.OrderDate, e.OrderTime, e.ProductType, e.WatchListName, e.FundManagerName])
                .draw()
            : $(I)
                .DataTable()
                .row.add([y + A + O, C, D, a + S, r, e.CurrentPositionNew, e.OrderPrice, M, m, e.ProfitOrLoss, e.Status, e.SL, e.TGT2, e.OrderDate, e.OrderTime, e.ProductType, e.StrategyName, e.PublishName, e.FundManagerName])
                .draw());
    for (var k = document.getElementById("tblActiveTradeBody"), x = 0; x < k.rows.length; x++) {
        $(k.rows[x].cells[0]).find("input[name=hiddenActiveTradeCode]").val() == e.ActiveTradeID.toString() &&
            ($(k.rows[x].cells[3]).text(a + S), $(k.rows[x].cells[8]).text(m), $(k.rows[x].cells[9]).text(e.ProfitOrLoss), $(k.rows[x].cells[10]).text(e.Status), $(k.rows[x].cells[11]).text(e.SL), $(k.rows[x].cells[12]).text(e.TGT2));
        var E = parseFloat($(k.rows[x].cells[6]).text()),
            y = $(k.rows[x].cells[5]).text(),
            w = parseFloat($(k.rows[x].cells[12]).text()),
            N = parseFloat($(k.rows[x].cells[13]).text()),
            _ = parseFloat($(k.rows[x].cells[9]).text());
        $(k.rows[x].cells[3]).text() == e.TradeSymbol &&
            (0 == e.ExpireDays
                ? $(k.rows[x].cells[0]).append('<br /><span style="font-size:10px;color:red;"><b>(Expired)</b></span>')
                : 4 != e.ExpireDays && $(k.rows[x].cells[0]).append('<br /><span style="font-size:10px;color:red;"><b>(Expires ' + e.ExpireDays + " days)</b></span>")),
            ((E >= w && w > 0 && "BUY" == y) || (E <= w && w > 0 && "SELL" == y)) && ($(k.rows[x].cells[9]).css("background-color", "#14a964"), $(k.rows[x].cells[9]).css("color", "white")),
            ((E >= N && N > 0 && "BUY" == y) || (E <= N && N > 0 && "SELL" == y)) && ($(k.rows[x].cells[9]).css("background-color", "#14a964"), $(k.rows[x].cells[9]).css("color", "white")),
            _ >= 0 ? ($(k.rows[x].cells[9]).css("background-color", "green"), $(k.rows[x].cells[9]).css("color", "white")) : ($(k.rows[x].cells[9]).css("background-color", "red"), $(k.rows[x].cells[9]).css("color", "white"));
    }
}
function SetWatchTradeDetails(e) {
    var t = 0,
        a = 0,
        r = 0,
        i = "",
        l = "",
        o = "";
    for (var n in LastPriceDictionary)
        if (LastPriceDictionary[n].key == e.ScriptCode) {
            (t = parseFloat(LastPriceDictionary[n].value)),
                (a = parseFloat(LastPriceDictionary[n].Bid)),
                (r = parseFloat(LastPriceDictionary[n].Ask)),
                (i = LastPriceDictionary[n].color),
                (l = LastPriceDictionary[n].LastBidColor),
                (o = LastPriceDictionary[n].LastAskColor);
            break;
        }
    "FOREX" == e.ScriptType && "RT" == companyInitials && ((e.LastPrice = e.LastPrice.toFixed(5)), (e.Bid = e.Bid.toFixed(5)), (e.Ask = e.Ask.toFixed(5)));
    var s = "";
    parseFloat(e.LastPrice) > t && ((s = '<span class="lp">' + e.LastPrice + "</span>"), (i = "green")),
        parseFloat(e.LastPrice) < t && ((s = '<span class="lp">' + e.LastPrice + "</span>"), (i = "red")),
        e.LastPrice == t && (s = '<span class="lp">' + e.LastPrice + "</span>");
    var d = "";
    parseFloat(e.Bid) > a && ((d = '<span class="lp">' + e.Bid + "</span>"), (l = "green")), parseFloat(e.Bid) < a && ((d = '<span class="lp">' + e.Bid + "</span>"), (l = "red")), e.Bid == a && (d = '<span class="lp">' + e.Bid + "</span>");
    var c = "";
    parseFloat(e.Ask) > r && ((c = '<span class="lp">' + e.Ask + "</span>"), (o = "green")), parseFloat(e.Ask) < r && ((c = '<span class="lp">' + e.Ask + "</span>"), (o = "red")), e.Ask == r && (c = '<span class="lp">' + e.Ask + "</span>");
    var p = e.ScriptName.replace(/'/g, "");
    p = "'" + p + "'";
    var T = e.ScriptTradingSymbol.replace(/'/g, "");
    T = "'" + T + "'";
    var u = "'" + e.ScriptInstrumentType + "'",
        b = "'" + e.ScriptExchange.toString() + "'",
        v = "",
        g = "",
        y = "";
    "FOREX" == e.ScriptType
        ? (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp 0.00000 %</i>')
        : "BINANCE" != e.ScriptType
            ? !0 == $("#rdPercentage").prop("checked")
                ? (v = parseFloat(e.LastPrice) - parseFloat(e.close)) < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + (y = (parseFloat(v) / parseFloat(e.close)) * 100).toFixed(5) + "&nbsp%</i>")
                    : v >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + (y = (parseFloat(v) / parseFloat(e.close)) * 100).toFixed(5) + "&nbsp%</i>")
                : !0 == $("#rdAbsolute").prop("checked") &&
                ((v = parseFloat(e.LastPrice) - parseFloat(e.close)) < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + v.toFixed(5) + "</i>")
                    : v >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + v.toFixed(5) + "</i>"))
            : "BINANCE" == e.ScriptType &&
            (!0 == $("#rdPercentage").prop("checked")
                ? e.PerChange < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + e.PerChange.toFixed(5) + "&nbsp%</i>")
                    : e.PerChange >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + e.PerChange.toFixed(5) + "&nbsp%</i>")
                : !0 == $("#rdAbsolute").prop("checked") &&
                (e.ChangeInRupee < 0
                    ? (g = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + e.ChangeInRupee.toFixed(2) + "</i>")
                    : e.ChangeInRupee >= 0 && (g = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + e.ChangeInRupee.toFixed(2) + "</i>")));
    var h = "btnBuy" + e.ScriptCode,
        S = "btnSell" + e.ScriptCode,
        P = "btnMarketDepth" + e.ScriptCode,
        L = ' <button id="btnName' + e.ScriptCode + '" onclick="removeScript(' + e.ScriptCode + "," + e.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ',
        f =
            '<div tabindex="-1" class="b-btn"><button id="' +
            h +
            '" onclick="buySellPopUp(0,' +
            e.ScriptCode +
            ",1," +
            p +
            "," +
            e.WID +
            "," +
            e.LastPrice +
            "," +
            u +
            "," +
            b +
            ",1," +
            e.ScriptLotSize +
            "," +
            e.high +
            "," +
            e.low +
            ')" type="button" class="btn btn-success btn-sm btn-buy"> B </button> ',
        m =
            '<button id="' +
            S +
            '" onclick="buySellPopUp(0,' +
            e.ScriptCode +
            ",2," +
            p +
            "," +
            e.WID +
            "," +
            e.LastPrice +
            "," +
            u +
            "," +
            b +
            ",1," +
            e.ScriptLotSize +
            "," +
            e.high +
            "," +
            e.low +
            ')" type="button" class="btn btn-danger btn-sm btn-sell"> S </button> ',
        C = '<input name="hiddenCode" value="' + e.ScriptCode + '" type="hidden" >',
        D = '<input name="scriptType" value="' + e.ScriptType + '" type="hidden" >',
        A = f + m + L + C + D,
        O = $("#Role_Id").val();
    "RT" == companyInitials && "2" == O && (A = C + D);
    var M = "";
    if (("" != e.ScriptExpiry && (M = '<span style="color: red;font-size: 13px;">Expires On : ' + e.ScriptExpiry.split(" ")[0] + "</span>"), $("#buySellModel #lblScriptCode").text() == e.ScriptCode.toString())) {
        var I = e.LastPrice.toString();
        $("#buySellModel #lblLastPrice").text(I), $("#buySellModel #lblLastBid").text(e.Bid), $("#buySellModel #lblLastAsk").text(e.Ask), $("#buySellModel #hdnPrice").val(I);
    }
    var k = "";
    (k = "FOREX" == e.ScriptType ? e.ScriptTradingSymbol + " / " + e.ScriptSegment : e.ScriptTradingSymbol),
        $("#tblWatchListTradeList")
            .DataTable()
            .row.add([k + M, A, s, g, e.BidQty, d, c, e.AskQty, e.open, e.high, e.low, e.close])
            .draw();
    var x = document.getElementById("tblWatchListTradeList");
    "green" == i ? $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[2]).css("background-color", "green") : $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[2]).css("background-color", "red"),
        "green" == o ? $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[6]).css("background-color", "green") : $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[6]).css("background-color", "red"),
        "green" == l ? $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[5]).css("background-color", "green") : $(x.rows[Current_Loop_Valueof_Watchlist + 1].cells[5]).css("background-color", "red"),
        $("#tblWatchListTradeList").removeClass("collapsed"),
        $("#tblWatchListTradeListBody > tr > td").addClass("padding-0px");
    var E = !1;
    for (var n in LastPriceDictionary)
        LastPriceDictionary[n].key == e.ScriptCode && ((E = !0), (LastPriceDictionary[n].value = e.LastPrice), (LastPriceDictionary[n].color = i), (LastPriceDictionary[n].LastAskColor = o), (LastPriceDictionary[n].LastBidColor = l));
    E || LastPriceDictionary.push({ key: e.ScriptCode, value: e.LastPrice, color: i, Bid: e.Bid, Ask: e.Ask, LastBidColor: l, LastAskColor: o });
    var w = !1;
    for (var n in BtnIds) BtnIds[n].BuyBtnId == h && (w = !0);
    w || BtnIds.push({ BuyBtnId: h, SellBtnId: S, DeleteBtnId: "btnName" + e.ScriptCode, MarketDepthBtnId: P });
}
$(document).ready(function () {
    (allowedTradingUnit = JSON.parse($("#TradingUnitAccess").val())), (isLiveOrder = $("#isLive").val()), (companyInitials = $("#CompanyInitial").val());
    var e = $("#Role_Id").val();
    "RT" == companyInitials && "2" == e && $(".watchlistFilter").css("display", "none"), "BOB" == companyInitials && $("#autoBinanceSLTrailDv").show();
    var t = localStorage.getItem("changetype");
    null == t ? $("#rdPercentage").prop("checked", !0) : $("#" + t).prop("checked", !0),
        $("#cbxOneClick").click(function () {
            !0 == $("#cbxOneClick").prop("checked") ? localStorage.setItem("IsOneClickEnabled", "1") : localStorage.setItem("IsOneClickEnabled", "0");
        }),
        $("#cbxEnableLimitOrders").click(function () {
            var e = 0;
            (e = !0 == $("#cbxEnableLimitOrders").prop("checked") ? 1 : 0),
                $.ajax({
                    url: "/Trade/Update_Enable_Limit_Orders_Flag?Enable_Limit_Orders_Flag=" + e,
                    type: "GET",
                    dataType: "json",
                    success: function (t) {
                        0 == t
                            ? (toastr.success("Updated Successfully"),
                                "1" == e ? ($("#cbxEnableLimitOrders").prop("checked", !0), $("#EnableLimitOrders").val("1")) : ($("#EnableLimitOrders").val("0"), $("#cbxEnableLimitOrders").prop("checked", !1)))
                            : toastr.error("Updated Failed");
                    },
                });
        }),
        $("#cbxHighLowCircuitRequired").click(function () {
            var e = 0;
            (e = !0 == $("#cbxHighLowCircuitRequired").prop("checked") ? 1 : 0),
                $.ajax({
                    url: "/Trade/Update_HighLowCircuitRequired?HighLowCircuitRequired=" + e,
                    type: "GET",
                    dataType: "json",
                    success: function (t) {
                        0 == t
                            ? (toastr.success("Updated Successfully"),
                                1 == e ? ($("#cbxHighLowCircuitRequired").prop("checked", !0), $("#HighLowCircuitRequired").val("1")) : ($("#HighLowCircuitRequired").val("0"), $("#cbxHighLowCircuitRequired").prop("checked", !1)))
                            : toastr.error("Updated Failed");
                    },
                });
        }),
        "1" == localStorage.getItem("IsOneClickEnabled") ? $("#cbxOneClick").prop("checked", !0) : $("#cbxOneClick").prop("checked", !1),
        $("#tblActiveTradeList").DataTable({ paging: !1, lengthChange: !1, info: !1, responsive: !0, processing: !0 }),
        $("#tblCompletedTradeList").DataTable({ paging: !1, lengthChange: !1, order: [[5, 0, "desc"]], info: !1, processing: !0, responsive: !0 }),
        $("#tblWatchListTradeList").DataTable({ paging: !1, lengthChange: !1, processing: !0, info: !0, ordering: !1, searching: !1, responsive: !0 }),
        SetTradeDataForWatch(),
        $("input[name=MarketType]").on("click", function (e) {
            if ("1" == $("#EnableLimitOrders").val()) {
                var t = $(e.currentTarget).val(),
                    a = $("#hdnPrice").val(),
                    r = $("#hdnTriggerPrice").val();
                (r = r > 0 ? r : a),
                    $("#txtTarget").removeAttr("disabled"),
                    $("#txtTarget").removeAttr("readonly"),
                    $("#txtStopLoss").removeAttr("disabled"),
                    $("#txtStopLoss").removeAttr("readonly"),
                    "LIMIT" == t
                        ? ($("#buySellModel #Price").removeAttr("disabled"),
                            $("#buySellModel #Price").removeAttr("readonly"),
                            $("#buySellModel #Price").val(a),
                            $("#buySellModel #TriggerPrice").val("0"),
                            $("#buySellModel #TriggerPrice").attr("disabled", "disabled"))
                        : "SL" == t
                            ? ($("#buySellModel #Price").removeAttr("disabled"),
                                $("#buySellModel #Price").removeAttr("readonly"),
                                $("#buySellModel #Price").val(a),
                                $("#buySellModel #TriggerPrice").val(r),
                                $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                                $("#buySellModel #TriggerPrice").removeAttr("readonly"))
                            : "SL-M" == t
                                ? ($("#buySellModel #txtTarget").val("0"),
                                    $("#buySellModel #txtStopLoss").val("0"),
                                    $("#buySellModel #TriggerPrice").removeAttr("disabled"),
                                    $("#buySellModel #TriggerPrice").removeAttr("readonly"),
                                    $("#buySellModel #TriggerPrice").val(r),
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
            } else $("#rbtnMarket").prop("checked", !0), toastr.error("Not Allowed To Change Market Type");
        }),
        (SocketInterval = setInterval(function () {
            initSocket();
        }, 1e3)),
        initSocket();
});
var pageno = 0;
function removeScript(e, t) {
    confirm("Are you sure you want to delete?") &&
        e > 0 &&
        t > 0 &&
        $.ajax({
            url: "/Watchlist/DeleteScript",
            type: "POST",
            data: { intWID: t, ScriptCode: e },
            dataType: "json",
            traditional: !0,
            success: function (e) {
                return JSON.parse(e).IsError ? (toastr.error("Can Not Delete This Record.There Is One Active Trade."), !1) : (toastr.success("Script Deleted Successfully."), SetTradeDataForWatch(), !1);
            },
        });
}
function setWatchlistData(e) {
    var t = JSON.parse(e);
    if (null != t.objLstWatchList) {
        if (t.objLstWatchList.length > 0) {
            var a,
                r = $("#tblWatchListTradeList").DataTable();
            r.clear().draw(), (r.innerHTML = ""), $("#WalletBalance").html(t.UserWalletBalane);
            for (var i = 0; i < t.objLstWatchList.length; i++) {
                (_WatchlistTotalPageNo = t.objLstWatchList[i].TOTAL_PAGE), (_WatchListLength = t.objLstWatchList.length), (a = t.objLstWatchList[i].TOTAL_PAGE);
                var l = t.objLstWatchList[i];
                (Current_Loop_Valueof_Watchlist = i), SetWatchTradeDetails(l);
            }
            _WatchlistCurrentTabIndex > 0 && $("#tblWatchListTradeListBody > tr:nth-child(" + _WatchlistCurrentTabIndex + ") > td:nth-child(1)").addClass("hover"),
                _WatchlistPreviousTotalPageNo != a && WatchlistPaginationDestroy(),
                (_WatchlistPreviousTotalPageNo = t.objLstWatchList.length > 0 ? t.objLstWatchList[0].TOTAL_PAGE : 1),
                SetWatchlistPagination();
        } else {
            var r = $("#tblWatchListTradeList").DataTable();
            r.clear().draw(), (r.innerHTML = "");
        }
        if (null != t.WatchlistDataForAdd && t.WatchlistDataForAdd.length > 0) for (var i = 0; i < t.WatchlistDataForAdd.length; i++) SetWatchTradeDetailsForAdd(t.WatchlistDataForAdd[i]);
    } else if (null != t.WatchlistDataForAdd) {
        if (t.WatchlistDataForAdd.length > 0) for (var i = 0; i < t.WatchlistDataForAdd.length; i++) SetWatchTradeDetailsForAdd(t.WatchlistDataForAdd[i]);
    } else {
        var r = $("#tblWatchListTradeList").DataTable();
        r.clear().draw(), (r.innerHTML = "");
    }
    favouriteWatchlistData = t.objLstFavoriteWatchList;
}
function SetTradeDataForWatch() {
    try {
        var e = { searchedData: $("#SearchScript").val(), ScriptExchange: $("#DrScriptExchange  option:selected").val() };
        $.ajax({
            url: "/Trade/SetTradeDataForNewUI",
            type: "GET",
            data: e,
            dataType: "json",
            async: !0,
            success: function (e) {
                setWatchlistData(e), SetResult(e, !0);
            },
        });
    } catch (t) {
        alert("Error On SetTradeData.4");
    }
}
function SetWatchTradeDetailsForAdd(e) {
    var t = "'" + e.scriptTradingSymbol.toString() + "'",
        a = "'" + $("#DrScriptExchange  option:selected").val().toString() + "'",
        r = '<button class="btn btn-primary btn-sm btn-sell" onclick="AddNewScript(' + t + "," + e.intWID + "," + a + "," + a + "," + e.UserId + "," + e.lot + "," + e.size + ')" type="button"><i class="fa fa-plus"></i></button>';
    $("#tblWatchListTradeList").DataTable().row.add([e.scriptTradingSymbol.toString(), r, "", "", "", "", "", "", "", "", "", ""]).draw();
}
function AddNewScript(e, t, a, r, i, l, o) {
    null != e &&
        "" != e &&
        void 0 != e &&
        null != r &&
        "" != r &&
        $.ajax({
            url: "/Watchlist/SaveWatchListFromIndex",
            type: "POST",
            data: { scriptTradingSymbol: e, intWID: t, watchListName: a, scriptExchange: r, txtUser: i, Lot: l, Size: o },
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
                            : t.IsError || "" == t.ScriptCode || null == t.ScriptCode || (toastr.success("Script Added Successfully"), $("#SearchScript").val(""), SetTradeDataForWatch());
            },
        });
}
function SetResult(e, t) {
    var a,
        r = JSON.parse(e),
        i = 0;
    if (null != r) {
        if (t) {
            var l = $("#tblActiveTradeList").DataTable();
            l.clear().draw(), (l.innerHTML = "");
        }
        if (r.ActiveTrade.length > 0) {
            ActiveTradeAllData = r;
            for (var o = 0; o < r.ActiveTrade.length; o++) {
                var n = r.ActiveTrade[o];
                r.ActiveTrade[o].Status, (_ActiveTotalPageNo = r.ActiveTrade[o].TOTAL_PAGE), (a = r.ActiveTrade[o].TOTAL_PAGE), SetActiveTradeDetails(n, t);
            }
        } else {
            var l = $("#tblActiveTradeList").DataTable();
            l.clear().draw(), (l.innerHTML = ""), (_ActiveTotalPageNo = 1), (a = 0);
        }
        (_ActivePreviousTotalPageNo = r.ActiveTrade.length > 0 ? r.ActiveTrade[0].TOTAL_PAGE : 1),
            "0.00" == r.TotalActiveTradeProfitOrLoss ? $(".TotalActiveTradeProfitOrLoss > h3").text("0") : $(".TotalActiveTradeProfitOrLoss > h3").text(r.TotalActiveTradeProfitOrLoss.toFixed(4));
        for (var o = 0; o < r.ActiveTrade.length; o++) "COMPLETE" == r.ActiveTrade[o].Status && i++;
        if (
            ($(".TotalActiveTrade").html(i),
                r.TotalActiveTradeProfitOrLoss >= 0
                    ? ($(".dvTotalActiveTradeProfitOrLoss").addClass("bg-green"), $(".dvTotalActiveTradeProfitOrLoss").removeClass("bg-red"))
                    : ($(".dvTotalActiveTradeProfitOrLoss").addClass("bg-red"), $(".dvTotalActiveTradeProfitOrLoss").removeClass("bg-green")),
                r.TotalCompletedTradeProfitOrLoss >= 0
                    ? ($(".dvTotalCompletedTradeProfitOrLoss").addClass("bg-green"), $(".dvTotalCompletedTradeProfitOrLoss").removeClass("bg-red"))
                    : ($(".dvTotalCompletedTradeProfitOrLoss").addClass("bg-red"), $(".dvTotalCompletedTradeProfitOrLoss").removeClass("bg-green")),
                r.TotalCompletedTradeCount > 0 && $(".TotalCompletedTrade").text(r.TotalCompletedTradeCount),
                $(".TotalCompletedTradeProfitOrLoss > h3").text(r.TotalCompletedTradeProfitOrLoss.toFixed(4)),
                null != r && null != r.OrderExceptionList && r.OrderExceptionList.length > 0)
        ) {
            for (
                var s = '<table class="table table-bordered table-striped" id="exceptionsTable"><thead><tr><th>TradingSymbol</th><th>Quantity</th><th>Price</th><th>BuyOrSell</th><th>Message</th></tr></thead><tbody>', o = 0;
                o < r.OrderExceptionList.length;
                o++
            )
                s +=
                    "<tr><td>" +
                    r.OrderExceptionList[o].Tradingsymbol +
                    "</td><td>" +
                    r.OrderExceptionList[o].Quantity +
                    "</td><td>" +
                    r.OrderExceptionList[o].Price +
                    "</td><td>" +
                    r.OrderExceptionList[o].TransactionType +
                    "</td><td>" +
                    r.OrderExceptionList[o].Message +
                    "</td></tr>";
            (s += "</tbody></table>"), $("#errorModal .modal-body").html(s), $("#errorModal").modal("show");
        }
    }
}
function buySellPopUp(e, t, a, r, i, l, o, n, s = 1, d = 1, c = 0, p = 0, T = 0, u = 0, b = 0, v = "", g = "", y = 0, h = "", S = "", P = "", L = "") {
    $("#LblOrderPriceView").text("0"),
        $(".upperClause :input").removeAttr("disabled"),
        $("#btnProceedBuySell").removeAttr("disabled"),
        $("#Price").removeClass("has-error"),
        $("#buySellModel .modal-title").css("color", "#fff"),
        $("#buySellModel #Terror").hide(),
        $("#buySellModel #Quantity-error").hide(),
        $("#buySellModel #hdnScriptExchange").val(n),
        $("#buySellModel #hdnScriptLotSize").val(d),
        $("#buySellModel #hdnHigh").val(c),
        $("#buySellModel #hdnLow").val(p),
        "" == S && (S = $("#hdnIsLiveOrder").val()),
        $("#buySellModel #hdnIsLive").val(S);
    var f = $("#CompanyInitial").val();
    "VM" == f && ($(".ProductTypeDiv").css("display", "none"), $(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $("#tgtSLDiv").css("display", "none"), $("#RememberDiv").css("display", "none")),
        "EXPO" == f && ($(".TriggerPriceDiv").css("display", "none"), $(".rbtnSLDiv").css("display", "none"), $("#RememberDiv").css("display", "none")),
        "MCX" != n ? ($("#QuantityWiseBuy").css("display", "none"), $("#marketTypeDiv").addClass("col-md-offset-4")) : ($("#QuantityWiseBuy").css("display", "block"), $("#marketTypeDiv").removeClass("col-md-offset-4"));
    var m = "";
    if (
        (1 == a ? ((m = "BUY"), $("#buySellModel .modal-title").css("background-color", "#00a65a")) : 2 == a && ((m = "SELL"), $("#buySellModel .modal-title").css("background-color", "#dd4b39")),
            $("#dropTradingUnit").html(""),
            null != allowedTradingUnit)
    ) {
        if (allowedTradingUnit.length > 0) {
            var C = allowedTradingUnit.filter((e) => e.ScriptExchange == n),
                D = [];
            "FUT" == o || "CE" == o || "PE" == o
                ? "FUT" == o
                    ? null == C[0].FUTURE_TRADING_UNIT_TYPE || "" == C[0].FUTURE_TRADING_UNIT_TYPE || void 0 == C[0].FUTURE_TRADING_UNIT_TYPE
                        ? D.push(1)
                        : (D = C[0].FUTURE_TRADING_UNIT_TYPE.split(","))
                    : null == C[0].OPTIONS_TRADING_UNIT_TYPE || "" == C[0].OPTIONS_TRADING_UNIT_TYPE || void 0 == C[0].OPTIONS_TRADING_UNIT_TYPE
                        ? D.push(1)
                        : (D = C[0].OPTIONS_TRADING_UNIT_TYPE.split(","))
                : null == C[0].OPTIONS_TRADING_UNIT_TYPE || "" == C[0].OPTIONS_TRADING_UNIT_TYPE || void 0 == C[0].OPTIONS_TRADING_UNIT_TYPE
                    ? D.push(1)
                    : (D = C[0].EQUITY_TRADING_UNIT_TYPE.split(",")),
                $.each(D, function (e, t) {
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
        ($("#lblScriptSymbol").text(r.toString()),
            $("#lblScriptCode").text(t.toString()),
            $("#lblCurrentPosition").text(m),
            $("#Wid").val(i),
            $("#hdnPrice").val(l),
            $("#hdnTradeID").val(y.toString()),
            $("#Price").val("0"),
            $("#TriggerPrice").val(T.toString()),
            $("#hdnTriggerPrice").val(T.toString()),
            $("#txtStopLoss").val(u.toString()),
            $("#txtTarget").val(b.toString()),
            $("#Quantity").val(s.toString()),
            $("#hdnSt").val(h),
            "EQ" != o ? ($("#rbtnNrml").val("NRML"), $("#Itype").text("NRML")) : ($("#rbtnNrml").val("CNC"), $("#Itype").text("CNC")),
            "EDIT" == P &&
            ($("#LblOrderPriceView").text(l),
                "True" == $("#IsTargetStopLossAbsolute").val() &&
                ("buy" == m.toLowerCase() ? ($("#txtStopLoss").val(u > 0 ? l - u : 0), $("#txtTarget").val(b > 0 ? l + b : 0)) : ($("#txtStopLoss").val(u > 0 ? l + u : 0), $("#txtTarget").val(b > 0 ? l - b : 0)))),
            0 == v.length)
    ) {
        var A = localStorage.getItem("RememberTargetStoploss");
        null != A
            ? ((A = JSON.parse(A)),
                $("#cbxRememberTargetStoploss").prop("checked", !0),
                null != A.PRODUCT_TYPE && "" != A.PRODUCT_TYPE && ("MIS" == A.PRODUCT_TYPE ? $("input[name=ProductType]#rbtnIntraday").trigger("click") : $("input[name=ProductType]#rbtnNrml").trigger("click")),
                null != A.PRICE_TYPE &&
                "" != A.PRICE_TYPE &&
                ("MARKET" == A.PRICE_TYPE
                    ? $("input[name=MarketType]#rbtnMarket").trigger("click")
                    : "LIMIT" == A.PRICE_TYPE
                        ? $("input[name=MarketType]#rbtnLimit").trigger("click")
                        : "SL" == A.PRICE_TYPE
                            ? $("input[name=MarketType]#rbtnSL").trigger("click")
                            : "SL-M" == A.PRICE_TYPE && $("input[name=MarketType]#rbtnSLM").trigger("click")),
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
        null != g && "" != g && ("MIS" == g ? $("input[name=ProductType]#rbtnIntraday").prop("checked", !0) : $("#tgtSLDiv").show()),
        "COMPLETE" == h && $(".upperClause :input").attr("disabled", "disabled"),
        $("#buySellModel").modal({ backdrop: !1, show: !0 }),
        $(".modal-dialog").draggable({ handle: ".modal-header" }),
        $("body").removeClass("modal-open"),
        "" != L && $("#dropTradingUnit option[value=" + L + "]").attr("selected", "selected"),
        $("#dropTradingUnit").removeAttr("disabled"),
        "Open" == h && $("#dropTradingUnit").attr("disabled", "disabled"),
        "1" == localStorage.getItem("IsOneClickEnabled") && "EDIT" != P && ProceedBuySell(),
        (marginInterval = setInterval(function () {
            GetRequiredMargin();
        }, 1e3));
}
function GetRequiredMargin() {
    var e = 0,
        t = $("#buySellModel #hdnScriptLotSize").val();
    $("#buySellModel #DivGetLotSize").text(t);
    var a = $("#lblScriptCode").text(),
        r = $("#Quantity").val(),
        i = $("#WalletBalance").text(),
        l = $("#lblLastPrice").text(),
        o = document.getElementById("rbtnIntraday"),
        n = $("#lblCurrentPosition").text(),
        s = $("#buySellModel #hdnScriptExchange").val();
    if ((!0 == o.checked && (e = 1), "" != (l = "BUY" == n ? $("#lblLastBid").text() : $("#lblLastAsk").text()) && null != l)) {
        var d = "";
        (d = { ScriptLotSize: t, ScriptCode: a, quantity: r, Totalwalletbalance: i, MisOrNot: e, LastPrice: l, TRADING_UNIT_TYPE: $("#dropTradingUnit").val(), scriptExchange: s }),
            $.ajax({
                url: "/Trade/GetRequiredMargin",
                type: "GET",
                data: d,
                dataType: "json",
                success: function (e) {
                    var ee = JSON.parse(e);
                    SetRequiredMargin(ee);
                },
            });
    }
}
function SetRequiredMargin(e) {
    null != e.length &&
        (e.length > 0
            ? (e[0].RequiredMargin > e[0].AvailableMargin ? $("#DivGetAvailableMargin").css("color", "red") : $("#DivGetAvailableMargin").css("color", "green"),
                $("#buySellModel #DivGetRequiredMargin").text(e[0].RequiredMargin),
                $("#buySellModel #DivGetAvailableMargin").text(e[0].AvailableMargin),
                $("#buySellModel #DivGetUsedMargin").text(e[0].UsedMargin))
            : ($("#buySellModel #DivGetRequiredMargin").text(0), $("#buySellModel #DivGetAvailableMargin").text(0), $("#buySellModel #DivGetUsedMargin").text(0)));
}
function ProceedBuySell() {
    var e = $("#Quantity").val();
    if (e < 0.01) {
        toastr.error("Invalid Qty"), HidePopUp();
        return;
    }
    if (!0 == $("#cbxRememberTargetStoploss").prop("checked")) {
        var t = { PRODUCT_TYPE: $("input[name=ProductType]:checked").val(), PRICE_TYPE: $("input[name=MarketType]:checked").val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(t));
    } else localStorage.removeItem("RememberTargetStoploss");
    var a = 0;
    a = !0 == $("#cbxAutoBinanceSlTrail").prop("checked") ? 1 : 0;
    var r = $("#lblScriptCode").text(),
        i = $("#lblCurrentPosition").text();
    intWID = $("#Wid").val();
    var l = $("#txtTarget").val(),
        o = $("#txtStopLoss").val(),
        e = $("#Quantity").val();
    $("#buySellModel #hdnScriptExchange").val(), $("#buySellModel #hdnScriptLotSize").val();
    var n = $("#buySellModel #hdnHigh").val(),
        s = $("#buySellModel #hdnLow").val(),
        d = $("#buySellModel #hdnIsLive").val(),
        c = $("#Price").val(),
        p = $("#TriggerPrice").val(),
        T = $("#hdnTradeID").val(),
        u = $("input[name=ProductType]:checked").val(),
        b = $("input[name=MarketType]:checked").val(),
        v = $("#buySellModel #hdnPrice").val();
    if (null == r || "" == r || null == i || "" == i) {
        alert("Please enter correct details");
        return;
    }
    if (0 == $("#HighLowCircuitRequired").val()) {
        var g = $("#CompanyInitial").val();
        if ("SL" == b || "SL-M" == b) {
            var y = parseFloat(c),
                h = parseFloat(p),
                S = parseFloat(v),
                P = !1,
                L = "";
            if (
                ("SL" == b &&
                    "EXPO" != g &&
                    ("SELL" == i && "SL" == b && y > h ? ((P = !0), (L = "Trigger price connot be less than order price")) : "BUY" == i && "SL" == b && y < h && ((P = !0), (L = "Trigger price Cannot be higher than order price"))),
                    "SELL" == i && h > S ? ((P = !0), (L = "Trigger price Cannot be higher than last price")) : "BUY" == i && h < S && ((P = !0), (L = "Trigger price connot be less than last price")),
                    P)
            ) {
                toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("LIMIT" == b) {
            var y = parseFloat(c),
                v = $("#buySellModel #hdnPrice").val(),
                S = parseFloat(v),
                P = !1,
                L = "";
            if (("SELL" == i && y < S ? ((P = !0), (L = "Limit price Cannot be less than last price")) : "BUY" == i && y > S && ((P = !0), (L = "Limit price connot be greater than last price")), P)) {
                $("#Price").addClass("has-error"), toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    if ((("" != o && "0" != o) || ("" != l && "0" != l)) && "false" == d.toLowerCase()) {
        var f = parseFloat(l),
            m = parseFloat(o),
            C = parseFloat(n),
            D = parseFloat(s),
            y = parseFloat(c),
            A = parseFloat(v);
        if ((y > 0 ? (A = y) : (y = A), "TB" == (g = $("#CompanyInitial").val()))) {
            var L = "";
            if (
                ("BUY" == i
                    ? (f > 0 && (f = A + f) < C && (L = "Target should be greater than High price"), m > 0 && (m = A - m) > D && (L = "StopLoss should be less than Low price"))
                    : (f > 0 && (f = A - f) < D && (L = "Target should be less than Low price"), m > 0 && (m = A + m) > C && (L = "StopLoss  should be greater than High price")),
                    "" != L)
            ) {
                toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
        if ("True" == $("#IsTargetStopLossAbsolute").val()) {
            var L = "";
            if (
                ("BUY" == i
                    ? (f > 0 && f < y && (L = "Target should be greater than Order price"), m > 0 && m > y && (L = "StopLoss should be less than Order price"))
                    : (f > 0 && f > y && (L = "Target should be less than Order price"), m > 0 && m < y && (L = "StopLoss  should be greater than Order price")),
                    "" != L)
            ) {
                toastr.error(L), $("#btnProceedBuySell").removeAttr("disabled");
                return;
            }
        }
    }
    var O = $("#hdnSt").val(),
        M = $("#dropTradingUnit").val();
    r > 0 &&
        intWID > 0 &&
        "" != e &&
        "0" != e &&
        $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: {
                intWID: intWID,
                ScriptCode: r,
                CurrentPosition: i,
                allUsers: !1,
                target: l,
                stopLoss: o,
                Quantity: e,
                Price: c,
                TriggerPrice: p,
                ProductType: u,
                MarketType: b,
                TradeID: T,
                Status: O,
                iscbxAutoBinanceSlTrailEnabled: a,
                TRADING_UNIT: M,
            },
            dataType: "json",
            async: !0,
            success: function (e) {
                var t = JSON.parse(e);
                return t.IsError ? (HidePopUp(), toastr.error(t.TypeName), !1) : ("0" != T ? toastr.success("Order Updated successfully") : toastr.success("Order Placed successfully"), SetTradeDataForWatch(), !1);
            },
        }),
        HidePopUp(),
        $("#btnProceedBuySell").removeAttr("disabled");
}
function HidePopUp() {
    clearInterval(marginInterval), $("#buySellModel").modal("hide");
}
$("#btnexport").click(function () {
    var e = $('#tblCompletedTradeList_filter input[type="search"]').val();
    window.location = '/Trade/download?search="' + e + '"';
}),
    $("#watchList").on("change", function () {
        var e = this.value;
        $("#watchlistHiddenId").val(e), (_WatchlistCurrentPageNo = 1), SetTradeDataForWatch();
    }),
    $("#cboScriptExchange").on("change", function () {
        try {
            (_WatchlistCurrentPageNo = 1), SetTradeDataForWatch();
        } catch (e) {
            alert("Error On SetTradeData.6");
        }
    });
var sqModal = $("#sqOfModal");
function SquareOff(e, t, a, r, i, l, o) {
    $(sqModal).find(".sqMsg").text(""),
        $(sqModal).find("input[name=sqQty]").val(r),
        $(sqModal).find("input[name=hdQty]").val(r),
        $(sqModal).find("input[name=sqActiveTradeId]").val(e),
        $(sqModal).find("input[name=sqStatus]").val(a),
        $(sqModal).find("input[name=sqParam]").val(t),
        $(sqModal).find("input[name=QtyOrLotWise]").val(l),
        $(sqModal).find("input[name=LotSize]").val(o),
        i ? $(sqModal).modal("show") : confirm("Are you sure to square off?") && ProceedSqOf();
}
function ProceedSqOf() {
    $(sqModal).find(".sqMsg").text("");
    var e = $(sqModal).find("input[name=sqQty]").val(),
        t = $(sqModal).find("input[name=hdQty]").val(),
        a = $(sqModal).find("input[name=QtyOrLotWise]").val(),
        r = $(sqModal).find("input[name=LotSize]").val(),
        i = 0;
    if ("" == parseInt(e) || 0 == parseInt(e) || (i = parseInt(e, 10)) > parseInt(t, 10)) return $("#btnProceedSquareOff").removeAttr("disabled"), toastr.error("Invalid Qty"), !1;
    var l = $(sqModal).find("input[name=sqActiveTradeId]").val(),
        o = $(sqModal).find("input[name=sqStatus]").val(),
        n = $(sqModal).find("input[name=sqParam]").val();
    $.ajax({
        url: "/Trade/ManageTradeSquareOff",
        type: "POST",
        data: { ID: l, actionParam: n, status: o, qty: i, BuyQtyWiseOrLot: a, ScriptLotSize: r },
        dataType: "json",
        traditional: !0,
        success: function (e) {
            var t = JSON.parse(e);
            setTimeout(function () {
                location.reload();
            }, 3000); // 3000 milliseconds = 3 seconds
            return 1 == t.exceptionDTO.id ? toastr.success(t.exceptionDTO.Msg) : 0 == t.exceptionDTO.id ? toastr.success(t.exceptionDTO.Msg) : 2 == t.exceptionDTO.id && toastr.success(t.exceptionDTO.Msg), SetTradeData(), !1;

        },
    }),
        $("#btnProceedSquareOff").removeAttr("disabled"),
        $(sqModal).modal("hide");
}
var convertMisToCncModal = $("#convertMisToCncModal");
function ConvertMISToCNC() {
    var e = $(convertMisToCncModal).find("input[name=convertActiveTradeId]").val(),
        t = $(convertMisToCncModal).find("input[name=convertStatus]").val(),
        a = $(convertMisToCncModal).find("input[name=convertParam]").val(),
        r = $(convertMisToCncModal).find("input[name=hdQty]").val();
    $.ajax({
        url: "/Trade/ConvertMisToCnc",
        type: "POST",
        data: { ID: e, actionParam: a, status: t, qty: r },
        dataType: "json",
        traditional: !0,
        success: function (e) {
            var t = JSON.parse(e);
            return $("#errorModal .modal-body").html('<p class="text-success">' + t.exceptionDTO.Msg + "</p>"), $("#errorModal").modal("show"), !1;
        },
    }),
        $("#btnconvertMisToCnc").removeAttr("disabled"),
        $(convertMisToCncModal).modal("hide");
}
function convertButton(e, t, a, r, i) {
    $(convertMisToCncModal).find("input[name=convertQty]").val(r),
        $(convertMisToCncModal).find("input[name=hdQty]").val(r),
        $(convertMisToCncModal).find("input[name=convertActiveTradeId]").val(e),
        $(convertMisToCncModal).find("input[name=convertStatus]").val(a),
        $(convertMisToCncModal).find("input[name=convertParam]").val(t),
        i ? $(convertMisToCncModal).modal("show") : confirm("Are you sure to square off?") && ConvertMISToCNC();
}
function CallSync(e) {
    confirm("Are you sure to sync order?") &&
        $.ajax({
            url: "/Trade/CallSync",
            type: "POST",
            data: { ID: e },
            dataType: "json",
            traditional: !0,
            success: function (e) {
                return JSON.parse(e), $("#errorModal .modal-body").html('<p class="text-success">Order Sync request sent successfully</p>'), $("#errorModal").modal("show"), !1;
            },
        });
}
function MarketDepthPop(e, t) {
    var a = '<button type="button" class="btn btn-success" onclick="HideDepthModal();$(\'#btnBuy' + e + "').click()\">Buy</button>";
    (a += '<button type="button" class="btn btn-danger" onclick="HideDepthModal();$(\'#btnSell' + e + "').click()\">Sell</button>"),
        $("#MarketDepthModal #buySellButtonDiv").html(a),
        $("#MarketDepthModal #lblDepthScriptSymbol").text(t),
        $("#MarketDepthModal #hdnDepthScriptCode").val(e),
        $.ajax({
            url: "/Trade/_MarketDepth",
            type: "POST",
            data: { ScriptCode: e },
            success: function (e) {
                return (
                    $("#MarketDepthModal .modal-body").html(e),
                    $("#MarketDepthModal").modal({ backdrop: !1, show: !0 }),
                    $("body").removeClass("modal-open"),
                    (marketDepthInterval = setInterval(function () {
                        SetMarketDepthForRefresh();
                    }, 1e3)),
                    !1
                );
            },
        });
}
function SetMarketDepthForRefresh() {
    var e = $("#MarketDepthModal #hdnDepthScriptCode").val();
    $.ajax({
        url: "/Trade/_MarketDepth",
        type: "POST",
        data: { ScriptCode: e },
        async: !1,
        success: function (e) {
            return $("#MarketDepthModal #lblDepthLtp").text("(" + $("#hdnDepthLtp").val() + ")"), $("#MarketDepthModal .modal-body").html(e), !1;
        },
    });
}
function HideDepthModal() {
    clearInterval(marketDepthInterval), $("#MarketDepthModal").modal("hide");
}
function HideCompletedTradeModal() {
    $("#CompletedTradeModal").modal("hide");
}
function btnLoginToTradeUsingModal() {
    var e = $("#btnKiteLogin").attr("href");
    return (
        $.ajax({
            url: e,
            type: "GET",
            data: {},
            dataType: "json",
            traditional: !0,
            success: function (e) {
                var t = e;
                if ("" == t) return $("#txtScript").val(""), ShowAlertMessage(1, "Login Sccuessfully."), !1;
                window.location.href = t;
            },
        }),
        !1
    );
}
function SetWatchlistPagination() {
    $("#WatchlistPagination").twbsPagination({
        totalPages: _WatchlistTotalPageNo,
        visiblePages: 2,
        onPageClick: function (e, t) {
            _isWatchlistCallBack ? ((_WatchlistCurrentPageNo = t), (LastPriceDictionary = []), (BtnIds = []), (_WatchlistCurrentTabIndex = 0), SetTradeDataForWatch()) : (_isWatchlistCallBack = !0);
        },
    });
}
function WatchlistPaginationDestroy() {
    $("#WatchlistPagination").empty(), $("#WatchlistPagination").removeData("twbs-pagination"), $("#WatchlistPagination").unbind("page");
}
function SetCompletedPagination() {
    $("#CompletedPagination").twbsPagination({
        totalPages: _CompletedTotalPageNo,
        visiblePages: 2,
        onPageClick: function (e, t) {
            _CompletedCallBack ? ((_CompletedCurrentPageNo = t), SetCompletedTradeModalData()) : (_CompletedCallBack = !0);
        },
    });
}
function CompletedPaginationDestroy() {
    $("#CompletedPagination").empty(), $("#CompletedPagination").removeData("twbs-pagination"), $("#CompletedPagination").unbind("page");
}
function SetActiveTradePagination() {
    $("#ActiveTradePagination").twbsPagination({
        totalPages: _ActiveTotalPageNo,
        visiblePages: 2,
        onPageClick: function (e, t) {
            _ActiveCallBack ? (_ActiveCurrentPageNo = t) : (_ActiveCallBack = !0), SetTradeDataForWatch();
        },
    });
}
function ActiveTradePaginationDestroy() {
    $("#ActiveTradePagination").empty(), $("#ActiveTradePagination").removeData("twbs-pagination"), $("#ActiveTradePagination").unbind("page");
}
function SetCompletedTradeModalData() {
    try {
        var e = $("#watchlistHiddenId").val(),
            t = $("#cboScriptExchange option:selected").val(),
            a = "";
        (a =
            !0 == $("#rdAll").prop("checked")
                ? { tradetype: 0, Wid: e, scriptExchangeType: t, CompletedListPage: _CompletedCurrentPageNo }
                : !0 == $("#rdLive").prop("checked")
                    ? { tradetype: 1, Wid: e, scriptExchangeType: t, CompletedListPage: _CompletedCurrentPageNo }
                    : { tradetype: 2, Wid: e, scriptExchangeType: t, CompletedListPage: _CompletedCurrentPageNo }),
            $.ajax({
                url: "/Trade/SetCompletedTradeData",
                type: "GET",
                data: a,
                dataType: "json",
                async: !0,
                success: function (e) {
                    var t = JSON.parse(e);
                    if (null != t) {
                        var a,
                            r = $("#tblCompletedTradeList").DataTable();
                        if ((r.clear().draw(), (r.innerHTML = ""), null != t.CompletedTrade && t.CompletedTrade.length > 0)) {
                            for (var i = 0; i < t.CompletedTrade.length; i++) {
                                (_CompletedTotalPageNo = t.CompletedTrade[i].TOTAL_PAGE), (a = t.CompletedTrade[i].TOTAL_PAGE);
                                var l = t.CompletedTrade[i];
                                SetCompletedTradeTableDetails(l), $("#CompletedTradeModal td:first-child").addClass("CompletedTradeModal_First_Td");
                            }
                            _CompletedPreviousTotalPageNo != a && CompletedPaginationDestroy(), (_CompletedPreviousTotalPageNo = t.CompletedTrade.length > 0 ? t.CompletedTrade[0].TOTAL_PAGE : 1), SetCompletedPagination();
                        }
                    }
                },
            });
    } catch (r) {
        alert("Error On SetTradeData.");
    }
}
function SetCompletedTradeTableDetails(e) {
    e.CompletedTradeID, "TGT2" == e.Status ? (e.Status = "TARGET") : "TGT3" == e.Status ? (e.Status = "TARGET2") : "TGT4" == e.Status ? (e.Status = "TARGET3") : "SL" == e.Status && (e.Status = "STOPLOSS");
    var t,
        a,
        r =
            '<a href="javascript:void(0)" id="GetCompletedTradeDetail" onclick="ShowDetails(this)" data-bind=' +
            e.CompletedTradeID +
            ' ><i class="fa fa-info-circle"></i> </a>  <a href="javascript:void(0)" class="hideTranDetailRow" onclick="HideDetails(this)" style = "margin-left: 15px;font-size:15px;display:none;" ><i class="fa fa-arrow-circle-up"></i></a> <p style="margin-left: 10px;">  ' +
            e.CompletedTradeID +
            "</p> ",
        i = "";
    (i = "FOREX" == e.ScriptType ? e.TradeSymbol + " / " + e.ScriptSegment : e.TradeSymbol),
        $("#CompanyInitial").val(),
        1 == e.TRADING_UNIT_TYPE
            ? ((t = e.Qty / e.ScriptLotSize), (a = e.TRADING_UNIT))
            : ((a = e.TRADING_UNIT),
                (t =
                    e.ScriptLotSize > 10 && "MCX" == e.ScriptExchange && (("EXPO" == e.COMPANY_INITIAL && 51 == e.TENANT_ID) || ("ASR" == e.COMPANY_INITIAL && 57 == e.TENANT_ID) || "RVERMA" == e.COMPANY_INITIAL)
                        ? e.Qty / (e.ScriptLotSize / 10)
                        : e.Qty)),
        $("#tblCompletedTradeList").DataTable().row.add([r, i, t, a, e.ProfitOrLoss, e.EntryTime, e.CurrentPosition, e.Status]).order([0, "desc"]).draw();
    for (var l = document.getElementById("tblCompletedTradeList"), o = 0; o < l.rows.length; o++) {
        var n = $(l.rows[o].cells[7]).text();
        ("TARGET" == n || "TARGET2" == n || "TARGET3" == n) && ($(l.rows[o].cells[7]).css("background-color", "#14a964"), $(l.rows[o].cells[7]).css("color", "white")),
            "STOPLOSS" == n && ($(l.rows[o].cells[7]).css("background-color", "#d83824"), $(l.rows[o].cells[7]).css("color", "white"));
        var s = $(l.rows[o].cells[4]).text();
        parseFloat(s) >= 0
            ? ($(l.rows[o].cells[4]).css("background-color", "#14a964"), $(l.rows[o].cells[4]).css({ color: "white", "font-weight": "bold" }))
            : 0 > parseFloat(s) && ($(l.rows[o].cells[4]).css("background-color", "#d83824"), $(l.rows[o].cells[4]).css({ color: "white", "font-weight": "bold" }));
    }
}
function BindClick() {
    $("#GetCompletedTradeDetail").bind("click", function () {
        $(".hideTranDetailRow").hide();
        var e = $(this).closest("tr"),
            t = $(e).find(".hideTranDetailRow");
        $(t).show();
        var a = $(this).data("bind");
        $.ajax({
            url: "/Trade/SetCompletedTradeDetailData?CompletedTradeId=" + a,
            type: "GET",
            async: !0,
            success: function (t) {
                null != t && ($("#TranDetail").remove(), $(t).insertAfter(e));
            },
        });
    });
}
$("#btnMoreInfoCompletedTrade").on("click", function () {
    SetCompletedTradeModalData(), $("#CompletedTradeModal").modal("show");
}),
    $("#btnMoreInfoCompletedTrade2").on("click", function () {
        SetCompletedTradeModalData(), $("#CompletedTradeModal").modal("show");
    }),
    $("#SqrOffAllBtn").on("click", function () {
        confirm("Are You Sure You Want To Sqr-Off All Trades ?") && (window.location.href = "/Trade/SqrOffAll");
    });
var addQtyModal = $("#addQtyModal");
function AddQty(e, t, a, r) {
    $(addQtyModal).find(".sqMsg").text(""),
        $(addQtyModal).find("#btnProceedAddQty").removeAttr("disabled"),
        $(addQtyModal).find("input[name=sqActiveTradeId]").val(e),
        $(addQtyModal).find("input[name=sqStatus]").val(a),
        $(addQtyModal).find("input[name=buyorsell]").val(r),
        $(addQtyModal).find("input[name=sqParam]").val(t),
        $(addQtyModal).find("input[name=sqQty]").val("1"),
        $(addQtyModal).modal("show");
}
function ProceedAddQty() {
    $(addQtyModal).find(".sqMsg").text("");
    var e = $(addQtyModal).find("input[name=sqQty]").val(),
        t = 0;
    if ("" == parseInt(e) || 0 == parseInt(e)) return $(addQtyModal).find("#btnProceedAddQty").removeAttr("disabled"), toastr.error("Invalid Qty"), !1;
    t = parseInt(e, 10);
    var a = $(addQtyModal).find("input[name=sqActiveTradeId]").val(),
        r = $(addQtyModal).find("input[name=sqStatus]").val(),
        i = $(addQtyModal).find("input[name=sqParam]").val(),
        l = $(addQtyModal).find("input[name=buyorsell]").val();
    $.ajax({
        url: "/Trade/AddQtyToActiveTrade",
        type: "POST",
        data: { ID: a, actionParam: i, status: r, qty: t, buyorsell: l },
        dataType: "json",
        traditional: !0,
        success: function (e) {
            var t = JSON.parse(e);
            return 1 == t.exceptionDTO.id ? toastr.success(t.exceptionDTO.Msg) : 0 == t.exceptionDTO.id && toastr.error(t.exceptionDTO.Msg), !1;
        },
    }),
        $(addQtyModal).find("#btnProceedAddQty").removeAttr("disabled"),
        $(addQtyModal).modal("hide");
}
function DeleteRejectedTrade(e) {
    confirm("Are you sure you want to delete?") &&
        $.ajax({
            url: "/Trade/DeleteRejectedTrade?ID=" + e,
            type: "GET",
            async: !0,
            success: function (e) {
                null != e && toastr.success(e), SetTradeDataForWatch();
            },
        });
}
function ShowDetails(e) {
    $(".hideTranDetailRow").hide();
    var t = $(e).closest("tr"),
        a = $(t).find(".hideTranDetailRow");
    $(a).show();
    var e = $(e).data("bind");
    $.ajax({
        url: "/Trade/SetCompletedTradeDetailData?CompletedTradeId=" + e,
        type: "GET",
        async: !0,
        success: function (e) {
            null != e && ($("#TranDetail").remove(), $(e).insertAfter(t));
        },
    });
}
function HideDetails(e) {
    $(e).css("display", "none"), $("#TranDetail").remove();
}
$("#SearchScript").on("keyup", function () {
    SetTradeDataForWatch();
});
$("#DrScriptExchange").on("change", function () {
    if ($('#DrScriptExchange').val() == '') {
        $('#SearchScript').hide();
        $('#SearchScript').val('');
    }
    else
        $('#SearchScript').show();
    SetTradeDataForWatch();
});
