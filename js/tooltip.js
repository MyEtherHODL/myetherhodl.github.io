function init_tooltip(){
  $(function(){
        $("[data-tooltip]").mouseover(function (eventObject) {
            $data_tooltip = $(this).attr("data-tooltip");
            $("#tooltip").html($data_tooltip)
                .css({
                  "top" : eventObject.currentTarget.getBoundingClientRect().top + $(eventObject.currentTarget).outerHeight()/2 - $('#tooltip').outerHeight()/2 ,
                  "left" : eventObject.currentTarget.getBoundingClientRect().right + 10
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
}