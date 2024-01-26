function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.image-upload-wrap').hide();
            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();
            $('.image-title').html(input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}
$(document).ready(function () {
    $("#IsEnableWatermark").click(function () {
        if ($("#IsEnableWatermark").prop('checked') == true) {
            $('.Watermark_Img').show();
        }
        else {
            $('.Watermark_Img').hide();
        }
    });
    if ($("#IsEnableWatermark").prop('checked') == true) {
        $('.Watermark_Img').show();
    }
    else {
        $('.Watermark_Img').hide();
    }
 });


 
function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

$(window).on('load', function () {
    if ($("#CompanyLogo").val() != '' && $("#CompanyLogo").val() != undefined) {
        $('.image-upload-wrap').hide();
        $('.file-upload-content').show();
    }
   
});
$(document).ready(function () {
    
    $('.multiselect').multiselect(
        {
            buttonClass:'form-control'
        });
    $('.multiselect').addClass('form-control');
    $('.multiselect-native-select').on('click', function () {
        $('.btn-group').addClass('open');
       
    });

});
