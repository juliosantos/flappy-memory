var Memory = (function () {
  var ALL_SYMBOLS = ["fa-adn","fa-android","fa-apple","fa-bitbucket","fa-bitbucket-square","fa-bitcoin (alias)","fa-btc","fa-css3","fa-dribbble","fa-dropbox","fa-facebook","fa-facebook-square","fa-flickr","fa-foursquare","fa-github","fa-github-alt","fa-github-square","fa-gittip","fa-google-plus","fa-google-plus-square","fa-html5","fa-instagram","fa-linkedin","fa-linkedin-square","fa-linux","fa-maxcdn","fa-pagelines","fa-pinterest","fa-pinterest-square","fa-renren","fa-skype","fa-stack-exchange","fa-stack-overflow","fa-trello","fa-tumblr","fa-tumblr-square","fa-twitter","fa-twitter-square","fa-vimeo-square","fa-vk","fa-weibo","fa-windows","fa-xing","fa-xing-square","fa-youtube","fa-youtube-play","fa-youtube-square"];
  var CONFIG = {
    rows : 4,
    cols : 4,
    level : 5
  };
  var $openTile;
  var nCells;

  var init = function (options) {
    if (options && options.level > ALL_SYMBOLS.length) {
      throw( "ERROR: maximum level is " + ALL_SYMBOLS.length )
      return;
    } else if (options && options.rows * options.cols % 2 !== 0) {
      throw( "ERROR: rows*cols must be an even number (was " + options.rows + "*" + options.cols + "=" + options.rows * options.cols + ")" )
      return;
    }
    options && _.each( CONFIG, function (value, attribute) {
      CONFIG[attribute] = options[attribute] || CONFIG[attribute];
    });

    CONFIG.symbols = ALL_SYMBOLS.slice( 0, CONFIG.level );
    nCells = CONFIG.cols * CONFIG.rows;

    createTable();
    attachEvents();
  };

  var createTable = function () {
    var usedSymbols = [];

    var pickSymbol = function (iteration) {
      var symbol;

      if (iteration <= nCells/2) {
        symbol = CONFIG.symbols[Math.floor( Math.random() * CONFIG.symbols.length )];
        usedSymbols.push( symbol );
      } else {
        var index = Math.floor( Math.random() * usedSymbols.length );
        symbol = usedSymbols.splice( index, 1 )[0];
      }

      return symbol;
    };

    var table = "<table>";

    for (var i = 0; i < CONFIG.cols; i++) {
      table = table.concat( "<tr>" )

      for (var j = 0; j < CONFIG.rows; j++) {
        var symbol = pickSymbol( i * CONFIG.cols + j + 1 );
        table = table.concat( "<td>" );
        table = table.concat( "<a href='#'><i class='fa " + symbol + "'></i></a>" );
        table = table.concat( "</td>" );
      }

      table = table.concat( "</tr>" )
    }

    table = table.concat( "</table>" );

    $( "#game" ).html( table );
    setTimeout( function () {
      $( "#game table" ).addClass( "shown" );

      $( "td" ).each( function () {
        var $td = $( this );
        $td.height( $td.width() );
        $td.find( "a" ).height( $td.width() );
        $td.find( "a" ).width( $td.width() );
        $td.find( "i" ).css({
          fontSize : $td.width(),
          lineHeight : $td.width() + "px"
        });
      });
    }, 1 );
  };

  var attachEvents = function () {
    var closeAll = function () { $( "#game table td" ).removeClass( "open" ); };
    var open = function ($td) { $td.addClass( "open" ); };
    var blanken = function ($td) { $td.addClass( "matched" ); $td.off( "click" );};
    var symbolIn = function ($td) { return $td.find( "i" ).attr( "class" ) };
    var sameTile = function ($td1, $td2) { return $td1[0] === $td2[0]; };

    var checkEndGame = function () {
      if ($( "#game table td.matched" ).length === nCells) {
        init();
      }
    };

    $( "#game td" ).each( function () {
      $( this ).click( function () {
        var $clickedTile = $( this );

        if ($openTile) {
          open( $clickedTile );
          if (symbolIn( $openTile ) === symbolIn( $clickedTile )) {
            if (sameTile( $openTile, $clickedTile )) {
              closeAll();
            } else {
              var _$clickedTile = $clickedTile;
              var _$openTile = $openTile;
              setTimeout( function () {
                blanken( _$clickedTile );
                blanken( _$openTile );
                checkEndGame();
              }, 400 );
            }
          } else {
            setTimeout( closeAll, 800 );
          }
          $openTile = undefined;
        } else {
          closeAll();
          open( $clickedTile );
          $openTile = $clickedTile;
        }
      });
    });
  };

  return {
    init : init
  }
}());
