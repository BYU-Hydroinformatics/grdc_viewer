from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import Button, SelectInput, RangeSlider, TextInput, PlotlyView
from .app import GrdcViewer as app
import requests
import os
import csv
import numpy as np
import pandas as pd
import datetime as dt
import plotly.graph_objs as go
from csv import writer as csv_writer

#@login_required()
def home(request):
    """
    Controller for the app home page.
    """


    context = {
    }

    return render(request, 'grdc_viewer/home.html')


def region_map(request):
    """
    Controller for the app home page.
    """
    app_workspace = app.get_app_workspace()
    dirs = next(os.walk(app_workspace.path))[1]

    continents = []

    for entry in dirs:
        continent = (entry.replace("_", " "), entry)
        continents.append(continent)

        continents = sorted(continents, key=lambda tup: (tup[0], tup[1]))

    # Add selection option
    continents.insert(0, ("", ""))

    select_continent = SelectInput(display_text='Select Continent',
                                name='select_continent',
                                multiple=False,
                                options=continents,
                                initial='',
                                attributes={
                                    'onchange': 'list_country()'
                                }
    )

    select_country = SelectInput(display_text='Select Country',
                                 name='select_country',
                                 multiple=False,
                                 options=[['',999]],
                                 initial='Select a Country',
                                 attributes={
                                     'onchange': 'showCountry()'
                                 }
    )

    context = {
        'select_continent':select_continent,
        'select_country': select_country
    }

    return render(request, 'grdc_viewer/region_map.html', context)

def get_continent(request):
    return_obj = {
        'success': False
    }

    # Check if its an ajax post request
    if request.is_ajax() and request.method == 'GET':
        return_obj['success'] = True
        continent=request.GET.get('continent')
        app_workspace = app.get_app_workspace()
        dirs = next(os.walk(app_workspace.path + '/' + continent))[1]

        countries = []

        for entry in dirs:
            country = (entry.replace("_", " "), entry)
            countries.append(country)

        countries = sorted(countries, key=lambda tup: (tup[0], tup[1]))

        return_obj['countrylist']=countries

    return JsonResponse(return_obj)

def get_dailyData(request):
    """
    Get data for stations
    """

    get_data = request.GET

    try:
        codEstacion = get_data['stationcode']
        nomEstacion = get_data['stationname']
        nomCountry = get_data['countryname']
        nomRiver = get_data['stream']

        dir_base = os.path.dirname(__file__)
        url = os.path.join(dir_base, 'public/Data', codEstacion + '-DAILY.csv')
        print(url)

        '''
        with open(url) as csvfile:
            readCSV = csv.reader(csvfile, delimiter=',')
            readCSV.next()
            datesDischarge = []
            dataDischarge = []
            for row in readCSV:
                da = row[0]
                year = int(da[0:4])
                month = int(da[5:7])
                day = int(da[8:10])
                dat = row[1]
                dat = float(dat)
                if dat < 0:
                    dat = np.nan
                dat = str(dat)
                datesDischarge.append(dt.datetime(year, month, day))
                dataDischarge.append(dat)
        '''

        df = pd.read_csv(url, index_col=0)
        df.index = pd.to_datetime(df.index)
        df = df[df.iloc[:, 0] >= 0]

        datesDischarge = df.index.tolist()
        dataDischarge = df.iloc[:, 0].values

        observed_Q = go.Scatter(
            x=datesDischarge,
            y=dataDischarge,
            name='Observed Discharge',
        )

        layout = go.Layout(title='Daily Streamflow at {0} - {1} <br> {2} RIVER <br> {3}'.format(nomEstacion, codEstacion, nomRiver, nomCountry),
                       xaxis=dict(title='Dates', ), yaxis=dict(title='Discharge (m<sup>3</sup>/s)',
                                                               autorange=True), showlegend=False)

        chart_obj = PlotlyView(go.Figure(data=[observed_Q], layout=layout))

        context = {
            'gizmo_object': chart_obj,
        }

        return render(request, 'grdc_viewer/gizmo_ajax.html', context)

    except Exception as e:
        print (str(e))
        return JsonResponse({'error': 'No observed data found for the selected station.'})


def get_monthlyData(request):
    """
    Get data for stations
    """

    get_data = request.GET

    try:
        codEstacion = get_data['stationcode']
        nomEstacion = get_data['stationname']
        nomCountry = get_data['countryname']
        nomRiver = get_data['stream']

        dir_base = os.path.dirname(__file__)
        url = os.path.join(dir_base, 'public/Data', codEstacion + '-MONTHLY.csv')

        '''
        with open(url) as csvfile:
            readCSV = csv.reader(csvfile, delimiter=',')
            readCSV.next()
            datesDischarge = []
            dataDischarge = []
            for row in readCSV:
                da = row[0]
                year = int(da[0:4])
                month = int(da[5:7])
                day = int(da[8:10])
                dat = row[1]
                dat = float(dat)
                if dat < 0:
                    dat = np.nan
                dat = str(dat)
                datesDischarge.append(dt.datetime(year, month, day))
                dataDischarge.append(dat)
        '''

        df = pd.read_csv(url, index_col=0)
        df.index = pd.to_datetime(df.index)
        df = df[df.iloc[:, 0] >= 0]

        datesDischarge = df.index.tolist()
        dataDischarge = df.iloc[:, 0].values

        observed_Q = go.Scatter(
            x=datesDischarge,
            y=dataDischarge,
            name='Observed Discharge',
        )

        observed_Q = go.Scatter(
            x=datesDischarge,
            y=dataDischarge,
            name='Observed Discharge',
        )

        layout = go.Layout(title='Monthly Streamflow at {0} - {1} <br> {2} RIVER <br> {3}'.format(nomEstacion, codEstacion, nomRiver, nomCountry),
                       xaxis=dict(title='Dates', ), yaxis=dict(title='Discharge (m<sup>3</sup>/s)',
                                                               autorange=True), showlegend=False)

        chart_obj = PlotlyView(go.Figure(data=[observed_Q], layout=layout))

        context = {
            'gizmo_object': chart_obj,
        }

        return render(request, 'grdc_viewer/gizmo_ajax.html', context)

    except Exception as e:
        print (str(e))
        return JsonResponse({'error': 'No observed data found for the selected station.'})

def download_dailyData(request):
    """
    Get data for stations
    """

    get_data = request.GET

    try:
        codEstacion = get_data['stationcode']
        nomEstacion = get_data['stationname']
        nomCountry = get_data['countryname']

        dir_base = os.path.dirname(__file__)
        url = os.path.join(dir_base, 'public/Data', codEstacion + '-DAILY.csv')

        '''
        with open(url) as csvfile:
            readCSV = csv.reader(csvfile, delimiter=',')
            readCSV.next()
            datesDischarge = []
            dataDischarge = []
            for row in readCSV:
                da = row[0]
                year = int(da[0:4])
                month = int(da[5:7])
                day = int(da[8:10])
                dat = row[1]
                dat = float(dat)
                if dat < 0:
                    dat = np.nan
                dat = str(dat)
                datesDischarge.append(dt.datetime(year, month, day))
                dataDischarge.append(dat)
        '''

        df = pd.read_csv(url, index_col=0)
        df.index = pd.to_datetime(df.index)
        df = df[df.iloc[:, 0] >= 0]

        datesDischarge = df.index.tolist()
        dataDischarge = df.iloc[:, 0].values

        pairs = [list(a) for a in zip(datesDischarge, dataDischarge)]

        response = HttpResponse(content_type='text/csv')

        response['Content-Disposition'] = 'attachment; filename=daily_data_{0}-{1}-{2}.csv'.format(nomEstacion, codEstacion, nomCountry)

        writer = csv_writer(response)

        writer.writerow(['datetime', 'streamflow (m3/s)'])

        for row_data in pairs:
            writer.writerow(row_data)

        return response

    except Exception as e:
        print (str(e))
        return JsonResponse({'error': 'No observed data found for the selected station.'})


def download_monthlyData(request):
    """
    Get data for stations
    """

    get_data = request.GET

    try:
        codEstacion = get_data['stationcode']
        nomEstacion = get_data['stationname']
        nomCountry = get_data['countryname']

        dir_base = os.path.dirname(__file__)
        url = os.path.join(dir_base, 'public/Data', codEstacion + '-MONTHLY.csv')

        '''
        with open(url) as csvfile:
            readCSV = csv.reader(csvfile, delimiter=',')
            readCSV.next()
            datesDischarge = []
            dataDischarge = []
            for row in readCSV:
                da = row[0]
                year = int(da[0:4])
                month = int(da[5:7])
                day = int(da[8:10])
                dat = row[1]
                dat = float(dat)
                if dat < 0:
                    dat = np.nan
                dat = str(dat)
                datesDischarge.append(dt.datetime(year, month, day))
                dataDischarge.append(dat)
        '''

        df = pd.read_csv(url, index_col=0)
        df.index = pd.to_datetime(df.index)
        df = df[df.iloc[:, 0] >= 0]

        datesDischarge = df.index.tolist()
        dataDischarge = df.iloc[:, 0].values

        pairs = [list(a) for a in zip(datesDischarge, dataDischarge)]

        response = HttpResponse(content_type='text/csv')

        response['Content-Disposition'] = 'attachment; filename=monthly_data_{0}-{1}-{2}.csv'.format(nomEstacion, codEstacion, nomCountry)

        writer = csv_writer(response)

        writer.writerow(['datetime', 'streamflow (m3/s)'])

        for row_data in pairs:
            writer.writerow(row_data)

        return response

    except Exception as e:
        print (str(e))
        return JsonResponse({'error': 'No observed data found for the selected station.'})

def about(request):
    """
    Controller for the app home page.
    """


    context = {
    }

    return render(request, 'grdc_viewer/about.html')