# SMARTScienceTools

This repo has the code that powers the data visualization on www.astro.yale.edu/smarts/glast/form.html

form.html is just a straight up html form you will see when you go to the above website. the user fills out this using their web browser, and submits the form using any of the buttons below

myscript2.js is a javascript file. this file has all the code that handles the animations in the page and the interactive plotting. it uses javascript libraries jquerry, jquerry ui, and d3.js

d3.js is the library that does the plotting, the others have handy functions for making calendars in javascript, making animations on the page, reading user input from the form, loading up json data from the yale webserver when requested by the user,  and so forth.

This was my first javascript project, so admittedly the code can probably be written and documented much better. however, I did my best to write function descriptions and use comments where I could to describe what I was doing.

style.css is a css file. it tells your web browser how to style the elements it renders when you visit this page and use any of the datavisualization tools

format.py is a python module that reads in the .tab photometry files that live in the webserver under /var/www/html/smarts/glast/tables and outputs them formatted as json, csv, or tsv files. the json formated versions are used by the data visualization.

exjsontab.py is a python program that imports format.py, keeps a python list of all the blazars, and when executed reads in each .tab photoemtry file in the list and outputs a json and tsv version. csv versions stopped working for some reason, it might have to do with an astropy update. one might simplify the code for format.py by using pandas dataframes.

format.sh is a shell script. it sets the path and then executes exjsontab.py. the crontab for the user yalo is configured to call format.sh everyday at 4:15, to ensure that the data on the group webpage is up to date

the rest of the crap doesn't really matter, I just put it there for the poster presentation I did for the HEAD meeting in Chicago


