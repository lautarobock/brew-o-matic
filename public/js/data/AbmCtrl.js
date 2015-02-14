(function() {

    var abm = angular.module("abm",[]);


    abm.controller("AbmCtrl",function($scope,$rootScope,$routeParams,Grain, Hop, Bottle, Misc,Yeast,Style,sortData) {

        $scope.allConfigs = {
            Style:  {
                data: Style,
                name: "Estilos",
                singular: "Estilo",
                orderBy: "name",
                pageSize: 10,
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre'
                    },{
                        field:'OG_Min',
                        caption: 'OG min'
                    },{
                        field:'OG_Max',
                        caption: 'OG max'
                    },{
                        field:'FG_Min',
                        caption: 'FG min'
                    },{
                        field:'FG_Max',
                        caption: 'FG max'
                    },{
                        field:'IBU_Min',
                        caption: 'IBU min'
                    },{
                        field:'IBU_Max',
                        caption: 'IBU max'
                    },{
                        field:'Colour_Min',
                        caption: 'Color min'
                    },{
                        field:'Colour_Max',
                        caption: 'Color max'
                    },{
                        field:'ABV_Min',
                        caption: '%Alc min'
                    },{
                        field:'ABV_Max',
                        caption: '%Alc max'
                    //},{
                    //    field:'link',
                    //    caption: 'BJCP'
                    },{
                        field:'co2_min',
                        caption: 'CO2 min'
                    },{
                        field:'co2_max',
                        caption: 'CO2 max'
                    //},{
                    //    field:'related',
                    //    caption: 'RateBeer.com'
                    }
                ]
            },
            Yeast:  {
                data: Yeast,
                name: "Levaduras",
                singular: "Levadura",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        width:'70%'
                    },{
                        field:'aa',
                        caption: 'Atenuacion',
                        type: 'number',
                        width:'20%'
                    },{
                        field:'density',
                        caption: 'Densidad',
                        type: 'number',
                        width:'20%'
                    }
                ]
            },
            Misc:  {
                data: Misc,
                name: "Miscs",
                singular: "Misc",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre'
                    },{
                        field:'type',
                        caption: 'Tipo'
                    },{
                        field:'use',
                        caption: 'Uso'
                    }
                ]
            },
            Bottle:  {
                data: Bottle,
                name: "Botellas",
                singular: "Botella",
                orderBy: "size",
                headers: [
                    {
                        field:'_id',
                        caption: 'ID',
                        width: '25%'
                    },{
                        field:'name',
                        caption: 'Nombre',
                        width: '25%'
                    },{
                        field:'size',
                        caption: 'Tamaño',
                        type: "number",
                        step: "0.01",
                        width: '25%'
                    },{
                        field:'colour',
                        caption: 'Color',
                        type: 'combo',
                        data: ['Ambar', 'Verde', 'Blanca'],
                        width: '25%'
                    }
                ]
            },
            Grain: {
                data: Grain,
                name: "Granos",
                singular: "Grano",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        width: '50%'
                    },{
                        field:'type',
                        caption: 'Tipo',
                        width: '15%'
                    },{
                        field:'colour',
                        caption: 'Color',
                        type: 'number',
                        step: 0.1,
                        width: '15%'
                    },{
                        field:'potential',
                        caption: 'Potencial',
                        type: 'number',
                        step: 0.001,
                        width: '15%'
                    },{
                        field:'use',
                        caption: 'Uso',
                        width: '15%'
                    },{
                        field:'excludeIBU',
                        caption: 'Excluye IBU ',
                        width: '15%'
                    }
                ]
            },
            Hop: {
                data: Hop,
                name: "Lupulos",
                singular: "Lupulo",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        width: '70%'
                    },{
                        field:'alpha',
                        caption: 'AA%',
                        type: 'number',
                        step: 0.1,
                        width: '25%'
                    }
                ]
            }
        };

        $scope.entity = $routeParams.entity;

        $scope.config = $scope.allConfigs[$scope.entity];

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: $scope.config.name
        }];

        $scope.getActiveClass = function(tab) {
            if (tab == $scope.entity) {
                return 'active';
            } else {
                return '';
            }
        };

    });

})();
