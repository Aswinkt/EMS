from rest_framework import serializers
from base.models import (
    User,
    DynamicFormField,
    UserFieldValue,
    DynamicForm,
    Employee,
    EmployeeFieldValue,
)


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    full_name = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class DynamicFormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicFormField
        fields = "__all__"


class UserFieldValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFieldValue
        fields = "__all__"


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class EmployeeCreateSerializer(serializers.Serializer):
    pass


class DynamicFormSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.full_name", read_only=True)

    class Meta:
        model = DynamicForm
        fields = ["id", "name", "created_by"]


class EmployeeFieldValueSerializer(serializers.ModelSerializer):
    field_label = serializers.CharField(source="field.label", read_only=True)

    class Meta:
        model = EmployeeFieldValue
        fields = ["field_label", "value"]


class EmployeeSerializer(serializers.ModelSerializer):
    field_values = EmployeeFieldValueSerializer(many=True, read_only=True)

    class Meta:
        model = Employee
        fields = ["id", "form", "created_at", "field_values"]
