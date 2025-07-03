from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class BaseInfoModel(models.Model):
    """
    Base fields for all model
    """
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_created",
        null=True,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_updated",
        null=True,
    )
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    modified_date = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True


class User(AbstractUser, BaseInfoModel):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, blank=True)
    full_name = models.CharField(max_length=65, blank=True, null=True)


    def save(self, *args, **kwargs):
        self.full_name = f"{self.first_name.strip()} {self.last_name.strip()}"
        super().save(*args, **kwargs)


class DynamicForm(BaseInfoModel):
    name = models.CharField(max_length=100)


class DynamicFormField(BaseInfoModel):
    form = models.ForeignKey(
        DynamicForm, 
        related_name="%(app_label)s_%(class)s_fields", 
        on_delete=models.CASCADE
    )
    label = models.CharField(max_length=100)
    field_type = models.CharField(max_length=50)
    is_required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)


class UserFieldValue(BaseInfoModel):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="field_values"
    )
    field = models.ForeignKey(DynamicFormField, on_delete=models.CASCADE)
    value = models.TextField(blank=True, null=True)


class Employee(BaseInfoModel):
    form = models.ForeignKey('DynamicForm', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class EmployeeFieldValue(BaseInfoModel):
    employee = models.ForeignKey(Employee, related_name='field_values', on_delete=models.CASCADE)
    field = models.ForeignKey('DynamicFormField', on_delete=models.CASCADE)
    value = models.TextField()




    