from flask import Flask, Response, abort, redirect, request, url_for, jsonify, session
from flask_cors import CORS

from pymongo import MongoClient
from flask_pymongo import PyMongo
import sys
import helper
import time
import re
from constant import Code, Status
from datetime import datetime


# config = configparser.ConfigParser()
# config.read(os.path.abspath(os.path.join(".ini")))

app = Flask(__name__)

app.config.update(DEBUG = True, SECRET_KEY="secret_sauce")
CORS(app, resources={r"/*": { "origins": "*"}})

connection_string = 'mongodb://yuweil:yuwei878@localhost:27017/access_denied?authSource=admin'

if len(sys.argv) == 2:
    connection_string = sys.argv[1]
    
print("connection_string = {}".format(connection_string))

client = MongoClient(connection_string)
db = client['access_denied']
app_session = {}

@app.route('/', methods=["GET", "POST"])
def homepage():
    if request.method == "POST":
        credentials = request.get_json()

        email = credentials.get('email')
        password = credentials.get('password')
        user_type = credentials.get('user_type')

        if user_type not in (helper.COMPANY, helper.PROF,helper.ADMIN):
            return jsonify({'code': str(Code.ERROR.value), 'message': f"user_type {user_type} not exist"})

        db_search = ('CompanyUser', 'ProfessionalUser', 'AdminUser')
        find_user = db[db_search[int(user_type) -1 ]].find_one({"email": email})

        if find_user == None:
            # error user
            return jsonify({'code': str(Code.ERROR.value), 'message': f"user {email} not exist"})
        
        if password == find_user['password']:
            token = helper.gen_token(password, email)
            app_session[find_user['uid']] = str(token)

            if find_user['user_type'] == helper.COMPANY:
                return jsonify({'log-in': True, 'message': 'Login successful', 'token': find_user['uid'], \
                                'user-type': helper.COMPANY, 'code': str(Code.SUCCESS.value)})
            elif find_user['user_type'] == helper.ADMIN:
                return jsonify({'log-in': True, 'message': 'Login successful', 'token': find_user['uid'], \
                                'user-type': helper.ADMIN, 'code': str(Code.SUCCESS.value)})
            else:
                return jsonify({'log-in': True, 'message': 'Login successful', 'token': find_user['uid'], \
                                'user-type': helper.PROF, 'code': str(Code.SUCCESS.value)})
        else:
            return jsonify({"code": str(Code.ERROR.value), 'log-in': False, 'error': 'Login failed - incorrect credential'})
    else:
        return jsonify({"debug":"get method"})

# auto generate admin user
# @app.route('/check-admin', methods = ["GET", "POST"])
# def check_admin():
#     # initialize database with an admin user
#     admin_name_password = CONNECTION_STRING[CONNECTION_STRING.find('/') + 2: CONNECTION_STRING.find('@')]
#     admin_name, admin_password = admin_name_password.split(':')
#     admin_email = f"{admin_name}@admin.ccessdenied.com"
#     hashed_uid = helper.gen_uid(admin_email)
#
#     admin = db['AdminUser'].find_one({"admin_name": admin_name})
#     # check if admin user exists
#     if admin == None:
#         db['AdminUser'].insert_one(
#             {"uid": hashed_uid, "email": admin_email, "admin_name": "admin", "password": "admin"})
#     db['AdminUser'].update_one({"admin_name": admin_name}, {"$set": {"password": admin_password}})
#
#     return jsonify({"message": f"Database is oversaw by the admin user {admin_name}: {admin_email}",
#                     "code": str(Code.SUCCESS.value)})

@app.route('/register', methods = ["GET", "POST"])
def register():
    if request.method == 'GET':
        return jsonify({"debug": "get method"})
    
    credential_register = request.get_json()

    name = credential_register.get('name')
    if db['CompanyUser'].find_one({"company_name": name}) or db['ProfessionalUser'].find_one({"prof_name": name}) or db['AdminUser'].find_one({"admin_name": name}):
        return jsonify({'message': 'error: user with this name exists', 'code': str(Code.ERROR.value)})
    # check: not empty
    email = credential_register.get('email')
    # to lower case
    email = email.lower()

    # check: not empty
    password = credential_register.get('password')

    # check: not empty
    confirm_password = credential_register.get('confirm_password')

    # check user_type OR use bool? True: company user, False: prof user
    user_type = credential_register.get('user_type')

    check_email_company = db['CompanyUser'].find_one({"email": email})
    check_email_prof = db['ProfessionalUser'].find_one({"email": email})

    if check_email_company or check_email_prof:
        return jsonify({'message': 'error: email exists', 'code': str(Code.ERROR.value)})

    # regex to check email format and password format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'message': 'error: invalid email format', 'code': str(Code.ERROR.value)})

    # if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$", password):
    #     return jsonify({'message': 'error: invalid password format', 'code': str(Code.ERROR.value)})

    # check email doesn't exist
    if password == confirm_password:
        # register successful, insert to DB
        hashed_uid = helper.gen_uid(email)
        if user_type == helper.COMPANY:
            db['CompanyUser'].insert_one({ 'uid' :  hashed_uid, 'email' : email, \
                                          'password': password, \
                                              'company_name': name, 'projects' :[], "user_type": 1})
            # print("insert into CompanyUser")

        # elif user_type == helper.ADMIN:
        #     # check email tail: @admin.ccessdenied.one
        #     if not re.match(r"[^@]+@admin\.accessdenied\.one", email):
        #         return jsonify({'message': 'error: unable to register as admin user', 'code': str(Code.ERROR.value)})
        #
        #     db['AdminUser'].insert_one({'uid': hashed_uid, 'email': email, \
        #                                   'password': password, \
        #                                         'admin_name': name, "user_type": 3})
        #     # print("insert into AdminUser")

        else:
            db['ProfessionalUser'].insert_one({ 'uid' : hashed_uid, 'email' : email, \
                                          'password': password, \
                                              'prof_name': name, 'projects_completed':[], 'projects_applied': [], \
                                                'projects_in_progress': [], 'mark_list': [], "user_type": 2})
            # print("insert into ProfessionalUser")
        return redirect(url_for('homepage'))
    
    elif password != confirm_password:
        return jsonify({'message': 'error: different password', 'code': str(Code.ERROR.value)})
    else:
        # email invalid -> duplicate
        return jsonify({'message': 'username already exists', 'code': str(Code.ERROR.value)})


# log out
@app.route('/logout', methods = ["GET", "POST"])
def logout():
    user_id = request.get_json().get('user_id')
    if user_id in app_session:
        del app_session[user_id]
    return redirect(url_for('homepage'))

###view project
@app.route('/projects', methods=['GET'])
def available_projects():
    projects = db['Project'].find()
    project_list = []
    for project in projects:
        if project["status"] == "open":
            project_info = {
                'project_name': project.get('project_name', ''),
                'company_name': project.get('company_name', ''),
                'start_date': project.get('start_date', ''),
                'description': project.get('description', ''),
                'end_date': project.get('end_date', ''),
                'participants': project.get('participants', '')
                }
            project_list.append(project_info)
    return jsonify(project_list)

### search project by its name
@app.route('/search_projects', methods = ['GET'])
def search_projects():
    search_string = request.args.get('search', '')
    if not search_string:
        return available_projects()
    projects = db['Project'].find({
        'project_name' : {
            '$regex' : search_string,
            '$options' : 'i'
        },
        'status': 'open'
    })
    project_list = []
    for project in projects:
        project_info = {
            'project_name': project.get('project_name', ''),
            'company_name': project.get('company_name', ''),
            'start_date': project.get('start_date', ''),
            'description': project.get('description', ''),
            'end_date': project.get('end_date', ''),
            'status': project.get("status", '')
        }
        project_list.append(project_info)

    return jsonify(project_list)

### Apply for a project
### {"user_id": the id created in homepage}
### find thee project based on project's name
@app.route('/project/apply/<string:project_name>', methods=['GET', 'POST'])
def apply_project(project_name):
    if request.method =="POST":
        user_id = request.get_json().get('user_id') # id of the prof who wants to apply
        
        if user_id == None:
            pass # check
        project = db['Project'].find_one({"project_name": project_name})
        if not project:
            # please REDIRECT to the page of "available projects"
            return jsonify({'message': 'Project not found', "code": str(Code.ERROR.value)})
        else:
            applied_proj_id = project['project_id']
            applied_professionals = project.get('applied_professionals', [])
            
            if user_id in applied_professionals:
                return jsonify({'message': 'You have already applied for this project', "code": str(Code.ERROR.value)})
            else:
                # applied_professionals.append(user_id)
                db['Project'].update_one({"project_name": project_name}, {"$addToSet": {"applied_professionals": user_id}})
                db['ProfessionalUser'].update_one({"uid": user_id}, {"$addToSet": {"projects_applied": applied_proj_id}})

                db['Application'].insert_one({"project_id": applied_proj_id, "user_id": user_id})
                return jsonify({'message': 'Applied successfully', "code": str(Code.SUCCESS.value)})
    # stay in the same page??
    return jsonify({"debug": "get method", 'message': 'please enter some data'})
    
### View applied project
@app.route('/professional/applied_projects', methods=['POST'])
def professional_applied_projects():
    user_id = request.get_json().get('user_id')
    professional = db['ProfessionalUser'].find_one({"uid": user_id})
    a_list=[]
    if not professional:
        jsonify({'message': 'User not found', "code": str(Code.ERROR.value)})
    applied_project_ids = professional.get('projects_applied', [])
    applied_projects = list(db['Project'].find({"project_id": {"$in": applied_project_ids}}))
    for p in applied_projects:
        p['_id'] = str(p['_id'])
    for project in applied_projects:
        project_info = {
                'project_name': project.get('project_name', ''),
                'company_name': project.get('company_name', ''),
                'start_date': project.get('start_date', ''),
                'end_date': project.get('end_date', ''),
                'participants': project.get('participants', ''),
                'status': project.get('status', '')
            }
        a_list.append(project_info)
        
    return jsonify(a_list)

### View completed project
@app.route('/professional/completed_projects', methods=['POST'])
def professional_finished_projects():
    user_id = request.get_json().get('user_id')
    c_project = []
    professional = db['ProfessionalUser'].find_one({"uid": user_id})
    if not professional:
        return jsonify({'message': 'User not found', "code": str(Code.ERROR.value)})
    completed_project_ids = professional.get('projects_completed', [])
    completed_projects = list(db['Project'].find({"project_id": {"$in": completed_project_ids},"status": "completed"}))
    for p in completed_projects:
        p['_id'] = str(p['_id'])
    for project in completed_projects:
        project_info = {
                'project_name': project.get('project_name', ''),
                'project_id':project.get('project_id',''),
                'company_name': project.get('company_name', ''),
                'start_date': project.get('start_date', ''),
                'end_date': project.get('end_date', ''),
                'participants': project.get('participants', ''),
                'status': project.get('status', '')
            }
        c_project.append(project_info)
    
    return jsonify(c_project)

### Show professional user's profile
@app.route('/professional/profile', methods=['POST'])
def professional_profile():
    user_id = request.get_json().get('user_id')
    user = db['ProfessionalUser'].find_one({"uid": user_id})
    if user:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return jsonify(user)
    return jsonify({'message': 'User not found', "code": str(Code.ERROR.value)})

### Edit professional user's profile
@app.route('/professional/profile/edit', methods=['POST'])
def edit_professional_profile():
    user_data = request.get_json()
    user_id = request.get_json().get('user_id')
    if not user_id:
        return jsonify({'message': 'User not found', "code": str(Code.ERROR.value)})
    updated_data = user_data.get('updated_data', {})
    db['ProfessionalUser'].update_one({"uid": user_id}, {"$set": updated_data})
    return jsonify({'message': 'Profile updated successfully', "code": str(Code.SUCCESS.value)})

### ProfessionalUser rate project
@app.route('/professional-rate-project', methods = [ "POST"])
def rate_project():
    rate_info = request.get_json()
    project_id = rate_info.get('project_id')
    user_id = rate_info.get('user_id')
    rating = rate_info.get('rating')
    project = db['Project'].find_one({"project_id": project_id})
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    if user_id not in  project['approved_professionals']:
        return jsonify({'message': 'You need to be in the project'}), 404
    if not isinstance(rating, int) or not 0 <= rating <= 10:
        return jsonify({'message': 'Invalid rating. Must be an integer between 0 and 10.'}), 400
    if 'mark_list' not in project:
        project['mark_list'] = {}
    if not isinstance(project['mark_list'],dict):
        project['mark_list'] = {}
    project['mark_list'][str(user_id)] = int(rating)

    db['Project'].update_one({"project_id": project_id}, {"$set": {"mark_list": project['mark_list']}})
    return jsonify({'message': 'Project rated successful', "code": str(Code.SUCCESS.value)})




##################################
###########COMPANY USER###########
##################################
# Create a new project
@app.route('/company-create-project', methods = ["GET", "POST"])
def create_project():
    """create an empty project by a company user"""
    request_info = request.get_json()
    company_uid = request_info.get('user_id')
    company_user = db['CompanyUser'].find_one({"uid": company_uid})

    if company_user == None:
        return jsonify({"code": str(Code.ERROR.value), "message": "company user not existing!"})
    
    project_name = request_info.get('project_name')
    if db['Project'].find_one({'project_name': project_name}):
        return jsonify({'message': 'project with this name already exists', 'code': str(Code.ERROR.value)})

    project_id = helper.gen_uid(project_name)

    start_date = request_info.get('start_date')
    end_date = request_info.get('end_date')
    description = request_info.get('description')

    # if project already exists or end_date < start_date or start_date < today
    if db['Project'].find_one({'project_id': project_id}) != None:
        return jsonify({'message': 'project already exists', 'code': str(Code.ERROR.value)})
    if end_date < start_date:
        return jsonify({'message': 'end_date < start_date', 'code': str(Code.ERROR.value)})

    tdy = time.localtime()
    # format of date: yyyymmdd
    dateOftdy = time.strftime("%Y%m%d", tdy)
    if start_date < dateOftdy:
        return jsonify({'message': 'start_date < today','code': str(Code.ERROR.value)})

    # update the new project to the company user and the project collection
    db['Project'].insert_one({'project_id': project_id, 'project_name': project_name, 'company_name': company_user['company_name'],
                              'start_date': start_date, 'end_date': end_date, 'status': str(Status.OPEN.value),
                              'description': description,
                              'applied_professionals': [],
                              'approved_professionals': [],
                              'mark_list': [],
                              })
    
    # get company user by token
    # company_user['projects'].append(project_id)
    # add the new project_id into the company user's project list
    curProj = list(company_user.get('projects'))
    curProj.append(project_id)
    db['CompanyUser'].update_one({'uid': company_uid}, {"$set": {"projects": curProj}})

    return jsonify({'message': f'project {project_name} created', 'company_uid': company_user['uid'],
                    'project_name': project_name, 'code': str(Code.SUCCESS.value)})

# view_projects, returns ALL project by the company
@app.route('/company-view-project', methods = ["POST"])
def view_projects():
    """view all projects associated with the company"""
    company_info = request.get_json()
    company_name = company_info.get('company_name')
    company_user = db['CompanyUser'].find_one({"company_name": company_name})
    if not company_user:
        return jsonify({"code": str(Code.ERROR.value), "message": "company user not existing!"})
    projects = company_user['projects']
    res = []

    # project_name, project_id, start_date, end_date
    for each_project in projects:
        db_project = db['Project'].find_one({"project_id": each_project})
        if db_project == None:
            db['CompanyUser'].update_one({'uid': company_user['uid']}, {"$pull": {"projects": each_project}})
            continue
        res.append({'projectName': db_project['project_name']
                    , 'startDate': db_project['start_date']
                    , 'endDate': db_project['end_date']
                    , 'Status': db_project['status']
                    , 'Description':db_project['description']
                    , 'projectID': db_project['project_id']})

    return jsonify({'code': str(Code.SUCCESS.value), 'message': 'success-view-projects', 'projects': res})

@app.route('/company-edit-profile', methods = ["PUT"])
def edit_company_info():
    """edit company info"""
    company_info = request.get_json()
    user_id = company_info.get('user_id')
    if user_id == None:
        return jsonify({'message': 'company id invalid', 'code': str(Code.ERROR.value)})

    #company_name = company_info.get('company_name')
    email = company_info.get('email')
    password = company_info.get('password')
    # update the new project to the company user and the project collection

    db['CompanyUser'].update_one(
        {'uid': user_id},
        {"$set": {'email': email, 'password': password, }})

    return jsonify({'message': f'{email} info edited', 'code': str(Code.SUCCESS.value)})

# view one company profile
@app.route('/company-view-profile/<int:company_id>', methods = ["GET"])
def view_company_profile(company_id):
    """view a company profile"""
    company = db['CompanyUser'].find_one({'uid': company_id})
    if company == None:
        return jsonify({'message': 'company not found', 'code': str(Code.ERROR.value)})
    company_info = {
        'company_name': company.get('company_name'),
        'email': company.get('email'),
        # 'password': company.get('password'),
        'projects': company.get('projects'),
    }
    return jsonify({'message': 'success-view-company-profile', 'company': company_info, 'code': str(Code.SUCCESS.value)})

# approve_professional
@app.route('/company-approve-professional', methods = ["POST", "GET"])
def approve_professional():
    """approve a professional user to join a project"""
    if request.method == 'POST':
        approve_info = request.get_json()
        user_id = approve_info.get('user_id')   # company user
        prof_id = approve_info.get('prof_id')   # professional user
        project_id = approve_info.get('project_id')     # project id

        profUser = db['ProfessionalUser'].find_one({"uid": prof_id})
        project = db['Project'].find_one({"project_id": int(project_id)})
        if project == None:
            return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
        
        # 'approved_professionals'
        curParticipants = list(project['approved_professionals'])

        if prof_id in curParticipants:
            return jsonify({'message': 'professional already approved', 'code': str(Code.SUCCESS.value)})
        if not profUser:
            return jsonify({'message': 'professional not found', 'code': str(Code.ERROR.value)})
        
        # if project_id in profUser['projects_in_progress']:
        #     return jsonify({'message': 'professional already in progress', 'code': str(Code.SUCCESS.value)})
        if project_id in profUser['projects_completed']:
            return jsonify({'message': 'professional already completed', 'code': str(Code.SUCCESS.value)})
        
        if project_id not in profUser['projects_applied']:
            return jsonify({'message': 'professional not applied', 'code': str(Code.ERROR.value)})
        if prof_id not in project['applied_professionals']:
            return jsonify({'message': 'professional not applied', 'code': str(Code.ERROR.value)})


        curParticipants.append(prof_id)

        projCurApply = set(list(project['applied_professionals']))
        projCurApply.remove(prof_id)
        projCurApply = list(projCurApply)

        # curProjects = set(list(profUser['projects_in_progress']))
        # curProjects.add(project_id)
        # curProjects = list(curProjects)

        curApplied = set(list(profUser['projects_applied']))
        curApplied.remove(project_id)
        curApplied = list(curApplied)

        db['Project'].update_one({"project_id": project_id}, {"$set": {"approved_professionals": curParticipants}})
        db['Project'].update_one({"project_id": project_id}, {"$set": {"applied_professionals": projCurApply}})
        # db['ProfessionalUser'].update_one({"uid": prof_id}, {"$set": {"projects_in_progress": curProjects}})
        db['ProfessionalUser'].update_one({"uid": prof_id}, {"$set": {"projects_applied": curApplied}})
        db['Application'].delete_one({"project_id": project_id, "user_id": user_id})

        current_time = datetime.now()
        iso_time_stamp = str(current_time.isoformat())  # Convert to ISO 8601 format, 2023-11-06T12:34:56.789000
        project_name = project['project_name']
        db['Message'].insert_one({"sender": user_id, "recipient": prof_id, "timestamp": iso_time_stamp,
                                  "message": f"Congratulations, your application for project {project_name} has been accepted"})

        return jsonify({'message': f'professional {prof_id} for project {project_id} approved',
                        'code': str(Code.SUCCESS.value)})

    return jsonify({'debug': 'get method'})

# view one project's all details
@app.route('/company-view-project/<int:project_id>', methods = ["GET"])
def view_project_detail(project_id):
    """view a project associated with the company"""
    project = db['Project'].find_one({'project_id': project_id})
    if project == None:
        return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
    project_info = {
        'project_name': project.get('project_name', ''),
        'project_id':project.get('project_id',''),
        'company_name': project.get('company_name', ''),
        'start_date': project.get('start_date', ''),

        'end_date': project.get('end_date', ''),
        'description': project.get('description', ''),
        'approved_professionals': project.get('approved_professionals', ''),
        'applied_professionals': project.get('applied_professionals', ''),
        'mark_list':project.get('mark_list','')
    }
    return jsonify({'project': project_info
                    , 'code': str(Code.SUCCESS.value)})

# company_reject_professional
@app.route('/company-reject-professional', methods = ["PUT"])
def company_reject_professional():
    reject_info = request.get_json()
    user_id = reject_info.get('user_id')  # company user
    prof_id = reject_info.get('prof_id')  # professional user
    project_id = reject_info.get('project_id')  # project id

    profUser = db['ProfessionalUser'].find_one({"uid": int(prof_id)})
    project = db['Project'].find_one({"project_id": int(project_id)})
    application = db['Application'].find_one({"project_id": int(project_id), "user_id": int(prof_id)})

    if profUser == None:
        return jsonify({'message': f'professional {prof_id} not found', 'code': str(Code.ERROR.value)})
    if project == None:
        return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
    if application == None:
        return jsonify({'message': 'professional not applied', 'code': str(Code.ERROR.value)})

    if project_id not in profUser['projects_applied']:
        return jsonify({'message': 'professional not applied', 'code': str(Code.ERROR.value)})
    if prof_id not in project['applied_professionals']:
        return jsonify({'message': 'professional not applied', 'code': str(Code.ERROR.value)})

    curApplied = list(profUser['projects_applied'])
    curApplied.remove(project_id)
    curApply = list(project['applied_professionals'])
    curApply.remove(prof_id)
    db['ProfessionalUser'].update_one({"uid": prof_id}, {"$set": {"projects_applied": curApplied}})
    db['Project'].update_one({"project_id": project_id}, {"$set": {"applied_professionals": curApply}})
    db['Application'].delete_one({"project_id": project_id, "user_id": prof_id})

    current_time = datetime.now()
    iso_time_stamp = str(current_time.isoformat())  # Convert to ISO 8601 format, 2023-11-06T12:34:56.789000
    project_name = project['project_name']
    db['Message'].insert_one({"sender": user_id, "recipient": prof_id, "timestamp": iso_time_stamp,
                              "message": f"Sorry, your application for project {project_name} has been rejected"})
    return jsonify({'message': f'professional {prof_id} rejected', 'code': str(Code.SUCCESS.value)})


# company_rate_profeesional
@app.route('/company-rate-professional', methods = ["POST"])
def company_rate_professional():
    """rate a professional based on their contribution to a project"""
    rate_info = request.get_json()

    project_id = rate_info.get('project_id')
    user_id = rate_info.get('user_id')  # company user
    prof_id = rate_info.get('prof_id')  # professional user
    rating = rate_info.get('rating')
    rating = int(rating)
    if rating < 1 or rating > 10:
        return jsonify({'message': 'rating should be an integer between 1 and 10', 'code': str(Code.ERROR.value)})

    project = db['Project'].find_one({"project_id": int(project_id)})
    user_company_name = db['CompanyUser'].find_one({'uid': user_id})['company_name']
    profUser = db['ProfessionalUser'].find_one({"uid": prof_id})

    if project == None:
        return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
    if user_company_name != project['company_name']:
        return jsonify({'message': 'user not authorized', 'code': str(Code.ERROR.value)})
    if profUser == None:
        return jsonify({'message': 'professional not found', 'code': str(Code.ERROR.value)})
    if prof_id not in project['approved_professionals']:
        return jsonify({'message': 'professional not approved', 'code': str(Code.ERROR.value)})
    # if project_id not in profUser['projects_in_progress'] or project_id not in profUser['projects_completed']:
    #     return jsonify({'message': 'professional not in progress', 'code': str(Code.ERROR.value)})

    # 'mark_list'
    prof_marklist_updated = dict(profUser['mark_list']) if profUser['mark_list'] else dict()
    prof_marklist_updated[str(project_id)] = rating
    db['ProfessionalUser'].update_one({"uid": prof_id}, {"$set": {"mark_list": prof_marklist_updated}})

    # return project_name，status，prof_id，project_id
    project_name = project['project_name']
    project_status = project['status']
    db['Message'].insert_one({"sender": user_id, "recipient": prof_id, "timestamp": str(datetime.now().isoformat()),
                              "message": f"Your rating for project {project_name} has been updated to {rating}"})
    return jsonify({
        'message': f'Professional {prof_id} for project {project_id} has been rated',
        'code': str(Code.SUCCESS.value),
    })


# edit_project_info
@app.route('/company-edit-project/<int:project_id>', methods = ["PUT"])
def edit_project_info(project_id):
    project = db['Project'].find_one({"project_id": project_id})
    if project == None:
        return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
    project_info = request.get_json()

    project_name = project_info.get('project_name')
    start_date = project_info.get('start_date')
    end_date = project_info.get('end_date')
    description = project_info.get('description')

    # if project already exists or end_date < start_date or start_date < today
    if end_date < start_date:
        return jsonify({'message': 'end_date < start_date', 'code': str(Code.ERROR.value)})
    project['project_name'] = project_name
    project['start_date'] = start_date
    project['end_date'] = end_date
    project['description'] = description
    # db['Project'].update_one({"project_id": project_id}, {"$set": {"project_name": project_name}})
    # db['Project'].update_one({"project_id": project_id}, {"$set": {"start_date": start_date}})
    # db['Project'].update_one({"project_id": project_id}, {"$set": {"end_date": end_date}})
    # db['Project'].update_one({"project_id": project_id}, {"$set": {"description": description}})
    db['Project'].update_one({"project_id": project_id}, {"$set": {"project_name": project_name,
                                                                   "start_date": start_date,
                                                                   "end_date": end_date,
                                                                   "description": description}})

    return jsonify({'message': f'project {project_name} info edited','code': str(Code.SUCCESS.value)})


# rate_professional
# @app.route('/company-rate-professional', methods = [ "POST"])
# def rate_professional():
#     """rate a professional based on their contribution to a project"""
#     rate_info = request.get_json()
#     project_id = rate_info.get('project_id')
#     user_id = rate_info.get('user_id')
#     rating = rate_info.get('rating')
#     project = db['Project'].find_one({"project_id": int(project_id)})
#
#     if project == None:
#         return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
#
#     proj_marklist_updated = list(project["mark_list"])
#     # print(type(proj_marklist_updated))
#
#     proj_marklist_updated.append((user_id, rating))
#     # print(proj_marklist_updated)
#     db['ProfessionalUser'].update_one({"project_id": project_id}, {"$set": {"mark_list": proj_marklist_updated}})
#     return jsonify({'message': 'professional rated'})


# {'project_id': the id of project that the company mark finished}
# @app.route('/company-mark-progress', methods = ["POST"])
# def mark_project_completed():
#     req_body = request.get_json()
#     project_id = req_body.get('project_id')
#     project = db['Project'].find_one({"project_id": int(project_id)})
#     if project == None:
#         return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
#     # company_user_id = req_body.get('uid')
#     # change the status
#     db['Project'].update_one({"project_id": project_id}, {"$set": {"status":  "completed"}})
#
#     prof_in_project = project['approved_professionals']
#     for each_prof in prof_in_project:
#         # str
#         prof = db['ProfessionalUser'].find_one({"uid": int(each_prof)})
#         print(f"prof is = {prof}")
#
#         if prof:
#             # add project id to completed
#             completed_project_prof = list(prof['projects_completed'])
#             completed_project_prof.append(project)
#             db['ProfessionalUser'].update_one({"uid": each_prof}, {"$set": {"projects_completed": completed_project_prof}})
#
#         else:
#             return jsonify({"message": 'prof not found', 'code': str(Code.ERROR.value)})
#
#     return jsonify({'message': 'project marked', 'code': str(Code.SUCCESS.value)})

# complete project
@app.route('/company-change_project_status/<int:project_id>', methods = ["PUT"])
def change_project_status(project_id):
    """view a project associated with the company"""
    # once the project is set to completed, all professionals in the project will be set to completed

    user_id = request.get_json().get('user_id')
    new_status = request.get_json().get('new_status')
    project = db['Project'].find_one({'project_id': project_id})

    user_company_name = db['CompanyUser'].find_one({'uid': user_id})['company_name']
    if project == None:
        return jsonify({'message': f"project {project_id} not exist", 'code': str(Code.ERROR.value)})
    if user_company_name != project['company_name']:
        return jsonify({'message': 'user not authorized', 'code': str(Code.ERROR.value)})
    if not any(new_status == status.value for status in Status):
        return jsonify({'message': 'invalid status type', 'code': str(Code.ERROR.value)})
    if project['status'] == new_status:
        return jsonify({'message': 'status not changed', 'code': str(Code.SUCCESS.value)})

    project['status'] = new_status
    db['Project'].update_one({'project_id': project_id}, {"$set": {"status": new_status}})
    prof_in_project = list(project['approved_professionals'])
    # filter out the professionals that are not in the database
    prof_in_project = [each_prof for each_prof in prof_in_project if db['ProfessionalUser'].find_one({"uid": int(each_prof)})]

    if not prof_in_project:
        prof_in_project = []

    if new_status == 'completed':
        for each_prof in prof_in_project:
            # str
            prof = db['ProfessionalUser'].find_one({"uid": int(each_prof)})

            if prof:
                # add project id to completed
                completed_project_prof = list(prof['projects_completed'])
                completed_project_prof.append(project_id)
                in_progress = list(prof['projects_in_progress'])
                if project_id in in_progress:
                    in_progress.remove(project_id)
                # try:
                #     in_progress.remove(project_id)
                # except ValueError:
                #     print(
                #         f"Project ID {project_id} was not in the list of projects in progress for professional {each_prof}")
                db['ProfessionalUser'].update_one({"uid": int(each_prof)},
                                                  {"$set": {"projects_completed": completed_project_prof,
                                                            "projects_in_progress": in_progress
                                                            }
                                                   })


    db['Project'].update_one({'project_id': project_id}, {"$set": {"approved_professionals": prof_in_project}})

    return jsonify({'message': 'project completed', 'code': str(Code.SUCCESS.value)})


# company view all applicants of a project
@app.route('/view-applicants/<proj_name>', methods=['POST'])
def view_applicants(proj_name):
    proj_name = str(proj_name)
    print(f"DEBUG: project_name = {proj_name}")
    proj = db["Project"].find_one({"project_name": proj_name})
    if proj:
        applied_profs = list(proj['applied_professionals'])
        result = []
        for each_id in applied_profs:
            prof_user = db["ProfessionalUser"].find_one({"uid": each_id})
            if prof_user:
                result.append(prof_user['prof_name'])

        return jsonify({'result': result, 'code': str(Code.SUCCESS.value)})

    else:
        return jsonify({'message': f'project {proj_name} not exists', 'code': str(Code.ERROR.value)})


# message view system
@app.route('/send-message', methods = ["POST"])
def send_message():
    """send message to another user"""
    # enable a button to leave a message in another user's profile
    message_info = request.get_json()
    sender_id = message_info.get('sender_id')   # current login user
    recipient_id = message_info.get('recipient_id')  # the user who will receive the message
    message = message_info.get('message').strip()   # the message content

    current_time = datetime.now()
    iso_time_stamp = str(current_time.isoformat())  # Convert to ISO 8601 format, 2023-11-06T12:34:56.789000

    if message == '':
        return jsonify({'message': 'message cannot be empty', 'code': str(Code.ERROR.value)})
    # if sender_id or recipient_id is invalid
    if not sender_id:
        return jsonify({'message': 'sender_id invalid', 'code': str(Code.ERROR.value)})
    if not recipient_id:
        return jsonify({'message': 'recipient_id invalid', 'code': str(Code.ERROR.value)})
    if sender_id == recipient_id:
        return jsonify({'message': 'sender_id is equal to receiver_id', 'code': str(Code.ERROR.value)})

    # check if the sender_id is valid
    sender = db['CompanyUser'].find_one({"uid": sender_id})
    if not sender:
        sender = db['ProfessionalUser'].find_one({"uid": sender_id})
        if not sender:
            sender = db['AdminUser'].find_one({"uid": sender_id})
            if not sender:
                return jsonify({'message': 'sender not found', 'code': str(Code.ERROR.value)})
    # check if the recipient_id is valid
    recipient = db['CompanyUser'].find_one({"uid": recipient_id})
    if not recipient:
        recipient = db['ProfessionalUser'].find_one({"uid": recipient_id})
        if not recipient:
            recipient = db['AdminUser'].find_one({"uid": recipient_id})
            if not recipient:
                return jsonify({'message': 'recipient not found', 'code': str(Code.ERROR.value)})
    # submit the message to the database
    db['Message'].insert_one({'sender': sender_id,
                              'recipient': recipient_id,
                              'timestamp': iso_time_stamp,
                              'message': message
                              })

    return jsonify({'message': 'message sent', 'code': str(Code.SUCCESS.value)})

@app.route('/view-message/<int:user_id>', methods = ["GET"])
def view_message(user_id):
    """view all messages that the user has received and sent"""
    all_messages_received = db['Message'].find({"recipient": user_id})
    received = []
    for each_message in all_messages_received:
        mess = {'sender': each_message['sender'],
                'timestamp': each_message['timestamp'],
                'message': each_message['message']
                }
        received.append(mess)
    received.sort(key=lambda x: x['timestamp'], reverse=True)

    all_messages_sent = db['Message'].find({"sender": user_id})
    sent = []
    for each_message in all_messages_sent:
        mess = {'recipient': each_message['recipient'],
                'timestamp': each_message['timestamp'],
                'message': each_message['message']
                }
        sent.append(mess)
    sent.sort(key=lambda x: x['timestamp'], reverse=True)

    res = {'received': received, 'sent': sent}
    return jsonify({'message': 'success-view-message', 'messages': res})


@app.route('/view-profile-by-name', methods = ["POST"])
def view_profile_by_name():
    """view a user profile by name"""
    info = request.get_json()
    user_name = info.get('user_name')
    user = db['CompanyUser'].find_one({'company_name': user_name})
    if not user:
        user = db['ProfessionalUser'].find_one({'prof_name': user_name})
        if not user:
            return jsonify({'message': 'user not found', 'code': str(Code.ERROR.value)})
        else:
            user_info = {
                'uid': user.get('uid', ''),
                'email': user.get('email', ''),
                'user_name': user.get('prof_name', ''),
            }
            return jsonify({'message': 'success-view-user-profile', 'user': user_info, 'code': str(Code.SUCCESS.value)})
    else:
        user_info = {
            'uid': user.get('uid', ''),
            'email': user.get('email', ''),
            'user_name': user.get('company_name', ''),
        }
        return jsonify({'message': 'success-view-user-profile', 'user': user_info, 'code': str(Code.SUCCESS.value)})


"""ADMIN USER API"""
# admin view all company users
@app.route('/admin-view-company-users', methods = ["GET"])
def admin_view_company_users():
    """view all company users"""
    all_company_users = db['CompanyUser'].find()
    res = []
    for each_user in all_company_users:
        res.append({'uid': each_user['uid'],
                    'email': each_user['email'],
                    'company_name': each_user['company_name'],
                    'projects': each_user['projects'],
                    })
    return jsonify({'message': 'success-view-company-users', 'users': res, 'code': str(Code.SUCCESS.value)})

@app.route('/admin-view-professional-users', methods = ["GET"])
def admin_view_professional_users():
    """view all professional users"""
    all_professional_users = db['ProfessionalUser'].find()
    res = []
    for each_user in all_professional_users:
        res.append({'uid': each_user['uid'],
                    'email': each_user['email'],
                    'prof_name': each_user['prof_name'],
                    'projects_applied': each_user['projects_applied'],
                    'projects_in_progress': each_user['projects_in_progress'],
                    'projects_completed': each_user['projects_completed'],
                    'mark_list': each_user['mark_list'],
                    })
    return jsonify({'message': 'success-view-professional-users', 'users': res, 'code': str(Code.SUCCESS.value)})


@app.route('/admin-view-projects', methods=["GET"])
def admin_view_projects():
    """view all projects"""
    all_projects = db['Project'].find({})  # Empty query to signify no filter

    res = []
    for each_project in all_projects:
        each_dict = {'project_id': each_project['project_id'],
                     'project_name': each_project['project_name'],
                     'company_name': each_project['company_name'],
                     'start_date': each_project['start_date'],
                     'end_date': each_project['end_date'],
                     'status': each_project['status'],
                     'description': each_project['description'],
                     'applied_professionals': each_project['applied_professionals'],
                     'approved_professionals': each_project['approved_professionals'],
                     'mark_list': each_project['mark_list'],
                     }
        res.append(each_dict)

    return jsonify({'message': 'success-view-projects', 'projects': res, 'code': str(Code.SUCCESS.value)})


# admin view all messages
@app.route('/admin-view-messages', methods = ["GET"])
def admin_view_messages():
    """view all messages"""
    all_messages = db['Message'].find()
    res = []
    for each_message in all_messages:
        res.append({'sender': each_message['sender'],
                    'recipient': each_message['recipient'],
                    'timestamp': each_message['timestamp'],
                    'message': each_message['message'],
                    })
    return jsonify({'message': 'success-view-messages', 'messages': res, 'code': str(Code.SUCCESS.value)})

# admin view all applications
@app.route('/admin-view-applications', methods = ["GET"])
def admin_view_applications():
    """view all applications"""
    all_applications = db['Application'].find()
    res = []
    for each_application in all_applications:
        res.append({'user_id': each_application['user_id'],
                    'project_id': each_application['project_id'],
                    # 'timestamp': each_application['timestamp'],
                    })
    return jsonify({'message': 'success-view-applications', 'applications': res, 'code': str(Code.SUCCESS.value)})


"""enable admin to search by name"""
# admin view one user profile
@app.route('/admin-view-user-profile', methods = ["POST"])
def admin_view_user_profile():
    user_name = request.get_json().get('user_name')
    user = db['CompanyUser'].find_one({'company_name': user_name})
    if not user:
        user = db['ProfessionalUser'].find_one({'prof_name': user_name})
        if not user:
            return jsonify({'message': 'user not found', 'code': str(Code.ERROR.value)})
        else:
            user_info = {
                'uid': user.get('uid', ''),
                'email': user.get('email', ''),
                'prof_name': user.get('prof_name', ''),
                'projects_applied': user.get('projects_applied', ''),
                'projects_in_progress': user.get('projects_in_progress', ''),
                'projects_completed': user.get('projects_completed', ''),
                'mark_list': user.get('mark_list', ''),
                'user_type': 2,
            }
            return jsonify({'message': 'success-view-user-profile', 'user': user_info, 'code': str(Code.SUCCESS.value)})
    else:
        user_info = {
            'uid': user.get('uid', ''),
            'email': user.get('email', ''),
            'company_name': user.get('company_name', ''),
            'projects': user.get('projects', ''),
            'user_type': 1,
        }
        return jsonify({'message': 'success-view-user-profile', 'user': user_info, 'code': str(Code.SUCCESS.value)})

@app.route('/admin-view-project', methods = ["POST"])
def admin_view_project_detail():
    project_name = request.get_json().get('project_name')
    project = db['Project'].find_one({'project_name': project_name})
    if not project:
        return jsonify({'message': 'project not found', 'code': str(Code.ERROR.value)})
    else:
        project_info = {
            'project_id': project.get('project_id', ''),
            'project_name': project.get('project_name', ''),
            'company_name': project.get('company_name', ''),
            'start_date': project.get('start_date', ''),
            'end_date': project.get('end_date', ''),
            'status': project.get('status', ''),
            'description': project.get('description', ''),
            'applied_professionals': project.get('applied_professionals', ''),
            'approved_professionals': project.get('approved_professionals', ''),
            'mark_list': project.get('mark_list', ''),
        }
        return jsonify({'message': 'success-view-project', 'project': project_info, 'code': str(Code.SUCCESS.value)})

# admin view messages between two users
@app.route('/admin-view-messages-between-two-users', methods = ["POST"])
def admin_view_messages_between_two_users():
    """view all messages between two users"""
    info = request.get_json()
    user1_name = info.get('user1_name')
    user2_name = info.get('user2_name')
    user1 = db['CompanyUser'].find_one({'company_name': user1_name})
    if not user1:
        user1 = db['ProfessionalUser'].find_one({'prof_name': user1_name})
        if not user1:
            user1 = db['AdminUser'].find_one({'admin_name': user1_name})
            if not user1:
                return jsonify({'message': 'user1 not found', 'code': str(Code.ERROR.value)})
    user2 = db['CompanyUser'].find_one({'company_name': user2_name})
    if not user2:
        user2 = db['ProfessionalUser'].find_one({'prof_name': user2_name})
        if not user2:
            user2 = db['AdminUser'].find_one({'admin_name': user2_name})
            if not user2:
                return jsonify({'message': 'user2 not found', 'code': str(Code.ERROR.value)})
    all_messages = db['Message'].find({"$or": [{"sender": user1['uid'], "recipient": user2['uid']},
                                                {"sender": user2['uid'], "recipient": user1['uid']}]})

    res = []
    for each_message in all_messages:
        res.append({'sender': each_message['sender'],
                    'recipient': each_message['recipient'],
                    'timestamp': each_message['timestamp'],
                    'message': each_message['message'],
                    })
    res.sort(key=lambda x: x['timestamp'], reverse=True)
    return jsonify({'message': 'success-view-messages', 'messages': res, 'code': str(Code.SUCCESS.value)})

# admin send message to all users
@app.route('/admin-send-message-to-all-users', methods = ["POST"])
def admin_send_message_to_all_users():
    """send message to all users"""
    message_info = request.get_json()
    sender_id = message_info.get('user_id')   # current login user
    message = message_info.get('message').strip()

    if not db['AdminUser'].find_one({"uid": int(sender_id)}):   # check if the sender_id is valid
        return jsonify({'message': 'sender_id invalid', 'code': str(Code.ERROR.value)})
    if message == '':
        return jsonify({'message': 'message cannot be empty', 'code': str(Code.ERROR.value)})
    # submit the message to the database
    time_now = str(datetime.now().isoformat())

    all_users = db['CompanyUser'].find()
    for each_user in all_users:
        db['Message'].insert_one({'sender': sender_id,
                                  'recipient': each_user['uid'],
                                  'timestamp': time_now,
                                  'message': message
                                  })

    all_users = db['ProfessionalUser'].find()
    for each_user in all_users:
        db['Message'].insert_one({'sender': sender_id,
                                  'recipient': each_user['uid'],
                                  'timestamp': time_now,
                                  'message': message
                                  })

    return jsonify({'message': 'message sent to all users', 'code': str(Code.SUCCESS.value)})

if __name__ == '__main__':
    if db != None:
        print("db exists")

    app.run(debug=True)
