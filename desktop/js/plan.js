/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */
 var deviceInfo = getDeviceType();
 var editOption = {state : false, snap : false,grid : false,gridSize:false}

 $("#md_addViewData").dialog({
    closeText: '',
    autoOpen: false,
    modal: true,
    height: (jQuery(window).height() - 150),
    width: (jQuery(window).width() - 450)
});

 $('body').delegate('.eqLogic-widget .history', 'click', function () {
    if (!editOption.state) {
        $('#md_modal').dialog({title: "Historique"});
        $("#md_modal").load('index.php?v=d&modal=cmd.history&id=' + $(this).data('cmd_id')).dialog('open');
    }
});
 $('body').delegate('.div_displayObject > .cmd-widget .history', 'click', function () {
    if (!editOption.state) {
        $('#md_modal').dialog({title: "Historique"});
        $("#md_modal").load('index.php?v=d&modal=cmd.history&id=' + $(this).data('cmd_id')).dialog('open');
    }
});

 planHeaderContextMenu = {};
 for(var i in planHeader){
    planHeaderContextMenu[planHeader[i].id] = {
        name:planHeader[i].name,
        callback: function(key, opt){
            planHeader_id = key;
            displayPlan();
        }
    }
}

$.contextMenu({
    selector: '#div_pageContainer',
    zIndex: 9999,
    events: {
        show: function(opt) {
            var $this = this;
            $.contextMenu.setInputValues(opt, $this.data());
        }, 
        hide: function(opt) {
            var $this = this;
            $.contextMenu.getInputValues(opt, $this.data());
        }
    },
    items: {
        fold1: {
            name: "{{Designs}}", 
            icon : 'fa-picture-o',
            items: planHeaderContextMenu
        },
        edit: {
            name: "{{Edition}}",
            icon : 'fa-pencil',
            callback: function(key, opt){
                editOption.state = !editOption.state;
                this.data('editOption.state', editOption.state);
                initEditOption(editOption.state);
                return false;
            }
        },
        fullscreen: {
            name: "{{Plein écran}}",
            icon : 'fa-desktop',
            callback: function(key, opt){
                if(this.data('fullscreen') == undefined){
                    this.data('fullscreen',1)
                }
                fullScreen(this.data('fullscreen'));
                this.data('fullscreen',!this.data('fullscreen'));
            }
        },
        sep1 : "---------",
        addGraph: {
            name: "{{Ajouter Graphique}}",
            icon : 'fa-line-chart',
            disabled:function(key, opt) { 
                return !this.data('editOption.state'); 
            },
            callback: function(key, opt){
                addGraph({});
                savePlan();
            }
        },
        addText: {
            name: "{{Ajouter texte/html}}",
            icon : 'fa-align-center',
            disabled:function(key, opt) { 
                return !this.data('editOption.state'); 
            },
            callback: function(key, opt){
             addText({display: {text: 'Texte à insérer ici'}});
             savePlan();
         }
     },
     addScenario: {
        name: "{{Ajouter scénario}}",
        icon : 'fa-plus-circle',
        disabled:function(key, opt) { 
            return !this.data('editOption.state'); 
        },
        callback: function(key, opt){
         jeedom.scenario.getSelectModal({}, function (data) {
            addScenario(data.id);
        });
     }
 },
 addLink: {
    name: "{{Ajouter lien}}",
    icon : 'fa-link',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    callback: function(key, opt){
      $('#md_selectLink').modal('show');
  }
},
addEqLogic: {
    name: "{{Ajouter équipement}}",
    icon : 'fa-plus-circle',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    callback: function(key, opt){
      jeedom.eqLogic.getSelectModal({}, function (data) {
        addEqLogic(data.id);
    });
  }
},
addCommand: {
    name: "{{Ajouter commande}}",
    icon : 'fa-plus-circle',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    callback: function(key, opt){
      jeedom.cmd.getSelectModal({}, function (data) {
        addCmd(data.cmd.id);
    });
  }
},
sep2 : "---------",
fold2: {
    name: "{{Grille}}", 
    icon : 'fa-th',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    items: {
        grid_none: {
            name: "Aucune", 
            type: 'radio', 
            radio: 'radio', 
            value: '0',
            selected: true,
            events: {
                click : function(e) {
                    editOption.gridSize = false;
                    initEditOption(1);
                }
            }
        },
        grid_10x10: {
            name: "10x10", 
            type: 'radio', 
            radio: 'radio', 
            value: '10', 
            events: {
                click : function(e) {
                    editOption.gridSize = [10,10];
                    initEditOption(1);
                }
            }
        },
        grid_15x15: {
            name: "15x15", 
            type: 'radio', 
            radio: 'radio', 
            value: '15',
            events: {
                click : function(e) {
                    editOption.gridSize = [15,15];
                    initEditOption(1);
                }
            }
        },
        grid_20x20: {
            name: "20x20", 
            type: 'radio', 
            radio: 'radio', 
            value: '20',
            events: {
                click : function(e) {
                    editOption.gridSize = [20,20];
                    initEditOption(1);
                }
            }
        },
        snap: {
            name: "{{Aimanter les élements}}", 
            type: 'checkbox', 
            radio: 'radio', 
            selected:  editOption.snap,
            events: {
                click : function(e) {
                 editOption.snap = $(this).value();
                 initEditOption(1);
             }
         }
     },
     snapGrid: {
        name: "{{Aimanter à la grille}}", 
        type: 'checkbox', 
        radio: 'radio',
        selected:  editOption.grid,
        events: {
            click : function(e) {
                editOption.grid = $(this).value();
                initEditOption(1);
            }
        }
    },
}
},
removePlan: {
    name: "{{Supprimer le design}}",
    icon : 'fa-trash',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    callback: function(key, opt){
      bootbox.confirm('{{Etes vous sûr de vouloir supprimer ce design ?}}', function (result) {
        if (result) {
            jeedom.plan.removeHeader({
                id:planHeader_id,
                error: function (error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function () {
                 $('#div_alert').showAlert({message: 'Design supprimé', level: 'success'});
                 loadPage('index.php?v=d&p=plan');
             },
         });
        }
    });
  }
},
addPlan: {
    name: "{{Creer un design}}",
    icon : 'fa-plus-circle',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    callback: function(key, opt){
     bootbox.prompt("Nom du design ?", function (result) {
        if (result !== null) {
            jeedom.plan.saveHeader({
                planHeader: {name: result},
                error: function (error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function (data) {
                    loadPage('index.php?v=d&p=plan&plan_id=' + data.id);
                }
            });
        }
    });
 }
},
duplicatePlan: {
    name: "{{Dupliquer le design}}",
    icon : 'fa-files-o',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    callback: function(key, opt){
       bootbox.prompt("{{Nom la copie du design ?}}", function (result) {
        if (result !== null) {
            jeedom.plan.copyHeader({
                name: result,
                id: planHeader_id,
                error: function (error) {
                    $('#div_alert').showAlert({message: error.message, level: 'danger'});
                },
                success: function (data) {
                 loadPage('index.php?v=d&p=plan&plan_id=' + data.id);
             },
         });
        }
    });
   }
},
configurePlan: {
    name: "{{Configurer le design}}",
    icon : 'fa-cogs',
    disabled:function(key, opt) { 
        return !this.data('editOption.state'); 
    },
    callback: function(key, opt){
       $('#md_modal').dialog({title: "{{Configuration du design}}"});
       $('#md_modal').load('index.php?v=d&modal=planHeader.configure&planHeader_id=' + planHeader_id).dialog('open');
   }
},
sep3 : "---------",
save: {
    name: "{{Sauvegarder}}",
    icon : 'fa-floppy-o',
    callback: function(key, opt){
     savePlan();
     return false;
 }
},
}
});

/*****************************PLAN HEADER***********************************/

$('body').delegate('.plan-link-widget', 'click', function () {
    if (!editOption.state) {
        planHeader_id = $(this).attr('data-link_id');
        displayPlan();
    }
});

/*****************************PLAN***********************************/

jwerty.key('ctrl+s', function (e) {
    e.preventDefault();
    savePlan();
});

$.contextMenu({
    selector: '.eqLogic-widget,.div_displayObject > .cmd-widget',
    zIndex: 9999,
    events: {
       show : function(options){
        $(this).addClass('contextMenu_select');
    },
    hide : function(options){
       $(this).removeClass('contextMenu_select');
   }
},
items: {
    parameter: {
        name: '{{Paramètres d\'affichage}}',
        icon:'fa-cogs',
        callback: function(key, opt){
            var info = getObjectInfo($(this));
            $('#md_modal').dialog({title: "{{Configuration du widget}}"});
            $('#md_modal').load('index.php?v=d&modal=plan.configure&link_type='+info.type+'&link_id=' + info.id + '&planHeader_id=' + planHeader_id).dialog('open');
        }
    },
    configuration: {
        name: '{{Configuration avancée}}',
        icon:'fa-cog',
        callback: function(key, opt){
            $('#md_modal').dialog({title: "{{Configuration de l\'équipement}}"});
            var info = getObjectInfo($(this));
            $('#md_modal').load('index.php?v=d&modal='+info.type+'.configure&'+info.type+'_id=' + info.id).dialog('open');
        }
    },
    remove: {
        name: '{{Supprimer}}',
        icon:'fa-trash',
        callback: function(key, opt){
         var info = getObjectInfo($(this));
         jeedom.plan.remove({
           link_id:  info.id,
           link_type : info.type,
           planHeader_id : planHeader_id,
           error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function () {
            displayPlan();
        },
    });
     }
 }
}
});

$.contextMenu({
    selector: '.scenario-widget,.plan-link-widget,.text-widget,.view-link-widget,.graph-widget',
    zIndex: 9999,
    events: {
       show : function(options){
        $(this).addClass('contextMenu_select');
    },
    hide : function(options){
       $(this).removeClass('contextMenu_select');
   }
},
items: {
    parameter: {
        name: '{{Paramètres d\'affichage}}',
        icon:'fa-cogs',
        callback: function(key, opt){
            var info = getObjectInfo($(this));
            $('#md_modal').dialog({title: "{{Configuration du widget}}"});
            $('#md_modal').load('index.php?v=d&modal=plan.configure&link_type='+info.type+'&link_id=' + info.id + '&planHeader_id=' + planHeader_id).dialog('open');
        }
    },
    remove: {
        name: '{{Supprimer}}',
        icon:'fa-trash',
        callback: function(key, opt){
         var info = getObjectInfo($(this));
         jeedom.plan.remove({
           link_id:  info.id,
           link_type : info.type,
           planHeader_id : planHeader_id,
           error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function () {
            displayPlan();
        },
    });
     }
 }
}
});

/**************************************init*********************************************/

displayPlan();

if (planHeader_id == -1){
    $('#div_pageContainer').height($('body').height());
}

/***********************************************************************************/

function setColorSelect(_select) {
    _select.css('background-color', _select.find('option:selected').val());
}

$('.graphDataOption[data-l1key=configuration][data-l2key=graphColor]').off('change').on('change', function () {
    setColorSelect($(this).closest('select'));
});

$('.div_displayObject:last').delegate('.configureGraph', 'click', function () {
    if (editOption.state) {
        var el = $(this).closest('.graph-widget');
        $("#md_addViewData").load('index.php?v=d&modal=cmd.graph.select', function () {
            $('#table_addViewData tbody tr .enable').prop('checked', false);
            var options = json_decode(el.find('.graphOptions').value());
            for (var i in options) {
                var tr = $('#table_addViewData tbody tr[data-link_id=' + options[i].link_id + ']');
                tr.find('.enable').value(1);
                tr.setValues(options[i], '.graphDataOption');
                setColorSelect(tr.find('.graphDataOption[data-l1key=configuration][data-l2key=graphColor]'));
            }
            $("#md_addViewData").dialog('option', 'buttons', {
                "Annuler": function () {
                    $(this).dialog("close");
                },
                "Valider": function () {
                    var tr = $('#table_addViewData tbody tr:first');
                    var options = [];
                    while (tr.attr('data-link_id') != undefined) {
                        if (tr.find('.enable').is(':checked')) {
                            var graphData = tr.getValues('.graphDataOption')[0];
                            graphData.link_id = tr.attr('data-link_id');
                            options.push(graphData);
                        }
                        tr = tr.next();
                    }
                    el.find('.graphOptions').empty().append(json_encode(options));
                    savePlan(true);
                    $(this).dialog('close');
                }
            });
            $('#md_addViewData').dialog('open');
        });
    }
});

$('.view-link-widget').off('click').on('click', function () {
    if (!editOption.state) {
        $(this).find('a').click();
    }
});

function fullScreen(_mode) {
    if(_mode){
        $('header').hide();
        $('footer').hide();
        $('#div_planHeader').hide();
        $('#div_mainContainer').css('margin-top', '-60px');
        $('#div_mainContainer').css('margin-left', '-15px');
        $('#wrap').css('margin-bottom', '0px');
    }else{
        $('header').show();
        $('footer').show();
        $('#div_planHeader').show();
        $('#div_mainContainer').css('margin-top', '0px');
        $('#div_mainContainer').css('margin-left', '0px');
        $('#wrap').css('margin-bottom', '15px');
        $('#bt_returnFullScreen').remove();
    }
}

function initEditOption(_state) {
    if (_state != 1 && _state != '1') {
       try{
        $('.plan-link-widget,.view-link-widget,.graph-widget,.eqLogic-widget,.div_displayObject > .cmd-widget,.scenario-widget,.text-widget').draggable("destroy");
        $('.plan-link-widget,.view-link-widget,.graph-widget,.eqLogic-widget,.scenario-widget,.text-widget').resizable("destroy");
        $('.div_displayObject a').each(function () {
            $(this).attr('href', $(this).attr('data-href'));
        });
    }catch (e) {

    }
    $('.div_grid').hide();
    try{
        $('.plan-link-widget,.view-link-widget,.graph-widget,.eqLogic-widget,.div_displayObject > .cmd-widget,.scenario-widget,.text-widget').contextMenu(false);
    }catch (e) {

    }
}else{
   $('.plan-link-widget,.view-link-widget,.graph-widget,.eqLogic-widget,.div_displayObject > .cmd-widget,.scenario-widget,.text-widget').draggable({
    snap : (editOption.snap == 1),
    grid : (editOption.grid == 1) ? editOption.gridSize : false,
    containment: 'parent'
});
   if(editOption.gridSize){
       $('.div_grid').show();
       $('.div_grid').css('background-size',editOption.gridSize[0]+'px '+editOption.gridSize[1]+'px');
   }else{
    $('.div_grid').hide();
}

$('.plan-link-widget,.view-link-widget,.graph-widget,.eqLogic-widget,.scenario-widget,.text-widget').resizable();
$('.div_displayObject a').each(function () {
    if ($(this).attr('href') != '#') {
        $(this).attr('data-href', $(this).attr('href'));
        $(this).removeAttr('href');
    }
});
try{
    $('.plan-link-widget,.view-link-widget,.graph-widget,.eqLogic-widget,.div_displayObject > .cmd-widget,.scenario-widget,.text-widget').contextMenu(true);
}catch (e) {

}
}
}

function displayPlan() {
    if(planHeader_id == -1){
        return;
    }
    history.replaceState(null, "Jeedom", "index.php?v=d&p=plan&plan_id=" + planHeader_id);
    jeedom.plan.getHeader({
        id: planHeader_id,
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (data) {
            $('.div_displayObject').empty();
            $('.div_displayObject').append('<div class="container-fluid div_grid" style="display:none;position: absolute;padding:0;width:100%;height:100%;user-select: none;-khtml-user-select: none;-o-user-select: none;-moz-user-select: -moz-none;-webkit-user-select: none;"></div>');
            $('.div_displayObject').height('auto');
            $('.div_displayObject').width('auto');
            if (isset(data.image)) {
                $('.div_displayObject').append(data.image);
            }
            if (data.configuration != null && init(data.configuration.desktopSizeX) != '' && init(data.configuration.desktopSizeY) != '') {
                $('.div_displayObject').height(data.configuration.desktopSizeY);
                $('.div_displayObject').width(data.configuration.desktopSizeX);
                $('.div_displayObject img').height(data.configuration.desktopSizeY);
                $('.div_displayObject img').width(data.configuration.desktopSizeX);
            } else {
                $('.div_displayObject').width($('.div_displayObject img').attr('data-sixe_x'));
                $('.div_displayObject').height($('.div_displayObject img').attr('data-sixe_y'));
                $('.div_displayObject img').css('height', ($('.div_displayObject img').attr('data-sixe_y')) + 'px');
                $('.div_displayObject img').css('width', ($('.div_displayObject img').attr('data-sixe_x')) + 'px');
            }
            $('.div_grid').width($('.div_displayObject').width());
            $('.div_grid').height($('.div_displayObject').height());
            if (getUrlVars('fullscreen') == 1) {
                fullScreen(true);
            }
            $('.div_displayObject').find('.eqLogic-widget,.div_displayObject > .cmd-widget,.scenario-widget,.plan-link-widget,.view-link-widget,.graph-widget,.text-widget').remove();
            if (planHeader_id != -1) {
                jeedom.plan.byPlanHeader({
                    id: planHeader_id,
                    error: function (error) {
                        $('#div_alert').showAlert({message: error.message, level: 'danger'});
                    },
                    success: function (plans) {
                        var objects = [];
                        for (var i in plans) {
                            if (plans[i].plan.link_type == 'graph') {
                                addGraph(plans[i].plan);
                            } else {
                                objects.push(displayObject(plans[i].plan.link_type, plans[i].plan.link_id, plans[i].html, plans[i].plan, true));
                            }
                        }
                        try {
                            $('.div_displayObject').append(objects);
                        }catch(e) {

                        }
                        initEditOption(editOption.state);
                    }
                });
            }
        },
    });
}

function getObjectInfo(_object){
    if(_object.hasClass('eqLogic-widget')){
        return {type : 'eqLogic',id : _object.attr('data-eqLogic_id')};
    }
    if(_object.hasClass('cmd-widget')){
     return {type :  'cmd',id : _object.attr('data-cmd_id')};
 }
 if(_object.hasClass('scenario-widget')){
     return {type :  'scenario',id : _object.attr('data-scenario_id')};
 }
 if(_object.hasClass('plan-link-widget')){
     return {type :  'plan',id : _object.attr('data-link_id')};
 }
 if(_object.hasClass('view-link-widget')){
     return {type :  'view',id : _object.attr('data-link_id')};
 }
 if(_object.hasClass('graph-widget')){
     return {type :  'graph',id : _object.attr('data-graph_id')};
 }
 if(_object.hasClass('text-widget')){
     return {type :  'text',id : _object.attr('data-text_id')};
 }
}

function savePlan(_refreshDisplay) {
    if (editOption.state) {
        var parent = {
            height: $('.div_displayObject').height(),
            width: $('.div_displayObject').width(),
        };
        var plans = [];
        $('.eqLogic-widget,.div_displayObject > .cmd-widget,.scenario-widget,.plan-link-widget,.view-link-widget,.graph-widget').each(function () {
            var info = getObjectInfo($(this));
            var plan = {};
            plan.position = {};
            plan.display = {};
            plan.link_type = info.type;
            plan.link_id = info.id;
            plan.planHeader_id = planHeader_id;
            plan.display.height = $(this).outerHeight() / $(this).attr('data-zoom');
            plan.display.width = $(this).outerWidth() / $(this).attr('data-zoom');
            var position = $(this).position();
            plan.position.top = (((position.top)) / parent.height) * 100;
            plan.position.left = (((position.left)) / parent.width) * 100;
            plans.push(plan);
        });
        jeedom.plan.save({
            plans: plans,
            error: function (error) {
                $('#div_alert').showAlert({message: error.message, level: 'danger'});
            },
            success: function () {
                if (init(_refreshDisplay, false)) {
                    displayPlan();
                }
            },
        });
    }
}

function displayObject(_type, _id, _html, _plan, _noRender) {
    _plan = init(_plan, {});
    _plan.position = init(_plan.position, {});
    _plan.css = init(_plan.css, {});
    var defaultZoom = 1;
    if (_type == 'eqLogic') {
        defaultZoom = 0.65;
        $('.div_displayObject .eqLogic-widget[data-eqLogic_id=' + _id + ']').remove();
    }
    if (_type == 'scenario') {
        $('.div_displayObject .scenario-widget[data-scenario_id=' + _id + ']').remove();
    }
    if (_type == 'view') {
        $('.div_displayObject .view-link-widget[data-link_id=' + _id + ']').remove();
    }
    if (_type == 'plan') {
        $('.div_displayObject .plan-link-widget[data-link_id=' + _id + ']').remove();
    }
    if (_type == 'cmd') {
        $('.div_displayObject > .cmd-widget[data-cmd_id=' + _id + ']').remove();
    }
    if (_type == 'graph') {
        for (var i in jeedom.history.chart) {
            delete jeedom.history.chart[i];
        }
        $('.div_displayObject .graph-widget[data-graph_id=' + _id + ']').remove();
    }
    if (_type == 'text') {
        $('.div_displayObject .text-widget[data-text_id=' + _id + ']').remove();
    }
    var parent = {
        height: $('.div_displayObject').height(),
        width: $('.div_displayObject').width(),
    };
    var html = $(_html);

    html.addClass('jeedomAlreadyPosition');
    html.css('z-index', 1000);

    if (_type == 'text' || _type == 'graph' || _type == 'plan' || _type == 'view') {
       if (!isset(_plan.display) || !isset(_plan.display['background-defaut']) || _plan.display['background-defaut'] != 1) {
        if (isset(_plan.display) && isset(_plan.display['background-transparent']) && _plan.display['background-transparent'] == 1) {
            html.css('border-radius', '0px'); 
            html.css('box-shadow', 'none'); 
        }
    }
}
for (var key in _plan.css) {
    if (_plan.css[key] != '' && key != 'zoom' && key != 'color' && key != 'rotate' && key != 'background-color') {
        html.css(key, _plan.css[key]);
        continue;
    }
    if (_type == 'text' || _type == 'graph' || _type == 'plan' || _type == 'view') {
        if (key == 'background-color' && (!isset(_plan.display) || !isset(_plan.display['background-defaut']) || _plan.display['background-defaut'] != 1)) {
            html.css(key, _plan.css[key]);
            continue;
        }
        if (key == 'color' && (!isset(_plan.display) || !isset(_plan.display['color-defaut']) || _plan.display['color-defaut'] != 1)) {
            html.find('.btn.btn-default').css("cssText", key + ': ' + _plan.css[key] + ' !important;border-color : ' + _plan.css[key] + ' !important');
            html.find('tspan').css('fill', _plan.css[key]);
            html.find('span').css(key, _plan.css[key]);
            html.css(key, _plan.css[key]);
        }
    }
}

if (_type == 'text' || _type == 'graph' || _type == 'plan' || _type == 'view') {
    if (!isset(_plan.display) || !isset(_plan.display['background-defaut']) || _plan.display['background-defaut'] != 1) {
        if (isset(_plan.display) && isset(_plan.display['background-transparent']) && _plan.display['background-transparent'] == 1) {
            html.css('background-color', 'transparent');
            html.find('.cmd').each(function () {
                $(this).css('background-color', 'transparent');
            });
        }
    }
}

html.css('position', 'absolute');
html.css('top',  init(_plan.position.top, '10') * parent.height / 100);
html.css('left', init(_plan.position.left, '10') * parent.width / 100);
html.css('transform-origin', '0 0');
html.css('transform', 'scale(' + init(_plan.css.zoom, defaultZoom) + ')');
html.css('-webkit-transform-origin', '0 0');
html.css('-webkit-transform', 'scale(' + init(_plan.css.zoom, defaultZoom) + ')');
html.css('-moz-transform-origin', '0 0');
html.css('-moz-transform', 'scale(' + init(_plan.css.zoom, defaultZoom) + ')');
html.attr('data-zoom',init(_plan.css.zoom, defaultZoom));

html.addClass('noResize');
if (isset(_plan.display) && isset(_plan.display.width)) {
    html.css('width', init(_plan.display.width, 50));
}
if (isset(_plan.display) && isset(_plan.display.height)) {
    html.css('height', init(_plan.display.height, 50));
}
if (_type == 'scenario' && isset(_plan.display) && (isset(_plan.display.hideCmd) && _plan.display.hideCmd == 1)) {
    html.find('.changeScenarioState').remove();
}
if (init(_noRender, false)) {
 return html;
}
$('.div_displayObject').append(html);
initEditOption(editOption.state);
}

/***************************EqLogic**************************************/
function addEqLogic(_id, _plan) {
    jeedom.eqLogic.toHtml({
        id: _id,
        version: 'dplan',
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (data) {
            displayObject('eqLogic', _id, data.html, _plan);
            savePlan();
        }
    })
}

function addCmd(_id, _plan) {
    jeedom.cmd.toHtml({
        id: _id,
        version: 'dplan',
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (data) {
            displayObject('cmd', _id, data.html, _plan);
            savePlan();
        }
    })
}

/***************************Scenario**************************************/
function addScenario(_id, _plan) {
    jeedom.scenario.toHtml({
        id: _id,
        version: 'dplan',
        error: function (error) {
            $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (data) {
            displayObject('scenario', _id, data, _plan);
            savePlan();
        }
    })
}

/**********************************GRAPH************************************/
function addGraph(_plan) {
    var parent = {
        height: $('.div_displayObject').height(),
        width: $('.div_displayObject').width(),
    };
    _plan = init(_plan, {});
    _plan.display = init(_plan.display, {});
    _plan.link_id = init(_plan.link_id, Math.round(Math.random() * 99999999) + 9999);
    var options = init(_plan.display.graph, '[]');
    var background_color = 'background-color : white;';
    if(init(_plan.display.transparentBackground, false) == '1'){
        background_color = '';
    }
    var html = '<div class="graph-widget" data-graph_id="' + _plan.link_id + '" style="'+background_color+'border : solid 1px black;min-height:50px;min-width:50px;">';
    if (editOption.state) {
        html += '<i class="fa fa-cogs cursor pull-right editOption.state configureGraph" style="margin-right : 5px;margin-top : 5px;"></i>';
    } else {
        html += '<i class="fa fa-cogs cursor pull-right editOption.state configureGraph" style="margin-right : 5px;margin-top : 5px;display:none;"></i>';
    }
    html += '<span class="graphOptions" style="display:none;">' + json_encode(init(_plan.display.graph, '[]')) + '</span>';
    html += '<div class="graph" id="graph' + _plan.link_id + '" style="width : 100%;height : 100%;"></div>';
    html += '</div>';
    displayObject('graph', _plan.link_id, html, _plan);

    for (var i in options) {
        if (init(options[i].link_id) != '') {
            jeedom.history.drawChart({
                cmd_id: options[i].link_id,
                el: 'graph' + _plan.link_id,
                showLegend: init(_plan.display.showLegend, true),
                showTimeSelector: init(_plan.display.showTimeSelector, false),
                showScrollbar: init(_plan.display.showScrollbar, true),
                dateRange: init(_plan.display.dateRange, '7 days'),
                option: init(options[i].configuration, {}),
                transparentBackground : init(_plan.display.transparentBackground, false),
                showNavigator : init(_plan.display.showNavigator, true),
                enableExport : false,
                global: false,
            });
        }
    }
}

$('.div_displayObject').delegate('.graph-widget', 'resize', function () {
    if (isset(jeedom.history.chart['graph' + $(this).attr('data-graph_id')])) {
        jeedom.history.chart['graph' + $(this).attr('data-graph_id')].chart.reflow();
    }
});
/**********************************LINK************************************/
$('#md_selectLink .linkType').on('change', function () {
    $('#md_selectLink .linkOption').hide();
    $('#md_selectLink .link' + $(this).value()).show();
});

$('#md_selectLink .validate').on('click', function () {
    var link = {};
    link.type = $('#md_selectLink .linkType').value();
    link.id = $('#md_selectLink .link' + link.type + ' .linkId').value();
    link.name = $('#md_selectLink .link' + link.type + ' .linkId option:selected').text();
    $('#md_selectLink').modal('hide');
    addLink(link);
});

function addLink(_link, _plan) {
    _plan = init(_plan, {});
    _plan.css = init(_plan.css, {});
    var link = '';
    var label = '';
    if (_link.type == 'plan') {
        label = 'label-success';
    }
    if (_link.type == 'view') {
        link = 'index.php?v=d&p=view&view_id=' + _link.id;
        label = 'label-primary';
    }
    var html = '<span class="cursor ' + _link.type + '-link-widget label ' + label + '" data-link_id="' + _link.id + '" >';
    html += '<a href="' + link + '" style="color:' + init(_plan.css.color, 'white') + ';text-decoration:none;font-size : 1.5em;">';
    html += _link.name;
    html += '</a>';
    html += '</span>';
    displayObject(_link.type, _link.id, html, _plan);
    savePlan();
}

/*********************************TEXTE*************************************/
function addText(_plan) {
    _plan = init(_plan, {});
    _plan.css = init(_plan.css, {});
    _plan.link_id = init(_plan.link_id, Math.round(Math.random() * 99999999) + 9999);
    var html = '<div class="text-widget" data-text_id="' + _plan.link_id + '">';
    html += _plan.display.text;
    html += '</div>';
    displayObject('text', _plan.link_id, html, _plan);
}
