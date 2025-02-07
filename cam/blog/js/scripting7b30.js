function showLoginForm() {
    var border = Math.ceil(($( "body:first" ).innerWidth() - 1140)/2);
    $("#loginForm").css('left', border + 890 + "px" );
    $("#loginForm").css('top', '50px');

    $("#loginForm").slideToggle(400);

    return false;
}

function showUserMenu() {
    var border = Math.ceil(($( "body:first" ).innerWidth() - 1140)/2);

    $("#userMenu").css('left', border + 990 + "px" );
    $("#userMenu").css('top', '50px');

    $("#userMenu").slideToggle(400);

    return false;
}



function arrangeTiles() {
    var no_columns = 4;
    var padding_x = 10;
    var padding_y = 30;
    var single_column_breakpoint = 500;
    var two_column_breakpoint = 730;
    var container = $('#pinBoot');
    var $container = $('#pinBoot');
    var articles = container.children();


    if( $(window).width() < single_column_breakpoint ) {
        no_columns = 1;
    } else if( $(window).width() < two_column_breakpoint ) {
        no_columns = 2;
    } else  {
        no_columns = 3;
    }


    tile_width = (container.width() - padding_x * (no_columns-1)) / no_columns;

    articles.each(function() {
        $(this).css('width', tile_width);
    });

    columns = no_columns;
    rows_count0 = 0;
    rows_count1 = 0;
    rows_count2 = 0;
    rows_count3 = 0;

    row_height0 = 0;
    row_height1 = 0;
    row_height2 = 0;
    row_height3 = 0;

    articles.each(function() {
        var current_column,
            top = 0,
            max_columns = 4,
            is_featured = false;

        if( this.nodeName != 'ARTICLE' || this.classList.contains('ads') )
            return;

        is_featured = this.classList.contains('featured');


        if(columns == 3) {
            min = Math.min(Math.min(row_height0, row_height1), row_height2);

            if( min == row_height0 ) current_column = 0;
            else if( min == row_height1 ) current_column = 1;
            else current_column = 2;

        } else if(columns == 2) {
            min = Math.min(row_height0, row_height1);

            if( min == row_height0 ) current_column = 0;
            else current_column = 1;
        } else {
            current_column = 0;
        }

        if( current_column === 0 ) { rows_count0++; row_height0+=$(this).outerHeight(); }
        else if( current_column == 1 ) { rows_count1++; row_height1+=$(this).outerHeight(); }
        else if( current_column == 2 ) { rows_count2++; row_height2+=$(this).outerHeight(); }
        else if( current_column == 3 ) { rows_count3++; row_height3+=$(this).outerHeight(); }

        for(var t = 0; t < max_columns; t++) {
            $(this).removeClass('c'+t);
        }
        $(this).addClass('c' + current_column);

        top = 0;
        $(this).prevAll().each(function() {
            if( $(this).hasClass('c' + current_column)) {
                top += $(this).outerHeight() + padding_y;
            }
        });
        //console.log($(this).outerHeight());

        $(this).css({
            'left': current_column * (tile_width + padding_x),
            'top' : top
        });
    });

    var column_heights = [];

    for(var z = 0; z < columns; z++) {
        var temp_height = 0;
        $container.find('.c'+z).each(function() {
            temp_height += $(this).outerHeight();
        });
        column_heights[z] = temp_height;
    }

    highest = Math.max.apply(Math, column_heights);
    lowest = Math.min.apply(Math, column_heights);
    $container.css('height', highest + (30 * Math.max(Math.max(rows_count0, rows_count1), Math.max(rows_count2, rows_count3)) + 20));

    if( $('#scroll_limit').length )
        document.getElementById("scroll_limit").innerHTML = lowest - 3000;
}


function newPopup(url) {
    popupWindow = window.open(
        url,'popUpWindow','height=400,width=600,left=10,top=10,resizable=yes,scrollbars=nor,toolbar=no,menubar=no,location=no,directories=no,status=no')
}





(function ($) {
  // $('a[data-reveal-id]').live('click', function (event) {
  //   event.preventDefault();
  //   var modalLocation = $(this).attr('data-reveal-id');
  //   $('#' + modalLocation).reveal($(this).data());
  // });

  $.fn.reveal = function (options) {
    var defaults = {
      animation: 'fadeAndPop',                // fade, fadeAndPop, none
      animationSpeed: 300,                    // how fast animtions are
      closeOnBackgroundClick: true,           // if you click background will modal close?
      dismissModalClass: 'close-reveal-modal' // the class of a button or element that will close an open modal
    };
    var options = $.extend({}, defaults, options);

    return this.each(function () {
      var modal    = $(this),
        topMeasure = parseInt(modal.css('top')),
        topOffset  = modal.height() + topMeasure,
        locked     = false,
        modalBg    = $('.reveal-modal-bg');

      if (modalBg.length == 0) {
        modalBg = $('<div class="reveal-modal-bg" />').insertAfter(modal);
        modalBg.fadeTo('fast', 0.8);
      }

      function openAnimation() {
        modalBg.unbind('click.modalEvent');
        $('.' + options.dismissModalClass).unbind('click.modalEvent');
        if (!locked) {
          lockModal();
          if (options.animation == "fadeAndPop") {
            modal.css({'top': $(document).scrollTop() - topOffset, 'opacity': 0, 'visibility': 'visible'});
            modalBg.fadeIn(options.animationSpeed / 2);
            modal.delay(options.animationSpeed / 2).animate({
              "top": $(document).scrollTop() + topMeasure + 'px',
              "opacity": 1
            }, options.animationSpeed, unlockModal);
          }
          if (options.animation == "fade") {
            modal.css({'opacity': 0, 'visibility': 'visible', 'top': $(document).scrollTop() + topMeasure});
            modalBg.fadeIn(options.animationSpeed / 2);
            modal.delay(options.animationSpeed / 2).animate({
              "opacity": 1
            }, options.animationSpeed, unlockModal);
          }
          if (options.animation == "none") {
            modal.css({'visibility': 'visible', 'top': $(document).scrollTop() + topMeasure});
            modalBg.css({"display": "block"});
            unlockModal();
          }
        }
        modal.unbind('reveal:open', openAnimation);
      }
      modal.bind('reveal:open', openAnimation);

      function closeAnimation() {
        if (!locked) {
          lockModal();
          if (options.animation == "fadeAndPop") {
            modalBg.delay(options.animationSpeed).fadeOut(options.animationSpeed);
            modal.animate({
              "top":  $(document).scrollTop() - topOffset + 'px',
              "opacity": 0
            }, options.animationSpeed / 2, function () {
              modal.css({'top': topMeasure, 'opacity': 1, 'visibility': 'hidden'});
              unlockModal();
            });
          }
          if (options.animation == "fade") {
            modalBg.delay(options.animationSpeed).fadeOut(options.animationSpeed);
            modal.animate({
              "opacity" : 0
            }, options.animationSpeed, function () {
              modal.css({'opacity': 1, 'visibility': 'hidden', 'top': topMeasure});
              unlockModal();
            });
          }
          if (options.animation == "none") {
            modal.css({'visibility': 'hidden', 'top': topMeasure});
            modalBg.css({'display': 'none'});
          }
        }
        modal.unbind('reveal:close', closeAnimation);
      }
      modal.bind('reveal:close', closeAnimation);
      modal.trigger('reveal:open');

      var closeButton = $('.' + options.dismissModalClass).bind('click.modalEvent', function () {
        modal.trigger('reveal:close');
      });

      if (options.closeOnBackgroundClick) {
        modalBg.css({"cursor": "pointer"});
        modalBg.bind('click.modalEvent', function () {
          modal.trigger('reveal:close');
        });
      }

      $('body').keyup(function (event) {
        if (event.which === 27) { // 27 is the keycode for the Escape key
          modal.trigger('reveal:close');
        }
      });

      function unlockModal() {
        locked = false;
      }

      function lockModal() {
        locked = true;
      }
});
  };
})(jQuery);






$(window).load(function(){
    if( $('#pinBoot').length )
        arrangeTiles();
});

$(document).ready(function() {

    if( $('#pinBoot').length ) {
        // arrange articles before images are lodead
        arrangeTiles();

        // wait for all images to load an re-arrange once more
        var imageTotal = $('img').length;
        var imageCount = 0;
        $('img').load(function(){ arrangeTiles(); });
        arrangeTiles();
    }



    setTimeout(function() {
		if( $('#related_posts') == null || $('#related_posts') == null )
			return;

	    $max_height = $('#main_post').outerHeight(true);
	    $posts = $('#related_posts').children();

		if( !$('#related_posts').length || !$('#related_posts').children().length )
			return;

	    $current_height = 0;
	    $posts.each(function(index) {
	    	$current_height += $(this).outerHeight(true);

	    	if( $current_height > $max_height+1000 ) {
		        $(this).css('display', 'none');
	    	}

	    });
	}, 1);


    if( $('#blog_name').length ) {
        var blog_name = $('#blog_name').attr('title');

        var str_len = Math.round($('#blog_name').parent().parent().parent().width() / (parseInt($('#blog_name').css("fontSize"), 10)));
        var orig_len =  blog_name.length;

        $limit = 1000;
        while( !blog_name.substring(str_len-1,str_len).match(/[a-z]/i) ) {
            str_len = str_len - 1;

            if( --$limit <= 0 || str_len <= 35 )
                break;
        }

        document.getElementById("blog_name").innerHTML = blog_name.substring(0,str_len);

        if( orig_len > str_len )
            document.getElementById("blog_name").innerHTML = document.getElementById("blog_name").innerHTML + "…";
    }


    $(window).resize(function() {
        if( $('#pinBoot').length )
            arrangeTiles();
    });

	$( "#subscribe_button" ).click(function() {
		$.ajax({
			url : '/subscribe?blogid='+($(this).attr('blog_id'))+'&email='+document.getElementById("subscribe_email").value,
			dataType: "json",
			method: 'post',
			data: {
			   email : document.getElementById("subscribe_email").value,
			},
			success: function( data ) {
				$('#subscribe_form').hide();
				$('#subscribe_h1').hide();
				$('#subscribe_p').hide();
				$('#after_subscribe_h1').show();
				$('#after_subscribe_p').show();
			},
			error: function( request, error ){
                console.log(arguments);
				$('#subscribe_error_message').show();
				document.getElementById("subscribe_error_message").innerHTML = 'Something went wrong, please contact us as <a href="maito:support@blogarama.com" style="color: #5ba4e5;">support@blogarama.com</a>';
			}
		});
	});

	$( "#follow_button" ).click(function() {
		$('#subscribe_form').show();
		$('#subscribe_h1').show();
		$('#subscribe_p').show();
		$('#after_subscribe_h1').hide();
		$('#after_subscribe_p').hide();

		$('#myModal').reveal({
		     animation: 'fade',                   //fade, fadeAndPop, none
		     animationspeed: 300,                       //how fast animtions are
		     closeonbackgroundclick: true,              //if you click background will modal close?
		     dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
		});
	});
	$( ".share_post_button" ).click(function() {
		$('#sharePostModal').reveal({
		     animation: 'fade',                   //fade, fadeAndPop, none
		     animationspeed: 300,                       //how fast animtions are
		     closeonbackgroundclick: true,              //if you click background will modal close?
		     dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
		});
	});
});




		function ajaxRequest(){
			 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
			 if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
			  for (var i=0; i<activexmodes.length; i++){
			   try{
			    return new ActiveXObject(activexmodes[i])
			   }
			   catch(e){
			    //suppress error
			   }
			  }
			 }
			 else if (window.XMLHttpRequest) // if Mozilla, Safari etc
			  return new XMLHttpRequest()
			 else
			  return false
			}


		var addEvent = function(object, type, callback) {
		    if (object == null || typeof(object) == 'undefined') return;
		    if (object.addEventListener) {
		        object.addEventListener(type, callback, false);
		    } else if (object.attachEvent) {
		        object.attachEvent("on" + type, callback);
		    } else {
		        object["on"+type] = callback;
		    }
		};

		addEvent(window, "resize", function(event) {
            if( $('#blog-directory-menu-item').length ) {
                if ($(window).width() < 480)
                    document.getElementById("blog-directory-menu-item").innerHTML = '';
                else
                    document.getElementById("blog-directory-menu-item").innerHTML = 'Blog Directory';
            }
		});


	$('.buttonInfo').click(function() {
		$(this).toggleClass("active");
		$('.dropdown-menu').slideToggle("600");
	});
	$('.buttonInfoLanguages').click(function() {
		$(this).toggleClass("active");
		$('.dropdown-menu-languages').slideToggle("600");
	});
	function changeLanguage($lang) {
		var url = window.location.toString();

		if( $lang == 'en' ) {
			if( window.location.href.indexOf('.blogarama.com/es/') > 0) {
				window.location = url.replace('.blogarama.com/es/', '.blogarama.com/en/');
			} else if( window.location.href.indexOf('.blogarama.com/en/') > 0) {
			} else {
				window.location = url.replace('.blogarama.com/', '.blogarama.com/en/');
			}
		} else if( $lang == 'es' ) {
			if( window.location.href.indexOf('.blogarama.com/en/') > 0) {
				window.location = url.replace('.blogarama.com/en/', '.blogarama.com/es/');
			} else if( window.location.href.indexOf('.blogarama.com/es/') > 0) {
			} else {
				window.location = url.replace('.blogarama.com/', '.blogarama.com/es/');
			}
		}
	}
