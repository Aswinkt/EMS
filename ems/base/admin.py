# from django.contrib import admin
# from .models import User, DropDown, DynamicFormField, UserFieldValue

# Register your models here.

# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('username', 'email', 'full_name', 'is_employee', 'department', 'designation')
#     search_fields = ('username', 'email', 'first_name', 'last_name', 'full_name')

# @admin.register(DropDown)
# class DropDownAdmin(admin.ModelAdmin):
#     list_display = ('field_name', 'value', 'order')
#     search_fields = ('field_name', 'value')

# @admin.register(DynamicFormField)
# class DynamicFormFieldAdmin(admin.ModelAdmin):
#     list_display = ('label', 'field_type', 'order', 'is_required', 'dropdown')
#     search_fields = ('label',)

# @admin.register(UserFieldValue)
# class UserFieldValueAdmin(admin.ModelAdmin):
#     list_display = ('user', 'field', 'value')
#     search_fields = ('user__username', 'field__label', 'value')
