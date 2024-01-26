var WalletBalaceInterval;
var GetSegments;
$(window).on('beforeunload', function () {
    var html = '<div class="Main-Loader">' +
        '<div class="loader-wrapper" style="color: white; font-size: 27px; font-weight: bolder;">' +
        '<div class="loader">' +
        '<div class="loader loader-inner"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#Loader-Show').html(html);
});
$(document).ready(function () {
    $('#logoutBtn').on('click', function () {
        newconfirmMobile("to Logout?", function () {
            var resp = $('body').find('.cresp').html();
            $('body').find('.cresp').remove();
            if (resp == 'Yes') {
                window.location.href = "/Home/Logout";
            }
        });
    });
    $('#Loader-Show').html("");
    $('.logout_Btn').on('click', function () {
        newconfirmMobile("Exit this awesome application?", function () {
            var resp = $('body').find('.cresp').html();
            $('body').find('.cresp').remove();
            if (resp == 'Yes') {
                window.location.href = "/Home/Logout";
            }
        });
    });
    var GetSegments = localStorage.getItem('GetSegments');
    if (GetSegments == null || GetSegments == '') {
        localStorage.setItem('GetSegments', $('#Drp-Segments option:selected').val());
        var GetSegments = localStorage.getItem('GetSegments');
    }
    var value = GetSegments.length > 2 ? $('#Drp-Segments').val(GetSegments) : 0;
    $('.TxtSegment_ID').html($('#Drp-Segments option:selected').text());
    $(document).on('change', '#Drp-Segments', function () {
        $('.TxtSegment_ID').html($('#Drp-Segments option:selected').text());
        localStorage.setItem('GetSegments', $('#Drp-Segments option:selected').val());
    });
    //WalletBalaceInterval = setInterval(function () { SetWalletBalance(); }, 6000);
});
function SetWalletBalance() {
    var request = $.ajax({
        url: "/Admin/GetBalanceForTradeIcon",
        type: "GET",
        dataType: 'json',
        async: true,
        success: function (data) {
            $("#WalletBalance").text(data.Amount);
            $("#usedBalance").text(data.TotalProfitLoss);
            if (data.TotalProfitLoss > 0) {
                $("#usedBalance").css('color', 'lime');
            }
            else {
                $("#usedBalance").css('color', 'orangered');
            }
            //var NetAvailableMoney = data.TotalProfitLoss > 0 ? Math.round(data.Amount) + data.TotalProfitLoss : Math.round(data.Amount) + data.TotalProfitLoss;
            //$("#NetBalance").text(NetAvailableMoney);
            //if (NetAvailableMoney > 0) {
            //    $("#NetBalance").css('color', 'dodgerblue');
            //}
            //else {
            //    $("#NetBalance").css('color', 'orangered');
            //}
        }
    });
}

function showForgotModal() {
    $("#ForgotPwd-modal input").val('');
    $("#ForgotPwd-modal #otpArea").hide();
    $("#ForgotPwd-modal #pwdarea").hide();
    $('#ForgotPwd-modal #btnotp').show();
    $('#ForgotPwd-modal #cnfrmBtn').hide();
    $("#ForgotPwd-modal").modal('show');
}
function SendOtp() {
    var mail = $('#ForgotPwd-modal #email').val();

    if (mail != "") {
        var obj = { email: mail };
        $.post("/home/SendForgotPasswordOtp", obj).done(function (response, status) {
            var res = response;
            if (res.message != "") {
                $("#ForgotPasswordModalErrorMessageDiv").css("display", "none");
                $("#ForgotPasswordModalSuccessMessageDiv").css("display", "block");
                $("#ForgotPasswordModalSuccessMessageDiv").css("margin-top", "12px");
                $("#ForgotPasswordModalSuccessMessage").text(res.message);
            }
            if (res.otp != null & res.otp != "") {
                $("#ForgotPwd-modal #hdotp").val(res.otp);
                $("#ForgotPwd-modal #hduid").val(res.uid.toString());
                $("#ForgotPwd-modal #otpArea").show();
                $("#ForgotPwd-modal #pwdarea").show();
                $('#ForgotPwd-modal #btnotp').hide();
                $('#ForgotPwd-modal #cnfrmBtn').show();
            }
        })
            .fail(function (error) {

            });

    }
    else {
        $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
        $("#ForgotPasswordModalErrorMessageDiv").css("margin-top", "12px");
        $("#ForgotPasswordModalErrorMessage").text("Please Enter Your Mail Id");
    }
}
function confirmOtp() {
    var otp = $('#ForgotPwd-modal #otp').val();
    var hdotp = $('#ForgotPwd-modal #hdotp').val();
    if (otp == hdotp) {
        var pwd = $('#ForgotPwd-modal #pwd').val();
        var hduid = $('#ForgotPwd-modal #hduid').val();
        if (pwd != null && pwd != '') {
            var obj = { uid: hduid, password: pwd };
            $.post("/home/UpdateForgotPassword", obj).done(function (response, status) {
                var res = response;
                $('#ForgotPwd-modal').modal('hide');
                toastr.success("Password Updated Successfully");
            });
        }
        else {
            $("#ForgotPasswordModalSuccessMessageDiv").css("display", "none");
            $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
            $("#ForgotPasswordModalErrorMessage").text("Enter Your Password");
            return false;
        }
    }
    else {

        $("#ForgotPasswordModalSuccessMessageDiv").css("display", "none");
        $("#ForgotPasswordModalErrorMessageDiv").css("display", "block");
        $("#ForgotPasswordModalErrorMessage").text("Otp Does Not Matched");
        return false;
    }
}