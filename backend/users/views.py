from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from .models import User
from django.utils.html import escape
from django.core import serializers
import csv
import json
import datetime

def list_users_items(request):
    selectedCity = request.GET.get('city', None)
    startDateOfBirth = request.GET.get('startDateOfBirth', None)
    endDateOfBirth = request.GET.get('endDateOfBirth', None)
    data = filterByQuery(request)
    res = serializers.serialize('json', data)
    return HttpResponse(res, content_type='application/json')


def filterByQuery(request):
    selectedCity = request.GET.get('city', None)
    startDateOfBirth = request.GET.get('startDateOfBirth', None)
    endDateOfBirth = request.GET.get('endDateOfBirth', None)
    data = User.objects.all()

    if(selectedCity):
        data = data.filter(city=selectedCity)

    if(startDateOfBirth):
        data = data.filter(dateOfBirth__gte=startDateOfBirth)

    if(endDateOfBirth):
        data = data.filter(dateOfBirth__lte=endDateOfBirth)

    return data

def export(request):
    response = HttpResponse(content_type='text/csv')
    writer = csv.writer(response)
    writer.writerow(['ID', 'First Name', 'Last Name', 'Address', 'City', 'Phone', 'ZipCode', 'Date Of Birth', 'has Covid', 'Previous Conditions'])  

    selectedCity = request.GET.get('city', None)
    startDateOfBirth = request.GET.get('startDateOfBirth', None)
    endDateOfBirth = request.GET.get('endDateOfBirth', None)
    data = User.objects.all()

    if(selectedCity):
        data = data.filter(city=selectedCity)

    if(startDateOfBirth):
        data = data.filter(dateOfBirth__gte=startDateOfBirth)

    if(endDateOfBirth):
        data = data.filter(dateOfBirth__lte=endDateOfBirth)

    for user in data.values_list('id', 'firstName', 'lastName','address','city', 'cellularPhone' , 'zipCode', 'dateOfBirth', 'hasCovid',  'previousConditions'):
        writer.writerow(user)

    response['Content-Disposition'] = 'attachment; filename="users.csv"'
    return response


def insert_user_item(request: HttpRequest):
    data = json.loads(request.body.decode('utf-8'))
    print(data["dateOfBirth"])
    User.objects.create(
        firstName = data["firstName"],
        lastName = data["lastName"],
        address = data["address"],
        city = data["city"],
        previousConditions = data["previousConditions"],
        cellularPhone = data["cellularPhone"],
        zipCode = data["zipCode"],
        dateOfBirth = data["dateOfBirth"],
        hasCovid = data["hasCovid"]
    )
    return HttpResponse()
