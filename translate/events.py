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