frappe.ui.form.Control.prototype.__original_refresh = frappe.ui.form.Control.prototype.refresh;

frappe.ui.form.Control.prototype.refresh = function(){
    frappe.ui.form.Control.prototype.__original_refresh.apply(this);
    var options = this.df.options,
        value = this.get_value();

    if (!value
        || !frappe.user.has_role('Translator')
        || !in_list( ['Data', 'Select', 'Text', 'Small Text', 'Text Editor'], this.df.fieldtype )) return;

    if (!$('.clearfix .btn-open', this.$wrapper).length){
        var me = this;
        $(format('<a class="btn-open no-decoration text-muted" title="{0}">\
            <i class="fa fa-globe"></i></a>', [__("Open Translation")])
        ).appendTo(this.$wrapper.find('.clearfix'));
        this.$wrapper.find('.btn-open').on('click', function(){
            if (!me.doc.__islocal){
                new frappe.ui.form.TranslationEditor({
                    df: me.df,
                    source_language: frappe.defaults.get_user_default("language"),
                    source_text: me.get_value(),
                    target_language: me.doc.language
                });
            }
        });
    }
};

frappe.ui.form.TranslationEditor = Class.extend({
    init: function(opts){
        $.extend(this, opts);
        this.make();
    },
    make: function(){
        var me = this;
        this.dialog = new frappe.ui.Dialog({
            title: (this.title || __("Translation")),
            no_submit_on_enter: true,
            fields: this.get_fields(),
            primary_action_label: __("Translate"),
            primary_action: function(){
                me.translate_action();
            }
        });

        this.prepare();
        this.dialog.show();
    },
    get_fields: function(){
        var fields = [
            {label: __('Source'), fieldtype: 'Section Break', collapsible: 1},
            {label: __('Language'), fieldname: 'source_language', fieldtype: 'Select', options: frappe.get_languages(), default: this.source_language, reqd: 1 },
            {fieldtype: 'Column Break'},
            {label: __('Source Text'), fieldname: 'source_text', fieldtype: 'Small Text', reqd: 1, default: this.source_text, options: 'No Translate'},
            {label: __('Translation'), fieldtype: 'Section Break'},
            {label: __('Language'), fieldname: 'target_language', fieldtype: 'Select', options: frappe.get_languages(), reqd: 1, default: this.target_language},
            {fieldtype: 'Column Break'},
            {label: __('Text'), fieldname: 'target_text', fieldtype: 'Small Text', reqd: 1, options: 'No Translate'},
            { label: __('Existing Translations'), fieldtype: 'Section Break' },
            { fieldtype: 'HTML', fieldname: 'translations' }
        ];
        return fields;
    },
    prepare: function(){
        var me = this,
            doc = this.doc,
            terms = (doc.__onload||{}).translations || {};
        ['source_language', 'source_text'].forEach(function(field){
            me.dialog.fields_dict[field].refresh();
            me.dialog.fields_dict[field].$input.attr('disabled', 'disabled');
        });

        $(format(
            '<table class="table table-condensed table-bordered">\
                <thead>\
                    <tr>\
                        <th>{0}</th>\
                        <th>{1}</th>\
                        <th>{2}</th>\
                    </tr>\
                </thead>\
                <tbody>\
                </tbody>\
            </table>', [ __('Term'), __('Language'), __('Translation') ])).appendTo(
                me.dialog.translations.$wrapper
            );

        

        for (var term in terms){
            
        }

    },
    translate_action: function(){
        var args = this.dialog.get_values(), me = this;
        frappe.call({
            'method': 'frappe.client.insert',
            'args': {
                'doctype': 'Translation',
                'language': args.target_language,
                'source_name': args.source_text,
                'target_name': args.target_text
            },
            callback: function(res){
                if (!res.exc){
                    me.dialog.hide();
                    frappe.msgprint(__('Translation Added Successfull!'));
                }
            }
        });
    },
});

frappe.ui.form.Toolbar = frappe.ui.form.Toolbar.extend({
    make_menu: function(){
        this._super();

        if (!this.frm.doc.__unsaved){
            this.page.add_menu_item(__("Translate"), function(){
                console.log('Translator Viewer goes here');
            });
        }
    }
})
