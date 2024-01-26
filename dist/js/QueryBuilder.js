var GlobalID = "";
var ControlCounter = 0;
var rowCount = 1;
var removeIcoinID = "aRemove_1";
var isConditionUsed = false;
var selectedRowId = 1;
let DataControlCounter = 0;
$(document).ready(function () {

    $('#dvCandle').css('display', 'none');
    $('#dvTimeInterval').css('display', 'none');
    $('#dvLeftAndRightConditionList').css('display', 'none');
    $('#dvConditionList').css('display', 'none');
    resetValues();
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (index, item) {
                var li;
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category text-bold'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category + " : " + item.label);
                }
            });
        }
    });
SwitchData();
});
$(document).on('change', '#ddlCandle', function () {
    if (GlobalID != "") {
        $('#' + GlobalID).text("[" + $('#ddlCandle')[0].selectedOptions[0].text + "]");
        $('#' + GlobalID).attr('data-value', $('#ddlCandle').val());
    }
    //resetValues();
});
$(document).on('change', '#ddlTimeInterval', function () {
    if (GlobalID != "") {
        $('#' + GlobalID).text("[" + $('#ddlTimeInterval')[0].selectedOptions[0].text + "]");
        $('#' + GlobalID).attr('data-value', $('#ddlTimeInterval').val());
    }
    // resetValues();
});
$(document).on('change', '#ddlLeftAndRightConditionList', function () {
    ControlCounter = ControlCounter + 1;
    isConditionUsed = true;
    //alert($('#ddlLeftAndRightConditionList').val());
    if ($('#ddlLeftAndRightConditionList').val() == 5) {
        $('#CustomeModal').modal('show');
        return;
    }
    else if (GlobalID == "") {
        $('#' + removeIcoinID).before(" <span id='spn_Candel_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='1' data-value='0'>[0]</span> <span id='spn_interval_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='2' data-value='1'>1 minute</span> <span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value='" + $('#ddlLeftAndRightConditionList').val() + "'>" + $('#ddlLeftAndRightConditionList')[0].selectedOptions[0].text + "</span> ");
    }
    else if (GlobalID.indexOf("row") != -1) {
        $('#' + removeIcoinID).before(" <span id='spn_Candel_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='1' data-value='0'>[0]</span> <span id='spn_interval_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='2' data-value='1'>1 minute</span> <span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value='" + $('#ddlLeftAndRightConditionList').val() + "'>" + $('#ddlLeftAndRightConditionList')[0].selectedOptions[0].text + "</span> ");
    }
    else if (GlobalID.indexOf("aRemove") != -1) {
        $('#' + removeIcoinID).before(" <span id='spn_Candel_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='1' data-value='0'>[0]</span> <span id='spn_interval_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='2' data-value='1'>1 minute</span> <span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value='" + $('#ddlLeftAndRightConditionList').val() + "'>" + $('#ddlLeftAndRightConditionList')[0].selectedOptions[0].text + "</span> ");
    }
    else {
        let CandelSpan = 'spn_Candel_' + DataControlCounter;
        if ($('#' + CandelSpan).length == 0 && $('#ddlLeftAndRightConditionList').val() != 5) {
            $('#' + GlobalID).before(" <span id='spn_Candel_" + DataControlCounter + "' data-controlcounter='" + DataControlCounter + "' data-type='1' data-value='0'>[0]</span> <span id='spn_interval_" + DataControlCounter + "' data-controlcounter='" + DataControlCounter + "' data-type='2' data-value='1'>1 minute</span> ");
        }
        else if ($('#ddlLeftAndRightConditionList').val() == 5) {
            $('#spn_Candel_' + DataControlCounter).remove();
            $('#spn_interval_' + DataControlCounter).remove();
        }
        $('#' + GlobalID).text($('#ddlLeftAndRightConditionList')[0].selectedOptions[0].text);
        $('#' + GlobalID).attr('data-value', $('#ddlLeftAndRightConditionList').val());
    }
    if (GlobalID.indexOf("row") == -1) {
        $('#dvCandle').css('display', 'none');
        $('#dvTimeInterval').css('display', 'none');
        $('#dvLeftAndRightConditionList').css('display', 'none');
        $('#dvConditionList').css('display', 'block');
    }
    //resetValues();
});
$(document).on('change', '#ddlConditionList', function () {
    let flag = true;
    let CuurentRowID = 'row_' + selectedRowId;
    $("#" + CuurentRowID).find('span').each(function () {
        if (!$(this).hasClass('spnremove')) {
            let type = $(this).data('type');
            let value = $(this).data('value');
            if (type == "4" && (value == 1 || value == 2 || value == 3 || value == 4 || value == 5)) {
                flag = false;
            }

        }
    });
    if (flag || ($('#ddlConditionList').val() != 1 && $('#ddlConditionList').val() != 2 && $('#ddlConditionList').val() != 3 && $('#ddlConditionList').val() != 4 && $('#ddlConditionList').val() != 5)) {
        ControlCounter = ControlCounter + 1;
        if (GlobalID == "") {
            $('#' + removeIcoinID).before(" <span id='spn_Condition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='4' data-value='" + $('#ddlConditionList').val() + "'>" + $('#ddlConditionList')[0].selectedOptions[0].text + "</span> ");
        }
        else if (GlobalID.indexOf("row") != -1) {
            $('#' + removeIcoinID).before(" <span id='spn_Condition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='4' data-value='" + $('#ddlConditionList').val() + "'>" + $('#ddlConditionList')[0].selectedOptions[0].text + "</span> ");
        }
        else if (GlobalID.indexOf("aRemove") != -1) {
            $('#' + removeIcoinID).before(" <span id='spn_Condition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='4' data-value='" + $('#ddlConditionList').val() + "'>" + $('#ddlConditionList')[0].selectedOptions[0].text + "</span> ");
        }
        else {
            $('#' + GlobalID).text($('#ddlConditionList')[0].selectedOptions[0].text);
            $('#' + GlobalID).attr('data-value', $('#ddlConditionList').val());
        }
        if (GlobalID.indexOf("row") != -1 || GlobalID == "") {
            $('#dvCandle').css('display', 'none');
            $('#dvTimeInterval').css('display', 'none');
            $('#dvLeftAndRightConditionList').css('display', 'block');
            $('#dvConditionList').css('display', 'none');
        }
        else {
            $('#dvCandle').css('display', 'none');
            $('#dvTimeInterval').css('display', 'none');
            $('#dvLeftAndRightConditionList').css('display', 'none');
            $('#dvConditionList').css('display', 'block');
        }
    }
    else {
        alert('Only one comparision is allow');
    }

    //});

    //resetValues();
});
$(document).on('click', '#dvQuery', function () {
    console.log(window.getSelection().getRangeAt(0));
    var el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode;
    GlobalID = el.id;
    let PrevEl = window.getSelection().getRangeAt(0).commonAncestorContainer.previousElementSibling;
    let Type = $(PrevEl).data('type');
    DataControlCounter = $('#' + GlobalID).data('controlcounter');
    selectedRowId = $('#' + GlobalID).data('rowno');
    if (GlobalID.indexOf("row") != -1) {
        if (Type == "3") {
            $('#dvCandle').css('display', 'none');
            $('#dvTimeInterval').css('display', 'none');
            $('#dvLeftAndRightConditionList').css('display', 'none');
            $('#dvConditionList').css('display', 'none');
            removeIcoinID = $(el).find('a')[0].id;
        }
        else {
            $('#dvCandle').css('display', 'none');
            $('#dvTimeInterval').css('display', 'none');
            $('#dvLeftAndRightConditionList').css('display', 'none');
            $('#dvConditionList').css('display', 'none');
        }
    }
    else if (GlobalID.indexOf("spnRemove") != -1) {
        removeIcoinID = GlobalID;
    }
    let rowID = 'row_' + $('#' + GlobalID).data('rowno');
    $("#" + rowID).find('span').each(function () {
        if (!$(this).hasClass('spnremove') && !$(this).hasClass('spnadd')) {
            let type = $(this).data('type');
            let value = $(this).data('value');
            let span = $(this);
            //spanClickCommon(type, span);
            //if (type == "1") {
            //    $('#dvCandle').css('display', 'none');
            //    $('#dvTimeInterval').css('display', 'block');
            //    $('#dvLeftAndRightConditionList').css('display', 'none');
            //    $('#dvConditionList').css('display', 'none');
            //}
            //else if (type == "2") {
            //    $('#dvCandle').css('display', 'none');
            //    $('#dvTimeInterval').css('display', 'none');
            //    $('#dvLeftAndRightConditionList').css('display', 'block');
            //    $('#dvConditionList').css('display', 'none');
            //}
            //else if (type == "3") {
            //    $('#dvCandle').css('display', 'none');
            //    $('#dvTimeInterval').css('display', 'none');
            //    $('#dvLeftAndRightConditionList').css('display', 'none');
            //    $('#dvConditionList').css('display', 'block');
            //}
            //else {
            //    $('#dvCandle').css('display', 'none');
            //    $('#dvTimeInterval').css('display', 'none');
            //    $('#dvLeftAndRightConditionList').css('display', 'block');
            //    $('#dvConditionList').css('display', 'none');
            //}
        }
    });

    // resetValues();
});

function spanClickCommon(type, span) {
    if (type == "1") {
        $('#dvCandle').css('display', 'none');
        $('#dvTimeInterval').css('display', 'none');
        $('#dvLeftAndRightConditionList').css('display', 'none');
        $('#dvConditionList').css('display', 'none');


        var spanParent = $(span).parent();
        var id = $(span).attr("id");
        var thisHtml = $(span)[0].outerHTML;
        $(spanParent).find(span).replaceWith(inputHtml);

        //var locdata = [];
        //$.map($('#ddlCandle option'), function (ele) {
        //    var obj = { label: $(ele).html(), value: $(ele).attr('value') };
        //    locdata.push(obj);
        //});

        SetLocData('ddlCandle');

        $('.spanAutoComplete').attr('placeholder', 'Select a intra-day offset');
        MakeAutocompleteDrop(locdata, spanParent, thisHtml, thisHtml, id, type);

    }
    else if (type == "2") {
        $('#dvCandle').css('display', 'none');
        $('#dvTimeInterval').css('display', 'none');
        $('#dvLeftAndRightConditionList').css('display', 'none');
        $('#dvConditionList').css('display', 'none');

        var spanParent = $(span).parent();
        var id = $(span).attr("id");
        var thisHtml = $(span)[0].outerHTML;
        $(spanParent).find(span).replaceWith(inputHtml);

        //var locdata = [];
        //$.map($('#ddlTimeInterval option'), function (ele) {
        //    var obj = { label: $(ele).html(), value: $(ele).attr('value') };
        //    locdata.push(obj);
        //});
        SetLocData('ddlTimeInterval');
        $('.spanAutoComplete').attr('placeholder', 'Select a offset');
        MakeAutocompleteDrop(locdata, spanParent, thisHtml, thisHtml, id, type);
    }
    else if (type == "3") {
        $('#dvCandle').css('display', 'none');
        $('#dvTimeInterval').css('display', 'none');
        $('#dvLeftAndRightConditionList').css('display', 'none');
        $('#dvConditionList').css('display', 'none');


        var spanParent = $(span).parent();
        var id = $(span).attr("id");
        var spanVal = $(span).attr("data-value");
        if (spanVal != '5') {
            var thisHtml = $(span)[0].outerHTML;
            $(spanParent).find(span).replaceWith(inputHtml);

            //var locdata = [];
            //$.map($('#ddlLeftAndRightConditionList option'), function (ele, i) {
            //    if (i != 0) {
            //        var obj = { label: $(ele).html(), value: $(ele).attr('value') };
            //        locdata.push(obj);
            //    }
            //});

            SetLocData('ddlLeftAndRightConditionList');

            $('.spanAutoComplete').attr('placeholder', 'Select a measure');
            MakeAutocompleteDrop(locdata, spanParent, thisHtml, thisHtml, id, type);
        }
        else {
            $("#CustomeModal #spanIDHidden").val(id);
            $('#CustomeModal').modal('show');
            $('#txtCustomeValue').val($(span).text());
            return;
        }
    }
    else {
        $('#dvCandle').css('display', 'none');
        $('#dvTimeInterval').css('display', 'none');
        $('#dvLeftAndRightConditionList').css('display', 'none');
        $('#dvConditionList').css('display', 'none');

        var spanParent = $(span).parent();
        var id = $(span).attr("id");
        var thisHtml = $(span)[0].outerHTML;
        $(spanParent).find(span).replaceWith(inputHtml);

        //var locdata = [];
        //$.map($('#ddlConditionList option'), function (ele, i) {
        //    var obj = { label: $(ele).html(), value: $(ele).attr('value') };
        //    locdata.push(obj);
        //});

        SetLocData('ddlConditionList');

        $('.spanAutoComplete').attr('placeholder', 'Select a operation');
        MakeAutocompleteDrop(locdata, spanParent, thisHtml, thisHtml, id, type);
    }
}
var locdata = [];
var inputHtml = '<input class="spanAutoComplete from-control" style="min-width:100px">';
$(document).on('click', 'span', function () {

    let type = $(this).data('type');
    let span = $(this);
    if (!$(this).hasClass('spnremove') && !$(this).hasClass('spnadd') && !$(this).hasClass("subSpan"))
        spanClickCommon(type, span);

    else if ($(this).hasClass("subSpan")) {
        $("#CustomeModal #spanIDHidden").val($(this).attr("id"));
        $('#CustomeModal').modal('show');
        $('#txtCustomeValue').val($(span).text());
        return false;
    }

});
function SetLocData(ddlID) {
    locdata = [];
    var theSelect = document.getElementById(ddlID);
    var optgroups = theSelect.getElementsByTagName('optgroup');
    for (var i = 0; i < optgroups.length; i++) {
        var options = optgroups[i].getElementsByTagName('option');

        for (var j = 0; j < options.length; j++) {
            var obj = { label: $(options[j]).html(), value: $(options[j]).attr('value'), category: optgroups[i].getAttribute('label') };
            locdata.push(obj);

        }
    }
}
function MakeAutocompleteDrop(locData, spanParent, eleHtml, existingHtml, id, type) {
    $('.spanAutoComplete').catcomplete({
        source: locData,
        minLength: 0,
        select: function (event, ui) {
            //$(ele).val(ui.item.value);
            $(spanParent).find('.spanAutoComplete').replaceWith(eleHtml);
            var spObj = $(spanParent).find("#" + id);
            if (type == "1")
                $(spObj).text("[" + ui.item.value + "]");
            else
                $(spObj).text(ui.item.label);

            $(spObj).attr("data-value", ui.item.value);
            if (type == 3 && (ui.item.value == '5')) {
                $(spObj).text(" 20 ");
            }
            if (type == 3 && ui.item.value == "6") {
                var diCounter = $(spObj).attr('data-controlcounter');
                $(spObj).html(ui.item.label + "(<span id='spn_SuperTrend_Value_" + diCounter + "' class='subSpan'>7,3</span>)");
            }
            var nextEle = $(spObj).next();
            if ($(nextEle).hasClass('removerow')) {
                if (type == "4") {
                    var diCounter = $(spObj).attr('data-controlcounter');

                    var dCounter = parseInt(diCounter) + 1;
                    var outerHtml = " <span id='spn_LeftRightCondition_" + dCounter + "' data-controlcounter='" + dCounter + "' data-type='3' data-value='' data-secondpart='1'><i class='glyphicon glyphicon-filter' style='color:mehroon; cursor:pointer'></i></span>";
                    $(nextEle).before(outerHtml);

                    let span = $(nextEle).prev();

                    type = $(span).data('type');
                    let newSpanid = $(span).attr("id");
                    //locdata = [];
                    //$.map($('#ddlLeftAndRightConditionList option'), function (ele, i) {
                    //    if (i != 0) {
                    //        var obj = { label: $(ele).html(), value: $(ele).attr('value') };
                    //        locdata.push(obj);
                    //    }
                    //});
                    SetLocData('ddlLeftAndRightConditionList');

                    $(spanParent).find(span).replaceWith(inputHtml);
                    $('.spanAutoComplete').attr('placeholder', 'Select a measure');
                    MakeAutocompleteDrop(locdata, spanParent, outerHtml, outerHtml, newSpanid, type);



                }
                else if ($(spObj).attr('data-secondpart') == '1') {
                    var dCounter = $(spObj).attr('data-controlcounter');
                    var dCounter = dCounter + 1;
                    $(spObj).before(" <span id='spn_Candel_" + dCounter + "' data-controlcounter='" + dCounter + "' data-type='1' data-value='0'>[0]</span> <span id='spn_interval_" + dCounter + "' data-controlcounter='" + dCounter + "' data-type='2' data-value='1'>1 minute</span> ");
                    $(spObj).removeAttr("data-secondpart")
                }
            }

            return false;
        }

    }).focus(function () {
        $(this).catcomplete('search', $(this).val())
    }).focusout(function () {
        $(spanParent).find('.spanAutoComplete').replaceWith(existingHtml);

    });
    $('.spanAutoComplete').focus();
}
$(document).on('click', '#btnAddSubFilter', function () {
    let TotalRowCount = $("#dvQuery").find('div').length;

    let RowCounter = 0;

    ControlCounter = ControlCounter + 1;


    $(this).before("<span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value=''></span>");

    var spanParent = $(this).parent();
    let span = $(this).prev();

    var id = $(span).attr("id");

    var thisHtml = "<span id='spn_Candel_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='1' data-value='0'>[0]</span> <span id='spn_interval_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='2' data-value='1'>1 minute</span> <span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value='' ></span>";
    thisHtml += " <span id='spn_Condition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='4' data-value=''><i class='glyphicon glyphicon-glass' style='color:mehroon; cursor:pointer'></i></span>";
    thisHtml += ' <a href="#" id="aRemove_' + ControlCounter + '" class="removerow" data-rowno="' + ControlCounter + '"><span class="glyphicon glyphicon-remove spnremove" style="color:red;cursor:pointer;" id="spnRemove_' + ControlCounter + '"></span></a>';

    $(spanParent).find(span).replaceWith(inputHtml);
    var buttonHtml = $(this)[0].outerHTML;

    $(this).html('');

    SetLocData('ddlLeftAndRightConditionList');
    //$.map($('#ddlLeftAndRightConditionList option'), function (ele, i) {
    //    if (i != 0) {
    //        var obj = { label: $(ele).html(), value: $(ele).attr('value') };
    //        locdata.push(obj);
    //    }
    //});

    $('.spanAutoComplete').attr('placeholder', 'Select a measure');
    $('.spanAutoComplete').catcomplete({
        source: locdata,
        minLength: 0,

        select: function (event, ui) {

            $(spanParent).find('.spanAutoComplete').replaceWith(thisHtml);
            var spObj = $(spanParent).find("#" + id);
            var diCounter = $(spObj).attr('data-controlcounter');

            if (ui.item.value == "6") {
                $(spObj).html(ui.item.label + "(<span id='spn_SuperTrend_Value_" + diCounter + "' class='subSpan'>7,3</span>)");
            }
            else if (ui.item.value == '5') {
                $(spObj).text(" 20 ");

            }
            else
                $(spObj).text(ui.item.label);

            $(spObj).attr("data-value", ui.item.value);

            CheckEachRow(true, spanParent);
            $(spObj).next().click();
            return false;
        }

    }).focus(function () {
        $(this).catcomplete('search', $(this).val())
    }).focusout(function () {
        $(spanParent).find('.spanAutoComplete').replaceWith(buttonHtml);
    });

    $('.spanAutoComplete').focus();


});
function CheckEachRow(CheckStatus, PrevDiv) {
    if (CheckStatus == true) {
        var newrCount = $(PrevDiv).attr("data-rowno");
        rowCount = parseInt(newrCount) + 1;
        $('#dvQuery').append("<div id='row_" + rowCount + "' data-rowno='" + rowCount + "'>");
        //$('#row_' + rowCount).append('<br/>');
        $('#row_' + rowCount).append('<a href="#" id="btnAddSubFilter" class="addrow" data-rowno="' + rowCount + '"><span class="glyphicon glyphicon-plus-sign spnadd" style="color:blue;cursor:pointer;" id="spnadd_"' + rowCount + '></span></a></div>');
        //$('#row_' + rowCount).append('<a href="#" id="aRemove_' + rowCount + '" class="removerow" data-rowno="' + rowCount + '"><span class="glyphicon glyphicon-remove spnremove" style="color:red;cursor:pointer;" id="spnRemove_"' + rowCount + '></span></a>');
        $('#dvCandle').css('display', 'none');
        $('#dvTimeInterval').css('display', 'none');
        $('#dvLeftAndRightConditionList').css('display', 'none');
        $('#dvConditionList').css('display', 'none');
        removeIcoinID = 'aRemove_' + rowCount;
        selectedRowId = rowCount;

    }
    else {
        alert("Incorrect Query.");
    }
}
$('#btnSubmit').on('click', function () {
    let QueryArr = [];
    let RowCounter = 0;
    let TotalRowCount = $("#dvQuery").find('div').length;
    let submitQuery = false;
    $("#dvQuery").find('div').each(function () {
        RowCounter = RowCounter + 1;
        let rowID = this.id;
        let TotalCount = $("#" + rowID).find('span').not(".subSpan").length;
        let isConditionFlag = false;
        let isLastElementFlag = false;
        let Counter = 0;

        $("#" + rowID).find('span').each(function () {
            if (!$(this).hasClass('spnremove') && !$(this).hasClass('spnadd') && !$(this).hasClass('subSpan')) {
                let type = $(this).data('type');
                let value = $(this).attr('data-value');
                let customevalue = ((type == 3 && value == "5") ? $(this).text() : '0');
                if (type == "3" && value == "6")
                    customevalue = $(this).find('.subSpan').text();
                QueryArr.push({ type: type, value: value, Order: Counter, RowCounter: RowCounter, customevalue: customevalue });
                if (type == "4") {
                    isConditionFlag = true;
                }
                if (RowCounter == TotalRowCount - 1 && Counter == (TotalCount - 2) && type == "3" && isConditionFlag == true) {
                    isLastElementFlag = true;
                    Submit(QueryArr, true);
                    submitQuery = true;
                }
                else {
                    isLastElementFlag = true;
                }
                Counter = Counter + 1;
            }
            //else if ($(this).hasClass('spnadd')) {
            //    if (RowCounter == TotalRowCount && Counter == (TotalCount - 2)  && isConditionFlag == true) {
            //        isLastElementFlag = true;
            //        Submit(QueryArr, true);
            //    }
            //}
           
        });
    });
    if (!submitQuery) {
        showInfoModal("<p> Every filter should have comparison operator </p>");
    }
});
$(document).on('click', '.removerow', function () {
    //if ($("#dvQuery").find('div').length != 1) {
    let rowno = $(this).data('rowno');
    let ControlID = 'row_' + rowno;
    if (confirm("Are you sure to remove row?")) {
        $('#' + ControlID).remove();
    }
    //}
    //else {
    //    alert('can not be delete last row');
    //}
});
function Submit(QueryArr, isSave, isInterval) {
    $('#dvResult').html('');
    //console.log(QueryArr);
    var request = $.ajax({
        url: "/Strategy/QueryBuilder",
        type: "Post",
        data: {
            objQueryBuilderScript: QueryArr, 'Query': $("#dvQuery").html(), 'Name': $("#txtName").val(), isSave: isSave, StrategyID: $('#hndStrategyID').val(),
            StockType: $('#ddlStockType').val(), FilterOn: $('#ddlFilterOn').val(), WID: $('#ddlWatchlist').val(), QueryBuilderID: $("#hndQueryBuilderID").val(), BuyOrSell: $("#ddlBuyorSell").val()
        },
        success: function (data) {
            //console.log(data);
            if (!isSave) {
                $('#dvResult').html(data);
                if (!isInterval) {
                    //window.setInterval(function () { runQueryBuilder(true); }, 5000);
                }
            }
            else {
                $("#hndQueryBuilderID").val(data.ID);
                showInfoModal("<p> Record submitted successfully </p>");
            }
        }
    });
}
function showInfoModal(msg) {
    $("#qInfoModal .modal-body").html(msg)
    $("#qInfoModal").modal('show');
}
$('#btnRun').on('click', function () {
    runQueryBuilder(false);
});
function runQueryBuilder(isInterval) {

    let QueryArr = [];
    let RowCounter = 0;
    let TotalRowCount = $("#dvQuery").find('div').length;
    let submitQuery = false;
    $("#dvQuery").find('div').each(function () {
        RowCounter = RowCounter + 1;
        let rowID = this.id;
        let TotalCount = $("#" + rowID).find('span').not(".subSpan").length;
        let isConditionFlag = false;
        let isLastElementFlag = false;
        let Counter = 0;

        $("#" + rowID).find('span').each(function () {
            if (!$(this).hasClass('spnremove') && !$(this).hasClass('spnadd')) {
                let type = $(this).data('type');
                let value = $(this).attr('data-value');
                let customevalue = (type == 3 && value == "5") ? $(this).text() : '0';
                if (type == "3" && value == "6")
                    customevalue = $(this).find('.subSpan').text();
                QueryArr.push({ type: type, value: value, Order: Counter, RowCounter: RowCounter, customevalue: customevalue });
                if (type == "4") {
                    isConditionFlag = true;
                }
                if (RowCounter == TotalRowCount - 1 && Counter == (TotalCount - 2) && type == "3" && isConditionFlag == true) {
                    isLastElementFlag = true;
                    Submit(QueryArr, false, isInterval);
                    submitQuery = true;
                }
                else {
                    isLastElementFlag = true;
                }
            }
            Counter = Counter + 1;
        });
    });
    if (!submitQuery) {
        showInfoModal("<p> Every filter should have comparison operator </p>");
    }
}
function resetValues() {
    $('#ddlCandle').val('');
    $('#ddlTimeInterval').val('');
    $('#ddlLeftAndRightConditionList').val('');
    $('#ddlConditionList').val('');
}
function checkComparisionFlag() {
    $("#dvQuery").find('div').each(function () {
        RowCounter = RowCounter + 1;
        let rowID = this.id;
        let TotalCount = $("#" + rowID).find('span').length;
        let isConditionFlag = false;
        let isLastElementFlag = false;
        let Counter = 0;

        $("#" + rowID).find('span').each(function () {
            if (!$(this).hasClass('spnremove')) {
                let type = $(this).data('type');
                let value = $(this).data('value');
                QueryArr.push({ type: type, value: value, Order: Counter, RowCounter: RowCounter });
                if (type == "4") {
                    isConditionFlag = true;
                }
                if (RowCounter == TotalRowCount && Counter == (TotalCount - 2) && type == "3" && isConditionFlag == true) {
                    isLastElementFlag = true;
                    Submit(QueryArr, true);
                }
                else {
                    isLastElementFlag = true;
                }
            }
            Counter = Counter + 1;
        });
    });

}
$(document).on('keypress', '#dvQuery', function (e) {

    return false;
});
$(document).on('click', '#btnCustomeSubmite', function () {
    let CustomeVolume = $('#txtCustomeValue').val();
    if (CustomeVolume == null || CustomeVolume == '') {
        alert('Value can not be black');
        return false;
    }
    else {
        //if (GlobalID == "") {
        //    $('#' + removeIcoinID).before(" <span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value='" + $('#ddlLeftAndRightConditionList').val() + "'>" + $('#txtCustomeValue').val() + "</span> ");
        //}
        //else if (GlobalID.indexOf("row") != -1) {
        //    $('#' + removeIcoinID).before(" <span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value='" + $('#ddlLeftAndRightConditionList').val() + "'>" + $('#txtCustomeValue').val() + "</span> ");
        //}
        //else if (GlobalID.indexOf("aRemove") != -1) {
        //    $('#' + removeIcoinID).before(" <span id='spn_LeftRightCondition_" + ControlCounter + "' data-controlcounter='" + ControlCounter + "' data-type='3' data-value='" + $('#ddlLeftAndRightConditionList').val() + "'>" + $('#txtCustomeValue').val() + "</span> ");
        //}
        //else {
        //    if ($('#spn_Candel_' + DataControlCounter).length > 0) {
        //        $('#spn_Candel_' + DataControlCounter).remove();
        //        $('#spn_interval_' + DataControlCounter).remove();
        //    }
        //    $('#' + GlobalID).text($('#txtCustomeValue').val());
        //    $('#' + GlobalID).attr('data-value', $('#ddlLeftAndRightConditionList').val());
        //}
        //if (GlobalID.indexOf("row") == -1) {
        //    $('#dvCandle').css('display', 'none');
        //    $('#dvTimeInterval').css('display', 'none');
        //    $('#dvLeftAndRightConditionList').css('display', 'none');
        //    $('#dvConditionList').css('display', 'block');
        //}
        $("#" + $("#CustomeModal #spanIDHidden").val() + "").html(CustomeVolume);
        $('#CustomeModal').modal('hide');
    }
});
$(document).on('keydown', '#txtCustomeValue', function (e) {
    var key = e.charCode || e.keyCode || 0;
    return (key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 188 || key == 190 || (key >= 35 && key <= 50) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
});
//$(document).on('click', '#dvQuery', function () {
//    let id = $(this).attr('id');
//    GlobalID = id;
//});


 function SwitchData() {
        var data = localStorage.getItem('IsDark');
        if (data == 'NO') {
        clearInterval(intervalPagging);
                          }
    else {
            intervalPagging = setInterval(function () { PaginationColor(); }, 1000);
        $('.content-wrapper').css({'background-color': 'black' ,'color' : 'white'});
        $('.datatableheader').css('background-color','var(--main-color-on-layoutchange)');
        $('li').css('color','white');
        $('.content-header>.breadcrumb>li>a').css('color','white');
        $('#mainWindow').css('background-color','black');
        $('.box-title').css('color','white');
        $('#tblList').removeClass('table-striped');
        $('input').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $(".box-default").css('background-color','black');
        $(".box-default").css('background-color','black');
        $('#dvQuery').css('border','2px solid var(--main-color-on-layoutchange)');
        $('#btnSubmit').css({'border':'','color':'','background-color':''});
        $('#btnRun').css({'border':'','color':'','background-color':''});
        $('.form-control').css({'border':'2px solid var(--main-color-on-layoutchange)','color':'white','background-color':'black'});
        $('li.disabled > a').css({'background-color':'black','color':'white'});
        $('.main-footer').css({'background-color':'black','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.dataTables_empty').css({'border-top-color':'black','background-color':'black'});
        $('.sorting_1').css('border','0px solid black');

var NewUI='';
        if (MySkin.SkinName != '')
        {
        NewUI = MySkin.SkinName;
        }
        else
        {
        if (typeof (Storage) !== 'undefined') {
            NewUI = localStorage.getItem('skin');
        }
        }
          if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {
                $('.datatableheader').css('color','black');
                }
                else
                {
                    $('.datatableheader').css('color','white');
                }

        $('.list-unstyled >li >a').on('click', function () {
        SwitchData();
        });
    }
}
        $('.list-unstyled >li >a').on('click', function () {
        SwitchData();
        });

        function PaginationColor(){
        $('ul.pagination >li>a').css({'background-color':'black','color':'white'});
        $('ul.pagination >li.active>a').css({'background-color':'#337ab7','color':'white'});
        $('.table-bordered>thead>tr>th, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>tbody>tr>td, .table-bordered>tfoot>tr>td').css('border','1px solid var(--main-color-on-layoutchange)');
        $('.table-bordered').css('border','1px solid var(--main-color-on-layoutchange)');
        }