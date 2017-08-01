$(document).ready(function(){
  
  /**
   * Detect os and browser
   **/
  $("body").addClass( Detect.os() ).addClass( Detect.browser() );
  
  /**
   * set gnav current
   **/
  var _page = $("body").data("page");
  
  if ( _page == "thanks" ) {
    $("#gnav .list5").addClass("active");
  }
  
  $("#gnav li").each(function(){
    var nav = $(this).data("nav");

    if ( _page == nav ) {
      $(this).addClass("active");
    }
  });
  
  // SP 横向き対策
  $("#cover").css({height: window.innerHeight});
  
  $.cookie.defaults.path = "/";
  var curtain = $.cookie("curtain");
  
  if ( curtain == null || curtain == "false" ) {
    preLoad();
  } else {
    start(curtain);
  }
});

function preLoad () {
  var imgs = $("img");
  var len = imgs.length;
  var comps = [];
  var images = [];

  // img
  
  if ( 1024 <= window.innerWidth ) {
  if ( $("body").is("#works") && $("body").is(".index") ) {
    var $backLayer = $("#backLayer");
    var _imgList = $("div", $backLayer);
    var _imgLength = _imgList.length;
    
    for ( var i=0;i<_imgLength;i++ ) {
      var _list = $(_imgList[i]);
      var _id = _list.attr("id");
      var _url = _list.attr("data-imgurl");
      var _id = new Image();
      
      _id.src = _url;
      images.unshift( _id );
      
      //console.log( images );
    }
  }
  }
  
  // background
  var __count = 0;
  if ( images.length != 0 ) {
    for ( var i = 0; i < images.length; i++ ) {
      var __image = images[i];
      var __comp = __image.complete;
      
      if ( __comp ) {
        __count++;
      }
    }
  }
  
  var __displayPercent = 0;
  // LOAD TEST
  ( function(){
    var __countComp = 0;
    
    
    for ( var i = 0; i < len; i++ ) {
      var src = $(imgs[i]).attr("src");
      var comp = imgs[i].complete;
      
      //console.log( imgs[i].complete );
      if(comp) {
        __countComp++;
        var __percent = Math.ceil(100 * (__countComp) / len);
        
        //console.log("__countComp: "+__countComp+", __percent: "+__percent+", __displayPercent: "+__displayPercent);
      }
    }
    
    var moveBar = window.setInterval(function(){
      if ( __displayPercent < __percent ) {
        __displayPercent++;
        $("#loading span").css({width: __displayPercent+"%"});
      }
    }, 10);
    
    if ( __countComp == len && 100 <= __displayPercent ) {
      window.clearInterval(moveBar);
      setTimeout(start, 100);
    } else {
      setTimeout(arguments.callee,300);
    }
  } )();
}

function start (curtain) {
  /**
   * loading
   **/
  if ( curtain == "true" ) {
    $("#loading").hide();
    $("#cover").hide();
    $.cookie("curtain", false);
    if ( window.innerWidth < 1024 ) {
      $("#header").addClass("fixed");
    }
  } else {
    var coverH = $(window).height();
    moveLoading().done(moveCover(coverH));
  }
  
  function moveLoading (){
    var dfd = $.Deferred();
    
    $("#loading").fadeOut(600);
  
    dfd.resolve();
    
    return dfd.promise();
  }
  
  function moveCover (coverH) {
    $("#cover").css({height: coverH}).stop().animate({top: -coverH -12}, 1200, "easeOutQuart", function(){
      $(this).hide();
      if ( window.innerWidth < 1024 ) {
        $("#header").addClass("fixed");
      }
    });
  }
  
  /**
   * common
   **/
  var
  $body = $("body"),
  $contents = $("#contents"),
  $pagetop = $("#pagetop");
  
  /**
   * set gnav
   **/
  var $gnavAll = $("#gnavAll");
  var $gnav = $("#gnav");
  var $menuIcn = $("#menuIcn");
  var $menuClose = $("#menuClose");
  var gnavH;
  
  if ( !Detect.ios() && !Detect.android() ) {
    $("a", $gnav).hover(function(){
      $(this).stop().animate({color: "#daa717"}, 400, "easeOutExpo");
    }, function(){
      $(this).stop().animate({color: "#000"}, 600, "easeOutCubic");
    });
  }
  
  // SP Gnav
  $(window).on("resize", function(e){
    isLandscapeGnav();
  });
  
  var isLandscapeGnav = function(){
    if (window.innerHeight > window.innerWidth) { // 縦
      setSpGnav();
    }else{ // 横
      setSpGnav();
    }
  };
  
  if ( window.innerWidth < 1024 ) {
    setSpGnav();
  }
  
  function setSpGnav () {
    if ( window.innerWidth < 1024 ) {
      getGnavHeight();
    } else if ( 1024 <= window.innerWidth ) {
      $gnavAll.css({top: 25}).show();
      $("li", $gnav).slice(0, 8).css({height: "auto"});
      $("li a", $gnav).slice(0, 8).css({lineHeight: 1});
    }
  }
  
  function getGnavHeight () {
    if ( window.innerHeight < gnavH ) { // 横
      setInnerHeight();
    } else { // 縦
      if (window.innerHeight > window.innerWidth) {
        $("li", $gnav).slice(0, 8).css({height: 50});
        $("li a", $gnav).slice(0, 8).css({lineHeight: 50 + "px"});
        gnavH = $gnavAll.height();
        $gnavAll.css({top: -gnavH});
      } else {
        setInnerHeight();
      }
    }
  }
  
  function setInnerHeight () {
    //console.log(window.innerHeight);
    var wiH = window.innerHeight - 60;
    var resizeH = Math.floor(wiH / 8);
    $("li", $gnav).slice(0, 8).css({height: resizeH});
    $("li a", $gnav).slice(0, 8).css({lineHeight: resizeH + "px"});
    gnavH = $gnavAll.height();
    $gnavAll.css({top: -gnavH});
  }
  
  $("a", $menuIcn).click(function(){
    $gnavAll.stop().show().animate({top: 0}, 800, "easeOutQuart");
    
    return false;
  });
  
  $("a", $menuClose).click(function(){
    $gnavAll.stop().animate({top: -gnavH}, 800, "easeOutQuart", function(){ $(this).hide(); });
    
    return false;
  });
  
  /**
   * set lnav
   **/
  var $lnav = $("#lnav");
  
  $("a", $lnav).hover(function(){
    $(this).stop().animate({color: "#fff", backgroundColor: "#000"}, 400, "easeOutCubic");
  }, function(){
    $(this).stop().animate({color: "#000", backgroundColor: "transparent"}, 400, "easeOutCubic");
  });
  
  $("a[href^=#]").click(function() {
    var
    ADJUST = -35,
    href= $(this).attr("href"),
    target = $(href == "#" || href == "#header" ? "html" : href),
    position = target.offset().top + ADJUST;

    if ( href == "#"){
      return false;
    } else if ( href == "#header" ) {
      $("html, body").stop().animate({scrollTop: 0}, 900, "easeOutExpo");
    } else {
      $("html, body").stop().animate({scrollTop: position}, 750, "easeOutExpo");
    }

    return false;
  });
  
  /**
   * set <a> link
   **/
  if ( !Detect.ios() && !Detect.android() ) {
    $("a", $contents).hover(function(){
      if ( !$(this).is(".roll") ) {
        $(this).stop().animate({color: "#daa717"}, 400, "easeOutExpo");
      }
    }, function(){
      if ( !$(this).is(".roll") ) {
        $(this).stop().animate({color: "#000"}, 600, "easeOutCubic");
      }
    });
    
    $(".roll").hover(function(){
      $("img", this).stop().animate({opacity: 0.6}, 600, "easeOutQuart");
    }, function(){
      $("img", this).stop().animate({opacity: 1}, 600, "easeOutQuart");
    });
  }
  
  /**
   * set pagetop
   **/
  var isLandscapePagetop = function(){
    if (window.innerHeight > window.innerWidth) {
      setPagetop();
    }else{
      setPagetop();
    }
  };
  
  var setPagetop = function() {
    if ( 1024 <= window.innerWidth ) {
      $(window).on("scroll", function(e){
        var y = document.documentElement.scrollTop || document.body.scrollTop;
    
        if ( 400 < y ) {
          $("img", $pagetop).stop().fadeIn(600);
        } else {
          $("img", $pagetop).stop().fadeOut(200, function(){
            $(this).css({opacity: 1});
          });
        }
      });
      
      if ( !Detect.ios() && !Detect.android() ) {
        $("a", $pagetop).hover(function(){
          $("img", this).stop().animate({opacity: 0.3}, 400, "easeOutQuart");
        }, function(){
          $("img", this).stop().animate({opacity: 1}, 600, "easeOutQuart");
        });
      }
    }
  };
  
  isLandscapePagetop();
  $(window).on("resize", function(e){
    isLandscapePagetop();
  });
  
  /***********
   * WORKS
   ***********/
  /**
   * set Index
   **/
  if ( $body.is("#works") && $body.is(".index") ) {
    var $worksList = $(".worksList", $contents);
    
    var isLandscapeWorkIdx = function(){
      if (window.innerHeight > window.innerWidth) {
        setRollOpacity();
        setTimeout(getTextWidth, 100);
      }else{
        setRollOpacity();
        setTimeout(getTextWidth, 100);
      }
    };
    
    var setRollOpacity = function() {
      if ( 1024 <= window.innerWidth ) {
        if ( !Detect.ios() && !Detect.android() ) {
          var worksName;
          var _self;
          $(".roll", $contents).hover(function(){
            _self = $(this);
            $(".roll", $contents).not(_self).stop().animate({opacity: 0.1}, 400, "easeOutQuart");
            $(".roll", $contents).not(_self).next().stop().animate({opacity: 0.1}, 400, "easeOutQuart");
            
            worksName = $(this).attr("data-works");
            $(worksName).stop().show().animate({opacity: 0.2}, 600, "easeOutQuart");
          }, function(){
            $(".roll", $contents).not(_self).stop().animate({opacity: 1}, 600, "easeOutQuart");
            $(".roll", $contents).not(_self).next().stop().animate({opacity: 1}, 600, "easeOutQuart");
            
            $(worksName).stop().animate({opacity: 0}, 600, "easeOutQuart", function(){ $(this).hide(); });
          });
        }
      } else {
        $(".roll", $contents).off("mouseenter").off("mouseleave");
      }
    };
    
    $(window).on("resize", function(e){
      isLandscapeWorkIdx();
    });
    
    setTimeout(getTextWidth, 100);
    setRollOpacity();
  }
  
  if ( $body.is("#works") ) {
    getSiteview();
  }
  
  // set line-through
  function getTextWidth () {
    var w, h;
    
    $("a", $worksList).each(function(){
      w = $(this).width();
      h = $(this).height();
      $(".one",  this).css({width: w, height: h});
    });
  }
  
  // check siteview
  function getSiteview () {
    $.cookie.json = true;
    var siteView = $.cookie("siteView");
    
    if ( siteView == null ) {
      siteView = [];
    }
    
    var worksName = $body.attr("data-name");
    if ( worksName != "index" && !checkDuplicate(siteView, worksName) ) {
      siteView.push(worksName);
      var date=new Date(); // 1時間
      date.setTime(date.getTime() + (60*60*1000)); // 1時間
      $.cookie("siteView", siteView, { expires : date }); // 1時間
      //$.cookie("siteView", siteView, { expires : 30 });
    }
    
    $("a", $worksList).each(function(i){
      var index= i;
      var indexName = $(this).attr("data-index");
      
      for (var i=0;i<siteView.length;i++) {
        if ( indexName == siteView[i] ) {
          $(this).append('<span class="one"></span>');
        }
      }
    });
  }
  
  function checkDuplicate ( array, str ) {
    for(var i=0;i<array.length;i++){
      if( str == array[i] ){
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * set lower
   **/
  if ( $body.is("#works") && $body.is(".lower") ) {
    var $worksInfo = $("#worksInfo");
    
    $(".active", $gnav).click(function(){
      $.cookie("curtain", true);
    });
    
    $(".pager .index a", $worksInfo).click(function(){
      $.cookie("curtain", true);
    });
    
    /**
     * set web scroll
     **/
    var iScroll;
    var pCount = 0;
    var iFrag = false;
    
    var isLandscapeWorks = function(){
      if (window.innerHeight > window.innerWidth) {
        setCredit();
        setWebScroll();
      }else{
        setCredit();
        setWebScroll();
      }
    };
    
    var setWebScroll = function() {
      if ( 1024 <= window.innerWidth ) {
        if ( !Detect.ios() && !Detect.android() ) {
          $(".view", $contents).show();
          $(".frame", $contents).each(function(){
            var _view = $(".view", this);
            var _bg = $(".bg", this);
            var imgH = $("img", _bg).height();
            var frameH = $(this).height();
            var endP = imgH - frameH;
            
            $(this).hover(function(){
              if ( !iFrag ) {
              iFrag = true;
              _view.stop().fadeOut(600);
              
              iScroll = window.setInterval(function(){
                if ( endP <= pCount ) {
                  window.clearInterval(iScroll);
                }
                _bg.css({top: -pCount});
                pCount++;
              }, 18);
              }
            }, function(){
              _view.stop().fadeIn(800, function(){
                _bg.css({top: 0});
                pCount = 0;
                iFrag = false;
              });
              window.clearInterval(iScroll);
            });
          });
        }
      } else {
        $(".frame", $contents).off();
        $(".view", $contents).hide();
      }
    };
    
    var setCredit = function() {
      if ( 1024 <= window.innerWidth ) {
        if ( !Detect.ios() && !Detect.android() ) {
          $(".opacity", $worksInfo).css({opacity: 0.1});
          $(".opacity", $worksInfo).hover(function(){
            $(".opacity", $worksInfo).stop().animate({opacity: 1}, 600, "easeOutCubic");
          }, function(){
            $(".opacity", $worksInfo).stop().animate({opacity: 0.1}, 600, "easeOutCubic");
          });
        }
      } else {
        $(".opacity", $worksInfo).css({opacity: 1}).off();
      }
    };
    
    isLandscapeWorks();
    $(window).on("resize", function(e){
      isLandscapeWorks();
    });
    
    /**
     * set MOVIE
     **/
    $(".youtube", $worksInfo).magnificPopup({
      type: "iframe",
      removalDelay: 300,
      mainClass: "mfp-fade",
      iframe: {
        patterns: {
          youtube: {
            src: "//www.youtube.com/embed/%id%?autoplay=1&rel=0"
          }
        }
      },
      
      callbacks:{
        resize: function(){
          setTimeout(function(){
            $("div.mfp-bg.mfp-fade.mfp-ready").css({position: "fixed"});
          }, 100);
          
          //console.log("resize");
        }
      }
    });
    
    $(".vimeo", $worksInfo).magnificPopup({
      type: "iframe",
      removalDelay: 300,
      mainClass: "mfp-fade",
      
      callbacks:{
        resize: function(){
          setTimeout(function(){
            $("div.mfp-bg.mfp-fade.mfp-ready").css({position: "fixed"});
          }, 100);
          
          //console.log("resize");
        }
      }
    });
    
    $(".movie a", $worksInfo).hover(function(){
      $(this).stop().animate({opacity: 0.8}, 600, "easeOutQuart");
    }, function(){
      $(this).stop().animate({opacity: 1}, 600, "easeOutQuart");
    });
  }
  
  /***********
   * MEMBER
   ***********/
  /**
   * set profile
   **/
  if ( $body.is("#member") ) {
    var _memberList = $(".memberList", $contents);
    var col;
    
    var isLandscapeMember = function(){
      if (window.innerHeight > window.innerWidth) {
        setMember();
        setCreator();
      }else{
        setMember();
        setCreator();
      }
    };
    
    var setMember = function() {
      if ( 1024 <= window.innerWidth ) {
        col = 4;
        checkWindowSize().done(setMemberSize(col));
        
      } else if ( window.innerWidth < 540 ) {
        col = 2;
        checkWindowSize().done(setMemberSize(col));
      } else {
        col = 3;
        checkWindowSize().done(setMemberSize(col));
      }
    };

    var checkWindowSize = function() {
        var dfd = $.Deferred();
        
        if ( _memberList.children().is(".listAll") ) {
          $(".listAll").children(".list").unwrap();
        }
      
        dfd.resolve();
        
        return dfd.promise();
    };
    
    var setMemberSize = function(col){
      _memberList.each(function(){
        var _list = $(this).children(".list");
        var length = _list.length;
        for ( var i=0;i<length;i+=col ) {
          _list.slice(i, i+col).wrapAll('<div class="listAll cf"/>');
        }
        
        $(".listAll", $contents).each(function(){
          $(this).find(".list").removeClass("right");
          $(this).find(".list:last-child").addClass("right");
        });
      });
    };
    
    // リサイズ時
    var setCreator = function() {
      var height = $("div#creatorAll div.creator").height();
      $("div#creatorAll").css({height: height});
      $("div#creatorAll").prev().addClass("currentLine");
      var copy = $("div#creatorAll").clone();
      $("div#creatorAll").remove();
      $(".currentThum", $contents).parents(".listAll").after(copy);
      
      $("#creatorAll .close").on("click", "a", function(){
        $("div#creatorAll").stop().animate({height: 0, padding: 0},{
          duration: 600,
          easing: "easeOutQuart",
          step: function(){
            $("div#creatorAll div.creator").fadeOut(400);
            setTimeout(function(){ $("span.active").removeClass("active"); }, 400);
          },
          complete: function(){
            $("div#creatorAll").remove();
            $("a.currentThum").removeClass("currentThum");
            $("div.currentLine").removeClass("currentLine");
          }
        });
        
        return false;
      });
    };
    
    isLandscapeMember();
    $(window).on("resize", function(e){
      isLandscapeMember();
    });
    
    var member = {};
    member.conf = {
      runFlg: false,
      easeTime: 600
    };
    
    member.setPost = {
      init: function(a) {
        var postId = $(a).attr("rel");
        $("div#creatorAll").load("http://www.shilushi.com/member/ "+postId+"", function(){
          var _postHtml = $(this);
          var cntHeight;
          
          $("#creatorAll .creatorPost").show();
          $("div#creatorAll div.creator").stop().animate({opacity:1}, 300, "easeOutQuart", function(){
            $("div#creatorAll div.creator div.clientWork li:nth-child(3n)").addClass("right");
            var cntHeight = $("div#creatorAll div.creator").height();
            $("div#creatorAll div.creator").fadeIn(600);
            $("#creatorAll .close").fadeIn(600);
            $(a).next().addClass("active");
            _postHtml.stop().animate({height: cntHeight, padding: "32px 0 33px 0"}, 1000, "easeOutQuart", function(){
              member.setPost.pageScroll();
            });
          });
          
          $("#creatorAll .close").find("a").on("click", function(){
            _postHtml.stop().animate({height: 0, padding: 0},{
              duration: 600,
              easing: "easeOutQuart",
              step: function(){
                $("div#creatorAll div.creator").fadeOut(400);
                setTimeout(function(){ $("span.active").removeClass("active"); }, 400);
              },
              complete: function(){
                $("div#creatorAll").remove();
                $("a.currentThum").removeClass("currentThum");
                $("div.currentLine").removeClass("currentLine");
              }
            });
            
            return false;
          });
        });
      },
      pageScroll: function() {
        var position = $(".currentLine").offset().top;
        $("html, body").stop().animate({scrollTop: position}, member.conf.easeTime, "easeOutQuart");
        member.conf.runFlg = false;
      }
    };
    
    member.setArea = {
      init: function(a) {
        if ( $(".currentLine").size() > 0 ) {
          member.setArea.chkAddCls(a);
        } else {
          member.setArea.newAddCls(a);
        }
      },
      newAddCls: function(a) {
        $(a).addClass("currentThum");
        $(a).parents("div.listAll").addClass("currentLine");
        var cols = member.setArea.compar(a);
        member.setArea.addArea(cols, a);
      },
      chkAddCls: function(a) {
        var cols = member.setArea.compar(a);
        
        if(cols >= 0) { // 同じ列の時
          if ( $(a).is(".currentThum") ) {
            $("div#creatorAll").stop().animate({height: 0, padding: 0},{
              duration: 600,
              easing: "easeOutQuart",
              step: function(){
                $("div#creatorAll div.creator").fadeOut(400);
                setTimeout(function(){ $("span.active").removeClass("active"); }, 400);
              },
              complete: function(){
                $("div#creatorAll").remove();
                $("a.currentThum").removeClass("currentThum");
                $("div.currentLine").removeClass("currentLine");
                member.conf.runFlg = false;
              }
            });
            
            return;
          }
          $("div#creatorAll div.creator").stop().animate({opacity:0}, 200, function() {
            $(this).remove();
          });
          $("div#creatorAll .close").stop().animate({opacity:0}, 200, function() {
            $(this).remove();
          });
          $("a.currentThum").removeClass("currentThum");
          $(a).addClass("currentThum");
          $("span.active").removeClass("active");
          member.setArea.addArea(cols, a);
        } else { // 違う列の時
          $("div#creatorAll").remove();
          $("a.currentThum").removeClass("currentThum");
          $("span.active").removeClass("active");
          $("div.currentLine").removeClass("currentLine");
          member.setArea.newAddCls(a);
          
        }
      },
      compar: function(a) {
        var postLineArr = $(".currentLine a", $contents);
        var cnt = -1;
        
        for( i=0;i<postLineArr.length;i++) {
          cnt ++;
          if( a == postLineArr[i] ) {
            return cnt;
          } else {
            if( i+1 == postLineArr.length ) {
              return -1;
            }
          }
        }
      },
      addArea: function( xNum, a ) {
        if( $("div#creatorAll").size() > 0 ) {
          $("div#creatorAll").removeClass();
          $("div#creatorAll").addClass("pos" + xNum);
        } else {
          $(".currentLine", $contents).after('<div id="creatorAll" class="pos' + xNum + '"></article>');
        }
        
        member.setPost.init(a);
      }
    };
    
    $(".list a", $contents).on("click", function(){
      if( !member.conf.runFlg ) {
        member.conf.runFlg = true;
        member.setArea.init(this);
      }
      
      return false;
    });
    
    // スマホでスクロール時にClassが消える対策
    $(window).on("touchend", function(){
      $("div#creatorAll").prev().addClass("currentLine");
    });
  }

  /***********
   * CONTACT
   ***********/
  /**
   * curtain除外
   **/
  if ( $body.is("#contact") ) {
    $(".btn", $contents).click(function(){
      $.cookie("curtain", true);
    });
  }
  
  /***********
   * ABOUT
   ***********/
  if ( $body.is("#about") ) {
    var isLandscapeAbout = function(){
      if (window.innerHeight > window.innerWidth) {
        setBr();
      }else{
        setBr();
      }
    };
    
    
    var setBr = function() {
      var br = $('<br>');
      var _target = $(".link", $contents);
      if ( window.innerWidth < 540 ) {
        if ( !_target.is(".onSp") ) {
          _target.addClass("onSp").before(br);
        }
      } else {
        if ( _target.is(".onSp") ) {
          _target.removeClass("onSp").prev().remove();
        }
      }
    };
    
    isLandscapeAbout();
    $(window).on("resize", function(e){
      isLandscapeAbout();
    });
  }
  
  /***********
   * SHILUSHI
   ***********/
  /**
   * set modal
   **/
  if ( $body.is("#shilushi") ) {
    var $log = $("#log", $contents);
    
    $(".modal", $log).magnificPopup({
      type: "inline",
      removalDelay: 300,
      mainClass: "mfp-fade",
      
      callbacks:{
        resize: function(){
          setTimeout(function(){
            $("div.mfp-bg.mfp-fade.mfp-ready").css({position: "fixed"});
          }, 100);
          
          //console.log("resize");
        },
        ajaxContentAdded: function() {
          if ( window.innerWidth < 540 ) {
            var height = this.content.height();
            setTimeout(function(){
              $("div.mfp-bg.mfp-fade.mfp-ready").css({height: height});
            }, 100);
            //console.log(this.content.height());
          }
        }
      }
    });
    
    var isLandscapeShilushi = function(){
      if (window.innerHeight > window.innerWidth) {
        setShilushiSize();
      }else{
        setShilushiSize();
      }
    };
    
    var setShilushiSize = function() {
      if ( 1024 <= window.innerWidth ) {
        $("li", $log).removeClass("right");
        $("li:nth-child(4n)", $log).addClass("right");
      } else if ( window.innerWidth < 540 ) {
        $("li", $log).removeClass("right");
        $("li:nth-child(2n)", $log).addClass("right");
      } else {
        $("li", $log).removeClass("right");
        $("li:nth-child(3n)", $log).addClass("right");
      }
    };
    
    isLandscapeShilushi();
    $(window).on("resize", function(e){
      isLandscapeShilushi();
    });
  }
}
