from flask_login import LoginManager, UserMixin, login_user, current_user, login_required, logout_user

PRIME = 6113
class ProfessionalUser:
    def __init__(self, name, email, password, projects_completed = [],\
                  projects_applied = [], projects_in_progress = []):
        
        self.id = hash(email) % PRIME
        self.prof_name = name
        self.email = email                 # Email for the company's account
        self.password = password           # Encrypted password for security (consider hashing)
        self.projects_completed = projects_completed         # List of projects associated with the company
        self.projects_applied = projects_applied
        self.projects_in_progress = projects_in_progress

    
    def get_userID(self):
        return self.id


    # Additional methods can be added as needed for more functionalities.

# *******************

# class User(UserMixin):
#     '''
#     admin: user_type = 0
#     Company: user_type = 1
#     professional: user_type = 2
#     '''
#     def __init__(self, email, password, user_type,):
#         self.uid = hash(email)
#         self.email = email
#         self.password = password
#         self.user_type = user_type
#         self.avg_mark = 0

#     def get_id(self):
#         return self.email

#     def get_user_type(self):
#         return self.user_type
    
#     def to_dict(self):
#         return {
#             "uid": self.uid,
#             "email": self.email,
#             "password": self.password,  
#             # It's crucial to hash and salt passwords before saving. Never save plain-text passwords.
#             "user_type": self.user_type,
#             "avg_mark": self.avg_mark
#         }