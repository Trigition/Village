# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader

# Create your views here.
def index(request):
    template = loader.get_template('Welcomer/index.html')
    context = {}
    return HttpResponse(template.render(context, request))
