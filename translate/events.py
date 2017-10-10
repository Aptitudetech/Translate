#-*- coding: utf-8 -*-

from __future__ import unicode_literals

import frappe

def get_translations( d ):
    '''Fetch all available translations from the database based on the active document'''
    ret = {}
    for value in d.values():
        if isinstance( d, list ):
            for c in value:
                if isinstance( c, dict ):
                    ret.update( get_translations( c ) )
        if isinstance( value, basestring ):
            if frappe.db.exists( 'Translation', {'source_name': value} ):
                ret[value] = {}
                for translation in frappe.get_all( 'Translation', ['*'], {'source_name': value} ):
                    ret[value][translation.language] = translation
    return ret


def on_document_onload(doc, handler=None):
    if not doc.get('__islocal'):
        doc.get('__onload').translations = get_translations( doc.as_dict() )


def on_app_after_install():
    if not frappe.db.exists('Role', 'Translator'):
        doc = frappe.new_doc('Translator').update({
            'role_name': 'Translator',
            'desk_access': 1
        })
        doc.flags.ignore_permissions = True
        doc.insert()


def enable_translations(lang):
    frappe.db.enable_translations(lang)


def disable_translations():
    frappe.db.disable_translations()

def get_language_from_doctype( doc ):
    from frappe.model.meta import get_meta

    meta = frappe.get_meta(doc.doctype)
    if meta.has_field('language'):
        return frappe.db.get_value(doctype, docname, 'language')

    link_fields = meta.get_link_fields()
    for dt in ('Customer', 'Supplier', 'Company'):
        for field in link_fields:
            if meta.get_options(field.field_type) == dt:
                pmeta = get_meta(dt)
                if dt == 'Company':
                    fieldname = "default_language"
                else:
                    fieldname = "language"
                if pmeta.has_field(fieldname):
                    lang = frappe.db.get_value(dt, doc.get(frappe.scrub(dt)), fieldname)
                    if lang:
                        return lang


def before_template_render(context, template, is_path=False):
    if context.doc:
        doc = context.doc
    elif context.get('doctype') and context.get('docname'):
        doc = frappe.get_doc(context.doctype, context.docname)
    else:
        return

    lang = get_language_from_doctype( doc )
    if lang:
        frappe.db.enable_translations(lang)


def after_template_render(context, template, is_path=False):
    frappe.db.disable_translations()