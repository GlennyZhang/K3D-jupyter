/* globals define, $ */

requirejs.config({
    paths: {
        'k3d': '../nbextensions/k3d_widget/lib/k3d'
    },
    shim: {
        'k3d/k3d.min': {
            deps: ['k3d/k3d.deps.min']
        },
        'k3d/providers/k3d.threejs.min': {
            deps: ['k3d/k3d.min', 'k3d/providers/k3d.threejs.deps.min']
        }
    }
});

define(['nbextensions/widgets/widgets/js/widget', 'k3d/providers/k3d.threejs.min'], function (widget) {

    return {
        K3DView: widget.DOMWidgetView.extend({
            render: function () {
                var container = $('<div />').css('position', 'relative'),
                    toolbar = $('<div class="toolbar" />').appendTo(container).css({
                        'position': 'absolute',
                        'right': 0
                    });

                this.parameters = this.model.get('parameters');
                this.container = container.css({'height': this.parameters.height}).appendTo(this.$el).get(0);
                this.on('displayed', this._init, this);
                this.model.on('change:object', this._add, this);
            },

            _init: function () {
                var renderer = new THREE.WebGLRenderer({
                    antialias: this.parameters.antialias,
                });

                this.K3D = K3D.Core(K3D.Providers.ThreeJS, this.container, {
                    renderer: renderer
                });

                renderer.setClearColor(this.parameters.backgroundColor);
            },

            _add: function () {
                K3D.Loader(this.K3D, {objects: [this.model.get('object')]});
            }
        })
    };
});