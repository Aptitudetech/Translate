# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "translate"
app_title = "Translate"
app_publisher = "aptitudetech.net"
app_description = "Content Translation at Field Level"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@aptitudetech.net"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/translate/css/translate.css"
app_include_js = "/assets/translate/js/translate.js"

# include js, css files in header of web template
# web_include_css = "/assets/translate/css/translate.css"
# web_include_js = "/assets/translate/js/translate.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "translate.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "translate.install.before_install"
# after_install = "translate.install.after_install"

after_install = "translate.events.on_app_after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "translate.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"*": {
        "onload": [
            "translate.events.on_document_onload"
        ]
	}
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"translate.tasks.all"
# 	],
# 	"daily": [
# 		"translate.tasks.daily"
# 	],
# 	"hourly": [
# 		"translate.tasks.hourly"
# 	],
# 	"weekly": [
# 		"translate.tasks.weekly"
# 	]
# 	"monthly": [
# 		"translate.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "translate.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "translate.event.get_events"
# }

