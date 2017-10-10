frappe.ui.form.Control.prototype.__original_refresh = frappe.ui.form.Control.prototype.refresh;

frappe.ui.form.Control.prototype.refresh = function(){
    frappe.ui.form.Control.prototype.__original_refresh.apply(this);
    var options = this.df.options,
        value = this.get_value();

    if (!value
        || !frappe.user.has_role('Translator')
        || !in_list( ['Data', 'Select', 'Text', 'Small Text', 'Text Editor'], this.df.fieldtype )) return;

    if (!$('.clearfix .btn-open', this.$wrapper).length){
        var me = this, 
            translated = (this.doc && this.doc.__onload && this.doc.__onload.translations && this.doc.__onload.translations[value]);
        $(format('<a class="btn-open no-decoration text-muted" title="{0}">\
            <i class="fa fa-globe {1}"></i></a>', [__("Open Translation"), (translated) ? "text-warning": ""])
        ).appendTo(this.$wrapper.find('.clearfix'));
        this.$wrapper.find('.btn-open').on('click', function(){
            if (!me.doc.__islocal){
                new frappe.ui.form.TranslationEditor({
                    df: me.df,
                    source_language: frappe.defaults.get_user_default("language"),
                    source_text: me.get_value(),
                    target_language: me.doc.language,
                    doc: me.doc
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
            {label: __('Languages'), fieldtype: 'Section Break'},
            {label: __('Source'), fieldname: 'source_language', fieldtype: 'Select', options: frappe.get_languages(), default: this.source_language, reqd: 1 },
            {fieldtype: 'Column Break'},
            {label: __('Target'), fieldname: 'target_language', fieldtype: 'Select', options: frappe.get_languages(), reqd: 1, default: this.target_language},
            {label: __('Translation'), fieldtype: 'Section Break'},
            {label: __('Source'), fieldname: 'source_text', fieldtype: 'Small Text', reqd: 1, default: this.source_text, options: 'No Translate'},
            {fieldtype: 'Column Break'},
            {label: __('Translation'), fieldname: 'target_text', fieldtype: 'Small Text', reqd: 1, options: 'No Translate'},
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

        me.dialog.fields_dict.translations.refresh();

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
                me.dialog.fields_dict.translations.$wrapper
            );
        var tbody = me.dialog.fields_dict.translations.$wrapper.find('tbody');
        for (var term in terms){
            for ( var lang in terms[term] ){
                $(format(
                    '<tr data-name="{0}"><td>{1}</td><td>{2}</td><td>{3}</td></tr>',
                    [ terms[term][lang]['name'], term, lang, terms[term][lang]['target_name'] ]
                )).appendTo(tbody);
            }
        }

    },
    translate_action: function(){
        debugger;
        var args = this.dialog.get_values(), me = this;
        if (args.source_language === args.target_language){
            frappe.msgprint(format(__("Nothing to translate from {0} to {1}"), 
            [args.source_language, args.target_language]));
            return;
        }
        frappe.call({
            'method': 'frappe.client.insert',
            'args': {
                "doc": {
                    'doctype': 'Translation',
                    'language': args.target_language,
                    'source_name': args.source_text,
                    'target_name': args.target_text
                }
            },
            callback: function(res){
                if (!res.exc){
                    me.dialog.hide();
                    frappe.msgprint(__('Translation Added Successfull!'));
                    cur_frm.reload_doc();
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
