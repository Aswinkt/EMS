from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    ChangePasswordView,
    FormStructureView,
    EmployeeCreateView,
    EmployeeListView,
    DynamicFormListView,
    DynamicFormFieldListView,
    DynamicFormCreateWithFieldsView,
    EmployeeRetrieveUpdateDestroyView,
    EmployeeDetailView,
)

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth_register"),
    path("auth/login/", LoginView.as_view(), name="auth_login"),
    path("auth/profile/", ProfileView.as_view(), name="auth_profile"),
    path(
        "auth/change-password/",
        ChangePasswordView.as_view(),
        name="auth_change_password",
    ),
    path("form-structure/", FormStructureView.as_view(), name="form_structure"),
    path("employees/", EmployeeListView.as_view(), name="employee_list"),
    path("employees/create/", EmployeeCreateView.as_view(), name="employee_create"),
    path(
        "employees/<int:pk>/",
        EmployeeRetrieveUpdateDestroyView.as_view(),
        name="employee_detail",
    ),
    path(
        "employees/<int:pk>/details/",
        EmployeeDetailView.as_view(),
        name="employee_detail",
    ),
    path("forms/", DynamicFormListView.as_view(), name="form_list"),
    path(
        "forms/<int:form_id>/fields/",
        DynamicFormFieldListView.as_view(),
        name="form_fields",
    ),
    path(
        "forms/create_with_fields/",
        DynamicFormCreateWithFieldsView.as_view(),
        name="form_create_with_fields",
    ),
]
