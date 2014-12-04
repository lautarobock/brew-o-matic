 	angular.module("gt.listview.tpls", []).run(["$templateCache", function($templateCache) {   'use strict';

  $templateCache.put('listview/listview-filter-combo.html',
    "<div class=\"col-sm-{{filter.colSpan||listviewConfig.filterColSpan||'12'}}\" style=\"margin-bottom: 1em;\">\n" +
    "    <label for=\"{{filterName}}_id\">{{filter.caption}}</label>\n" +
    "    <div class=\"input-group\">\n" +
    "        <select \n" +
    "            ng-options=\"value._id as filter.getLabel(value) group by filter.groupBy(value) for value in filter.data | orderBy:filter.orderBy\" \n" +
    "            class=\"form-control input-sm\" \n" +
    "            ng-change=\"search()\"\n" +
    "            id=\"{{filterName}}_id\" \n" +
    "            ng-model=\"filter.value\"></select>\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button ng-click=\"clearFilter(filter,filterName)\" class=\"btn btn-default btn-sm\" type=\"button\">\n" +
    "                <span class=\"glyphicon glyphicon-remove\"></span>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('listview/listview.html',
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-body\" style=\"padding-bottom: 0;\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <div class=\"well well-sm\" style=\"padding: 7px;\">\n" +
    "                    <ng-pluralize ng-hide=\"loading\" count=\"pagination.totalItems\" when=\"pluralization\"></ng-pluralize>\n" +
    "                    <span ng-show=\"loading\" class=\"glyphicon glyphicon-refresh\"></span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <div class=\"btn-group\">\n" +
    "                    <button type=\"button\" ng-change=\"changePageSize()\" class=\"btn btn-default btn-sm\" ng-model=\"pagination.pageSize\" btn-radio=\"10\">10</button>\n" +
    "                    <button type=\"button\" ng-change=\"changePageSize()\" class=\"btn btn-default btn-sm\" ng-model=\"pagination.pageSize\" btn-radio=\"25\">25</button>\n" +
    "                    <button type=\"button\" ng-change=\"changePageSize()\" class=\"btn btn-default btn-sm\" ng-model=\"pagination.pageSize\" btn-radio=\"50\">50</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <div class=\"col-xs-2\" style=\"font-size: 21px;\">\n" +
    "                    <span class=\"glyphicon glyphicon-sort-by-attributes-alt\"></span>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-10\">\n" +
    "                    <select class=\"form-control input-sm\" ng-change=\"changeSort()\" ng-model=\"query.sort\" ><!-- style=\"background-color: #272b30; color: #c8c8c8;\" -->\n" +
    "                      <option ng-repeat=\"sort in listviewSort.combo\" value=\"{{ sort.sort }}\">\n" +
    "                        {{ sort.label }}\n" +
    "                      </option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div  class=\"panel panel-default\" style=\"margin: 0 1em 1em 1em\">\n" +
    "        <div class=\"panel-body\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-sm-{{listviewConfig.filterColSpan||'12'}}\" style=\"margin-bottom: 1em;\">\n" +
    "                    <label for=\"filter.name\">{{listviewConfig.searchCriteriaLabel||'Busqueda'}}</label>\n" +
    "                    <div class=\"input-group\" style=\"width: 100%\">\n" +
    "                        <input ng-change=\"search()\" type=\"text\" id=\"filter.name\"  class=\"form-control input-sm\" ng-model=\"searchCriteria\"/>\n" +
    "                        <span class=\"input-group-btn\">\n" +
    "                            <button ng-disabled=\"searchCriteria==''\"  ng-click=\"clearSearch()\" class=\"btn btn-default btn-sm\" type=\"button\">\n" +
    "                                <span class=\"glyphicon glyphicon-remove\"></span>\n" +
    "                            </button>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-repeat=\"_value in listviewConfig.filterOrder\" ng-init=\"filterName=_value; filter=listviewFilter[_value]\">\n" +
    "                    <ng-include src=\"urlTemplate(filter)\"></ng-include>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\" ng-show=\"loading\">\n" +
    "        <center><span class=\"glyphicon glyphicon-refresh\"></span></center>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\" ng-show=\"(pagination.totalItems == 0) && !loading\">\n" +
    "        <div class=\"alert alert-info\" >\n" +
    "            {{emptyResultText}}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"loading\">\n" +
    "        <table class=\"table table-striped table-hover\" >\n" +
    "            <thead>\n" +
    "                <tr>\n" +
    "                    <th ng-repeat=\"header in listviewHeader\" \n" +
    "                        ng-class={'hidden-xs':header.hidden.xs,'hidden-sm':header.hidden.sm}\n" +
    "                        ng-style=\"getStyle(header)\">\n" +
    "                        <span tooltip=\"{{header.tooltip}}\" tooltip-append-to-body=\"true\">\n" +
    "                            {{header.caption}}\n" +
    "                        </span> <!-- <span ng-class=\"sort.orderStyle[header.field]\"></span> -->\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat=\"$model in models\">\n" +
    "                    <td ng-repeat=\"header in listviewHeader\" ng-class={'hidden-xs':header.hidden.xs,'hidden-sm':header.hidden.sm}>\n" +
    "                        <span ng-if=\"header.templateUrl\"> \n" +
    "                            <ng-include src=\"header.templateUrl\"></ng-include>\n" +
    "                        </span>\n" +
    "                        <span ng-if=\"!header.templateUrl\" ng-bind-html=\"getValue(header,$model)\"></span>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "        <hr/>\n" +
    "        <div style=\"margin:1em\">\n" +
    "            <pagination boundary-links=\"true\" total-items=\"pagination.totalItems\" items-per-page=\"pagination.pageSize\" page=\"pagination.page\" max-size=\"15\" class=\"pagination-small\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "            <div style=\"white-space: pre-wrap;box-sizing: border-box;\">{{(pagination.page-1)*pagination.pageSize + 1}} - <span ng-hide=\"pagination.page == getPageCount(pagination.totalItems)\">{{pagination.page*pagination.pageSize}}</span><span ng-show=\"pagination.page == getPageCount(pagination.totalItems)\">{{pagination.totalItems}}</span> de {{pagination.totalItems}}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );
	}]);