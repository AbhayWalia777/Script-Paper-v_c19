$('#ExpiryDate').inputmask('mm/dd/yyyy', { 'placeholder': 'mm/dd/yyyy' })

var adminExpiryDate = $('#AdminExpiryDate').val();

$('input', 'form').blur(function () {
    $(this).valid();
});

$(document).ready(function () {
    $("#IsLiveTrader").click(function () {
        if ($("#IsLiveTrader").prop('checked') == true) {
            $('#LiveTraderSettings').show();
        }
        else {
            $('#LiveTraderSettings').hide();
        }


        if ($("#IsLiveTrader").prop('checked') == true || $("#IsPaperTrader").prop('checked') == true) {
            $("#ExpiryDiv").show();
            $("#I_CouponDiv").show();
        }
        else {
            $("#ExpiryDiv").hide();
            $("#I_CouponDiv").hide();
        }
    });

    $("#IsPaperTrader").click(function () {
        if ($("#IsPaperTrader").prop('checked') == true) {
            $('#dvParent').show();
            $('#ThresholdPercentage').prop('required', true);
            $('#AutoCloseActiveTradePer').prop('required', true);
        }
        else {
            $('#dvParent').hide();
            $('#ThresholdPercentage').prop('required', false);
            $('#AutoCloseActiveTradePer').prop('required', false);
        }
        if ($("#IsLiveTrader").prop('checked') == true || $("#IsPaperTrader").prop('checked') == true) {
            $("#ExpiryDiv").show();
            $("#I_CouponDiv").show();
        }
        else {
            $("#ExpiryDiv").hide();
            $("#I_CouponDiv").hide();
        }
    });

    $("#tbllCoupons").on("click", "tr td:nth-child(1)", function () {
        var data = "";
        data = $(this).closest("tr").find("td:eq(1)").text();
        $("#coupon").val(data);
        $('#coupons-modal').modal('hide');
        checkCouponValidity();
    });

    $('#tbllCoupons').DataTable({
        "paging": true,
        "lengthChange": false,
        "order": [[1, 0, "desc"]],
        "info": true,
        "searching": false
    });

    $("#CompanyId").on('change', function () {
        var CompanyId = $("#CompanyId").val();
        $.ajax({
            url: '/Admin/GetRolesByCompanyId?CompanyId=' + CompanyId,
            type: 'Get',
            success: function (data) {
                $('#RoleID').html('');
                var list = $('#RoleID');
                $('#RoleID').append($("<option></option>").val("").html("-Select-"));
                $.each(data, function (i, item) {
                    $('#RoleID').append($("<option></option>").val(item.roleid).html(item.rolename));
                });
            }
        });

    });

    $("#RoleID").on('change', function () {
        var CompanyId = $("#CompanyId").val();
        $.ajax({
            url: '/Admin/GetCompanyByCompanyId?CompanyId=' + CompanyId,
            type: 'Get',
            success: function (resp) {
                var data = JSON.parse(resp);
                if (data.IsLiveTrader == true) {
                    $("#CbxLiveTrader").show();
                }
                else {
                    $("#CbxLiveTrader").hide();
                }
                if (data.IsPaperTrader == true) {
                    $("#CbxPaperTrader").show();
                }
                else {
                    $("#CbxPaperTrader").hide();
                }
                if ($("#RoleID").val() == '1' || $("#RoleID").val() == '3'|| $("#RoleID").val() == '4') {
                    $('#DivWhiteLabelUrl').show();
                } else {
                    $('#DivWhiteLabelUrl').hide();
                }
            }
        });
    });

    $("#couponDataLink").on('click', function GetCouponsData() {
        if ($("#RoleID").val() != null && $("#RoleID").val() != "") {
            $.ajax({
                url: '/Admin/GetAvailableCoupons',
                type: 'Get',
                success: function (data) {
                    var Table = $('#tbllCoupons').DataTable();
                    Table.clear().draw();
                    Table.innerHTML = "";
                    $.each(data, function (i, c) {

                        $.each(c, function (i, coupon) {
                            setCouponsData(coupon);
                        });
                    });
                    $('#coupons-modal').modal('show');
                }
            });
        }
    });
    function setCouponsData(coupon) {

        var CouponType = coupon.CouponType == "2" ? "Paper Trader" : "Live Trader";

        var comptable = $('#tbllCoupons').DataTable().row.add([
            '<button type="button">Apply</button>',
            coupon.Coupon,
            coupon.UserAccountExpiry,
            CouponType
        ]).order([0, 'desc']).draw();

    }
    function checkCouponValidity() {
        var CouponCode = $("#coupon").val();
        var Role_Id = "";
        if ($("#IsPaperTrader").prop('checked') == true) {
            var Role_Id = '2';
        }
        if ($("#IsLiveTrader").prop('checked') == true) {
            Role_Id = '1';
        }

        $.ajax({
            url: "/Admin/CheckCouponValidity",
            type: "post",
            dataType: "json",
            data: { coupon: CouponCode, RoleId: Role_Id },
            success: function (data) {
                if (data != "" && data != null) {
                    if (data.CouponStatus == "4") {
                        $("#couponMessage").html("Coupon Not Valid. Please Contact Administrator.");
                        $("#coupon").val("");
                        $("#ValidFor").val("0");
                    }
                    else if (data.CouponStatus == "3") {
                        $("#couponMessage").html("Coupon Has Been Expired");
                        $("#coupon").val("");
                        $("#ValidFor").val("0");
                    }
                    else {
                        var expiryDay = new Date(new Date($("#NotExpiry").val()));
                        var date = new Date(new Date($("#NotExpiry").val()));
                        var CurrentDay = new Date();
                        if (expiryDay > CurrentDay) {
                            expiryDay = new Date(new Date($("#NotExpiry").val()));
                            date = new Date(new Date($("#NotExpiry").val()));
                        }
                        else {
                            expiryDay = new Date();
                            date = new Date();
                        }

                        var dd = String(expiryDay.getDate()).padStart(2, '0');
                        var mm = String(expiryDay.getMonth() + 1).padStart(2, '0');
                        var yyyy = expiryDay.getFullYear();
                        expiryDay = mm + '/' + dd + '/' + yyyy;
                        date.setDate(date.getDate() + parseInt(data.UserAccountExpiry));
                        dd = String(date.getDate()).padStart(2, '0');
                        mm = String(date.getMonth() + 1).padStart(2, '0');
                        yyyy = date.getFullYear();
                        var NextDay = mm + '/' + dd + '/' + yyyy;
                        $("#couponMessage").html("Coupon Applied. User Will Be Valid For  " + data.UserAccountExpiry + " More Days.User Will Be Expired On " + NextDay + " (MM/DD/YYYY))");
                        $("#ValidFor").val(data.UserAccountExpiry);
                        $("#coupon").attr("readonly", "true");
                        $("#RoleID option:not(:selected)").remove();
                    }
                }
                else {

                }
            }
        });
    }
    $('#ExpiryDate').datepicker({
        autoclose: true,
        useCurrent: true,
        todayHighlight: true,
        todayBtn: true,
        startDate: new Date(),
        endDate: new Date(adminExpiryDate)
    });
    if ($("#IsPaperTrader").prop('checked') == true) {
        $('#dvParent').show();
    }
    else {
        $('#dvParent').hide();
    }
    if ($("#IsLiveTrader").prop('checked') == true) {
        $('#LiveTraderSettings').show();
    }
    else {
        $('#LiveTraderSettings').hide();
    }


    if ($("#RoleID").val() == '1' || $("#RoleID").val() == '3' || $("#RoleID").val() == '4') {
        $('#DivWhiteLabelUrl').show();
    } else {
        $('#DivWhiteLabelUrl').hide();
    }

    if ($("#RoleID").val() == "" || $("#RoleID").val() == null) {
        $('#MarginExposerDiv').hide();
        $('#cbxIsAllowedtoManageBalance').hide();
    }
    else {
        $('#MarginExposerDiv').show();        
        if ($('#RoleID option:selected').text().toLowerCase() == "user" || $('#RoleID option:selected').text().toLowerCase() == "fund manager") {
            $('#cbxIsAllowedtoManageBalance').hide();
        } else {
            $('#cbxIsAllowedtoManageBalance').show();
        }
    }



    $("#RoleID").on('change', function () {
        $('#MarginExposerDiv').show();
        if ($('#RoleID option:selected').text().toLowerCase() == "user" || $('#RoleID option:selected').text().toLowerCase() == "fund manager") {
            $('#cbxIsAllowedtoManageBalance').hide();
        } else {
            $('#cbxIsAllowedtoManageBalance').show();
        }
    });
    $('#FormSubmitButton').on('click', function () {
        if ($("#IsLiveTrader").prop('checked') == true || $("#IsPaperTrader").prop('checked') == true) {
            var UserNameError = $('#GetErrorOnUserName').text();
            if (UserNameError == '') {
                $('#ManageUserForm').submit();
            }
            else {
                $(window).scrollTop($('#UserName').position().top);
                $('#UserName').focus();
                return false;
            }
        }
        else {
            $('#CheckBoxError').html('Please Select One Of The Checkbox');
            $('#CheckBoxError2').html('Please Select One Of The Checkbox');
            $(window).scrollTop($('#IsPaperTrader').position().top);
            $('#IsPaperTrader').focus();
            $(window).scrollTop($('#IsLiveTrader').position().top);
            $('#IsLiveTrader').focus();
            return false;
        }
    });
    var GetUserId = $('#GetUserId').text();
    if (GetUserId == 0) {
        var UserNameTb = $('#UserName');
        UserNameTb.removeAttr('readonly');
        UserNameTb.attr('onkeyup', "this.value=this.value.replace(/[^A-Za-z0-9 ]/g, '');");
        UserNameTb.attr('maxlength', '8');
        $("#UserName").val('.');
        $('#UserName').css('color', 'white');
    }
});


$("#UserName").keyup(function () {

    $('#UserName').css('color', 'black');
    var UserName = $("#UserName").val();
    if (UserName.length == 8) {
        var input = { 'EmailOrMobile': UserName };
        $.ajax({
            type: 'Get',
            contentType: 'application/json',
            data: input,
            datatype: 'json',
            async: false,
            url: '/Admin/CheckEmailMobileExists',
            success: function (response) {
                CheckEmailavail(response);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }
    else {
        if (UserName.length != 0) {
            document.getElementById("UserName").setCustomValidity('Please use atleast 8 Digits !!')
            $("#UserName").attr('title', 'Please use atleast 8 Digits !!')
            $('#GetErrorOnUserName').html('Please use atleast 8 Digits !!');
        }
        else {
            $('#GetErrorOnUserName').html('');
            document.getElementById("UserName").setCustomValidity('');
            $("#UserName").removeAttr('title');
        }
    }
});

function CheckEmailavail(response) {
    if (response != null) {
        var lstData = JSON.parse(response);
        if (lstData == true) {
            document.getElementById("UserName").setCustomValidity('User Name Already Exists !!');
            $("#UserName").attr('title', 'User Name Already Exists !!');
            $('#GetErrorOnUserName').html('User Name Already Exists !!');
            $(window).scrollTop($('#UserName').position().top);
            $('#UserName').focus();
        }
        else {
            $('#GetErrorOnUserName').html('');
            document.getElementById("UserName").setCustomValidity('');
            $("#UserName").removeAttr('title');
        }
    }
}
function SwitchDataTheme() {
    var data = localStorage.getItem('IsDark');
    if (data == 'NO') {
    }
    else {
        $('.content-wrapper').css({ 'background-color': 'black', 'color': 'white' });
        $('li').css('color', 'white');
        $('.content-header>.breadcrumb>li>a').css('color', 'white');
        $('#mainWindow').css('background-color', 'black');
        $('.box-title').css('color', 'white');
        $('.form-control').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'color': 'white', 'background-color': 'black' });
        $('.main-footer').css({ 'background-color': 'black', 'color': 'white' });
        $('.table-bordered').css('border', '1px solid var(--main-color-on-layoutchange)');
        $('input').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'background-color': 'black', 'color': 'white' });
        $('#FormSubmitButton').css({ 'border': '', 'background-color': '', 'color': '' });
        $('.box-header').css('color', 'white');
        $('label').css('color', 'white');
        $('.input-group-addon').css({ 'border': '1px solid var(--main-color-on-layoutchange)', 'background-color': 'black', 'color': 'white' });
        $('.select2-selection').css({ 'border': '2px solid var(--main-color-on-layoutchange)', 'background-color': 'black', 'color': 'white' });
        $('.select2-selection__rendered').css({ 'color': 'white' });
        $('.box-default').css({ 'background-color': 'black', 'color': 'white' });
        var NewUI = '';
        if (MySkin.SkinName != '') {
            NewUI = MySkin.SkinName;
        }
        else {
            if (typeof (Storage) !== 'undefined') {
                NewUI = localStorage.getItem('skin')
            }
        }
        if (NewUI == 'skin-black' || NewUI == 'skin-black-light') {

        }
        else {

        }
    }
}