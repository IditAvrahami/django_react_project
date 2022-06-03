from django.db import models
import uuid
# Create your models here.

class User(models.Model):
    firstName = models.TextField()
    lastName = models.TextField()
    address = models.TextField()
    city = models.TextField()
    previousConditions = models.TextField()
    cellularPhone = models.IntegerField()
    zipCode = models.IntegerField()
    dateOfBirth = models.DateField()
    hasCovid = models.BooleanField(default=False)