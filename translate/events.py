#-*- coding: utf-8 -*-

from __future__ import unicode_literals

import frappe

def get_translations( d ):
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
