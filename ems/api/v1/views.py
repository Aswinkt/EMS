from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db.models import Q
from base.models import User
from .serializers import (
    UserSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    DynamicFormFieldSerializer,
    DynamicFormSerializer,
    EmployeeSerializer,
    EmployeeFieldValueSerializer,
)
from base.messages import MESSAGES
import logging
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from base.models import (
    DynamicFormField,
    UserFieldValue,
    DynamicForm,
    Employee,
    EmployeeFieldValue,
)
from django.conf import settings

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    """API for user registration"""

    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response_data = {
            "status": "Failed",
            "message": MESSAGES.get("failed_to_register"),
        }
        status_code = status.HTTP_400_BAD_REQUEST
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                email=serializer.validated_data["email"],
                username=serializer.validated_data["username"],
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
                password=serializer.validated_data["password"],
            )
            refresh = RefreshToken.for_user(user)
            response_data = {
                "status": "Success",
                "message": MESSAGES.get("success_register"),
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            }
            status_code = status.HTTP_201_CREATED
        return Response(response_data, status=status_code)


class LoginView(generics.GenericAPIView):
    """API for user login"""

    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response_data = {"status": "Failed", "message": MESSAGES.get("failed_to_login")}
        status_code = status.HTTP_400_BAD_REQUEST
        try:
            logger.info(f"Login attempt with data: {request.data}")
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Serializer validation failed: {serializer.errors}")
                return Response(response_data, status=status_code)

            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]

            user = authenticate(username=username, password=password)

            if not user or not user.is_active:
                response_data["message"] = MESSAGES.get("invalid_credentials")
                return Response(response_data, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            response_data = {
                "status": "Success",
                "message": MESSAGES.get("login_success").format(user=user),
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            }
            status_code = status.HTTP_200_OK
            return Response(response_data, status=status_code)
        except Exception as exception:
            logger.exception(f"Login error: {str(exception)}")
            return Response(response_data, status=status_code)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": getattr(
                user, "full_name", f"{user.first_name} {user.last_name}"
            ),
        }
        return Response(data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data["old_password"]
            new_password = serializer.validated_data["new_password"]
            if not user.check_password(old_password):
                return Response(
                    {"status": "Failed", "message": MESSAGES.get("old_incorrect")},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.set_password(new_password)
            user.save()
            return Response(
                {"status": "Success", "message": MESSAGES.get("password_changed")},
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                "status": "Failed",
                "message": MESSAGES.get("invalid_data"),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class FormStructureView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        fields = DynamicFormField.objects.all().order_by("order")
        serializer = DynamicFormFieldSerializer(fields, many=True)
        return Response(serializer.data)

    def post(self, request):
        DynamicFormField.objects.all().delete()
        print(request.data)
        for i, field in enumerate(request.data):
            DynamicFormField.objects.create(
                label=field.get("label"),
                field_type=field.get("type"),
                is_required=field.get("required", False),
                order=i,
            )
        return Response(
            {"status": "Success", "message": MESSAGES.get("form_structure_saved")},
            status=status.HTTP_201_CREATED,
        )


class EmployeeCreateView(APIView):
    def post(self, request):
        form_id = request.data.get("form_id")
        form = DynamicForm.objects.get(id=form_id)
        employee = Employee.objects.create(form=form)
        for field in DynamicFormField.objects.filter(form=form):
            value = request.data.get(field.label)
            EmployeeFieldValue.objects.create(
                employee=employee, field=field, value=value
            )
        return Response(
            {"status": "Success", "message": MESSAGES.get("employee_created")},
            status=status.HTTP_201_CREATED,
        )


class EmployeeListView(APIView):
    def get(self, request):
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)


class DynamicFormListView(generics.ListCreateAPIView):
    queryset = DynamicForm.objects.all()
    serializer_class = DynamicFormSerializer


class DynamicFormFieldListView(APIView):
    def get(self, request, form_id):
        fields = DynamicFormField.objects.filter(form_id=form_id).order_by("order")
        serializer = DynamicFormFieldSerializer(fields, many=True)
        return Response(serializer.data)

    def post(self, request, form_id):
        form = DynamicForm.objects.get(id=form_id)
        # DynamicFormField.objects.filter(form=form).delete()
        for i, field in enumerate(request.data):
            DynamicFormField.objects.create(
                form=form,
                label=field.get("label"),
                field_type=field.get("type"),
                required=field.get("required", False),
                order=i,
                created_by=request.user,
            )
        return Response(
            {"status": "Success", "message": MESSAGES.get("fields_saved")},
            status=status.HTTP_201_CREATED,
        )


class DynamicFormCreateWithFieldsView(APIView):
    def post(self, request):
        form_name = request.data.get("name")
        fields = request.data.get("fields", [])
        if not form_name or not fields:
            return Response(
                {"error": MESSAGES.get("form_name_fields_required")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        form = DynamicForm.objects.create(name=form_name, created_by=request.user)
        for i, field in enumerate(fields):
            DynamicFormField.objects.create(
                form=form,
                label=field.get("label"),
                field_type=field.get("type"),
                is_required=field.get("required", False),
                order=i,
                created_by=request.user,
            )
        return Response(
            {"status": "Success", "form_id": form.id}, status=status.HTTP_201_CREATED
        )


class EmployeeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def update(self, request, *args, **kwargs):
        employee = self.get_object()
        # Update dynamic fields
        for fv in employee.field_values.all():
            new_value = request.data.get(fv.field.label)
            if new_value is not None:
                fv.value = new_value
                fv.save()
        return Response({"status": "Success", "message": MESSAGES.get("employee_updated")})


class EmployeeDetailView(APIView):
    def get(self, request, pk):
        search = request.query_params.get("q", "").lower()
        employee = Employee.objects.get(pk=pk)
        field_values = employee.field_values.all()
        if search:
            field_values = field_values.filter(
                Q(field__label__icontains=search) | Q(value__icontains=search)
            )
        serializer = EmployeeFieldValueSerializer(field_values, many=True)
        return Response(
            {
                "id": employee.id,
                "form": employee.form.id,
                "created_at": employee.created_at,
                "field_values": serializer.data,
            }
        )
