from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.list_users_items),
    path('insert_user/', views.insert_user_item),
    path('export/', views.export)
]