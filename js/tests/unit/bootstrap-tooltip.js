$(function () {

    module("bootstrap-tooltip")

      test("should provide no conflict", function () {
        var tooltip = $.fn.tooltip.noConflict()
        ok(!$.fn.tooltip, 'tooltip was set back to undefined (org value)')
        $.fn.tooltip = tooltip
      })

      test("should be defined on jquery object", function () {
        var div = $("<div></div>")
        ok(div.tooltip, 'popover method is defined')
      })

      test("should return element", function () {
        var div = $("<div></div>")
        ok(div.tooltip() == div, 'document.body returned')
      })

      test("should expose default settings", function () {
        ok(!!$.fn.tooltip.defaults, 'defaults is defined')
      })

      test("should remove title attribute", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').tooltip()
        ok(!tooltip.attr('title'), 'title tag was removed')
      })

      test("should add data attribute for referencing original title", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>').tooltip()
        equals(tooltip.attr('data-original-title'), 'Another tooltip', 'original title preserved in data attribute')
      })

      test("should place tooltips relative to placement option", function () {
        $.support.transition = false
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({placement: 'bottom'})
          .tooltip('show')

        ok($(".tooltip").is('.fade.bottom.in'), 'has correct classes applied')
        tooltip.tooltip('hide')
      })

      test("should allow html entities", function () {
        $.support.transition = false
        var tooltip = $('<a href="#" rel="tooltip" title="<b>@fat</b>"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({html: true})
          .tooltip('show')

        ok($('.tooltip b').length, 'b tag was inserted')
        tooltip.tooltip('hide')
        ok(!$(".tooltip").length, 'tooltip removed')
      })

      test("should respect custom classes", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({ template: '<div class="tooltip some-class"><div class="tooltip-arrow"/><div class="tooltip-inner"/></div>'})
          .tooltip('show')

        ok($('.tooltip').hasClass('some-class'), 'custom class is present')
        tooltip.tooltip('hide')
        ok(!$(".tooltip").length, 'tooltip removed')
      })

      test("should not show tooltip if leave event occurs before delay expires", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({ delay: 200 })

        stop()

        tooltip.trigger('mouseenter')

        setTimeout(function () {
          ok(!$(".tooltip").is('.fade.in'), 'tooltip is not faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok(!$(".tooltip").is('.fade.in'), 'tooltip is not faded in')
            start()
          }, 200)
        }, 100)
      })

      test("should not show tooltip if leave event occurs before delay expires, even if hide delay is 0", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({ delay: { show: 200, hide: 0} })

        stop()

        tooltip.trigger('mouseenter')

        setTimeout(function () {
          ok(!$(".tooltip").is('.fade.in'), 'tooltip is not faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok(!$(".tooltip").is('.fade.in'), 'tooltip is not faded in')
            start()
          }, 200)
        }, 100)
      })

      test("should not show tooltip if leave event occurs before delay expires", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({ delay: 100 })
        stop()
        tooltip.trigger('mouseenter')
        setTimeout(function () {
          ok(!$(".tooltip").is('.fade.in'), 'tooltip is not faded in')
          tooltip.trigger('mouseout')
          setTimeout(function () {
            ok(!$(".tooltip").is('.fade.in'), 'tooltip is not faded in')
            start()
          }, 100)
        }, 50)
      })

      test("should show tooltip if leave event hasn't occured before delay expires", function () {
        var tooltip = $('<a href="#" rel="tooltip" title="Another tooltip"></a>')
          .appendTo('#qunit-fixture')
          .tooltip({ delay: 150 })
        stop()
        tooltip.trigger('mouseenter')
        setTimeout(function () {
          ok(!$(".tooltip").is('.fade.in'), 'tooltip is not faded in')
        }, 100)
        setTimeout(function () {
          ok($(".tooltip").is('.fade.in'), 'tooltip has faded in')
          start()
        }, 200)
      })

      test("should destroy tooltip", function () {
        var tooltip = $('<div/>').tooltip().on('click.foo', function(){})
        ok(tooltip.data('tooltip'), 'tooltip has data')
        ok($._data(tooltip[0], 'events').mouseover && $._data(tooltip[0], 'events').mouseout, 'tooltip has hover event')
        ok($._data(tooltip[0], 'events').click[0].namespace == 'foo', 'tooltip has extra click.foo event')
        tooltip.tooltip('show')
        tooltip.tooltip('destroy')
        ok(!tooltip.hasClass('in'), 'tooltip is hidden')
        ok(!$._data(tooltip[0], 'tooltip'), 'tooltip does not have data')
        ok($._data(tooltip[0], 'events').click[0].namespace == 'foo', 'tooltip still has click.foo')
        ok(!$._data(tooltip[0], 'events').mouseover && !$._data(tooltip[0], 'events').mouseout, 'tooltip does not have any events')
      })

      test("should show tooltip with delegate selector on click", function () {
        var div = $('<div><a href="#" rel="tooltip" title="Another tooltip"></a></div>')
        var tooltip = div.appendTo('#qunit-fixture')
                         .tooltip({ selector: 'a[rel=tooltip]',
                                    trigger: 'click' })
        div.find('a').trigger('click')
        ok($(".tooltip").is('.fade.in'), 'tooltip is faded in')
      })

      test("should sanitize template by removing disallowed tags", function () {
        var div = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
        var tooltip = div.appendTo('#qunit-fixture')
                          .tooltip({
                              template: [
                                '<div>',
                                '  <script>console.log("oups script inserted")</script>',
                                '  <span>Some content</span>',
                                '</div>'
                              ].join('')
                            })
        var sanitizedTooltip = tooltip.data('tooltip')
        ok(sanitizedTooltip.options.template.indexOf('script') == -1, 'tooltip has been sanitized with disallowed tags')
      })

      test('should sanitize template by removing disallowed attributes', function () {
        var div = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
        var tooltip =  div.appendTo('#qunit-fixture')
                          .tooltip({
                            template: [
                              '<div>',
                              '  <img src="x" onError="alert(\'test\')">Some content</img>',
                              '</div>'
                            ].join('')
                          })
    
        var sanitizedTooltip = tooltip.data('tooltip')
        ok(sanitizedTooltip.options.template.indexOf('onError') == -1 , 'sanitized template with disallowed attributes')
      })

      test('should sanitize template by removing tags with XSS', function () {
        var div = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
        var tooltip =  div.appendTo('#qunit-fixture')
                          .tooltip({
                            template: [
                              '<div>',
                              '  <a href="javascript:alert(7)">Click me</a>',
                              '  <span>Some content</span>',
                              '</div>'
                            ].join('')
                          })
    
        var sanitizedTooltip = tooltip.data('tooltip')
        ok(sanitizedTooltip.options.template.indexOf('javascript') == -1, 'sanitized tags with XSS')
      })

      test('should allow custom sanitization rules', function () {
        var div = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
        var tooltip = div.appendTo('#qunit-fixture')
                          .tooltip({
                            template: [
                              '<a href="javascript:alert(7)">Click me</a>',
                              '<span>Some content</span>'
                            ].join(''),
                            whiteList: {
                              span: null
                            }
                          })
    
        var sanitizedToolTip = tooltip.data('tooltip')
    
        ok(sanitizedToolTip.options.template.indexOf('<a') == -1 , 'allowed custom sanitization sample 1')
        ok(sanitizedToolTip.options.template.indexOf('span') !== -1 , 'allowed custom sanitization sample 2')
      })

      test('should allow passing a custom function for sanitization', function () {
        var div = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
        var tooltip = div.appendTo('#qunit-fixture')
                         .tooltip({
                            template: [
                              '<span>Some content</span>'
                            ].join(''),
                            sanitizeFn: function (input) {
                              return input
                            }
                          })
    
        var sanitizedToolTip = tooltip.data('tooltip')
        ok(sanitizedToolTip.options.template.indexOf('span') !== -1 , 'allowed passing custom function for sanitizeFn')
      })

      test('should allow passing aria attributes', function () {
        var div = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
        var tooltip =  div.appendTo('#qunit-fixture')
                          .tooltip({
                            template: [
                              '<span aria-pressed="true">Some content</span>'
                            ].join('')
                          })
    
        var sanitizedTooltip = tooltip.data('tooltip')
        ok(sanitizedTooltip.options.template.indexOf('aria-pressed') !== -1 , 'allowed aria attributes')
      })

      test('should not take into account sanitize in data attributes', function () {
        var div = $('<a href="#" rel="tooltip" data-sanitize="false" data-trigger="click" title="Another tooltip"/>')
        var tooltip =  div.appendTo('#qunit-fixture')
                          .tooltip({
                            template: [
                              '<span aria-pressed="true">Some content</span>'
                            ].join('')
                          })
    
        var sanitizedToolTip = tooltip.data('tooltip')
        ok(sanitizedToolTip.options.sanitize === true , 'data attributes sanitize not taken into account')
      })

      test('should disable sanitizer', function () {
        var div = $('<a href="#" rel="tooltip" data-trigger="click" title="Another tooltip"/>')
        var tooltip = div.appendTo('#qunit-fixture')
                        .tooltip({
                            sanitize: false
                          })
    
        var sanitizedToolTip = tooltip.data('tooltip')
        ok(sanitizedToolTip.options.sanitize === false , 'sanitizer flag has been disabled')
      })
})