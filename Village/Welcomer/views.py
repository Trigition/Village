# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.contrib.gis.geoip2 import GeoIP2

# Create your views here.
def index(request):
    # obtain user ip
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
    print ip
    template = loader.get_template('Welcomer/index.html')
    context = {}
    return HttpResponse(template.render(context, request))
