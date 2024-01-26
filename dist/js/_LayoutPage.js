        
        //function getQueryStringValue (key) {
        //    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.$", "i"), "$1"));
        //}
        $(document).ready(function () {
            var qr = window.location.href;
            if (qr.includes("request_token") == true) {
                ShowAlertMessage(1, "Login with kite.");
            }
            //window.setInterval(function () { Notification(true); }, 5000);
            $('#dvMsg').hide();
            PaperTradeNotification();


        });

        $("#UserProfileBtn").on('click', function () {
            $("#UserProfileModal").modal('show');
        });

        function getQueryStringValue(key) {
            return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        }

        function GetURLParameter() {
            var sPageURL = window.location.href;
            var indexOfLastSlash = sPageURL.lastIndexOf("/");

            if (indexOfLastSlash > 0 && sPageURL.length - 1 != indexOfLastSlash)
                return sPageURL.substring(indexOfLastSlash + 1);
            else
                return 0;
        }
        function Notification() {
            $.ajax({
                url: '/Home/GetNotificationLst',
                type: 'GET',
                success: function (data) {
                    //popitup(html, "My Kite Login")
                    // location.href = html;
                    for (var i = 0; i < data.length; i++) {
                        ShowAlertMessage(1, data[i].ScriptCode);
                        //$('#innermsg').innerHtml = data[i].ScriptCode;
                        //$('#dvMsg').show()

                    }
                },
                error: function (error) {
                    $(that).remove();
                    DisplayError(error.statusText);
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
                        $(".zero").hide();
                    }
                    else {
                        $("#PaperTradeNotificationCount").html('');                       
                    }
                    $("#PaperTradeNotificationCountLi").html("You Have Total " + data + " Notifications");
                   
                },

                error: function (error) {

                }
            });
        }

        //function Kitelogin() {
        //    $.ajax({
        //        url: '/Home/KiteLogin',
        //        type: 'GET',
        //        success: function (html) {
        //            //popitup(html, "My Kite Login")

        //            debugger;
        //            location.href = html;
        //        },
        //        error: function (error) {

        //            debugger;
        //            $(that).remove();
        //            DisplayError(error.statusText);
        //        }
        //    });
        //}
        //function Kitelogout() {
        //    $.ajax({
        //        url: '/Home/KiteLogout',
        //        type: 'GET',
        //        success: function (html) {
        //            //popitup(html, "My Kite Login")
        //            // location.href = html;
        //        },
        //        error: function (error) {
        //            $(that).remove();
        //            DisplayError(error.statusText);
        //        }
        //    });
        //}
        function ShowAlertMessage(type, message) {

            //1:Success, 2:Error
            var alertDiv = '#alertDiv' + type;
            var alertMessage = '#alertMessage' + type;

            //Set Message
            message = GetDefaultMessage(type, message);
            $(alertMessage).text(message);

            //Show Message
            $(alertDiv).show();
            $(alertDiv).fadeTo(2000, 500).slideUp(500, function () {
                $(alertDiv).slideUp(500);
            });

        }
        $('#btnKiteLogin').on('click', function () {
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
                        toastr.error("Please Update Your Details In Api Settings");
                        return false;
                    }
                    else {
                        var arr = url.split('/')
                        if (arr[2] == 'KotakSecuritiesLogin') {
                            toastr.success("Login Successfully");
                        }
                        else
                            window.location.href = results;
                        return;
                    }
                }
            });
            return false;
        })
        //$('#btnAngelBrokingLogin').on('click', function () {
        //    var url = $(this).attr("href");
        //    var request = $.ajax({
        //        url: url,
        //        type: "GET",
        //        data: {},
        //        dataType: 'json',
        //        traditional: true,
        //        success: function (data) {
        //            var results = data;

        //            if (results == "") {
        //                $("#txtScript").val("");
        //                //alert("Duplicate record.");
        //                ShowAlertMessage(1, "Login Sccuessfully.");
        //                return false;
        //            }
        //            else {
        //                window.location.href = results;
        //                return;
        //            }
        //        }
        //    })
        //    return false;
        //})



        $("#menuToggleButton").on('click', function () {
            var data = localStorage.getItem('IsToggle');
            if (data == null || data == '') {
                localStorage.setItem('IsToggle', 'NO')
            }
            else if (data == 'NO') {
                localStorage.setItem('IsToggle', 'YES')
            }
            else if (data == 'YES') {
                localStorage.setItem('IsToggle', 'NO')
            }
        });
        $(document).ready(function () {
            var data = localStorage.getItem('IsToggle');
            if (screen.width > 767) {

                if (data == 'NO') {
                    $('.sidebar-mini').addClass('sidebar-collapse');
                }
                else {
                    $('.sidebar-mini').removeClass('sidebar-collapse');
                }
            }

        });
        $(window).on('resize', function () {
            if (screen.width < 768) {
                $('.sidebar-mini').removeClass('sidebar-collapse');
            }
            else {
                var data = localStorage.getItem('IsToggle');
                if (screen.width > 767) {
                    if (data == 'NO') {
                        $('.sidebar-mini').addClass('sidebar-collapse');
                    }
                    else {
                        $('.sidebar-mini').removeClass('sidebar-collapse');
                    }
                }
            }
        });
