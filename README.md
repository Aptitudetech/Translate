# Multilingual Enhancement

## Introduction

In countries where multiple languages are used, it is often a requirement to be able to communicate in the language of a customer or supplier.  With this requirement in mind, and knowing that ERPNext already had the basis needed to achieve this, the challenge was to develop a tool that would cover as much as possible, but wihtout needing too much modifications to the core system.

### Description

This modification add content translation at the field Level for the following type of fields:
* Data
* Text
* Small Text
* Text Editor
* Select

For example, it enables translation of "Item Name" and "Description" of an Item.  Also, and equally important, translation of Standard Reply, Blog and Web Pages is supported .  All translations are stored in the Translation DocType of ERPNext.  The accessibility of this feature is controlled by a Role named Translator.  Only users with this role can access and modify translations.
The modification also add the possibility to enable / disable languages within ERPNext.  This help to narrow the choice of translations offered to users to only those who are needed within the context of the company.
By nature, translations cannot be accessed within a dialog window.

### Usage

First thing to do is to enable only the languages needed by external communications in the Language DocType.

(note to ERPNExt team: Company language should be enabled by default when deploying this feature)
Then assign the "Translator" role to concerned users.

Translations can be accessed by a small "earth" icon which can be found on the right of the label of every translatable field.  There must be some text inside the field for the icon to appear.  The icon will be grey if no translation exist and orange otherwise.
Inside the Translation dialog, the source text is displayed along with enabled languages, each on a separate collapsible section.  Inside the collapsible section there is a text field in which the translated text must be entered.  Translations are saved when the "Translate" button is pressed.

#### Licence

MIT
