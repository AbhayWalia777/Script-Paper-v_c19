//Declaration
var balanceInterval;
//Declaration End
GetUserBalance();
PaperTradeNotification();
window.setInterval(function () {
	if ($('#sidebarPanel').hasClass('show')) {
		GetUserBalance();
		PaperTradeNotification();
	}

}, 1000);
function GetUserBalance() {
	$.ajax({
		url: "/Admin/GetBalance",
		type: "GET",
		dataType: "json",
		async: !0,
		success: function (e) {
			$('.WalletBalance').html(e.amount);
			$('#Profitorloss').html(e.Totalprofitloss);
			if (parseInt(e.Totalprofitloss) >= 0) {
				$('#Profitorloss').css('color', '#00b386');
			} else {
				$('#Profitorloss').css('color', '#eb5b3c');
			}
			$('#DailyTotalprofitloss').html(e.DailyTotalprofitloss);
			if (parseInt(e.DailyTotalprofitloss) >= 0) {
				$('#DailyTotalprofitloss').css('color', '#00b386');
			} else {
				$('#DailyTotalprofitloss').css('color', '#eb5b3c');
			}
		}
	});
}
function PaperTradeNotification() {
	$.ajax({
		url: '/Trade/GetTotalPaperTradeNotification',
		type: 'GET',
		success: function (data) {
			if (data != '0') {
				$("#PaperTradeNotificationCount").html(data);
			}
			else {
				$("#PaperTradeNotificationCount").html('0');
			}
		},

		error: function (error) {

		}
	});
}
function getQueryStringValue(key) {
	return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
$(window).on('beforeunload', function () {
	$('#loader').show()
});

function playBeep() {
	beepSound.play();
}
$('#btnKiteLoginHome').on('click', function () {
	var url = $(this).attr("href");
	var request = $.ajax({
		url: url,
		type: "GET",
		data: {},
		dataType: 'json',
		traditional: true,
		success: function (data) {
			var results = data;

			if (results == "") {
				$("#txtScript").val("");
				ErrorAlert("Please Update Your Details In Api Settings");
				return false;
			}
			else {
				var arr = url.split('/')
				if (arr[2] == 'KotakSecuritiesLogin') {
					SuccessAlert("Login Successfully");
				}
				else {
					window.location.href = results;
					//$('#TxtApiLoginHome').val(results);
					//$('#BtnactionSheetDefault00').trigger('click');
				}
				return;
			}
		}
	});
	return false;
})
function copyText() {
	var textbox = document.getElementById("TxtApiLoginHome");
	textbox.select();
	textbox.setSelectionRange(0, 99999); // For mobile devices
	document.execCommand("copy");
	SuccessAlert("Text copied to clipboard");
}
function copyText_second() {
	var textbox = document.getElementById("TxtExtraUrl");
	textbox.select();
	textbox.setSelectionRange(0, 99999); // For mobile devices
	document.execCommand("copy");
	SuccessAlert("Text copied to clipboard");
}