from flask import Blueprint, render_template
from emcs_admin_utils import jsplasma

navigator = Blueprint('navigator', __name__,
                       static_folder = 'static',
                       template_folder = 'templates')

@navigator.route('/')
def base():
    return render_template('nav.html', jsplasma = jsplasma)
