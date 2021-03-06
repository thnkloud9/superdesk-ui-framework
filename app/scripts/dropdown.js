'use strict';

sdDropdown.$inject = ['$window'];
function sdDropdown($window) {
    return {
        link: function (scope, elem) {
            var menu = elem.children('.dropdown__menu');
            var button = elem.children('[dropdown__toggle]');

            var settings = {
                isTopOriented: menu.hasClass('dropdown--dropup'),
                isRightOriented: menu.hasClass('dropdown--align-right'),
                isInlineOriented: elem.hasClass('dropdown--dropright') ||
                        elem.hasClass('dropdown--dropleft')
            };

            function closeToBottom(event) {
                return event.clientY > $window.innerHeight - (menu.outerHeight() + button.outerHeight());
            }

            function closeToLeft() {
                return elem.offset().left < menu.outerWidth();
            }

            function closeToRight() {
                return ($window.innerWidth - elem.offset().left) < menu.outerWidth();
            }

            button.bind('click mouseover', function (event) {
                // Check if menu is near bottom edge
                if (closeToBottom(event)) {
                    elem.addClass('dropdown--dropup');
                } else if (!settings.isTopOriented) {
                    elem.removeClass('dropdown--dropup');
                }

                // Check if menu is near left edge
                if (closeToLeft()) {
                    menu.removeClass('dropdown--align-right');
                } else if (settings.isRightOriented) {
                    menu.addClass('dropdown--align-right');
                }

                // Check if menu is near right edge
                if (closeToRight()) {
                    menu.addClass('dropdown--align-right');
                } else if (!settings.isRightOriented) {
                    menu.removeClass('dropdown--align-right');
                }
            });
        }
    };
}

sdDropdownAppendToBody.$inject = ['$window'];
function sdDropdownAppendToBody($window) {
    return {
        require: 'dropdown',
        link: function (scope, elem, attr, ctrl) {
            var button = elem.find('[dropdown__toggle]');

            function closeToRight(menu) {
                return ($window.innerWidth - elem.offset().left) < menu.outerWidth();
            }

            scope.$watch(ctrl.isOpen, function (isOpen) {
                if (!isOpen)
                    return false;

                var style = {
                    display: isOpen ? 'block' : 'none',
                    top: elem.offset().top + button.outerHeight(),
                    left: elem.offset().left,
                    opacity: 1
                };

                scope.$evalAsync(function () {
                    ctrl.dropdownMenu.css({opacity: 0});
                });

                scope.$applyAsync(function () {
                    // Check if menu is near bottom edge
                    if (elem.hasClass('dropdown--dropup')) {
                        style.top = elem.offset().top - ctrl.dropdownMenu.outerHeight();
                    }

                    // Check if menu is near left edge
                    if (closeToRight(ctrl.dropdownMenu)) {
                        style.left = $window.innerWidth - ctrl.dropdownMenu.outerWidth() - 15;
                    }

                    // Apply modified css to dropdown menu element
                    ctrl.dropdownMenu.css(style);
                });
            });
        }
    };
}

angular.module('superdesk-ui.dropdown', [])
        .directive('dropdown', sdDropdown)
        .directive('dropdownAppendToBody', sdDropdownAppendToBody);