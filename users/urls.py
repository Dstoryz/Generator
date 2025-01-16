# users/urls.py

from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, UserStatsView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile'),
    path('users/stats/', UserStatsView.as_view(), name='user-stats'),
]
