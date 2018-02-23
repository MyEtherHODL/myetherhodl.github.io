$(function(){
      $("[data-tooltip]").mousemove(function (eventObject) {
          $data_tooltip = $(this).attr("data-tooltip");
          $("#tooltip").html($data_tooltip)
              .css({ 
                "top" : eventObject.pageY - 48,
                "left" : eventObject.pageX + 10
              })
              .show();
          }).mouseout(function () {
            $("#tooltip").hide()
              .html("")
              .css({
                  "top" : 0,
                  "left" : 0
              });
      });
});